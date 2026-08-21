import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  UserCheck,
  Brain,
  Layers,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Download,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Award,
  Printer
} from 'lucide-react';
import { planReforzamientoMartinSepulveda, evaluacionEscrituraIAMock } from '../data/mockData';
import { APP_CONFIG } from '../config/appConfig';
import { getSequentialPrintTitle } from '../utils/printUtils';

// ─── 1. PLAN DE REFORZAMIENTO MARTÍN SEPÚLVEDA MODAL ────────────────
interface PlanMartinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlanMartinModal: React.FC<PlanMartinModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    const baseTitle = `Ficha de Reforzamiento Pedagógico - ${planReforzamientoMartinSepulveda.alumno} (${planReforzamientoMartinSepulveda.curso})`;
    const originalTitle = document.title;
    document.title = getSequentialPrintTitle(baseTitle);
    
    const rootEl = document.getElementById('root');
    if (rootEl) rootEl.classList.add('printing-modal-active');

    window.print();

    setTimeout(() => {
      document.title = originalTitle;
      if (rootEl) rootEl.classList.remove('printing-modal-active');
    }, 1000);
  };

  const modalContent = (
    <div className="print-modal-portal fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="print-modal-inner bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col my-auto overflow-hidden text-left print:max-w-none print:max-h-none print:shadow-none print:border-0 print:bg-white print:m-0">
        {/* Header - Screen View */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-black text-sm">
              MS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">{planReforzamientoMartinSepulveda.alumno}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Brecha Severa en Álgebra
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {planReforzamientoMartinSepulveda.curso} • RUT: {planReforzamientoMartinSepulveda.rut} • Docente: {planReforzamientoMartinSepulveda.profesor}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Screen View */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-slate-200 print:hidden">
          {/* Diagnostic Box */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              Diagnóstico Curricular Automatizado
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {planReforzamientoMartinSepulveda.diagnosticoDetallado}
            </p>
            <div className="text-[11px] font-mono text-rose-300 pt-1">
              Puntaje proyectado actual: <strong>{planReforzamientoMartinSepulveda.puntajeDiagnostico}</strong>
            </div>
          </div>

          {/* Objectives */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-400" />
              Objetivos de Aprendizaje a Nivelar
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs text-slate-300">
              {planReforzamientoMartinSepulveda.objetivosAprendizaje.map((oa, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{oa}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3-Week Step Plan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              Plan de Acción Guiado (3 Semanas)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {planReforzamientoMartinSepulveda.actividadesSugeridas.map((act, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-2 text-xs">
                  <div className="text-indigo-400 font-bold">{act.semana}</div>
                  <div className="font-semibold text-white">{act.foco}</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{act.detalle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════
            PRINT-ONLY PERFECT DOCUMENT SHEET
           ═════════════════════════════════════════════════════════════ */}
        <div className="hidden print:block print-paper-canvas p-8 text-black bg-white space-y-6">
          <div className="border-b-2 border-black pb-4 text-left">
            <div className="text-[10px] uppercase font-black tracking-wider text-slate-600">
              {APP_CONFIG.nombreEstablecimiento} • Departamento de UTP y Evaluación
            </div>
            <h1 className="text-lg font-black uppercase tracking-tight text-black mt-1">
              FICHA DE NIVELACIÓN Y REFORZAMIENTO PEDAGÓGICO INDIVIDUAL
            </h1>
            <div className="text-xs font-semibold text-slate-700 mt-0.5">
              Programa de Acompañamiento SIMCE 2026 — Asignatura de Matemática
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-slate-400 grid grid-cols-12 gap-3 text-xs">
              <div className="col-span-6">
                <strong>Estudiante:</strong> {planReforzamientoMartinSepulveda.alumno}
              </div>
              <div className="col-span-3">
                <strong>RUT:</strong> {planReforzamientoMartinSepulveda.rut}
              </div>
              <div className="col-span-3">
                <strong>Curso:</strong> {planReforzamientoMartinSepulveda.curso}
              </div>
              <div className="col-span-6">
                <strong>Profesor Guía:</strong> {planReforzamientoMartinSepulveda.profesor}
              </div>
              <div className="col-span-6">
                <strong>Diagnóstico:</strong> <span className="text-red-700 font-bold">{planReforzamientoMartinSepulveda.puntajeDiagnostico} (Brecha en Álgebra)</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-left text-xs">
            <div className="border border-slate-300 p-3 rounded bg-slate-50">
              <strong className="block text-[11px] uppercase text-black mb-1">1. Diagnóstico Curricular Específico:</strong>
              <p className="text-slate-800 leading-relaxed">
                {planReforzamientoMartinSepulveda.diagnosticoDetallado}
              </p>
            </div>

            <div className="border border-slate-300 p-3 rounded">
              <strong className="block text-[11px] uppercase text-black mb-1">2. Objetivos de Aprendizaje (OA) Priorizados:</strong>
              <ul className="list-disc list-inside space-y-1 text-slate-800">
                {planReforzamientoMartinSepulveda.objetivosAprendizaje.map((oa, idx) => (
                  <li key={idx}>{oa}</li>
                ))}
              </ul>
            </div>

            <div className="border border-slate-300 p-3 rounded">
              <strong className="block text-[11px] uppercase text-black mb-2">3. Plan de Trabajo de 3 Semanas:</strong>
              <div className="grid grid-cols-3 gap-3">
                {planReforzamientoMartinSepulveda.actividadesSugeridas.map((act, i) => (
                  <div key={i} className="p-2 border border-slate-300 rounded bg-slate-50 space-y-1">
                    <div className="font-bold text-black border-b border-slate-300 pb-0.5">{act.semana}</div>
                    <div className="font-semibold text-slate-900 text-[11px]">{act.foco}</div>
                    <p className="text-[10px] text-slate-700 leading-normal">{act.detalle}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-6 border-t border-black grid grid-cols-4 gap-4 text-center text-[10px]">
              <div className="border-t border-black pt-1">
                Firma del Estudiante
              </div>
              <div className="border-t border-black pt-1">
                Firma del Apoderado
              </div>
              <div className="border-t border-black pt-1">
                Firma del Profesor
              </div>
              <div className="border-t border-black pt-1">
                Firma y Timbre UTP
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Screen View */}
        <div className="p-5 border-t border-slate-800 flex items-center justify-between bg-slate-950/60 print:hidden">
          <span className="text-xs text-slate-400">
            Plan remedial personalizado generado por Sysget Saber
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Ficha PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};


// ─── 2. EVALUACIÓN DE ESCRITURA CON IA MODAL ─────────────────────────
interface EvaluacionIAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EvaluacionIAModal: React.FC<EvaluacionIAModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col my-auto overflow-hidden text-left">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl shadow-lg">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">Corrección Automática de Redacción con IA</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {evaluacionEscrituraIAMock.tiempoCorreccionIA}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Estudiante: {evaluacionEscrituraIAMock.estudiante} • {evaluacionEscrituraIAMock.tipoTexto}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-slate-200">
          {/* Score banner */}
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wider">Tema Evaluado</div>
              <div className="text-sm font-extrabold text-white mt-0.5">{evaluacionEscrituraIAMock.tema}</div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-2xl font-black text-purple-300">
                {evaluacionEscrituraIAMock.puntajeGlobal} / {evaluacionEscrituraIAMock.puntajeMaximo} pts
              </div>
              <div className="text-[11px] font-bold text-emerald-400">{evaluacionEscrituraIAMock.nivelAlcanzado}</div>
            </div>
          </div>

          {/* Rubric Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Desglose de Criterios y Justificación Pedagógica
            </h4>
            <div className="space-y-2.5">
              {evaluacionEscrituraIAMock.rubricaCriterios.map((c, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>{c.criterio}</span>
                    <span className="text-indigo-400 font-mono">{c.puntaje} / {c.max} pts</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{c.feedback}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Pedagogical Feedback */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
            <div className="font-bold text-indigo-400 flex items-center gap-1.5">
              <Brain className="w-4 h-4" />
              Sugerencia Pedagógica para el Docente
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {evaluacionEscrituraIAMock.retroalimentacionIA}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 flex items-center justify-between bg-slate-950/60">
          <span className="text-xs text-slate-400">
            Módulo NLP Curricular SIMCE • Evaluación de preguntas abiertas
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── 3. AISLAMIENTO PEDAGÓGICO MODAL ────────────────────────────────
interface AislamientoModalProps {
  isOpen: boolean;
  onClose: () => void;
  asignaturaNombre: string;
}

export const AislamientoModal: React.FC<AislamientoModalProps> = ({
  isOpen,
  onClose,
  asignaturaNombre
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col my-auto overflow-hidden text-left">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-sky-950/60 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-600 text-white rounded-2xl shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Aislamiento Pedagógico por Especialidad</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ambiente exclusivo configurado para: <strong className="text-sky-300">{asignaturaNombre}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/30 space-y-2">
            <div className="font-bold text-sky-300 text-sm">¿Cómo protege la confidencialidad curricular?</div>
            <p>
              En <strong>Sysget Saber</strong>, cada docente opera en una celda de analítica aislada. Los profesores de {asignaturaNombre} únicamente tienen acceso a los reactivos, ejes temáticos y diagnósticos correspondientes a su especialidad y cursos asignados.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Banco de Preguntas Filtrado
              </div>
              <p className="text-slate-400 text-[11px]">
                Sin mezclar ítems de otras materias en taxonomías curriculares ni búsquedas.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Reportes Pedagógicos Puros
              </div>
              <p className="text-slate-400 text-[11px]">
                El cálculo de brechas se efectúa exclusivamente sobre los Objetivos de Aprendizaje de la asignatura.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 flex items-center justify-end bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
