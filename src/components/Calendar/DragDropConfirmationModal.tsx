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

interface DragDropConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  patientName: string;
  originalDate: Date;
  originalTime: string;
  newDate: Date;
  newTime: string;
}

export const DragDropConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  patientName,
  originalDate,
  originalTime,
  newDate,
  newTime,
}: DragDropConfirmationModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Alteração de Horário</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              A consulta do paciente <strong>{patientName}</strong> será alterada:
            </p>
            <div className="bg-muted p-3 rounded-md space-y-1">
              <p>
                <span className="font-medium">De:</span>{' '}
                {format(originalDate, 'dd/MM/yyyy')} às {originalTime}
              </p>
              <p>
                <span className="font-medium">Para:</span>{' '}
                {format(newDate, 'dd/MM/yyyy')} às {newTime}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Deseja confirmar esta alteração?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};