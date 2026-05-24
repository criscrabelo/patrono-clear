import { CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const services = [
  {
    name: 'Google Drive',
    status: 'online',
    lastSync: 'Há 5 min',
    logo: 'https://img.usecurling.com/i?q=google&color=multicolor',
  },
  {
    name: 'OneDrive',
    status: 'online',
    lastSync: 'Há 1 hora',
    logo: 'https://img.usecurling.com/i?q=cloud&color=blue',
  },
  {
    name: 'Locaweb',
    status: 'online',
    lastSync: 'Há 2 horas',
    logo: 'https://img.usecurling.com/i?q=server&color=red',
  },
]

export function ServiceStatus() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <Card
          key={service.name}
          className="border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#D4AF37]/50 group bg-card/60 backdrop-blur-sm"
        >
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-11 w-11 bg-background rounded-xl p-2.5 flex items-center justify-center shrink-0 border border-border/50 shadow-sm group-hover:border-[#D4AF37]/50 transition-colors">
                <img
                  src={service.logo}
                  alt={service.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-[14px] text-foreground truncate">
                  {service.name}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full shrink-0 shadow-sm',
                      service.status === 'online' ? 'bg-emerald-500' : 'bg-destructive',
                    )}
                  />
                  <span className="text-[12px] font-medium text-muted-foreground capitalize truncate">
                    {service.status}
                  </span>
                  <span className="text-[10px] text-muted-foreground/40">•</span>
                  <span className="text-[12px] text-muted-foreground truncate">
                    {service.lastSync}
                  </span>
                </div>
              </div>
            </div>
            {service.status === 'online' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 opacity-90 stroke-[2.5]" />
            ) : (
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 opacity-90 stroke-[2.5]" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
