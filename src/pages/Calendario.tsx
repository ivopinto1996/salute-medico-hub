import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, FileText, Users, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AppointmentDetails } from '@/components/Calendar/AppointmentDetails';
import { NewAppointmentForm } from '@/components/Calendar/NewAppointmentForm';

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  date: Date;
  hasInsurance: boolean;
  location: string;
  documents: string[];
  type: string;
}

const Calendario = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showNewAppointment, setShowNewAppointment] = useState(false);

  // Dados simulados de consultas
  const appointments: Appointment[] = [
    {
      id: '1',
      patientName: 'Maria Silva',
      time: '09:00',
      date: new Date(),
      hasInsurance: true,
      location: 'Consultório A - Rua das Flores, 123, São Paulo',
      documents: ['Exame de sangue', 'Eletrocardiograma'],
      type: 'Consulta de Rotina',
    },
    {
      id: '2',
      patientName: 'João Santos',
      time: '14:30',
      date: new Date(),
      hasInsurance: false,
      location: 'Consultório B - Av. Paulista, 456, São Paulo',
      documents: ['Raio-X do tórax'],
      type: 'Primeira Consulta',
    },
    {
      id: '3',
      patientName: 'Ana Costa',
      time: '16:00',
      date: new Date(Date.now() + 86400000), // Amanhã
      hasInsurance: true,
      location: 'Consultório A - Rua das Flores, 123, São Paulo',
      documents: [],
      type: 'Retorno',
    },
  ];

  const getAppointmentsForDate = (date: Date | undefined) => {
    if (!date) return [];
    return appointments.filter(
      (apt) => apt.date.toDateString() === date.toDateString()
    );
  };

  const todayAppointments = getAppointmentsForDate(selectedDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendário de Consultas</h1>
          <p className="text-muted-foreground">
            Gerencie suas consultas e horários de atendimento
          </p>
        </div>
        <Dialog open={showNewAppointment} onOpenChange={setShowNewAppointment}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Consulta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agendar Nova Consulta</DialogTitle>
            </DialogHeader>
            <NewAppointmentForm onClose={() => setShowNewAppointment(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Calendário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Lista de Consultas do Dia */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Consultas do Dia
              {selectedDate && (
                <span className="text-base font-normal text-muted-foreground">
                  - {selectedDate.toLocaleDateString('pt-BR')}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma consulta agendada para este dia</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-lg">
                          {appointment.patientName}
                        </span>
                        <Badge variant={appointment.hasInsurance ? 'default' : 'secondary'}>
                          {appointment.hasInsurance ? 'Com Seguro' : 'Particular'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {appointment.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {appointment.location.split(' - ')[0]}
                        </div>
                        {appointment.documents.length > 0 && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {appointment.documents.length} documento(s)
                          </div>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Detalhes da Consulta */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Consulta</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <AppointmentDetails
              appointment={selectedAppointment}
              onClose={() => setSelectedAppointment(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendario;