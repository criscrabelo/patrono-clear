DO $$
DECLARE
  new_user_id uuid;
  new_account_id uuid;
BEGIN
  -- Seed the main user requested by AC
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

    -- The handle_new_user trigger manages the public.profiles record.

    -- Seed an initial account
    new_account_id := gen_random_uuid();
    INSERT INTO public.accounts (id, user_id, name, institution, type, balance, color)
    VALUES (new_account_id, new_user_id, 'Conta Nubank', 'Nubank', 'checking', 3540.00, '#8A05BE')
    ON CONFLICT (id) DO NOTHING;

    -- Seed initial transactions, including some mock duplicates for the duplicate finder to identify
    INSERT INTO public.transactions (id, user_id, account_id, "desc", value, type, cat, date)
    VALUES
      (gen_random_uuid(), new_user_id, new_account_id, 'Salário Mês', 6500.00, 'income', 'Renda', to_char(NOW(), 'DD/MM/YYYY')),
      (gen_random_uuid(), new_user_id, new_account_id, 'Mercado Livre', -120.00, 'expense', 'Compras', to_char(NOW() - interval '1 day', 'DD/MM/YYYY')),
      (gen_random_uuid(), new_user_id, new_account_id, 'Assinatura Spotify', -21.90, 'expense', 'Lazer', to_char(NOW() - interval '2 days', 'DD/MM/YYYY')),
      (gen_random_uuid(), new_user_id, new_account_id, 'Assinatura Spotify', -21.90, 'expense', 'Lazer', to_char(NOW() - interval '2 days', 'DD/MM/YYYY')), -- Intentional Duplicate
      (gen_random_uuid(), new_user_id, new_account_id, 'Uber Eats', -45.50, 'expense', 'Alimentação', to_char(NOW() - interval '3 days', 'DD/MM/YYYY')),
      (gen_random_uuid(), new_user_id, new_account_id, 'Uber Eats', -45.50, 'expense', 'Alimentação', to_char(NOW() - interval '3 days', 'DD/MM/YYYY'))  -- Intentional Duplicate
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
