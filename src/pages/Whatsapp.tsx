import { useMemo, useState } from 'react'
import {
  Ban,
  Bell,
  CheckCircle2,
  MessageCircle,
  Pencil,
  Search,
  Sparkles,
  UserRound,
  XCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

type ApprovalStatus = 'Pendente' | 'Aprovada' | 'Reprovada' | 'Não responder'

interface WhatsappChat {
  id: string
  contact: string
  phone: string
  message: string
  context: string
  time: string
  category: string
  priority: 'Alta' | 'Média' | 'Baixa'
  suggestedResponse: string
  approvalStatus: ApprovalStatus
}

const initialChats: WhatsappChat[] = [
  {
    id: '1',
    contact: 'Mariana Costa',
    phone: '+55 11 98888-1010',
    message: 'Bom dia! Você conseguiu verificar o documento que enviei ontem?',
    context: 'Documento pendente de revisão',
    time: '09:42',
    category: 'Cliente',
    priority: 'Alta',
    suggestedResponse:
      'Olá, Mariana. Recebi sua mensagem e vou verificar o documento ainda hoje. Assim que concluir a revisão, retorno com a posição objetiva.',
    approvalStatus: 'Pendente',
  },
  {
    id: '2',
    contact: 'Grupo Família',
    phone: 'Grupo',
    message: 'Alguém tem as fotos do aniversário para compartilhar?',
    context: 'Fotos podem ser organizadas em álbum',
    time: 'Ontem',
    category: 'Fotos',
    priority: 'Média',
    suggestedResponse:
      'Tenho algumas fotos aqui. Vou organizar as melhores em um álbum e envio o link para o grupo.',
    approvalStatus: 'Pendente',
  },
  {
    id: '3',
    contact: 'Fornecedor Certificados',
    phone: '+55 21 97777-3030',
    message: 'Segue comprovante e nota em PDF. Podemos arquivar?',
    context: 'Anexo identificado como documento útil',
    time: '22/05',
    category: 'Documento',
    priority: 'Média',
    suggestedResponse:
      'Pode arquivar, por favor. Vou manter o comprovante e a nota na pasta de documentos para conferência futura.',
    approvalStatus: 'Pendente',
  },
  {
    id: '4',
    contact: 'Promoções Loja',
    phone: '+55 11 90000-0000',
    message: 'Oferta relâmpago só hoje com cupom exclusivo!',
    context: 'Mensagem promocional de baixa relevância',
    time: '21/05',
    category: 'Ruído',
    priority: 'Baixa',
    suggestedResponse: 'Não há resposta recomendada. Mensagem classificada como promocional.',
    approvalStatus: 'Não responder',
  },
]

export default function Whatsapp() {
  const [chats, setChats] = useState(initialChats)
  const [search, setSearch] = useState('')
  const [selectedChat, setSelectedChat] = useState<WhatsappChat | null>(null)
  const [draft, setDraft] = useState('')

  const visibleChats = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return chats
    return chats.filter((chat) =>
      [chat.contact, chat.phone, chat.message, chat.context, chat.category, chat.suggestedResponse].some(
        (value) => value.toLowerCase().includes(term),
      ),
    )
  }, [chats, search])

  const counters = useMemo(
    () => ({
      pending: chats.filter((chat) => chat.approvalStatus === 'Pendente').length,
      approved: chats.filter((chat) => chat.approvalStatus === 'Aprovada').length,
      rejected: chats.filter((chat) => chat.approvalStatus === 'Reprovada').length,
      noReply: chats.filter((chat) => chat.approvalStatus === 'Não responder').length,
    }),
    [chats],
  )

  const updateStatus = (chat: WhatsappChat, approvalStatus: ApprovalStatus) => {
    setChats((current) =>
      current.map((item) => (item.id === chat.id ? { ...item, approvalStatus } : item)),
    )

    const title =
      approvalStatus === 'Aprovada'
        ? 'Resposta aprovada'
        : approvalStatus === 'Reprovada'
          ? 'Resposta reprovada'
          : approvalStatus === 'Não responder'
            ? 'Marcado para não responder'
            : 'Conversa voltou para pendente'

    toast({
      title,
      description: `${chat.contact}: ${chat.message}`,
    })
  }

  const openEdit = (chat: WhatsappChat) => {
    setSelectedChat(chat)
    setDraft(chat.suggestedResponse)
  }

  const saveDraft = () => {
    if (!selectedChat) return
    setChats((current) =>
      current.map((item) =>
        item.id === selectedChat.id
          ? { ...item, suggestedResponse: draft, approvalStatus: 'Pendente' }
          : item,
      ),
    )
    toast({
      title: 'Resposta atualizada',
      description: `A resposta para ${selectedChat.contact} voltou para sua aprovação.`,
    })
    setSelectedChat(null)
    setDraft('')
  }

  const statusClass = (status: ApprovalStatus) =>
    cn(
      status === 'Aprovada' && 'border-emerald-500/40 text-emerald-600',
      status === 'Reprovada' && 'border-rose-500/40 text-rose-600',
      status === 'Não responder' && 'border-slate-400/50 text-slate-600',
      status === 'Pendente' && 'border-amber-500/40 text-amber-600',
    )

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Autorizar WhatsApp</h1>
          <p className="text-muted-foreground mt-1">
            Veja quem mandou mensagem, revise a resposta sugerida e autorize cada envio.
          </p>
        </div>
        <Button className="gap-2 bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90">
          <Sparkles className="h-4 w-4" />
          Ler Conversas
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
            <Bell className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counters.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">Aguardando sua decisão</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aprovadas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counters.approved}</div>
            <p className="text-xs text-muted-foreground mt-1">Autorizadas por você</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reprovadas</CardTitle>
            <XCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counters.rejected}</div>
            <p className="text-xs text-muted-foreground mt-1">Precisam de ajuste</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Não responder</CardTitle>
            <Ban className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counters.noReply}</div>
            <p className="text-xs text-muted-foreground mt-1">Sem envio autorizado</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar contato, telefone, mensagem ou resposta..."
          className="pl-9 bg-background/50"
        />
      </div>

      <div className="space-y-4">
        {visibleChats.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center bg-muted/20 rounded-xl border border-dashed border-border/50">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
            <h3 className="text-lg font-semibold">Nada para revisar</h3>
            <p className="text-muted-foreground max-w-md mt-2">
              Nenhuma conversa encontrada com os filtros atuais.
            </p>
          </div>
        ) : (
          visibleChats.map((chat) => (
            <Card key={chat.id} className="glass-card border-border/50">
              <CardContent className="p-4 sm:p-5 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <MessageCircle className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-muted-foreground">Mensagem de</span>
                      <h3 className="font-semibold truncate">{chat.contact}</h3>
                      <Badge
                        variant="outline"
                        className={cn(
                          chat.priority === 'Alta' && 'border-rose-500/40 text-rose-600',
                          chat.priority === 'Média' && 'border-amber-500/40 text-amber-600',
                        )}
                      >
                        {chat.priority}
                      </Badge>
                      <Badge variant="secondary">{chat.category}</Badge>
                      <Badge variant="outline" className={statusClass(chat.approvalStatus)}>
                        {chat.approvalStatus}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                      <UserRound className="h-3.5 w-3.5" />
                      {chat.phone} • {chat.time}
                    </p>

                    <div className="rounded-xl border border-border/50 bg-background/50 p-4">
                      <p className="text-xs font-medium uppercase text-muted-foreground mb-2">
                        Mensagem recebida
                      </p>
                      <p className="text-sm text-foreground">{chat.message}</p>
                      <p className="text-xs text-muted-foreground/80 mt-2">{chat.context}</p>
                    </div>

                    <div className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-4">
                      <p className="text-xs font-medium uppercase text-[#9A761F] mb-2">
                        Resposta sugerida para sua autorização
                      </p>
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                        {chat.suggestedResponse}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-end border-t border-border/50 pt-4">
                  <Button variant="outline" size="sm" onClick={() => openEdit(chat)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar resposta
                  </Button>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => updateStatus(chat, 'Aprovada')}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Aprovar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => updateStatus(chat, 'Reprovada')}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Reprovar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => updateStatus(chat, 'Não responder')}>
                    <Ban className="h-4 w-4 mr-2" />
                    Não responder
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!selectedChat} onOpenChange={(open) => !open && setSelectedChat(null)}>
        <DialogContent className="sm:max-w-[620px] glass-panel border-border/50">
          <DialogHeader>
            <DialogTitle>Editar resposta para {selectedChat?.contact}</DialogTitle>
            <DialogDescription>{selectedChat?.message}</DialogDescription>
          </DialogHeader>
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="min-h-[220px] bg-background/70"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedChat(null)}>
              Cancelar
            </Button>
            <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90" onClick={saveDraft}>
              Salvar e revisar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
