import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Filter, ShieldCheck, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'

interface CleanupItem {
  id: string
  desc: string
  value: number
  date: string
  cat: string
  created_at: string
}

export default function Duplicates() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<CleanupItem[]>([])
  const [criteria, setCriteria] = useState<string[]>(['desc', 'cat', 'value'])

  const fetchItems = async () => {
    setLoading(true)
    const { data } = await supabase.from('transactions').select('*')
    if (data) setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const groups = useMemo(() => {
    if (!items.length || criteria.length === 0) return []

    const map = new Map<string, CleanupItem[]>()

    items.forEach((item) => {
      const keyParts = []
      if (criteria.includes('desc')) {
        const simplifiedDesc = item.desc
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .split(/\s+/)
          .slice(0, 3)
          .join(' ')
        keyParts.push(simplifiedDesc)
      }
      if (criteria.includes('value')) keyParts.push(item.value.toString())
      if (criteria.includes('date')) keyParts.push(item.date)
      if (criteria.includes('cat')) keyParts.push(item.cat)

      const key = keyParts.join('|')
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(item)
    })

    return Array.from(map.values()).filter((group) => group.length > 1)
  }, [items, criteria])

  const handleRemove = async (groupIndex: number, itemIdsToRemove: string[]) => {
    const group = groups[groupIndex]
    const itemsToRemove = group.filter((item) => itemIdsToRemove.includes(item.id))
    const recoveredGb = itemsToRemove.reduce((sum, item) => sum + Math.abs(item.value), 0)

    try {
      await supabase.from('transactions').delete().in('id', itemIdsToRemove)
      await supabase.rpc('increment_cleaned_amount', { amount: recoveredGb })

      toast({
        title: 'Itens removidos',
        description: `${formatStorage(recoveredGb)} liberados com segurança.`,
      })

      fetchItems()
    } catch (e: any) {
      toast({
        title: 'Erro ao remover',
        description: e.message,
        variant: 'destructive',
      })
    }
  }

  const formatStorage = (val: number) =>
    val < 1 ? `${Math.round(val * 1024)} MB` : `${val.toFixed(1).replace('.', ',')} GB`

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Arquivos Duplicados</h1>
          <p className="text-muted-foreground mt-1">
            Compare imagens, vídeos, documentos e anexos antes de excluir.
          </p>
        </div>
      </div>

      <Card className="p-4 glass-card border-border/50 bg-background/50 flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Filter className="h-4 w-4" /> Critérios:
        </div>
        <ToggleGroup
          type="multiple"
          value={criteria}
          onValueChange={(val) => val.length && setCriteria(val)}
        >
          <ToggleGroupItem
            value="desc"
            className="data-[state=on]:bg-[#D4AF37]/20 data-[state=on]:text-[#D4AF37]"
          >
            Nome
          </ToggleGroupItem>
          <ToggleGroupItem
            value="value"
            className="data-[state=on]:bg-[#D4AF37]/20 data-[state=on]:text-[#D4AF37]"
          >
            Tamanho
          </ToggleGroupItem>
          <ToggleGroupItem
            value="date"
            className="data-[state=on]:bg-[#D4AF37]/20 data-[state=on]:text-[#D4AF37]"
          >
            Data
          </ToggleGroupItem>
          <ToggleGroupItem
            value="cat"
            className="data-[state=on]:bg-[#D4AF37]/20 data-[state=on]:text-[#D4AF37]"
          >
            Tipo
          </ToggleGroupItem>
        </ToggleGroup>
      </Card>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground animate-pulse">
          Analisando arquivos...
        </div>
      ) : groups.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center bg-muted/20 rounded-xl border border-dashed border-border/50">
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
          <h3 className="text-lg font-semibold">Tudo Limpo</h3>
          <p className="text-muted-foreground max-w-md mt-2">
            Nenhum grupo duplicado encontrado com os critérios selecionados.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Encontrados {groups.length} grupo(s) de itens similares.
          </div>

          {groups.map((group, groupIndex) => (
            <Card key={groupIndex} className="glass-card p-4 sm:p-6 relative border-border/50">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <Badge
                  variant="secondary"
                  className="bg-background/90 backdrop-blur-md shadow-md px-3 py-1"
                >
                  Itens Similares
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="flex flex-col space-y-4 rounded-xl p-4 bg-emerald-500/5 border border-emerald-500/20 relative group">
                  <Badge className="bg-emerald-500 self-start absolute top-4 right-4 z-10">
                    Manter
                  </Badge>
                  <div className="space-y-1.5 w-full pt-6">
                    <h4 className="font-semibold text-lg">{group[0].desc}</h4>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline">{formatStorage(Math.abs(group[0].value))}</Badge>
                      <Badge variant="outline">{group[0].date}</Badge>
                      <Badge variant="outline">{group[0].cat}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-auto border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10 bg-background/50"
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" /> Preservar este item
                  </Button>
                </div>

                <div className="flex flex-col space-y-4 rounded-xl p-4 bg-destructive/5 border border-destructive/10 relative group">
                  <Badge variant="destructive" className="self-start absolute top-4 right-4 z-10">
                    Excluir
                  </Badge>

                  <div className="space-y-4 pt-6 flex-1">
                    {group.slice(1).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-background/50 rounded-lg border border-destructive/20"
                      >
                        <h4 className="font-semibold text-sm">{item.desc}</h4>
                        <div className="flex flex-wrap gap-2 text-xs mt-2">
                          <Badge
                            variant="outline"
                            className="border-destructive/30 text-destructive"
                          >
                            {formatStorage(Math.abs(item.value))}
                          </Badge>
                          <Badge variant="outline">{item.date}</Badge>
                          <Badge variant="outline">{item.cat}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="destructive"
                    className="w-full mt-auto"
                    onClick={() =>
                      handleRemove(
                        groupIndex,
                        group.slice(1).map((item) => item.id),
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Excluir duplicados ({group.length - 1})
                  </Button>
                </div>
              </div>

              <div className="flex justify-center mt-6 pt-4 border-t border-border/50">
                <Button
                  variant="outline"
                  onClick={() =>
                    handleRemove(
                      groupIndex,
                      group.map((item) => item.id),
                    )
                  }
                  className="w-full sm:w-auto border-destructive/30 text-destructive hover:bg-destructive/10 bg-background/50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir todo o grupo ({group.length})
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
