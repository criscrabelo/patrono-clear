import { useState } from 'react'
import { Bell, Search, RefreshCw } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from '@/hooks/use-toast'
import useAppStore from '@/stores/useAppStore'
import { cn } from '@/lib/utils'

export function Header() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [search, setSearch] = useState('')
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useAppStore()

  const handleSync = () => {
    setIsSyncing(true)
    toast({
      title: 'Sincronização Iniciada',
      description: 'Verificando novas atualizações em todos os provedores.',
    })
    setTimeout(() => {
      setIsSyncing(false)
      toast({
        title: 'Sincronização Concluída',
        description: 'Todos os seus serviços estão atualizados.',
      })
    }, 2000)
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-border/50 glass-panel px-4 sm:px-6">
      <SidebarTrigger className="-ml-2 sm:hidden" />

      <div className="flex flex-1 items-center gap-4 sm:gap-6">
        <div className="w-full max-w-md relative hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar arquivos, e-mails ou configurações..."
            className="w-full pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/50 transition-all focus:bg-background"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
            className="hidden sm:flex gap-2 bg-background/50 transition-all"
          >
            <RefreshCw className={cn('h-3 w-3', isSyncing && 'animate-spin')} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-foreground"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 glass-panel border-border/50 shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/50">
                <h4 className="font-semibold text-sm">Notificações</h4>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Marcar lidas
                  </Button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                {notifications.length === 0 ? (
                  <p className="text-sm text-center text-muted-foreground py-6">
                    Nenhuma notificação no momento.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={cn(
                        'p-3 rounded-md text-sm cursor-pointer transition-colors',
                        n.read ? 'hover:bg-muted/50' : 'bg-primary/5 hover:bg-primary/10',
                      )}
                    >
                      <p
                        className={cn(
                          'font-medium',
                          n.read ? 'text-foreground/80' : 'text-foreground',
                        )}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/50 mt-2">
                        {new Date(n.date).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  )
}
