import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertTriangle, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

interface AbsenceConflictModalProps {
  conflictingAppointments: Appointment[];
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const AbsenceConflictModal = ({ 
  conflictingAppointments, 
  onClose, 
  onConfirm 
}: AbsenceConflictModalProps) => {
  const { toast } = useToast();
  const [showReasonsStep, setShowReasonsStep] = useState(false);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const cancellationReasons = [
    'Emergência médica',
    'Doença do médico',
    'Compromisso urgente',
    'Problema técnico/equipamento',
    'Reagendamento solicitado pelo paciente',
    'Outros'
  ];

  const handleProceedToReasons = () => {
    setShowReasonsStep(true);
  };

  const handleConfirmCancellation = () => {
    if (!reason) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um motivo para o cancelamento.",
        variant: "destructive",
      });
      return;
    }

    const finalReason = reason === 'Outros' ? customReason : reason;
    if (reason === 'Outros' && !customReason.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, especifique o motivo do cancelamento.",
        variant: "destructive",
      });
      return;
    }

    onConfirm(finalReason);
  };

  if (showReasonsStep) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Motivo do Cancelamento</h3>
          <p className="text-sm text-muted-foreground">
            Selecione o motivo para o cancelamento das consultas conflitantes
          </p>
        </div>

        <div>
          <Label>Motivo</Label>
          <RadioGroup value={reason} onValueChange={setReason} className="mt-2">
            {cancellationReasons.map((reasonOption) => (
              <div key={reasonOption} className="flex items-center space-x-2">
                <RadioGroupItem value={reasonOption} id={reasonOption} />
                <Label htmlFor={reasonOption} className="text-sm">
                  {reasonOption}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {reason === 'Outros' && (
          <div>
            <Label htmlFor="custom-reason">Especifique o motivo</Label>
            <Textarea
              id="custom-reason"
              placeholder="Descreva o motivo do cancelamento..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="mt-1"
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setShowReasonsStep(false)}>
            Voltar
          </Button>
          <Button variant="destructive" onClick={handleConfirmCancellation}>
            Confirmar Cancelamento
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <div>
          <h3 className="text-lg font-semibold">Conflito de Horários Detectado</h3>
          <p className="text-sm text-muted-foreground">
            A nova ausência conflita com {conflictingAppointments.length} consulta(s) agendada(s)
          </p>
        </div>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg space-y-3">
        <p className="font-medium text-sm">
          As seguintes consultas serão canceladas automaticamente:
        </p>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {conflictingAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center gap-3 p-2 bg-background rounded border">
              <div className="flex-1">
                <p className="font-medium text-sm">{appointment.patientName}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    {format(appointment.date, 'dd/MM/yyyy')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {appointment.time}
                  </div>
                  <span>{appointment.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Atenção:</strong> Todas as consultas listadas acima serão canceladas 
          quando você confirmar o registro da ausência. Esta ação não pode ser desfeita.
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={handleProceedToReasons}>
          Prosseguir com Cancelamento
        </Button>
      </div>
    </div>
  );
};