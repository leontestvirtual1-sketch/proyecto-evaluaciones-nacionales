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
    // Detectar producción por sesión (adminBaseProfile), no por email activo.
    if (adminBaseProfile && PRODUCTION_ADMIN_EMAILS.has(adminBaseProfile.email.toLowerCase().trim())) {
      return true;
    }

    const email = currentUser.email.toLowerCase().trim();

    // Admin de producción
    if (PRODUCTION_ADMIN_EMAILS.has(email)) return true;

    // Cualquier docente real (no demo) que inicia sesión directamente
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
          cursos: cursosMock.filter(c => c.id === 'curso-prem-2m' || c.id === 'curso-2m' || c.nivel.includes('Medio')),
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
      // RAMA ESPECIAL: Colegio Mi Casa — Susana Angélica Pizarro Valenzuela
      // ──────────────────────────────────────────────────────────────────
      if (activeEmail.includes('susana') || activeEmail === 'nentitasusana@hotmail.com') {
        const susanaCursos = cursosMock.filter(c => c.establecimiento === 'Colegio Mi Casa' || c.profesorId === currentUserProfesorMiCasa.id);
        const susanaPruebas = allPruebas.filter(p => p.profesorId === currentUserProfesorMiCasa.id || p.asignaturaId === 'asig-1');

        return {
          isProduction: true,
          pruebas: susanaPruebas,
          cursos: susanaCursos.length > 0 ? susanaCursos : [
            { id: 'curso-mc-4b', nombre: '4° Básico A', nivel: '4° básico', profesorId: currentUserProfesorMiCasa.id, establecimiento: 'Colegio Mi Casa', anio: 2026, codigoInvitacion: 'MC4B2026' },
            { id: 'curso-mc-6b', nombre: '6° Básico A', nivel: '6° básico', profesorId: currentUserProfesorMiCasa.id, establecimiento: 'Colegio Mi Casa', anio: 2026, codigoInvitacion: 'MC6B2026' },
            { id: 'curso-mc-8b', nombre: '8° Básico A', nivel: '8° básico', profesorId: currentUserProfesorMiCasa.id, establecimiento: 'Colegio Mi Casa', anio: 2026, codigoInvitacion: 'MC8B2026' }
          ],
          alumnos: [],
          seguimientoDocentes: [{
            profesorId: currentUserProfesorMiCasa.id,
            profesorNombre: 'Susana Angélica Pizarro Valenzuela',
            profesorEmail: 'nentitasusana@hotmail.com',
            avatarColor: 'from-amber-600 to-orange-700',
            iniciales: 'SP',
            asignaturaId: 'asig-1',
            asignaturaNombre: 'Matemática',
            cursosAsignados: ['4° Básico', '6° Básico', '8° Básico'],
            totalEvaluacionesCreadas: susanaPruebas.length,
            totalEvaluacionesActivas: susanaPruebas.filter(p => p.estado === 'activa').length,
            totalAlumnosEvaluados: 0,
            totalAlumnosMatriculados: 0,
            coberturaCurricularPorcentaje: 100,
            promedioLogroAlumnos: 0,
            puntajeSimceEstimado: 0,
            estadoAvancePME: 'en_progreso',
            ejeMayorFortaleza: 'Banco curricular de Matemática configurado',
            ejeMayorDebilidad: 'Esperando rendición de estudiantes',
            ultimaEvaluacionFecha: '2026-08-20',
            ultimaEvaluacionTitulo: 'Evaluación Diagnóstica SIMCE Matemática',
            ultimaEvaluacionId: 'prueba-mat-4b-01',
            planesRemedialesGenerados: 0
          }],
          reporteActivo: crearReporteVacio(activeUser),
          nombreEstablecimientoActivo: 'Colegio Mi Casa'
        };
      }

      // ──────────────────────────────────────────────────────────────────
      // RAMA GENÉRICA: Cualquier docente real de producción
      // ──────────────────────────────────────────────────────────────────
      if (activeUser.rol === 'profesor') {
        const teacherPruebas = allPruebas.filter(p => p.profesorId === activeUser.id);
        return {
          isProduction: true,
          pruebas: teacherPruebas,
          cursos: [],
          alumnos: [],
          seguimientoDocentes: [crearSeguimientoVacio(activeUser)],
          reporteActivo: crearReporteVacio(activeUser),
          nombreEstablecimientoActivo: activeUser.establecimiento || 'Establecimiento'
        };
      }

      // ──────────────────────────────────────────────────────────────────
      // RAMA ADMIN: Vista agregada de producción (dinámica con todos los colegios y cursos)
      // ──────────────────────────────────────────────────────────────────
      const adminPruebas = allPruebas.filter(
        p =>
          p.id === 'prueba-len2m-101' ||
          p.id === 'prueba-len2m-jun-101' ||
          p.id === 'prueba-len2m-abr-101' ||
          p.profesorId === currentUserProfesorPremilitar.id ||
          p.profesorId === currentUserProfesorMiCasa.id
      );

      const realTeachers = (docentesReales && docentesReales.length > 0)
        ? docentesReales
        : [currentUserProfesorPremilitar, currentUserProfesorMiCasa];

      const dynamicSeguimiento: SeguimientoDocente[] = realTeachers.map(doc => {
        const isPremilitar = doc.email?.toLowerCase().includes('premil.cl') || doc.id === currentUserProfesorPremilitar.id;
        const isSusana = doc.email?.toLowerCase().includes('susana') || doc.id === currentUserProfesorMiCasa.id;
        
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
            totalEvaluacionesCreadas: 3,
            totalEvaluacionesActivas: 3,
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

        if (isSusana) {
          return {
            profesorId: doc.id,
            profesorNombre: `${doc.nombre} ${doc.apellido}`,
            profesorEmail: doc.email,
            avatarColor: 'from-amber-600 to-orange-700',
            iniciales: iniciales(doc.nombre, doc.apellido),
            asignaturaId: doc.asignaturaId || 'asig-1',
            asignaturaNombre: doc.asignaturaNombre || 'Matemática',
            cursosAsignados: ['4° Básico', '6° Básico', '8° Básico'],
            totalEvaluacionesCreadas: 1,
            totalEvaluacionesActivas: 1,
            totalAlumnosEvaluados: 0,
            totalAlumnosMatriculados: 0,
            coberturaCurricularPorcentaje: 100,
            promedioLogroAlumnos: 0,
            puntajeSimceEstimado: 0,
            estadoAvancePME: 'en_progreso',
            ejeMayorFortaleza: 'Banco curricular de Matemática configurado',
            ejeMayorDebilidad: 'Esperando rendición de estudiantes',
            ultimaEvaluacionFecha: '2026-08-20',
            ultimaEvaluacionTitulo: 'Evaluación Diagnóstica SIMCE Matemática',
            ultimaEvaluacionId: 'prueba-mat-4b-01',
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

      const prodCursos = cursosMock.filter(c =>
        c.id === 'curso-prem-2m' ||
        c.id === 'curso-2m' ||
        c.id === 'curso-mc-4b' ||
        c.id === 'curso-mc-6b' ||
        c.id === 'curso-mc-8b' ||
        c.establecimiento === 'Colegio Mi Casa' ||
        c.establecimiento === 'Escuela Premilitar Héroes de la Concepción'
      );

      return {
        isProduction: true,
        pruebas: adminPruebas.length > 0 ? adminPruebas : pruebasMock.filter(p => p.id.startsWith('prueba-len2m')),
        cursos: prodCursos,
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
