import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Files,
  Settings,
  LogOut,
  Images,
  CreditCard,
  ShieldCheck,
  Mail,
  MessageCircle,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Logo } from '@/components/ui/logo'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'E-mails', href: '/emails', icon: Mail },
  { name: 'WhatsApp', href: '/whatsapp', icon: MessageCircle },
  { name: 'Mídia', href: '/photos', icon: Images },
  { name: 'Duplicados', href: '/duplicates', icon: Files },
  { name: 'Planos', href: '/plans', icon: CreditCard },
  { name: 'Admin', href: '/admin', icon: ShieldCheck, adminOnly: true },
  { name: 'Configurações', href: '/settings', icon: Settings },
]

export function AppSidebar() {
  const location = useLocation()
  const { user, profile, signOut } = useAuth()
  const { setOpenMobile, isMobile } = useSidebar()

  const handleNavClick = () => {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar className="border-r border-border/50 glass-panel">
      <SidebarHeader className="p-4 flex items-center justify-center pt-6">
        <Link to="/dashboard" onClick={handleNavClick}>
          <Logo />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 mt-6">
        <SidebarMenu>
          {navigation
            .filter((item) => !item.adminOnly || profile?.is_admin)
            .map((item) => {
            const isActive = location.pathname === item.href
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.name}
                  className={cn(
                    'transition-all duration-300 py-5 group',
                    isActive
                      ? 'bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 hover:text-[#D4AF37]'
                      : 'hover:bg-[#D4AF37]/5 hover:text-[#D4AF37]',
                  )}
                >
                  <Link
                    to={item.href}
                    onClick={handleNavClick}
                    className="flex items-center gap-3 w-full"
                  >
                    <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-base font-medium">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-3 sm:p-4 border-t border-border/50 bg-background/50">
        <div className="flex items-center justify-between w-full px-1">
          <div className="flex items-center gap-3 overflow-hidden flex-1">
            <div className="relative group/avatar shrink-0 rounded-full ring-2 ring-transparent hover:ring-[#D4AF37]/50 transition-all duration-300">
              <Avatar className="h-10 w-10 border border-border shadow-sm group-hover/avatar:opacity-90 transition-opacity">
                <AvatarFallback className="bg-black text-[#D4AF37] font-semibold">
                  {profile?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col overflow-hidden flex-1 min-w-0 pr-2">
              <span className="text-[14px] leading-tight font-bold text-foreground truncate block">
                {profile?.name || user?.email?.split('@')[0]}
              </span>
              <span className="text-[12px] text-[#D4AF37]/80 font-medium truncate block mt-0.5">
                {profile?.is_admin ? 'Admin' : 'Membro'}
              </span>
            </div>
          </div>
          <button
            onClick={signOut}
            className="p-2 ml-1 text-muted-foreground hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-xl transition-colors shrink-0"
            title="Sair da Conta"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
