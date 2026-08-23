import React, { createContext, useContext, useMemo } from 'react';
import { UserProfile, Prueba, Curso, AlumnoBasico, SeguimientoDocente, ReporteTabuladoCurso } from '../types';
import {
  pruebasMock,
  cursosMock,
  alumnosMock,
  seguimientoDocentesMock,
  reporteCursoMock,
  reporteCienciasMock,
  reporteLenguajeDemoMock,
  reportePremilitarRealMock,
  currentUserProfesorPremilitar,
  currentUserProfesorMiCasa,
} from '../data/mockData';

export interface DataContextType {
  isProduction: boolean;
  pruebas: Prueba[];
  cursos: Curso[];
  alumnos: AlumnoBasico[];
  seguimientoDocentes: SeguimientoDocente[];
  reporteActivo: ReporteTabuladoCurso;
  nombreEstablecimientoActivo: string;
}

const AcademicDataContext = createContext<DataContextType | null>(null);

interface AcademicDataProviderProps {
  children: React.ReactNode;
  currentUser: UserProfile | null;
  adminBaseProfile?: UserProfile | null;
  isSandboxMode: boolean;
  customPruebas?: Prueba[];
  docentesReales?: UserProfile[];
}

const PRODUCTION_ADMIN_EMAILS = new Set([
  'leontestvirtual1@gmail.com',
  'leontesvirtual1@gmail.com',
]);

/** Detecta si un email/establecimiento corresponde a entorno demo/sandbox */
const isDemoUser = (email: string, establecimiento?: string): boolean => {
  const e = email.toLowerCase().trim();
  const est = (establecimiento || '').toLowerCase();
  return (
    e.endsWith('@demo.cl') ||
    e.endsWith('@escuelademo.cl') ||
    e.endsWith('@sysget.cl') ||
    est.includes('demo') ||
    est.includes('bicentenario')
  );
};

/** Genera un color de avatar determinista según el email del docente */
const avatarColorFromEmail = (email: string): string => {
  const paleta = [
    'from-violet-600 to-purple-700',
    'from-sky-600 to-blue-700',
    'from-amber-600 to-orange-700',
    'from-rose-600 to-pink-700',
    'from-teal-600 to-cyan-700',
    'from-indigo-600 to-violet-700',
    'from-lime-600 to-green-700',
  ];
  let hash = 0;
  for (let i = 0; i < email.length; i++) hash = (hash * 31 + email.charCodeAt(i)) % paleta.length;
  return paleta[Math.abs(hash) % paleta.length];
};

/** Genera iniciales a partir de nombre y apellido */
const iniciales = (nombre: string, apellido: string): string =>
  `${(nombre[0] || '').toUpperCase()}${(apellido[0] || '').toUpperCase()}`;

/** Crea un reporte vacío legítimo (Directiva 2) para cualquier docente nuevo */
const crearReporteVacio = (user: UserProfile): ReporteTabuladoCurso => ({
  ...reporteCursoMock,
  pruebaId: `reporte-${user.id}-vacio`,
  pruebaTitulo: `${user.establecimiento || 'Establecimiento'} — ${user.asignaturaNombre || 'Asignatura'} (En proceso de población)`,
  cursoNombre: 'Sin cursos asignados aún',
  totalAlumnosRendidos: 0,
  totalAlumnosMatriculados: 0,
  promedioPorcentajeLogro: 0,
  promedioEscalaNacional: 0,
  desgloseEjes: [],
  desgloseHabilidades: [],
  preguntasMasFalladas: [],
  planAccionReforzamiento: [],
  rendiciones: [],
});

/** Crea un objeto SeguimientoDocente vacío para un docente nuevo */
const crearSeguimientoVacio = (user: UserProfile): SeguimientoDocente => ({
  profesorId: user.id,
  profesorNombre: `${user.nombre} ${user.apellido}`,
  profesorEmail: user.email,
  avatarColor: avatarColorFromEmail(user.email),
  iniciales: iniciales(user.nombre || '', user.apellido || ''),
  asignaturaId: user.asignaturaId || '',
  asignaturaNombre: user.asignaturaNombre || '',
  cursosAsignados: [],
  totalEvaluacionesCreadas: 0,
  totalEvaluacionesActivas: 0,
  totalAlumnosEvaluados: 0,
  totalAlumnosMatriculados: 0,
  coberturaCurricularPorcentaje: 0,
  promedioLogroAlumnos: 0,
  puntajeSimceEstimado: 0,
  estadoAvancePME: 'en_progreso',
  ejeMayorFortaleza: 'En proceso de configuración',
  ejeMayorDebilidad: 'En proceso de configuración',
  ultimaEvaluacionFecha: '',
  ultimaEvaluacionTitulo: 'Sin evaluaciones creadas aún',
  ultimaEvaluacionId: '',
  planesRemedialesGenerados: 0,
});

export const AcademicDataProvider: React.FC<AcademicDataProviderProps> = ({
  children,
  currentUser,
  adminBaseProfile,
  isSandboxMode,
  customPruebas,
  docentesReales
}) => {

  const isProduction = useMemo(() => {
    if (isSandboxMode) return false;
    if (!currentUser) return false;

    // ─── DIRECTIVA 9 ───────────────────────────────────────────────────────
    // Detectar producción por sesión (adminBaseProfile), no por email activo.
    // Al supervisar un docente, currentUser.email cambia pero la sesión
    // sigue siendo de producción si adminBaseProfile es el admin real.
    if (adminBaseProfile && PRODUCTION_ADMIN_EMAILS.has(adminBaseProfile.email.toLowerCase().trim())) {
      return true;
    }

    const email = currentUser.email.toLowerCase().trim();

    // Admin de producción
    if (PRODUCTION_ADMIN_EMAILS.has(email)) return true;

    // Cualquier docente real (no demo) que inicia sesión directamente
    // es considerado de producción. Los demo tienen emails @demo.cl etc.
    if (currentUser.rol === 'profesor' && !isDemoUser(email, currentUser.establecimiento)) {
      return true;
    }

    return false;
  }, [currentUser, adminBaseProfile, isSandboxMode]);


  const value = useMemo<DataContextType>(() => {
    const allPruebas = customPruebas || pruebasMock;

    // ═══════════════════════════════════════════════════════════════════
    // ENTORNO DE PRODUCCIÓN
    // ═══════════════════════════════════════════════════════════════════
    if (isProduction) {
      const activeUser = currentUser!;
      const activeEmail = activeUser.email?.toLowerCase().trim() || '';

      // ──────────────────────────────────────────────────────────────────
      // RAMA ESPECIAL: Escuela Premilitar — María Teresa González
      // Esta docente ya tiene pruebas reales creadas (SIMCE Lenguaje).
      // Se mantiene su contexto específico hasta que el sistema genérico
      // de pruebas propias esté en producción (Supabase-driven).
      // ──────────────────────────────────────────────────────────────────
      if (activeEmail === 'mariateresa.gonzalez@premil.cl' || activeEmail === 'luis.leon@premil.cl') {
        const prodPruebas = allPruebas.filter(
          p =>
            p.id === 'prueba-len2m-101' ||
            p.id === 'prueba-len2m-jun-101' ||
            p.id === 'prueba-len2m-abr-101' ||
            p.profesorId === currentUserProfesorPremilitar.id
        );
        return {
          isProduction: true,
          pruebas: prodPruebas,
          cursos: cursosMock.filter(c => c.id === 'curso-2m' || c.nivel.includes('Medio')),
          alumnos: [],
          seguimientoDocentes: [{
            profesorId: currentUserProfesorPremilitar.id,
            profesorNombre: 'María Teresa González',
            profesorEmail: 'mariateresa.gonzalez@premil.cl',
            avatarColor: 'from-emerald-600 to-teal-700',
            iniciales: 'MT',
            asignaturaId: 'asig-2',
            asignaturaNombre: 'Lenguaje y Comunicación',
            cursosAsignados: ['2° Medio'],
            totalEvaluacionesCreadas: prodPruebas.length,
            totalEvaluacionesActivas: prodPruebas.filter(p => p.estado === 'activa').length,
            totalAlumnosEvaluados: 0,
            totalAlumnosMatriculados: 0,
            coberturaCurricularPorcentaje: 100,
            promedioLogroAlumnos: 0,
            puntajeSimceEstimado: 0,
            estadoAvancePME: 'en_progreso',
            ejeMayorFortaleza: 'Pauta oficial SIMCE configurada',
            ejeMayorDebilidad: 'Esperando rendición de estudiantes',
            ultimaEvaluacionFecha: '2026-08-16',
            ultimaEvaluacionTitulo: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026',
            ultimaEvaluacionId: 'prueba-len2m-101',
            planesRemedialesGenerados: 0
          }],
          reporteActivo: reportePremilitarRealMock,
          nombreEstablecimientoActivo: 'Escuela Premilitar Héroes de la Concepción'
        };
      }

      // ──────────────────────────────────────────────────────────────────
      // RAMA GENÉRICA: Cualquier docente real de producción (nuevo)
      // ESTADO VACÍO LEGÍTIMO (Directiva 2): datos se van subiendo
      // paulatinamente. Funciona para el 3er, 4to, 5to colegio etc.
      // ──────────────────────────────────────────────────────────────────
      if (activeUser.rol === 'profesor') {
        // Sus propias pruebas creadas (inicialmente vacío)
        const teacherPruebas = allPruebas.filter(p => p.profesorId === activeUser.id);
        return {
          isProduction: true,
          pruebas: teacherPruebas,       // [] hasta que cree sus propias
          cursos: [],                     // Directiva 2: estado vacío legítimo
          alumnos: [],                    // Directiva 2: estado vacío legítimo
          seguimientoDocentes: [crearSeguimientoVacio(activeUser)],
          reporteActivo: crearReporteVacio(activeUser),
          nombreEstablecimientoActivo: activeUser.establecimiento || 'Establecimiento'
        };
      }

      // ──────────────────────────────────────────────────────────────────
      // RAMA ADMIN: Vista agregada de producción (dinámica con todos los docentes reales)
      // ──────────────────────────────────────────────────────────────────
      const adminPruebas = allPruebas.filter(
        p =>
          p.id === 'prueba-len2m-101' ||
          p.id === 'prueba-len2m-jun-101' ||
          p.id === 'prueba-len2m-abr-101' ||
          p.profesorId === currentUserProfesorPremilitar.id
      );

      const realTeachers = (docentesReales && docentesReales.length > 0)
        ? docentesReales
        : [currentUserProfesorPremilitar, currentUserProfesorMiCasa];

      const dynamicSeguimiento: SeguimientoDocente[] = realTeachers.map(doc => {
        const isPremilitar = doc.email?.toLowerCase().includes('premil.cl') || doc.id === currentUserProfesorPremilitar.id;
        if (isPremilitar) {
          return {
            profesorId: doc.id,
            profesorNombre: `${doc.nombre} ${doc.apellido}`,
            profesorEmail: doc.email,
            avatarColor: 'from-emerald-600 to-teal-700',
            iniciales: iniciales(doc.nombre, doc.apellido),
            asignaturaId: doc.asignaturaId || 'asig-2',
            asignaturaNombre: doc.asignaturaNombre || 'Lenguaje y Comunicación',
            cursosAsignados: ['2° Medio'],
            totalEvaluacionesCreadas: adminPruebas.length,
            totalEvaluacionesActivas: adminPruebas.filter(p => p.estado === 'activa').length,
            totalAlumnosEvaluados: 0,
            totalAlumnosMatriculados: 0,
            coberturaCurricularPorcentaje: 100,
            promedioLogroAlumnos: 0,
            puntajeSimceEstimado: 0,
            estadoAvancePME: 'en_progreso',
            ejeMayorFortaleza: 'Pauta oficial SIMCE configurada',
            ejeMayorDebilidad: 'Esperando rendición de estudiantes',
            ultimaEvaluacionFecha: '2026-08-16',
            ultimaEvaluacionTitulo: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026',
            ultimaEvaluacionId: 'prueba-len2m-101',
            planesRemedialesGenerados: 0
          };
        }

        const docPruebas = allPruebas.filter(p => p.profesorId === doc.id);
        return {
          profesorId: doc.id,
          profesorNombre: `${doc.nombre} ${doc.apellido}`,
          profesorEmail: doc.email,
          avatarColor: avatarColorFromEmail(doc.email),
          iniciales: iniciales(doc.nombre || '', doc.apellido || ''),
          asignaturaId: doc.asignaturaId || '',
          asignaturaNombre: doc.asignaturaNombre || 'En proceso de asignación',
          cursosAsignados: doc.establecimiento ? [doc.establecimiento] : [],
          totalEvaluacionesCreadas: docPruebas.length,
          totalEvaluacionesActivas: docPruebas.filter(p => p.estado === 'activa').length,
          totalAlumnosEvaluados: 0,
          totalAlumnosMatriculados: 0,
          coberturaCurricularPorcentaje: docPruebas.length > 0 ? 50 : 0,
          promedioLogroAlumnos: 0,
          puntajeSimceEstimado: 0,
          estadoAvancePME: 'en_progreso',
          ejeMayorFortaleza: docPruebas.length > 0 ? 'Evaluaciones creadas' : 'En proceso de configuración',
          ejeMayorDebilidad: 'Esperando rendición de estudiantes',
          ultimaEvaluacionFecha: docPruebas[0]?.creadoEn || '',
          ultimaEvaluacionTitulo: docPruebas[0]?.titulo || 'Sin evaluaciones creadas aún',
          ultimaEvaluacionId: docPruebas[0]?.id || '',
          planesRemedialesGenerados: 0
        };
      });

      return {
        isProduction: true,
        pruebas: adminPruebas,
        cursos: cursosMock.filter(c => c.id === 'curso-2m' || c.nivel.includes('Medio')),
        alumnos: [],
        seguimientoDocentes: dynamicSeguimiento,
        reporteActivo: reportePremilitarRealMock,
        nombreEstablecimientoActivo: 'Sysget Saber — Vista Global'
      };
    }

    // ═══════════════════════════════════════════════════════════════════
    // ENTORNO DEMO / SANDBOX: Liceo Bicentenario Los Andes
    // ═══════════════════════════════════════════════════════════════════
    const demoPruebas = allPruebas.filter(
      p =>
        p.id !== 'prueba-len2m-101' &&
        p.id !== 'prueba-len2m-jun-101' &&
        p.id !== 'prueba-len2m-abr-101' &&
        p.profesorId !== currentUserProfesorPremilitar.id
    );

    const filteredDemoPruebas =
      currentUser?.rol === 'profesor' && currentUser?.asignaturaId
        ? demoPruebas.filter(p => p.asignaturaId === currentUser.asignaturaId)
        : demoPruebas;

    const demoCursos = cursosMock.filter(c => c.id !== 'curso-2m' && !c.nivel.includes('Medio'));
    const demoAlumnos = alumnosMock.filter(a => a.cursoId !== 'curso-2m');

    const demoReporte =
      currentUser?.asignaturaId === 'asig-3'
        ? reporteCienciasMock
        : currentUser?.asignaturaId === 'asig-2'
        ? reporteLenguajeDemoMock
        : reporteCursoMock;

    return {
      isProduction: false,
      pruebas: filteredDemoPruebas,
      cursos: demoCursos,
      alumnos: demoAlumnos,
      seguimientoDocentes: seguimientoDocentesMock,
      reporteActivo: demoReporte,
      nombreEstablecimientoActivo: 'Liceo Bicentenario Los Andes (Demo)'
    };

  }, [isProduction, customPruebas, currentUser]);

  return <AcademicDataContext.Provider value={value}>{children}</AcademicDataContext.Provider>;
};

export const useAcademicData = () => {
  const context = useContext(AcademicDataContext);
  if (!context) {
    throw new Error('useAcademicData must be used within an AcademicDataProvider');
  }
  return context;
};
