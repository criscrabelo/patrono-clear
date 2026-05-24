import { Outlet, Link } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { Header } from '@/components/layout/Header'
import { useAuth } from '@/contexts/AuthContext'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

export default function Layout() {
  const { user } = useAuth()

  let daysUntilExp = null
  if (user?.expirationDate) {
    const diff = new Date(user.expirationDate).getTime() - Date.now()
    daysUntilExp = Math.ceil(diff / (1000 * 3600 * 24))
  }

  const isNearingExpiration = daysUntilExp !== null && daysUntilExp <= 7 && daysUntilExp > 0
  const isExpired = user?.isExpired && !user?.isAdmin

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full bg-background selection:bg-primary/20">
        <AppSidebar />
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-4 pb-28 sm:p-6 sm:pb-28 lg:p-8 lg:pb-28 max-w-7xl mx-auto w-full animate-fade-in-up">
            {isNearingExpiration && (
              <Alert className="mb-6 bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/50 shadow-sm">
                <AlertTriangle className="h-4 w-4 !text-[#D4AF37]" />
                <AlertTitle className="font-bold tracking-tight">
                  Assinatura Próxima do Fim
                </AlertTitle>
                <AlertDescription className="text-[#D4AF37]/80 mt-1 font-medium">
                  Sua assinatura expirará em {daysUntilExp} dia(s).{' '}
                  <Link
                    to="/plans"
                    className="font-bold underline hover:text-[#D4AF37] transition-colors ml-1"
                  >
                    Renove agora
                  </Link>{' '}
                  para não perder acesso aos recursos premium.
                </AlertDescription>
              </Alert>
            )}

            {isExpired && (
              <Alert
                variant="destructive"
                className="mb-6 shadow-sm border-destructive/30 bg-destructive/5"
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="font-bold tracking-tight">Assinatura Expirada</AlertTitle>
                <AlertDescription className="mt-1 font-medium text-destructive/90">
                  Sua assinatura expirou e seu acesso aos módulos premium foi temporariamente
                  bloqueado.{' '}
                  <Link
                    to="/plans"
                    className="font-bold underline hover:text-destructive transition-colors ml-1"
                  >
                    Assine um plano
                  </Link>{' '}
                  para restaurar o acesso completo à plataforma Patrono Clear.
                </AlertDescription>
              </Alert>
            )}

            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
