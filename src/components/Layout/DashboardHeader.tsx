import { useState, useEffect } from 'react';
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
  const [isClosing, setIsClosing] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  const handleCloseMobileMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowMobileMenu(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };
  
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
            {/* Hamburger Menu - visible only below 768px */}
            <Button
              variant="ghost"
              size="icon"
              className="block md:hidden"
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

      {/* Mobile Sidebar Overlay */}
      {showMobileMenu && (
        <>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden ${
              isClosing ? 'animate-fade-out' : 'animate-fade-in'
            }`}
            onClick={handleCloseMobileMenu}
          />
          
          {/* Sidebar */}
          <div className={`fixed top-0 left-0 h-full w-80 bg-background border-r shadow-lg z-50 md:hidden ${
            isClosing ? 'animate-slide-out-left' : 'animate-slide-in-left'
          }`}>
            {/* Sidebar Header */}
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img src="/lovable-uploads/c177b398-b785-4255-9c4c-110d96675c01.png" alt="Portal Logo" className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">Medclic</h2>
                    <p className="text-sm text-muted-foreground">Sistema da Agenda Médica</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseMobileMenu}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="p-4 space-y-2">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Navegação Principal</h3>
              </div>
              {menuItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  onClick={handleCloseMobileMenu}
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
        </>
      )}
    </>
  );
};