DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Seed admin user (idempotent: skip if email already exists)
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
      '{"name": "Admin Patrono"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    -- Inserting into public.profiles
    -- A trigger `handle_new_user()` might already catch the INSERT into auth.users and create a profile.
    -- We use ON CONFLICT DO UPDATE or DO NOTHING to ensure idempotency.
    INSERT INTO public.profiles (id, email, name, is_admin)
    VALUES (new_user_id, 'aneccr@hotmail.com', 'Admin Patrono', true)
    ON CONFLICT (id) DO UPDATE 
    SET is_admin = true, name = EXCLUDED.name;
  END IF;
END $$;
