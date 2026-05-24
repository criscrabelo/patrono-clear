import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo'

const GOOGLE_SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
]

type Env = {
  supabaseUrl: string
  serviceRoleKey: string
  googleClientId: string
  googleClientSecret: string
  googleRedirectUri: string
  oauthStateSecret: string
  appUrl: string
}

type OAuthState = {
  userId: string
  returnTo: string
  nonce: string
  exp: number
}

type GoogleTokenResponse = {
  access_token: string
  expires_in?: number
  refresh_token?: string
  scope?: string
  token_type?: string
}

type GoogleUserInfo = {
  sub?: string
  email?: string
  name?: string
  picture?: string
}

const encoder = new TextEncoder()
const decoder = new TextDecoder()

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function getRequiredEnv(): Env {
  const env = {
    supabaseUrl: Deno.env.get('SUPABASE_URL') ?? '',
    serviceRoleKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    googleClientId: Deno.env.get('GOOGLE_CLIENT_ID') ?? '',
    googleClientSecret: Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '',
    googleRedirectUri: Deno.env.get('GOOGLE_REDIRECT_URI') ?? '',
    oauthStateSecret: Deno.env.get('OAUTH_STATE_SECRET') ?? '',
    appUrl: Deno.env.get('APP_URL') ?? 'http://127.0.0.1:8080',
  }

  const missing = Object.entries(env)
    .filter(([key, value]) => key !== 'appUrl' && !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(`Missing Edge Function secrets: ${missing.join(', ')}`)
  }

  return env
}

function base64UrlEncode(input: string | ArrayBuffer | Uint8Array) {
  const bytes =
    typeof input === 'string'
      ? encoder.encode(input)
      : input instanceof Uint8Array
        ? input
        : new Uint8Array(input)
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '')
}

function base64UrlDecode(input: string) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return decoder.decode(bytes)
}

async function createSignature(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  return base64UrlEncode(signature)
}

function safeCompare(left: string, right: string) {
  if (left.length !== right.length) return false

  let result = 0
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }

  return result === 0
}

async function createState(payload: OAuthState, secret: string) {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signature = await createSignature(encodedPayload, secret)
  return `${encodedPayload}.${signature}`
}

async function parseState(state: string, secret: string) {
  const [encodedPayload, signature] = state.split('.')
  if (!encodedPayload || !signature) {
    throw new Error('Invalid OAuth state.')
  }

  const expectedSignature = await createSignature(encodedPayload, secret)
  if (!safeCompare(signature, expectedSignature)) {
    throw new Error('Invalid OAuth state signature.')
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as OAuthState
  if (!payload.exp || Date.now() > payload.exp) {
    throw new Error('OAuth state expired.')
  }

  return payload
}

function normalizeReturnTo(returnTo: unknown, appUrl: string) {
  const fallback = new URL('/settings?integration=google', appUrl).toString()

  if (typeof returnTo !== 'string') return fallback

  try {
    const parsed = new URL(returnTo)
    const allowedOrigins = new Set([
      new URL(appUrl).origin,
      'http://127.0.0.1:8080',
      'http://localhost:8080',
    ])

    if (allowedOrigins.has(parsed.origin) && parsed.pathname === '/settings') {
      return parsed.toString()
    }
  } catch {
    return fallback
  }

  return fallback
}

function withOAuthStatus(returnTo: string, status: 'connected' | 'error', message?: string) {
  const redirectUrl = new URL(returnTo)
  redirectUrl.searchParams.set('integration', 'google')
  redirectUrl.searchParams.set('status', status)

  if (message) {
    redirectUrl.searchParams.set('message', message)
  }

  return Response.redirect(redirectUrl.toString(), 302)
}

async function handleStart(req: Request) {
  const env = getRequiredEnv()
  const authorization = req.headers.get('Authorization') ?? ''
  const jwt = authorization.replace(/^Bearer\s+/iu, '')

  if (!jwt) {
    return jsonResponse({ error: 'User must be authenticated to connect Google.' }, 401)
  }

  const adminClient = createClient(env.supabaseUrl, env.serviceRoleKey, {
    auth: { persistSession: false },
  })
  const {
    data: { user },
    error,
  } = await adminClient.auth.getUser(jwt)

  if (error || !user) {
    return jsonResponse({ error: 'Invalid Supabase session.' }, 401)
  }

  const payload = await req.json().catch(() => ({}))
  const returnTo = normalizeReturnTo(payload.returnTo, env.appUrl)
  const state = await createState(
    {
      userId: user.id,
      returnTo,
      nonce: crypto.randomUUID(),
      exp: Date.now() + 10 * 60 * 1000,
    },
    env.oauthStateSecret,
  )

  const authUrl = new URL(GOOGLE_AUTH_URL)
  authUrl.searchParams.set('client_id', env.googleClientId)
  authUrl.searchParams.set('redirect_uri', env.googleRedirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', GOOGLE_SCOPES.join(' '))
  authUrl.searchParams.set('access_type', 'offline')
  authUrl.searchParams.set('include_granted_scopes', 'true')
  authUrl.searchParams.set('prompt', 'consent')
  authUrl.searchParams.set('state', state)

  return jsonResponse({ authUrl: authUrl.toString() })
}

async function exchangeCode(code: string, env: Env) {
  const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.googleClientId,
      client_secret: env.googleClientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: env.googleRedirectUri,
    }),
  })

  if (!tokenResponse.ok) {
    const detail = await tokenResponse.text()
    throw new Error(`Google token exchange failed: ${detail}`)
  }

  return (await tokenResponse.json()) as GoogleTokenResponse
}

async function fetchGoogleUserInfo(accessToken: string) {
  const userInfoResponse = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!userInfoResponse.ok) {
    const detail = await userInfoResponse.text()
    throw new Error(`Google user info failed: ${detail}`)
  }

  return (await userInfoResponse.json()) as GoogleUserInfo
}

async function handleCallback(req: Request) {
  const env = getRequiredEnv()
  const callbackUrl = new URL(req.url)
  const error = callbackUrl.searchParams.get('error')
  const code = callbackUrl.searchParams.get('code')
  const stateParam = callbackUrl.searchParams.get('state')

  if (!stateParam) {
    return withOAuthStatus(new URL('/settings?integration=google', env.appUrl).toString(), 'error')
  }

  const state = await parseState(stateParam, env.oauthStateSecret)

  if (error) {
    return withOAuthStatus(state.returnTo, 'error', error)
  }

  if (!code) {
    return withOAuthStatus(state.returnTo, 'error', 'Google did not return an authorization code.')
  }

  const adminClient = createClient(env.supabaseUrl, env.serviceRoleKey, {
    auth: { persistSession: false },
  })
  const tokenData = await exchangeCode(code, env)
  const userInfo = await fetchGoogleUserInfo(tokenData.access_token)
  const grantedScopes = tokenData.scope ? tokenData.scope.split(' ') : GOOGLE_SCOPES
  const now = new Date().toISOString()

  const { data: integration, error: integrationError } = await adminClient
    .from('user_integrations')
    .upsert(
      {
        user_id: state.userId,
        provider: 'google',
        status: 'connected',
        account_label: userInfo.email ?? 'Conta Google conectada',
        scopes: grantedScopes,
        metadata: {
          google_user_id: userInfo.sub ?? null,
          email: userInfo.email ?? null,
          name: userInfo.name ?? null,
          picture: userInfo.picture ?? null,
        },
        connected_at: now,
        error_message: null,
      },
      { onConflict: 'user_id,provider' },
    )
    .select('id')
    .single()

  if (integrationError || !integration) {
    throw new Error(integrationError?.message ?? 'Could not save Google integration.')
  }

  const { data: existingToken } = await adminClient
    .from('integration_oauth_tokens')
    .select('refresh_token')
    .eq('integration_id', integration.id)
    .maybeSingle()

  const expiresAt = tokenData.expires_in
    ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
    : null

  const { error: tokenError } = await adminClient.from('integration_oauth_tokens').upsert(
    {
      integration_id: integration.id,
      provider: 'google',
      token_type: tokenData.token_type ?? 'Bearer',
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token ?? existingToken?.refresh_token ?? null,
      expires_at: expiresAt,
      scope: tokenData.scope ?? GOOGLE_SCOPES.join(' '),
    },
    { onConflict: 'integration_id' },
  )

  if (tokenError) {
    throw new Error(tokenError.message)
  }

  return withOAuthStatus(state.returnTo, 'connected')
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method === 'POST') {
      return await handleStart(req)
    }

    if (req.method === 'GET') {
      return await handleCallback(req)
    }

    return jsonResponse({ error: 'Method not allowed.' }, 405)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected OAuth error.'

    if (req.method === 'GET') {
      const envAppUrl = Deno.env.get('APP_URL') ?? 'http://127.0.0.1:8080'
      return withOAuthStatus(
        new URL('/settings?integration=google', envAppUrl).toString(),
        'error',
        message,
      )
    }

    return jsonResponse({ error: message }, 400)
  }
})
