import React, { useState } from "react";
import { UserRole, UserProfile } from "../types";
import { Shield, Key, Mail, AlertCircle, Eye, EyeOff, Sparkles, Check } from "lucide-react";

interface LoginProps {
  onLoginSuccess: (role: UserRole, profile: UserProfile) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Suggested test accounts to optimize user evaluation flow
  const testAccounts = [
    {
      role: "diretor" as UserRole,
      label: "Diretor (Heber Ferreira)",
      username: "heber.ferreira@docente.senai.br",
      password: "senai",
      desc: "Visão estratégica, ROI institucional e relatórios de auditoria financeira.",
      colors: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
    },
    {
      role: "coordenador" as UserRole,
      label: "Coordenador (Gestão Escolar)",
      username: "coord.geral@senai.br",
      password: "senai",
      desc: "Painel de riscos de evasão, monitoramento pedagógico e OS de salas.",
      colors: "bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
    },
    {
      role: "instrutor" as UserRole,
      label: "Instrutor (Professor Marcos)",
      username: "marcos.santos@docente.senai.br",
      password: "senai",
      desc: "Fechamento de diário de classe, chamada instantânea e ordem de serviços.",
      colors: "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
    },
    {
      role: "aluno" as UserRole,
      label: "Aluno (Lucas Camargo)",
      username: "lucas.camargo@aluno.senai.br",
      password: "senai",
      desc: "Consulta de frequência própria, boletim geral e solicitação de TI/Cadeiras.",
      colors: "bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
    }
  ];

  const handleQuickSelect = (acc: typeof testAccounts[0]) => {
    setUsername(acc.username);
    setPassword(acc.password);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    // Match the entered credentials against our defined system accounts
    const match = testAccounts.find(
      (acc) =>
        (acc.username.toLowerCase() === username.trim().toLowerCase() ||
         acc.role === username.trim().toLowerCase()) &&
        acc.password === password
    );

    if (match) {
      if (match.role === "diretor") {
        onLoginSuccess("diretor", {
          id: "usr_heber",
          nome: "Heber Ferreira",
          role: "diretor",
          email: "heber.ferreira@docente.senai.br",
          detalheAdicional: "Diretor Principal"
        });
      } else if (match.role === "coordenador") {
        onLoginSuccess("coordenador", {
          id: "usr_coord",
          nome: "Coordenador Geral G-S",
          role: "coordenador",
          email: "coord.geral@senai.br",
          detalheAdicional: "Coordenação Geral"
        });
      } else if (match.role === "instrutor") {
        onLoginSuccess("instrutor", {
          id: "prof_marcos",
          nome: "Marcos Vinícius Santos",
          role: "instrutor",
          email: "marcos.santos@docente.senai.br",
          detalheAdicional: "Professor Titular de Programação"
        });
      } else if (match.role === "aluno") {
        onLoginSuccess("aluno", {
          id: "AL_01",
          nome: "Lucas Souza Camargo",
          role: "aluno",
          email: "lucas.camargo@aluno.senai.br",
          detalheAdicional: "Matrícula: ALU2026-0032"
        });
      }
    } else {
      setError("Usuário ou senha incorretos. Dica: Use os atalhos de contas abaixo.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-indigo-500 selection:text-white" id="login-container">
      {/* Background radial effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 space-y-6">
        {/* Header Logo & Title */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-950/50">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white font-sans flex items-center justify-center gap-1.5">
              Portal Scolarise <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 font-mono border border-indigo-900/40">v2.1</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Controle de Acesso Rígido por Níveis & RLS PostgreSQL
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-pulse">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold block">
              E-mail ou Usuário
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                id="login_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: diretor ou lucas.camargo@aluno.senai.br"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold block">
              Senha de Acesso
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                id="login_password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ex: senai"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
              />
              <button
                type="button"
                id="btn_toggle_login_password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            id="btn_login_submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-lg hover:shadow-indigo-900/20 active:scale-[0.99] cursor-pointer"
          >
            Entrar no Sistema
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800/80"></div>
          <span className="flex-shrink mx-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
            Selecione uma conta para teste
          </span>
          <div className="flex-grow border-t border-slate-800/80"></div>
        </div>

        {/* Quick test accounts cards */}
        <div className="grid grid-cols-1 gap-2">
          {testAccounts.map((acc) => {
            const isSelected = username.toLowerCase() === acc.username || username.toLowerCase() === acc.role;
            return (
              <button
                key={acc.role}
                type="button"
                id={`btn_test_acc_${acc.role}`}
                onClick={() => handleQuickSelect(acc)}
                className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${acc.colors} ${
                  isSelected ? "ring-2 ring-indigo-500 bg-indigo-500/5" : "bg-slate-950/40 border-slate-800/60"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    {acc.label}
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </span>
                  <span className="text-[9px] font-mono opacity-60 bg-slate-950 px-1.5 py-0.5 rounded text-slate-400">
                    Senha: <strong className="text-white">{acc.password}</strong>
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-snug mt-1 opacity-90">
                  {acc.desc}
                </p>
              </button>
            );
          })}
        </div>

        <p className="text-center text-[10px] font-mono text-slate-500">
          * Em produção, as permissões são aplicadas via RLS na nuvem utilizando políticas de segurança do banco de dados remoto.
        </p>
      </div>
    </div>
  );
};
