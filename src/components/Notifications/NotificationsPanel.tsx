import { useState } from 'react';
import { Calendar, CalendarX, CalendarClock, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  type: 'appointment_scheduled' | 'appointment_cancelled' | 'appointment_rescheduled';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  patientName: string;
}

interface NotificationsPanelProps {
  onClose: () => void;
}

export const NotificationsPanel = ({ onClose }: NotificationsPanelProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'appointment_scheduled',
      title: 'Nova consulta agendada',
      description: 'Consulta marcada para amanhã às 14:00',
      time: '2 horas atrás',
      isRead: false,
      patientName: 'Maria Silva',
    },
    {
      id: '2',
      type: 'appointment_cancelled',
      title: 'Consulta cancelada',
      description: 'Paciente cancelou consulta de hoje às 16:00',
      time: '1 hora atrás',
      isRead: false,
      patientName: 'João Santos',
    },
    {
      id: '3',
      type: 'appointment_rescheduled',
      title: 'Consulta reagendada',
      description: 'Reagendada de hoje 10:00 para amanhã 11:00',
      time: '30 minutos atrás',
      isRead: false,
      patientName: 'Ana Costa',
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment_scheduled':
        return <Calendar className="h-4 w-4 text-green-600" />;
      case 'appointment_cancelled':
        return <CalendarX className="h-4 w-4 text-red-600" />;
      case 'appointment_rescheduled':
        return <CalendarClock className="h-4 w-4 text-orange-600" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  return (
    <Card className="w-80 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Notificações</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-1" />
              Marcar todas
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="space-y-1">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                  !notification.isRead ? 'bg-blue-50/50' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{notification.title}</p>
                      {!notification.isRead && (
                        <Badge variant="destructive" className="h-2 w-2 p-0 rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Paciente: {notification.patientName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};