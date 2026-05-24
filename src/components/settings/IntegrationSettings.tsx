import {
  AlertCircle,
  CheckCircle2,
  Cloud,
  CreditCard,
  ExternalLink,
  Mail,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { hasSupabaseConfig, supabase } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

type IntegrationStatus = 'ready' | 'setup' | 'soon'
type IntegrationProvider = 'google' | 'microsoft' | 'whatsapp' | 'payments'

interface IntegrationItem {
  id: IntegrationProvider
  name: string
  description: string
  provider: string
  icon: typeof Mail
  status: IntegrationStatus
  scopes: string[]
  nextStep: string
}

const integrations: IntegrationItem[] = [
  {
    id: 'google',
    name: 'Gmail e Google Drive',
    provider: 'Google',
    icon: Mail,
    status: 'setup',
    description: 'Ler e-mails, anexos, fotos, vídeos e documentos salvos na conta Google.',
    scopes: ['Gmail', 'Drive', 'Fotos/arquivos', 'Anexos'],
    nextStep: 'Criar credenciais OAuth no Google Cloud e cadastrar no Supabase.',
  },
  {
    id: 'microsoft',
    name: 'Outlook e OneDrive',
    provider: 'Microsoft',
    icon: Cloud,
    status: 'setup',
    description: 'Conectar e-mails do Outlook e arquivos do OneDrive para limpeza e organização.',
    scopes: ['Mail', 'Files', 'Calendário opcional', 'Perfil'],
    nextStep: 'Criar aplicativo no Microsoft Entra ID e configurar redirect OAuth.',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    provider: 'Meta',
    icon: MessageCircle,
    status: 'setup',
    description: 'Receber mensagens, sugerir respostas e enviar somente após sua aprovação.',
    scopes: ['Webhook', 'Mensagens recebidas', 'Envio aprovado', 'Templates'],
    nextStep: 'Configurar WhatsApp Business Cloud API, número e token permanente.',
  },
  {
    id: 'payments',
    name: 'Pagamento e teste grátis',
    provider: 'Gateway de pagamento',
    icon: CreditCard,
    status: 'setup',
    description: 'Cadastrar cartão no início, liberar 7 dias grátis e cobrar após o período.',
    scopes: ['Cartão', 'Assinatura', 'Trial 7 dias', 'Webhook de cobrança'],
    nextStep: 'Escolher Stripe, Mercado Pago ou Pagar.me e criar as chaves de produção.',
  },
]

const statusLabel = {
  ready: 'Conectado',
  setup: 'Configurar',
  soon: 'Em breve',
}

const statusClass = {
  ready: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600',
  setup: 'border-amber-500/30 bg-amber-500/10 text-amber-600',
  soon: 'border-slate-400/30 bg-slate-400/10 text-slate-600',
}

export function IntegrationSettings() {
  const [connectingProvider, setConnectingProvider] = useState<IntegrationProvider | null>(null)
  const [connectedProvider, setConnectedProvider] = useState<IntegrationProvider | null>(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('integration') === 'google' && params.get('status') === 'connected'
      ? 'google'
      : null
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('integration') !== 'google') return

    const status = params.get('status')
    if (status === 'connected') {
      setConnectedProvider('google')
      toast({
        title: 'Google conectado',
        description:
          'Gmail e Google Drive foram autorizados. O próximo passo é ativar a leitura e a fila de aprovação.',
      })
    }

    if (status === 'error') {
      toast({
        title: 'Google não conectou',
        description:
          params.get('message') ||
          'Revise as credenciais OAuth, a URL de retorno e os secrets do Supabase.',
        variant: 'destructive',
      })
    }
  }, [])

  const handleConnect = async (item: IntegrationItem) => {
    if (item.id !== 'google') {
      toast({
        title: `${item.name}: próxima integração`,
        description: 'Vamos conectar primeiro Gmail e Google Drive. Depois seguimos para esta etapa.',
      })
      return
    }

    if (!hasSupabaseConfig) {
      toast({
        title: 'Supabase precisa ser configurado',
        description:
          'Preencha VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY para iniciar o OAuth do Google.',
        variant: 'destructive',
      })
      return
    }

    setConnectingProvider(item.id)
    const { data, error } = await supabase.functions.invoke('google-oauth-handler', {
      body: {
        returnTo: `${window.location.origin}/settings?integration=google`,
      },
    })
    setConnectingProvider(null)

    if (error || !data?.authUrl) {
      toast({
        title: 'Não foi possível iniciar o Google',
        description:
          error?.message ||
          'Verifique se a função google-oauth-handler foi publicada e se as credenciais Google estão nos secrets.',
        variant: 'destructive',
      })
      return
    }

    window.location.href = data.authUrl
  }

  const handleSetupToast = (item: IntegrationItem) => {
    toast({
      title: `${item.name}: requisitos`,
      description:
        'Você precisa das credenciais OAuth no Google Cloud, da função google-oauth-handler publicada e dos secrets cadastrados no Supabase.',
    })
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card border-border/50">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Integrações reais</CardTitle>
              <CardDescription>
                Conecte serviços externos com aprovação do usuário antes de responder, excluir ou
                organizar dados sensíveis.
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="w-fit border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#9A761F]"
            >
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              Modo seguro
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-700">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Para uso real, tokens e segredos não devem ficar no navegador. Eles serão
                configurados como segredos do Supabase/servidor, e a tela abaixo apenas inicia a
                conexão autorizada.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {integrations.map((item) => {
              const displayStatus = connectedProvider === item.id ? 'ready' : item.status

              return (
                <Card key={item.name} className="border-border/60 bg-background/55 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#9A761F]">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <CardDescription>{item.provider}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className={statusClass[displayStatus]}>
                        {statusLabel[displayStatus]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.scopes.map((scope) => (
                        <Badge key={scope} variant="secondary" className="font-normal">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                    <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-sm">
                      <p className="font-medium text-foreground">Próximo passo</p>
                      <p className="mt-1 text-muted-foreground">{item.nextStep}</p>
                    </div>
                    <Button
                      variant={displayStatus === 'ready' ? 'outline' : 'default'}
                      className="w-full gap-2 bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90"
                      onClick={() => handleConnect(item)}
                      disabled={connectingProvider === item.id}
                    >
                      <ExternalLink className="h-4 w-4" />
                      {connectingProvider === item.id ? 'Abrindo Google...' : 'Configurar conexão'}
                    </Button>
                    {item.id === 'google' && (
                      <Button
                        variant="ghost"
                        className="w-full text-muted-foreground"
                        onClick={() => handleSetupToast(item)}
                      >
                        Ver requisitos
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Ordem recomendada para começar</CardTitle>
          <CardDescription>
            O caminho mais rápido para você usar a plataforma com dados reais.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {[
            'Configurar Supabase real e autenticação',
            'Conectar Gmail/Drive ou Outlook/OneDrive',
            'Ativar WhatsApp e pagamentos em produção',
          ].map((step, index) => (
            <div key={step} className="rounded-xl border border-border/60 bg-background/50 p-4">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#D4AF37] text-sm font-bold text-black">
                {index + 1}
              </div>
              <div className="flex items-start gap-2 text-sm font-medium">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                {step}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
