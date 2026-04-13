-- Haste Pulse: Send Slack notifications for desktop app events via Vercel webhook
-- Requires pg_net extension (already enabled on Conform Studio project)
--
-- This function + triggers POST to https://haste.nyc/api/webhooks/supabase
-- whenever a new profile, conversion, or session is created.
-- The webhook secret is embedded in the function body and must match
-- the SUPABASE_WEBHOOK_SECRET env var on Vercel.

CREATE OR REPLACE FUNCTION public.notify_haste_pulse()
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
      'table', TG_TABLE_NAME,
      'schema', TG_TABLE_SCHEMA,
      'record', row_to_json(NEW)
    )
  );
  RETURN NEW;
END;
$$;

-- New user registrations
DROP TRIGGER IF EXISTS pulse_new_user ON public.profiles;
CREATE TRIGGER pulse_new_user
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_haste_pulse();

-- Project conversions (core product usage)
DROP TRIGGER IF EXISTS pulse_conversion ON public.usage_conversions;
CREATE TRIGGER pulse_conversion
  AFTER INSERT ON public.usage_conversions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_haste_pulse();

-- App sessions (user opened the desktop app)
DROP TRIGGER IF EXISTS pulse_session ON public.usage_sessions;
CREATE TRIGGER pulse_session
  AFTER INSERT ON public.usage_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_haste_pulse();
