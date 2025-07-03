import { useState } from 'react';
import { Trash2, Clock, Calendar as CalendarIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { pt } from 'date-fns/locale';

interface Absence {
  id: string;
  type: string;
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
}

interface AbsenceDetailsProps {
  absence: Absence | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (absenceId: string) => void;
}

export const AbsenceDetails = ({ absence, isOpen, onClose, onDelete }: AbsenceDetailsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!absence) return null;

  const handleDelete = () => {
    onDelete(absence.id);
    setShowDeleteDialog(false);
    onClose();
  };

  const isSameDay = absence.startDate.toDateString() === absence.endDate.toDateString();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Detalhes da Ausência
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo de Ausência</label>
              <div className="mt-1">
                <Badge variant="secondary" className="text-sm">
                  {absence.type}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data de Início</label>
                <div className="mt-1 text-sm">
                  {format(absence.startDate, 'dd/MM/yyyy', { locale: pt })}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data de Fim</label>
                <div className="mt-1 text-sm">
                  {format(absence.endDate, 'dd/MM/yyyy', { locale: pt })}
                </div>
              </div>
            </div>

            {isSameDay && absence.startTime && absence.endTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {absence.startTime} - {absence.endTime}
                </span>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Apagar Ausência
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Eliminação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja eliminar esta ausência? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};