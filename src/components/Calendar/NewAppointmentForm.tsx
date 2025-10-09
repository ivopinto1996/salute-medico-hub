import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock, MapPin, User, Check, ChevronsUpDown, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

const formSchema = z.object({
  patientName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  patientEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  date: z.date({
    required_error: 'Data é obrigatória',
  }),
  time: z.string().min(1, 'Horário é obrigatório'),
  consultationType: z.string().min(1, 'Tipo de consulta é obrigatório'),
  location: z.string().min(1, 'Localização é obrigatória'),
  hasInsurance: z.boolean(),
  notes: z.string().optional(),
});

interface NewAppointmentFormProps {
  onClose: () => void;
  setAppointments: (appointments) => void;
}

export const NewAppointmentForm = ({ onClose, setAppointments }: NewAppointmentFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExternalEmail, setShowExternalEmail] = useState(false);

  // Lista mock de utilizadores registrados - futuramente virá do backend
  const registeredPatients = [
    { id: '1', name: 'João Silva', email: 'joao@email.com' },
    { id: '2', name: 'Maria Santos', email: 'maria@email.com' },
    { id: '3', name: 'Pedro Costa', email: 'pedro@email.com' },
    { id: '4', name: 'Ana Ferreira', email: 'ana@email.com' },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: '',
      patientEmail: '',
      time: '',
      consultationType: '',
      location: '',
      hasInsurance: false,
      notes: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Simulação de agendamento - em produção, conectar com backend
    setTimeout(() => {
      console.log('Nova consulta agendada:', values);
      toast({
        title: 'Consulta agendada com sucesso',
        description: `Consulta com ${values.patientName} agendada para ${format(values.date, 'dd/MM/yyyy')} às ${values.time}`,
      });
      setAppointments((prevAppointments) => [
        ...prevAppointments,
        {
          id: new Date().getTime().toString(),
          patientName: values.patientName,
          time: values.time,
          date: values.date,
          hasInsurance: values.hasInsurance,
          location: values.location,
          documents: [],
          type: values.consultationType,
          observacoes: values.notes,
        }
      ])
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const consultationTypes = [
    'Primeira Consulta',
    'Consulta de Rotina',
    'Retorno',
    'Exame',
    'Emergência'
  ];

  const locations = [
    'Consultório A - Rua das Flores, 123, São Paulo',
    'Consultório B - Av. Paulista, 456, São Paulo',
    'Hospital Central - Rua da Saúde, 789, São Paulo'
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Nome do Paciente e Email */}
        <div className={cn("grid gap-4", showExternalEmail ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
          {/* Nome do Paciente */}
          <FormField
            control={form.control}
            name="patientName"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome do Paciente
                </FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do paciente" {...field} />
                </FormControl>
                <div className="text-xs text-muted-foreground">
                  <button 
                    type="button"
                    onClick={() => setShowExternalEmail(!showExternalEmail)}
                    className="hover:text-primary underline transition-colors"
                  >
                    {showExternalEmail 
                      ? "Voltar para marcação de consulta a paciente registado"
                      : "O paciente não está registado na plataforma?"
                    }
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email do Paciente Externo - Condicional */}
          {showExternalEmail && (
            <FormField
              control={form.control}
              name="patientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email do Paciente (opcional)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="email@exemplo.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Tipo de Consulta */}
        <FormField
          control={form.control}
          name="consultationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Consulta</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {consultationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Data */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data da Consulta</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'dd/MM/yyyy')
                        ) : (
                          <span>Selecione a data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Horário */}
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horário
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Localização */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Localização do Consultório
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a localização" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Uso de Seguro */}
        <FormField
          control={form.control}
          name="hasInsurance"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Uso de Seguro</FormLabel>
                <div className="text-sm text-muted-foreground">
                  O paciente utilizará seguro de saúde?
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Observações */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Adicione observações sobre a consulta..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botões */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Agendando...' : 'Agendar Consulta'}
          </Button>
        </div>
      </form>
    </Form>
  );
};