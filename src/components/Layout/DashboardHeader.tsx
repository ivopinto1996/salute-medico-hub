import { useState } from 'react';
import { Bell, User, LogOut, Menu, X } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { NotificationsPanel } from '../Notifications/NotificationsPanel';
import { menuItems } from './DashboardSidebar';

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Simulação de dados do médico - em produção, vir do contexto/estado global
  const doctorData = JSON.parse(localStorage.getItem('doctorData') || '{}');
  const unreadNotifications = 3; // Simulação

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('doctorData');
    toast({
      title: 'Logout realizado',
      description: 'Até logo!',
    });
    navigate('/login');
  };

  const handleAccountManagement = () => {
    navigate('/conta');
  };

  return (
    <>
      <header className="border-b bg-background px-6 py-3 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu - visible only on lg and below */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>

            <div>
              <h1 className="text-xl font-semibold">
                Bem-vindo, {doctorData.name || 'Doutor'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {doctorData.specialty} - {doctorData.crm}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Botão de Notificações */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
              
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 z-50">
                  <NotificationsPanel onClose={() => setShowNotifications(false)} />
                </div>
              )}
            </div>

            {/* Menu do Usuário */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleAccountManagement}>
                  <User className="mr-2 h-4 w-4" />
                  Gestão da Conta
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-background border-b shadow-lg absolute top-full left-0 right-0 z-40">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                onClick={() => setShowMobileMenu(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};