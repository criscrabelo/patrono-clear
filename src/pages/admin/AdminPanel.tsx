import { useState, useMemo } from 'react'
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  TrendingUp,
  Search,
  Filter,
  PieChart as PieChartIcon,
  Calendar as CalendarIcon,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useUserStore, { UserRecord, UserStatus, PlanType } from '@/stores/useUserStore'
import useAppStore from '@/stores/useAppStore'
import { toast } from '@/hooks/use-toast'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartData = [
  { month: 'Jan', users: 15 },
  { month: 'Fev', users: 28 },
  { month: 'Mar', users: 45 },
  { month: 'Abr', users: 62 },
  { month: 'Mai', users: 95 },
  { month: 'Jun', users: 134 },
]

const getStatusBadge = (status: UserStatus) => {
  switch (status) {
    case 'Approved':
      return (
        <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20 hover:bg-[#D4AF37]/20 font-medium px-2.5 py-1">
          <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Aprovado
        </Badge>
      )
    case 'Pending':
      return (
        <Badge
          variant="outline"
          className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 font-medium px-2.5 py-1"
        >
          <Clock className="w-3.5 h-3.5 mr-1.5" /> Pendente
        </Badge>
      )
    case 'Rejected':
      return (
        <Badge
          variant="outline"
          className="bg-red-500/10 text-red-500 border-red-500/20 font-medium px-2.5 py-1"
        >
          <XCircle className="w-3.5 h-3.5 mr-1.5" /> Rejeitado
        </Badge>
      )
  }
}

function UserRow({ user }: { user: UserRecord }) {
  const { updateStatus, updatePlanType, updateNotes, updateExpirationDate } = useUserStore()
  const { addNotification } = useAppStore()
  const [notes, setNotes] = useState(user.notes)
  const [isNotesOpen, setIsNotesOpen] = useState(false)

  const initialExpDate = user.expirationDate ? user.expirationDate.split('T')[0] : ''
  const [expDate, setExpDate] = useState(initialExpDate)
  const [isExpOpen, setIsExpOpen] = useState(false)

  const handleSaveNotes = () => {
    updateNotes(user.id, notes)
    setIsNotesOpen(false)
    toast({ title: 'Observações atualizadas', description: 'As notas internas foram salvas.' })
  }

  const handleSaveExp = () => {
    if (!expDate) return
    const isoDate = new Date(`${expDate}T23:59:59Z`).toISOString()
    updateExpirationDate(user.id, isoDate)
    setIsExpOpen(false)
    toast({
      title: 'Data de Expiração Atualizada',
      description: `O plano de ${user.name} expira agora em ${new Date(isoDate).toLocaleDateString('pt-BR')}.`,
    })
  }

  const handleApprove = () => {
    updateStatus(user.id, 'Approved')
    addNotification({
      title: 'Acesso Liberado',
      message: `As instruções de acesso foram enviadas para ${user.email}.`,
    })
    toast({
      title: 'E-mail Enviado!',
      description: `O usuário ${user.email} foi aprovado.`,
      className: 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]',
    })
  }

  const isExpired = user.expirationDate && new Date(user.expirationDate).getTime() < Date.now()

  return (
    <TableRow className="border-b border-border/30 hover:bg-muted/20">
      <TableCell className="font-medium text-foreground py-4">{user.name}</TableCell>
      <TableCell className="text-muted-foreground py-4 text-xs lg:text-sm">{user.email}</TableCell>
      <TableCell className="py-4">
        <Select value={user.planType} onValueChange={(v) => updatePlanType(user.id, v as PlanType)}>
          <SelectTrigger className="h-8 w-[110px] bg-transparent border-border/50 text-xs font-medium focus:ring-[#D4AF37]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Trial">Trial</SelectItem>
            <SelectItem value="Essential">Essential</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="py-4">
        <Dialog open={isExpOpen} onOpenChange={setIsExpOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`h-8 px-2 text-xs w-[100px] justify-start ${isExpired ? 'border-destructive/50 text-destructive' : 'text-muted-foreground'}`}
            >
              <CalendarIcon className="h-3 w-3 mr-2 shrink-0" />
              {user.expirationDate
                ? new Date(user.expirationDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                : 'Definir'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] glass-panel border-border/50">
            <DialogHeader>
              <DialogTitle>Gerenciar Assinatura</DialogTitle>
              <DialogDescription>Modifique a data de expiração para {user.name}.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2">
              <Label>Data de Expiração</Label>
              <Input
                type="date"
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
                className="bg-background/50 border-border/50 focus-visible:ring-[#D4AF37]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsExpOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSaveExp}
                className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90"
              >
                Salvar Assinatura
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
      <TableCell className="py-4">{getStatusBadge(user.status)}</TableCell>
      <TableCell className="py-4">
        <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-[#D4AF37] transition-colors"
            >
              <FileText className="h-4 w-4 mr-1.5" />
              {user.notes ? 'Ver/Editar' : 'Adicionar'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] glass-panel border-border/50">
            <DialogHeader>
              <DialogTitle>Observações Internas</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione informações adicionais..."
                className="min-h-[120px] bg-background/50 border-border/50 focus-visible:ring-[#D4AF37]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNotesOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSaveNotes}
                className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90"
              >
                Salvar Notas
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
      <TableCell className="text-right py-4 pr-6">
        <div className="flex justify-end items-center gap-2">
          {user.status !== 'Approved' && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 bg-transparent transition-colors"
              onClick={handleApprove}
            >
              Aprovar
            </Button>
          )}
          {user.status !== 'Rejected' && user.email !== 'admin@patronoclear.com.br' && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-red-500/30 text-red-500 hover:bg-red-500/10 bg-transparent transition-colors"
              onClick={() => updateStatus(user.id, 'Rejected')}
            >
              Rejeitar
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}

export default function AdminPanel() {
  const { users } = useUserStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'All'>('All')
  const [planFilter, setPlanFilter] = useState<PlanType | 'All'>('All')

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        search === '' ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'All' || u.status === statusFilter
      const matchPlan = planFilter === 'All' || u.planType === planFilter
      return matchSearch && matchStatus && matchPlan
    })
  }, [users, search, statusFilter, planFilter])

  const planData = useMemo(
    () => [
      {
        name: 'Premium',
        value: users.filter((u) => u.planType === 'Premium').length,
        color: '#D4AF37',
      },
      {
        name: 'Essential',
        value: users.filter((u) => u.planType === 'Essential').length,
        color: '#64748b',
      },
      {
        name: 'Trial',
        value: users.filter((u) => u.planType === 'Trial').length,
        color: '#cbd5e1',
      },
    ],
    [users],
  )

  return (
    <div className="space-y-8 animate-fade-in-up pb-8 max-w-[1400px] mx-auto overflow-x-hidden">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Shield className="h-8 w-8 text-[#D4AF37]" /> Painel Administrativo
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Gerencie acessos, assinaturas e atividade dos clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 glass-card rounded-xl p-6 border-border/50 shadow-xl">
          <h2 className="text-lg font-bold mb-6 text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#D4AF37]" /> Crescimento de Usuários
          </h2>
          <div className="h-[250px] w-full">
            <ChartContainer
              config={{ users: { label: 'Aprovados', color: '#D4AF37' } }}
              className="h-full w-full"
            >
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="users"
                  fill="var(--color-users)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border-border/50 shadow-xl">
          <h2 className="text-lg font-bold mb-6 text-foreground flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-[#D4AF37]" /> Distribuição de Planos
          </h2>
          <div className="h-[200px] w-full flex items-center justify-center">
            <ChartContainer
              config={{ value: { label: 'Usuários' } }}
              className="h-full w-full max-h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {planData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs font-medium">
            {planData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background/50 border-border/50 focus-visible:ring-[#D4AF37]"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border/50 focus:ring-[#D4AF37]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Todos os Status</SelectItem>
            <SelectItem value="Approved">Aprovado</SelectItem>
            <SelectItem value="Pending">Pendente</SelectItem>
            <SelectItem value="Rejected">Rejeitado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={(v) => setPlanFilter(v as any)}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border/50 focus:ring-[#D4AF37]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Plano" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Todos os Planos</SelectItem>
            <SelectItem value="Trial">Trial</SelectItem>
            <SelectItem value="Essential">Essential</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="glass-card rounded-xl overflow-hidden border-border/50 shadow-xl">
        <div className="overflow-x-auto w-full">
          <Table className="w-full min-w-[900px]">
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50 whitespace-nowrap">
                <TableHead className="font-semibold text-foreground h-12">Usuário</TableHead>
                <TableHead className="font-semibold text-foreground h-12">E-mail</TableHead>
                <TableHead className="font-semibold text-foreground h-12">Plano</TableHead>
                <TableHead className="font-semibold text-foreground h-12">Expiração</TableHead>
                <TableHead className="font-semibold text-foreground h-12">Status</TableHead>
                <TableHead className="font-semibold text-foreground h-12">Observações</TableHead>
                <TableHead className="text-right font-semibold text-foreground h-12 pr-6">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum usuário encontrado na busca.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => <UserRow key={user.id} user={user} />)
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
