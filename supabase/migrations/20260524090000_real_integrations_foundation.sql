CREATE TABLE IF NOT EXISTS public.user_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL,
  status text NOT NULL DEFAULT 'setup',
  account_label text,
  scopes text[] NOT NULL DEFAULT '{}',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  connected_at timestamptz,
  last_synced_at timestamptz,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_integrations_provider_check CHECK (
    provider IN ('google', 'microsoft', 'whatsapp', 'payments')
  ),
  CONSTRAINT user_integrations_status_check CHECK (
    status IN ('setup', 'connected', 'needs_attention', 'disabled')
  ),
  CONSTRAINT user_integrations_user_provider_unique UNIQUE (user_id, provider)
);

CREATE TABLE IF NOT EXISTS public.approval_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_id uuid REFERENCES public.user_integrations(id) ON DELETE SET NULL,
  source text NOT NULL,
  action text NOT NULL,
  contact_name text,
  contact_handle text,
  subject text,
  original_content text NOT NULL,
  suggested_response text,
  status text NOT NULL DEFAULT 'pending',
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT approval_queue_source_check CHECK (
    source IN ('email', 'whatsapp', 'drive', 'onedrive', 'photos', 'documents')
  ),
  CONSTRAINT approval_queue_action_check CHECK (
    action IN ('reply', 'archive', 'delete', 'organize', 'ignore')
  ),
  CONSTRAINT approval_queue_status_check CHECK (
    status IN ('pending', 'approved', 'rejected', 'no_reply', 'done')
  )
);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_user_integrations_updated_at ON public.user_integrations;
CREATE TRIGGER set_user_integrations_updated_at
  BEFORE UPDATE ON public.user_integrations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_approval_queue_updated_at ON public.approval_queue;
CREATE TRIGGER set_approval_queue_updated_at
  BEFORE UPDATE ON public.approval_queue
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_select_user_integrations" ON public.user_integrations;
CREATE POLICY "authenticated_select_user_integrations"
  ON public.user_integrations FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "authenticated_insert_user_integrations" ON public.user_integrations;
CREATE POLICY "authenticated_insert_user_integrations"
  ON public.user_integrations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "authenticated_update_user_integrations" ON public.user_integrations;
CREATE POLICY "authenticated_update_user_integrations"
  ON public.user_integrations FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_select_user_integrations" ON public.user_integrations;
CREATE POLICY "admin_select_user_integrations"
  ON public.user_integrations FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "authenticated_select_approval_queue" ON public.approval_queue;
CREATE POLICY "authenticated_select_approval_queue"
  ON public.approval_queue FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "authenticated_insert_approval_queue" ON public.approval_queue;
CREATE POLICY "authenticated_insert_approval_queue"
  ON public.approval_queue FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "authenticated_update_approval_queue" ON public.approval_queue;
CREATE POLICY "authenticated_update_approval_queue"
  ON public.approval_queue FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_select_approval_queue" ON public.approval_queue;
CREATE POLICY "admin_select_approval_queue"
  ON public.approval_queue FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE INDEX IF NOT EXISTS user_integrations_user_id_idx
  ON public.user_integrations (user_id);

CREATE INDEX IF NOT EXISTS approval_queue_user_status_idx
  ON public.approval_queue (user_id, status, created_at DESC);
