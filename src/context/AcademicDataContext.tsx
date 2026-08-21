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
  currentUserAdmin,
  currentUserAdminDemo
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

    // Caso normal: el admin, María Teresa o Susana están logueados directamente
    const email = currentUser.email.toLowerCase().trim();
    return (
      PRODUCTION_ADMIN_EMAILS.has(email) ||
      email === 'luis.leon@premil.cl' ||
      email === 'nentitasusana@hotmail.com'
    );
  }, [currentUser, adminBaseProfile, isSandboxMode]);

  const value = useMemo<DataContextType>(() => {
    const allPruebas = customPruebas || pruebasMock;

    if (isProduction) {
      // ═════════════════════════════════════════════════════════════
      // ENTORNO PRODUCCIÓN: Escuela Premilitar Héroes de la Concepción
      // ESTADO VACÍO LEGÍTIMO: Los alumnos reales aún no han sido
      // ingresados al sistema. Se devuelve [] según DIRECTIVAS.md.
      // ═════════════════════════════════════════════════════════════
      const prodPruebas = allPruebas.filter(
        p =>
          p.id === 'prueba-len2m-101' ||
          p.id === 'prueba-len2m-jun-101' ||
          p.id === 'prueba-len2m-abr-101' ||
          p.profesorId === currentUserProfesorPremilitar.id
      );

      const prodCursos = cursosMock.filter(c => c.id === 'curso-2m' || c.nivel.includes('Medio'));
      // ESTADO VACÍO LEGÍTIMO: sin alumnos reales aún. No usar mocks.
      const prodAlumnos: AlumnoBasico[] = [];

      return {
        isProduction: true,
        pruebas: prodPruebas,
        cursos: prodCursos,
        alumnos: prodAlumnos, // [] — estado legítimo hasta que se creen alumnos reales
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
