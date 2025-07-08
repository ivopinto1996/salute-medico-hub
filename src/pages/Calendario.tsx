import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CalendarIcon, Clock, MapPin, FileText, Users, Plus, ChevronLeft, ChevronRight, Calendar as CalendarDaysIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AppointmentDetails } from '@/components/Calendar/AppointmentDetails';
import { NewAppointmentForm } from '@/components/Calendar/NewAppointmentForm';
import { NewAbsenceForm } from '@/components/Calendar/NewAbsenceForm';
import { AbsenceDetails } from '@/components/Calendar/AbsenceDetails';
import { DragDropConfirmationModal } from '@/components/Calendar/DragDropConfirmationModal';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useToast } from '@/hooks/use-toast';

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
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null);
  const [pendingMove, setPendingMove] = useState<{
    appointment: Appointment;
    newDate: Date;
    newTime: string;
  } | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Dados simulados de consultas com mais variedade - agora como estado
  const [appointments, setAppointments] = useState<Appointment[]>([
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
  ]);

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

  // Simulação dos horários de trabalho do médico com slots de almoço
  const doctorSchedule = {
    'Segunda': { manhaPrimeira: '09:00', manhaUltima: '12:00', tardePrimeira: '13:00', tardeUltima: '18:00', ativo: true },
    'Terça': { manhaPrimeira: '09:00', manhaUltima: '12:00', tardePrimeira: '13:00', tardeUltima: '18:00', ativo: true },
    'Quarta': { manhaPrimeira: '09:00', manhaUltima: '12:00', tardePrimeira: '13:00', tardeUltima: '18:00', ativo: true },
    'Quinta': { manhaPrimeira: '09:00', manhaUltima: '12:00', tardePrimeira: '13:00', tardeUltima: '18:00', ativo: true },
    'Sexta': { manhaPrimeira: '09:00', manhaUltima: '12:00', tardePrimeira: '13:00', tardeUltima: '18:00', ativo: true },
    'Sábado': { manhaPrimeira: '09:00', manhaUltima: '12:00', tardePrimeira: '13:00', tardeUltima: '16:00', ativo: false },
    'Domingo': { manhaPrimeira: '09:00', manhaUltima: '12:00', tardePrimeira: '13:00', tardeUltima: '16:00', ativo: false },
  };

  const getDayName = (date: Date) => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[date.getDay()];
  };

  const getLunchBreakForDate = (date: Date) => {
    const dayName = getDayName(date);
    const schedule = doctorSchedule[dayName as keyof typeof doctorSchedule];
    if (schedule && schedule.ativo) {
      return {
        start: schedule.manhaUltima,
        end: schedule.tardePrimeira
      };
    }
    return null;
  };

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
    setAppointments(prevAppointments => 
      prevAppointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, date: newDate, time: newTime }
          : appointment
      )
    );
  };

  const handleCancelAppointment = (appointmentId: string, reason: string) => {
    setAppointments(prevAppointments => 
      prevAppointments.filter(appointment => appointment.id !== appointmentId)
    );
    console.log(`Consulta ${appointmentId} cancelada com motivo: ${reason}`);
  };

  const handleCancelMultipleAppointments = (appointmentIds: string[], reason: string) => {
    setAppointments(prevAppointments => 
      prevAppointments.filter(appointment => !appointmentIds.includes(appointment.id))
    );
    appointmentIds.forEach(id => {
      console.log(`Consulta ${id} cancelada automaticamente com motivo: ${reason}`);
    });
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

  const getAbsenceColor = (type: string) => {
    const absenceType = absenceTypes.find(t => t.name === type);
    return absenceType?.color || 'bg-red-100 text-red-800 border-red-200';
  };

  const handleAbsenceAdded = (absence: Absence) => {
    console.log('Adicionando ausência ao calendário:', absence);
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

  // Funções para drag and drop
  const handleDragStart = (event: DragStartEvent) => {
    const appointment = appointments.find(apt => apt.id === event.active.id);
    if (appointment) {
      setDraggedAppointment(appointment);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedAppointment(null);

    if (!over || !active.id) return;

    const draggedAppointment = appointments.find(apt => apt.id === active.id);
    if (!draggedAppointment) return;

    // Parse the drop zone id to get date and time
    const dropData = over.id.toString().split('-');
    if (dropData.length < 3) return;

    const dayIndex = parseInt(dropData[1]);
    const timeSlot = dropData[2];
    
    if (isNaN(dayIndex) || dayIndex < 0 || dayIndex >= weekDays.length) return;

    const newDate = weekDays[dayIndex];
    const newTime = timeSlot;

    // Check if this is actually a different time/date
    const isSameDate = draggedAppointment.date.toDateString() === newDate.toDateString();
    const isSameTime = draggedAppointment.time === newTime;
    
    if (isSameDate && isSameTime) return;

    // Set up confirmation modal
    setPendingMove({
      appointment: draggedAppointment,
      newDate,
      newTime
    });
  };

  const confirmMove = () => {
    if (!pendingMove) return;

    handleUpdateAppointment(
      pendingMove.appointment.id,
      pendingMove.newDate,
      pendingMove.newTime
    );

    toast({
      title: "Consulta reagendada",
      description: `Consulta de ${pendingMove.appointment.patientName} movida para ${format(pendingMove.newDate, 'dd/MM/yyyy')} às ${pendingMove.newTime}`,
    });

    setPendingMove(null);
  };

  const cancelMove = () => {
    setPendingMove(null);
  };

  // Componente para slot que pode receber drop
  const DroppableTimeSlot = ({ day, timeSlot, dayIndex }: { day: Date; timeSlot: string; dayIndex: number }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: `drop-${dayIndex}-${timeSlot}`,
    });

    return (
      <div
        ref={setNodeRef}
        className={cn(
          "h-16 border-b relative",
          isOver && "bg-primary/10 border-primary/30"
        )}
      />
    );
  };

  // Componente para consulta arrastável
  const DraggableAppointment = ({ appointment, day }: { appointment: Appointment; day: Date }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      isDragging,
    } = useDraggable({
      id: appointment.id,
    });

    const style = transform ? {
      transform: CSS.Translate.toString(transform),
    } : undefined;

    const combinedStyle = {
      top: `${getAppointmentPosition(appointment.time)}px`,
      height: '56px',
      ...style
    };

    return (
      <div
        ref={setNodeRef}
        style={combinedStyle}
        {...listeners}
        {...attributes}
        className={cn(
          "absolute left-1 right-1 p-1 rounded text-xs cursor-grab border select-none",
          getAppointmentColor(appointment.type),
          isDragging ? "opacity-50 z-50" : "hover:opacity-80 transition-opacity z-10"
        )}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedAppointment(appointment);
        }}
      >
        <div className="font-medium truncate">{appointment.time}</div>
        <div className="truncate">{appointment.patientName}</div>
        <div className="truncate text-xs opacity-75">{appointment.type}</div>
      </div>
    );
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
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
                <Plus className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Nova Consulta</span>
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
                <CalendarDaysIcon className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Nova Ausência</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Nova Ausência</DialogTitle>
              </DialogHeader>
              <NewAbsenceForm 
                onClose={() => setShowNewAbsence(false)} 
                onAbsenceAdded={handleAbsenceAdded}
                appointments={appointments}
                onCancelAppointments={handleCancelMultipleAppointments}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-6">
        {/* Filtros - Accordions para mobile (escondidos em md+) */}
        <div className="md:hidden space-y-2">
          <Accordion type="multiple" defaultValue={["calendar", "filters"]} className="w-full">
            <AccordionItem value="calendar">
              <AccordionTrigger className="flex items-center justify-between py-3 [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Calendário</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      if (date) {
                        navigateToWeekByDate(date);
                      }
                    }}
                    className="rounded-md w-full mx-auto [&>div]:w-full [&_table]:w-full [&_td]:text-center [&_th]:text-center"
                    classNames={{
                      months: "flex flex-col space-y-4 w-full",
                      month: "space-y-4 w-full",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex w-full",
                      head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: "text-center text-sm p-0 relative w-full h-9 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-9 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground",
                      day_outside: "text-muted-foreground opacity-50",
                      day_disabled: "text-muted-foreground opacity-50",
                      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      day_hidden: "invisible",
                    }}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="filters">
              <AccordionTrigger className="flex items-center justify-between py-3 [&[data-state=open]>svg]:rotate-180">
                <span>Filtrar Consultas e Ausências</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  {allFilterTypes.map((type) => (
                    <div key={type.name} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mobile-${type.name}`}
                        checked={selectedAppointmentTypes.includes(type.name)}
                        onCheckedChange={() => toggleAppointmentType(type.name)}
                      />
                      <label htmlFor={`mobile-${type.name}`} className="flex items-center gap-2 text-sm cursor-pointer">
                        <div className={cn("w-3 h-3 rounded-sm border", type.color)}></div>
                        <span>{type.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Filtros - Cards para tablet (lado a lado em md, escondidos em xl) */}
        <div className="hidden md:grid md:grid-cols-2 xl:hidden gap-4">
          {/* Calendário Mini com função de filtro */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                Calendário
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  if (date) {
                    navigateToWeekByDate(date);
                  }
                }}
                className="rounded-md w-full mx-auto [&>div]:w-full [&_table]:w-full [&_td]:text-center [&_th]:text-center"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
                  month: "space-y-4 w-full",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex w-full",
                  head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "text-center text-sm p-0 relative w-full h-9 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
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
              <CardContent className="p-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    if (date) {
                      navigateToWeekByDate(date);
                    }
                  }}
                  className="rounded-md w-full mx-auto [&>div]:w-full [&_table]:w-full [&_td]:text-center [&_th]:text-center"
                  classNames={{
                    months: "flex flex-col space-y-4 w-full",
                    month: "space-y-4 w-full",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex w-full",
                    head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "text-center text-sm p-0 relative w-full h-9 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-9 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
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
                {weekDays.map((day, dayIndex) => (
                  <div key={day.toISOString()} className="border-r relative">
                    {/* Droppable time slots */}
                    {timeSlots.map((time) => (
                      <DroppableTimeSlot key={time} day={day} timeSlot={time} dayIndex={dayIndex} />
                    ))}
                    
                    {/* Slot de Almoço */}
                    {(() => {
                      const lunchBreak = getLunchBreakForDate(day);
                      if (lunchBreak) {
                        return (
                          <div
                            className="absolute left-1 right-1 p-1 rounded text-xs bg-orange-100 text-orange-800 border border-orange-200 opacity-70 flex items-center justify-center"
                            style={{
                              top: `${getAppointmentPosition(lunchBreak.start)}px`,
                              height: `${getAppointmentPosition(lunchBreak.end) - getAppointmentPosition(lunchBreak.start)}px`,
                              zIndex: 3
                            }}
                          >
                            <div className="font-medium text-center">
                              <div>🍽️ Almoço</div>
                              <div className="text-xs opacity-75">
                                {lunchBreak.start} - {lunchBreak.end}
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                    
                    {/* Ausências do dia */}
                    {getAbsencesForDate(day).map((absence) => {
                      const isSameDay = absence.startDate.toDateString() === absence.endDate.toDateString();
                      return (
                        <div
                          key={absence.id}
                          className={cn(
                            "absolute left-1 right-1 p-1 rounded text-xs border opacity-90 cursor-pointer hover:opacity-75 transition-opacity",
                            getAbsenceColor(absence.type)
                          )}
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

                    {/* Consultas do dia - agora draggable */}
                    {getAppointmentsForDate(day).map((appointment) => (
                      <DraggableAppointment key={appointment.id} appointment={appointment} day={day} />
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

      {/* Modal de Confirmação de Drag and Drop */}
      {pendingMove && (
        <DragDropConfirmationModal
          isOpen={!!pendingMove}
          onClose={cancelMove}
          onConfirm={confirmMove}
          patientName={pendingMove.appointment.patientName}
          originalDate={pendingMove.appointment.date}
          originalTime={pendingMove.appointment.time}
          newDate={pendingMove.newDate}
          newTime={pendingMove.newTime}
        />
      )}

      {/* Drag Overlay */}
      <DragOverlay>
        {draggedAppointment ? (
          <div className={cn(
            "p-1 rounded text-xs border shadow-lg",
            getAppointmentColor(draggedAppointment.type),
            "opacity-95"
          )}
          style={{ width: '150px', height: '56px' }}
          >
            <div className="font-medium truncate">{draggedAppointment.time}</div>
            <div className="truncate">{draggedAppointment.patientName}</div>
            <div className="truncate text-xs opacity-75">{draggedAppointment.type}</div>
          </div>
        ) : null}
      </DragOverlay>
      </div>
    </DndContext>
  );
};

export default Calendario;