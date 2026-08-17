import React, { useState } from 'react';
import { Prueba, Asignatura, Pregunta } from '../types';
import {
  BookOpen,
  PlusCircle,
  Search,
  Clock,
  Check,
  Copy,
  BarChart2,
  FileText,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Layers,
  Eye,
  X,
  HelpCircle,
  FileCheck,
  Camera
} from 'lucide-react';
import { UserProfile, RendicionPrueba } from '../types';
import { PrintEvaluacionModal } from '../components/PrintEvaluacionModal';
import { IngresoRespuestasModal } from '../components/IngresoRespuestasModal';
import { alumnosMock } from '../data/mockData';


interface PruebaFacsimilModalProps {
  isOpen: boolean;
  prueba: Prueba | null;
  preguntas: Pregunta[];
  onClose: () => void;
}

const PruebaFacsimilModal: React.FC<PruebaFacsimilModalProps> = ({
  isOpen,
  prueba,
  preguntas,
  onClose
}) => {
  if (!isOpen || !prueba) return null;

  // Match questions by IDs or subject
  const preguntasDeLaPrueba = preguntas.filter(p =>
    prueba.preguntasIds?.includes(p.id) || p.asignaturaId === prueba.asignaturaId
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col my-6">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {prueba.asignaturaNombre} — {prueba.nivel}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Código: <strong className="font-mono text-indigo-500">{prueba.codigoPublico}</strong>
              </span>
              <span className="text-xs text-slate-400">
                ⏱️ {prueba.duracionMinutos} min • 📝 {preguntasDeLaPrueba.length} preguntas
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {prueba.titulo}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {prueba.descripcion}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: List of Questions */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 divide-y divide-slate-100 dark:divide-slate-800">
          {preguntasDeLaPrueba.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <HelpCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">No se encontraron preguntas cargadas para esta evaluación.</p>
            </div>
          ) : (
            preguntasDeLaPrueba.map((preg, idx) => (
              <div key={preg.id} className={`${idx > 0 ? 'pt-6' : ''} space-y-3`}>
                {/* Header item */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                      Pregunta N° {idx + 1}
                    </span>
                    <span className="capitalize text-slate-500 dark:text-slate-400">
                      Dificultad: <strong>{preg.dificultad}</strong>
                    </span>
                    <span>•</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      Puntaje: <strong>{preg.puntaje} pt(s)</strong>
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Fuente: {preg.fuente}
                  </span>
                </div>

                {/* Enunciado */}
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
                  {preg.enunciado}
                </p>

                {/* Imagen/Figura si existe */}
                {preg.imagenUrl && (
                  <div className="p-3 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-center overflow-hidden shadow-sm max-w-md my-2">
                    <img
                      src={preg.imagenUrl}
                      alt={`Figura Pregunta ${idx + 1}`}
                      className="max-h-64 w-auto object-contain rounded-lg"
                    />
                  </div>
                )}

                {/* Alternativas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {preg.alternativas.map(alt => (
                    <div
                      key={alt.letra}
                      className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                        alt.es_correcta
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center flex-shrink-0 ${
                        alt.es_correcta
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {alt.letra}
                      </span>
                      <span className="pt-0.5">{alt.texto}</span>
                      {alt.es_correcta && (
                        <span className="ml-auto text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                          ✓ Correcta
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Total preguntas estructuradas: <strong>{preguntasDeLaPrueba.length}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
          >
            Cerrar Facsímil
          </button>
        </div>
      </div>
    </div>
  );
};

interface EvaluacionesPageProps {
  pruebas: Prueba[];
  asignaturas: Asignatura[];
  bancoPreguntas?: Pregunta[];
  currentUser?: UserProfile;
  onOpenGenerator: () => void;
  onSelectPruebaReporte: (pruebaId: string) => void;
  onUpdatePruebaEstado: (pruebaId: string, nuevoEstado: 'borrador' | 'activa' | 'finalizada') => void;
  onAddRendicion?: (rendicion: RendicionPrueba) => void;
}

export const EvaluacionesPage: React.FC<EvaluacionesPageProps> = ({
  pruebas,
  asignaturas,
  bancoPreguntas = [],
  currentUser,
  onOpenGenerator,
  onSelectPruebaReporte,
  onUpdatePruebaEstado
}) => {
  const isDocente = currentUser?.rol === 'profesor' && currentUser?.asignaturaId;
  const initialAsignatura = isDocente ? currentUser.asignaturaId! : 'todos';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsignatura, setSelectedAsignatura] = useState<string>(initialAsignatura);
  const [selectedEstado, setSelectedEstado] = useState<string>('todos');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [facsimilModalOpen, setFacsimilModalOpen] = useState(false);
  const [selectedPruebaForFacsimil, setSelectedPruebaForFacsimil] = useState<Prueba | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedPruebaForPrint, setSelectedPruebaForPrint] = useState<Prueba | null>(null);
  const [respuestasModalOpen, setRespuestasModalOpen] = useState(false);
  const [selectedPruebaForRespuestas, setSelectedPruebaForRespuestas] = useState<Prueba | null>(null);

  const showToast = (msg: string) => {

    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Código ${code} copiado al portapapeles`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenFacsimil = (p: Prueba) => {
    setSelectedPruebaForFacsimil(p);
    setFacsimilModalOpen(true);
  };

  // If user is a teacher, filter to their subject
  const userPruebas = isDocente ? pruebas.filter(p => p.asignaturaId === currentUser.asignaturaId) : pruebas;

  const filteredPruebas = userPruebas.filter((prueba) => {
    const matchesSearch =
      prueba.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prueba.codigoPublico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prueba.asignaturaNombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAsignatura =
      selectedAsignatura === 'todos' || prueba.asignaturaId === selectedAsignatura;
    
    const matchesEstado =
      selectedEstado === 'todos' || prueba.estado === selectedEstado;

    return matchesSearch && matchesAsignatura && matchesEstado;
  });

  const totalActivas = userPruebas.filter((p) => p.estado === 'activa').length;
  const totalFinalizadas = userPruebas.filter((p) => p.estado === 'finalizada').length;
  const totalBorradores = userPruebas.filter((p) => p.estado === 'borrador').length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-2 animate-bounce-short text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/20 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> Gestión de Evaluaciones & Ensayos
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {currentUser?.rol === 'profesor' ? `Mis Evaluaciones — ${currentUser.asignaturaNombre || 'Especialidad'}` : 'Evaluaciones Creadas'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Crea, administra y distribuye pruebas estandarizadas nacionales y ensayos SIMCE. Obtén códigos de acceso directo para tus alumnos y analiza los resultados en tiempo real.
            </p>
          </div>

          <button
            onClick={onOpenGenerator}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Nueva Evaluación</span>
          </button>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Total Ensayos</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{userPruebas.length}</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Activas</p>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{totalActivas}</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2.5 bg-slate-500/10 text-slate-500 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Finalizadas</p>
            <p className="text-xl font-extrabold text-slate-700 dark:text-slate-300">{totalFinalizadas}</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Borradores</p>
            <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{totalBorradores}</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, código o materia..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isDocente && (
            <select
              value={selectedAsignatura}
              onChange={(e) => setSelectedAsignatura(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="todos">Todas las Asignaturas</option>
              {asignaturas.map((a) => (
                <option key={a.id} value={a.id}>{a.nombre}</option>
              ))}
            </select>
          )}

          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="todos">Todos los Estados</option>
            <option value="activa">Activa</option>
            <option value="finalizada">Finalizada</option>
            <option value="borrador">Borrador</option>
          </select>
        </div>
      </div>

      {/* Evaluations Grid */}
      {filteredPruebas.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/80 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No se encontraron evaluaciones</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Prueba ajustando los filtros de búsqueda o genera una nueva evaluación haciendo clic en el botón superior.
          </p>
          <button
            onClick={onOpenGenerator}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Generar Evaluación</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPruebas.map((prueba) => {
            const estadoColor =
              prueba.estado === 'activa'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : prueba.estado === 'finalizada'
                ? 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';

            return (
              <div
                key={prueba.id}
                className="glass-card p-6 space-y-5 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-200"
              >
                {/* Header info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        {prueba.asignaturaNombre} — {prueba.nivel}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border capitalize ${estadoColor}`}>
                        {prueba.estado}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{prueba.duracionMinutos} min</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {prueba.titulo}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {prueba.descripcion}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" /> {prueba.totalPreguntas} Preguntas
                    </span>
                    <span>•</span>
                    <span>Curso: <strong>{prueba.cursoNombre}</strong></span>
                  </div>
                </div>

                {/* Public Access Code Banner */}
                <div className="p-3.5 bg-slate-100 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Código para Alumno</span>
                    <strong className="text-indigo-600 dark:text-indigo-400 font-mono text-base tracking-wider">{prueba.codigoPublico}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(prueba.codigoPublico)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 text-xs font-bold transition-all"
                      title="Copiar código"
                    >
                      {copiedCode === prueba.codigoPublico ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="space-y-2 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectPruebaReporte(prueba.id)}
                      className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm transition-all"
                    >
                      <BarChart2 className="w-4 h-4" />
                      <span>Reporte & Reforzamiento</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPruebaForRespuestas(prueba);
                        setRespuestasModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                      title="Ingreso rápido de respuestas de hojas impresas"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Ingresar Respuestas (Foto/Rápido)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Ver Facsímil */}
                    <button
                      onClick={() => handleOpenFacsimil(prueba)}
                      className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 text-xs font-bold py-2 rounded-xl transition-all"
                      title="Ver Facsímil con todas las preguntas y figuras"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Ítems</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPruebaForPrint(prueba);
                        setPrintModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold py-2 rounded-xl transition-all border border-indigo-500/20"
                      title="Imprimir Cuadernillo de Prueba y Hoja de Respuestas"
                    >
                      <Printer className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Imprimir / PDF</span>
                    </button>

                    <button
                      onClick={() => {
                        const nuevoEstado = prueba.estado === 'activa' ? 'finalizada' : 'activa';
                        onUpdatePruebaEstado(prueba.id, nuevoEstado);
                        showToast(`Estado de "${prueba.titulo}" cambiado a ${nuevoEstado.toUpperCase()}`);
                      }}
                      className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold py-2 rounded-xl transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{prueba.estado === 'activa' ? 'Finalizar' : 'Activar'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Facsímil Inspection Modal */}
      <PruebaFacsimilModal
        isOpen={facsimilModalOpen}
        prueba={selectedPruebaForFacsimil}
        preguntas={bancoPreguntas}
        onClose={() => { setFacsimilModalOpen(false); setSelectedPruebaForFacsimil(null); }}
      />

      {/* Printable Test Booklet & Answer Sheet Modal */}
      {(() => {
        const isProductionDocente = currentUser?.email === 'luis.leon@premil.cl';
        let printAlumnos = [];
        if (!isProductionDocente) {
          printAlumnos = alumnosMock;
        } else {
          try {
            const stored = JSON.parse(localStorage.getItem('sysget_alumnos_list') || '[]');
            if (Array.isArray(stored)) {
              printAlumnos = stored;
            }
          } catch (e) {}
        }

        return (
          <PrintEvaluacionModal
            isOpen={printModalOpen}
            prueba={selectedPruebaForPrint}
            preguntas={bancoPreguntas}
            alumnos={printAlumnos}
            onClose={() => { setPrintModalOpen(false); setSelectedPruebaForPrint(null); }}
          />
        );
      })()}

      {/* Quick Answer Sheet Input Modal (Photo & Fast-Track) */}
      <IngresoRespuestasModal
        isOpen={respuestasModalOpen}
        prueba={selectedPruebaForRespuestas}
        preguntas={bancoPreguntas}
        onClose={() => { setRespuestasModalOpen(false); setSelectedPruebaForRespuestas(null); }}
        onSaveRendicion={(nuevaRendicion) => {
          showToast(`✅ Rendición guardada para ${nuevaRendicion.alumnoNombre} (${nuevaRendicion.porcentajeLogro}% logro)`);
        }}
      />
    </div>
  );
};

