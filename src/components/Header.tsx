import React from "react";
import { UserRole, UserProfile } from "../types";
import { Shield, Eye, Database, HelpCircle, Key, LogOut, CheckCircle } from "lucide-react";

interface HeaderProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  currentUser: UserProfile;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onChangeRole, currentUser, onLogout }) => {
  const roles: { value: UserRole; label: string; desc: string; color: string }[] = [
    {
      value: "diretor",
      label: "Diretor",
      desc: "Visão estratégica, ROI, saúde financeira global e auditoria geral.",
      color: "border-emerald-500 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/40",
    },
    {
      value: "coordenador",
      label: "Coordenador",
      desc: "Visão tática, evasão escolar, ocupação docente/ambiente e prevenção.",
      color: "border-blue-500 text-blue-400 bg-blue-950/20 hover:bg-blue-950/40",
    },
    {
      value: "instrutor",
      label: "Instrutor",
      desc: "Visão operacional, registro de faltas rígido, plano de aula e reservas.",
      color: "border-amber-500 text-amber-400 bg-amber-950/20 hover:bg-amber-950/40",
    },
    {
      value: "aluno",
      label: "Aluno",
      desc: "Visão pessoal, frequência acumulada, notas e reporte de problemas.",
      color: "border-purple-500 text-purple-400 bg-purple-950/20 hover:bg-purple-950/40",
    },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 p-4 md:p-6 sticky top-0 z-30" id="scolarise-header">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {/* Top bar with Branding, Simulated Connection Profile */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-cyan-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-950/50">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-sans font-bold tracking-tight text-white flex items-center gap-2">
                Scolarise <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 font-mono border border-indigo-900">v2.1 RLS</span>
              </h1>
              <p className="text-xs text-slate-400 font-sans">
                Controle Rígido & Inteligência Analítica Escolar
              </p>
            </div>
          </div>

          {/* Database and User Badge */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Supabase connection profile indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 text-xs font-mono">
              <Database className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
              <span>ymihpnz...co</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
              <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center text-[10px] font-bold text-white">
                {currentUser.nome.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-slate-200">{currentUser.nome}</p>
                <p className="text-[10px] text-slate-400 font-mono">{currentUser.email}</p>
              </div>
            </div>

            <button
              id="btn-header-logout"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/50 text-rose-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        </div>

        {/* Role switching context selector */}
        <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-xl">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400 tracking-wider uppercase font-mono">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>Simulador de Níveis de Acesso (Segurança de Linha - RLS)</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {roles.map((r) => {
              const isActive = currentRole === r.value;
              return (
                <button
                  key={r.value}
                  id={`role-btn-${r.value}`}
                  onClick={() => onChangeRole(r.value)}
                  className={`flex flex-col text-left p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? `${r.color} shadow-sm ring-1 ring-slate-800`
                      : "border-slate-800/60 hover:border-slate-700 bg-slate-900/40 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="text-xs font-bold font-sans flex items-center gap-1.5">
                    {r.label}
                    {isActive && <CheckCircle className="w-3 h-3" />}
                  </span>
                  <span className="text-[10px] leading-relaxed mt-1 opacity-80 line-clamp-2">
                    {r.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
