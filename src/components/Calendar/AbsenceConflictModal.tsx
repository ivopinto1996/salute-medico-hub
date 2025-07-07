import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';

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

interface AbsenceConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (cancellationReason: string) => void;
  conflictingAppointments: Appointment[];
  absence: Absence;
}

export const AbsenceConflictModal = ({
  isOpen,
  onClose,
  onConfirm,
  conflictingAppointments,
  absence,
}: AbsenceConflictModalProps) => {
  const [cancellationReason, setCancellationReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const cancellationReasons = [
    'Emergência médica',
    'Doença do médico',
    'Compromisso urgente',
    'Problema técnico/equipamento',
    'Reagendamento solicitado pelo paciente',
    'Outros'
  ];

  const handleConfirm = () => {
    if (!cancellationReason) return;
    
    const finalReason = cancellationReason === 'Outros' ? customReason : cancellationReason;
    if (cancellationReason === 'Outros' && !customReason.trim()) return;
    
    onConfirm(finalReason);
    setCancellationReason('');
    setCustomReason('');
  };

  const handleClose = () => {
    onClose();
    setCancellationReason('');
    setCustomReason('');
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Conflito de Ausência Detectado</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              A ausência "<strong>{absence.type}</strong>" de{' '}
              <strong>{format(absence.startDate, 'dd/MM/yyyy')}</strong> a{' '}
              <strong>{format(absence.endDate, 'dd/MM/yyyy')}</strong>
              {absence.startTime && absence.endTime && (
                <>
                  {' '}das <strong>{absence.startTime}</strong> às <strong>{absence.endTime}</strong>
                </>
              )}
              {' '}irá entrar em conflito com as seguintes consultas:
            </p>

            <div className="bg-muted p-4 rounded-md max-h-40 overflow-y-auto">
              <p className="font-medium mb-2">
                {conflictingAppointments.length} consulta{conflictingAppointments.length !== 1 ? 's' : ''} será{conflictingAppointments.length !== 1 ? 'ão' : ''} cancelada{conflictingAppointments.length !== 1 ? 's' : ''}:
              </p>
              <ul className="space-y-2">
                {conflictingAppointments.map((appointment) => (
                  <li key={appointment.id} className="text-sm">
                    • <strong>{appointment.patientName}</strong> -{' '}
                    {format(appointment.date, 'dd/MM/yyyy')} às {appointment.time} ({appointment.type})
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <Label>Motivo do cancelamento das consultas:</Label>
              <RadioGroup value={cancellationReason} onValueChange={setCancellationReason}>
                {cancellationReasons.map((reasonOption) => (
                  <div key={reasonOption} className="flex items-center space-x-2">
                    <RadioGroupItem value={reasonOption} id={reasonOption} />
                    <Label htmlFor={reasonOption} className="text-sm cursor-pointer">
                      {reasonOption}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {cancellationReason === 'Outros' && (
              <div className="space-y-2">
                <Label htmlFor="custom-reason">Especifique o motivo:</Label>
                <Textarea
                  id="custom-reason"
                  placeholder="Descreva o motivo do cancelamento..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              Deseja prosseguir com a criação da ausência e cancelamento das consultas?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={!cancellationReason || (cancellationReason === 'Outros' && !customReason.trim())}
          >
            Confirmar e Cancelar Consultas
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};