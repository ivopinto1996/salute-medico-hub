import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, MapPin, FileText, Users, Plus, ChevronLeft, ChevronRight, Calendar as CalendarDaysIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AppointmentDetails } from '@/components/Calendar/AppointmentDetails';
import { NewAppointmentForm } from '@/components/Calendar/NewAppointmentForm';
import { NewAbsenceForm } from '@/components/Calendar/NewAbsenceForm';
import { AbsenceDetails } from '@/components/Calendar/AbsenceDetails';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

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

interface Absence {
  id: string;
  type: string;
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
}

const Calendario = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showNewAbsence, setShowNewAbsence] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedAppointmentTypes, setSelectedAppointmentTypes] = useState<string[]>([
    'Consulta de Rotina', 'Primeira Consulta', 'Retorno', 'Urgência',
    'Férias', 'Doença', 'Formação', 'Congresso', 'Licença Parental', 'Licença Especial'
  ]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null);

  // Dados simulados de consultas com mais variedade
  const appointments: Appointment[] = [
    {
      id: '1',
      patientName: 'Maria Silva',
      time: '09:00',
      date: new Date(),
      hasInsurance: true,
      location: 'Consultório A',
      documents: ['Exame de sangue', 'Eletrocardiograma'],
      type: 'Consulta de Rotina',
    },
    {
      id: '2',
      patientName: 'João Santos',
      time: '14:30',
      date: new Date(),
      hasInsurance: false,
      location: 'Consultório B',
      documents: ['Raio-X do tórax'],
      type: 'Primeira Consulta',
    },
    {
      id: '3',
      patientName: 'Ana Costa',
      time: '16:00',
      date: new Date(Date.now() + 86400000), // Amanhã
      hasInsurance: true,
      location: 'Consultório A',
      documents: [],
      type: 'Retorno',
    },
    {
      id: '4',
      patientName: 'Pedro Oliveira',
      time: '10:30',
      date: new Date(),
      hasInsurance: true,
      location: 'Consultório A',
      documents: ['Ultrassom'],
      type: 'Consulta de Rotina',
    },
    {
      id: '5',
      patientName: 'Carla Mendes',
      time: '11:15',
      date: new Date(Date.now() + 86400000),
      hasInsurance: false,
      location: 'Consultório B',
      documents: [],
      type: 'Urgência',
    },
    {
      id: '6',
      patientName: 'Roberto Lima',
      time: '15:45',
      date: new Date(Date.now() + 2 * 86400000), // Depois de amanhã
      hasInsurance: true,
      location: 'Consultório A',
      documents: ['Eletrocardiograma'],
      type: 'Retorno',
    },
  ];

  const appointmentTypes = [
    { name: 'Consulta de Rotina', color: 'bg-blue-100 text-blue-800 border-blue-200', type: 'appointment' },
    { name: 'Primeira Consulta', color: 'bg-orange-100 text-orange-800 border-orange-200', type: 'appointment' },
    { name: 'Retorno', color: 'bg-green-100 text-green-800 border-green-200', type: 'appointment' },
    { name: 'Urgência', color: 'bg-red-100 text-red-800 border-red-200', type: 'appointment' },
  ];

  const absenceTypes = [
    { name: 'Férias', color: 'bg-purple-100 text-purple-800 border-purple-200', type: 'absence' },
    { name: 'Doença', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', type: 'absence' },
    { name: 'Formação', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', type: 'absence' },
    { name: 'Congresso', color: 'bg-pink-100 text-pink-800 border-pink-200', type: 'absence' },
    { name: 'Licença Parental', color: 'bg-cyan-100 text-cyan-800 border-cyan-200', type: 'absence' },
    { name: 'Licença Especial', color: 'bg-gray-100 text-gray-800 border-gray-200', type: 'absence' },
  ];

  const allFilterTypes = [...appointmentTypes, ...absenceTypes];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  // Funções para navegação da semana
  const getWeekDays = (date: Date) => {
    const week = [];
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Segunda-feira
    startDate.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = getWeekDays(currentWeek);
  const weekDayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(
      (apt) => apt.date.toDateString() === date.toDateString() && 
      selectedAppointmentTypes.includes(apt.type)
    );
  };

  // Função para navegar para uma semana específica baseada na data selecionada
  const navigateToWeekByDate = (date: Date) => {
    setCurrentWeek(date);
  };

  // Função para alternar tipos de consulta no filtro
  const toggleAppointmentType = (typeName: string) => {
    setSelectedAppointmentTypes(prev => 
      prev.includes(typeName) 
        ? prev.filter(t => t !== typeName)
        : [...prev, typeName]
    );
  };

  // Funções para atualizar e cancelar consultas
  const handleUpdateAppointment = (appointmentId: string, newDate: Date, newTime: string) => {
    // Aqui você implementaria a lógica para atualizar a consulta
    console.log(`Atualizando consulta ${appointmentId} para ${newDate} às ${newTime}`);
  };

  const handleCancelAppointment = (appointmentId: string, reason: string) => {
    // Aqui você implementaria a lógica para cancelar a consulta
    console.log(`Cancelando consulta ${appointmentId} com motivo: ${reason}`);
  };

  const getAppointmentPosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const startMinutes = 8 * 60; // 08:00
    const position = ((totalMinutes - startMinutes) / 30) * 60; // 60px por slot de 30min
    return Math.max(0, position);
  };

  const getAppointmentColor = (type: string) => {
    const appointmentType = appointmentTypes.find(t => t.name === type);
    return appointmentType?.color || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleAbsenceAdded = (absence: Absence) => {
    setAbsences(prev => [...prev, absence]);
  };

  const handleDeleteAbsence = (absenceId: string) => {
    setAbsences(prev => prev.filter(absence => absence.id !== absenceId));
  };

  const getAbsencesForDate = (date: Date) => {
    return absences.filter(absence => {
      const absenceStart = new Date(absence.startDate);
      const absenceEnd = new Date(absence.endDate);
      
      // Filtrar por tipo selecionado
      if (!selectedAppointmentTypes.includes(absence.type)) {
        return false;
      }
      
      // Normalizar as datas para comparação (ignorar horas)
      const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const compareStart = new Date(absenceStart.getFullYear(), absenceStart.getMonth(), absenceStart.getDate());
      const compareEnd = new Date(absenceEnd.getFullYear(), absenceEnd.getMonth(), absenceEnd.getDate());
      
      return compareDate >= compareStart && compareDate <= compareEnd;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendário de Consultas</h1>
          <p className="text-muted-foreground">
            Gerencie suas consultas e horários de atendimento
          </p>
        </div>
        <div className="flex gap-2">
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

          <Dialog open={showNewAbsence} onOpenChange={setShowNewAbsence}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <CalendarDaysIcon className="mr-2 h-4 w-4" />
                Nova Ausência
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Nova Ausência</DialogTitle>
              </DialogHeader>
              <NewAbsenceForm 
                onClose={() => setShowNewAbsence(false)} 
                onAbsenceAdded={handleAbsenceAdded}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-6">
        {/* Filtros - Responsivos (lado a lado em md, escondidos em xl) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:hidden gap-4">
          {/* Calendário Mini com função de filtro */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                Calendário
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  if (date) {
                    navigateToWeekByDate(date);
                  }
                }}
                className="rounded-md w-full"
              />
            </CardContent>
          </Card>

          {/* Filtro de Tipos de Consulta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Filtrar Consultas e Ausências</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {allFilterTypes.map((type) => (
                <div key={type.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={`md-${type.name}`}
                    checked={selectedAppointmentTypes.includes(type.name)}
                    onCheckedChange={() => toggleAppointmentType(type.name)}
                  />
                  <label htmlFor={`md-${type.name}`} className="flex items-center gap-2 text-sm cursor-pointer">
                    <div className={cn("w-3 h-3 rounded-sm border", type.color)}></div>
                    <span>{type.name}</span>
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Layout para telas grandes */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Filtros - Apenas visível em xl */}
          <div className="xl:col-span-1 space-y-6 hidden xl:block">
            {/* Calendário Mini com função de filtro */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  Calendário
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    if (date) {
                      navigateToWeekByDate(date);
                    }
                  }}
                  className="rounded-md w-full"
                />
              </CardContent>
            </Card>

            {/* Filtro de Tipos de Consulta */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Filtrar Consultas e Ausências</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {allFilterTypes.map((type) => (
                  <div key={type.name} className="flex items-center space-x-2">
                    <Checkbox
                      id={`xl-${type.name}`}
                      checked={selectedAppointmentTypes.includes(type.name)}
                      onCheckedChange={() => toggleAppointmentType(type.name)}
                    />
                    <label htmlFor={`xl-${type.name}`} className="flex items-center gap-2 text-sm cursor-pointer">
                      <div className={cn("w-3 h-3 rounded-sm border", type.color)}></div>
                      <span>{type.name}</span>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Agenda Semanal */}
          <div className="xl:col-span-3">
          <Card className="w-full">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Agenda Semanal
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {weekDays[0]?.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} - {weekDays[6]?.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="grid grid-cols-8 border-b min-w-[800px]">
                <div className="p-3 border-r bg-muted/30 text-xs font-medium"></div>
                {weekDays.map((day, index) => (
                  <div key={day.toISOString()} className="p-3 border-r bg-muted/30 text-center">
                    <div className="text-xs font-medium text-muted-foreground">
                      {weekDayNames[index]}
                    </div>
                    <div className={cn(
                      "text-sm font-medium mt-1",
                      day.toDateString() === new Date().toDateString() && "text-primary"
                    )}>
                      {day.getDate()}
                    </div>
                  </div>
                ))}
              </div>

                <div className="grid grid-cols-8 relative min-w-[800px]">
                {/* Coluna de horários */}
                <div className="border-r">
                  {timeSlots.map((time) => (
                    <div key={time} className="h-16 border-b p-2 text-xs text-muted-foreground flex items-center">
                      {time}
                    </div>
                  ))}
                </div>

                {/* Colunas dos dias */}
                {weekDays.map((day) => (
                  <div key={day.toISOString()} className="border-r relative">
                    {timeSlots.map((time) => (
                      <div key={time} className="h-16 border-b"></div>
                    ))}
                    
                    {/* Ausências do dia */}
                    {getAbsencesForDate(day).map((absence) => {
                      const isSameDay = absence.startDate.toDateString() === absence.endDate.toDateString();
                      return (
                        <div
                          key={absence.id}
                          className="absolute left-1 right-1 p-1 rounded text-xs bg-red-100 text-red-800 border border-red-200 opacity-90 cursor-pointer hover:opacity-75 transition-opacity"
                          style={{
                            top: isSameDay && absence.startTime ? `${getAppointmentPosition(absence.startTime)}px` : '0px',
                            height: isSameDay && absence.startTime && absence.endTime ? 
                              `${getAppointmentPosition(absence.endTime) - getAppointmentPosition(absence.startTime)}px` : 
                              '100%',
                            zIndex: 5
                          }}
                          onClick={() => setSelectedAbsence(absence)}
                        >
                          <div className="font-medium truncate">Ausência</div>
                          <div className="truncate">{absence.type}</div>
                          {isSameDay && absence.startTime && absence.endTime && (
                            <div className="truncate text-xs opacity-75">
                              {absence.startTime} - {absence.endTime}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Consultas do dia */}
                    {getAppointmentsForDate(day).map((appointment) => (
                      <div
                        key={appointment.id}
                        className={cn(
                          "absolute left-1 right-1 p-1 rounded text-xs cursor-pointer border",
                          getAppointmentColor(appointment.type),
                          "hover:opacity-80 transition-opacity"
                        )}
                        style={{
                          top: `${getAppointmentPosition(appointment.time)}px`,
                          height: '56px', // Altura fixa para as consultas
                          zIndex: 10
                        }}
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <div className="font-medium truncate">{appointment.time}</div>
                        <div className="truncate">{appointment.patientName}</div>
                        <div className="truncate text-xs opacity-75">{appointment.type}</div>
                      </div>
                    ))}
                  </div>
                ))}
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
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
              onUpdateAppointment={handleUpdateAppointment}
              onCancelAppointment={handleCancelAppointment}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes da Ausência */}
      <AbsenceDetails
        absence={selectedAbsence}
        isOpen={!!selectedAbsence}
        onClose={() => setSelectedAbsence(null)}
        onDelete={handleDeleteAbsence}
      />
    </div>
  );
};

export default Calendario;