// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          balance: number
          billing_month: string | null
          color: string | null
          created_at: string
          due_date: string | null
          iconType: string | null
          id: string
          institution: string
          is_paid: boolean
          limit: number | null
          name: string
          sync_token: string | null
          type: string
          user_id: string
        }
        Insert: {
          balance?: number
          billing_month?: string | null
          color?: string | null
          created_at?: string
          due_date?: string | null
          iconType?: string | null
          id?: string
          institution: string
          is_paid?: boolean
          limit?: number | null
          name: string
          sync_token?: string | null
          type: string
          user_id?: string
        }
        Update: {
          balance?: number
          billing_month?: string | null
          color?: string | null
          created_at?: string
          due_date?: string | null
          iconType?: string | null
          id?: string
          institution?: string
          is_paid?: boolean
          limit?: number | null
          name?: string
          sync_token?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          auto_archive_monthly: boolean | null
          auto_clean_weekly: boolean | null
          cleaned_amount: number | null
          created_at: string
          email: string
          google_api_key: string | null
          id: string
          is_admin: boolean | null
          name: string | null
          outlook_api_key: string | null
        }
        Insert: {
          auto_archive_monthly?: boolean | null
          auto_clean_weekly?: boolean | null
          cleaned_amount?: number | null
          created_at?: string
          email: string
          google_api_key?: string | null
          id: string
          is_admin?: boolean | null
          name?: string | null
          outlook_api_key?: string | null
        }
        Update: {
          auto_archive_monthly?: boolean | null
          auto_clean_weekly?: boolean | null
          cleaned_amount?: number | null
          created_at?: string
          email?: string
          google_api_key?: string | null
          id?: string
          is_admin?: boolean | null
          name?: string | null
          outlook_api_key?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_id: string
          cat: string
          created_at: string
          date: string
          desc: string
          icon: string | null
          id: string
          installments: string | null
          sync_status: string | null
          type: string
          user_id: string
          value: number
        }
        Insert: {
          account_id: string
          cat: string
          created_at?: string
          date: string
          desc: string
          icon?: string | null
          id?: string
          installments?: string | null
          sync_status?: string | null
          type: string
          user_id?: string
          value: number
        }
        Update: {
          account_id?: string
          cat?: string
          created_at?: string
          date?: string
          desc?: string
          icon?: string | null
          id?: string
          installments?: string | null
          sync_status?: string | null
          type?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: 'transactions_account_id_fkey'
            columns: ['account_id']
            isOneToOne: false
            referencedRelation: 'accounts'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_cleaned_amount: { Args: { amount: number }; Returns: undefined }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: accounts
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null, default: auth.uid())
//   name: text (not null)
//   institution: text (not null)
//   type: text (not null)
//   balance: numeric (not null, default: 0)
//   limit: numeric (nullable)
//   color: text (nullable)
//   iconType: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   sync_token: text (nullable)
//   billing_month: text (nullable)
//   due_date: text (nullable)
//   is_paid: boolean (not null, default: false)
// Table: profiles
//   id: uuid (not null)
//   email: text (not null)
//   name: text (nullable)
//   is_admin: boolean (nullable, default: false)
//   created_at: timestamp with time zone (not null, default: now())
//   cleaned_amount: numeric (nullable, default: 0)
//   google_api_key: text (nullable, default: ''::text)
//   outlook_api_key: text (nullable, default: ''::text)
//   auto_clean_weekly: boolean (nullable, default: true)
//   auto_archive_monthly: boolean (nullable, default: false)
// Table: transactions
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null, default: auth.uid())
//   account_id: uuid (not null)
//   desc: text (not null)
//   value: numeric (not null)
//   type: text (not null)
//   cat: text (not null)
//   date: text (not null)
//   installments: text (nullable)
//   icon: text (nullable)
//   sync_status: text (nullable, default: 'synced'::text)
//   created_at: timestamp with time zone (not null, default: now())

// --- CONSTRAINTS ---
// Table: accounts
//   PRIMARY KEY accounts_pkey: PRIMARY KEY (id)
//   FOREIGN KEY accounts_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: transactions
//   FOREIGN KEY transactions_account_id_fkey: FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
//   PRIMARY KEY transactions_pkey: PRIMARY KEY (id)
//   FOREIGN KEY transactions_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE

// --- ROW LEVEL SECURITY POLICIES ---
// Table: accounts
//   Policy "admin_select_accounts" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: is_admin()
//   Policy "authenticated_delete_accounts" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "authenticated_insert_accounts" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "authenticated_select_accounts" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "authenticated_update_accounts" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: profiles
//   Policy "admin_select_profiles" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: is_admin()
//   Policy "admin_update_profiles" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: is_admin()
//     WITH CHECK: is_admin()
//   Policy "authenticated_select_profiles" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = id)
//   Policy "authenticated_update_profiles" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = id)
//     WITH CHECK: (auth.uid() = id)
// Table: transactions
//   Policy "admin_select_transactions" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: is_admin()
//   Policy "authenticated_delete_transactions" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "authenticated_insert_transactions" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "authenticated_select_transactions" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "authenticated_update_transactions" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)

// --- DATABASE FUNCTIONS ---
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.profiles (id, email, name, is_admin)
//     VALUES (
//       NEW.id,
//       NEW.email,
//       COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
//       CASE WHEN NEW.email = 'aneccr@hotmail.com' THEN true ELSE false END
//     )
//     ON CONFLICT (id) DO NOTHING;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION increment_cleaned_amount(numeric)
//   CREATE OR REPLACE FUNCTION public.increment_cleaned_amount(amount numeric)
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     UPDATE public.profiles
//     SET cleaned_amount = COALESCE(cleaned_amount, 0) + amount
//     WHERE id = auth.uid();
//   END;
//   $function$
//
// FUNCTION is_admin()
//   CREATE OR REPLACE FUNCTION public.is_admin()
//    RETURNS boolean
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   DECLARE
//     _is_admin BOOLEAN;
//   BEGIN
//     SELECT is_admin INTO _is_admin FROM profiles WHERE id = auth.uid();
//     RETURN COALESCE(_is_admin, false);
//   END;
//   $function$
//
// FUNCTION rls_auto_enable()
//   CREATE OR REPLACE FUNCTION public.rls_auto_enable()
//    RETURNS event_trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'pg_catalog'
//   AS $function$
//   DECLARE
//     cmd record;
//   BEGIN
//     FOR cmd IN
//       SELECT *
//       FROM pg_event_trigger_ddl_commands()
//       WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
//         AND object_type IN ('table','partitioned table')
//     LOOP
//        IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
//         BEGIN
//           EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
//           RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
//         EXCEPTION
//           WHEN OTHERS THEN
//             RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
//         END;
//        ELSE
//           RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
//        END IF;
//     END LOOP;
//   END;
//   $function$
//

// --- INDEXES ---
// Table: accounts
//   CREATE INDEX accounts_user_id_idx ON public.accounts USING btree (user_id)
// Table: transactions
//   CREATE INDEX transactions_account_id_idx ON public.transactions USING btree (account_id)
//   CREATE INDEX transactions_user_id_idx ON public.transactions USING btree (user_id)
