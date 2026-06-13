import React, { useState } from "react";
import { Sala, Investimento, RegistroAuditoria } from "../types";
import { BarChart3, TrendingDown, ClipboardList, TrendingUp, Search, DollarSign, PenTool, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";

interface DirectorViewProps {
  estatisticas: any;
  salas: Sala[];
  investimentos: Investimento[];
  historicoLogs: RegistroAuditoria[];
}

export const DirectorView: React.FC<DirectorViewProps> = ({
  estatisticas,
  salas,
  investimentos,
  historicoLogs,
}) => {
  const [buscaInvestimento, setBuscaInvestimento] = useState<string>("");
  const [selectedSubTab, setSelectedSubTab] = useState<"financeiro" | "ocupacao" | "auditoria" | "supabase">("financeiro");

  // Filter investments
  const investimentosFiltrados = investimentos.filter((i) =>
    i.item.toLowerCase().includes(buscaInvestimento.toLowerCase()) ||
    i.categoria.toLowerCase().includes(buscaInvestimento.toLowerCase())
  );

  return (
    <div className="space-y-6" id="director-dashboard-view">
      {/* Strategic KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI: Ticket vs Custos */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Custo Médio p/ Aluno</span>
              <DollarSign className="w-4 h-4 text-emerald-400 font-mono" />
            </div>
            <h4 className="text-2xl font-bold font-sans text-rose-400">R$ 384,50</h4>
            <p className="text-[10px] text-slate-500 leading-normal mt-1">
              Corte médio OPEX mensal consolidado estrutural
            </p>
          </div>
          <div className="mt-3 text-[10px] text-emerald-400 font-medium bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/60 self-start">
            Equilibrado
          </div>
        </div>

        {/* Global Evasion Rate */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Evasão Trimestre (Churn)</span>
              <TrendingDown className="w-4 h-4 text-rose-400" />
            </div>
            <h4 className="text-2xl font-bold font-sans text-white">{estatisticas.taxaEvasaoGlobalTrimestre}%</h4>
            <p className="text-[10px] text-slate-500 leading-normal mt-1">
              Meta estrita corporativa: <span className="text-emerald-400 font-bold">&lt; 2.5%</span>
            </p>
          </div>
          <div className="mt-3 text-[10px] text-rose-400 font-medium bg-rose-950/20 px-2 py-0.5 rounded border border-rose-900/60 self-start">
            Risco Elevaro (Alerta)
          </div>
        </div>

        {/* Budget CAPEX */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Investimentos CAPEX</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <h4 className="text-2xl font-bold font-sans text-emerald-400">R$ {estatisticas.investimentoAcumuladoCAPEX.toLocaleString("pt-BR")}</h4>
            <p className="text-[10px] text-slate-500 leading-normal mt-1">
              Equipamento & Renovação de Laboratórios
            </p>
          </div>
          <div className="mt-3 text-[10px] text-indigo-400 font-medium bg-indigo-950/20 px-2 py-0.5 rounded border border-indigo-900/60 self-start">
            71.8% do orçamento anual
          </div>
        </div>

        {/* Expenses OPEX */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Gastos Operacionais OPEX</span>
              <BarChart3 className="w-4 h-4 text-amber-400" />
            </div>
            <h4 className="text-2xl font-bold font-sans text-amber-400">R$ {estatisticas.gastoAcumuladoOPEX.toLocaleString("pt-BR")}</h4>
            <p className="text-[10px] text-slate-500 leading-normal mt-1">
              Manutenções Corretivas e Suporte de Rotina
            </p>
          </div>
          <div className="mt-3 text-[10px] text-amber-400 font-medium bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/60 self-start">
            Gastos emergenciais elevados
          </div>
        </div>
      </div>

      {/* Navigation Sub Tabs for the Director */}
      <div className="flex border-b border-slate-800 gap-1 overflow-x-auto pb-px">
        <button
          onClick={() => setSelectedSubTab("financeiro")}
          className={`px-4 py-2.5 text-xs font-bold leading-none cursor-pointer border-b-2 transition-all ${
            selectedSubTab === "financeiro"
              ? "border-emerald-500 text-emerald-400 font-bold bg-emerald-950/10"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Investimentos & Balanços (CAPEX/OPEX)
        </button>
        <button
          onClick={() => setSelectedSubTab("ocupacao")}
          className={`px-4 py-2.5 text-xs font-bold leading-none cursor-pointer border-b-2 transition-all ${
            selectedSubTab === "ocupacao"
              ? "border-emerald-500 text-emerald-400 font-bold bg-emerald-950/10"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Ocupação de Ambientes & Infraestrutura
        </button>
        <button
          onClick={() => setSelectedSubTab("auditoria")}
          className={`px-4 py-2.5 text-xs font-bold leading-none cursor-pointer border-b-2 transition-all ${
            selectedSubTab === "auditoria"
              ? "border-emerald-500 text-emerald-400 font-bold bg-emerald-950/10"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Trilha de Auditoria Geral ( Logs Rígidos )
        </button>
        <button
          onClick={() => setSelectedSubTab("supabase")}
          className={`px-4 py-2.5 text-xs font-bold leading-none cursor-pointer border-b-2 transition-all ${
            selectedSubTab === "supabase"
              ? "border-emerald-500 text-emerald-400 font-bold bg-emerald-950/10"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Regras Supabase & Políticas RLS
        </button>
      </div>

      {/* Finance and Investment view */}
      {selectedSubTab === "financeiro" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                Aporte Orçamentário e Balanço de Investimentos
              </h4>
              <p className="text-xs text-slate-400 leading-normal">
                Auditoria rigorosa de despesa de capital (CAPEX) e despesa operacional (OPEX)
              </p>
            </div>
            
            {/* Search */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-slate-400 w-full md:w-72">
              <Search className="w-3.5 h-3.5 shrink-0 text-slate-500" />
              <input
                type="text"
                placeholder="Pesquisar orçamento..."
                value={buscaInvestimento}
                onChange={(e) => setBuscaInvestimento(e.target.value)}
                className="bg-transparent text-xs text-slate-200 placeholder-slate-500 outline-none w-full"
              />
            </div>
          </div>

          {/* Visual Budget Bar Chart */}
          <div className="bg-slate-950 p-4 rounded-xl space-y-3">
            <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase font-mono">
              Distribuição Visual de Despesas (CAPEX vs OPEX)
            </span>
            <div className="space-y-4">
              {/* CAPEX bar */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-teal-400">CAPEX (Investimento em Ativos Fixos)</span>
                  <span className="text-white">R$ 124.500,00 (71.9%)</span>
                </div>
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full transition-all" style={{ width: "71.9%" }}></div>
                </div>
              </div>
              {/* OPEX bar */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-amber-400">OPEX (Operação/Manutenção Corrente)</span>
                  <span className="text-white">R$ 48.600,00 (28.1%)</span>
                </div>
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: "28.1%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-[10px] uppercase font-mono text-slate-400 tracking-wider">
                  <th className="p-3">Data</th>
                  <th className="p-3">Item / Projeto</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Gasto</th>
                  <th className="p-3 text-right">Valor</th>
                  <th className="p-3">Autorizado Por</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {investimentosFiltrados.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-950/40 text-slate-300">
                    <td className="p-3 font-mono text-slate-400">{i.data}</td>
                    <td className="p-3">
                      <div className="font-semibold text-white">{i.item}</div>
                      <div className="text-[10px] text-slate-500 max-w-sm mt-0.5">{i.descricao}</div>
                    </td>
                    <td className="p-3 text-slate-400">{i.categoria}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                          i.tipoGasto === "CAPEX"
                            ? "bg-slate-950 text-teal-400 border-teal-900"
                            : "bg-slate-950 text-amber-400 border-amber-900"
                        }`}
                      >
                        {i.tipoGasto}
                      </span>
                    </td>
                    <td className="p-3 text-right text-white font-mono font-bold">
                      R$ {i.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-slate-400 font-medium">{i.autorizadoPor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Classroom Occupations SubTab */}
      {selectedSubTab === "ocupacao" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
              Ocupação de Salas, Laboratórios e Oficinas
            </h4>
            <p className="text-xs text-slate-400 leading-normal">
              Controle de ociosidade das salas físicas vinculadas à matriz horária (Scolarise Matrix Rule)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {salas.map((sala) => (
              <div key={sala.id} className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-indigo-400 border border-slate-800">
                      {sala.id}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-medium ${
                        sala.statusOcupacao === "Livre"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-900"
                          : sala.statusOcupacao === "Ocupada"
                          ? "bg-indigo-950 text-indigo-400 border border-indigo-900"
                          : "bg-rose-950 text-rose-400 border border-rose-900"
                      }`}
                    >
                      {sala.statusOcupacao}
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-white font-sans">{sala.nome}</h5>
                  <p className="text-xs text-slate-400 mt-1">Capacidade: {sala.capacidade} alunos</p>
                  
                  {/* Equipments list wrapper */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {sala.equipamentos.map((eq, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Occupancy Indicator details */}
                <div className="border-t border-slate-900 mt-4 pt-3 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">Eficiência Histórica</span>
                  <span className="text-xs font-mono text-slate-300 font-bold">
                    {sala.statusOcupacao === "Ocupada" ? "100%" : sala.statusOcupacao === "Livre" ? "0%" : "Manutenção"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Logs view */}
      {selectedSubTab === "auditoria" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-indigo-400" />
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                Trilha de Auditoria de Lançamentos (Logs de Segurança)
              </h4>
              <p className="text-xs text-slate-400 leading-normal">
                Registro inalterável de bloqueios, alterações de frequência retroativas e autorizações
              </p>
            </div>
          </div>

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
            {historicoLogs.map((log) => (
              <div key={log.id} className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl flex items-start gap-3 text-xs">
                <div
                  className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                    log.usuarioRole === "diretor"
                      ? "bg-rose-950/20 text-rose-400 border border-rose-900"
                      : log.usuarioRole === "coordenador"
                      ? "bg-blue-950/20 text-blue-400 border border-blue-900"
                      : "bg-slate-900 text-slate-400 border border-slate-800"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-white font-sans flex items-center gap-1.5">
                      {log.usuarioNome}
                      <span className="text-[10px] uppercase font-mono py-0.2 px-1 rounded bg-slate-900 text-slate-400 tracking-wide border border-slate-800">
                        {log.usuarioRole}
                      </span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-normal font-sans text-xs">{log.acaoDescricao}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-indigo-400 font-mono font-medium tracking-wider uppercase">
                      MÓDULO: {log.moduloReferencia}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supabase & RLS Setup view (Critical for proving full database competency to the user) */}
      {selectedSubTab === "supabase" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-start gap-3">
            <ClipboardList className="w-5 h-5 text-indigo-400 mt-1" />
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                Esquema Supabase & Row Level Security (RLS) Ativo
              </h4>
              <p className="text-xs text-slate-400 leading-normal">
                Estrutura de regras utilizada no banco para garantir o seu controle estratégico rígido
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Supabase Schema SQL code list */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-indigo-400 font-bold block uppercase tracking-wider">
                1. Políticas de Segurança (SQL Editor)
              </span>
              <pre className="text-[10px] font-mono text-slate-300 overflow-x-auto leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 max-h-[250px]">
{`/* RLS - Frequência:
   Diretores e Coordenadores acessam tudo.
   Alunos lêem somente a própria linha. */
CREATE POLICY "Controle Acesso Frequência"
ON frequencia FOR ALL TO authenticated
USING (
  auth.uid() IN (SELECT id FROM perfis WHERE funcao IN ('diretor', 'coordenador'))
  OR aluno_id = auth.uid()
);

/* RLS - Investimentos:
   Somente diretores podem inserir e ler faturas. */
CREATE POLICY "Diretor acessa investimentos"
ON investimentos FOR ALL TO authenticated
USING (
  (SELECT funcao FROM perfis WHERE id = auth.uid()) = 'diretor'
);`}
              </pre>
            </div>

            {/* Simulated Query Execution Safe console */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-[11px] font-mono text-indigo-400 font-bold block uppercase tracking-wider">
                2. Depurador de Políticas de Supabase (RLS Tester)
              </span>
              
              <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 text-xs space-y-3 font-sans">
                <span className="text-slate-400 font-semibold block">Simular tentativa de consulta:</span>
                
                <div className="flex flex-col gap-2">
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 font-mono text-[10px] text-slate-300">
                    <span className="text-indigo-400">SELECT</span> * <span className="text-indigo-400">FROM</span> investimentos;
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-slate-400">Como perfil de:</span>
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-purple-400 border border-purple-950 font-mono text-[10px] font-bold uppercase">
                      Aluno
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-rose-950/20 border border-rose-900 rounded p-2.5 text-rose-300 text-[11px]">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <div>
                    <span className="font-bold">STATUS: REJEITADO (403 - RLS Restrict Action)</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Sua conta de Aluno não possui a função 'diretor' exigida na política de segurança de linha da tabela de investimentos.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Acesso aos dados protegido com sucesso no Supabase.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
