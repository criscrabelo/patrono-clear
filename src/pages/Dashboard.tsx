import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Archive,
  Files,
  HardDrive,
  MailCheck,
  Reply,
  Trash2,
  PieChart as PieChartIcon,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b']

export default function Dashboard() {
  const [stats, setStats] = useState({ recoverableGb: 0, itemsCount: 0, actionCount: 0 })
  const [recent, setRecent] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)

        const cleanupItems = data || []
        const recoverableGb = cleanupItems.reduce((acc, item) => acc + Math.abs(item.value), 0)

        setStats({
          recoverableGb,
          itemsCount: cleanupItems.length,
          actionCount: cleanupItems.filter((item) => item.sync_status === 'pending').length,
        })

        setRecent(cleanupItems.slice(0, 5))

        const categoryData = cleanupItems.reduce((acc: any, item) => {
          const cat = item.cat || 'Outros'
          if (!acc[cat]) acc[cat] = 0
          acc[cat] += Math.abs(item.value)
          return acc
        }, {})

        const formattedChartData = Object.keys(categoryData)
          .map((key) => ({
            name: key,
            value: categoryData[key],
          }))
          .sort((a, b) => b.value - a.value)

        setChartData(formattedChartData)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando dados...</div>
    )
  }

  const formatStorage = (val: number) =>
    val < 1 ? `${Math.round(val * 1024)} MB` : `${val.toFixed(1).replace('.', ',')} GB`

  const actionIcon = (type: string) => {
    if (type === 'reply') return <Reply className="h-4 w-4" />
    if (type === 'archive') return <Archive className="h-4 w-4" />
    return <Trash2 className="h-4 w-4" />
  }

  return (
    <div className="space-y-8 pb-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel de Limpeza Digital</h1>
          <p className="text-muted-foreground mt-1">
            E-mails, WhatsApp, fotos, vídeos, documentos e arquivos sob controle.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-medium" asChild>
            <Link to="/emails">Triar E-mails</Link>
          </Button>
          <Button variant="outline" className="bg-background/50" asChild>
            <Link to="/whatsapp">Responder WhatsApp</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Espaço Recuperável
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <HardDrive className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatStorage(stats.recoverableGb)}</div>
            <p className="text-xs text-muted-foreground mt-1">Entre e-mails, mídia e documentos</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Itens Analisados</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Files className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.itemsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Arquivos, conversas e anexos</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ações Sugeridas</CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <MailCheck className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{stats.actionCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Responder, acompanhar ou arquivar</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="glass-card h-full flex flex-col border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Volume por Categoria</CardTitle>
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="h-[300px]">
              {chartData.length > 0 ? (
                <ChartContainer config={{}} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {chartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatStorage(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  Nenhum item analisado até agora.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="glass-card h-full border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recent.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma atividade encontrada.</p>
                ) : (
                  recent.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${item.type === 'delete' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}
                      >
                        {actionIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.desc}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {item.cat} • {item.date}
                        </p>
                      </div>
                      <div className="text-sm font-semibold whitespace-nowrap">
                        {formatStorage(Math.abs(item.value))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
