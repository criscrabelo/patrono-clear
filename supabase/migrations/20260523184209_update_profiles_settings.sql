ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS google_api_key TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS outlook_api_key TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS auto_clean_weekly BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS auto_archive_monthly BOOLEAN DEFAULT false;

-- Ensure RLS is active and correctly setup to satisfy AC
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_select_profiles" ON public.profiles;
CREATE POLICY "authenticated_select_profiles" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "authenticated_update_profiles" ON public.profiles;
CREATE POLICY "authenticated_update_profiles" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Seed user aneccr@hotmail.com according to AC
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'aneccr@hotmail.com') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'aneccr@hotmail.com',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Aneccr"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    INSERT INTO public.profiles (id, email, name, is_admin, auto_clean_weekly, auto_archive_monthly)
    VALUES (new_user_id, 'aneccr@hotmail.com', 'Aneccr', true, true, false)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
