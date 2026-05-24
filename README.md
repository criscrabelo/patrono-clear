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
