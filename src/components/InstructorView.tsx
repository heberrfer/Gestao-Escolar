import React, { useState } from "react";
import { Turma, AlunoData, RegistroPresenca } from "../types";
import { Check, X, ClipboardPlus, RefreshCw, AlertTriangle, Lock, Calendar, MessageSquare, CheckSquare, Plus, HelpCircle, Key, KeySquare } from "lucide-react";

interface InstructorViewProps {
  turmas: Turma[];
  alunos: AlunoData[];
  registrosPresenca: RegistroPresenca[];
  onGravarFrequencia: (frequencias: { alunoId: string; status: "presente" | "ausente" | "justificado"; justificativa?: string }[], turmaId: string, dataSelecionada: string, retroactiveBypass: boolean) => void;
  onAdicionarAuditoriaLog: (mensagem: string, modulo: "Frequência" | "Financeiro" | "Manutenção" | "Grade Horária" | "Acesso") => void;
}

export const InstructorView: React.FC<InstructorViewProps> = ({
  turmas,
  alunos,
  registrosPresenca,
  onGravarFrequencia,
  onAdicionarAuditoriaLog,
}) => {
  // Filter classes specific to current simulated instructor: marcos
  const instrutorLogadoId = "prof_marcos";
  const turmasDocente = turmas.filter((t) => t.instrutorId === instrutorLogadoId);

  const [turmaSelecionadaId, setTurmaSelecionadaId] = useState<string>(turmasDocente[0]?.id || "");
  const [dataSelecionada, setDataSelecionada] = useState<string>(new Date().toISOString().split("T")[0]);
  
  // Retroactive state simulation features
  const [requestRetroLockBypass, setRequestRetroLockBypass] = useState<boolean>(false);
  const [bypassJustification, setBypassJustification] = useState<string>("");
  const [isBypassApproved, setIsBypassApproved] = useState<boolean>(false);

  // Core attendance local states
  const [frequenciaLocal, setFrequenciaLocal] = useState<{ [alunoId: string]: { status: "presente" | "ausente" | "justificado"; justificativa?: string } }>({});

  const turmaAtiva = turmas.find((t) => t.id === turmaSelecionadaId);
  const alunosDaTurma = alunos.filter((aluno) => aluno.turmas.includes(turmaSelecionadaId));

  // Determine if selected date is retroactive (e.g. earlier than today)
  const hoje = new Date().toISOString().split("T")[0];
  const isRetroativa = dataSelecionada < hoje;
  const isBloqueadaSemBypass = isRetroativa && !isBypassApproved;

  // Initialize or override local states when selecting class/date
  React.useEffect(() => {
    const estadoInicial: { [alunoId: string]: { status: "presente" | "ausente" | "justificado"; justificativa?: string } } = {};
    
    alunosDaTurma.forEach((aluno) => {
      // Check if registrar already exists for this turma + date
      const regExistente = registrosPresenca.find(
        (rp) => rp.alunoId === aluno.id && rp.turmaId === turmaSelecionadaId && rp.data === dataSelecionada
      );
      
      estadoInicial[aluno.id] = {
        status: regExistente ? regExistente.status : "presente",
        justificativa: regExistente?.justificativa || "",
      };
    });
    
    setFrequenciaLocal(estadoInicial);
    // Reset bypass on date shift
    setIsBypassApproved(false);
    setRequestRetroLockBypass(false);
  }, [turmaSelecionadaId, dataSelecionada, registrosPresenca]);

  const handleStatusChange = (alunoId: string, status: "presente" | "ausente" | "justificado") => {
    if (isBloqueadaSemBypass) return;

    setFrequenciaLocal((prev) => ({
      ...prev,
      [alunoId]: {
        ...prev[alunoId],
        status,
      },
    }));
  };

  const handleJustificativaChange = (alunoId: string, txt: string) => {
    setFrequenciaLocal((prev) => ({
      ...prev,
      [alunoId]: {
        ...prev[alunoId],
        justificativa: txt,
      },
    }));
  };

  // Simulated retro override request
  const handleBypassRequest = () => {
    if (!bypassJustification.trim()) return;

    // Simulate approval by coordinator (auto logs)
    onAdicionarAuditoriaLog(
      `Instrutor solicitou autorização retroativa para liberar lançamento em data retroativa (${dataSelecionada}). Motivo: '${bypassJustification}'`,
      "Acesso"
    );
    onAdicionarAuditoriaLog(
      `Sistema aprovou automaticamente bypass temporário sob monitoramento de auditoria para o usuário Marcos Vinícius`,
      "Acesso"
    );

    setIsBypassApproved(true);
    setRequestRetroLockBypass(false);
  };

  const handleSalvarFrequenciaCompleta = () => {
    // Collect active payload
    const fPayload = Object.keys(frequenciaLocal).map((alunoId) => ({
      alunoId,
      status: frequenciaLocal[alunoId].status,
      justificativa: frequenciaLocal[alunoId].justificativa,
    }));

    onGravarFrequencia(fPayload, turmaSelecionadaId, dataSelecionada, isBypassApproved);
  };

  return (
    <div className="space-y-6" id="instructor-interactive-view">
      {/* Class Selector and Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Selecione sua Turma Ativa</label>
          <select
            value={turmaSelecionadaId}
            onChange={(e) => setTurmaSelecionadaId(e.target.value)}
            className="bg-slate-950 text-white font-bold px-3 py-2.5 rounded-xl border border-slate-800 text-sm outline-none cursor-pointer w-full md:w-72"
          >
            {turmasDocente.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome} ({t.id})
              </option>
            ))}
          </select>
        </div>

        {/* Date Selector */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Data de Frequência</label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
              className="bg-slate-950 text-white font-bold p-2 px-3 rounded-xl border border-slate-800 text-xs outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Rules check warning on past dates */}
      {isBloqueadaSemBypass && (
        <div className="bg-rose-950/20 border border-rose-900 rounded-2xl p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-sm font-bold text-rose-400 font-sans uppercase tracking-wider">
                Lançamento Retroativo Bloqueado - Norma Estrita
              </h5>
              <p className="text-xs text-slate-300 leading-normal max-w-xl">
                O sistema proíbe modificações retroativas para datas anteriores à data vigente de hoje para garantir rigor absoluto contra fraudes. Solicite uma chave de liberação temporária ou solicite aprovação imediata do Coordenador.
              </p>
            </div>
          </div>

          <button
            onClick={() => setRequestRetroLockBypass(true)}
            className="bg-rose-950/80 hover:bg-rose-900 text-rose-400 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-rose-900 shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <KeySquare className="w-4 h-4" />
            Solicitar Bypass Temporário
          </button>
        </div>
      )}

      {/* If override is active */}
      {isBypassApproved && (
        <div className="bg-emerald-950/20 border border-emerald-900 rounded-2xl p-3 px-4 flex items-center gap-2.5 text-emerald-400 text-xs">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>Bypass de Lançamento Retroativo ativo para esta aba. Lançamento liberado para a data: <strong>{dataSelecionada}</strong> sob monitoramento de auditoria.</span>
        </div>
      )}

      {/* Roster / Matrix check list */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
            Diário de Classe Digital: {turmaAtiva ? turmaAtiva.nome : ""}
          </h4>
          <p className="text-xs text-slate-400 leading-normal">
            Lançamento obrigatório individual para verificação de frequência (Metas Acadêmicas)
          </p>
        </div>

        {/* Student items to select presence */}
        <div className="grid grid-cols-1 gap-3.5">
          {alunosDaTurma.map((aluno) => {
            const locState = frequenciaLocal[aluno.id] || { status: "presente" };
            const estaEmRisco = aluno.frequênciaGeral < 75;

            return (
              <div
                key={aluno.id}
                className={`bg-slate-950 border p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  isBloqueadaSemBypass ? "opacity-60" : "hover:border-slate-800"
                } ${estaEmRisco ? "border-l-4 border-l-rose-500" : "border-slate-850"}`}
              >
                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-white text-xs">{aluno.nome}</span>
                    <span className="text-[9px] font-mono font-medium text-slate-500">{aluno.matricula}</span>
                    {estaEmRisco && (
                      <span className="text-[8px] bg-rose-950/60 border border-rose-900 text-rose-400 px-1.5 py-0.2 rounded font-mono animate-pulse">
                        ALERTA DE EVASÃO
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Frequência Acumulada Geral do Aluno: <strong className={estaEmRisco ? "text-rose-400" : "text-emerald-400"}>{aluno.frequênciaGeral}%</strong>
                  </span>
                </div>

                {/* Status Toggle Box */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                  {locState.status === "justificado" && (
                    <input
                      type="text"
                      placeholder="Declaração médica, recurso..."
                      value={locState.justificativa || ""}
                      disabled={isBloqueadaSemBypass}
                      onChange={(e) => handleJustificativaChange(aluno.id, e.target.value)}
                      className="bg-slate-900 text-[10px] placeholder-slate-600 text-slate-200 outline-none p-1.5 px-2.5 border border-slate-800 rounded min-w-[160px] focus:ring-1 focus:ring-slate-700"
                    />
                  )}

                  {/* Status switches layout */}
                  <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => handleStatusChange(aluno.id, "presente")}
                      disabled={isBloqueadaSemBypass}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans cursor-pointer transition-all ${
                        locState.status === "presente"
                          ? "bg-emerald-950 text-emerald-400 font-extrabold shadow-sm"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Presente
                    </button>
                    <button
                      onClick={() => handleStatusChange(aluno.id, "ausente")}
                      disabled={isBloqueadaSemBypass}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans cursor-pointer transition-all ${
                        locState.status === "ausente"
                          ? "bg-rose-950 text-rose-400 font-extrabold shadow-sm"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Falta
                    </button>
                    <button
                      onClick={() => handleStatusChange(aluno.id, "justificado")}
                      disabled={isBloqueadaSemBypass}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans cursor-pointer transition-all ${
                        locState.status === "justificado"
                          ? "bg-indigo-950 text-indigo-400 font-extrabold shadow-sm"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Justificar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Register button */}
        <div className="flex justify-end pt-2 border-t border-slate-900">
          <button
            onClick={handleSalvarFrequenciaCompleta}
            disabled={isBloqueadaSemBypass || alunosDaTurma.length === 0}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white disabled:text-slate-500 px-6 py-3 rounded-xl text-xs font-bold font-sans cursor-pointer flex items-center gap-2 shadow-md transition-all duration-150"
          >
            <ClipboardPlus className="w-4 h-4" />
            Salvar Diário de Frequência
          </button>
        </div>
      </div>

      {/* Bypass Request modal */}
      {requestRetroLockBypass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                Chave de Liberação Retroativa
              </h4>
              <p className="text-xs text-slate-400">
                Seu token é monitorado. Explique o motivo real da alteração fora do prazo legal para validação automática de auditoria.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-400 text-xs font-semibold">Justificativa da alteração tardia</label>
                <input
                  type="text"
                  placeholder="Ex: Aluno Lucas apresentou atestado de óbito familiar com atraso."
                  value={bypassJustification}
                  onChange={(e) => setBypassJustification(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-slate-700"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setRequestRetroLockBypass(false)}
                  className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white border border-slate-850 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleBypassRequest}
                  disabled={!bypassJustification.trim()}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white disabled:text-slate-500 text-xs font-bold cursor-pointer"
                >
                  Confirmar Justificativa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
