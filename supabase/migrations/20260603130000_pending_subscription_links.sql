-- Pending subscription links + safe auto-linking on verified signup.
--
-- WHY: The Stripe webhook handler (api/webhooks/stripe.ts) stashes subscriptions
-- for customers who pay BEFORE creating a Conform account into
-- public.pending_subscription_links. That table did not exist in production, so
-- every account-less checkout was silently dropped (the handler logged the error
-- and still returned 200). This migration creates the table and a trigger that
-- attaches a pending subscription to the user once they sign up with a VERIFIED
-- email.
--
-- DEPLOY NOTE: the base table (without linked_at/linked_user_id) is ALREADY live
-- in production (hand-created 2026-06-03). This migration is written to be
-- idempotent so it brings any environment to the full desired state: it adds the
-- soft-delete columns + the trigger. Validate in a staging/branch DB before
-- `supabase db push` to production.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.pending_subscription_links (
  id                     uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email                  text NOT NULL,
  stripe_subscription_id text NOT NULL UNIQUE,
  stripe_customer_id     text,
  stripe_price_id        text,
  status                 text,
  current_period_start   timestamptz,
  current_period_ends_at timestamptz,
  cancel_at_period_end   boolean DEFAULT false,
  trial_start            timestamptz,
  trial_end              timestamptz,
  created_at             timestamptz DEFAULT now(),
  updated_at             timestamptz DEFAULT now()
);

-- Soft-delete bookkeeping: a pending row is marked linked (not hard-deleted) so a
-- row inserted concurrently by the webhook is never dropped before it is promoted.
ALTER TABLE public.pending_subscription_links
  ADD COLUMN IF NOT EXISTS linked_at      timestamptz,
  ADD COLUMN IF NOT EXISTS linked_user_id uuid;

-- Only the service role (webhook) and the SECURITY DEFINER trigger touch this
-- table; RLS on with no policies keeps it inaccessible to anon/authenticated.
ALTER TABLE public.pending_subscription_links ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_pending_sub_links_unlinked_email
  ON public.pending_subscription_links (lower(btrim(email)))
  WHERE linked_at IS NULL;

-- Attach any subscription the user paid for before signing up.
--
-- SAFETY PROPERTIES (each addresses a flaw found in adversarial review):
--   * Exception-guarded: a failure here can NEVER abort the auth.users write,
--     so a billing-link problem cannot break signup / email confirmation.
--   * Gated on a VERIFIED email (email_confirmed_at): an unverified signup cannot
--     claim someone else's pending subscription by reusing their email.
--   * ON CONFLICT (stripe_subscription_id) DO NOTHING: never reassigns an
--     already-owned subscription to a different user (no email-collision takeover).
--   * Soft-delete via linked_at instead of DELETE: concurrent unprocessed rows
--     are preserved.
--   * btrim(lower(email)) matching tolerates case/whitespace differences between
--     Stripe and Supabase.
CREATE OR REPLACE FUNCTION public.link_pending_subscriptions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
BEGIN
  -- Act only once the email is verified...
  IF NEW.email_confirmed_at IS NULL THEN
    RETURN NEW;
  END IF;
  -- ...and only on the unverified -> verified transition (avoid re-running on
  -- every subsequent auth.users update).
  IF TG_OP = 'UPDATE' AND OLD.email_confirmed_at IS NOT NULL THEN
    RETURN NEW;
  END IF;

  v_email := lower(btrim(NEW.email));
  IF v_email IS NULL OR v_email = '' THEN
    RETURN NEW;
  END IF;

  -- Promote each unlinked pending subscription to a real subscriptions row.
  -- DO NOTHING protects any pre-existing (possibly other-user) subscription.
  INSERT INTO public.subscriptions (
    user_id, stripe_subscription_id, stripe_customer_id, stripe_price_id,
    status, current_period_start, current_period_ends_at, cancel_at_period_end,
    trial_start, trial_end)
  SELECT NEW.id, p.stripe_subscription_id, p.stripe_customer_id, p.stripe_price_id,
         p.status, p.current_period_start, p.current_period_ends_at,
         p.cancel_at_period_end, p.trial_start, p.trial_end
  FROM public.pending_subscription_links p
  WHERE lower(btrim(p.email)) = v_email
    AND p.linked_at IS NULL
  ON CONFLICT (stripe_subscription_id) DO NOTHING;

  -- Mark consumed rows linked (soft-delete). A row inserted after this statement
  -- keeps linked_at IS NULL and is handled on the next confirmation event.
  UPDATE public.pending_subscription_links
  SET linked_at = now(), linked_user_id = NEW.id, updated_at = now()
  WHERE lower(btrim(email)) = v_email
    AND linked_at IS NULL;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Best-effort: log and continue; never roll back the auth transaction.
  RAISE WARNING 'link_pending_subscriptions failed for %: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$$;

-- Fires on auth.users for both immediate-confirm (INSERT, e.g. OAuth) and
-- later-confirm (UPDATE OF email_confirmed_at) flows.
-- NOTE ON ORDERING: subscriptions.user_id references profiles(id), and the
-- profile is created by trigger on_auth_user_created (AFTER INSERT on auth.users).
-- Postgres fires per-table triggers in ascending name order, so this trigger is
-- named to sort AFTER 'on_auth_user_created' (…_created < …_link_pending_subs),
-- guaranteeing the profile row exists before we insert the subscription on the
-- INSERT path. (The exception guard makes a mis-order harmless regardless.)
DROP TRIGGER IF EXISTS on_auth_user_link_pending_subs ON auth.users;
CREATE TRIGGER on_auth_user_link_pending_subs
  AFTER INSERT OR UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.link_pending_subscriptions();
