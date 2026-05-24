DO $$
DECLARE
  new_user_id uuid;
  acc_id uuid;
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
      '{"name": "Administrador"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    -- Ensure profile is created
    INSERT INTO public.profiles (id, email, name, is_admin)
    VALUES (new_user_id, 'aneccr@hotmail.com', 'Administrador', true)
    ON CONFLICT (id) DO NOTHING;

    -- Seed an account
    acc_id := gen_random_uuid();
    INSERT INTO public.accounts (id, user_id, name, institution, type, balance)
    VALUES (acc_id, new_user_id, 'Conta Corrente', 'Banco do Brasil', 'checking', 15000.00)
    ON CONFLICT (id) DO NOTHING;
    
    -- Seed some transactions with duplicates to demonstrate the feature
    INSERT INTO public.transactions (user_id, account_id, "desc", value, type, cat, date) VALUES
    (new_user_id, acc_id, 'Supermercado', -250.00, 'expense', 'Alimentação', '2023-10-01'),
    (new_user_id, acc_id, 'Supermercado', -250.00, 'expense', 'Alimentação', '2023-10-01'),
    (new_user_id, acc_id, 'Posto de Gasolina', -100.00, 'expense', 'Transporte', '2023-10-05'),
    (new_user_id, acc_id, 'Posto de Gasolina', -100.00, 'expense', 'Transporte', '2023-10-05'),
    (new_user_id, acc_id, 'Restaurante', -80.00, 'expense', 'Lazer', '2023-10-08');
  END IF;
END $$;

-- Add cleaned_amount to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cleaned_amount NUMERIC DEFAULT 0;

-- Ensure RLS on transactions
DROP POLICY IF EXISTS "authenticated_select_transactions" ON public.transactions;
CREATE POLICY "authenticated_select_transactions" ON public.transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "authenticated_insert_transactions" ON public.transactions;
CREATE POLICY "authenticated_insert_transactions" ON public.transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "authenticated_update_transactions" ON public.transactions;
CREATE POLICY "authenticated_update_transactions" ON public.transactions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "authenticated_delete_transactions" ON public.transactions;
CREATE POLICY "authenticated_delete_transactions" ON public.transactions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Ensure RLS on accounts
DROP POLICY IF EXISTS "authenticated_select_accounts" ON public.accounts;
CREATE POLICY "authenticated_select_accounts" ON public.accounts FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "authenticated_insert_accounts" ON public.accounts;
CREATE POLICY "authenticated_insert_accounts" ON public.accounts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "authenticated_update_accounts" ON public.accounts;
CREATE POLICY "authenticated_update_accounts" ON public.accounts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "authenticated_delete_accounts" ON public.accounts;
CREATE POLICY "authenticated_delete_accounts" ON public.accounts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Provide a function to safely increment cleaned_amount
CREATE OR REPLACE FUNCTION public.increment_cleaned_amount(amount NUMERIC)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET cleaned_amount = COALESCE(cleaned_amount, 0) + amount
  WHERE id = auth.uid();
END;
$$;
