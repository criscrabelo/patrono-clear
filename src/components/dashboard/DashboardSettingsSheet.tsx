import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Globe, Lock, Crown, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface DashboardSettingsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DashboardSettingsSheet({ open, onOpenChange }: DashboardSettingsSheetProps) {
  const { user } = useAuth()
  const isPremium = user?.planType === 'Premium' || user?.isAdmin

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md border-l border-[#D4AF37]/20 glass-panel bg-background/95 backdrop-blur-xl overflow-y-auto z-[100]">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#D4AF37]" />
            Configurações Rápidas
          </SheetTitle>
          <SheetDescription>
            Ajuste suas preferências principais sem sair do painel.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Geral
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/50">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Notificações Push</Label>
                  <p className="text-xs text-muted-foreground">Alertas de organização.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/50">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Modo Silencioso</Label>
                  <p className="text-xs text-muted-foreground">Ocultar dicas da IA.</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Domínios e Aliases
            </h3>

            <div
              className={cn(
                'relative p-5 rounded-xl border transition-all duration-300 overflow-hidden',
                isPremium ? 'border-[#D4AF37]/50 bg-[#D4AF37]/5' : 'border-border/50 bg-muted/20',
              )}
            >
              {!isPremium && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-[2px]">
                  <Lock className="h-8 w-8 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium text-foreground mb-4 text-center px-4">
                    Recurso exclusivo para assinantes Premium.
                  </p>
                  <Button
                    asChild
                    size="sm"
                    className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 shadow-lg shadow-[#D4AF37]/20"
                  >
                    <Link to="/plans" onClick={() => onOpenChange(false)}>
                      <Crown className="h-4 w-4 mr-2" /> Fazer Upgrade
                    </Link>
                  </Button>
                </div>
              )}

              <div className={cn('space-y-4', !isPremium && 'opacity-30 pointer-events-none')}>
                <p className="text-xs text-muted-foreground">
                  Configure domínios personalizados para regras avançadas de limpeza de e-mail.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-background/50 p-2 rounded-lg border border-border/50">
                    <span className="text-sm font-medium">@patronojuridico.com.br</span>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Editar
                    </Button>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full h-9 text-xs border-dashed border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                >
                  + Adicionar Domínio
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col gap-3">
          <Button variant="outline" asChild className="w-full hover:bg-muted">
            <Link to="/settings" onClick={() => onOpenChange(false)}>
              Ver Todas as Configurações
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
