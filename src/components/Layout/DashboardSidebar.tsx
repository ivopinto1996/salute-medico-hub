import { Calendar, FileText, Settings, User } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';

const menuItems = [
  {
    title: 'Calendário',
    url: '/calendario',
    icon: Calendar,
  },
  {
    title: 'Documentos',
    url: '/documentos',
    icon: FileText,
  },
  {
    title: 'Gestão de Perfil',
    url: '/gestao-perfil',
    icon: Settings,
  },
];

export const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src="/lovable-uploads/c177b398-b785-4255-9c4c-110d96675c01.png" alt="Portal Logo" className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Portal Médico</h2>
            <p className="text-sm text-muted-foreground">Sistema de Gestão</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};