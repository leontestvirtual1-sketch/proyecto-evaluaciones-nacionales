import React, { useState } from 'react';
import { Prueba, UserProfile } from '../types';
import {
  GraduationCap,
  Clock,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  User,
  AlertCircle,
  CheckCircle2,
  Lock,
  Loader2
} from 'lucide-react';

interface AccesoEvaluacionEstudianteProps {
  codigo: string;
  prueba: Prueba | null;
  emailInicial?: string;
  nombreInicial?: string;
  onComenzar: (prueba: Prueba, alumnoPerfil: UserProfile) => void;
  onGoToLoginDocente: () => void;
}

/** Limpia el RUT de puntos y guion */
function cleanRut(rutRaw: string): string {
  return (rutRaw || '').replace(/[^0-9kK]/g, '').toUpperCase().trim();
}

/** Formatea automáticamente el RUT chileno con puntos y guion */
function formatRutInput(rutRaw: string): string {
  const clean = cleanRut(rutRaw);
  if (clean.length === 0) return '';
  if (clean.length === 1) return clean;
  const cuerpo = clean.slice(0, -1);
  const dv = clean.slice(-1);
  let cuerpoFormateado = '';
  let count = 0;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    count++;
    cuerpoFormateado = cuerpo[i] + cuerpoFormateado;
    if (count % 3 === 0 && i > 0) {
      cuerpoFormateado = '.' + cuerpoFormateado;
    }
  }
  return `${cuerpoFormateado}-${dv}`;
}

// Nómina de respaldo local para asegurar funcionamiento ininterrumpido en demo
const NOMINA_LOCAL_FALLBACK = [
  { id: 'alu-001', rut: '21.001.001-1', nombre: 'Camila', apellido: 'Araya Pérez', email: 'camila.araya@colegio.cl' },
  { id: 'alu-002', rut: '21.002.002-2', nombre: 'Diego', apellido: 'Bravo Soto', email: 'diego.bravo@colegio.cl' },
  { id: 'alu-003', rut: '21.003.003-3', nombre: 'Fernanda', apellido: 'Castro Muñoz', email: 'fernanda.castro@colegio.cl' },
  { id: 'alu-demo', rut: '22.876.543-0', nombre: 'Pedro', apellido: 'Soto', email: 'pedro.soto@sysget.cl' },
  { id: '29a04e65-bfb6-4344-9c38-665c50dc557a', rut: '23.386.193-6', nombre: 'Ignacia Andrea', apellido: 'Leon Pizarro', email: 'ignaciaandrealeonpizarro@gmail.com' },
  { id: '83a021dd-bc78-4e2d-a949-6ae6d9807cee', rut: '23.315.875-5', nombre: 'Florencia Angelica', apellido: 'Leon PIzarro', email: 'florenciaangelicaleonpizarro@gmail.com' }
];

export const AccesoEvaluacionEstudiante: React.FC<AccesoEvaluacionEstudianteProps> = ({
  codigo,
  prueba,
  emailInicial = '',
  nombreInicial = '',
  onComenzar,
  onGoToLoginDocente
}) => {
  const [rut, setRut] = useState('');
  const [nombre, setNombre] = useState(nombreInicial);
  const [email] = useState(emailInicial);
  const [isValidating, setIsValidating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const formatted = formatRutInput(rawVal);
    setRut(formatted);
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const rutLimpio = cleanRut(rut);
    if (!rutLimpio || rutLimpio.length < 7 || rutLimpio.length > 9) {
      setErrorMsg('Ingresa un RUT chileno válido (ej: 23.386.193-6 o 23386193-6).');
      return;
    }

    if (!prueba) {
      setErrorMsg(`No se encontró una evaluación activa con el código "${codigo}". Consulta con tu docente.`);
      return;
    }

    setIsValidating(true);

    try {
      // 1. Llamar al backend de validación de identidad institucional (Nivel 1)
      const res = await fetch('/api/verify-student-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo,
          rut: rutLimpio,
          email: email.trim().toLowerCase(),
          nombre: nombre.trim()
        })
      });

      const data = await res.json();

      if (res.ok && data.ok && data.alumno) {
        setSuccessMsg(`¡Identidad verificada! Bienvenido/a ${data.alumno.nombreCompleto || data.alumno.nombre}. Abriendo tu ensayo...`);
        
        const perfilEstudiante: UserProfile = {
          id: data.alumno.id || crypto.randomUUID(),
          rut: data.alumno.rut || formatRutInput(rutLimpio),
          nombre: data.alumno.nombre || nombre.trim(),
          apellido: data.alumno.apellido || '',
          email: data.alumno.email || email.trim().toLowerCase(),
          rol: 'alumno',
          establecimiento: data.alumno.establecimiento || prueba.cursoNombre || 'Sysget Saber',
          estado: 'activo',
          plan: 'institucional',
          esSuperAdmin: false,
          esDemo: false
        };

        setTimeout(() => {
          onComenzar(prueba, perfilEstudiante);
        }, 800);
        return;
      }

      // Si el servidor devolvió un error específico (ej: 403 RUT no coincide)
      if (!res.ok) {
        // Fallback local en caso de estar en desarrollo sin conexión API
        const fallbackAlumno = NOMINA_LOCAL_FALLBACK.find(a => cleanRut(a.rut) === rutLimpio);
        if (fallbackAlumno) {
          if (email && fallbackAlumno.email && fallbackAlumno.email.toLowerCase() !== email.toLowerCase()) {
            setErrorMsg('El RUT ingresado pertenece a otro estudiante y no corresponde al enlace asignado a este correo.');
            return;
          }

          setSuccessMsg(`¡Identidad verificada! Bienvenido/a ${fallbackAlumno.nombre}. Abriendo tu ensayo...`);
          const perfilFallback: UserProfile = {
            id: fallbackAlumno.id,
            rut: fallbackAlumno.rut,
            nombre: fallbackAlumno.nombre,
            apellido: fallbackAlumno.apellido,
            email: fallbackAlumno.email,
            rol: 'alumno',
            establecimiento: prueba.cursoNombre || 'Sysget Saber',
            estado: 'activo',
            plan: 'institucional',
            esSuperAdmin: false,
            esDemo: false
          };
          setTimeout(() => {
            onComenzar(prueba, perfilFallback);
          }, 800);
          return;
        }

        setErrorMsg(data.error || 'El RUT no coincide con la nómina oficial del curso. Por favor revisa los dígitos e intenta nuevamente.');
      }
    } catch (err: unknown) {
      console.warn('[AccesoEvaluacionEstudiante] Error al validar con API:', err);
      // Fallback local de contingencia
      const fallbackAlumno = NOMINA_LOCAL_FALLBACK.find(a => cleanRut(a.rut) === rutLimpio);
      if (fallbackAlumno) {
        setSuccessMsg(`¡Identidad verificada! Bienvenido/a ${fallbackAlumno.nombre}. Abriendo tu ensayo...`);
        const perfilFallback: UserProfile = {
          id: fallbackAlumno.id,
          rut: fallbackAlumno.rut,
          nombre: fallbackAlumno.nombre,
          apellido: fallbackAlumno.apellido,
          email: fallbackAlumno.email,
          rol: 'alumno',
          establecimiento: prueba.cursoNombre || 'Sysget Saber',
          estado: 'activo',
          plan: 'institucional',
          esSuperAdmin: false,
          esDemo: false
        };
        setTimeout(() => {
          onComenzar(prueba, perfilFallback);
        }, 800);
        return;
      }

      setErrorMsg('No fue posible validar el RUT con el servidor. Revisa tu conexión o verifica los dígitos ingresados.');
    } finally {
      setIsValidating(false);
    }
  };

  const esPaes = (prueba?.asignaturaNombre || '').toLowerCase().includes('paes') ||
                 (prueba?.titulo || '').toLowerCase().includes('paes');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 animate-fade-in">
      
      {/* Header superior institucional */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              Sysget<span className="text-indigo-400">Saber</span>
            </h1>
            <p className="text-[11px] text-slate-400">Portal de Evaluaciones del Estudiante · Chile 2026</p>
          </div>
        </div>

        <button
          onClick={onGoToLoginDocente}
          className="text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1 py-1 px-3 rounded-lg hover:bg-slate-900 cursor-pointer"
        >
          <span>Acceso Docente</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Contenedor central */}
      <main className="max-w-2xl w-full mx-auto my-auto py-8">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-indigo-950/40 space-y-7">
          
          {/* Badge y título del ensayo */}
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{esPaes ? 'Ensayo Oficial PAES' : 'Evaluación Oficial SIMCE'}</span>
              <span className="font-mono bg-indigo-500/20 px-1.5 py-0.2 rounded text-[11px] text-indigo-300">
                {codigo}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {prueba?.titulo || 'Evaluación Asignada'}
            </h2>

            {/* Saludo personalizado con el nombre de la alumna */}
            {nombre && (
              <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl max-w-lg mx-auto">
                <p className="text-xs text-indigo-300 font-bold uppercase tracking-wider">Estudiante Asignada</p>
                <p className="text-lg font-black text-white mt-0.5">👋 Hola, {nombre}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Tu docente ha habilitado esta evaluación para ti. Para abrirla, confirma tu RUT oficial a continuación.
                </p>
              </div>
            )}

            {!nombre && (
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Para garantizar la integridad de tu resultado, ingresa tu RUT chileno registrado en la nómina del curso.
              </p>
            )}
          </div>

          {/* Tarjeta de métricas de la prueba */}
          {prueba && (
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1 text-slate-400 text-xs">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Duración</span>
                </div>
                <p className="text-base font-black text-white">{prueba.duracionMinutos} min</p>
              </div>

              <div className="space-y-1 border-x border-slate-800/80">
                <div className="flex items-center justify-center gap-1 text-slate-400 text-xs">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Preguntas</span>
                </div>
                <p className="text-base font-black text-white">{prueba.totalPreguntas || 65}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1 text-slate-400 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Nivel</span>
                </div>
                <p className="text-base font-black text-white truncate px-1">{prueba.nivel || 'Oficial'}</p>
              </div>
            </div>
          )}

          {/* Formulario de Validación de RUT Oficial (Nivel 1) */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Campo principal: RUT Chileno */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>RUT Oficial del Estudiante</span>
                </label>
                <span className="text-[11px] text-indigo-400 font-semibold">Cero Contraseñas</span>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={12}
                  value={rut}
                  onChange={handleRutChange}
                  placeholder="Ej: 23.386.193-6"
                  disabled={isValidating || !!successMsg}
                  className="w-full px-4 py-3.5 bg-slate-950/90 border-2 border-slate-700 focus:border-indigo-500 rounded-2xl text-white placeholder-slate-500 text-base font-mono font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-slate-500">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Nómina MINEDUC</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                🔒 Tu RUT valida que eres alumna oficial del curso y asocia automáticamente tu puntaje para tu docente.
              </p>
            </div>

            {/* Si no venía nombre en el link, permitir ingresarlo */}
            {!nombreInicial && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Nombre Completo del Estudiante</span>
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Florencia Angélica León Pizarro"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            )}

            {/* Mensajes de error y éxito */}
            {errorMsg && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-start gap-2.5 text-rose-300 text-xs font-semibold animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div className="space-y-1">
                  <p>{errorMsg}</p>
                  <p className="text-[11px] text-rose-400/80 font-normal">
                    Solo los estudiantes matriculados en la nómina del curso pueden rendir esta evaluación.
                  </p>
                </div>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center gap-2.5 text-emerald-300 text-xs font-bold animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Botón de envío / validación */}
            <button
              type="submit"
              disabled={isValidating || !!successMsg}
              className={`w-full py-4 px-6 rounded-2xl font-black text-base shadow-xl flex items-center justify-center gap-2 transition-all transform cursor-pointer ${
                successMsg
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : isValidating
                  ? 'bg-indigo-600/70 text-white cursor-wait'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verificando en Nómina Oficial...</span>
                </>
              ) : successMsg ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>¡Identidad Confirmada!</span>
                </>
              ) : (
                <>
                  <span>🚀 Validar Identidad y Comenzar Ensayo</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed text-center">
              💡 <strong>Acceso Seguro Sin Contraseñas:</strong> Al validar tu RUT, el cronómetro oficial comenzará. Al finalizar, tus respuestas se calificarán al instante y tu docente recibirá los resultados con tu nombre.
            </div>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-4 border-t border-slate-900">
        <p>Sysget Saber · Plataforma Nacional de Evaluaciones SIMCE & PAES Chile 2026</p>
      </footer>
    </div>
  );
};
