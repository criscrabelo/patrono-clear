import { useMemo, useState } from 'react'
import { Archive, Mail, MailCheck, Reply, Search, Send, Sparkles, Trash2 } from 'lucide-react'
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

type EmailAction = 'Responder' | 'Arquivar' | 'Excluir'

interface EmailItem {
  id: string
  from: string
  subject: string
  preview: string
  date: string
  size: string
  category: string
  suggestedAction: EmailAction
  priority: 'Alta' | 'Média' | 'Baixa'
}

const initialEmails: EmailItem[] = [
  {
    id: '1',
    from: 'cliente@empresa.com.br',
    subject: 'Contrato para validação final',
    preview: 'Segue a minuta atualizada para conferência antes da assinatura.',
    date: 'Hoje',
    size: '4.2 MB',
    category: 'Cliente',
    suggestedAction: 'Responder',
    priority: 'Alta',
  },
  {
    id: '2',
    from: 'newsletter@varejo.com',
    subject: 'Ofertas da semana',
    preview: 'Promoções, cupons e recomendações baseadas em acessos antigos.',
    date: 'Ontem',
    size: '1.1 MB',
    category: 'Newsletter',
    suggestedAction: 'Excluir',
    priority: 'Baixa',
  },
  {
    id: '3',
    from: 'drive-shares@google.com',
    subject: 'Relatório compartilhado',
    preview: 'Um arquivo foi compartilhado com você e já está salvo na pasta correta.',
    date: '22/05',
    size: '780 KB',
    category: 'Documento',
    suggestedAction: 'Arquivar',
    priority: 'Média',
  },
  {
    id: '4',
    from: 'agenda@servico.com',
    subject: 'Confirmação de reunião',
    preview: 'Confirme sua disponibilidade para a reunião desta semana.',
    date: '21/05',
    size: '320 KB',
    category: 'Agenda',
    suggestedAction: 'Responder',
    priority: 'Alta',
  },
]

export default function Emails() {
  const [emails, setEmails] = useState(initialEmails)
  const [search, setSearch] = useState('')
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null)
  const [draft, setDraft] = useState('')

  const visibleEmails = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return emails
    return emails.filter((email) =>
      [email.from, email.subject, email.preview, email.category].some((value) =>
        value.toLowerCase().includes(term),
      ),
    )
  }, [emails, search])

  const actionCounts = useMemo(
    () => ({
      reply: emails.filter((email) => email.suggestedAction === 'Responder').length,
      archive: emails.filter((email) => email.suggestedAction === 'Arquivar').length,
      delete: emails.filter((email) => email.suggestedAction === 'Excluir').length,
    }),
    [emails],
  )

  const handleEmailAction = (email: EmailItem, action: EmailAction) => {
    if (action === 'Responder') {
      setSelectedEmail(email)
      setDraft(
        `Olá,\n\nRecebi sua mensagem sobre "${email.subject}". Vou verificar os detalhes e retorno com a posição ainda hoje.\n\nAtenciosamente,`,
      )
      return
    }

    setEmails((current) => current.filter((item) => item.id !== email.id))
    toast({
      title: action === 'Excluir' ? 'E-mail excluído' : 'E-mail arquivado',
      description:
        action === 'Excluir'
          ? `${email.subject} foi removido da fila.`
          : `${email.subject} foi movido para o arquivo.`,
    })
  }

  const sendReply = () => {
    if (!selectedEmail) return
    setEmails((current) => current.filter((item) => item.id !== selectedEmail.id))
    toast({
      title: 'Resposta preparada',
      description: `${selectedEmail.subject} saiu da fila de pendências.`,
    })
    setSelectedEmail(null)
    setDraft('')
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Triagem de E-mails</h1>
          <p className="text-muted-foreground mt-1">
            Mensagens importantes preservadas, ruído removido e respostas encaminhadas.
          </p>
        </div>
        <Button className="gap-2 bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90">
          <Sparkles className="h-4 w-4" />
          Processar Caixa
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Responder</CardTitle>
            <Reply className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actionCounts.reply}</div>
            <p className="text-xs text-muted-foreground mt-1">Mensagens com resposta sugerida</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Arquivar</CardTitle>
            <Archive className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actionCounts.archive}</div>
            <p className="text-xs text-muted-foreground mt-1">Documentos e registros úteis</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Excluir</CardTitle>
            <Trash2 className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actionCounts.delete}</div>
            <p className="text-xs text-muted-foreground mt-1">Spam, promoções e duplicidades</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar remetente, assunto ou categoria..."
          className="pl-9 bg-background/50"
        />
      </div>

      <div className="space-y-3">
        {visibleEmails.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center bg-muted/20 rounded-xl border border-dashed border-border/50">
            <MailCheck className="h-12 w-12 text-emerald-500 mb-4" />
            <h3 className="text-lg font-semibold">Caixa limpa</h3>
            <p className="text-muted-foreground max-w-md mt-2">
              Nenhuma mensagem pendente com os filtros atuais.
            </p>
          </div>
        ) : (
          visibleEmails.map((email) => (
            <Card key={email.id} className="glass-card border-border/50">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-[#D4AF37]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{email.subject}</h3>
                      <Badge
                        variant="outline"
                        className={cn(
                          email.priority === 'Alta' && 'border-rose-500/40 text-rose-600',
                          email.priority === 'Média' && 'border-amber-500/40 text-amber-600',
                        )}
                      >
                        {email.priority}
                      </Badge>
                      <Badge variant="secondary">{email.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{email.from}</p>
                    <p className="text-sm text-muted-foreground mt-1">{email.preview}</p>
                    <p className="text-xs text-muted-foreground/70 mt-2">
                      {email.date} • {email.size}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEmailAction(email, 'Arquivar')}
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Arquivar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEmailAction(email, 'Responder')}
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Responder
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleEmailAction(email, 'Excluir')}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!selectedEmail} onOpenChange={(open) => !open && setSelectedEmail(null)}>
        <DialogContent className="sm:max-w-[620px] glass-panel border-border/50">
          <DialogHeader>
            <DialogTitle>Resposta para {selectedEmail?.from}</DialogTitle>
            <DialogDescription>{selectedEmail?.subject}</DialogDescription>
          </DialogHeader>
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="min-h-[220px] bg-background/70"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEmail(null)}>
              Cancelar
            </Button>
            <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90" onClick={sendReply}>
              <Send className="h-4 w-4 mr-2" />
              Preparar Envio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
