import { useMemo, useState } from 'react'
import { HelpCircle, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ChatMessage {
  id: string
  author: 'Clara' | 'Você'
  text: string
}

const quickQuestions = [
  'Como funciona a limpeza?',
  'Meus dados ficam seguros?',
  'Posso aprovar respostas?',
]

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

function createAnswer(question: string) {
  const normalized = question.toLowerCase()

  if (normalized.includes('segur')) {
    return 'Sim. A proposta do Patrono Clear é organizar e sugerir ações mantendo você no controle. Respostas e exclusões sensíveis devem passar pela sua aprovação antes de serem executadas.'
  }

  if (normalized.includes('aprovar') || normalized.includes('resposta')) {
    return 'Você vê quem enviou a mensagem, lê a resposta sugerida e decide entre aprovar, reprovar ou não responder. Nada sensível precisa sair sem sua autorização.'
  }

  if (normalized.includes('limpeza') || normalized.includes('funciona')) {
    return 'O Patrono Clear analisa e-mails, WhatsApp, fotos, vídeos e documentos para sugerir o que responder, arquivar, organizar ou excluir. Você revisa as sugestões antes das ações importantes.'
  }

  return 'Posso te ajudar com dúvidas sobre cadastro, planos, limpeza de arquivos, triagem de e-mails, respostas de WhatsApp e organização de documentos.'
}

export function SupportChat() {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      author: 'Clara',
      text: 'Olá, eu sou a Clara, atendente digital do Patrono Clear. Pode me perguntar sobre a plataforma.',
    },
  ])

  const unread = useMemo(
    () => messages.filter((message) => message.author === 'Clara').length,
    [messages],
  )

  const sendQuestion = (question: string) => {
    const cleanQuestion = question.trim()
    if (!cleanQuestion) return

    setMessages((current) => [
      ...current,
      { id: createId(), author: 'Você', text: cleanQuestion },
      { id: createId(), author: 'Clara', text: createAnswer(cleanQuestion) },
    ])
    setDraft('')
    setOpen(true)
  }

  return (
    <div className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-3 right-3 z-[70] flex flex-col items-end gap-3 sm:bottom-4 sm:left-auto sm:right-4">
      {open && (
        <div className="w-full max-w-[380px] overflow-hidden rounded-2xl border border-border/70 bg-background shadow-2xl shadow-black/15">
          <div className="flex items-center justify-between border-b border-border/60 bg-[#D4AF37]/10 px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37] text-black">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold leading-tight">Clara</p>
                <p className="text-xs text-muted-foreground">Atendente Patrono Clear</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-[min(360px,calc(100svh-260px))] space-y-3 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn('flex', message.author === 'Você' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                    message.author === 'Você'
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-muted text-foreground',
                  )}
                >
                  <p className="text-[11px] font-semibold opacity-70">{message.author}</p>
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border/60 p-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickQuestions.map((question) => (
                <Button
                  key={question}
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full bg-background/50 text-xs"
                  onClick={() => sendQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                sendQuestion(draft)
              }}
            >
              <Input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Digite sua dúvida..."
                className="h-10 bg-background/70"
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 shrink-0 bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      <Button
        aria-label={open ? 'Fechar chat da Clara' : 'Falar com Clara'}
        className="relative h-12 w-12 rounded-full bg-[#D4AF37] px-0 text-black shadow-xl shadow-[#D4AF37]/25 hover:bg-[#D4AF37]/90 sm:h-14 sm:w-auto sm:px-5"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? (
          <HelpCircle className="h-5 w-5 sm:mr-2" />
        ) : (
          <MessageCircle className="h-5 w-5 sm:mr-2" />
        )}
        <span className="hidden sm:inline">Falar com Clara</span>
        {!open && unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[11px] font-bold text-white">
            {unread}
          </span>
        )}
      </Button>
    </div>
  )
}
