import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, User, Clock, Phone, MapPin, Shield, CreditCard, HelpCircle, Camera, X } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

interface Formacao {
  id: string;
  instituicao: string;
  curso: string;
  ano: string;
}

interface Experiencia {
  id: string;
  empresa: string;
  cargo: string;
  periodo: string;
}

interface HorarioTrabalho {
  id: string;
  dia: string;
  tipoTrabalho: 'dia-completo' | 'apenas-manha' | 'apenas-tarde';
  manhaPrimeira: string;
  manhaUltima: string;
  tardePrimeira: string;
  tardeUltima: string;
  duracao: number;
  ativo: boolean;
}

interface Consultorio {
  id: string;
  nome: string;
  endereco: string;
  direcoes: string;
}

interface TipoConsulta {
  id: string;
  tipo: string;
  preco: string;
}

interface FAQ {
  id: string;
  pergunta: string;
  resposta: string;
}

const GestaoPerfilPublico = () => {
  const { toast } = useToast();
  
  // Estados para os diferentes campos
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [biografia, setBiografia] = useState('');
  const [idiomas, setIdiomas] = useState<string[]>(['Português']);
  const [formacoes, setFormacoes] = useState<Formacao[]>([]);
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [telefones, setTelefones] = useState<string[]>(['']);
  const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
  const [seguros, setSeguros] = useState<string[]>([]);
  const [tiposConsulta, setTiposConsulta] = useState<TipoConsulta[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  
  const [horarioTrabalho, setHorarioTrabalho] = useState<HorarioTrabalho[]>([]);

  const [horarioPublico, setHorarioPublico] = useState(true);

  const idiomasDisponiveis = ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Italiano'];
  const duracaoSlots = [15, 20, 30, 45, 60];
  const segurosDisponiveis = ['Unimed', 'Bradesco Saúde', 'SulAmérica', 'Amil', 'Golden Cross', 'NotreDame'];
  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const adicionarFormacao = () => {
    const novaFormacao: Formacao = {
      id: Date.now().toString(),
      instituicao: '',
      curso: '',
      ano: '',
    };
    setFormacoes([...formacoes, novaFormacao]);
  };

  const removerFormacao = (id: string) => {
    setFormacoes(formacoes.filter(f => f.id !== id));
  };

  const adicionarExperiencia = () => {
    const novaExperiencia: Experiencia = {
      id: Date.now().toString(),
      empresa: '',
      cargo: '',
      periodo: '',
    };
    setExperiencias([...experiencias, novaExperiencia]);
  };

  const removerExperiencia = (id: string) => {
    setExperiencias(experiencias.filter(e => e.id !== id));
  };

  const adicionarTelefone = () => {
    setTelefones([...telefones, '']);
  };

  const removerTelefone = (index: number) => {
    const novosTelefones = telefones.filter((_, i) => i !== index);
    setTelefones(novosTelefones);
  };

  const adicionarConsultorio = () => {
    const novoConsultorio: Consultorio = {
      id: Date.now().toString(),
      nome: '',
      endereco: '',
      direcoes: '',
    };
    setConsultorios([...consultorios, novoConsultorio]);
  };

  const removerConsultorio = (id: string) => {
    setConsultorios(consultorios.filter(c => c.id !== id));
  };

  const adicionarTipoConsulta = () => {
    const novoTipo: TipoConsulta = {
      id: Date.now().toString(),
      tipo: '',
      preco: '',
    };
    setTiposConsulta([...tiposConsulta, novoTipo]);
  };

  const removerTipoConsulta = (id: string) => {
    setTiposConsulta(tiposConsulta.filter(t => t.id !== id));
  };

  const adicionarFAQ = () => {
    const novaFAQ: FAQ = {
      id: Date.now().toString(),
      pergunta: '',
      resposta: '',
    };
    setFaqs([...faqs, novaFAQ]);
  };

  const removerFAQ = (id: string) => {
    setFaqs(faqs.filter(f => f.id !== id));
  };

  const handleFotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFotoPerfil(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removerFoto = () => {
    setFotoPerfil(null);
  };

  const adicionarDiaSemana = (dia: string) => {
    const novoDiaSemana: HorarioTrabalho = {
      id: Date.now().toString(),
      dia,
      tipoTrabalho: 'dia-completo',
      manhaPrimeira: '09:00',
      manhaUltima: '12:00',
      tardePrimeira: '13:00',
      tardeUltima: '18:00',
      duracao: 30,
      ativo: true,
    };
    setHorarioTrabalho([...horarioTrabalho, novoDiaSemana]);
  };

  const removerDiaSemana = (id: string) => {
    setHorarioTrabalho(horarioTrabalho.filter(h => h.id !== id));
  };

  const updateHorarioTrabalho = (id: string, field: keyof HorarioTrabalho, value: any) => {
    setHorarioTrabalho(horarioTrabalho.map(h => 
      h.id === id ? { ...h, [field]: value } : h
    ));
  };

  const salvarPerfil = () => {
    toast({
      title: "Perfil salvo",
      description: "Suas informações de perfil público foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meu Perfil Público</h1>
        <p className="text-muted-foreground">
          Configure as informações que aparecerão no seu perfil público para os pacientes
        </p>
      </div>

      {/* Sobre Mim */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Sobre Mim
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Foto de Perfil</Label>
            <div className="flex items-center gap-4 mt-2">
              {fotoPerfil ? (
                <div className="relative">
                  <img
                    src={fotoPerfil}
                    alt="Foto de perfil"
                    className="w-24 h-24 rounded-full object-cover border"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removerFoto}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoUpload}
                  className="hidden"
                  id="foto-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('foto-upload')?.click()}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {fotoPerfil ? 'Alterar Foto' : 'Adicionar Foto'}
                </Button>
                <p className="text-sm text-muted-foreground mt-1">
                  Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <Label htmlFor="biografia">Biografia/Apresentação</Label>
            <Textarea
              id="biografia"
              placeholder="Descreva sua experiência e especialização..."
              value={biografia}
              onChange={(e) => setBiografia(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label>Idiomas Falados</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {idiomas.map((idioma, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {idioma}
                  <button onClick={() => setIdiomas(idiomas.filter((_, i) => i !== index))}>
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Select onValueChange={(value) => !idiomas.includes(value) && setIdiomas([...idiomas, value])}>
              <SelectTrigger className="w-48 mt-2">
                <SelectValue placeholder="Adicionar idioma" />
              </SelectTrigger>
              <SelectContent>
                {idiomasDisponiveis.map((idioma) => (
                  <SelectItem key={idioma} value={idioma}>{idioma}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Formações</Label>
              <Button variant="outline" size="sm" onClick={adicionarFormacao}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
            {formacoes.map((formacao) => (
              <div key={formacao.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 p-3 border rounded">
                <Input
                  placeholder="Instituição"
                  value={formacao.instituicao}
                  onChange={(e) => setFormacoes(formacoes.map(f => 
                    f.id === formacao.id ? { ...f, instituicao: e.target.value } : f
                  ))}
                />
                <Input
                  placeholder="Curso"
                  value={formacao.curso}
                  onChange={(e) => setFormacoes(formacoes.map(f => 
                    f.id === formacao.id ? { ...f, curso: e.target.value } : f
                  ))}
                />
                <Input
                  placeholder="Ano"
                  value={formacao.ano}
                  onChange={(e) => setFormacoes(formacoes.map(f => 
                    f.id === formacao.id ? { ...f, ano: e.target.value } : f
                  ))}
                />
                <Button variant="outline" size="sm" onClick={() => removerFormacao(formacao.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Experiências Profissionais</Label>
              <Button variant="outline" size="sm" onClick={adicionarExperiencia}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
            {experiencias.map((experiencia) => (
              <div key={experiencia.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 p-3 border rounded">
                <Input
                  placeholder="Empresa/Clínica"
                  value={experiencia.empresa}
                  onChange={(e) => setExperiencias(experiencias.map(exp => 
                    exp.id === experiencia.id ? { ...exp, empresa: e.target.value } : exp
                  ))}
                />
                <Input
                  placeholder="Cargo"
                  value={experiencia.cargo}
                  onChange={(e) => setExperiencias(experiencias.map(exp => 
                    exp.id === experiencia.id ? { ...exp, cargo: e.target.value } : exp
                  ))}
                />
                <Input
                  placeholder="Período (ex: 2020-2023)"
                  value={experiencia.periodo}
                  onChange={(e) => setExperiencias(experiencias.map(exp => 
                    exp.id === experiencia.id ? { ...exp, periodo: e.target.value } : exp
                  ))}
                />
                <Button variant="outline" size="sm" onClick={() => removerExperiencia(experiencia.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Horário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horário de Consultas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Partilhar horário publicamente</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Escolha se deseja que os pacientes vejam seus horários de consulta
              </p>
              <RadioGroup value={horarioPublico.toString()} onValueChange={(value) => setHorarioPublico(value === 'true')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="publico-sim" />
                  <Label htmlFor="publico-sim">Sim, partilhar horário publicamente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="publico-nao" />
                  <Label htmlFor="publico-nao">Não, manter horário privado</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-medium">Dias da Semana</Label>
                <Select onValueChange={(value) => {
                  const diasJaAdicionados = horarioTrabalho.map(h => h.dia);
                  if (!diasJaAdicionados.includes(value)) {
                    adicionarDiaSemana(value);
                  }
                }}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Adicionar dia da semana" />
                  </SelectTrigger>
                  <SelectContent>
                    {diasSemana.map((dia) => (
                      <SelectItem key={dia} value={dia}>{dia}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {horarioTrabalho.map((horario) => (
                  <div key={horario.id} className="p-4 border rounded space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-base font-medium">{horario.dia}</Label>
                      <Button variant="outline" size="sm" onClick={() => removerDiaSemana(horario.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Tipo de Trabalho</Label>
                        <Select value={horario.tipoTrabalho} onValueChange={(value) => 
                          updateHorarioTrabalho(horario.id, 'tipoTrabalho', value)
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dia-completo">Dia Completo</SelectItem>
                            <SelectItem value="apenas-manha">Apenas Manhã</SelectItem>
                            <SelectItem value="apenas-tarde">Apenas Tarde</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Duração das Consultas</Label>
                        <Select value={horario.duracao.toString()} onValueChange={(value) => 
                          updateHorarioTrabalho(horario.id, 'duracao', parseInt(value))
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {duracaoSlots.map((duracao) => (
                              <SelectItem key={duracao} value={duracao.toString()}>
                                {duracao} min
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={horario.ativo}
                          onChange={(e) => updateHorarioTrabalho(horario.id, 'ativo', e.target.checked)}
                          className="mr-2"
                        />
                        <Label className="text-sm">Ativo</Label>
                      </div>
                    </div>

                    {(horario.tipoTrabalho === 'dia-completo' || horario.tipoTrabalho === 'apenas-manha') && (
                      <div>
                        <Label className="text-sm font-medium">Horário da Manhã</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label className="text-xs text-muted-foreground">Início</Label>
                            <Input
                              type="time"
                              value={horario.manhaPrimeira}
                              onChange={(e) => updateHorarioTrabalho(horario.id, 'manhaPrimeira', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Fim</Label>
                            <Input
                              type="time"
                              value={horario.manhaUltima}
                              onChange={(e) => updateHorarioTrabalho(horario.id, 'manhaUltima', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {(horario.tipoTrabalho === 'dia-completo' || horario.tipoTrabalho === 'apenas-tarde') && (
                      <div>
                        <Label className="text-sm font-medium">Horário da Tarde</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label className="text-xs text-muted-foreground">Início</Label>
                            <Input
                              type="time"
                              value={horario.tardePrimeira}
                              onChange={(e) => updateHorarioTrabalho(horario.id, 'tardePrimeira', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Fim</Label>
                            <Input
                              type="time"
                              value={horario.tardeUltima}
                              onChange={(e) => updateHorarioTrabalho(horario.id, 'tardeUltima', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {horario.tipoTrabalho === 'dia-completo' && horario.ativo && horario.manhaPrimeira && horario.manhaUltima && horario.tardePrimeira && horario.tardeUltima && (
                      <div className="text-xs text-muted-foreground">
                        Pausa para almoço: {horario.manhaUltima} - {horario.tardePrimeira}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contactos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contactos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label>Números de Telefone</Label>
            {telefones.map((telefone, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Número de telefone"
                  value={telefone}
                  onChange={(e) => setTelefones(telefones.map((t, i) => 
                    i === index ? e.target.value : t
                  ))}
                />
                {telefones.length > 1 && (
                  <Button variant="outline" size="sm" onClick={() => removerTelefone(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={adicionarTelefone}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Telefone
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Consultórios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Consultórios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {consultorios.map((consultorio) => (
              <div key={consultorio.id} className="p-4 border rounded space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="font-medium">Consultório</Label>
                  <Button variant="outline" size="sm" onClick={() => removerConsultorio(consultorio.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Nome do consultório"
                  value={consultorio.nome}
                  onChange={(e) => setConsultorios(consultorios.map(c => 
                    c.id === consultorio.id ? { ...c, nome: e.target.value } : c
                  ))}
                />
                <Input
                  placeholder="Endereço completo"
                  value={consultorio.endereco}
                  onChange={(e) => setConsultorios(consultorios.map(c => 
                    c.id === consultorio.id ? { ...c, endereco: e.target.value } : c
                  ))}
                />
                <Textarea
                  placeholder="Direções extras (informações adicionais para encontrar)"
                  value={consultorio.direcoes}
                  onChange={(e) => setConsultorios(consultorios.map(c => 
                    c.id === consultorio.id ? { ...c, direcoes: e.target.value } : c
                  ))}
                />
              </div>
            ))}
            <Button variant="outline" onClick={adicionarConsultorio}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Consultório
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seguros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Seguros Aceitos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {seguros.map((seguro, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {seguro}
                  <button onClick={() => setSeguros(seguros.filter((_, i) => i !== index))}>
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Select onValueChange={(value) => !seguros.includes(value) && setSeguros([...seguros, value])}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Selecionar seguro" />
              </SelectTrigger>
              <SelectContent>
                {segurosDisponiveis.map((seguro) => (
                  <SelectItem key={seguro} value={seguro}>{seguro}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tipos de Consulta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Tipos de Consulta e Preços
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tiposConsulta.map((tipo) => (
              <div key={tipo.id} className="flex gap-3 items-center">
                <Input
                  placeholder="Tipo de consulta"
                  value={tipo.tipo}
                  onChange={(e) => setTiposConsulta(tiposConsulta.map(t => 
                    t.id === tipo.id ? { ...t, tipo: e.target.value } : t
                  ))}
                />
                <Input
                  placeholder="Preço (€)"
                  value={tipo.preco}
                  onChange={(e) => setTiposConsulta(tiposConsulta.map(t => 
                    t.id === tipo.id ? { ...t, preco: e.target.value } : t
                  ))}
                />
                <Button variant="outline" size="sm" onClick={() => removerTipoConsulta(tipo.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={adicionarTipoConsulta}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Tipo de Consulta
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Perguntas Frequentes (FAQs)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-4 border rounded space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="font-medium">FAQ</Label>
                  <Button variant="outline" size="sm" onClick={() => removerFAQ(faq.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Pergunta"
                  value={faq.pergunta}
                  onChange={(e) => setFaqs(faqs.map(f => 
                    f.id === faq.id ? { ...f, pergunta: e.target.value } : f
                  ))}
                />
                <Textarea
                  placeholder="Resposta"
                  value={faq.resposta}
                  onChange={(e) => setFaqs(faqs.map(f => 
                    f.id === faq.id ? { ...f, resposta: e.target.value } : f
                  ))}
                />
              </div>
            ))}
            <Button variant="outline" onClick={adicionarFAQ}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar FAQ
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button onClick={salvarPerfil} size="lg">
          Salvar Perfil Público
        </Button>
      </div>
    </div>
  );
};

export default GestaoPerfilPublico;