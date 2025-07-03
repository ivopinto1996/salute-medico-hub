import { Calendar, FileText, Info, User, Expand } from 'lucide-react';
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
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export const menuItems = [
  {
    title: 'Calendário',
    url: '/calendario',
    icon: Calendar,
  },
  {
    title: 'O meu perfil',
    url: '/gestao-perfil',
    icon: Info,
  },
  {
    title: 'Documentos',
    url: '/documentos',
    icon: FileText,
  },
];

export const DashboardSidebar = () => {
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();

  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className="border-r hidden lg:block" collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src="/lovable-uploads/c177b398-b785-4255-9c4c-110d96675c01.png" alt="Portal Logo" className="h-8 w-8" />
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <h2 className="font-semibold text-lg">Medclic</h2>
              <p className="text-sm text-muted-foreground">Sistema da Agenda Médica</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="ml-auto h-6 w-6"
          >
            <Expand className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel>Navegação Principal</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    tooltip={isCollapsed ? item.title : undefined}
                  >
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
                      {!isCollapsed && <span>{item.title}</span>}
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