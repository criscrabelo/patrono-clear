import { HardDrive, Image as ImageIcon, Copy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const metrics = [
  {
    title: 'Espaço Recuperável',
    value: '42.8 GB',
    description: '+2.4 GB esta semana',
    icon: HardDrive,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    title: 'Fotos Organizadas',
    value: '8,432',
    description: '12 novos álbuns gerados',
    icon: ImageIcon,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    title: 'Duplicados Encontrados',
    value: '1,240',
    description: 'Economia potencial: 15 GB',
    icon: Copy,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
]

export function MetricCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.title} className="glass-card border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <div className={cn('p-2 rounded-lg', metric.bg)}>
              <metric.icon className={cn('h-4 w-4', metric.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
