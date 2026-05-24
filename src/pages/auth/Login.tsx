import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, Loader2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { Logo } from '@/components/ui/logo'
import { toast } from '@/hooks/use-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      setIsLoading(true)
      const { error } = await signIn(email, password)
      setIsLoading(false)

      if (error) {
        toast({
          title: 'Erro no login',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Login realizado com sucesso',
          description: 'Bem-vindo de volta!',
        })
        navigate('/dashboard')
      }
    }
  }

  return (
    <div className="min-h-svh flex items-center justify-center overflow-x-hidden overflow-y-auto bg-background p-4 pb-28 sm:pb-4 relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C69C6D]/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-md z-10 animate-fade-in-up">
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <Logo className="mb-4 scale-110" />
          <p className="text-muted-foreground text-sm font-medium mt-2">
            Limpeza inteligente para sua vida digital
          </p>
        </div>

        <Card className="glass-card border-border/50 shadow-2xl shadow-primary/5">
          <CardHeader className="space-y-1 text-center pb-6">
            <CardTitle className="text-2xl font-bold">Acesso Seguro</CardTitle>
            <CardDescription className="text-base">
              Entre para organizar mensagens, mídia e documentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2 relative">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="aneccr@hotmail.com"
                    className="pl-9 h-11 bg-background/50"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-[#9A761F] transition-colors hover:text-[#D4AF37] hover:underline"
                  >
                    Esqueci a senha
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="pl-9 pr-11 h-11 bg-background/50"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              <Button
                type="submit"
                className="w-full h-11 text-base shadow-md bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-semibold"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Entrar'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t border-border/50 px-6 pb-6 pt-5">
            <p className="text-sm text-muted-foreground text-center">
              Ainda não tem conta no Patrono Clear?
            </p>
            <Button variant="outline" asChild className="w-full h-11 bg-background/50">
              <Link to="/register">
                <UserPlus className="h-4 w-4 mr-2" />
                Criar conta de novo usuário
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
