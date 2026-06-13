import React, { useState } from "react";
import { AlunoData, AtivoManutencao, Turma } from "../types";
import { Search, AlertTriangle, MessageSquare, Plus, CheckCircle, ListFilter, Activity, Calendar, Wrench, ShieldCheck, Mail } from "lucide-react";

interface CoordinatorViewProps {
  alunos: AlunoData[];
  turmas: Turma[];
  manutencoes: AtivoManutencao[];
  onTriggerWarning: (alunoId: string, tipo: string) => void;
  onAdicionarManutencao: (novaManutencao: AtivoManutencao) => void;
  onConcluirManutencao: (id: string, custoFinal: number) => void;
}

export const CoordinatorView: React.FC<CoordinatorViewProps> = ({
  alunos,
  turmas,
  manutencoes,
  onTriggerWarning,
  onAdicionarManutencao,
  onConcluirManutencao,
}) => {
  const [buscaAluno, setBuscaAluno] = useState<string>("");
  const [filtroEvasao, setFiltroEvasao] = useState<string>("todos");
  
  // States to add raw Maintenance ticket
  const [showManModal, setShowManModal] = useState<boolean>(false);
  const [novoAtivoNome, setNovoAtivoNome] = useState<string>("");
  const [novoAtivoLocal, setNovoAtivoLocal] = useState<string>("S101");
  const [novoAtivoProblema, setNovoAtivoProblema] = useState<string>("");
  const [novoAtivoCusto, setNovoAtivoCusto] = useState<number>(150);
  const [novoAtivoPrioridade, setNovoAtivoPrioridade] = useState<"Baixa" | "Média" | "Alta">("Média");
  const [novoAtivoTipo, setNovoAtivoTipo] = useState<"preventiva" | "corretiva">("corretiva");

  // Filtering students
  const alunosFiltrados = alunos.filter((aluno) => {
    const correspondeBusca =
      aluno.nome.toLowerCase().includes(buscaAluno.toLowerCase()) ||
      aluno.matricula.toLowerCase().includes(buscaAluno.toLowerCase());
    
    if (filtroEvasao === "todos") return correspondeBusca;
    return correspondeBusca && aluno.statusEvasao.toLowerCase() === filtroEvasao.toLowerCase();
  });

  const handleSalvarManutencao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoAtivoNome.trim() || !novoAtivoProblema.trim()) return;

    const ticket: AtivoManutencao = {
      id: `MAN_${Date.now().toString().slice(-4)}`,
      item: novoAtivoNome,
      localId: novoAtivoLocal,
      localNome: novoAtivoLocal === "S101" ? "Sala de Teoria 101" : novoAtivoLocal === "L201" ? "Laboratório de Software A" : "Auditório Principal",
      descricaoProblema: novoAtivoProblema,
      solicitadoPor: "Coordenador Geral",
      funcaoSolicitante: "coordenador",
      dataSolicitacao: new Date().toISOString().split("T")[0],
      custo: Number(novoAtivoCusto) || 0,
      tipo: novoAtivoTipo,
      status: "pendente",
      prioridade: novoAtivoPrioridade,
    };

    onAdicionarManutencao(ticket);
    setShowManModal(false);
    // Reset
    setNovoAtivoNome("");
    setNovoAtivoProblema("");
    setNovoAtivoCusto(150);
    setNovoAtivoPrioridade("Média");
  };

  return (
    <div className="space-y-6" id="coordinator-tactical-view">
      {/* Overview stats for coordination */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total High Risk Students */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Alunos Risco Evasão CRÍTICO</span>
            <span className="text-2xl font-bold font-sans text-rose-400">48 alunos</span>
            <p className="text-[10px] text-rose-500 leading-none">Matriculados sob intervenção rigorosa</p>
          </div>
          <div className="bg-rose-950/20 text-rose-400 p-2.5 rounded-lg border border-rose-900">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Classes with Over allocation issues */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Ocupação e Frequência Geral</span>
            <span className="text-2xl font-bold font-sans text-amber-400">81.2%</span>
            <p className="text-[10px] text-slate-400 leading-none">Abaixo da meta recomendada (90%)</p>
          </div>
          <div className="bg-amber-950/20 text-amber-400 p-2.5 rounded-lg border border-amber-900">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Maintenance active alerts count */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Tickets Manutenção Pendentes</span>
            <span className="text-2xl font-bold font-sans text-indigo-400">
              {manutencoes.filter((m) => m.status === "pendente").length} Ativos
            </span>
            <p className="text-[10px] text-slate-400 leading-none">Reparos que afetam a liberação de salas</p>
          </div>
          <div className="bg-indigo-950/20 text-indigo-400 p-2.5 rounded-lg border border-indigo-900">
            <Wrench className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Roster & Dropout Prevention early alerts engine */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
              Controle Preventivo de Evasão Escolar (Early Warning)
            </h4>
            <p className="text-xs text-slate-400">
              Gestão automatizada baseada em frequência; se o aluno possuir frequência inferior a 75% ele requer ação preventiva imediata!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {/* Filter by risk */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs text-slate-400">
              <ListFilter className="w-3.5 h-3.5" />
              <select
                value={filtroEvasao}
                onChange={(e) => setFiltroEvasao(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-slate-300 font-semibold cursor-pointer max-w-[140px]"
              >
                <option value="todos">Todos os Riscos</option>
                <option value="preocupante" className="bg-slate-950">Preocupante</option>
                <option value="alerta" className="bg-slate-950">Alertas</option>
                <option value="estável" className="bg-slate-950">Estáveis</option>
              </select>
            </div>

            {/* Search Students */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300 text-xs w-full sm:w-60">
              <Search className="w-3.5 h-3.5 shrink-0 text-slate-500" />
              <input
                type="text"
                placeholder="Pesquisar por aluno..."
                value={buscaAluno}
                onChange={(e) => setBuscaAluno(e.target.value)}
                className="bg-transparent outline-none w-full"
              />
            </div>
          </div>
        </div>

        {/* Student List View list */}
        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-[10px] uppercase font-mono text-slate-400 tracking-wider">
                <th className="p-3">Matrícula</th>
                <th className="p-3">Nome / Contato</th>
                <th className="p-3">Frequência</th>
                <th className="p-3">Média</th>
                <th className="p-3">Grau de Risco</th>
                <th className="p-3 text-center">Mensalidade</th>
                <th className="p-3 text-right">Ação Preventiva</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {alunosFiltrados.map((aluno) => {
                const isCritical = aluno.frequênciaGeral < 75;
                return (
                  <tr key={aluno.id} className="hover:bg-slate-950/40 text-slate-300">
                    <td className="p-3 font-mono text-slate-400">{aluno.matricula}</td>
                    <td className="p-3">
                      <div className="font-semibold text-white">{aluno.nome}</div>
                      <div className="text-[10px] text-slate-500 mt-1 max-w-xs">{aluno.email} • {aluno.contatoResponsavel}</div>
                      {aluno.justificativaEvasao && (
                        <div className="mt-1 bg-slate-950/80 text-[10px] text-rose-300/90 border border-slate-800/70 p-2 rounded-lg leading-relaxed max-w-sm">
                          <span className="font-bold">Motivo:</span> {aluno.justificativaEvasao}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold ${isCritical ? "text-rose-400 font-extrabold" : "text-emerald-400"}`}>
                          {aluno.frequênciaGeral}%
                        </span>
                        {isCritical && (
                          <span className="text-[8px] bg-rose-950/60 border border-rose-900 text-rose-400 font-mono py-0.2 px-1 rounded animate-pulse">
                            CRÍTICO
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 font-mono font-semibold">{aluno.notaMedia.toFixed(1)}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-sans font-medium border ${
                          aluno.statusEvasao === "Preocupante"
                            ? "bg-rose-950 text-rose-400 border-rose-900"
                            : aluno.statusEvasao === "Alerta"
                            ? "bg-amber-950 text-amber-400 border-amber-900"
                            : "bg-emerald-950 text-emerald-400 border-emerald-900"
                        }`}
                      >
                        {aluno.statusEvasao}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`w-3.5 h-3.5 rounded-full inline-block ${
                          aluno.financeiroPendência ? "bg-rose-500 animate-pulse" : "bg-emerald-500"
                        }`}
                        title={aluno.financeiroPendência ? "Mensalidade Atrasada" : "Regularizado"}
                      />
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Notify responsible */}
                        <button
                          onClick={() => onTriggerWarning(aluno.id, "notificar_responsavel")}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/60 font-semibold cursor-pointer text-slate-300 hover:text-white hover:bg-slate-900 text-[10px] flex items-center gap-1.5"
                          title="Enviar notificação automática por SMS / E-mail para os pais"
                        >
                          <Mail className="w-3 h-3 text-cyan-400" />
                          Acionar Pais
                        </button>
                        
                        {/* Audit intervention interview */}
                        <button
                          onClick={() => onTriggerWarning(aluno.id, "auditar_intervencao")}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/60 font-semibold cursor-pointer text-slate-300 hover:text-white hover:bg-slate-900 text-[10px] flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3 h-3 text-indigo-400" />
                          Agendar Entrevista
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Facilities Maintenance manager */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans flex items-center gap-2">
              <Wrench className="w-4 h-4 text-indigo-400" />
              Gestão e Manutenção de Infraestrutura Escolar
            </h4>
            <p className="text-xs text-slate-400">
              Gestão de ativos físicos e salas reservadas sob controle de despesas de manutenção corretivas e preventivas
            </p>
          </div>

          <button
            onClick={() => setShowManModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 self-start md:self-auto shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Lançar Ordem de Serviço
          </button>
        </div>

        {/* Existing maintenance tasks log table */}
        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-[10px] uppercase font-mono text-slate-400 tracking-wider">
                <th className="p-3">Código</th>
                <th className="p-3">Ativo / Local</th>
                <th className="p-3">Problema / Descrição</th>
                <th className="p-3">Data OS</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Previsão/Custo</th>
                <th className="p-3">Prioridade</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {manutencoes.map((man) => (
                <tr key={man.id} className="hover:bg-slate-950/40 text-slate-300">
                  <td className="p-3 font-mono text-slate-500">{man.id}</td>
                  <td className="p-3">
                    <div className="font-semibold text-white">{man.item}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">{man.localNome}</div>
                  </td>
                  <td className="p-3 text-slate-400 max-w-xs">{man.descricaoProblema}</td>
                  <td className="p-3 font-mono text-slate-500">{man.dataSolicitacao}</td>
                  <td className="p-3 uppercase">
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                        man.tipo === "preventiva"
                          ? "bg-emerald-950 text-emerald-400 border-emerald-900"
                          : "bg-rose-950 text-rose-400 border-rose-900"
                      }`}
                    >
                      {man.tipo}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-white">R$ {man.custo.toFixed(2)}</td>
                  <td className="p-3">
                    <span
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded ${
                        man.prioridade === "Alta"
                          ? "bg-rose-950 text-rose-400"
                          : man.prioridade === "Média"
                          ? "bg-slate-800 text-slate-300"
                          : "bg-slate-950 text-slate-500"
                      }`}
                    >
                      {man.prioridade}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                        man.status === "concluido"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-900"
                          : "bg-amber-950 text-amber-400 border border-amber-900 animate-pulse"
                      }`}
                    >
                      {man.status === "concluido" ? "Concluído" : "Aguardando Peças"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {man.status === "pendente" && (
                      <button
                        onClick={() => onConcluirManutencao(man.id, man.custo)}
                        className="p-1 px-2.5 rounded bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-900 text-[10px] font-bold cursor-pointer font-sans"
                      >
                        Dar Baixa
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OS Creation modal popup */}
      {showManModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                Lançar Ordem de Serviço (OS)
              </h4>
              <button
                onClick={() => setShowManModal(false)}
                className="text-slate-400 hover:text-white font-bold px-2 py-1 cursor-pointer"
              >
                X
              </button>
            </div>

            <form onSubmit={handleSalvarManutencao} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-medium font-sans">Nome do Ativo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ar Condicionado Split, Projetor Sala 101"
                  value={novoAtivoNome}
                  onChange={(e) => setNovoAtivoNome(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none focus:ring-1 focus:ring-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium font-sans">Localização (ID)</label>
                  <select
                    value={novoAtivoLocal}
                    onChange={(e) => setNovoAtivoLocal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none"
                  >
                    <option value="S101">Sala de Teoria 101</option>
                    <option value="L201">Laboratório de Software A</option>
                    <option value="AUD">Auditório Principal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium font-sans">Custo Estimado (R$)</label>
                  <input
                    type="number"
                    value={novoAtivoCusto}
                    onChange={(e) => setNovoAtivoCusto(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium font-sans">Prioridade de OS</label>
                  <select
                    value={novoAtivoPrioridade}
                    onChange={(e) => setNovoAtivoPrioridade(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium font-sans">Tipo de OS</label>
                  <select
                    value={novoAtivoTipo}
                    onChange={(e) => setNovoAtivoTipo(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none"
                  >
                    <option value="corretiva">Corretiva (Urgência)</option>
                    <option value="preventiva">Preventiva (Acordo Calendário)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium font-sans">Descrição do Defeito / Planejamento</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Descreva minuciosamente qual o defeito apontado para balizamento de faturas."
                  value={novoAtivoProblema}
                  onChange={(e) => setNovoAtivoProblema(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowManModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
                >
                  Salvar OS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
