import { useState, useRef, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'
import { ImageCropper } from '@/components/settings/ImageCropper'
import { Camera } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export function ProfileSettings() {
  const { user: authUser, profile, refreshProfile } = useAuth()

  const [name, setName] = useState(profile?.name || '')
  const [email, setEmail] = useState(profile?.email || authUser?.email || '')
  const [avatar, setAvatar] = useState('')
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [rawImage, setRawImage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (profile || authUser) {
      setName(profile?.name || '')
      setEmail(profile?.email || authUser?.email || '')
      setAvatar(
        `https://img.usecurling.com/ppl/thumbnail?gender=male&seed=${(profile?.email || authUser?.email || 'a').length}`,
      )
    }
  }, [profile, authUser])

  const handleSaveProfile = async () => {
    if (profile) {
      setSaving(true)
      const { error } = await supabase.from('profiles').update({ name }).eq('id', profile.id)
      setSaving(false)
      if (error) {
        toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      } else {
        toast({
          title: 'Perfil atualizado',
          description: 'Suas informações de perfil foram salvas com sucesso.',
        })
        refreshProfile()
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        toast({
          title: 'Formato inválido',
          description: 'Por favor, envie apenas arquivos JPG, PNG ou GIF.',
          variant: 'destructive',
        })
        return
      }

      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: 'A imagem deve ter no máximo 2MB.',
          variant: 'destructive',
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setRawImage(event.target?.result as string)
        setIsCropModalOpen(true)
      }
      reader.readAsDataURL(file)
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCropComplete = (croppedDataUrl: string) => {
    setAvatar(croppedDataUrl)
    toast({
      title: 'Foto atualizada',
      description: 'Sua foto de perfil foi alterada. (Temporária na sessão atual)',
    })
    setIsCropModalOpen(false)
  }

  return (
    <>
      <Card className="glass-card border-border/50 shadow-sm rounded-[24px]">
        <CardHeader className="pt-8 px-8 pb-6">
          <CardTitle className="text-[26px] font-bold tracking-tight text-foreground">
            Perfil Público
          </CardTitle>
          <CardDescription className="text-[15px] mt-1">
            Suas informações de conta e identidade profissional.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 px-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="relative group shrink-0">
              <Avatar className="h-28 w-28 border-2 border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.1)] ring-4 ring-transparent hover:ring-[#D4AF37]/20 transition-all duration-300">
                <AvatarImage src={avatar} className="object-cover" />
                <AvatarFallback className="text-4xl bg-black text-[#D4AF37] font-bold">
                  {name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-8 h-8 text-[#D4AF37]" />
              </div>
            </div>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/jpeg, image/png, image/gif"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button
                variant="outline"
                size="sm"
                className="border-[#D4AF37]/30 text-foreground hover:bg-[#D4AF37]/10 font-semibold px-6 h-[40px] rounded-xl text-[14px] shadow-sm transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                Trocar Foto
              </Button>
              <div className="space-y-1">
                <p className="text-[13px] text-muted-foreground font-medium">
                  Aceito JPG, GIF ou PNG. Tamanho máximo de 2MB.
                </p>
                <p className="text-[11px] text-[#D4AF37]/70 italic">
                  *As alterações de imagem são temporárias para a sessão atual.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 pt-2">
            <div className="space-y-2.5">
              <Label htmlFor="name" className="text-[14px] font-semibold text-foreground">
                Nome Completo
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background/50 border-border/50 h-12 text-[15px] rounded-xl focus-visible:ring-[#D4AF37]"
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-[14px] font-semibold text-foreground">
                E-mail Principal
              </Label>
              <Input
                id="email"
                value={email}
                disabled
                className="bg-background/50 border-border/50 h-12 text-[15px] rounded-xl focus-visible:ring-[#D4AF37] opacity-70"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-8 pb-8 pt-4">
          <Button
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-bold px-8 h-11 rounded-xl shadow-lg shadow-[#D4AF37]/20 text-[14px] transition-all"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="w-[95vw] max-w-[440px] sm:w-full bg-black/95 backdrop-blur-2xl border-[#D4AF37]/20 rounded-[28px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] p-5 sm:p-6">
          <DialogHeader className="pt-2">
            <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Ajustar Foto
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-[15px] text-zinc-400">
              Arraste e ajuste o zoom para centralizar.
            </DialogDescription>
          </DialogHeader>
          {rawImage && (
            <ImageCropper
              imageUrl={rawImage}
              onCrop={handleCropComplete}
              onCancel={() => setIsCropModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
