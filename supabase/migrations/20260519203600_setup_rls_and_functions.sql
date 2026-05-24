-- 1. Ensure RLS is enabled
ALTER TABLE IF EXISTS public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.transactions ENABLE ROW LEVEL SECURITY;

-- Accounts Policies
DROP POLICY IF EXISTS "authenticated_select_accounts" ON public.accounts;
CREATE POLICY "authenticated_select_accounts" ON public.accounts FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "authenticated_insert_accounts" ON public.accounts;
CREATE POLICY "authenticated_insert_accounts" ON public.accounts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "authenticated_update_accounts" ON public.accounts;
CREATE POLICY "authenticated_update_accounts" ON public.accounts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "authenticated_delete_accounts" ON public.accounts;
CREATE POLICY "authenticated_delete_accounts" ON public.accounts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Transactions Policies
DROP POLICY IF EXISTS "authenticated_select_transactions" ON public.transactions;
CREATE POLICY "authenticated_select_transactions" ON public.transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "authenticated_insert_transactions" ON public.transactions;
CREATE POLICY "authenticated_insert_transactions" ON public.transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "authenticated_update_transactions" ON public.transactions;
CREATE POLICY "authenticated_update_transactions" ON public.transactions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "authenticated_delete_transactions" ON public.transactions;
CREATE POLICY "authenticated_delete_transactions" ON public.transactions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Profiles Policies
DROP POLICY IF EXISTS "authenticated_select_profiles" ON public.profiles;
CREATE POLICY "authenticated_select_profiles" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "authenticated_update_profiles" ON public.profiles;
CREATE POLICY "authenticated_update_profiles" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 2. Ensure Functions
CREATE OR REPLACE FUNCTION public.increment_cleaned_amount(amount numeric)
RETURNS void AS $function$
BEGIN
  UPDATE public.profiles
  SET cleaned_amount = COALESCE(cleaned_amount, 0) + amount
  WHERE id = auth.uid();
END;
$function$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, name, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    CASE WHEN NEW.email = 'aneccr@hotmail.com' THEN true ELSE false END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
