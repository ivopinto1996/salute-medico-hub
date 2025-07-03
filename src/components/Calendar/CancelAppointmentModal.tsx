import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertTriangle } from 'lucide-react';
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

interface CancelAppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
  onCancel: (appointmentId: string, reason: string, details?: string) => void;
}

export const CancelAppointmentModal = ({ appointment, onClose, onCancel }: CancelAppointmentModalProps) => {
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(true);
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

  const handleConfirmCancel = () => {
    setShowConfirmation(false);
  };

  const handleFinalCancel = () => {
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

    onCancel(appointment.id, finalReason);
    toast({
      title: "Consulta cancelada",
      description: "A consulta foi cancelada com sucesso.",
    });
    onClose();
  };

  if (showConfirmation) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <div>
            <h3 className="text-lg font-semibold">Confirmar Cancelamento</h3>
            <p className="text-sm text-muted-foreground">
              Tem certeza que deseja cancelar a consulta?
            </p>
          </div>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg">
          <p className="font-medium">{appointment.patientName}</p>
          <p className="text-sm text-muted-foreground">
            {appointment.date.toLocaleDateString('pt-BR')} às {appointment.time}
          </p>
          <p className="text-sm text-muted-foreground">
            {appointment.type} - {appointment.location}
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Voltar
          </Button>
          <Button variant="destructive" onClick={handleConfirmCancel}>
            Sim, cancelar consulta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Motivo do Cancelamento</h3>
        <p className="text-sm text-muted-foreground">
          Selecione o motivo para o cancelamento da consulta
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
        <Button variant="outline" onClick={() => setShowConfirmation(true)}>
          Voltar
        </Button>
        <Button variant="destructive" onClick={handleFinalCancel}>
          Cancelar Consulta
        </Button>
      </div>
    </div>
  );
};