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
}

const PRODUCTION_ADMIN_EMAILS = new Set([
  'leontestvirtual1@gmail.com',
  'leontesvirtual1@gmail.com',
]);

// Emails directos de docentes reales de producción
const PRODUCTION_DOCENTE_EMAILS = new Set([
  'luis.leon@premil.cl',
  'nentitasusana@hotmail.com',
]);

export const AcademicDataProvider: React.FC<AcademicDataProviderProps> = ({
  children,
  currentUser,
  adminBaseProfile,
  isSandboxMode,
  customPruebas
}) => {
  const isProduction = useMemo(() => {
    if (isSandboxMode) return false;
    if (!currentUser) return false;

    // ─── DIRECTIVA 9: Detección de Producción por Sesión, no por email del usuario activo ───
    // Si el admin de producción está supervisando a un docente real (switchToDocente),
    // currentUser.email es el del docente (ej. Susana), PERO adminBaseProfile.email
    // sigue siendo leontestvirtual1@gmail.com. La sesión ES de producción.
    if (adminBaseProfile && PRODUCTION_ADMIN_EMAILS.has(adminBaseProfile.email.toLowerCase().trim())) {
      return true;
    }

    const email = currentUser.email.toLowerCase().trim();
    return PRODUCTION_ADMIN_EMAILS.has(email) || PRODUCTION_DOCENTE_EMAILS.has(email);
  }, [currentUser, adminBaseProfile, isSandboxMode]);

  // Determina si el usuario activo es Susana (Colegio Mi Casa)
  const isSusana = useMemo(() => {
    const email = (currentUser?.email || '').toLowerCase().trim();
    return (
      email === 'nentitasusana@hotmail.com' ||
      (currentUser?.establecimiento || '').toLowerCase().includes('mi casa')
    );
  }, [currentUser]);

  const value = useMemo<DataContextType>(() => {
    const allPruebas = customPruebas || pruebasMock;

    if (isProduction) {

      // ═══════════════════════════════════════════════════════════════════
      // RAMA A: Colegio Mi Casa — Susana Angélica Pizarro (Matemática)
      // ESTADO VACÍO LEGÍTIMO (Directiva 2): Docente nueva en proceso de
      // poblamiento. Sin cursos, alumnos ni pruebas propias aún.
      // Puede visualizar los ensayos del banco como referencia pedagógica.
      // ═══════════════════════════════════════════════════════════════════
      if (isSusana) {
        // Solo sus pruebas propias (0 hasta que las cree en la plataforma)
        const susanaPruebas = allPruebas.filter(
          p => p.profesorId === currentUserProfesorMiCasa.id
        );

        const reporteVacioMiCasa: ReporteTabuladoCurso = {
          ...reporteCursoMock,
          pruebaId: 'reporte-micasa-vacio',
          pruebaTitulo: 'Colegio Mi Casa — Matemática (En proceso de población)',
          cursoNombre: 'Sin cursos asignados aún',
          totalAlumnosRendidos: 0,
          totalAlumnosMatriculados: 0,
          promedioPorcentajeLogro: 0,
          promedioEscalaNacional: 0,
          desgloseEjes: [],
          desgloseHabilidades: [],
          preguntasMasFalladas: [],
          planAccionReforzamiento: [],
          rendiciones: []
        };

        const susanaSeguimiento: SeguimientoDocente = {
          profesorId: currentUserProfesorMiCasa.id,
          profesorNombre: 'Susana Angélica Pizarro Valenzuela',
          profesorEmail: 'nentitasusana@hotmail.com',
          avatarColor: 'from-violet-600 to-purple-700',
          iniciales: 'SP',
          asignaturaId: 'asig-1',
          asignaturaNombre: 'Matemática',
          cursosAsignados: [],
          totalEvaluacionesCreadas: 0,
          totalEvaluacionesActivas: 0,
          totalAlumnosEvaluados: 0,
          totalAlumnosMatriculados: 0,
          coberturaCurricularPorcentaje: 0,
          promedioLogroAlumnos: 0,
          puntajeSimceEstimado: 0,
          estadoAvancePME: 'en_progreso', // valor válido del tipo (equivalente a "iniciando")
          ejeMayorFortaleza: 'En proceso de configuración',
          ejeMayorDebilidad: 'En proceso de configuración',
          ultimaEvaluacionFecha: '',
          ultimaEvaluacionTitulo: 'Sin evaluaciones creadas aún',
          ultimaEvaluacionId: '',
          planesRemedialesGenerados: 0
        };

        return {
          isProduction: true,
          pruebas: susanaPruebas,      // [] — estado vacío legítimo hasta que cree sus propias
          cursos: [],                   // [] — sin cursos aún (Directiva 2)
          alumnos: [],                  // [] — sin alumnos aún (Directiva 2)
          seguimientoDocentes: [susanaSeguimiento],
          reporteActivo: reporteVacioMiCasa,
          nombreEstablecimientoActivo: 'Colegio Mi Casa'
        };
      }

      // ═══════════════════════════════════════════════════════════════════
      // RAMA B: Escuela Premilitar Héroes de la Concepción — María Teresa González
      // ESTADO VACÍO LEGÍTIMO: Alumnos reales aún no registrados.
      // ═══════════════════════════════════════════════════════════════════
      const prodPruebas = allPruebas.filter(
        p =>
          p.id === 'prueba-len2m-101' ||
          p.id === 'prueba-len2m-jun-101' ||
          p.id === 'prueba-len2m-abr-101' ||
          p.profesorId === currentUserProfesorPremilitar.id
      );

      const prodCursos = cursosMock.filter(c => c.id === 'curso-2m' || c.nivel.includes('Medio'));
      const prodAlumnos: AlumnoBasico[] = [];

      return {
        isProduction: true,
        pruebas: prodPruebas,
        cursos: prodCursos,
        alumnos: prodAlumnos,
        seguimientoDocentes: [
          {
            profesorId: currentUserProfesorPremilitar.id,
            profesorNombre: 'María Teresa González',
            profesorEmail: 'luis.leon@premil.cl',
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
          }
        ],
        reporteActivo: reportePremilitarRealMock,
        nombreEstablecimientoActivo: 'Escuela Premilitar Héroes de la Concepción'
      };

    } else {
      // ═════════════════════════════════════════════════════════════
      // ENTORNO DEMO / SANDBOX: Liceo Bicentenario Los Andes (6° y 8° Básico)
      // ═════════════════════════════════════════════════════════════
      const demoPruebas = allPruebas.filter(
        p =>
          p.id !== 'prueba-len2m-101' &&
          p.id !== 'prueba-len2m-jun-101' &&
          p.id !== 'prueba-len2m-abr-101' &&
          p.profesorId !== currentUserProfesorPremilitar.id
      );

      // Si es docente demo específico (Matemática o Ciencias), filtrar a su especialidad
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
    }
  }, [isProduction, isSusana, customPruebas, currentUser]);

  return <AcademicDataContext.Provider value={value}>{children}</AcademicDataContext.Provider>;
};

export const useAcademicData = () => {
  const context = useContext(AcademicDataContext);
  if (!context) {
    throw new Error('useAcademicData must be used within an AcademicDataProvider');
  }
  return context;
};
