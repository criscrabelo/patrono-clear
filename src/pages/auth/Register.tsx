import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  Loader2,
  Mail,
  User as UserIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Logo } from '@/components/ui/logo'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          billing_method: 'card_on_file',
          trial_days: 7,
        },
      },
    })

    setIsLoading(false)

    if (error) {
      toast({ title: 'Erro ao criar conta', description: error.message, variant: 'destructive' })
    } else {
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Bem-vindo ao Patrono Clear.',
      })

      if (data.session) {
        navigate('/dashboard')
      } else {
        navigate('/login')
      }
    }
  }

  return (
    <div className="min-h-svh flex items-center justify-center overflow-x-hidden overflow-y-auto bg-background p-4 pb-28 sm:pb-4 relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C69C6D]/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-lg z-10 animate-fade-in-up">
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <Logo className="mb-4 scale-110" />
          <p className="text-muted-foreground text-sm font-medium">
            Limpeza inteligente para toda a sua vida digital
          </p>
        </div>

        <Card className="glass-card border-border/50 shadow-2xl shadow-primary/5">
          <CardHeader className="space-y-1 text-center pb-6">
            <CardTitle className="text-2xl font-bold">Cadastro de novo usuário</CardTitle>
            <CardDescription className="text-base">
              Cadastre seus dados e ative 7 dias grátis com cartão
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-700">
                <div className="flex items-center gap-2 font-semibold">
                  <CalendarDays className="h-4 w-4" />
                  Uso gratuito por 7 dias
                </div>
                <p className="mt-1 text-emerald-700/80">
                  R$ 0 hoje. O cartão é solicitado no início para manter a assinatura ativa após o
                  período gratuito.
                </p>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="name">Nome Completo</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="João da Silva"
                    className="pl-9 h-11 bg-background/50"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m@exemplo.com"
                    className="pl-9 h-11 bg-background/50"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-11 h-11 bg-background/50"
                    required
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/70"
                    onClick={() => setShowPassword((current) => !current)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/40 p-4 space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <CreditCard className="h-4 w-4 text-[#C69C6D]" />
                  Cartão para ativar o teste grátis
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardName">Nome no cartão</Label>
                  <Input
                    id="cardName"
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="JOAO DA SILVA"
                    className="h-11 bg-background/50"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número do cartão</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="h-11 bg-background/50 font-mono"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="cardExpiry">Validade</Label>
                    <Input
                      id="cardExpiry"
                      type="text"
                      inputMode="numeric"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/AA"
                      maxLength={5}
                      className="h-11 bg-background/50"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardCvc">CVC</Label>
                    <Input
                      id="cardCvc"
                      type="password"
                      inputMode="numeric"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="123"
                      maxLength={4}
                      className="h-11 bg-background/50"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-11 text-base shadow-md mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  'Criar conta e iniciar 7 dias grátis'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <div className="text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-[#C69C6D] hover:underline font-semibold">
                Entrar
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
