import { ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function Unauthorized() {
  const { logout } = useAuth()

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in-up max-w-2xl mx-auto text-center h-[calc(100vh-8rem)]">
      <div className="h-28 w-28 bg-background/50 rounded-full flex items-center justify-center mb-8 border border-[#D4AF37]/30 shadow-2xl relative">
        <ShieldAlert className="h-12 w-12 text-[#D4AF37] relative z-10" />
        <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-full blur-xl animate-pulse" />
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Acesso Restrito</h1>

      <p className="text-muted-foreground text-lg mb-8 leading-relaxed text-balance">
        Esta área é exclusiva para administradores do <strong>Patrono Clear</strong>. Sua conta pode
        usar a plataforma normalmente, mas não possui permissão para acessar a gestão administrativa.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button
          asChild
          size="lg"
          className="gap-2 shadow-lg shadow-[#D4AF37]/20 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-semibold border border-[#D4AF37] transition-all"
        >
          <a href="https://patronojuridico.com.br" target="_blank" rel="noopener noreferrer">
            Saber Mais <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={logout}
          className="gap-2 bg-background/50 border-border/80 hover:bg-muted"
        >
          Sair e Trocar de Conta <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
