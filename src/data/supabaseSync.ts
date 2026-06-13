import { supabase } from "../supabaseClient";
import { Sala, Turma, AlunoData, AtivoManutencao, Investimento, RegistroAuditoria, RegistroPresenca } from "../types";

// ==========================================
// 1. SELECT FETCHERS (Fetch from Supabase)
// ==========================================

export async function fetchSalas(): Promise<Sala[]> {
  const { data, error } = await supabase.from("salas").select("*");
  if (error) throw error;
  if (!data) return [];
  
  return data.map((item: any) => ({
    id: item.id,
    nome: item.nome,
    tipo: item.tipo,
    capacidade: item.capacidade,
    statusOcupacao: item.status_ocupacao,
    equipamentos: item.equipamentos || [],
  }));
}

export async function fetchAlunos(): Promise<AlunoData[]> {
  const { data, error } = await supabase.from("alunos").select("*");
  if (error) throw error;
  if (!data) return [];

  return data.map((item: any) => ({
    id: item.id,
    nome: item.nome,
    email: item.email,
    matricula: item.matricula,
    turmas: item.turmas || [],
    frequênciaGeral: Number(item.frequencia_geral || 0),
    notaMedia: Number(item.nota_media || 0),
    financeiroPendência: !!item.financeiro_pendencia,
    contatoResponsavel: item.contato_responsavel || "",
    nomeResponsavel: item.nome_responsavel || "",
    statusEvasao: item.status_evasao,
    justificativaEvasao: item.justificativa_evasao || undefined,
    presencasDetalhadas: item.presencas_detalhadas || {},
  }));
}

export async function fetchTurmas(): Promise<Turma[]> {
  const { data, error } = await supabase.from("turmas").select("*");
  if (error) throw error;
  if (!data) return [];

  return data.map((item: any) => ({
    id: item.id,
    nome: item.nome,
    curso: item.curso,
    instrutorId: item.instrutor_id,
    instrutorNome: item.instrutor_nome,
    salaId: item.sala_id,
    horario: item.horario,
    diasSemana: item.dias_semana || [],
    alunosInscritos: item.alunos_inscritos || [],
  }));
}

export async function fetchManutencoes(): Promise<AtivoManutencao[]> {
  const { data, error } = await supabase.from("ativo_manutencao").select("*");
  if (error) throw error;
  if (!data) return [];

  return data.map((item: any) => ({
    id: item.id,
    item: item.item,
    localId: item.local_id,
    localNome: item.local_nome,
    descricaoProblema: item.descricao_problema,
    solicitadoPor: item.solicitado_por,
    funcaoSolicitante: item.funcao_solicitante,
    dataSolicitacao: item.data_solicitacao,
    dataResolucao: item.data_resolucao || undefined,
    custo: Number(item.custo || 0),
    tipo: item.tipo,
    status: item.status,
    prioridade: item.prioridade,
  }));
}

export async function fetchInvestimentos(): Promise<Investimento[]> {
  const { data, error } = await supabase.from("investimentos").select("*");
  if (error) throw error;
  if (!data) return [];

  return data.map((item: any) => ({
    id: item.id,
    item: item.item,
    descricao: item.descricao,
    valor: Number(item.valor || 0),
    data: item.data,
    categoria: item.categoria,
    tipoGasto: item.tipo_gasto,
    autorizadoPor: item.autorizado_por,
  }));
}

export async function fetchRegistrosPresenca(): Promise<RegistroPresenca[]> {
  const { data, error } = await supabase.from("registro_presenca").select("*");
  if (error) throw error;
  if (!data) return [];

  return data.map((item: any) => ({
    id: item.id,
    alunoId: item.aluno_id,
    alunoNome: item.aluno_nome,
    turmaId: item.turma_id,
    turmaNome: item.turma_nome,
    data: item.data,
    status: item.status,
    justificativa: item.justificativa || undefined,
    registradoPor: item.registrado_por,
    dataLançamento: item.data_lancamento,
    bloqueadoRetroativo: !!item.bloqueado_retroativo,
  }));
}

export async function fetchLogs(): Promise<RegistroAuditoria[]> {
  const { data, error } = await supabase.from("registro_auditoria").select("*").order("timestamp", { ascending: false });
  if (error) throw error;
  if (!data) return [];

  return data.map((item: any) => ({
    id: item.id,
    usuarioNome: item.usuario_nome,
    usuarioRole: item.usuario_role,
    acaoDescricao: item.acao_descricao,
    timestamp: item.timestamp,
    moduloReferencia: item.modulo_referencia,
  }));
}

// ==========================================
// 2. UPSERT WRITERS (Save to Supabase)
// ==========================================

export async function upsertAluno(aluno: AlunoData): Promise<void> {
  const { error } = await supabase.from("alunos").upsert({
    id: aluno.id,
    nome: aluno.nome,
    email: aluno.email,
    matricula: aluno.matricula,
    turmas: aluno.turmas,
    frequencia_geral: aluno.frequênciaGeral,
    nota_media: aluno.notaMedia,
    financeiro_pendencia: aluno.financeiroPendência,
    contato_responsavel: aluno.contatoResponsavel,
    nome_responsavel: aluno.nomeResponsavel,
    status_evasao: aluno.statusEvasao,
    justificativa_evasao: aluno.justificativaEvasao || null,
    presencas_detalhadas: aluno.presencasDetalhadas,
  });
  if (error) throw error;
}

export async function upsertSala(sala: Sala): Promise<void> {
  const { error } = await supabase.from("salas").upsert({
    id: sala.id,
    nome: sala.nome,
    tipo: sala.tipo,
    capacidade: sala.capacidade,
    status_ocupacao: sala.statusOcupacao,
    equipamentos: sala.equipamentos,
  });
  if (error) throw error;
}

export async function upsertTurma(turma: Turma): Promise<void> {
  const { error } = await supabase.from("turmas").upsert({
    id: turma.id,
    nome: turma.nome,
    curso: turma.curso,
    instrutor_id: turma.instrutorId,
    instrutor_nome: turma.instrutorNome,
    sala_id: turma.salaId,
    horario: turma.horario,
    dias_semana: turma.diasSemana,
    alunos_inscritos: turma.alunosInscritos,
  });
  if (error) throw error;
}

export async function upsertManutencao(man: AtivoManutencao): Promise<void> {
  const { error } = await supabase.from("ativo_manutencao").upsert({
    id: man.id,
    item: man.item,
    local_id: man.localId,
    local_nome: man.localNome,
    descricao_problema: man.descricaoProblema,
    solicitado_por: man.solicitadoPor,
    funcao_solicitante: man.funcaoSolicitante,
    data_solicitacao: man.dataSolicitacao,
    data_resolucao: man.dataResolucao || null,
    custo: man.custo,
    tipo: man.tipo,
    status: man.status,
    prioridade: man.prioridade,
  });
  if (error) throw error;
}

export async function upsertInvestimento(inv: Investimento): Promise<void> {
  const { error } = await supabase.from("investimentos").upsert({
    id: inv.id,
    item: inv.item,
    descricao: inv.descricao,
    valor: inv.valor,
    data: inv.data,
    categoria: inv.categoria,
    tipo_gasto: inv.tipoGasto,
    autorizado_por: inv.autorizadoPor,
  });
  if (error) throw error;
}

export async function upsertPresenca(pres: RegistroPresenca): Promise<void> {
  const { error } = await supabase.from("registro_presenca").upsert({
    id: pres.id,
    aluno_id: pres.alunoId,
    aluno_name: pres.alunoNome, // matches student name
    aluno_nome: pres.alunoNome,
    turma_id: pres.turmaId,
    turma_nome: pres.turmaNome,
    data: pres.data,
    status: pres.status,
    justificativa: pres.justificativa || null,
    registrado_por: pres.registradoPor,
    data_lancamento: pres.dataLançamento,
    bloqueado_retroativo: pres.bloqueadoRetroativo,
  });
  if (error) throw error;
}

export async function insertLog(log: RegistroAuditoria): Promise<void> {
  const { error } = await supabase.from("registro_auditoria").insert({
    id: log.id,
    usuario_nome: log.usuarioNome,
    usuario_role: log.usuarioRole,
    acao_descricao: log.acaoDescricao,
    timestamp: log.timestamp,
    modulo_referencia: log.moduloReferencia,
  });
  if (error) throw error;
}
