import { useState } from 'react';
import { FileText, Search, Filter, Download, Eye, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Document {
  id: string;
  name: string;
  type: string;
  patientName: string;
  uploadDate: string;
  size: string;
  consultationDate: string;
  url: string;
}

const Documentos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Dados simulados de documentos
  const documents: Document[] = [
    {
      id: '1',
      name: 'Exame de Sangue - Hemograma Completo',
      type: 'Exame Laboratorial',
      patientName: 'Maria Silva',
      uploadDate: '2024-01-15',
      size: '2.4 MB',
      consultationDate: '2024-01-10',
      url: '#',
    },
    {
      id: '2',
      name: 'Eletrocardiograma',
      type: 'Exame Cardiológico',
      patientName: 'Maria Silva',
      uploadDate: '2024-01-15',
      size: '1.8 MB',
      consultationDate: '2024-01-10',
      url: '#',
    },
    {
      id: '3',
      name: 'Raio-X do Tórax',
      type: 'Imagem Radiológica',
      patientName: 'João Santos',
      uploadDate: '2024-01-20',
      size: '5.2 MB',
      consultationDate: '2024-01-18',
      url: '#',
    },
    {
      id: '4',
      name: 'Ressonância Magnética - Joelho',
      type: 'Imagem Radiológica',
      patientName: 'Ana Costa',
      uploadDate: '2024-01-22',
      size: '12.7 MB',
      consultationDate: '2024-01-20',
      url: '#',
    },
    {
      id: '5',
      name: 'Relatório de Fisioterapia',
      type: 'Relatório Médico',
      patientName: 'Carlos Oliveira',
      uploadDate: '2024-01-25',
      size: '890 KB',
      consultationDate: '2024-01-23',
      url: '#',
    },
  ];

  // Filtros únicos para seleção
  const uniquePatients = [...new Set(documents.map(doc => doc.patientName))];
  const uniqueTypes = [...new Set(documents.map(doc => doc.type))];

  // Filtrar documentos
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPatient = selectedPatient === 'all' || doc.patientName === selectedPatient;
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    
    return matchesSearch && matchesPatient && matchesType;
  });

  const handleDownload = (document: Document) => {
    // Simulação de download - em produção, implementar download real
    console.log(`Baixando documento: ${document.name}`);
  };

  const handleView = (document: Document) => {
    setSelectedDocument(document);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Exame Laboratorial': 'bg-blue-100 text-blue-800',
      'Exame Cardiológico': 'bg-red-100 text-red-800',
      'Imagem Radiológica': 'bg-green-100 text-green-800',
      'Relatório Médico': 'bg-purple-100 text-purple-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Documentos</h1>
        <p className="text-muted-foreground">
          Gerencie todos os documentos compartilhados pelos pacientes
        </p>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtro por Paciente */}
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por paciente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os pacientes</SelectItem>
                {uniquePatients.map((patient) => (
                  <SelectItem key={patient} value={patient}>
                    {patient}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro por Tipo */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Botão de Limpar Filtros */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedPatient('all');
                setSelectedType('all');
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Documentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentos ({filteredDocuments.length})
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum documento encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium">{document.name}</h3>
                      <Badge className={getTypeColor(document.type)}>
                        {document.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {document.patientName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Consulta: {new Date(document.consultationDate).toLocaleDateString('pt-BR')}
                      </div>
                      <span>Enviado: {new Date(document.uploadDate).toLocaleDateString('pt-BR')}</span>
                      <span>Tamanho: {document.size}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(document)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Visualizar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(document)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Visualização de Documento */}
      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Visualizar Documento</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Nome do Documento:</p>
                  <p className="text-sm text-muted-foreground">{selectedDocument.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Paciente:</p>
                  <p className="text-sm text-muted-foreground">{selectedDocument.patientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Tipo:</p>
                  <p className="text-sm text-muted-foreground">{selectedDocument.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Data da Consulta:</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedDocument.consultationDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              
              {/* Simulação de viewer de documento */}
              <div className="bg-gray-100 h-96 flex items-center justify-center rounded-lg">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Visualização do documento seria exibida aqui</p>
                  <p className="text-sm">Em produção, integrar com viewer de PDF/imagem</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownload(selectedDocument)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documentos;