import { Trash2, ShieldCheck, Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

export function CompareCard() {
  const handleRemoveBoth = () => {
    toast({
      title: 'Imagens removidas',
      description: 'Ambas as imagens foram enviadas para a lixeira.',
    })
  }

  const handleRemoveOne = () => {
    toast({
      title: 'Imagem removida',
      description: 'A versão de baixa resolução foi enviada para a lixeira.',
    })
  }

  return (
    <Card className="glass-card p-4 sm:p-6 overflow-hidden relative border-border/50">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <Badge
          variant="secondary"
          className="bg-background/90 backdrop-blur-md shadow-md border-primary/20 px-3 py-1"
        >
          Similaridade: 98%
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative mt-8">
        {/* separator line desktop */}
        <div className="hidden md:flex absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 items-center justify-center">
          <div className="h-full w-px bg-border/50" />
          <div className="absolute bg-background border border-border/50 rounded-full p-1 text-xs text-muted-foreground shadow-sm">
            VS
          </div>
        </div>

        {/* Keep Side (High Res) */}
        <div className="flex flex-col items-center text-center space-y-4 rounded-xl p-4 bg-emerald-500/5 border border-emerald-500/20 relative group">
          <Badge className="bg-emerald-500 hover:bg-emerald-600 self-start absolute top-4 left-4 z-10 shadow-sm">
            Manter Auto
          </Badge>
          <div className="w-full aspect-video rounded-lg overflow-hidden border border-border shadow-sm group-hover:shadow-md transition-all">
            <img
              src="https://img.usecurling.com/p/800/600?q=mountain"
              alt="High Res"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1.5 w-full">
            <h4 className="font-semibold truncate text-sm">IMG_2025_HDR.jpg</h4>
            <div className="flex flex-wrap gap-2 justify-center text-xs">
              <Badge variant="outline" className="bg-background/50">
                4.2 MB
              </Badge>
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              >
                4000x3000px
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground">Original • Hoje, 10:00</p>
          </div>
          <Button
            variant="outline"
            className="w-full mt-2 border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 bg-background/50"
          >
            <ShieldCheck className="h-4 w-4 mr-2" />
            Melhor Qualidade (Mantido)
          </Button>
        </div>

        {/* Delete Side (Low Res) */}
        <div className="flex flex-col items-center text-center space-y-4 rounded-xl p-4 opacity-80 hover:opacity-100 transition-opacity bg-destructive/5 border border-destructive/10 relative group">
          <Badge
            variant="destructive"
            className="self-start absolute top-4 right-4 md:left-auto md:right-4 z-10 shadow-sm"
          >
            Descartar
          </Badge>
          <div className="w-full aspect-video rounded-lg overflow-hidden border border-border shadow-sm">
            <img
              src="https://img.usecurling.com/p/800/600?q=mountain&color=gray"
              alt="Low Res"
              className="w-full h-full object-cover blur-[1px]"
            />
          </div>
          <div className="space-y-1.5 w-full">
            <h4 className="font-semibold truncate text-sm">IMG_2025_WhatsApp.jpg</h4>
            <div className="flex flex-wrap gap-2 justify-center text-xs">
              <Badge variant="outline" className="bg-background/50">
                320 KB
              </Badge>
              <Badge
                variant="outline"
                className="bg-destructive/10 text-destructive border-destructive/20"
              >
                800x600px
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground">Baixado • Ontem, 18:00</p>
          </div>
          <div className="flex gap-2 w-full mt-2">
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 bg-background/50 text-muted-foreground"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="destructive" className="w-full" onClick={handleRemoveOne}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remover Agora
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6 pt-4 border-t border-border/50">
        <Button
          variant="outline"
          onClick={handleRemoveBoth}
          className="w-full sm:w-auto border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive bg-background/50 transition-colors"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Descartar Ambas as Imagens
        </Button>
      </div>
    </Card>
  )
}
