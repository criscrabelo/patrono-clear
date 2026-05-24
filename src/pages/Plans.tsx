import { useState } from 'react'
import { ArrowRight, CalendarDays, CheckCircle2, CreditCard, Loader2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import useUserStore, { PlanType } from '@/stores/useUserStore'
import { toast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

const PLAN_OPTIONS = [
  {
    id: 'Essential' as PlanType,
    name: 'Essencial',
    price: 'R$ 29,90',
    period: '/mês',
    desc: 'Limpeza e organização básica de rotina.',
    features: [
      '7 dias grátis com cartão cadastrado',
      'Até 50GB de arquivos organizados',
      'Triagem básica de e-mails e WhatsApp',
      'Busca de duplicados em documentos e mídia',
    ],
  },
  {
    id: 'Premium' as PlanType,
    name: 'Premium',
    price: 'R$ 49,90',
    period: '/mês',
    desc: 'O pacote completo de inteligência digital.',
    features: [
      '7 dias grátis com cartão cadastrado',
      'Organização de fotos, vídeos e documentos com IA',
      'Resposta, arquivo e exclusão segura de mensagens',
      'Comparação visual de duplicados',
      'Prioridade de Processamento',
    ],
  },
]

export default function Plans() {
  const { user, login } = useAuth()
  const { updatePlanType, updateExpirationDate, updateStatus } = useUserStore()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlan || !user) return

    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 2000))

    // Trial starts now; billing continuity is handled by the payment provider in production.
    const newExp = new Date()
    newExp.setDate(newExp.getDate() + 7)

    updatePlanType(user.id, selectedPlan)
    updateExpirationDate(user.id, newExp.toISOString())
    if (user.status !== 'Approved') {
      updateStatus(user.id, 'Approved')
    }

    // Force context refresh by simulating login with same email
    login(user.email)

    setIsProcessing(false)
    setSelectedPlan(null)

    toast({
      title: 'Teste grátis ativado!',
      description: `Seu plano ${selectedPlan} fica gratuito até ${newExp.toLocaleDateString('pt-BR')}. O cartão já está cadastrado para a continuidade.`,
      className: 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]',
    })
    navigate('/dashboard')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in-up pb-12 mt-4">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-sm font-medium mb-2">
          <ShieldCheck className="h-4 w-4" /> 7 dias grátis com cartão cadastrado
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Comece grátis e escolha seu plano
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          O cartão é cadastrado no início, mas a cobrança só começa após os 7 dias gratuitos.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {PLAN_OPTIONS.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              'glass-card relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
              plan.id === 'Premium'
                ? 'border-[#D4AF37]/50 shadow-[#D4AF37]/10'
                : 'border-border/50',
            )}
          >
            {plan.id === 'Premium' && (
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D4AF37]/50 via-[#D4AF37] to-[#D4AF37]/50" />
            )}
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-base h-10">{plan.desc}</CardDescription>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground font-medium">{plan.period}</span>
              </div>
              <div className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-600">
                <CalendarDays className="h-4 w-4" />
                7 dias grátis
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                R$ 0 hoje. Cadastre o cartão agora para manter o acesso depois do teste.
              </p>
            </CardHeader>
            <CardContent className="pb-6">
              <ul className="space-y-3">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2
                      className={cn(
                        'h-5 w-5',
                        plan.id === 'Premium' ? 'text-[#D4AF37]' : 'text-primary',
                      )}
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={cn(
                  'w-full h-12 text-base',
                  plan.id === 'Premium'
                    ? 'bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90'
                    : 'bg-background hover:bg-muted',
                )}
                variant={plan.id === 'Premium' ? 'default' : 'outline'}
                onClick={() => setSelectedPlan(plan.id)}
              >
                Começar 7 dias grátis <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedPlan} onOpenChange={(o) => !o && setSelectedPlan(null)}>
        <DialogContent className="sm:max-w-[425px] glass-panel border-[#D4AF37]/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CreditCard className="h-5 w-5 text-[#D4AF37]" /> Ativar 7 dias grátis
            </DialogTitle>
            <DialogDescription>
              Cadastre o cartão para iniciar o plano <strong>{selectedPlan}</strong> na conta{' '}
              <span className="font-medium text-foreground">{user?.email}</span>. Nada é cobrado
              hoje.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCheckout} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome no Cartão</Label>
              <Input
                required
                placeholder="Ex: JOAO M SILVA"
                className="bg-background/50 focus-visible:ring-[#D4AF37]"
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-2">
              <Label>Número do Cartão</Label>
              <Input
                required
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                className="bg-background/50 font-mono focus-visible:ring-[#D4AF37]"
                disabled={isProcessing}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Validade</Label>
                <Input
                  required
                  placeholder="MM/AA"
                  maxLength={5}
                  className="bg-background/50 focus-visible:ring-[#D4AF37]"
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label>CVC</Label>
                <Input
                  required
                  type="password"
                  placeholder="123"
                  maxLength={4}
                  className="bg-background/50 focus-visible:ring-[#D4AF37]"
                  disabled={isProcessing}
                />
              </div>
            </div>
            <DialogFooter className="mt-6 border-t border-border/50 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setSelectedPlan(null)}
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isProcessing}
                className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 shadow-lg shadow-[#D4AF37]/20 w-full sm:w-auto"
              >
                {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {isProcessing ? 'Processando...' : 'Cadastrar cartão e iniciar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
