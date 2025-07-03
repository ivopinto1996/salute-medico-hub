import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface NewAbsenceFormProps {
  onClose: () => void;
  onAbsenceAdded?: (absence: any) => void;
}

export const NewAbsenceForm = ({ onClose, onAbsenceAdded }: NewAbsenceFormProps) => {
  const { toast } = useToast();
  const [absenceType, setAbsenceType] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('18:00');

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

    console.log('Registrando ausência:', absence); // Debug

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

  return (
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

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          Registrar Ausência
        </Button>
      </div>
    </div>
  );
};