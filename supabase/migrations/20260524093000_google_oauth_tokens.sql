CREATE TABLE IF NOT EXISTS public.integration_oauth_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id uuid NOT NULL REFERENCES public.user_integrations(id) ON DELETE CASCADE,
  provider text NOT NULL,
  token_type text NOT NULL DEFAULT 'Bearer',
  access_token text NOT NULL,
  refresh_token text,
  expires_at timestamptz,
  scope text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT integration_oauth_tokens_integration_unique UNIQUE (integration_id),
  CONSTRAINT integration_oauth_tokens_provider_check CHECK (
    provider IN ('google', 'microsoft', 'whatsapp', 'payments')
  )
);

COMMENT ON TABLE public.integration_oauth_tokens IS
  'OAuth tokens are service-role only. Do not create user-facing RLS policies for this table.';

DROP TRIGGER IF EXISTS set_integration_oauth_tokens_updated_at
  ON public.integration_oauth_tokens;
CREATE TRIGGER set_integration_oauth_tokens_updated_at
  BEFORE UPDATE ON public.integration_oauth_tokens
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.integration_oauth_tokens ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS integration_oauth_tokens_integration_id_idx
  ON public.integration_oauth_tokens (integration_id);

CREATE INDEX IF NOT EXISTS integration_oauth_tokens_provider_idx
  ON public.integration_oauth_tokens (provider);
