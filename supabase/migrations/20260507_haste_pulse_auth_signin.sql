-- Haste Pulse: Send Slack notifications when a user authenticates to the desktop app.
-- Fires on every auth.sessions INSERT (new sign-in or token refresh that creates a session).
-- The webhook handler (api/webhooks/supabase.ts) deduplicates per email per 24h before posting,
-- so this trigger can fire freely without spamming.
--
-- The trigger sends only user_id + user_agent; the webhook handler resolves the email and
-- raw_user_meta_data via the service role. This keeps the trigger function minimal and
-- avoids depending on auth schema access from a public function.

CREATE OR REPLACE FUNCTION public.notify_haste_pulse_auth()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://haste.nyc/api/webhooks/supabase',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-supabase-webhook-secret', current_setting('app.haste_pulse_secret', true)
    ),
    body := jsonb_build_object(
      'type', TG_OP,
      'table', 'auth_signin',
      'schema', TG_TABLE_SCHEMA,
      'record', jsonb_build_object(
        'user_id', NEW.user_id,
        'user_agent', NEW.user_agent,
        'created_at', NEW.created_at
      )
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS pulse_auth_signin ON auth.sessions;
CREATE TRIGGER pulse_auth_signin
  AFTER INSERT ON auth.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_haste_pulse_auth();
