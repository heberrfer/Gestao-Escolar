/**
 * Types and interfaces for Scolarise - Rigorous School Management System
 */

export type UserRole = "diretor" | "coordenador" | "instrutor" | "aluno";

export interface UserProfile {
  id: string;
  nome: string;
  role: UserRole;
  email: string;
  avatarUrl?: string;
  detalheAdicional?: string; // e.g. "Matrícula #12389" ou "Contrato Docente #989"
}

export interface Sala {
  id: string;
  nome: string;
  tipo: "Laboratório" | "Sala de Aula Comum" | "Auditório" | "Oficina Prática";
  capacidade: number;
  statusOcupacao: "Livre" | "Ocupada" | "Manutenção";
  equipamentos: string[];
}

export interface Turma {
  id: string;
  nome: string;
  curso: string;
  instrutorId: string; // Referência ao ID do Instrutor (Perfil)
  instrutorNome: string;
  salaId: string; // Referência à Sala
  horario: string; // e.g., "08:00 - 12:00"
  diasSemana: string[]; // e.g., ["Segunda", "Quarta", "Sexta"]
  alunosInscritos: string[]; // Lista de IDs de alunos
}

export interface RegistroPresenca {
  id: string;
  alunoId: string;
  alunoNome: string;
  turmaId: string;
  turmaNome: string;
  data: string; // YYYY-MM-DD
  status: "presente" | "ausente" | "justificado";
  justificativa?: string;
  registradoPor: string; // Nome do usuário
  dataLançamento: string; // ISO DateTime
  auditorioAlteração?: {
    anteriorStatus: "presente" | "ausente" | "justificado";
    motivo: string;
    autorizadoPor: string;
    dataModificacao: string;
  };
  bloqueadoRetroativo: boolean; // Se for de data antiga e não puder mais ser alterado sem supervisão
}

export interface AlunoData {
  id: string;
  nome: string;
  email: string;
  matricula: string;
  turmas: string[]; // IDs de turmas
  frequênciaGeral: number; // Porcentagem (e.g. 78.5)
  notaMedia: number; // 0.0 - 10.0
  financeiroPendência: boolean; // se tem mensalidade atrasada
  contatoResponsavel: string;
  nomeResponsavel: string;
  statusEvasao: "Preocupante" | "Alerta" | "Estável";
  justificativaEvasao?: string;
  presencasDetalhadas: {
    [turmaId: string]: {
      aulasTotais: number;
      presencas: number;
      ausencias: number;
      justificadas: number;
    }
  };
}

export interface AtivoManutencao {
  id: string;
  item: string;
  localId: string; // Referência à Sala ID
  localNome: string;
  descricaoProblema: string;
  solicitadoPor: string;
  funcaoSolicitante: UserRole;
  dataSolicitacao: string;
  dataResolucao?: string;
  custo: number;
  tipo: "preventiva" | "corretiva";
  status: "pendente" | "concluido";
  prioridade: "Baixa" | "Média" | "Alta";
}

export interface Investimento {
  id: string;
  item: string;
  descricao: string;
  valor: number;
  data: string;
  categoria: "TI & Equipamentos" | "Reforma de Ambientes" | "Ferramental e Oficinas" | "Biblioteca & Conteúdo";
  tipoGasto: "CAPEX" | "OPEX"; // CAPEX = Investimento de Capital, OPEX = Despesa Operacional
  autorizadoPor: string;
}

export interface RegistroAuditoria {
  id: string;
  usuarioNome: string;
  usuarioRole: UserRole;
  acaoDescricao: string;
  timestamp: string;
  moduloReferencia: "Frequência" | "Financeiro" | "Manutenção" | "Grade Horária" | "Acesso";
}
