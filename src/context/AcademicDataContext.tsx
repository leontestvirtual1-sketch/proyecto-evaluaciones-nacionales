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

// Directiva 2: la detección de ambiente se basa exclusivamente en las columnas
// es_super_admin y es_demo de la tabla perfiles — sin heurísticas de email.

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
  pruebaTitulo: `${user.establecimiento || 'Establecimiento'} — ${user.asignaturaNombre || 'Asignatura'}`,
  cursoNombre: '4° Básico A / 8° Básico A / 2° Medio A',
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

/** Crea un objeto SeguimientoDocente para un docente */
const crearSeguimientoVacio = (user: UserProfile): SeguimientoDocente => ({
  profesorId: user.id,
  profesorNombre: `${user.nombre} ${user.apellido}`,
  profesorEmail: user.email,
  avatarColor: avatarColorFromEmail(user.email),
  iniciales: iniciales(user.nombre || '', user.apellido || ''),
  asignaturaId: user.asignaturaId || '',
  asignaturaNombre: user.asignaturaNombre || '',
  cursosAsignados: ['4° Básico', '8° Básico', '2° Medio'],
  totalEvaluacionesCreadas: 0,
  totalEvaluacionesActivas: 0,
  totalAlumnosEvaluados: 0,
  totalAlumnosMatriculados: 0,
  coberturaCurricularPorcentaje: 0,
  promedioLogroAlumnos: 0,
  puntajeSimceEstimado: 0,
  estadoAvancePME: 'en_progreso',
  ejeMayorFortaleza: 'Banco curricular configurado',
  ejeMayorDebilidad: 'Esperando rendición de estudiantes',
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
    // Detectar producción por sesión del admin (adminBaseProfile), no por email activo.
    if (adminBaseProfile?.esSuperAdmin) return true;

    // Admin de producción identificado por columna DB es_super_admin
    if (currentUser.esSuperAdmin) return true;

    // Columna canónica es_demo (migración 040) — sin heurísticas de email
    if (currentUser.esDemo === false) return true;
    if (currentUser.esDemo === true) return false;

    // Cualquier docente real (esDemo no definido → asumir producción si rol es profesor y no hay adminBaseProfile demo)
    if (currentUser.rol === 'profesor' && !adminBaseProfile?.esDemo) return true;

    return false;
  }, [currentUser, adminBaseProfile, isSandboxMode]);


  const value = useMemo<DataContextType>(() => {
    // En Producción NO se usa pruebasMock bajo ninguna circunstancia (Directiva 1)
    const allPruebas = isProduction ? (customPruebas || []) : (customPruebas || pruebasMock);

    // ═══════════════════════════════════════════════════════════════════
    // ENTORNO DE PRODUCCIÓN (Multitenant Genérico)
    // ═══════════════════════════════════════════════════════════════════
    if (isProduction) {
      const activeUser = currentUser!;

      // ──────────────────────────────────────────────────────────────────
      // VISTA DOCENTE (Producción)
      // ──────────────────────────────────────────────────────────────────
      if (activeUser.rol === 'profesor') {
        const teacherPruebas = allPruebas.filter(
          p => p.profesorId === activeUser.id || (activeUser.asignaturaId && p.asignaturaId === activeUser.asignaturaId)
        );

        // Directivas 1 y 2: En producción, nunca inyectar cursosMock.
        // Los cursos de producción provienen exclusivamente de useCursos() / Supabase con RLS.
        const teacherCursos: Curso[] = [];

        const docSeguimiento: SeguimientoDocente = {
          profesorId: activeUser.id,
          profesorNombre: `${activeUser.nombre} ${activeUser.apellido}`.trim(),
          profesorEmail: activeUser.email,
          avatarColor: avatarColorFromEmail(activeUser.email),
          iniciales: iniciales(activeUser.nombre || '', activeUser.apellido || ''),
          asignaturaId: activeUser.asignaturaId || '',
          asignaturaNombre: activeUser.asignaturaNombre || 'Especialidad',
          cursosAsignados: teacherCursos.map(c => c.nombre || c.nivel),
          totalEvaluacionesCreadas: teacherPruebas.length,
          totalEvaluacionesActivas: teacherPruebas.filter(p => p.estado === 'activa').length,
          totalAlumnosEvaluados: 0,
          totalAlumnosMatriculados: 0,
          coberturaCurricularPorcentaje: teacherPruebas.length > 0 ? 100 : 0,
          promedioLogroAlumnos: 0,
          puntajeSimceEstimado: 0,
          estadoAvancePME: 'en_progreso',
          ejeMayorFortaleza: teacherPruebas.length > 0 ? 'Pauta oficial configurada' : 'En proceso de configuración',
          ejeMayorDebilidad: 'Esperando rendición de estudiantes',
          ultimaEvaluacionFecha: teacherPruebas[0]?.creadoEn || '',
          ultimaEvaluacionTitulo: teacherPruebas[0]?.titulo || 'Sin evaluaciones creadas aún',
          ultimaEvaluacionId: teacherPruebas[0]?.id || '',
          planesRemedialesGenerados: 0
        };

        // Directiva 2: reporte vacío legítimo para cualquier docente real (sin identificación por nombre)
        const reporteActivo = crearReporteVacio(activeUser);

        return {
          isProduction: true,
          pruebas: teacherPruebas,
          cursos: teacherCursos,
          alumnos: [],
          seguimientoDocentes: [docSeguimiento],
          reporteActivo: reporteActivo,
          nombreEstablecimientoActivo: activeUser.establecimiento || 'Establecimiento Educacional'
        };
      }

      // ──────────────────────────────────────────────────────────────────
      // VISTA SUPER ADMIN (Producción Multitenant)
      // ──────────────────────────────────────────────────────────────────
      const adminPruebas = allPruebas;
      const realTeachers = docentesReales || [];

      const dynamicSeguimiento: SeguimientoDocente[] = realTeachers.map(doc => {
        const docPruebas = allPruebas.filter(p => p.profesorId === doc.id || (doc.asignaturaId && p.asignaturaId === doc.asignaturaId));
        return {
          profesorId: doc.id,
          profesorNombre: `${doc.nombre} ${doc.apellido}`.trim(),
          profesorEmail: doc.email,
          avatarColor: avatarColorFromEmail(doc.email),
          iniciales: iniciales(doc.nombre || '', doc.apellido || ''),
          asignaturaId: doc.asignaturaId || '',
          asignaturaNombre: doc.asignaturaNombre || 'Especialidad',
          cursosAsignados: doc.establecimiento ? [doc.establecimiento] : [],
          totalEvaluacionesCreadas: docPruebas.length,
          totalEvaluacionesActivas: docPruebas.filter(p => p.estado === 'activa').length,
          totalAlumnosEvaluados: 0,
          totalAlumnosMatriculados: 0,
          coberturaCurricularPorcentaje: docPruebas.length > 0 ? 100 : 0,
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

      // Directivas 1 y 2: En producción, nunca inyectar cursosMock.
      // El Super Admin supervisa cursos reales desde useCursos() / Supabase con RLS.
      const prodCursos: Curso[] = [];

      return {
        isProduction: true,
        pruebas: adminPruebas,
        cursos: prodCursos,
        alumnos: [],
        seguimientoDocentes: dynamicSeguimiento,
        reporteActivo: crearReporteVacio(currentUser || { id: 'superadmin', rut: '1-9', nombre: 'Administrador', apellido: '', email: '', rol: 'admin', establecimiento: 'Sysget Saber', rbd: undefined, asignaturaId: undefined, asignaturaNombre: undefined, cargo: undefined, estado: 'activo', plan: 'institucional', esSuperAdmin: true, esDemo: false }),
        nombreEstablecimientoActivo: 'Sysget Saber — Vista Global'
      };
    }

    // ═══════════════════════════════════════════════════════════════════
    // ENTORNO DEMO / SANDBOX: Liceo Bicentenario Los Andes
    // ═══════════════════════════════════════════════════════════════════
    // Demo: excluir evaluaciones de nivel 2° Medio que pertenecen a colegios reales
    const demoPruebas = allPruebas.filter(
      p =>
        p.id !== 'prueba-len2m-101' &&
        p.id !== 'prueba-len2m-jun-101' &&
        p.id !== 'prueba-len2m-abr-101'
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
