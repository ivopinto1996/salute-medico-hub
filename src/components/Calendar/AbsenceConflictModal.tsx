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

  const handleConfirm = () => {
    onConfirm(cancellationReason);
    setCancellationReason('');
  };

  const handleClose = () => {
    onClose();
    setCancellationReason('');
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

            <div className="space-y-2">
              <Label htmlFor="cancellation-reason">
                Motivo do cancelamento das consultas:
              </Label>
              <Textarea
                id="cancellation-reason"
                placeholder="Ex: Férias programadas, formação médica, etc."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <p className="text-sm text-muted-foreground">
              Deseja prosseguir com a criação da ausência e cancelamento das consultas?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={!cancellationReason.trim()}
          >
            Confirmar e Cancelar Consultas
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};