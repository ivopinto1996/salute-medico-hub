import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, Clock, Mail, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { AbsenceConflictModal } from './AbsenceConflictModal';

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

interface NewAbsenceFormProps {
  onClose: () => void;
  onAbsenceAdded?: (absence: any) => void;
  appointments?: Appointment[];
  onCancelAppointments?: (appointmentIds: string[], reason: string) => void;
}

export const NewAbsenceForm = ({ 
  onClose, 
  onAbsenceAdded, 
  appointments = [], 
  onCancelAppointments 
}: NewAbsenceFormProps) => {
  const { toast } = useToast();
  const [absenceType, setAbsenceType] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('18:00');
  const [conflictingAppointments, setConflictingAppointments] = useState<Appointment[]>([]);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState<string[]>(['']);

  const absenceTypes = [
    'Férias',
    'Licença Médica',
    'Congresso/Formação',
    'Compromisso Pessoal',
    'Emergência',
    'Outros'
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  // Funções para gerenciar emails
  const addEmailRecipient = () => {
    setEmailRecipients([...emailRecipients, '']);
  };

  const removeEmailRecipient = (index: number) => {
    if (emailRecipients.length > 1) {
      setEmailRecipients(emailRecipients.filter((_, i) => i !== index));
    }
  };

  const updateEmailRecipient = (index: number, email: string) => {
    const updated = [...emailRecipients];
    updated[index] = email;
    setEmailRecipients(updated);
  };

  const sendEmails = async () => {
    const validEmails = emailRecipients.filter(email => email.trim() !== '');
    
    if (validEmails.length === 0) {
      toast({
        title: "Erro",
        description: "Por favor, adicione pelo menos um destinatário de email.",
        variant: "destructive",
      });
      return false;
    }

    // Aqui você precisará implementar a lógica de envio de email
    // Recomendo usar Supabase Edge Functions para isso
    console.log('Enviando emails para:', validEmails);
    
    toast({
      title: "Emails enviados",
      description: `Emails enviados para ${validEmails.length} destinatário(s).`,
    });
    
    return true;
  };

  // Função para verificar conflitos de horário
  const checkForConflicts = (absence: any) => {
    const conflicts = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const absenceStart = new Date(absence.startDate);
      const absenceEnd = new Date(absence.endDate);
      
      // Normalizar as datas para comparação (ignorar horas)
      const compareAppointmentDate = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate());
      const compareAbsenceStart = new Date(absenceStart.getFullYear(), absenceStart.getMonth(), absenceStart.getDate());
      const compareAbsenceEnd = new Date(absenceEnd.getFullYear(), absenceEnd.getMonth(), absenceEnd.getDate());
      
      // Verificar se a data da consulta está dentro do período da ausência
      if (compareAppointmentDate >= compareAbsenceStart && compareAppointmentDate <= compareAbsenceEnd) {
        // Se for o mesmo dia, verificar conflito de horário
        if (compareAppointmentDate.getTime() === compareAbsenceStart.getTime() && 
            compareAbsenceStart.getTime() === compareAbsenceEnd.getTime()) {
          // Mesmo dia: verificar se há conflito de horário
          const appointmentTime = appointment.time;
          return appointmentTime >= absence.startTime && appointmentTime < absence.endTime;
        }
        // Dias diferentes: sempre há conflito
        return true;
      }
      return false;
    });
    
    return conflicts;
  };

  const handleSubmit = () => {
    if (!absenceType || !startDate || !endDate || !startTime || !endTime) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (startDate > endDate) {
      toast({
        title: "Erro",
        description: "A data de início deve ser anterior à data de fim.",
        variant: "destructive",
      });
      return;
    }

    if (startDate.toDateString() === endDate.toDateString() && startTime >= endTime) {
      toast({
        title: "Erro",
        description: "A hora de início deve ser anterior à hora de fim no mesmo dia.",
        variant: "destructive",
      });
      return;
    }

    const absence = {
      id: Math.random().toString(36).substr(2, 9),
      type: absenceType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startTime,
      endTime,
    };

    // Verificar conflitos
    const conflicts = checkForConflicts(absence);
    
    if (conflicts.length > 0) {
      setConflictingAppointments(conflicts);
      setShowConflictModal(true);
      return;
    }

    // Se não há conflitos, proceder normalmente
    proceedWithAbsence(absence);
  };

  const proceedWithAbsence = async (absence: any) => {
    console.log('Registrando ausência:', absence); // Debug

    // Se for Compromisso Pessoal e há emails, enviar notificações
    if (absence.type === 'Compromisso Pessoal' && emailRecipients.some(email => email.trim() !== '')) {
      const emailSent = await sendEmails();
      if (!emailSent) {
        return; // Não proceder se houve erro no envio de emails
      }
    }

    // Callback para adicionar a ausência ao componente pai
    if (onAbsenceAdded) {
      onAbsenceAdded(absence);
    }

    toast({
      title: "Ausência registrada",
      description: "Sua ausência foi registrada com sucesso.",
    });
    onClose();
  };

  const handleConfirmConflicts = (reason: string) => {
    // Cancelar consultas conflitantes
    if (onCancelAppointments && conflictingAppointments.length > 0) {
      const appointmentIds = conflictingAppointments.map(apt => apt.id);
      onCancelAppointments(appointmentIds, reason);
    }

    // Proceder com a ausência
    const absence = {
      id: Math.random().toString(36).substr(2, 9),
      type: absenceType,
      startDate: new Date(startDate!),
      endDate: new Date(endDate!),
      startTime,
      endTime,
    };

    proceedWithAbsence(absence);
    setShowConflictModal(false);
  };

  return (
    <>
      <div className="space-y-4">
        <div>
          <Label htmlFor="absence-type">Tipo de Ausência</Label>
          <Select value={absenceType} onValueChange={setAbsenceType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o tipo de ausência" />
            </SelectTrigger>
            <SelectContent>
              {absenceTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Data e Hora de Início</Label>
            <div className="space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : <span>Selecionar data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar hora" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {time}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Data e Hora de Fim</Label>
            <div className="space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : <span>Selecionar data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar hora" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {time}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Seção de Email - aparece apenas para Compromisso Pessoal */}
        {absenceType === 'Compromisso Pessoal' && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <Label className="text-sm font-medium">Enviar notificação por email</Label>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Destinatários</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEmailRecipient}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Adicionar
                </Button>
              </div>
              
              <div className="space-y-2">
                {emailRecipients.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="email@exemplo.com"
                      value={email}
                      onChange={(e) => updateEmailRecipient(index, e.target.value)}
                      className="flex-1"
                    />
                    {emailRecipients.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeEmailRecipient(index)}
                        className="px-2"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Registrar Ausência
          </Button>
        </div>
      </div>

      {/* Modal de Conflito */}
      <Dialog open={showConflictModal} onOpenChange={setShowConflictModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Conflito de Horários</DialogTitle>
          </DialogHeader>
          <AbsenceConflictModal
            conflictingAppointments={conflictingAppointments}
            onClose={() => setShowConflictModal(false)}
            onConfirm={handleConfirmConflicts}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};