import { useState } from 'react'
import { FolderTree, Sparkles, Undo2, LayoutGrid, Calendar, MapPin } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { PhotoGrid } from '@/components/photos/PhotoGrid'
import { StructurePreview } from '@/components/photos/StructurePreview'
import { toast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'

export default function Photos() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const handleProcess = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setOpenModal(false)
      toast({
        title: 'Organização Concluída',
        description: '128 fotos movidas para pastas estruturadas.',
        action: (
          <Button variant="outline" size="sm" className="h-8">
            <Undo2 className="h-4 w-4 mr-2" />
            Desfazer
          </Button>
        ),
      })
    }, 1500)
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mídia e Imagens</h1>
          <p className="text-muted-foreground mt-1">
            Fotos, imagens e vídeos organizados por contexto, data e relevância.
          </p>
        </div>
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg hover:shadow-primary/20 transition-all">
              <FolderTree className="h-4 w-4" />
              Processar Organização (128 itens)
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] glass-panel border-border/50">
            <DialogHeader>
              <DialogTitle>Plano de Ação de Organização</DialogTitle>
              <DialogDescription>
                A IA do Patrono Clear identificou 128 mídias soltas. Elas serão organizadas na
                seguinte estrutura:
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="p-4 rounded-lg bg-background/50 border border-border/50 space-y-2 font-mono text-sm">
                <div className="flex items-center gap-2 text-primary">
                  <FolderTree className="h-4 w-4" /> <span>/2025</span>
                </div>
                <div className="ml-6 flex justify-between items-center text-muted-foreground">
                  <span>├─ /Outubro - Viagem Paris</span>
                  <span className="text-emerald-500 font-sans">+82 arquivos</span>
                </div>
                <div className="ml-6 flex justify-between items-center text-muted-foreground">
                  <span>└─ /Documentos - Recibos</span>
                  <span className="text-emerald-500 font-sans">+46 arquivos</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                * As fotos originais manterão seus metadados EXIF.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleProcess} disabled={isProcessing} className="gap-2">
                {isProcessing ? (
                  <Sparkles className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Confirmar Reestruturação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="chrono" className="w-full">
        <TabsList className="glass-panel bg-transparent mb-6 p-1">
          <TabsTrigger value="chrono" className="gap-2">
            <LayoutGrid className="h-4 w-4" /> Bagunça Atual
          </TabsTrigger>
          <TabsTrigger value="structure" className="gap-2">
            <FolderTree className="h-4 w-4" /> Antes vs Depois (IA)
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <Calendar className="h-4 w-4" /> Eventos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chrono" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Fotos Soltas Detectadas</h3>
            <span className="text-sm px-3 py-1 bg-secondary rounded-full text-secondary-foreground font-medium">
              12 itens na visualização
            </span>
          </div>
          <PhotoGrid />
        </TabsContent>

        <TabsContent value="structure" className="space-y-4">
          <StructurePreview />
        </TabsContent>

        <TabsContent
          value="events"
          className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-xl border-dashed border-2 border-border/50"
        >
          <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum evento detectado</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            Conecte mais fontes ou faça upload de mais mídias para que nossa IA possa identificar
            viagens e eventos.
          </p>
          <Button variant="outline">Importar Arquivos</Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
