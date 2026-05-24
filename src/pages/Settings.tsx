import { User, HardDrive, CalendarClock, Key } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileSettings } from '@/components/settings/ProfileSettings'
import { AutomationSettings } from '@/components/settings/AutomationSettings'
import { SecuritySettings } from '@/components/settings/SecuritySettings'
import { IntegrationSettings } from '@/components/settings/IntegrationSettings'

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-12">
      <div>
        <h1 className="text-[32px] font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-2 text-[16px]">
          Gerencie sua conta e integrações do Patrono Clear.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-card border border-border/50 rounded-[20px] mb-8 h-auto p-2 shadow-sm">
          <TabsTrigger
            value="profile"
            className="py-3 rounded-xl text-[14px] font-semibold text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <User className="w-[18px] h-[18px] mr-2" /> Perfil
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="py-3 rounded-xl text-[14px] font-semibold text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <HardDrive className="w-[18px] h-[18px] mr-2" /> Integrações
          </TabsTrigger>
          <TabsTrigger
            value="automation"
            className="py-3 rounded-xl text-[14px] font-semibold text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <CalendarClock className="w-[18px] h-[18px] mr-2" /> Automação
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="py-3 rounded-xl text-[14px] font-semibold text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <Key className="w-[18px] h-[18px] mr-2" /> Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 focus-visible:outline-none">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-8 focus-visible:outline-none">
          <IntegrationSettings />
        </TabsContent>

        <TabsContent value="automation" className="space-y-6 focus-visible:outline-none">
          <AutomationSettings />
        </TabsContent>

        <TabsContent value="security" className="space-y-6 focus-visible:outline-none">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
