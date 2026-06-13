import React, { useState } from "react";
import { Sparkles, Loader, Send, AlertTriangle, Lightbulb, BookOpen, BarChart3, HelpCircle } from "lucide-react";

interface AICounselorProps {
  dadosParaIA: any;
}

export const AICounselor: React.FC<AICounselorProps> = ({ dadosParaIA }) => {
  const [analise, setAnalise] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [activeContext, setActiveContext] = useState<string>("geral");
  const [customPrompt, setCustomPrompt] = useState<string>("");

  const carregarAnalise = async (contexto: string, promptAdicional: string = "") => {
    setLoading(true);
    setErrorMsg("");
    setAnalise("");
    setActiveContext(contexto);

    // Preparar dados estruturados refinados da escola que o server enviará para o Gemini
    const payload = {
      dadosEscola: {
        estatisticasGlobais: dadosParaIA.estatisticasGlobais,
        salas: dadosParaIA.salas,
        turmas: dadosParaIA.turmas.map((t: any) => ({
          nome: t.nome,
          horario: t.horario,
          instrutor: t.instrutorNome,
          alunosInscritosContagem: t.alunosInscritos.length
        })),
        alunosFoco: dadosParaIA.alunos.map((a: any) => ({
          nome: a.nome,
          frequencia: a.frequênciaGeral,
          nota: a.notaMedia,
          pendenciaFinanceira: a.financeiroPendência,
          statusEvasao: a.statusEvasao,
          justificativa: a.justificativaEvasao
        })),
        manutencoesPendentes: dadosParaIA.manutencoes.filter((m: any) => m.status === "pendente"),
        investimentosPrecedentes: dadosParaIA.investimentos.slice(0, 4)
      },
      contextType: contexto,
      promptUsuario: promptAdicional
    };

    try {
      const response = await fetch("/api/analise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");
      
      if (!response.ok) {
        if (isJson) {
          const data = await response.json();
          throw new Error(data.error || `Erro de Servidor (Status ${response.status})`);
        } else {
          const text = await response.text();
          console.error("Erro do servidor (HTML/Texto):", text);
          throw new Error(`Erro de Servidor (Status ${response.status}). Não foi possível processar a requisição.`);
        }
      }

      const text = await response.text();
      const trimmedText = text.trim();
      if (trimmedText.startsWith("<!doctype") || trimmedText.startsWith("<html") || trimmedText.startsWith("<!DOCTYPE")) {
        console.warn("Resposta HTML recebida quando esperava JSON:", text.substring(0, 200));
        throw new Error("O servidor retornou uma página de navegação (HTML) em vez de uma resposta de API (JSON). Isso acontece se a rota de API correspondente não estiver escutando no servidor ou se o servidor estiver reiniciando.");
      }

      try {
        const data = JSON.parse(text);
        setAnalise(data.analise);
      } catch (parseError) {
        console.error("Erro ao analisar JSON. Resposta bruta:", text);
        throw new Error("A resposta recebida do servidor não está em formato JSON válido.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Não foi possível conectar ao servidor de IA.");
    } finally {
      setLoading(false);
    }
  };

  // Um mini-parser robusto de Markdown para exibir os títulos, tabelas e marcadores de forma linda
  const formatarRelatorioMarkdown = (texto: string) => {
    if (!texto) return null;

    const linhas = texto.split("\n");
    return linhas.map((linha, index) => {
      // Headers
      if (linha.startsWith("### ")) {
        return (
          <h4 key={index} className="text-sm font-bold text-indigo-400 mt-4 mb-2 tracking-wide uppercase font-sans">
            {linha.replace("### ", "")}
          </h4>
        );
      }
      if (linha.startsWith("## ")) {
        return (
          <h3 key={index} className="text-base font-bold text-white mt-5 mb-2.5 border-b border-indigo-950 pb-1">
            {linha.replace("## ", "")}
          </h3>
        );
      }
      if (linha.startsWith("# ")) {
        return (
          <h2 key={index} className="text-lg font-extrabold text-indigo-300 mt-6 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            {linha.replace("# ", "")}
          </h2>
        );
      }
      // Bullet points
      if (linha.trim().startsWith("* ") || linha.trim().startsWith("- ")) {
        const conteudo = linha.trim().substring(2);
        // Destacar termos entre **
        return (
          <li key={index} className="text-xs text-slate-300 ml-4 mb-1.5 list-disc leading-relaxed">
            {processarNegritos(conteudo)}
          </li>
        );
      }
      // Blockquote
      if (linha.startsWith("> ")) {
        return (
          <blockquote key={index} className="border-l-4 border-cyan-500 bg-cyan-950/20 px-3 py-2 rounded-r-lg my-3 text-xs italic text-slate-300 leading-relaxed">
            {linha.substring(2)}
          </blockquote>
        );
      }
      // Simple tables support
      if (linha.startsWith("|")) {
        // Ignorar separadores de tabela |---|
        if (linha.includes("---")) return null;
        const colunas = linha.split("|").map(c => c.trim()).filter(c => c !== "");
        return (
          <div key={index} className="grid grid-cols-4 gap-2 bg-slate-900/60 p-2.5 border-b border-slate-800 text-xs font-sans text-slate-300">
            {colunas.map((col, cIdx) => (
              <div key={cIdx} className={cIdx === 0 ? "font-semibold text-slate-200" : ""}>
                {col}
              </div>
            ))}
          </div>
        );
      }
      // Default paragraphs
      if (linha.trim() === "") return <div key={index} className="h-2" />;
      return (
        <p key={index} className="text-xs text-slate-300 leading-relaxed mb-2 font-sans">
          {processarNegritos(linha)}
        </p>
      );
    });
  };

  const processarNegritos = (txt: string) => {
    const partes = txt.split(/\*\*(.*?)\*\*/g);
    return partes.map((p, idx) => (idx % 2 === 1 ? <strong key={idx} className="text-indigo-200 font-semibold">{p}</strong> : p));
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl shadow-slate-950/20" id="ai-counselor-panel">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-950 border border-indigo-800 p-2 rounded-xl text-indigo-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5 font-sans">
              Conselheiro de IA para Escola Rígida
            </h3>
            <p className="text-xs text-slate-400">
              Auditor e preditor inteligente para conter evasões e otimizar ativos escolares
            </p>
          </div>
        </div>
        
        {/* Status of AI Key */}
        <div className="text-xs font-mono text-slate-400 px-3 py-1 rounded bg-slate-950 border border-slate-800/80 flex items-center gap-1.5 self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Sugerido: Gemini 3.5 Flash</span>
        </div>
      </div>

      {/* Buttons quick contexts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <button
          onClick={() => carregarAnalise("geral")}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-medium cursor-pointer transition-all duration-150 text-left ${
            activeContext === "geral"
              ? "bg-indigo-950/40 border-indigo-700 text-indigo-300 shadow-sm"
              : "bg-slate-950/20 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-900/40"
          }`}
        >
          <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <div className="font-bold">Diagnóstico Geral</div>
            <div className="text-[10px] text-slate-400 leading-none mt-1">Visão holística escolar</div>
          </div>
        </button>

        <button
          onClick={() => carregarAnalise("evasao")}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-medium cursor-pointer transition-all duration-150 text-left ${
            activeContext === "evasao"
              ? "bg-rose-950/40 border-rose-700 text-rose-300 shadow-sm"
              : "bg-slate-950/20 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-900/40"
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <div>
            <div className="font-bold">Alerta de Evasão</div>
            <div className="text-[10px] text-slate-400 leading-none mt-1">Intervenção precoce</div>
          </div>
        </button>

        <button
          onClick={() => carregarAnalise("ocupacao")}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-medium cursor-pointer transition-all duration-150 text-left ${
            activeContext === "ocupacao"
              ? "bg-blue-950/40 border-blue-700 text-blue-300 shadow-sm"
              : "bg-slate-950/20 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-900/40"
          }`}
        >
          <BarChart3 className="w-4 h-4 text-blue-400 shrink-0" />
          <div>
            <div className="font-bold">Distribuição Docente</div>
            <div className="text-[10px] text-slate-400 leading-none mt-1">Salas e tempo ocioso</div>
          </div>
        </button>

        <button
          onClick={() => carregarAnalise("investimento")}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-medium cursor-pointer transition-all duration-150 text-left ${
            activeContext === "investimento"
              ? "bg-emerald-950/40 border-emerald-700 text-emerald-300 shadow-sm"
              : "bg-slate-950/20 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-900/40"
          }`}
        >
          <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold">Auditoria de Custos</div>
            <div className="text-[10px] text-slate-400 leading-none mt-1">CAPEX vs OPEX Ativos</div>
          </div>
        </button>
      </div>

      {/* Custom query input */}
      <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-2xl flex flex-col md:flex-row gap-2 mb-6">
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Digite dúvidas de auditoria ou cenários... (Ex: 'Me liste quais são as manutenções com prioridade Alta e como equilibrar os custos')"
          className="bg-transparent text-slate-100 placeholder-slate-500 text-xs px-3 py-2.5 outline-none flex-1 focus:ring-1 focus:ring-slate-700 rounded-lg"
          onKeyDown={(e) => {
            if (e.key === "Enter" && customPrompt.trim() !== "") {
              carregarAnalise("especifica", customPrompt);
            }
          }}
        />
        <button
          onClick={() => {
            if (customPrompt.trim() !== "") {
              carregarAnalise("especifica", customPrompt);
            }
          }}
          disabled={loading || customPrompt.trim() === ""}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white disabled:text-slate-500 px-4 py-2.5 rounded-xl text-xs font-bold font-sans cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 shrink-0"
        >
          {loading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          Lançar Consulta
        </button>
      </div>

      {/* Analysis Results Screen of BI */}
      <div className="min-h-48 rounded-xl border border-slate-800/80 bg-slate-950 p-5 font-sans relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
            <div className="relative">
              <div className="w-10 h-10 border-2 border-indigo-950 border-t-indigo-500 rounded-full animate-spin"></div>
              <Sparkles className="w-4 h-4 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="text-center">
              <span className="text-xs font-bold text-slate-200">Scolarise AI Engine Compilando...</span>
              <p className="text-[10px] text-slate-400 mt-1 max-w-xs px-4">
                Cruzando presenças detalhadas com logs de segurança e dados orçamentários da escola.
              </p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-950/20 border border-rose-900 rounded-xl p-4 text-rose-300 text-xs leading-relaxed">
            <h5 className="font-bold mb-1 flex items-center gap-1.5 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              Falha ao Processar Inteligência de Negócio
            </h5>
            <p>{errorMsg}</p>
            <p className="mt-2 text-[10px] text-rose-500">
              Para testar com inteligência real do Gemini do Google, adicione uma chave de API válida nas configurações globais em Secrets de seu painel do AI Studio.
            </p>
          </div>
        )}

        {!analise && !loading && !errorMsg && (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-950/20">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 text-lg font-bold mb-3">
              💡
            </div>
            <span className="text-xs font-bold text-slate-300">Nenhuma auditoria iniciada</span>
            <p className="text-[10px] text-slate-500 mt-1 max-w-sm">
              Selecione um botão acima (como o de <strong>Alerta de Evasão</strong> ou <strong>Auditoria de Custos</strong>) para que o co-piloto analise os dados em tempo real.
            </p>
          </div>
        )}

        {analise && (
          <div className="animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span className="text-xs font-bold font-mono text-indigo-300 uppercase tracking-wide">
                  Relatório Analítico de Controle Rígido ({activeContext})
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(analise);
                }}
                className="text-[10px] text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-2 py-1 rounded cursor-pointer"
              >
                Copiar Texto
              </button>
            </div>
            
            <div className="space-y-1 overflow-y-auto max-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {formatarRelatorioMarkdown(analise)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
