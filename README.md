# Patrono Clear

Plataforma SaaS para limpeza e organização da vida digital: e-mails, WhatsApp, fotos, vídeos, documentos e arquivos duplicados.

## Principais recursos

- Painel de limpeza digital com métricas de arquivos e mensagens.
- Triagem de e-mails com sugestões de resposta, arquivamento e exclusão.
- Fluxo de WhatsApp com aprovação antes de enviar respostas.
- Organização de mídia, documentos e duplicados.
- Cadastro de novos usuários com teste grátis de 7 dias e cartão no início.
- Tela de integrações para Gmail/Google Drive, Outlook/OneDrive, WhatsApp Business e pagamentos.
- Base Supabase preparada para integrações reais e fila de aprovação.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Shadcn UI
- Supabase
- pnpm

## Configuração

Crie um arquivo `.env` baseado em `.env.example`:

```bash
cp .env.example .env
```

Preencha as chaves públicas do Supabase:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Segredos de Google, Microsoft, WhatsApp e pagamento devem ser configurados no servidor/Supabase, não no código do navegador.

## Integração Google

O botão `Configurar conexão` em Gmail e Google Drive inicia o OAuth pela Edge Function `google-oauth-handler`.

No Google Cloud, crie credenciais OAuth do tipo Web e cadastre a URL de retorno da função:

```bash
https://SEU-PROJETO.supabase.co/functions/v1/google-oauth-handler
```

No Supabase, aplique as migrations e cadastre os secrets da função:

```bash
supabase db push
supabase secrets set APP_URL=http://127.0.0.1:8080
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
supabase secrets set GOOGLE_CLIENT_ID=...
supabase secrets set GOOGLE_CLIENT_SECRET=...
supabase secrets set GOOGLE_REDIRECT_URI=https://SEU-PROJETO.supabase.co/functions/v1/google-oauth-handler
supabase secrets set OAUTH_STATE_SECRET=uma-frase-grande-e-aleatoria
supabase functions deploy google-oauth-handler
```

Nesta primeira etapa a conexão pede permissões de leitura para Gmail e Google Drive. Ações de excluir, arquivar ou responder devem continuar passando pela fila de aprovação do usuário antes de qualquer execução real.

## Desenvolvimento

```bash
corepack pnpm install
corepack pnpm dev
```

Servidor local padrão:

```bash
http://127.0.0.1:8080
```

## Validação

```bash
corepack pnpm lint
corepack pnpm build
```

## Administrador local

No modo de demonstração local:

```bash
E-mail: aneccr@hotmail.com
Senha: Skip@Pass
```
