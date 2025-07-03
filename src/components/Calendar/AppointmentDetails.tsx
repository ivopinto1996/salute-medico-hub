import { Clock, MapPin, FileText, User, CreditCard, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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

interface AppointmentDetailsProps {
  appointment: Appointment;
  onClose: () => void;
}

export const AppointmentDetails = ({ appointment, onClose }: AppointmentDetailsProps) => {
  const handleDownloadDocument = (documentName: string) => {
    // Simulação de download - em produção, implementar download real
    console.log(`Baixando documento: ${documentName}`);
  };

  return (
    <div className="space-y-6">
      {/* Informações do Paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações do Paciente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">{appointment.patientName}</span>
            <Badge variant={appointment.hasInsurance ? 'default' : 'secondary'}>
              {appointment.hasInsurance ? 'Com Seguro' : 'Particular'}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Tipo de consulta: {appointment.type}
          </div>
        </CardContent>
      </Card>

      {/* Informações da Consulta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Detalhes da Consulta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Horário:</strong> {appointment.time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Data:</strong> {appointment.date.toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
            <div>
              <p className="text-sm font-medium">Localização:</p>
              <p className="text-sm text-muted-foreground">{appointment.location}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <strong>Uso de Seguro:</strong> {appointment.hasInsurance ? 'Sim' : 'Não'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Documentos Compartilhados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentos Compartilhados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointment.documents.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhum documento compartilhado</p>
            </div>
          ) : (
            <div className="space-y-2">
              {appointment.documents.map((document, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{document}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadDocument(document)}
                    >
                      Visualizar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadDocument(document)}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
        <Button variant="outline">
          Editar Data/Hora
        </Button>
        <Button variant="destructive">
          Cancelar Consulta
        </Button>
      </div>
    </div>
  );
};