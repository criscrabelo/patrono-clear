import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Smartphone, Monitor, Trash2 } from 'lucide-react'

const sessions = [
  {
    device: 'MacBook Pro',
    location: 'São Paulo, BR',
    time: 'Ativo agora',
    icon: Monitor,
    current: true,
  },
  {
    device: 'iPhone 14',
    location: 'Rio de Janeiro, BR',
    time: 'Há 2 horas',
    icon: Smartphone,
    current: false,
  },
]

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Sessões Ativas</CardTitle>
          <CardDescription>Gerencie os dispositivos conectados à sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.map((session, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-secondary rounded-md">
                  <session.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm flex items-center gap-2">
                    {session.device}
                    {session.current && (
                      <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                        Atual
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {session.location} • {session.time}
                  </p>
                </div>
              </div>
              {!session.current && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  Encerrar
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass-card border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
          <CardDescription>Ações destrutivas para sua conta.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" className="gap-2 shadow-md shadow-destructive/20">
            <Trash2 className="h-4 w-4" />
            Excluir Conta Permanentemente
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
