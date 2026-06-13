import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client (from environment)
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } else {
    console.warn("Aviso: GEMINI_API_KEY não configurada. Funcionalidades de IA estarão limitadas.");
  }
} catch (err) {
  console.error("Erro ao inicializar o cliente Gemini:", err);
}

// API: Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// API: IA Analytics Advisor
app.post("/api/analise", async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const { dadosEscola, contextType } = req.body;

  if (!ai) {
    return res.status(503).json({
      error: "O serviço de Inteligência Artificial não está disponível no momento (Chave de API ausente). Por favor, verifique as configurações em Secrets.",
    });
  }

  try {
    let focusInstruction = "";
    if (contextType === "evasao") {
      focusInstruction = `Foque na análise preditiva de evasão (risk of dropout/churn), cruzando frequências baixas (< 75%) de alunos específicos com notas e alertando a coordenação. Sugira ações preventivas e contato com responsáveis imediatos.`;
    } else if (contextType === "ocupacao") {
      focusInstruction = `Foque na otimização de ocupação docente e ambiente (salas/laboratórios). Analise professores sub ou sobrecarregados e identifique horários/salas que possuem alta ociosidade ou conflito.`;
    } else if (contextType === "investimento") {
      focusInstruction = `Foque no planejamento inteligente de investimentos e auditoria financeira (CAPEX e OPEX). Avalie o custo por aluno baseado no balanço de manutenções preventivas/corretivas recentes e sugira otimização de custos para evitar gastos desnecessários com ativos frequentemente quebrados.`;
    } else {
      focusInstruction = `Forneça uma análise diagnóstica geral da saúde da escola (Scolarise Diagnostic Report) considerando frequência global, taxa de evasão crítica, ociosidade de ambientes, saúde financeira e prioridades urgentes de manutenção para os próximos trinta dias.`;
    }

    const prompt = `Você é o Conselheiro de IA do Scolarise, um sistema rígido de gerenciamento educacional.
Analise os dados estruturados abaixo e elabore um relatório inteligente de controle. Seu tom deve ser profissional, direto, analítico e de alto nível estratégico.

DADOS DA ESCOLA:
${JSON.stringify(dadosEscola, null, 2)}

INSTRUÇÃO DE FOCO:
${focusInstruction}

REQUISITOS DE FORMATAÇÃO:
- Responda em Português do Brasil (PT-BR).
- Use cabeçalhos claros, listas de pontos, tabelas compactas de recomendações e seções bem separadas estruturadas em Markdown.
- Evite explicações técnicas, mostre estimativas práticas baseadas nos dados fornecidos e ações diretas com "Quem responde pelo quê" (Diretoria, Coordenação ou Instrutores).
- Seja explícito e rígido para apoiar a política de contenção de erros da instituição.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ analise: response.text });
  } catch (error: any) {
    console.error("Erro ao chamar o Gemini:", error);
    res.status(500).json({ error: error.message || "Erro interno ao processar conselho de IA." });
  }
});

// Manipulador global de erros para garantir respostas JSON
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Erro global no Express:", err);
  res.status(err.status || err.statusCode || 500).json({
    error: err.message || "Erro interno do servidor.",
  });
});

// Configure Vite or Static Assets handling
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Scolarise Server] Executando em http://localhost:${PORT}`);
  });
}

setupVite().catch((error) => {
  console.error("Falha ao configurar servidor:", error);
});
