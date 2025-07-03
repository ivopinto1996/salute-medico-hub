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
  const [selectedPrefix, setSelectedPrefix] = useState('+351');
  const [phoneNumber, setPhoneNumber] = useState('999999999');

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

  const countryCodes = [
    { code: '+1', country: 'EUA/Canadá', digits: 10 },
    { code: '+7', country: 'Rússia/Cazaquistão', digits: 10 },
    { code: '+20', country: 'Egito', digits: 10 },
    { code: '+27', country: 'África do Sul', digits: 9 },
    { code: '+30', country: 'Grécia', digits: 10 },
    { code: '+31', country: 'Holanda', digits: 9 },
    { code: '+32', country: 'Bélgica', digits: 9 },
    { code: '+33', country: 'França', digits: 9 },
    { code: '+34', country: 'Espanha', digits: 9 },
    { code: '+36', country: 'Hungria', digits: 9 },
    { code: '+39', country: 'Itália', digits: 10 },
    { code: '+40', country: 'Roménia', digits: 9 },
    { code: '+41', country: 'Suíça', digits: 9 },
    { code: '+43', country: 'Áustria', digits: 11 },
    { code: '+44', country: 'Reino Unido', digits: 10 },
    { code: '+45', country: 'Dinamarca', digits: 8 },
    { code: '+46', country: 'Suécia', digits: 9 },
    { code: '+47', country: 'Noruega', digits: 8 },
    { code: '+48', country: 'Polónia', digits: 9 },
    { code: '+49', country: 'Alemanha', digits: 11 },
    { code: '+51', country: 'Peru', digits: 9 },
    { code: '+52', country: 'México', digits: 10 },
    { code: '+53', country: 'Cuba', digits: 8 },
    { code: '+54', country: 'Argentina', digits: 10 },
    { code: '+55', country: 'Brasil', digits: 11 },
    { code: '+56', country: 'Chile', digits: 9 },
    { code: '+57', country: 'Colômbia', digits: 10 },
    { code: '+58', country: 'Venezuela', digits: 10 },
    { code: '+60', country: 'Malásia', digits: 9 },
    { code: '+61', country: 'Austrália', digits: 9 },
    { code: '+62', country: 'Indonésia', digits: 11 },
    { code: '+63', country: 'Filipinas', digits: 10 },
    { code: '+64', country: 'Nova Zelândia', digits: 9 },
    { code: '+65', country: 'Singapura', digits: 8 },
    { code: '+66', country: 'Tailândia', digits: 9 },
    { code: '+81', country: 'Japão', digits: 10 },
    { code: '+82', country: 'Coreia do Sul', digits: 10 },
    { code: '+84', country: 'Vietname', digits: 9 },
    { code: '+86', country: 'China', digits: 11 },
    { code: '+90', country: 'Turquia', digits: 10 },
    { code: '+91', country: 'Índia', digits: 10 },
    { code: '+92', country: 'Paquistão', digits: 10 },
    { code: '+93', country: 'Afeganistão', digits: 9 },
    { code: '+94', country: 'Sri Lanka', digits: 9 },
    { code: '+95', country: 'Myanmar', digits: 9 },
    { code: '+98', country: 'Irão', digits: 10 },
    { code: '+212', country: 'Marrocos', digits: 9 },
    { code: '+213', country: 'Argélia', digits: 9 },
    { code: '+216', country: 'Tunísia', digits: 8 },
    { code: '+218', country: 'Líbia', digits: 9 },
    { code: '+220', country: 'Gâmbia', digits: 7 },
    { code: '+221', country: 'Senegal', digits: 9 },
    { code: '+222', country: 'Mauritânia', digits: 8 },
    { code: '+223', country: 'Mali', digits: 8 },
    { code: '+224', country: 'Guiné', digits: 9 },
    { code: '+225', country: 'Costa do Marfim', digits: 8 },
    { code: '+226', country: 'Burkina Faso', digits: 8 },
    { code: '+227', country: 'Níger', digits: 8 },
    { code: '+228', country: 'Togo', digits: 8 },
    { code: '+229', country: 'Benim', digits: 8 },
    { code: '+230', country: 'Maurícia', digits: 7 },
    { code: '+231', country: 'Libéria', digits: 8 },
    { code: '+232', country: 'Serra Leoa', digits: 8 },
    { code: '+233', country: 'Gana', digits: 9 },
    { code: '+234', country: 'Nigéria', digits: 10 },
    { code: '+235', country: 'Chade', digits: 8 },
    { code: '+236', country: 'República Centro-Africana', digits: 8 },
    { code: '+237', country: 'Camarões', digits: 9 },
    { code: '+238', country: 'Cabo Verde', digits: 7 },
    { code: '+239', country: 'São Tomé e Príncipe', digits: 7 },
    { code: '+240', country: 'Guiné Equatorial', digits: 9 },
    { code: '+241', country: 'Gabão', digits: 8 },
    { code: '+242', country: 'Congo', digits: 9 },
    { code: '+243', country: 'RD Congo', digits: 9 },
    { code: '+244', country: 'Angola', digits: 9 },
    { code: '+245', country: 'Guiné-Bissau', digits: 7 },
    { code: '+246', country: 'Diego Garcia', digits: 7 },
    { code: '+248', country: 'Seicheles', digits: 7 },
    { code: '+249', country: 'Sudão', digits: 9 },
    { code: '+250', country: 'Ruanda', digits: 9 },
    { code: '+251', country: 'Etiópia', digits: 9 },
    { code: '+252', country: 'Somália', digits: 8 },
    { code: '+253', country: 'Jibuti', digits: 8 },
    { code: '+254', country: 'Quénia', digits: 9 },
    { code: '+255', country: 'Tanzânia', digits: 9 },
    { code: '+256', country: 'Uganda', digits: 9 },
    { code: '+257', country: 'Burundi', digits: 8 },
    { code: '+258', country: 'Moçambique', digits: 9 },
    { code: '+260', country: 'Zâmbia', digits: 9 },
    { code: '+261', country: 'Madagascar', digits: 9 },
    { code: '+262', country: 'Reunião/Mayotte', digits: 9 },
    { code: '+263', country: 'Zimbabué', digits: 9 },
    { code: '+264', country: 'Namíbia', digits: 9 },
    { code: '+265', country: 'Malawi', digits: 9 },
    { code: '+266', country: 'Lesoto', digits: 8 },
    { code: '+267', country: 'Botsuana', digits: 8 },
    { code: '+268', country: 'Suazilândia', digits: 8 },
    { code: '+269', country: 'Comores', digits: 7 },
    { code: '+290', country: 'Santa Helena', digits: 4 },
    { code: '+291', country: 'Eritreia', digits: 7 },
    { code: '+297', country: 'Aruba', digits: 7 },
    { code: '+298', country: 'Ilhas Faroé', digits: 6 },
    { code: '+299', country: 'Groenlândia', digits: 6 },
    { code: '+350', country: 'Gibraltar', digits: 8 },
    { code: '+351', country: 'Portugal', digits: 9 },
    { code: '+352', country: 'Luxemburgo', digits: 9 },
    { code: '+353', country: 'Irlanda', digits: 9 },
    { code: '+354', country: 'Islândia', digits: 7 },
    { code: '+355', country: 'Albânia', digits: 9 },
    { code: '+356', country: 'Malta', digits: 8 },
    { code: '+357', country: 'Chipre', digits: 8 },
    { code: '+358', country: 'Finlândia', digits: 9 },
    { code: '+359', country: 'Bulgária', digits: 9 },
    { code: '+370', country: 'Lituânia', digits: 8 },
    { code: '+371', country: 'Letónia', digits: 8 },
    { code: '+372', country: 'Estónia', digits: 8 },
    { code: '+373', country: 'Moldávia', digits: 8 },
    { code: '+374', country: 'Arménia', digits: 8 },
    { code: '+375', country: 'Bielorrússia', digits: 9 },
    { code: '+376', country: 'Andorra', digits: 6 },
    { code: '+377', country: 'Mónaco', digits: 8 },
    { code: '+378', country: 'San Marino', digits: 10 },
    { code: '+380', country: 'Ucrânia', digits: 9 },
    { code: '+381', country: 'Sérvia', digits: 9 },
    { code: '+382', country: 'Montenegro', digits: 8 },
    { code: '+383', country: 'Kosovo', digits: 8 },
    { code: '+385', country: 'Croácia', digits: 9 },
    { code: '+386', country: 'Eslovénia', digits: 8 },
    { code: '+387', country: 'Bósnia e Herzegovina', digits: 8 },
    { code: '+389', country: 'Macedónia do Norte', digits: 8 },
    { code: '+420', country: 'República Checa', digits: 9 },
    { code: '+421', country: 'Eslováquia', digits: 9 },
    { code: '+423', country: 'Liechtenstein', digits: 7 },
    { code: '+500', country: 'Ilhas Malvinas', digits: 5 },
    { code: '+501', country: 'Belize', digits: 7 },
    { code: '+502', country: 'Guatemala', digits: 8 },
    { code: '+503', country: 'El Salvador', digits: 8 },
    { code: '+504', country: 'Honduras', digits: 8 },
    { code: '+505', country: 'Nicarágua', digits: 8 },
    { code: '+506', country: 'Costa Rica', digits: 8 },
    { code: '+507', country: 'Panamá', digits: 8 },
    { code: '+508', country: 'São Pedro e Miquelão', digits: 6 },
    { code: '+509', country: 'Haiti', digits: 8 },
    { code: '+590', country: 'Guadalupe', digits: 9 },
    { code: '+591', country: 'Bolívia', digits: 8 },
    { code: '+592', country: 'Guiana', digits: 7 },
    { code: '+593', country: 'Equador', digits: 9 },
    { code: '+594', country: 'Guiana Francesa', digits: 9 },
    { code: '+595', country: 'Paraguai', digits: 9 },
    { code: '+596', country: 'Martinica', digits: 9 },
    { code: '+597', country: 'Suriname', digits: 7 },
    { code: '+598', country: 'Uruguai', digits: 8 },
    { code: '+599', country: 'Antilhas Holandesas', digits: 7 },
    { code: '+670', country: 'Timor-Leste', digits: 8 },
    { code: '+672', country: 'Antártida', digits: 6 },
    { code: '+673', country: 'Brunei', digits: 7 },
    { code: '+674', country: 'Nauru', digits: 7 },
    { code: '+675', country: 'Papua-Nova Guiné', digits: 8 },
    { code: '+676', country: 'Tonga', digits: 5 },
    { code: '+677', country: 'Ilhas Salomão', digits: 7 },
    { code: '+678', country: 'Vanuatu', digits: 7 },
    { code: '+679', country: 'Fiji', digits: 7 },
    { code: '+680', country: 'Palau', digits: 7 },
    { code: '+681', country: 'Wallis e Futuna', digits: 6 },
    { code: '+682', country: 'Ilhas Cook', digits: 5 },
    { code: '+683', country: 'Niue', digits: 4 },
    { code: '+684', country: 'Samoa Americana', digits: 7 },
    { code: '+685', country: 'Samoa', digits: 7 },
    { code: '+686', country: 'Kiribati', digits: 5 },
    { code: '+687', country: 'Nova Caledónia', digits: 6 },
    { code: '+688', country: 'Tuvalu', digits: 5 },
    { code: '+689', country: 'Polinésia Francesa', digits: 8 },
    { code: '+690', country: 'Tokelau', digits: 4 },
    { code: '+691', country: 'Micronésia', digits: 7 },
    { code: '+692', country: 'Ilhas Marshall', digits: 7 },
    { code: '+850', country: 'Coreia do Norte', digits: 10 },
    { code: '+852', country: 'Hong Kong', digits: 8 },
    { code: '+853', country: 'Macau', digits: 8 },
    { code: '+855', country: 'Camboja', digits: 9 },
    { code: '+856', country: 'Laos', digits: 10 },
    { code: '+880', country: 'Bangladesh', digits: 10 },
    { code: '+886', country: 'Taiwan', digits: 9 },
    { code: '+960', country: 'Maldivas', digits: 7 },
    { code: '+961', country: 'Líbano', digits: 8 },
    { code: '+962', country: 'Jordânia', digits: 9 },
    { code: '+963', country: 'Síria', digits: 9 },
    { code: '+964', country: 'Iraque', digits: 10 },
    { code: '+965', country: 'Kuwait', digits: 8 },
    { code: '+966', country: 'Arábia Saudita', digits: 9 },
    { code: '+967', country: 'Iémen', digits: 9 },
    { code: '+968', country: 'Omã', digits: 8 },
    { code: '+970', country: 'Palestina', digits: 9 },
    { code: '+971', country: 'Emirados Árabes Unidos', digits: 9 },
    { code: '+972', country: 'Israel', digits: 9 },
    { code: '+973', country: 'Bahrein', digits: 8 },
    { code: '+974', country: 'Catar', digits: 8 },
    { code: '+975', country: 'Butão', digits: 8 },
    { code: '+976', country: 'Mongólia', digits: 8 },
    { code: '+977', country: 'Nepal', digits: 10 },
    { code: '+992', country: 'Tajiquistão', digits: 9 },
    { code: '+993', country: 'Turquemenistão', digits: 8 },
    { code: '+994', country: 'Azerbaijão', digits: 9 },
    { code: '+995', country: 'Geórgia', digits: 9 },
    { code: '+996', country: 'Quirguistão', digits: 9 },
    { code: '+998', country: 'Uzbequistão', digits: 9 }
  ];

  const getSelectedCountryData = () => {
    return countryCodes.find(country => country.code === selectedPrefix) || countryCodes[0];
  };

  const handlePhoneNumberChange = (value: string) => {
    const countryData = getSelectedCountryData();
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue.length <= countryData.digits) {
      setPhoneNumber(numericValue);
    }
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
              <Select value={selectedPrefix} onValueChange={setSelectedPrefix}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.code} {country.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input 
                placeholder={`${getSelectedCountryData().digits} dígitos`}
                value={phoneNumber}
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
                className="flex-1"
                maxLength={getSelectedCountryData().digits}
              />
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