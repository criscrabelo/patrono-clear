import { Link, Navigate } from 'react-router-dom'
import {
  HardDrive,
  Mail,
  Image as ImageIcon,
  Copy,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { Logo } from '@/components/ui/logo'
import { Skeleton } from '@/components/ui/skeleton'

export default function Index() {
  const { isAuthenticated, loading } = useAuth()

  // Loading state handling
  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    )
  }

  // Redirect based on authorization status if logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-svh bg-background flex flex-col font-sans selection:bg-primary/20 text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-panel border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="hidden sm:flex hover:text-primary">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
            >
              <Link to="/register">Começar Grátis</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
          <div className="container mx-auto px-4 text-center z-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background border border-border shadow-sm text-sm font-medium mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#C69C6D] animate-pulse"></span>
              Plataforma Premium de Organização
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto mb-6 text-balance leading-tight">
              Limpeza inteligente para <br className="hidden md:block" /> toda a sua vida digital
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance leading-relaxed">
              Organize fotos, imagens, vídeos e documentos, limpe e-mails, responda WhatsApp,
              remova duplicados e resolva mensagens pendentes com segurança.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="h-14 px-8 text-lg gap-2 w-full sm:w-auto shadow-xl shadow-primary/20 hover:-translate-y-0.5 transition-transform"
                asChild
              >
                <Link to="/register">
                  Começar Organização <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg w-full sm:w-auto bg-background/50 hover:bg-muted/50 border-border/80"
                asChild
              >
                <Link to="/login">Acessar Conta</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-muted/30 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Tudo o que você precisa em um só lugar</h2>
              <p className="text-muted-foreground text-lg">
                Ferramentas especializadas impulsionadas por inteligência artificial para limpar e
                organizar todas as áreas da sua vida digital.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: ImageIcon,
                  title: 'Fotos Inteligentes',
                  desc: 'IA que categoriza e estrutura suas memórias por eventos, datas e locais automaticamente.',
                },
                {
                  icon: Mail,
                  title: 'E-mails e WhatsApp',
                  desc: 'Separe mensagens importantes, prepare respostas, arquive registros e descarte ruído.',
                },
                {
                  icon: Copy,
                  title: 'Busca de Duplicados',
                  desc: 'Comparação visual avançada que sugere e mantém a versão de maior qualidade.',
                },
                {
                  icon: HardDrive,
                  title: 'Documentos e Vídeos',
                  desc: 'Classifique arquivos úteis, compacte materiais antigos e remova cópias sem valor.',
                },
              ].map((feat, i) => (
                <div
                  key={i}
                  className="glass-card p-8 rounded-2xl border border-border/50 hover:shadow-lg transition-shadow"
                >
                  <div className="h-12 w-12 rounded-xl bg-[#C69C6D]/10 flex items-center justify-center mb-6">
                    <feat.icon className="h-6 w-6 text-[#C69C6D]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feat.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background py-12 relative z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="text-sm font-medium text-muted-foreground/80">
              Limpeza inteligente para toda a sua vida digital
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Patrono Clear. Uma solução{' '}
            <a
              href="https://patronojuridico.com.br"
              target="_blank"
              rel="noreferrer"
              className="text-[#C69C6D] hover:underline font-medium"
            >
              Patrono Clear
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  )
}
