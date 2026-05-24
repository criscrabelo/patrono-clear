import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

export function AutomationSettings() {
  const { profile, refreshProfile } = useAuth()
  const [autoClean, setAutoClean] = useState(true)
  const [autoArchive, setAutoArchive] = useState(false)

  useEffect(() => {
    if (profile) {
      setAutoClean(profile.auto_clean_weekly ?? true)
      setAutoArchive(profile.auto_archive_monthly ?? false)
    }
  }, [profile])

  const handleToggle = async (
    field: 'auto_clean_weekly' | 'auto_archive_monthly',
    value: boolean,
  ) => {
    if (!profile) return

    if (field === 'auto_clean_weekly') setAutoClean(value)
    if (field === 'auto_archive_monthly') setAutoArchive(value)

    const { error } = await supabase
      .from('profiles')
      .update({ [field]: value })
      .eq('id', profile.id)

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      // Revert on error
      if (field === 'auto_clean_weekly') setAutoClean(!value)
      if (field === 'auto_archive_monthly') setAutoArchive(!value)
    } else {
      refreshProfile()
    }
  }

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle>Agendamentos</CardTitle>
        <CardDescription>Configure limpezas automáticas silenciosas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/50">
          <div className="space-y-0.5">
            <Label className="text-base">Auto-Clean Semanal</Label>
            <p className="text-sm text-muted-foreground">
              Varre e limpa lixo óbvio (spam, lixeira) todo domingo.
            </p>
          </div>
          <Switch
            checked={autoClean}
            onCheckedChange={(val) => handleToggle('auto_clean_weekly', val)}
          />
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/50">
          <div className="space-y-0.5">
            <Label className="text-base">Arquivamento Mensal</Label>
            <p className="text-sm text-muted-foreground">
              Comprime arquivos não usados a mais de 6 meses.
            </p>
          </div>
          <Switch
            checked={autoArchive}
            onCheckedChange={(val) => handleToggle('auto_archive_monthly', val)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
