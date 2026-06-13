import React, { useState } from "react";
import { AlunoData, AtivoManutencao } from "../types";
import { User, Activity, GraduationCap, DollarSign, AlertCircle, HelpCircle, Bug, Check } from "lucide-react";

interface StudentViewProps {
  alunoCorrente: AlunoData;
  onAdicionarManutencao: (novaManutencao: AtivoManutencao) => void;
}

export const StudentView: React.FC<StudentViewProps> = ({ alunoCorrente, onAdicionarManutencao }) => {
  const [reportAssunto, setReportAssunto] = useState<string>("");
  const [reportSala, setReportSala] = useState<string>("L201");
  const [reportDescricao, setReportDescricao] = useState<string>("");
  const [showSucesso, setShowSucesso] = useState<boolean>(false);

  // Send maintenance incident request
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportAssunto.trim() || !reportDescricao.trim()) return;

    const ticket: AtivoManutencao = {
      id: `MAN_${Date.now().toString().slice(-4)}`,
      item: reportAssunto,
      localId: reportSala,
      localNome: reportSala === "L201" ? "Laboratório de Software A" : reportSala === "S101" ? "Sala de Teoria 101" : "Auditório Geral",
      descricaoProblema: `${reportDescricao} (Reportado via autoatendimento do Aluno: ${alunoCorrente.nome})`,
      solicitadoPor: alunoCorrente.nome,
      funcaoSolicitante: "aluno",
      dataSolicitacao: new Date().toISOString().split("T")[0],
      custo: 50.00, // Custo padrão inicial
      tipo: "corretiva",
      status: "pendente",
      prioridade: "Baixa",
    };

    onAdicionarManutencao(ticket);
    setShowSucesso(true);
    setReportAssunto("");
    setReportDescricao("");
    setTimeout(() => {
      setShowSucesso(false);
    }, 4000);
  };

  const isFrequenciaCritica = alunoCorrente.frequênciaGeral < 75;

  return (
    <div className="space-y-6" id="student-personal-view">
      {/* Student Personal Profile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Attendance Ring Meter card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between items-center text-center">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Frequência Acumulada</span>
            <span className="text-[11px] text-slate-400 font-mono block">Limite Rápido Escolar: 75%</span>
          </div>

          {/* Svg Circular Indicator */}
          <div className="relative w-32 h-32 my-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="2.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${isFrequenciaCritica ? "text-rose-500" : "text-emerald-400"} transition-all duration-300`}
                strokeWidth="2.5"
                strokeDasharray={`${alunoCorrente.frequênciaGeral}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold font-mono ${isFrequenciaCritica ? "text-rose-400 font-extrabold" : "text-emerald-400"}`}>
                {alunoCorrente.frequênciaGeral}%
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5">Frequência</span>
            </div>
          </div>

          <div
            className={`w-full p-2.5 rounded-lg border text-[10px] leading-relaxed ${
              isFrequenciaCritica
                ? "bg-rose-950/25 border-rose-900 text-rose-300"
                : "bg-emerald-950/20 border-emerald-900/60 text-emerald-400"
            }`}
          >
            {isFrequenciaCritica ? (
              <strong>ALERTA DE FREQUÊNCIA:</strong>
            ) : (
              <strong>SITUAÇÃO REGULAR:</strong>
            )}{" "}
            {isFrequenciaCritica
              ? "Você está abaixo do mínimo institucional e corre risco de suspensão por frequência!"
              : "Parabéns. Continue mantendo o ritmo de frequência para evitar riscos."}
          </div>
        </div>

        {/* Academic GPA and Notice Alert */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">Boletim Consolidado</h4>
                <p className="text-[10px] text-slate-400 font-mono">{alunoCorrente.matricula}</p>
              </div>
            </div>

            {/* GPA */}
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl">
              <span className="text-xs text-slate-400 font-medium">Média Global do Curso</span>
              <span className="text-xl font-mono font-bold text-white bg-slate-900 p-1.5 px-3.5 rounded border border-slate-800">
                {alunoCorrente.notaMedia.toFixed(2)}
              </span>
            </div>

            {/* Active tuition balance details */}
            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-850">
              <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-[11px] leading-normal">
                {alunoCorrente.financeiroPendência ? (
                  <span className="text-rose-400 font-bold block">🚨 FINANCEIRO: PARCELA EM ATRASO</span>
                ) : (
                  <span className="text-emerald-400 font-bold block">✓ FINANCEIRO: REGULARIZADO</span>
                )}
                <span className="text-slate-400">Mensalidade ordinária vencendo no dia 10 do mês.</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono mt-3 text-right">
            Scolarise Academic Dashboard
          </div>
        </div>

        {/* Classroom Equipment Reporter form */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3 mb-4">
            <Bug className="w-5 h-5 text-rose-400" />
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">Reportar Problema na Sala</h4>
              <p className="text-[10px] text-slate-400">Tem algo quebrado ou com defeito? Reporte direto aos coordenadores</p>
            </div>
          </div>

          {showSucesso && (
            <div className="bg-emerald-950/20 border border-emerald-900 rounded-xl p-3 mb-4 flex items-center gap-2 text-emerald-400 text-xs">
              <Check className="w-4 h-4" />
              <span>Ocorrência cadastrada com sucesso na coordenação!</span>
            </div>
          )}

          <form onSubmit={handleSubmitReport} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Nome do Ativo com Defeito</label>
              <input
                type="text"
                required
                placeholder="Ex: Teclado quebrado no micro 12, lâmpada queimada"
                value={reportAssunto}
                onChange={(e) => setReportAssunto(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg text-slate-200 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Onde está ocorrendo?</label>
              <select
                value={reportSala}
                onChange={(e) => setReportSala(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg text-slate-200 outline-none"
              >
                <option value="L201">Laboratório de Software A</option>
                <option value="S101">Sala de Teoria 101</option>
                <option value="AUD">Auditório Principal</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Breve Descrição do Problema</label>
              <textarea
                required
                rows={2}
                placeholder="Descreva o que está ocorrendo para encaminhamento rápido."
                value={reportDescricao}
                onChange={(e) => setReportDescricao(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg text-slate-200 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold p-2.5 rounded-xl cursor-pointer shadow-sm text-xs transition active:scale-95"
            >
              Enviar para Reparos
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
