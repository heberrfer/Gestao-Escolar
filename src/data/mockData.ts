import { Sala, Turma, AlunoData, AtivoManutencao, Investimento, RegistroAuditoria, RegistroPresenca } from "../types";

// Estatísticas globais ponderadas de uma escola de 600 alunos
export const estatisticasGlobais = {
  totalAlunos: 600,
  frequenciaMediaEscola: 81.2, // Baixa (alerta escolar!)
  frequenciaMeta: 90.0,
  alunosRiscoEvasaoAlto: 48, // 8% dos alunos
  alunosRiscoEvasaoMedio: 96, // 16% dos alunos
  taxaEvasaoGlobalTrimestre: 5.4, // Alta! Meta é < 2.5%
  custoPorAlunoMensal: 384.50, // Em R$
  investimentoAcumuladoCAPEX: 124500.00,
  gastoAcumuladoOPEX: 48600.00,
  eficienciaOcupacaoClassrooms: 78.5 // % média de salas ocupadas ao longo da grade de 8h às 22h
};

export const LISTA_SALAS: Sala[] = [
  { id: "S101", nome: "Sala de Teoria 101", tipo: "Sala de Aula Comum", capacidade: 40, statusOcupacao: "Ocupada", equipamentos: ["Ar Condicionado", "Lousa Digital", "Projetor HDMI"] },
  { id: "S102", nome: "Sala de Teoria 102", tipo: "Sala de Aula Comum", capacidade: 40, statusOcupacao: "Livre", equipamentos: ["Ar Condicionado", "Projetor HDMI"] },
  { id: "L201", nome: "Laboratório de Software A", tipo: "Laboratório", capacidade: 32, statusOcupacao: "Ocupada", equipamentos: ["32 Computadores Ryzen 5", "Ar Condicionado", "Projetor", "Git Server"] },
  { id: "L202", nome: "Laboratório de Redes e Hardware", tipo: "Laboratório", capacidade: 24, statusOcupacao: "Manutenção", equipamentos: ["Bancadas Elétricas", "Switches Cisco", "Osciloscópios"] },
  { id: "AUD", nome: "Auditório Principal", tipo: "Auditório", capacidade: 120, statusOcupacao: "Livre", equipamentos: ["Sonorização Integrada", "Palco", "Projetor Laser 4K", "Cabine Técnica"] },
  { id: "OF301", nome: "Oficina de Automação Industrial", tipo: "Oficina Prática", capacidade: 20, statusOcupacao: "Ocupada", equipamentos: ["CLPs Siemens", "Braço Robótico", "Inversores de Frequência"] }
];

export const LISTA_TURMAS: Turma[] = [
  {
    id: "T_DEV_A",
    nome: "Desenvolvimento de Sistemas - Turma A",
    curso: "Técnico em Desenvolvimento de Sistemas",
    instrutorId: "prof_marcos",
    instrutorNome: "Marcos Vinícius Santos",
    salaId: "L201",
    horario: "13:30 - 17:30",
    diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
    alunosInscritos: ["AL_01", "AL_02", "AL_03", "AL_04", "AL_05", "AL_06"]
  },
  {
    id: "T_REDES",
    nome: "Infraestrutura de Redes de Computadores",
    curso: "Técnico em Redes",
    instrutorId: "prof_ana",
    instrutorNome: "Ana Júlia Pinheiro",
    salaId: "L202",
    horario: "19:00 - 22:30",
    diasSemana: ["Segunda", "Quarta", "Sexta"],
    alunosInscritos: ["AL_07", "AL_08", "AL_02", "AL_03"]
  },
  {
    id: "T_IND",
    nome: "Automação e Robótica Avançada",
    curso: "Especialização Técnica em Automação",
    instrutorId: "prof_ricardo",
    instrutorNome: "Ricardo Albuquerque",
    salaId: "OF301",
    horario: "08:00 - 12:00",
    diasSemana: ["Terça", "Quinta"],
    alunosInscritos: ["AL_09", "AL_10", "AL_04", "AL_05"]
  },
  {
    id: "T_WEB_B",
    nome: "Desenvolvimento Front-end Especializado",
    curso: "Técnico em Desenvolvimento de Sistemas",
    instrutorId: "prof_marcos",
    instrutorNome: "Marcos Vinícius Santos",
    salaId: "S101",
    horario: "19:00 - 22:30",
    diasSemana: ["Terça", "Quinta"],
    alunosInscritos: ["AL_01", "AL_06", "AL_07", "AL_08"]
  }
];

export const MOCK_ALUNOS: AlunoData[] = [
  {
    id: "AL_01",
    nome: "Lucas Souza Camargo",
    email: "lucas.camargo@aluno.senai.br",
    matricula: "ALU2026-0032",
    turmas: ["T_DEV_A", "T_WEB_B"],
    frequênciaGeral: 68.2, // CRÍTICO: Risco alto de evasão (< 75%)
    notaMedia: 5.4,
    financeiroPendência: true, // Mensalidade atrasada
    contatoResponsavel: "(11) 98112-4099",
    nomeResponsavel: "Marilena Souza Camargo",
    statusEvasao: "Preocupante",
    justificativaEvasao: "Faltas consecutivas nas últimas duas semanas e pendência de mensalidade. Responsável informou que o aluno está trabalhando em horário que coincide com as aulas da tarde.",
    presencasDetalhadas: {
      T_DEV_A: { aulasTotais: 40, presencas: 24, ausencias: 14, justificadas: 2 },
      T_WEB_B: { aulasTotais: 16, presencas: 13, ausencias: 3, justificadas: 0 }
    }
  },
  {
    id: "AL_02",
    nome: "Beatriz Helena Dias",
    email: "beatriz.dias@aluno.senai.br",
    matricula: "ALU2026-0412",
    turmas: ["T_DEV_A", "T_REDES"],
    frequênciaGeral: 89.5,
    notaMedia: 8.8,
    financeiroPendência: false,
    contatoResponsavel: "(11) 94771-3310",
    nomeResponsavel: "Roberto Carlos Dias",
    statusEvasao: "Estável",
    presencasDetalhadas: {
      T_DEV_A: { aulasTotais: 40, presencas: 36, ausencias: 4, justificadas: 0 },
      T_REDES: { aulasTotais: 20, presencas: 17, ausencias: 3, justificadas: 0 }
    }
  },
  {
    id: "AL_03",
    nome: "Matheus Vinícius Oliveira",
    email: "matheus.oliveira@aluno.senai.br",
    matricula: "ALU2026-0155",
    turmas: ["T_DEV_A", "T_REDES"],
    frequênciaGeral: 74.0, // Alerta! frequencia abaixo de 75%
    notaMedia: 6.1,
    financeiroPendência: false,
    contatoResponsavel: "(11) 99120-1122",
    nomeResponsavel: "Sandro Oliveira",
    statusEvasao: "Alerta",
    justificativaEvasao: "Ausências frequentes às sextas-feiras no período noturno devido a transporte público precário na região do aluno.",
    presencasDetalhadas: {
      T_DEV_A: { aulasTotais: 40, presencas: 30, ausencias: 10, justificadas: 0 },
      T_REDES: { aulasTotais: 20, presencas: 14, ausencias: 6, justificadas: 0 }
    }
  },
  {
    id: "AL_04",
    nome: "Juliana Mendes Garcia",
    email: "juliana.garcia@aluno.senai.br",
    matricula: "ALU2026-0309",
    turmas: ["T_DEV_A", "T_IND"],
    frequênciaGeral: 95.0,
    notaMedia: 9.2,
    financeiroPendência: false,
    contatoResponsavel: "(11) 97722-1988",
    nomeResponsavel: "Cláudia Mendes Garcia",
    statusEvasao: "Estável",
    presencasDetalhadas: {
      T_DEV_A: { aulasTotais: 40, presencas: 38, ausencias: 2, justificadas: 0 },
      T_IND: { aulasTotais: 12, presencas: 11, ausencias: 1, justificadas: 0 }
    }
  },
  {
    id: "AL_05",
    nome: "Vitor Hugo Fontes",
    email: "vitor.fontes@aluno.senai.br",
    matricula: "ALU2026-0227",
    turmas: ["T_DEV_A", "T_IND"],
    frequênciaGeral: 62.5, // CRÍTICO! Risco altíssimo
    notaMedia: 4.8,
    financeiroPendência: true,
    contatoResponsavel: "(11) 98111-5544",
    nomeResponsavel: "Tereza Cristina Fontes",
    statusEvasao: "Preocupante",
    justificativaEvasao: "Extrema desmotivação e dificuldades de aprendizagem na disciplina de programação. Faltou sem justificativa nos últimos 5 dias letivos de Automação.",
    presencasDetalhadas: {
      T_DEV_A: { aulasTotais: 40, presencas: 25, ausencias: 15, justificadas: 0 },
      T_IND: { aulasTotais: 12, presencas: 7, ausencias: 5, justificadas: 0 }
    }
  },
  {
    id: "AL_06",
    nome: "Mariana Alencar Castro",
    email: "mariana.castro@aluno.senai.br",
    matricula: "ALU2026-0560",
    turmas: ["T_DEV_A", "T_WEB_B"],
    frequênciaGeral: 98.2,
    notaMedia: 9.7,
    financeiroPendência: false,
    contatoResponsavel: "(11) 92211-8899",
    nomeResponsavel: "Julio Alencar Castro",
    statusEvasao: "Estável",
    presencasDetalhadas: {
      T_DEV_A: { aulasTotais: 40, presencas: 39, ausencias: 1, justificadas: 0 },
      T_WEB_B: { aulasTotais: 16, presencas: 16, ausencias: 0, justificadas: 0 }
    }
  },
  {
    id: "AL_07",
    nome: "Felipe Gabriel Nobre",
    email: "felipe.nobre@aluno.senai.br",
    matricula: "ALU2026-0288",
    turmas: ["T_REDES", "T_WEB_B"],
    frequênciaGeral: 81.0,
    notaMedia: 6.8,
    financeiroPendência: false,
    contatoResponsavel: "(11) 99881-2233",
    nomeResponsavel: "Patricia Nobre",
    statusEvasao: "Estável",
    presencasDetalhadas: {
      T_REDES: { aulasTotais: 20, presencas: 16, ausencias: 4, justificadas: 0 },
      T_WEB_B: { aulasTotais: 16, presencas: 13, ausencias: 3, justificadas: 0 }
    }
  },
  {
    id: "AL_08",
    nome: "Gustavo Nogueira Silva",
    email: "gustavo.silva@aluno.senai.br",
    matricula: "ALU2026-0112",
    turmas: ["T_REDES", "T_WEB_B"],
    frequênciaGeral: 71.4, // Alerta!
    notaMedia: 5.2,
    financeiroPendência: true,
    contatoResponsavel: "(11) 93311-7722",
    nomeResponsavel: "Aparecida Nogueira Silva",
    statusEvasao: "Alerta",
    justificativaEvasao: "Atrasos recorrentes devido ao horário de saída do trabalho estagiário do aluno. Entrou em acordo para repor atividades.",
    presencasDetalhadas: {
      T_REDES: { aulasTotais: 20, presencas: 14, ausencias: 5, justificadas: 1 },
      T_WEB_B: { aulasTotais: 16, presencas: 11, ausencias: 4, justificadas: 1 }
    }
  }
];

export const MOCK_MANUTENCOES: AtivoManutencao[] = [
  {
    id: "MAN_001",
    item: "Compressor de Ar e Switche Cisco Catalizador",
    localId: "L202",
    localNome: "Laboratório de Redes e Hardware",
    descricaoProblema: "Portas de link principal queimaram devido a surto elétrico e precisam de troca imediata para liberar as aulas.",
    solicitadoPor: "Ana Júlia Pinheiro",
    funcaoSolicitante: "instrutor",
    dataSolicitacao: "2026-06-08",
    custo: 5400.00,
    tipo: "corretiva",
    status: "pendente",
    prioridade: "Alta"
  },
  {
    id: "MAN_002",
    item: "Ar Condicionado Central 24000 BTU",
    localId: "L201",
    localNome: "Laboratório de Software A",
    descricaoProblema: "Limpeza de filtros periódica e recarga de gás refrigerante - agendada contratualmente.",
    solicitadoPor: "Sistema Administrativo",
    funcaoSolicitante: "coordenador",
    dataSolicitacao: "2026-06-10",
    dataResolucao: "2026-06-12",
    custo: 350.00,
    tipo: "preventiva",
    status: "concluido",
    prioridade: "Média"
  },
  {
    id: "MAN_003",
    item: "Lousa Digital Samsung Flip",
    localId: "S101",
    localNome: "Sala de Teoria 101",
    descricaoProblema: "Caneta touch original extraviada e receptor bluetooth com instabilidade no encaixe lateral.",
    solicitadoPor: "Marcos Vinícius Santos",
    funcaoSolicitante: "instrutor",
    dataSolicitacao: "2026-06-12",
    custo: 1200.00,
    tipo: "corretiva",
    status: "pendente",
    prioridade: "Baixa"
  },
  {
    id: "MAN_004",
    item: "Braço Robótico e Inversores de Frequência",
    localId: "OF301",
    localNome: "Oficina de Automação Industrial",
    descricaoProblema: "Manutenção sistemática preventiva anual da junta 3 do robô para evitar travamento em aula.",
    solicitadoPor: "Ricardo Albuquerque",
    funcaoSolicitante: "instrutor",
    dataSolicitacao: "2026-06-01",
    dataResolucao: "2026-06-03",
    custo: 4800.00,
    tipo: "preventiva",
    status: "concluido",
    prioridade: "Alta"
  },
  {
    id: "MAN_005",
    item: "Reparo de 5 Cadeiras Ergonômicas",
    localId: "L201",
    localNome: "Laboratório de Software A",
    descricaoProblema: "Engrenagens reguladoras de postura travadas e rodinhas quebradas devido a uso intenso.",
    solicitadoPor: "Lucas Souza Camargo",
    funcaoSolicitante: "aluno",
    dataSolicitacao: "2026-06-13",
    custo: 450.00,
    tipo: "corretiva",
    status: "pendente",
    prioridade: "Baixa"
  }
];

export const MOCK_INVESTIMENTOS: Investimento[] = [
  {
    id: "INV_001",
    item: "32 Computadores Lenovo Ryzen 5, 16GB, SSD 512GB",
    descricao: "Upgrade completo do parque computacional da Sala L201 de Software, visando rodar ferramentas de desenvolvimento modernas sem gargalos de CPU.",
    valor: 96000.00,
    data: "2026-04-10",
    categoria: "TI & Equipamentos",
    tipoGasto: "CAPEX",
    autorizadoPor: "Diretor Heber Ferreira"
  },
  {
    id: "INV_002",
    item: "Inversores de Frequência WEG CFW500",
    descricao: "Melhoria e expansão da bancada prática de Automação Industrial na oficina OF301.",
    valor: 18500.00,
    data: "2026-05-02",
    categoria: "Ferramental e Oficinas",
    tipoGasto: "CAPEX",
    autorizadoPor: "Diretor Heber Ferreira"
  },
  {
    id: "INV_003",
    item: "Conserto Avançado da Rede de Hidrantes Externa",
    descricao: "Contratação externa autorizada com urgência devido a vazamento apontado por auditoria dos bombeiros.",
    valor: 8200.00,
    data: "2026-05-20",
    categoria: "Reforma de Ambientes",
    tipoGasto: "OPEX",
    autorizadoPor: "Coordenador Geral"
  },
  {
    id: "INV_004",
    item: "Aquisição de Licenças JetBrains Academic Suite",
    descricao: "Renovação de assinaturas para alunos das turmas avançadas de desenvolvimento de software.",
    valor: 10000.00,
    data: "2026-06-01",
    categoria: "TI & Equipamentos",
    tipoGasto: "CAPEX",
    autorizadoPor: "Diretor Heber Ferreira"
  },
  {
    id: "INV_005",
    item: "Manutenções Diversas e Suprimentos de Infraestrutura",
    descricao: "Consumo mensal consolidado de lâmpadas, fiação, tomadas de reposição e tintas para retoques rápidos.",
    valor: 5400.00,
    data: "2026-06-05",
    categoria: "Reforma de Ambientes",
    tipoGasto: "OPEX",
    autorizadoPor: "Coordenador Geral"
  }
];

export const HISTORICO_AUDITORIA: RegistroAuditoria[] = [
  {
    id: "LOG_001",
    usuarioNome: "Ana Júlia Pinheiro",
    usuarioRole: "instrutor",
    acaoDescricao: "Tentou lançar presença retroativa para 24/05/2026 na turma T_REDES. Lançamento bloqueado automaticamente pelo sistema de segurança.",
    timestamp: "2026-06-13T08:15:30Z",
    moduloReferencia: "Frequência"
  },
  {
    id: "LOG_002",
    usuarioNome: "Coordenador Geral",
    usuarioRole: "coordenador",
    acaoDescricao: "Concedeu autorização de auditoria temporária para lançamento retroativo especial da data 24/05/2026.",
    timestamp: "2026-06-13T08:18:22Z",
    moduloReferencia: "Acesso"
  },
  {
    id: "LOG_003",
    usuarioNome: "Ana Júlia Pinheiro",
    usuarioRole: "instrutor",
    acaoDescricao: "Efetuou alteração justificada no lançamento do aluno Lucas Souza Camargo (AL_01) de 'ausente' para 'presente' no dia 24/05/2026 na turma T_REDES sob justificativa médica aprovada.",
    timestamp: "2026-06-13T08:20:00Z",
    moduloReferencia: "Frequência"
  },
  {
    id: "LOG_004",
    usuarioNome: "Diretor Heber Ferreira",
    usuarioRole: "diretor",
    acaoDescricao: "Aprovou novo aporte CAPEX de R$ 10.000,00 para aquisição urgente de licenças de software.",
    timestamp: "2026-06-12T14:30:15Z",
    moduloReferencia: "Financeiro"
  },
  {
    id: "LOG_005",
    usuarioNome: "Marcos Vinícius Santos",
    usuarioRole: "instrutor",
    acaoDescricao: "Solicitou manutenção corretiva urgente do ativo: Lousa Digital Samsung Flip na Sala S101.",
    timestamp: "2026-06-12T10:11:00Z",
    moduloReferencia: "Manutenção"
  },
  {
    id: "LOG_006",
    usuarioNome: "Lucas Souza Camargo",
    usuarioRole: "aluno",
    acaoDescricao: "Logou no sistema e visualizou relatório pessoal de frequência consolidada.",
    timestamp: "2026-06-13T09:41:10Z",
    moduloReferencia: "Acesso"
  },
  {
    id: "LOG_007",
    usuarioNome: "Juliana Mendes Garcia",
    usuarioRole: "aluno",
    acaoDescricao: "Registrou solicitação de conserto para cadeiras ergonômicas no Laboratório de Software A.",
    timestamp: "2026-06-13T10:05:44Z",
    moduloReferencia: "Manutenção"
  }
];

export const REGISTROS_PRESENCA_INICIAIS: RegistroPresenca[] = [
  {
    id: "PRES_001",
    alunoId: "AL_01",
    alunoNome: "Lucas Souza Camargo",
    turmaId: "T_DEV_A",
    turmaNome: "Desenvolvimento de Sistemas - Turma A",
    data: "2026-06-12",
    status: "ausente",
    registradoPor: "Marcos Vinícius Santos",
    dataLançamento: "2026-06-12T14:40:00Z",
    bloqueadoRetroativo: true
  },
  {
    id: "PRES_002",
    alunoId: "AL_01",
    alunoNome: "Lucas Souza Camargo",
    turmaId: "T_DEV_A",
    turmaNome: "Desenvolvimento de Sistemas - Turma A",
    data: "2026-06-11",
    status: "ausente",
    registradoPor: "Marcos Vinícius Santos",
    dataLançamento: "2026-06-11T14:45:00Z",
    bloqueadoRetroativo: true
  },
  {
    id: "PRES_003",
    alunoId: "AL_02",
    alunoNome: "Beatriz Helena Dias",
    turmaId: "T_DEV_A",
    turmaNome: "Desenvolvimento de Sistemas - Turma A",
    data: "2026-06-12",
    status: "presente",
    registradoPor: "Marcos Vinícius Santos",
    dataLançamento: "2026-06-12T14:40:00Z",
    bloqueadoRetroativo: true
  },
  {
    id: "PRES_004",
    alunoId: "AL_03",
    alunoNome: "Matheus Vinícius Oliveira",
    turmaId: "T_DEV_A",
    turmaNome: "Desenvolvimento de Sistemas - Turma A",
    data: "2026-06-12",
    status: "ausente",
    registradoPor: "Marcos Vinícius Santos",
    dataLançamento: "2026-06-12T14:40:00Z",
    bloqueadoRetroativo: true
  },
  {
    id: "PRES_005",
    alunoId: "AL_04",
    alunoNome: "Juliana Mendes Garcia",
    turmaId: "T_DEV_A",
    turmaNome: "Desenvolvimento de Sistemas - Turma A",
    data: "2026-06-12",
    status: "presente",
    registradoPor: "Marcos Vinícius Santos",
    dataLançamento: "2026-06-12T14:40:00Z",
    bloqueadoRetroativo: true
  },
  {
    id: "PRES_006",
    alunoId: "AL_05",
    alunoNome: "Vitor Hugo Fontes",
    turmaId: "T_DEV_A",
    turmaNome: "Desenvolvimento de Sistemas - Turma A",
    data: "2026-06-12",
    status: "ausente",
    registradoPor: "Marcos Vinícius Santos",
    dataLançamento: "2026-06-12T14:40:00Z",
    bloqueadoRetroativo: true
  },
  {
    id: "PRES_007",
    alunoId: "AL_06",
    alunoNome: "Mariana Alencar Castro",
    turmaId: "T_DEV_A",
    turmaNome: "Desenvolvimento de Sistemas - Turma A",
    data: "2026-06-12",
    status: "presente",
    registradoPor: "Marcos Vinícius Santos",
    dataLançamento: "2026-06-12T14:40:00Z",
    bloqueadoRetroativo: true
  }
];
