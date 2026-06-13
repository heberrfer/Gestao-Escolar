import React, { useState, useEffect } from "react";
import { UserRole, UserProfile, AlunoData, AtivoManutencao, Investimento, RegistroAuditoria, RegistroPresenca, Sala, Turma } from "./types";
import { Header } from "./components/Header";
import { Login } from "./components/Login";
import { AICounselor } from "./components/AICounselor";
import { DirectorView } from "./components/DirectorView";
import { CoordinatorView } from "./components/CoordinatorView";
import { InstructorView } from "./components/InstructorView";
import { StudentView } from "./components/StudentView";
import { MOCK_ALUNOS, LISTA_SALAS, LISTA_TURMAS, MOCK_MANUTENCOES, MOCK_INVESTIMENTOS, HISTORICO_AUDITORIA, REGISTROS_PRESENCA_INICIAIS, estatisticasGlobais } from "./data/mockData";
import { Shield, Sparkles, Check, Database, HelpCircle, HardDrive, Key, AlertTriangle, Link2, Copy, Play, ArrowRight, RotateCw } from "lucide-react";
import { checkSupabaseConnection } from "./supabaseClient";
import { SUPABASE_SQL_CODE } from "./data/supabaseSqlCode";
import {
  fetchSalas,
  fetchAlunos,
  fetchTurmas,
  fetchManutencoes,
  fetchInvestimentos,
  fetchRegistrosPresenca,
  fetchLogs,
  upsertAluno,
  upsertManutencao,
  upsertPresenca,
  insertLog
} from "./data/supabaseSync";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>("diretor");
  
  // Supabase connection state
  const [supabaseStatus, setSupabaseStatus] = useState<"connecting" | "connected" | "pending_tables" | "error">("connecting");
  const [supabaseMsg, setSupabaseMsg] = useState<string>("Iniciando conexão com o Supabase...");
  const [sqlCopied, setSqlCopied] = useState<boolean>(false);
  const [showSqlCode, setShowSqlCode] = useState<boolean>(false);

  
  // Simulated Logged Profile details
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: "usr_heber",
    nome: "Heber Ferreira",
    role: "diretor",
    email: "heber.ferreira@docente.senai.br",
    detalheAdicional: "Diretor Principal"
  });

  // State engines for our 600-student school contexts
  const [alunos, setAlunos] = useState<AlunoData[]>(MOCK_ALUNOS);
  const [salas, setSalas] = useState<Sala[]>(LISTA_SALAS);
  const [turmas, setTurmas] = useState<Turma[]>(LISTA_TURMAS);
  const [manutencoes, setManutencoes] = useState<AtivoManutencao[]>(MOCK_MANUTENCOES);
  const [investimentos, setInvestimentos] = useState<Investimento[]>(MOCK_INVESTIMENTOS);
  const [historicoLogs, setHistoricoLogs] = useState<RegistroAuditoria[]>(HISTORICO_AUDITORIA);
  const [registrosPresenca, setRegistrosPresenca] = useState<RegistroPresenca[]>(REGISTROS_PRESENCA_INICIAIS);
  const [estatisticas, setEstatisticas] = useState(estatisticasGlobais);

  // Sincronização e verificação do Supabase
  const inicializarSupabase = async () => {
    setSupabaseStatus("connecting");
    setSupabaseMsg("Verificando e sincronizando registros do Supabase em tempo real...");
    try {
      const check = await checkSupabaseConnection();
      if (!check.ok) {
        setSupabaseStatus("error");
        setSupabaseMsg(check.message);
        return;
      }

      if (check.tablesMissing) {
        setSupabaseStatus("pending_tables");
        setSupabaseMsg("Conectado ao Supabase com sucesso! Porém, as tabelas ainda não existem. Carregue o script SQL fornecido para ativar o banco.");
        return;
      }

      const [dbSalas, dbAlunos, dbTurmas, dbManutencoes, dbInvestimentos, dbPresencas, dbLogs] = await Promise.all([
        fetchSalas(),
        fetchAlunos(),
        fetchTurmas(),
        fetchManutencoes(),
        fetchInvestimentos(),
        fetchRegistrosPresenca(),
        fetchLogs()
      ]);

      if (dbSalas && dbSalas.length > 0) setSalas(dbSalas);
      if (dbAlunos && dbAlunos.length > 0) {
        setAlunos(dbAlunos);
        
        // Re-computar estatísticas básicas baseadas nos dados do banco
        const totalAlunos = dbAlunos.length;
        const somaFreq = dbAlunos.reduce((acc, current) => acc + current.frequênciaGeral, 0);
        const freqMedia = totalAlunos > 0 ? Number((somaFreq / totalAlunos).toFixed(1)) : 81.2;
        const riscoAlto = dbAlunos.filter(a => a.statusEvasao === "Preocupante").length;
        const riscoMedio = dbAlunos.filter(a => a.statusEvasao === "Alerta").length;
        
        setEstatisticas(prev => ({
          ...prev,
          frequenciaMediaEscola: freqMedia,
          alunosRiscoEvasaoAlto: riscoAlto,
          alunosRiscoEvasaoMedio: riscoMedio,
        }));
      }
      if (dbTurmas && dbTurmas.length > 0) setTurmas(dbTurmas);
      if (dbManutencoes && dbManutencoes.length > 0) setManutencoes(dbManutencoes);
      if (dbInvestimentos && dbInvestimentos.length > 0) setInvestimentos(dbInvestimentos);
      if (dbPresencas && dbPresencas.length > 0) setRegistrosPresenca(dbPresencas);
      if (dbLogs && dbLogs.length > 0) setHistoricoLogs(dbLogs);

      setSupabaseStatus("connected");
      setSupabaseMsg("Scolarise conectado à infraestrutura de PostgreSQL do Supabase!");
    } catch (err: any) {
      console.warn("Falha de leitura do Supabase (as tabelas podem precisar ser criadas):", err);
      setSupabaseStatus("error");
      setSupabaseMsg("Erro de sincronização. Execute o script de criação de tabelas SQL no editor do Supabase.");
    }
  };

  useEffect(() => {
    inicializarSupabase();
  }, []);

  // App notification toasts state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "warning">("success");

  const showToast = (msg: string, type: "success" | "warning" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Switch role context dynamically by logging out first to require credential input
  const handleChangeRole = (role: UserRole) => {
    setIsLoggedIn(false);
    setCurrentRole(role);
    
    // Switch logged user info placeholder to preparation for the login field
    if (role === "diretor") {
      setCurrentUser({
        id: "usr_heber",
        nome: "Heber Ferreira",
        role: "diretor",
        email: "heber.ferreira@docente.senai.br",
        detalheAdicional: "Diretor Principal"
      });
    } else if (role === "coordenador") {
      setCurrentUser({
        id: "usr_coord",
        nome: "Coordenador Geral G-S",
        role: "coordenador",
        email: "coord.geral@senai.br",
        detalheAdicional: "Coordenação Geral"
      });
    } else if (role === "instrutor") {
      setCurrentUser({
        id: "prof_marcos",
        nome: "Marcos Vinícius Santos",
        role: "instrutor",
        email: "marcos.santos@docente.senai.br",
        detalheAdicional: "Professor Titular de Programação"
      });
    } else if (role === "aluno") {
      setCurrentUser({
        id: "AL_01",
        nome: "Lucas Souza Camargo",
        role: "aluno",
        email: "lucas.camargo@aluno.senai.br",
        detalheAdicional: "Matrícula: ALU2026-0032"
      });
    }
    
    showToast(`Para acessar o nível "${role}", por favor faça autenticação com as credenciais indicadas.`, "warning");
  };

  const handleLoginSuccess = (role: UserRole, profile: UserProfile) => {
    setCurrentRole(role);
    setCurrentUser(profile);
    setIsLoggedIn(true);
    showToast(`Autenticação aprovada como ${role === "diretor" ? "Diretor" : role === "coordenador" ? "Coordenador" : role === "instrutor" ? "Instrutor" : "Aluno"}!`, "success");
    
    // Log the successful login audit
    // Access is allowed under the specific module log
    const novoLog: RegistroAuditoria = {
      id: `LOG_${Date.now().toString().slice(-4)}`,
      usuarioNome: profile.nome,
      usuarioRole: role,
      acaoDescricao: `Login efetuado com sucesso via formulário de autenticação. Nível: ${role}`,
      timestamp: new Date().toISOString(),
      moduloReferencia: "Acesso",
    };
    setHistoricoLogs((prev) => [novoLog, ...prev]);
    if (supabaseStatus === "connected") {
      insertLog(novoLog).catch(err => console.warn("Erro ao registrar log no Supabase:", err));
    }
  };

  // Helper: Append Audit Logs
  const handleAdicionarAuditoriaLog = (
    mensagem: string,
    modulo: "Frequência" | "Financeiro" | "Manutenção" | "Grade Horária" | "Acesso"
  ) => {
    const novoLog: RegistroAuditoria = {
      id: `LOG_${Date.now().toString().slice(-4)}`,
      usuarioNome: currentUser.nome,
      usuarioRole: currentRole,
      acaoDescricao: mensagem,
      timestamp: new Date().toISOString(),
      moduloReferencia: modulo,
    };
    setHistoricoLogs((prev) => [novoLog, ...prev]);

    if (supabaseStatus === "connected") {
      insertLog(novoLog).catch(err => {
        console.warn("Erro ao salvar log no Supabase:", err);
      });
    }
  };

  // Handler: Action warning for dropout risk / parent notifications
  const handleTriggerWarning = (alunoId: string, tipo: string) => {
    const target = alunos.find((a) => a.id === alunoId);
    if (!target) return;

    if (tipo === "notificar_responsavel") {
      showToast(`Pais de ${target.nome} notificados com sucesso.`);
      handleAdicionarAuditoriaLog(
        `Acionou canal de e-mail e SMS para a responsável (${target.nomeResponsavel}) do aluno Lucas Souza Camargo. Alerta: faltas recorrentes e risco financeiro.`,
        "Financeiro"
      );
    } else {
      showToast(`Entrevista pedagógica agendada.`);
      handleAdicionarAuditoriaLog(
        `Agendou reunião de prevenção de evasão obrigatória entre coordenação e o aluno ${target.nome} para os próximos 3 dias letivos.`,
        "Grade Horária"
      );
    }
  };

  // Handler: Add Maintenance ticket
  const handleAdicionarManutencao = (novaOS: AtivoManutencao) => {
    setManutencoes((prev) => [novaOS, ...prev]);
    showToast(`Ordem de serviço ${novaOS.id} aberta com sucesso!`);
    handleAdicionarAuditoriaLog(
      `Cadastrou nova Ordem de Serviço (${novaOS.id}) para reparo do ativo: ${novaOS.item} em: ${novaOS.localNome}. Custo preliminar: R$ ${novaOS.custo.toFixed(2)}`,
      "Manutenção"
    );

    if (supabaseStatus === "connected") {
      upsertManutencao(novaOS).catch(err => {
        console.warn("Erro ao cadastrar manutenção no Supabase:", err);
      });
    }
  };

  // Handler: Complete Maintenance Order
  const handleConcluirManutencao = (id: string, custoFinal: number) => {
    let itemConcluido: AtivoManutencao | undefined;
    
    setManutencoes((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const res = { ...m, status: "concluido" as const, dataResolucao: new Date().toISOString().split("T")[0] };
          itemConcluido = res;
          return res;
        }
        return m;
      })
    );

    // Dynamic budgeting adjustments (re-allocating OPEX expenses)
    setEstatisticas((prev) => ({
      ...prev,
      gastoAcumuladoOPEX: prev.gastoAcumuladoOPEX + custoFinal,
    }));

    showToast(`Ticket ${id} resolvido. Valor adicionado aos gastos operacionais (OPEX).`);
    handleAdicionarAuditoriaLog(
      `Deu baixa (concluiu) na Ordem de Manutenção de ID: ${id}. Custos de OPEX debitados do orçamento institucional no valor de: R$ ${custoFinal.toFixed(2)}`,
      "Manutenção"
    );

    if (supabaseStatus === "connected" && itemConcluido) {
      upsertManutencao(itemConcluido).catch(err => {
        console.warn("Erro ao concluir manutenção no Supabase:", err);
      });
    }
  };

  // Handler: Save Attendance lists (Roll Call) and recalculate Student percentages
  const handleGravarFrequencia = (
    fPayload: { alunoId: string; status: "presente" | "ausente" | "justificado"; justificativa?: string }[],
    turmaId: string,
    dataSelecionada: string,
    retroactiveBypass: boolean
  ) => {
    const novasPresencas: RegistroPresenca[] = [];
    
    fPayload.forEach((item) => {
      // Find previous or insert new
      const idExistente = registrosPresenca.find(
        (rp) => rp.alunoId === item.alunoId && rp.turmaId === turmaId && rp.data === dataSelecionada
      )?.id;

      const reg: RegistroPresenca = {
        id: idExistente || `PRES_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        alunoId: item.alunoId,
        alunoNome: alunos.find((a) => a.id === item.alunoId)?.nome || "Aluno",
        turmaId,
        turmaNome: turmas.find((t) => t.id === turmaId)?.nome || "Turma",
        data: dataSelecionada,
        status: item.status,
        justificativa: item.justificativa,
        registradoPor: currentUser.nome,
        dataLançamento: new Date().toISOString(),
        bloqueadoRetroativo: true,
      };
      
      novasPresencas.push(reg);
    });

    // Merge in existing records
    setRegistrosPresenca((prev) => {
      const filtrados = prev.filter(
        (rp) => !(rp.turmaId === turmaId && rp.data === dataSelecionada)
      );
      return [...filtrados, ...novasPresencas];
    });

    // RE-CALCULATE STUDENTS DETAILED FREQUENCY ON STATE CHANGE (High intelligence feature)
    // Map total presence, absences, and calculate actual percentage
    const updatedAlunosList: AlunoData[] = [];
    setAlunos((prevAlunos) => {
      const mapped = prevAlunos.map((aluno) => {
        const itemPayload = fPayload.find((p) => p.alunoId === aluno.id);
        if (!itemPayload) return aluno;

        // Fetch detailed statistics
        const detObj = { ...aluno.presencasDetalhadas };
        if (detObj[turmaId]) {
          const det = detObj[turmaId];
          // We recalculate by comparing with the previous state or altering incrementally
          // Let's increment classes total count by 1 if there was no attendance registered for this date yet
          const dataJaTinhaRegistro = registrosPresenca.some(
            (rp) => rp.alunoId === aluno.id && rp.turmaId === turmaId && rp.data === dataSelecionada
          );

          if (!dataJaTinhaRegistro) {
            det.aulasTotais += 1;
          }

          // Gather original status before update if there was one
          const regAnterior = registrosPresenca.find(
            (rp) => rp.alunoId === aluno.id && rp.turmaId === turmaId && rp.data === dataSelecionada
          );

          if (regAnterior) {
            // Revert previous tally
            if (regAnterior.status === "presente") det.presencas = Math.max(0, det.presencas - 1);
            if (regAnterior.status === "ausente") det.ausencias = Math.max(0, det.ausencias - 1);
            if (regAnterior.status === "justificado") det.justificadas = Math.max(0, det.justificadas - 1);
          }

          // Add new tally
          if (itemPayload.status === "presente") det.presencas += 1;
          if (itemPayload.status === "ausente") det.ausencias += 1;
          if (itemPayload.status === "justificado") det.justificadas += 1;
        }

        // Calculate global frequency across all classes
        let totalAulasGlobal = 0;
        let presencasGlobal = 0;
        
        Object.keys(detObj).forEach((tk) => {
          totalAulasGlobal += detObj[tk].aulasTotais;
          presencasGlobal += detObj[tk].presencas;
        });

        const novaFrequenciaTotal = totalAulasGlobal > 0 ? (presencasGlobal / totalAulasGlobal) * 100 : 100;
        
        // Evasion warning category
        let regStatusEvasao = aluno.statusEvasao;
        if (novaFrequenciaTotal < 75) {
          regStatusEvasao = "Preocupante";
        } else if (novaFrequenciaTotal >= 75 && novaFrequenciaTotal < 85) {
          regStatusEvasao = "Alerta";
        } else {
          regStatusEvasao = "Estável";
        }

        const res = {
          ...aluno,
          presencasDetalhadas: detObj,
          frequênciaGeral: Math.round(novaFrequenciaTotal * 10) / 10,
          statusEvasao: regStatusEvasao as any,
        };
        updatedAlunosList.push(res);
        return res;
      });

      // Synchronize in background if Supabase is connected
      if (supabaseStatus === "connected") {
        Promise.all([
          ...novasPresencas.map(p => upsertPresenca(p)),
          ...updatedAlunosList.map(a => upsertAluno(a))
        ]).catch(err => {
          console.warn("Erro de sincronização de frequência com o Supabase:", err);
        });
      }

      return mapped;
    });

    showToast(`Presenças salvas com sucesso!`);
    handleAdicionarAuditoriaLog(
      `Atualizou diário de frequência da turma de ID: ${turmaId} para o dia: ${dataSelecionada}. Presenças registradas rigorosamente. ${
        retroactiveBypass ? "(CHAVE RETROATIVA AUTORIZADA)" : ""
      }`,
      "Frequência"
    );
  };

  // Provide combined school metrics for AI analytics
  const dadosParaIA = {
    estatisticasGlobais: estatisticas,
    salas,
    turmas,
    alunos,
    manutencoes,
    investimentos,
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans antialiased pb-12 selection:bg-indigo-500 selection:text-white">
      {/* Header component */}
      <Header currentRole={currentRole} onChangeRole={handleChangeRole} currentUser={currentUser} onLogout={() => setIsLoggedIn(false)} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 mt-6 space-y-6">
        
        {/* Strict Role Access warning Banner */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-sans">Visualização Atual Autenticada</p>
              <h3 className="text-sm font-bold text-white font-sans uppercase tracking-wide">
                Nível: {currentRole} — {currentUser.nome}
              </h3>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono bg-slate-950/50 px-3 py-2 rounded-xl border border-slate-800/80">
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>Row-Level Security (RLS) Ativo</span>
            </div>
            
            <div className={`flex items-center gap-2 text-[10px] font-mono bg-slate-950/50 px-3 py-2 rounded-xl border ${
              supabaseStatus === "connected" ? "border-emerald-500/30 text-emerald-400" :
              supabaseStatus === "pending_tables" ? "border-amber-500/30 text-amber-400 font-semibold" :
              supabaseStatus === "connecting" ? "border-cyan-500/30 text-cyan-400" :
              "border-rose-500/30 text-rose-400"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                supabaseStatus === "connected" ? "bg-emerald-400 animate-pulse" :
                supabaseStatus === "pending_tables" ? "bg-amber-400 animate-bounce" :
                supabaseStatus === "connecting" ? "bg-cyan-400 animate-pulse" :
                "bg-rose-400"
              }`} />
              <span>
                Supabase: {
                  supabaseStatus === "connected" ? "Sincronizado" :
                  supabaseStatus === "pending_tables" ? "Tabelas Pendentes" :
                  supabaseStatus === "connecting" ? "Conectando..." :
                  "Sem Conexão"
                }
              </span>
            </div>
          </div>
        </div>

        {/* Supabase Connection Helper Banner & Automated Assistant */}
        {supabaseStatus !== "connected" && (
          <div className={`p-6 border rounded-2xl ${
            supabaseStatus === "pending_tables" 
              ? "bg-amber-950/20 border-amber-500/30 text-amber-200" 
              : "bg-slate-900/90 border-slate-800 text-slate-300"
          } space-y-4 shadow-xl`}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  supabaseStatus === "pending_tables" 
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                    : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                }`}>
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-white flex items-center gap-2">
                    {supabaseStatus === "pending_tables" ? "⚡ Banco Conectado, mas as Tabelas Estão Vazias!" : "⚠️ Integração Supabase Pendente"}
                    <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded font-normal text-slate-400">PostgreSQL</span>
                  </h3>
                  <p className="text-xs mt-1 leading-relaxed opacity-85">
                    {supabaseStatus === "pending_tables" ? (
                      <span>
                        Seu cliente conectou ao banco remoto Supabase! No entanto, as tabelas do <strong>Scolarise</strong> ainda não foram ativadas no banco Postgres. Faça as tabelas funcionarem instantaneamente usando as etapas abaixo.
                      </span>
                    ) : (
                      <span>
                        O banco remoto Supabase ainda não está ativo no ambiente do aplicativo. O sistema está rodando em modo simulação local offline. Você pode ativar persistência em nuvem a qualquer momento.
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Control Buttons header */}
              <div className="flex flex-wrap items-center gap-2 md:flex-shrink-0">
                <button
                  type="button"
                  id="btn_recheck_supabase"
                  onClick={inicializarSupabase}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-mono text-white transition-all cursor-pointer font-medium"
                >
                  <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                  Re-verificar Conexão
                </button>
                <button
                  type="button"
                  id="btn_ignore_supabase"
                  onClick={() => {
                    setSupabaseStatus("connected");
                    showToast("Modo de Simulação de Banco Ativado!", "success");
                    handleAdicionarAuditoriaLog(
                      "Diretoria mudou para modo de dados simulado no console.",
                      "Acesso"
                    );
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-all cursor-pointer font-medium"
                >
                  Simular Offline
                </button>
              </div>
            </div>

            {/* Steps Guide specifically designed to answer 'Do it for me' */}
            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/60 grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-1 bg-slate-900/40 p-3 rounded-lg border border-slate-800/30">
                <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-xs text-indigo-400 font-mono font-bold">1</div>
                <p className="text-xs font-bold text-white">Copiar Script</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Clique no botão de cópia abaixo para obter o código SQL estruturado.</p>
                <button
                  type="button"
                  id="btn_copy_sql_assistant"
                  onClick={() => {
                    navigator.clipboard.writeText(SUPABASE_SQL_CODE);
                    setSqlCopied(true);
                    showToast("Script SQL de configuração copiado para área de transferência!");
                    setTimeout(() => setSqlCopied(false), 3000);
                  }}
                  className={`mt-2 flex items-center justify-center gap-1.5 w-full py-1.5 px-2 rounded-lg text-xs font-mono transition-all font-semibold cursor-pointer ${
                    sqlCopied ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  {sqlCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {sqlCopied ? "Copiado!" : "Copiar SQL"}
                </button>
              </div>

              <div className="space-y-1 bg-slate-900/40 p-3 rounded-lg border border-slate-800/30">
                <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xs text-cyan-400 font-mono font-bold">2</div>
                <p className="text-xs font-bold text-white">Ir ao Supabase</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Visite o console do seu projeto no Supabase clicando no botão externo abaixo.</p>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  referrerPolicy="no-referrer"
                  className="mt-2 flex items-center justify-center gap-1.5 w-full py-1.5 px-2 rounded-lg text-xs font-mono bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all font-semibold"
                >
                  <Link2 className="w-3.5 h-3.5 text-cyan-500" />
                  Abrir Console
                </a>
              </div>

              <div className="space-y-1 bg-slate-900/40 p-3 rounded-lg border border-slate-800/30">
                <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xs text-amber-400 font-mono font-bold">3</div>
                <p className="text-xs font-bold text-white">Criar Query</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">No menu lateral esquerdo do Supabase, clique em <strong>SQL Editor</strong> e então em <strong>"New Query"</strong>.</p>
              </div>

              <div className="space-y-1 bg-slate-900/40 p-3 rounded-lg border border-slate-800/30">
                <div className="w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-xs text-purple-400 font-mono font-bold">4</div>
                <p className="text-xs font-bold text-white">Colar e Rodar</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Cole todo o script SQL copiado na caixa de texto e clique no botão verde <strong>"Run"</strong> (Executar).</p>
              </div>

              <div className="space-y-1 bg-slate-900/40 p-3 rounded-lg border border-slate-800/30 flex flex-col justify-between">
                <div>
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs text-emerald-400 font-mono font-bold">5</div>
                  <p className="text-xs font-bold text-white">Re-verificar</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">Após rodar o script SQL lá, volte para este portal e clique em Re-verificar para baixar os dados.</p>
                </div>
                <button
                  type="button"
                  id="btn_recheck_step5"
                  onClick={inicializarSupabase}
                  className="mt-2 flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[11px] font-bold py-1.5 px-2 rounded-lg cursor-pointer"
                >
                  <RotateCw className="w-3 h-3 text-white" />
                  Pronto! Re-verificar
                </button>
              </div>
            </div>

            {/* Toggle Code script view */}
            <div className="pt-2">
              <button
                type="button"
                id="btn_toggle_sql_preview"
                onClick={() => setShowSqlCode(!showSqlCode)}
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300 underline underline-offset-4 cursor-pointer flex items-center gap-1"
              >
                {showSqlCode ? "Esconder Script SQL de criação das tabelas" : "Visualizar todo o Script SQL que será copiado"}
              </button>

              {showSqlCode && (
                <div className="mt-3 bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-[10px] font-mono leading-relaxed max-h-48 overflow-y-auto text-slate-400">
                  <pre className="whitespace-pre-wrap">{SUPABASE_SQL_CODE}</pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Global School AI Advise panel - Available for decision making roles (or all) */}
        <AICounselor dadosParaIA={dadosParaIA} />

        {/* Dynamic Role Dashboard render */}
        <section className="bg-slate-950 space-y-4">
          {currentRole === "diretor" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
                  MÓDULO ESTRATÉGICO INSTITUCIONAL
                </span>
                <span className="text-[10px] text-slate-500 font-mono uppercase">
                  Nível de Acesso: Diretor Geral
                </span>
              </div>
              <DirectorView
                estatisticas={estatisticas}
                salas={salas}
                investimentos={investimentos}
                historicoLogs={historicoLogs}
              />
            </div>
          )}

          {currentRole === "coordenador" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
                  MÓDULO DE COORDENAÇÃO TÁTICA
                </span>
                <span className="text-[10px] text-slate-500 font-mono uppercase">
                  Nível de Acesso: Coordenador Pedagógico
                </span>
              </div>
              <CoordinatorView
                alunos={alunos}
                turmas={turmas}
                manutencoes={manutencoes}
                onTriggerWarning={handleTriggerWarning}
                onAdicionarManutencao={handleAdicionarManutencao}
                onConcluirManutencao={handleConcluirManutencao}
              />
            </div>
          )}

          {currentRole === "instrutor" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
                  MÓDULO DE EXECUÇÃO PEDAGÓGICA (DOCÊNCIA)
                </span>
                <span className="text-[10px] text-slate-500 font-mono uppercase">
                  Nível de Acesso: Instrutor Autorizado
                </span>
              </div>
              <InstructorView
                turmas={turmas}
                alunos={alunos}
                registrosPresenca={registrosPresenca}
                onGravarFrequencia={handleGravarFrequencia}
                onAdicionarAuditoriaLog={handleAdicionarAuditoriaLog}
              />
            </div>
          )}

          {currentRole === "aluno" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
                  DIÁRIO DO ALUNO E AUTOATENDIMENTO
                </span>
                <span className="text-[10px] text-slate-500 font-mono uppercase">
                  Nível de Acesso: Aluno Devidamente Regular
                </span>
              </div>
              <StudentView
                alunoCorrente={alunos.find((a) => a.id === "AL_01") || alunos[0]}
                onAdicionarManutencao={handleAdicionarManutencao}
              />
            </div>
          )}
        </section>
      </main>

      {/* Interactive App toast message popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl flex items-center gap-3 max-w-sm text-slate-100">
            <div className="bg-emerald-950 text-emerald-400 p-2 rounded-xl border border-emerald-900/60 font-bold text-xs shrink-0">
              ✓
            </div>
            <div>
              <p className="text-xs font-bold font-sans">Controle Rígido Escolar</p>
              <p className="text-[11px] text-slate-400 leading-normal">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
