import { useState } from 'react';
import { User, Phone, Mail, MapPin, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Conta = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: 'Dados salvos com sucesso',
        description: 'Suas informações foram atualizadas.',
      });
      setIsLoading(false);
    }, 1000);
  };

  const nationalities = [
    'Portuguesa', 'Brasileira', 'Espanhola', 'Francesa', 'Alemã', 'Italiana', 'Britânica', 
    'Holandesa', 'Belga', 'Suíça', 'Austríaca', 'Sueca', 'Dinamarquesa', 'Norueguesa', 
    'Finlandesa', 'Polaca', 'Checa', 'Húngara', 'Romena', 'Búlgara', 'Grega', 'Croata',
    'Eslovena', 'Eslovaca', 'Lituana', 'Letã', 'Estónia', 'Luxemburguesa', 'Maltesa',
    'Cipriota', 'Irlandesa', 'Americana', 'Canadiana', 'Mexicana', 'Argentina', 'Chilena',
    'Peruana', 'Colombiana', 'Venezuelana', 'Equatoriana', 'Boliviana', 'Paraguaia',
    'Uruguaia', 'Chinesa', 'Japonesa', 'Coreana', 'Indiana', 'Australiana', 'Russa',
    'Ucraniana', 'Turca', 'Marroquina', 'Tunisina', 'Argelina', 'Egípcia', 'Sul-africana'
  ];

  const medicalSpecialties = [
    'Cardiologia', 'Dermatologia', 'Endocrinologia', 'Gastroenterologia', 'Geriatria',
    'Ginecologia', 'Hematologia', 'Infectologia', 'Medicina Interna', 'Nefrologia',
    'Neurologia', 'Oftalmologia', 'Oncologia', 'Ortopedia', 'Otorrinolaringologia',
    'Pediatria', 'Pneumologia', 'Psiquiatria', 'Reumatologia', 'Urologia',
    'Anestesiologia', 'Cirurgia Geral', 'Cirurgia Plástica', 'Medicina de Emergência',
    'Medicina do Trabalho', 'Medicina Desportiva', 'Medicina Nuclear', 'Patologia',
    'Radiologia', 'Medicina Física e Reabilitação'
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestão da Conta</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" defaultValue="João" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname">Apelido</Label>
                <Input id="surname" defaultValue="Silva" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Género</Label>
                <Select defaultValue="masculino">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nacionalidade</Label>
                <Select defaultValue="portuguesa">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar nacionalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {nationalities.map((nationality) => (
                      <SelectItem key={nationality.toLowerCase()} value={nationality.toLowerCase()}>
                        {nationality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="birth">Data de Nascimento</Label>
              <Input id="birth" type="date" defaultValue="1980-05-15" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="docType">Documento de Identificação</Label>
                <Select defaultValue="cartao-cidadao">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cartao-cidadao">Cartão de Cidadão</SelectItem>
                    <SelectItem value="passaporte">Passaporte</SelectItem>
                    <SelectItem value="bilhete-identidade">Bilhete de Identidade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="docNumber">Nº Documento de Identificação</Label>
                <Input id="docNumber" defaultValue="12345678 9 ZZ0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nif">NIF</Label>
              <Input id="nif" defaultValue="123456789" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados Profissionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialty">Especialidade</Label>
              <Select defaultValue="cardiologia">
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {medicalSpecialties.map((specialty) => (
                    <SelectItem key={specialty.toLowerCase()} value={specialty.toLowerCase()}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula Profissional</Label>
              <Input id="cedula" defaultValue="123456" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ordem">Ordem</Label>
              <Input id="ordem" defaultValue="Ordem dos Médicos" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contactos Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Contacto Telefónico</Label>
            <div className="flex gap-2">
              <Select defaultValue="+351">
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+351">+351</SelectItem>
                  <SelectItem value="+55">+55</SelectItem>
                  <SelectItem value="+34">+34</SelectItem>
                  <SelectItem value="+33">+33</SelectItem>
                  <SelectItem value="+49">+49</SelectItem>
                  <SelectItem value="+44">+44</SelectItem>
                  <SelectItem value="+1">+1</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="999999999" defaultValue="999999999" className="flex-1" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="joao.silva@email.com" disabled />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Morada</Label>
            <Input id="address" defaultValue="Rua das Flores, 123, 1200-001 Lisboa" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  );
};

export default Conta;