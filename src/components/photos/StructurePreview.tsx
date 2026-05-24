import { useState } from 'react'
import { Folder, Image as ImageIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const beforeData = [
  { name: 'IMG_20251001_1423.jpg', type: 'image' },
  { name: 'Screenshot_2025-10.png', type: 'image' },
  { name: 'IMG_20251002_0911.jpg', type: 'image' },
  { name: 'IMG_20251002_1045.jpg', type: 'image' },
  { name: 'WhatsApp_Image_2025.jpg', type: 'image' },
]

export function StructurePreview() {
  const [view, setView] = useState<'before' | 'after'>('after')

  return (
    <Card className="glass-card border-border/50 overflow-hidden">
      <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background/50">
        <div>
          <h3 className="font-semibold">Pré-visualização de Estrutura</h3>
          <p className="text-sm text-muted-foreground">
            Como o Patrono Clear organizará seus arquivos
          </p>
        </div>
        <div className="bg-secondary/50 p-1 rounded-lg flex items-center shrink-0">
          <Button
            variant={view === 'before' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('before')}
            className="h-8 shadow-none"
          >
            Antes (Caos)
          </Button>
          <Button
            variant={view === 'after' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('after')}
            className="h-8 shadow-none"
          >
            Depois (IA Patrono)
          </Button>
        </div>
      </div>
      <div className="p-6 font-mono text-sm min-h-[300px]">
        {view === 'before' ? (
          <div className="space-y-3 opacity-80 animate-fade-in-up">
            <div className="flex items-center gap-2 font-semibold text-muted-foreground mb-4">
              <Folder className="h-5 w-5" /> /Uploads_Gerais
            </div>
            {beforeData.map((item, i) => (
              <div key={i} className="flex items-center gap-2 ml-6 text-muted-foreground">
                <ImageIcon className="h-4 w-4 opacity-50" />
                {item.name}
              </div>
            ))}
            <div className="ml-6 text-muted-foreground/50 italic mt-4">... + 123 arquivos</div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in-up">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <Folder className="h-5 w-5" /> /Patrono_Organized
            </div>
            <div className="ml-6 space-y-4 border-l-2 border-border/50 pl-4 py-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Folder className="h-4 w-4 text-emerald-500" /> /2025
                </div>
                <div className="ml-6 space-y-3 border-l-2 border-border/50 pl-4 py-2">
                  <div className="flex justify-between items-center bg-muted/30 p-2 rounded-md">
                    <div className="flex items-center gap-2 text-foreground/80">
                      <Folder className="h-4 w-4 text-blue-500" /> /Outubro - Viagem Paris
                    </div>
                    <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-sans">
                      82 fotos
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-muted/30 p-2 rounded-md">
                    <div className="flex items-center gap-2 text-foreground/80">
                      <Folder className="h-4 w-4 text-indigo-500" /> /Screenshots & Documentos
                    </div>
                    <span className="text-xs bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full font-sans">
                      46 fotos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="bg-muted/30 p-4 text-center text-xs text-muted-foreground border-t border-border/50">
        Alternando para a visualização "{view === 'before' ? 'Depois' : 'Antes'}" mostra o poder do
        algoritmo de visão computacional.
      </div>
    </Card>
  )
}
