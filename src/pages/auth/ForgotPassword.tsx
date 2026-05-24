import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, Loader2 } from 'lucide-react'
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
import { toast } from '@/hooks/use-toast'
import { Logo } from '@/components/ui/logo'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsLoading(false)
      setIsSent(true)
      toast({
        title: 'Email enviado',
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      })
    }
  }

  return (
    <div className="min-h-svh flex items-center justify-center overflow-x-hidden overflow-y-auto bg-background p-4 pb-28 sm:pb-4 relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C69C6D]/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-md z-10 animate-fade-in-up">
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <Logo className="mb-4 scale-110" />
          <p className="text-muted-foreground text-sm font-medium">
            Limpeza inteligente para toda a sua vida digital
          </p>
        </div>

        <Card className="glass-card border-border/50 shadow-2xl shadow-primary/5">
          <CardHeader className="space-y-1 text-center pb-6">
            <CardTitle className="text-2xl font-bold">Recuperar Senha</CardTitle>
            <CardDescription className="text-base">
              {isSent
                ? 'Enviamos as instruções para o seu e-mail.'
                : 'Digite seu e-mail para receber um link de redefinição.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isSent ? (
              <form onSubmit={handleReset} className="space-y-5">
                <div className="space-y-2 relative">
                  <Label htmlFor="email">E-mail de Cadastro</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@exemplo.com"
                      className="pl-9 h-11 bg-background/50"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 text-base shadow-md mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                  Enviar Link
                </Button>
              </form>
            ) : (
              <Button variant="outline" className="w-full h-11" onClick={() => setIsSent(false)}>
                Tentar outro e-mail
              </Button>
            )}
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <Button variant="ghost" asChild className="text-sm font-medium hover:text-[#C69C6D]">
              <Link to="/login">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para o Login
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
