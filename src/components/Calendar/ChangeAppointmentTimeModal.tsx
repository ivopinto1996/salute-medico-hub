import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
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

interface ChangeAppointmentTimeModalProps {
  appointment: Appointment;
  onClose: () => void;
  onSave: (appointmentId: string, newDate: Date, newTime: string) => void;
}

export const ChangeAppointmentTimeModal = ({ appointment, onClose, onSave }: ChangeAppointmentTimeModalProps) => {
  const { toast } = useToast();
  const [newDate, setNewDate] = useState<Date>(appointment.date);
  const [newTime, setNewTime] = useState(appointment.time);

  const handleSave = () => {
    if (!newDate || !newTime) {
      toast({
        title: "Erro",
        description: "Por favor, selecione a data e hora.",
        variant: "destructive",
      });
      return;
    }

    onSave(appointment.id, newDate, newTime);
    toast({
      title: "Consulta reagendada",
      description: "O horário da consulta foi alterado com sucesso.",
    });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">
          Reagendar consulta de {appointment.patientName}
        </Label>
        <p className="text-sm text-muted-foreground mt-1">
          Horário atual: {appointment.date.toLocaleDateString('pt-BR')} às {appointment.time}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Nova Data</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !newDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {newDate ? format(newDate, "dd/MM/yyyy") : <span>Selecionar data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={newDate}
                onSelect={setNewDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="new-time">Nova Hora</Label>
          <Input
            id="new-time"
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          Reagendar
        </Button>
      </div>
    </div>
  );
};