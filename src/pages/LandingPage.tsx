import React from 'react';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  BarChart3,
  BookOpen,
  Users,
  Layers,
  ArrowRight,
  CheckCircle2,
  Lock,
  Award,
  Zap,
  Globe2,
  Building2,
  ChevronRight,
  Check
} from 'lucide-react';
import { UserRole } from '../types';

interface LandingPageProps {
  onEnterApp: () => void;
  onSelectRoleDemo: (role: UserRole, extra?: 'ciencias' | 'matematica' | 'lenguaje') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onSelectRoleDemo
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/20 to-sky-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[600px] h-[600px] bg-indigo-900/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/75 border-b border-slate-800/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-white font-sans">
                  Sysget<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Saber</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 rounded-full">
                  SIMCE 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Tecnología Educativa by <strong className="text-slate-200">Sysget Chile</strong></p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onEnterApp}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 border border-indigo-400/30"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Acceso Institucional (Login)</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-950/80 to-slate-900/80 text-indigo-300 border border-indigo-500/30 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Plataforma Oficial de Diagnóstico y Evaluaciones Nacionales</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Elevando el Rendimiento Escolar con <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-violet-400">Analítica Curricular</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            <strong className="text-white">Sysget Saber</strong> es la solución integral de <strong className="text-indigo-300">Sysget</strong> para sostenedores, directivos y docentes en Chile. Automatiza ensayos tipo SIMCE, diagnostica brechas por habilidad y genera planes de reforzamiento personalizados con total aislamiento pedagógico por materia.
          </p>

          {/* CTA Box / Demo Roles */}
          <div className="pt-6">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>🧪 Modo Sandbox — Demostración Guiada por Especialidad:</span>
                </div>
                <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                  Sesión aislada de prueba
                </span>
              </div>

              {/* Roles Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {/* 1. Admin */}
                <button
                  onClick={() => onSelectRoleDemo('admin')}
                  className="p-3.5 rounded-2xl bg-gradient-to-b from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/40 hover:border-indigo-400 text-left transition-all group hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-950/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 text-base">
                        👑
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div className="text-xs font-black text-white group-hover:text-indigo-300">Admin / UTP</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-medium">Control Global Colegio</div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1">
                    <div className="text-[10px] text-emerald-400 font-bold">⭐ Mapa de calor & PME</div>
                    <div className="text-[9px] text-slate-500">261 pts SIMCE proyectados</div>
                  </div>
                </button>

                {/* 2. Profe Matematica */}
                <button
                  onClick={() => onSelectRoleDemo('profesor', 'matematica')}
                  className="p-3.5 rounded-2xl bg-gradient-to-b from-sky-950/70 via-slate-900 to-slate-950 border border-sky-500/40 hover:border-sky-400 text-left transition-all group hover:scale-[1.02] active:scale-95 shadow-lg shadow-sky-950/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-sky-600/30 border border-sky-500/40 flex items-center justify-center text-sky-300 text-base">
                        📐
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div className="text-xs font-black text-white group-hover:text-sky-300">Profe Matemática</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-medium">8° Básico (María G.)</div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1">
                    <div className="text-[10px] text-amber-400 font-bold">⭐ Plan Alumno Martín S.</div>
                    <div className="text-[9px] text-slate-500">Brecha en Álgebra y Pitágoras</div>
                  </div>
                </button>

                {/* 3. Profe Ciencias */}
                <button
                  onClick={() => onSelectRoleDemo('profesor', 'ciencias')}
                  className="p-3.5 rounded-2xl bg-gradient-to-b from-cyan-950/70 via-slate-900 to-slate-950 border border-cyan-500/40 hover:border-cyan-400 text-left transition-all group hover:scale-[1.02] active:scale-95 shadow-lg shadow-cyan-950/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-base">
                        🔬
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div className="text-xs font-black text-white group-hover:text-cyan-300">Profe Ciencias</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-medium">Ciencias 6°B (Patricia M.)</div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1">
                    <div className="text-[10px] text-cyan-400 font-bold">⭐ Aislamiento Curricular</div>
                    <div className="text-[9px] text-slate-500">35 preguntas & 8 ejes OA</div>
                  </div>
                </button>

                {/* 4. Profe Lenguaje */}
                <button
                  onClick={() => onSelectRoleDemo('profesor', 'lenguaje')}
                  className="p-3.5 rounded-2xl bg-gradient-to-b from-violet-950/70 via-slate-900 to-slate-950 border border-violet-500/40 hover:border-violet-400 text-left transition-all group hover:scale-[1.02] active:scale-95 shadow-lg shadow-violet-950/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300 text-base">
                        📖
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div className="text-xs font-black text-white group-hover:text-violet-300">Profe Lenguaje</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-medium">Lenguaje 8°A (Carlos M.)</div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1">
                    <div className="text-[10px] text-purple-400 font-bold">⭐ Corrección IA Redacción</div>
                    <div className="text-[9px] text-slate-500">Rúbrica textual automatizada</div>
                  </div>
                </button>

                {/* 5. Alumno */}
                <button
                  onClick={() => onSelectRoleDemo('alumno')}
                  className="p-3.5 rounded-2xl bg-gradient-to-b from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-500/40 hover:border-emerald-400 text-left transition-all group hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-950/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 text-base">
                        🎓
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div className="text-xs font-black text-white group-hover:text-emerald-300">Portal Alumno</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-medium">Pedro Soto (8°A)</div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1">
                    <div className="text-[10px] text-emerald-400 font-bold">⭐ Ensayo Interactivo</div>
                    <div className="text-[9px] text-slate-500">5 preguntas + Feedback</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS METRICS BANNER */}
      <section className="border-y border-slate-800/80 bg-slate-900/40 backdrop-blur-sm py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">100%</div>
            <div className="text-xs font-semibold text-slate-400">Alineado a Estándares Mineduc / SIMCE</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">+45.000</div>
            <div className="text-xs font-semibold text-slate-400">Preguntas y Ensayos Calibrados</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">0 Fricción</div>
            <div className="text-xs font-semibold text-slate-400">Aislamiento por Asignatura y Rol</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">Supabase & Vercel</div>
            <div className="text-xs font-semibold text-slate-400">Arquitectura Cloud de Alta Disponibilidad</div>
          </div>
        </div>
      </section>

      {/* CORE PILLARS SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Arquitectura Pensada en la Escuela
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            ¿Por qué los colegios eligen Sysget Saber?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Diseñado para solucionar la sobrecarga docente y brindar a los equipos directivos claridad inmediata sobre los aprendizajes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Aislamiento */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
              Aislamiento Departamental Estricto
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cada docente trabaja exclusivamente en su especialidad. Los profesores de Matemática gestionan sus problemas y teoremas sin mezclarse con las lecturas o rúbricas de Lenguaje e Historia.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Banco de preguntas por disciplina
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Configuración protegida para Administradores
              </li>
            </ul>
          </div>

          {/* Card 2: Reporte Tabulado */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/40 transition-all space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
              Reporte Tabulado & Plan de Reforzamiento
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Matrices automáticas de logro por estudiante, eje temático y habilidad cognitiva. Genera informes listos para imprimir o exportar, identificando a alumnos en nivel Insuficiente, Elemental y Adecuado.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Estimación de puntaje SIMCE (100 - 350 pts)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Plan remedial automático por habilidad crítica
              </li>
            </ul>
          </div>

          {/* Card 3: Experiencia Alumno */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 transition-all space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
              Portal del Alumno Enfocado y Ágil
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Los estudiantes ingresan mediante código de prueba a un runner limpio, con temporizador y navegación intuitiva. Al terminar, reciben su retroalimentación inmediata si el docente lo habilita.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sin menús innecesarios ni distracciones
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Compatible con celulares, tablets y PC
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="text-xs text-slate-400">
              <p className="font-bold text-white">Sysget Saber © 2026</p>
              <p>Desarrollado por Sysget SpA — Soluciones Tecnológicas Educativas</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Santiago, Chile</span>
            <span>•</span>
            <span>Alineado a Currículum Nacional Mineduc</span>
            <span>•</span>
            <button onClick={onEnterApp} className="text-indigo-400 hover:underline font-bold">
              Iniciar Sesión
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
