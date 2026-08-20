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
  isSandboxMode: boolean;
  customPruebas?: Prueba[];
}

export const AcademicDataProvider: React.FC<AcademicDataProviderProps> = ({
  children,
  currentUser,
  isSandboxMode,
  customPruebas
}) => {
  const isProduction = useMemo(() => {
    if (isSandboxMode) return false;
    if (!currentUser) return false;
    const email = currentUser.email.toLowerCase().trim();
    return (
      email === 'leontestvirtual1@gmail.com' ||
      email === 'leontesvirtual1@gmail.com' ||
      email === 'luis.leon@premil.cl'
    );
  }, [currentUser, isSandboxMode]);

  const value = useMemo<DataContextType>(() => {
    const allPruebas = customPruebas || pruebasMock;

    if (isProduction) {
      // ═════════════════════════════════════════════════════════════
      // ENTORNO PRODUCCIÓN: Escuela Premilitar Héroes de la Concepción
      // ═════════════════════════════════════════════════════════════
      const prodPruebas = allPruebas.filter(
        p =>
          p.id === 'prueba-len2m-101' ||
          p.id === 'prueba-len2m-jun-101' ||
          p.id === 'prueba-len2m-abr-101' ||
          p.profesorId === currentUserProfesorPremilitar.id
      );

      const prodCursos = cursosMock.filter(c => c.id === 'curso-2m' || c.nivel.includes('Medio'));
      const prodAlumnos = alumnosMock.filter(a => a.cursoId === 'curso-2m');

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
