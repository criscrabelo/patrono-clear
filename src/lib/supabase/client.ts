// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string
export const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY)

// Import the supabase client like this:
// import { supabase } from "@/lib/supabase/client";

type SupabaseClient = ReturnType<typeof createClient<Database>>
type MockAuthCallback = (event: string, session: any) => void
const ADMIN_EMAILS = ['aneccr@hotmail.com', 'admin@patronoclear.com.br']
const isAdminEmail = (email: string) => ADMIN_EMAILS.includes(email.trim().toLowerCase())

const mockProfile = {
  id: 'local-demo-user',
  email: 'aneccr@hotmail.com',
  name: 'aneccr',
  is_admin: true,
  cleaned_amount: 42.8,
  google_api_key: '',
  outlook_api_key: '',
  auto_clean_weekly: true,
  auto_archive_monthly: false,
}

const mockAccounts = [
  {
    id: 'local-account-1',
    user_id: mockProfile.id,
    name: 'Google Drive',
    institution: 'Google',
    type: 'cloud',
    balance: 12840,
    limit: null,
    color: '#10b981',
    iconType: 'drive',
    created_at: new Date().toISOString(),
    sync_token: null,
    billing_month: null,
    due_date: null,
    is_paid: true,
  },
  {
    id: 'local-account-2',
    user_id: mockProfile.id,
    name: 'OneDrive',
    institution: 'Microsoft',
    type: 'cloud',
    balance: 8240,
    limit: null,
    color: '#3b82f6',
    iconType: 'cloud',
    created_at: new Date().toISOString(),
    sync_token: null,
    billing_month: null,
    due_date: null,
    is_paid: true,
  },
]

const mockTransactions = [
  {
    id: 'local-transaction-1',
    user_id: mockProfile.id,
    account_id: 'local-account-1',
    desc: 'IMG 2025 aniversario.jpg',
    value: 2.4,
    type: 'delete',
    cat: 'Imagens',
    date: '23/05/2026',
    installments: null,
    icon: null,
    sync_status: 'pending',
    created_at: new Date().toISOString(),
  },
  {
    id: 'local-transaction-2',
    user_id: mockProfile.id,
    account_id: 'local-account-2',
    desc: 'IMG 2025 aniversario copia.jpg',
    value: 2.4,
    type: 'delete',
    cat: 'Imagens',
    date: '22/05/2026',
    installments: null,
    icon: null,
    sync_status: 'pending',
    created_at: new Date().toISOString(),
  },
  {
    id: 'local-transaction-3',
    user_id: mockProfile.id,
    account_id: 'local-account-1',
    desc: 'Contrato cliente final.pdf',
    value: 0.8,
    type: 'archive',
    cat: 'Documentos',
    date: '21/05/2026',
    installments: null,
    icon: null,
    sync_status: 'synced',
    created_at: new Date().toISOString(),
  },
  {
    id: 'local-transaction-4',
    user_id: mockProfile.id,
    account_id: 'local-account-2',
    desc: 'Contrato cliente final duplicado.pdf',
    value: 0.8,
    type: 'delete',
    cat: 'Documentos',
    date: '20/05/2026',
    installments: null,
    icon: null,
    sync_status: 'pending',
    created_at: new Date().toISOString(),
  },
  {
    id: 'local-transaction-5',
    user_id: mockProfile.id,
    account_id: 'local-account-1',
    desc: 'Vídeo reunião antiga.mp4',
    value: 8.7,
    type: 'archive',
    cat: 'Vídeos',
    date: '19/05/2026',
    installments: null,
    icon: null,
    sync_status: 'synced',
    created_at: new Date().toISOString(),
  },
  {
    id: 'local-transaction-6',
    user_id: mockProfile.id,
    account_id: 'local-account-2',
    desc: 'Responder e-mail sobre contrato',
    value: 0.1,
    type: 'reply',
    cat: 'E-mails',
    date: 'Hoje',
    installments: null,
    icon: null,
    sync_status: 'pending',
    created_at: new Date().toISOString(),
  },
]

function createMockSupabaseClient(): SupabaseClient {
  let mockSession: any = null
  const listeners = new Set<MockAuthCallback>()

  const response = (data: any = null, error: any = null) => Promise.resolve({ data, error })

  const createQuery = (table: string) => {
    let data: any =
      table === 'profiles' ? [mockProfile] : table === 'accounts' ? mockAccounts : mockTransactions

    const query: any = {
      select: () => query,
      delete: () => {
        data = null
        return query
      },
      update: (updates: Record<string, unknown>) => {
        if (table === 'profiles') Object.assign(mockProfile, updates)
        return query
      },
      eq: (column: string, value: unknown) => {
        if (Array.isArray(data)) data = data.filter((item) => item[column] === value)
        return query
      },
      in: () => response(null),
      order: () => query,
      limit: (count: number) => {
        if (Array.isArray(data)) data = data.slice(0, count)
        return query
      },
      single: () => response(Array.isArray(data) ? data[0] ?? null : data),
      then: (onFulfilled: any, onRejected: any) => response(data).then(onFulfilled, onRejected),
      catch: (onRejected: any) => response(data).catch(onRejected),
      finally: (onFinally: any) => response(data).finally(onFinally),
    }

    return query
  }

  const notifyAuth = (event: string) => {
    listeners.forEach((listener) => listener(event, mockSession))
  }

  const signIn = async ({ email }: { email: string }) => {
    const normalizedEmail = email.trim().toLowerCase()
    mockProfile.email = normalizedEmail
    mockProfile.name = normalizedEmail.split('@')[0]
    mockProfile.is_admin = isAdminEmail(normalizedEmail)
    mockSession = {
      access_token: 'local-demo-token',
      refresh_token: 'local-demo-refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
      user: {
        id: mockProfile.id,
        email: normalizedEmail,
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: {},
        user_metadata: { name: mockProfile.name },
        created_at: new Date().toISOString(),
      },
    }
    notifyAuth('SIGNED_IN')
    return { data: { session: mockSession, user: mockSession.user }, error: null }
  }

  return {
    auth: {
      getSession: () => response({ session: mockSession }),
      onAuthStateChange: (callback: MockAuthCallback) => {
        listeners.add(callback)
        return {
          data: {
            subscription: {
              unsubscribe: () => listeners.delete(callback),
            },
          },
        }
      },
      signInWithPassword: signIn,
      signUp: signIn,
      signOut: async () => {
        mockSession = null
        notifyAuth('SIGNED_OUT')
        return { error: null }
      },
    },
    from: createQuery,
    rpc: () => response(null),
  } as unknown as SupabaseClient
}

export const supabase = hasSupabaseConfig ? createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
}) : createMockSupabaseClient()
