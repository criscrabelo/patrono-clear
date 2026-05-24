import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

const data = [
  { name: 'Ocupado Essencial', value: 120, color: 'hsl(var(--muted))' },
  { name: 'Recuperável', value: 42.8, color: 'hsl(var(--success))' },
  { name: 'Livre', value: 250, color: 'hsl(var(--primary))' },
]

const config = {
  value: { label: 'GB' },
}

export function StorageChart() {
  const total = data.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <Card className="glass-card h-full flex flex-col border-border/50">
      <CardHeader>
        <CardTitle>Armazenamento Total</CardTitle>
        <CardDescription>Consolidado de todas as fontes ({total.toFixed(1)} GB)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center min-h-[250px]">
        <ChartContainer config={config} className="h-full w-full max-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
