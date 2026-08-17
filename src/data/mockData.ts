import { APP_CONFIG } from '../config/appConfig';

import {
  Asignatura,
  EjeTematico,
  Habilidad,
  Pregunta,
  Curso,
  Prueba,
  RendicionPrueba,
  UserProfile,
  ReporteTabuladoCurso,
  SeguimientoDocente,
  AlumnoBasico,
  EstablecimientoInfo
} from '../types';

import {
  ejesTematicosLenguaje2MMock,
  cursoLenguaje2MMock,
  alumnosLenguaje2MMock,
  pruebaLenguaje2MMock,
  preguntasLenguaje2MMock
} from './len2mQuestionsMock';

export const establecimientosCatalog: EstablecimientoInfo[] = [
  {
    rbd: '31030',
    nombre: 'Escuela Premilitar Héroes de la Concepción',
    comuna: 'La Granja, Región Metropolitana',
    dependencia: 'Particular Subvencionado',
    logoUrl: '/logos/escuela-premilitar.png',
    lema: 'Ad Altiora, Et Meliora, Semper'
  }
];

export const currentUserAdmin: UserProfile = {
  id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99',
  rut: '10.703.767-5',
  nombre: 'Luis Andrés',
  apellido: 'León González',
  email: 'leontestvirtual1@gmail.com',
  rol: 'admin',
  establecimiento: 'Sysget Saber',
  cargo: 'Super Administrador / Fundador',
  estado: 'activo',
  plan: 'institucional'
};

export const currentUserProfesorPremilitar: UserProfile = {
  id: '98e7e5c9-e55d-4b47-bd5d-c6aabd463d18',
  rut: '18.359.422-2',
  nombre: 'María Teresa',
  apellido: 'González',
  email: 'luis.leon@premil.cl',
  rol: 'profesor',
  establecimiento: 'Escuela Premilitar Héroes de la Concepción',
  rbd: '31030',
  logoUrl: '/logos/escuela-premilitar.png',
  asignaturaId: 'asig-2',
  asignaturaNombre: 'Lenguaje y Comunicación',
  cargo: 'Docente de Lenguaje y Comunicación',
  estado: 'activo',
  plan: 'trial',
  diasRestantesTrial: 30
};

/** Usuario Admin de demostración — acceso controlado solo para mostrar el panel */
export const currentUserAdminDemo: UserProfile = {
  id: 'demo-admin-0000-0000-0000-000000000099',
  rut: '11.111.111-1',
  nombre: 'AdminDemo',
  apellido: 'Sysget',
  email: 'admin@escuelademo.cl',
  rol: 'admin',
  establecimiento: 'Escuela Demo — Sysget Saber',
  cargo: 'Administrador Demo (Solo Lectura)',
  estado: 'activo',
  plan: 'trial'
};



export const currentUserProfesor: UserProfile = {
  id: '00000000-0000-0000-0000-000000000001',
  rut: '12.345.678-9',
  nombre: 'María',
  apellido: 'González',
  email: 'maria.gonzalez@sysget.cl',
  rol: 'profesor',
  establecimiento: APP_CONFIG.nombreEstablecimiento,
  asignaturaId: 'asig-1',
  asignaturaNombre: 'Matemática',
  cargo: 'Docente de Matemática',
  estado: 'activo',
  plan: 'institucional'
};

export const currentUserProfesorCiencias: UserProfile = {
  id: '00000000-0000-0000-0000-000000000004',
  rut: '13.456.789-0',
  nombre: 'Patricia',
  apellido: 'Muñoz',
  email: 'patricia.munoz@sysget.cl',
  rol: 'profesor',
  establecimiento: APP_CONFIG.nombreEstablecimiento,
  asignaturaId: 'asig-3',
  asignaturaNombre: 'Ciencias Naturales',
  cargo: 'Docente de Ciencias Naturales',
  estado: 'activo',
  plan: 'institucional'
};

export const currentUserProfesorLenguaje: UserProfile = {
  id: '00000000-0000-0000-0000-000000000003',
  rut: '14.567.890-1',
  nombre: 'Carlos',
  apellido: 'Morales',
  email: 'carlos.morales@sysget.cl',
  rol: 'profesor',
  establecimiento: APP_CONFIG.nombreEstablecimiento,
  asignaturaId: 'asig-2',
  asignaturaNombre: 'Lenguaje y Comunicación',
  cargo: 'Docente de Lenguaje y Comunicación',
  estado: 'activo',
  plan: 'institucional'
};

export const currentUserAlumno: UserProfile = {
  id: '00000000-0000-0000-0000-000000000002',
  rut: '22.876.543-0',
  nombre: 'Pedro',
  apellido: 'Soto',
  email: 'pedro.soto@sysget.cl',
  rol: 'alumno',
  establecimiento: APP_CONFIG.nombreEstablecimiento,
  estado: 'activo',
  plan: 'institucional'
};

export const demoProfesoresMock: UserProfile[] = [
  currentUserProfesor,         // María González — Matemática (Liceo Bicentenario Los Andes)
  currentUserProfesorLenguaje, // Carlos Morales — Lenguaje y Comunicación (Liceo Bicentenario Los Andes)
  currentUserProfesorCiencias  // Patricia Muñoz — Ciencias Naturales (Liceo Bicentenario Los Andes)
];

export const usuariosRegistradosMock: UserProfile[] = [
  currentUserAdmin,
  currentUserProfesorPremilitar // María Teresa González — Lenguaje (Escuela Premilitar)
];

export const alumnosMock: AlumnoBasico[] = [
  ...alumnosLenguaje2MMock,
  // 8° Básico A (curso-1)
  { id: 'alu-001', rut: '21.001.001-1', nombre: 'Camila', apellido: 'Araya Pérez', cursoId: 'curso-1', cursoNombre: '8° Básico A', numeroDeLista: 1 },
  { id: 'alu-002', rut: '21.002.002-2', nombre: 'Diego', apellido: 'Bravo Soto', cursoId: 'curso-1', cursoNombre: '8° Básico A', numeroDeLista: 2 },
  { id: 'alu-003', rut: '21.003.003-3', nombre: 'Fernanda', apellido: 'Castro Muñoz', cursoId: 'curso-1', cursoNombre: '8° Básico A', numeroDeLista: 3 },
  { id: 'alu-004', rut: '21.004.004-4', nombre: 'Gabriel', apellido: 'Díaz Rojas', cursoId: 'curso-1', cursoNombre: '8° Básico A', numeroDeLista: 4 },
  { id: 'alu-005', rut: '21.005.005-5', nombre: 'Isidora', apellido: 'Espinoza Lagos', cursoId: 'curso-1', cursoNombre: '8° Básico A', numeroDeLista: 5 },
  { id: 'alu-006', rut: '21.006.006-6', nombre: 'Joaquín', apellido: 'Fuentes Vera', cursoId: 'curso-1', cursoNombre: '8° Básico A', numeroDeLista: 6 },
  { id: 'alu-007', rut: '21.007.007-7', nombre: 'Valentina', apellido: 'González Silva', cursoId: 'curso-1', cursoNombre: '8° Básico A', numeroDeLista: 7 },
  { id: 'alu-008', rut: '21.008.008-8', nombre: 'Matías', apellido: 'Herrera Torres', cursoId: 'curso-1', cursoNombre: '8° Básico A', numeroDeLista: 8 },
  { id: 'alu-009', rut: '21.009.009-9', nombre: 'Catalina', apellido: 'Ibáñez Morales', cursoId: 'curso-1', cursoNombre: '8° Básico A', numeroDeLista: 9 },
  { id: 'alu-010', rut: '21.010.010-K', nombre: 'Rodrigo', apellido: 'Jiménez Pizarro', cursoId: 'curso-1', cursoNombre: '8° Básico A', numeroDeLista: 10 },
  { id: 'alu-011', rut: '21.011.011-0', nombre: 'Sofía', apellido: 'López Navarro', cursoId: 'curso-1', cursoNombre: '8° Básico A', numeroDeLista: 11 },
  { id: 'alu-012', rut: '21.012.012-1', nombre: 'Sebastián', apellido: 'Molina Vargas', cursoId: 'curso-1', cursoNombre: '8° Básico A', numeroDeLista: 12 },
  { id: 'alu-013', rut: '21.013.013-2', nombre: 'Antonia', apellido: 'Núñez Reyes', cursoId: 'curso-1', cursoNombre: '8° Básico A', numeroDeLista: 13 },
  { id: 'alu-014', rut: '21.014.014-3', nombre: 'Pablo', apellido: 'Ortega Fuentes', cursoId: 'curso-1', cursoNombre: '8° Básico A', numeroDeLista: 14 },
  { id: 'alu-015', rut: '21.015.015-4', nombre: 'María Paz', apellido: 'Palma Gutiérrez', cursoId: 'curso-1', cursoNombre: '8° Básico A', numeroDeLista: 15 },
  // 6° Básico B (curso-2)
  { id: 'alu-016', rut: '21.016.016-5', nombre: 'Tomás', apellido: 'Quintero Ramos', cursoId: 'curso-2', cursoNombre: '6° Básico B', numeroDeLista: 1 },
  { id: 'alu-017', rut: '21.017.017-6', nombre: 'Emilia', apellido: 'Rojas Cáceres', cursoId: 'curso-2', cursoNombre: '6° Básico B', numeroDeLista: 2 },
  { id: 'alu-018', rut: '21.018.018-7', nombre: 'Benjamín', apellido: 'Soto Alarcón', cursoId: 'curso-2', cursoNombre: '6° Básico B', numeroDeLista: 3 },
  { id: 'alu-019', rut: '21.019.019-8', nombre: 'Renata', apellido: 'Torres Mendoza', cursoId: 'curso-2', cursoNombre: '6° Básico B', numeroDeLista: 4 },
  { id: 'alu-020', rut: '21.020.020-9', nombre: 'Felipe', apellido: 'Urrutia Campos', cursoId: 'curso-2', cursoNombre: '6° Básico B', numeroDeLista: 5 },
  { id: 'alu-021', rut: '21.021.021-K', nombre: 'Natalia', apellido: 'Vidal Sepúlveda', cursoId: 'curso-2', cursoNombre: '6° Básico B', numeroDeLista: 6 },
  { id: 'alu-022', rut: '21.022.022-0', nombre: 'Ignacio', apellido: 'Yáñez Contreras', cursoId: 'curso-2', cursoNombre: '6° Básico B', numeroDeLista: 7 },
  { id: 'alu-023', rut: '21.023.023-1', nombre: 'Daniela', apellido: 'Acuña Palacios', cursoId: 'curso-2', cursoNombre: '6° Básico B', numeroDeLista: 8 },
  { id: 'alu-024', rut: '21.024.024-2', nombre: 'Andrés', apellido: 'Blanco Fuenzalida', cursoId: 'curso-2', cursoNombre: '6° Básico B', numeroDeLista: 9 },
  { id: 'alu-025', rut: '21.025.025-3', nombre: 'Carolina', apellido: 'Cruz Méndez', cursoId: 'curso-2', cursoNombre: '6° Básico B', numeroDeLista: 10 },
];

export const seguimientoDocentesMock: SeguimientoDocente[] = [
  {
    profesorId: currentUserProfesorPremilitar.id,
    profesorNombre: 'María Teresa González',
    profesorEmail: 'luis.leon@premil.cl',
    avatarColor: 'from-emerald-600 to-teal-700',
    iniciales: 'MT',
    asignaturaId: 'asig-2',
    asignaturaNombre: 'Lenguaje y Comunicación',
    cursosAsignados: ['2° Medio'],
    totalEvaluacionesCreadas: 1,
    totalEvaluacionesActivas: 1,
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
  },

  {
    profesorId: currentUserProfesor.id,
    profesorNombre: 'María González',
    profesorEmail: 'maria.gonzalez@escuelademo.cl',
    avatarColor: 'from-indigo-600 to-violet-700',
    iniciales: 'MG',
    asignaturaId: 'asig-1',
    asignaturaNombre: 'Matemática',
    cursosAsignados: ['8° Básico A', '8° Básico B'],
    totalEvaluacionesCreadas: 5,
    totalEvaluacionesActivas: 2,
    totalAlumnosEvaluados: 58,
    totalAlumnosMatriculados: 60,
    coberturaCurricularPorcentaje: 82,
    promedioLogroAlumnos: 64.5,
    puntajeSimceEstimado: 258,
    estadoAvancePME: 'en_progreso',
    ejeMayorFortaleza: 'Números y Operaciones (76% logro)',
    ejeMayorDebilidad: 'Álgebra y Funciones (42% logro - Foco crítico)',
    ultimaEvaluacionFecha: '2026-08-14',
    ultimaEvaluacionTitulo: 'Evaluación Diagnóstica Nacional de Matemática 8° Básico',
    ultimaEvaluacionId: 'prueba-101',
    planesRemedialesGenerados: 6
  },
  {
    profesorId: currentUserProfesorCiencias.id,
    profesorNombre: 'Patricia Muñoz',
    profesorEmail: 'patricia.munoz@escuelademo.cl',
    avatarColor: 'from-sky-600 to-cyan-700',
    iniciales: 'PM',
    asignaturaId: 'asig-3',
    asignaturaNombre: 'Ciencias Naturales',
    cursosAsignados: ['6° Básico A', '6° Básico B'],
    totalEvaluacionesCreadas: 4,
    totalEvaluacionesActivas: 2,
    totalAlumnosEvaluados: 56,
    totalAlumnosMatriculados: 58,
    coberturaCurricularPorcentaje: 88,
    promedioLogroAlumnos: 71.2,
    puntajeSimceEstimado: 272,
    estadoAvancePME: 'en_meta',
    ejeMayorFortaleza: 'Sistemas del Cuerpo Humano (81% logro)',
    ejeMayorDebilidad: 'Concepto de Célula y Microscopía (54% logro)',
    ultimaEvaluacionFecha: '2026-08-14',
    ultimaEvaluacionTitulo: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico',
    ultimaEvaluacionId: 'prueba-cn6b-101',
    planesRemedialesGenerados: 4
  },
  {
    profesorId: currentUserProfesorLenguaje.id,
    profesorNombre: 'Carlos Morales',
    profesorEmail: 'carlos.morales@escuelademo.cl',
    avatarColor: 'from-purple-600 to-fuchsia-700',
    iniciales: 'CM',
    asignaturaId: 'asig-2',
    asignaturaNombre: 'Lenguaje y Comunicación',
    cursosAsignados: ['6° Básico A', '8° Básico A'],
    totalEvaluacionesCreadas: 4,
    totalEvaluacionesActivas: 1,
    totalAlumnosEvaluados: 54,
    totalAlumnosMatriculados: 58,
    coberturaCurricularPorcentaje: 79,
    promedioLogroAlumnos: 67.8,
    puntajeSimceEstimado: 265,
    estadoAvancePME: 'en_progreso',
    ejeMayorFortaleza: 'Textos Informativos y Medios (78% logro)',
    ejeMayorDebilidad: 'Comprensión e Inferencia Textual (48% logro)',
    ultimaEvaluacionFecha: '2026-08-13',
    ultimaEvaluacionTitulo: 'Ensayo SIMCE Comprensión Lectora 8° Básico',
    ultimaEvaluacionId: 'prueba-102',
    planesRemedialesGenerados: 5
  },
  {
    profesorId: 'prof-004',
    profesorNombre: 'Rodrigo Fuentes',
    profesorEmail: 'rodrigo.fuentes@escuelademo.cl',
    avatarColor: 'from-amber-600 to-orange-700',
    iniciales: 'RF',
    asignaturaId: 'asig-1',
    asignaturaNombre: 'Matemática (Nivelación)',
    cursosAsignados: ['7° Básico A', '8° Básico B'],
    totalEvaluacionesCreadas: 3,
    totalEvaluacionesActivas: 1,
    totalAlumnosEvaluados: 48,
    totalAlumnosMatriculados: 54,
    coberturaCurricularPorcentaje: 65,
    promedioLogroAlumnos: 49.0,
    puntajeSimceEstimado: 238,
    estadoAvancePME: 'requiere_apoyo',
    ejeMayorFortaleza: 'Geometría y Figuras 2D (58% logro)',
    ejeMayorDebilidad: 'Ecuaciones y Despeje Algebraico (32% logro)',
    ultimaEvaluacionFecha: '2026-08-11',
    ultimaEvaluacionTitulo: 'Control Nivelación Matemática 7° y 8° Básico',
    ultimaEvaluacionId: 'prueba-101',
    planesRemedialesGenerados: 8
  }
];

export const asignaturasMock: Asignatura[] = [


  { id: 'asig-1', codigo: 'MAT', nombre: 'Matemática' },

  { id: 'asig-2', codigo: 'LEN', nombre: 'Lenguaje y Comunicación' },

  { id: 'asig-3', codigo: 'CN', nombre: 'Ciencias Naturales' }

];



export const ejesTematicosMock: EjeTematico[] = [

  ...ejesTematicosLenguaje2MMock,

  { id: 'eje-mat-1', codigo: 'MAT-NUM-8', nombre: 'Números y Operaciones', asignaturaId: 'asig-1' },

  { id: 'eje-mat-2', codigo: 'MAT-ALG-8', nombre: 'Álgebra y Funciones', asignaturaId: 'asig-1' },

  { id: 'eje-mat-3', codigo: 'MAT-GEO-8', nombre: 'Geometría', asignaturaId: 'asig-1' },

  { id: 'eje-mat-4', codigo: 'MAT-PRO-8', nombre: 'Probabilidad y Estadística', asignaturaId: 'asig-1' },

  { id: 'eje-len-1', codigo: 'LEN-LEC-8', nombre: 'Comprensión Lectora (Textos Literarios)', asignaturaId: 'asig-2' },

  { id: 'eje-len-2', codigo: 'LEN-INF-8', nombre: 'Textos No Literarios e Informativos', asignaturaId: 'asig-2' },

  // Ciencias Naturales 6° Básico

  { id: 'eje-cie-6b-1', codigo: 'CIE-OA01', nombre: 'Concepto de célula', asignaturaId: 'asig-3' },

  { id: 'eje-cie-6b-2', codigo: 'CIE-OA02', nombre: 'Estructuras principales del sistema digestivo', asignaturaId: 'asig-3' },

  { id: 'eje-cie-6b-3', codigo: 'CIE-OA03', nombre: 'Estructuras del sistema respiratorio', asignaturaId: 'asig-3' },

  { id: 'eje-cie-6b-4', codigo: 'CIE-OA04', nombre: 'Estructuras del sistema circulatorio', asignaturaId: 'asig-3' },

  { id: 'eje-cie-6b-5', codigo: 'CIE-OA05', nombre: 'Clasificación de alimentos según función', asignaturaId: 'asig-3' },

  { id: 'eje-cie-6b-6', codigo: 'CIE-OA06', nombre: 'Características del cigarrillo y humo del tabaco', asignaturaId: 'asig-3' },

  { id: 'eje-cie-6b-7', codigo: 'CIE-OA07', nombre: 'Características de bacterias virus y hongos', asignaturaId: 'asig-3' },

  { id: 'eje-cie-6b-8', codigo: 'CIE-OA08', nombre: 'Requerimientos de la fotosíntesis', asignaturaId: 'asig-3' },

  { id: 'eje-cie-6b-9', codigo: 'CIE-OA09', nombre: 'Organismos fotosintéticos y su rol', asignaturaId: 'asig-3' },

  { id: 'eje-cie-6b-10', codigo: 'CIE-OA10', nombre: 'Estructuras del sistema reproductor femenino', asignaturaId: 'asig-3' },

  { id: 'eje-cie-6b-11', codigo: 'CIE-OA11', nombre: 'Aportes científicos en el estudio de la energía', asignaturaId: 'asig-3' },

  { id: 'eje-cie-6b-12', codigo: 'CIE-OA12', nombre: 'Componentes de un circuito simple', asignaturaId: 'asig-3' },

  { id: 'eje-cie-6b-13', codigo: 'CIE-OA13', nombre: 'Propiedades de materiales conductores y aislantes', asignaturaId: 'asig-3' },

  { id: 'eje-cie-6b-14', codigo: 'CIE-OA14', nombre: 'Importancia de la energía eléctrica', asignaturaId: 'asig-3' },

  { id: 'eje-cie-6b-15', codigo: 'CIE-OA15', nombre: 'Características físicas según profundidad', asignaturaId: 'asig-3' },

  { id: 'eje-cie-6b-16', codigo: 'CIE-OA16', nombre: 'Reservas hídricas de Chile', asignaturaId: 'asig-3' },

  { id: 'eje-cie-6b-17', codigo: 'CIE-OA17', nombre: 'Capas de la Tierra y sus características', asignaturaId: 'asig-3' },

  { id: 'eje-cie-6b-18', codigo: 'CIE-OA18', nombre: 'Concepto de erosión terrestre', asignaturaId: 'asig-3' },

];



export const habilidadesMock: Habilidad[] = [

  { id: 'hab-mat-1', codigo: 'MAT-RES', nombre: 'Resolver Problemas', asignaturaId: 'asig-1' },

  { id: 'hab-mat-2', codigo: 'MAT-APL', nombre: 'Aplicar Algoritmos y Conceptos', asignaturaId: 'asig-1' },

  { id: 'hab-mat-3', codigo: 'MAT-RAZ', nombre: 'Razonar y Argumentar', asignaturaId: 'asig-1' },

  { id: 'hab-mat-4', codigo: 'MAT-MOD', nombre: 'Modelar situaciones', asignaturaId: 'asig-1' },

  { id: 'hab-len-1', codigo: 'LEN-LOC', nombre: 'Localizar Información', asignaturaId: 'asig-2' },

  { id: 'hab-len-2', codigo: 'LEN-INT', nombre: 'Interpretar y Relacionar', asignaturaId: 'asig-2' },

  { id: 'hab-len-3', codigo: 'LEN-REF', nombre: 'Reflexionar e Inferir', asignaturaId: 'asig-2' },

  { id: 'hab-cie-1', codigo: 'CIE-CON', nombre: 'Conocimiento y Comprensión', asignaturaId: 'asig-3' },

  { id: 'hab-cie-2', codigo: 'CIE-APL', nombre: 'Aplicación', asignaturaId: 'asig-3' },

  { id: 'hab-cie-3', codigo: 'CIE-RAZ', nombre: 'Razonamiento y Pensamiento Científico', asignaturaId: 'asig-3' },

];



export const preguntasMock: Pregunta[] = [

  ...preguntasLenguaje2MMock,

  // === 1. MATEMÁTICA Y LENGUAJE 8° BÁSICO ===

  // 1. Números - Aplicación

  {

    id: 'preg-1',

    asignaturaId: 'asig-1',

    ejeTematicoId: 'eje-mat-1',

    habilidadId: 'hab-mat-2',

    tipo: 'seleccion_multiple',

    nivel: '8° Básico',

    dificultad: 'media',

    enunciado: 'Un curso compró 2 cajas de plumones. Cada caja contenía 10 plumones. Repartieron esos plumones en partes iguales entre 4 grupos de trabajo. ¿Cuántos plumones recibió cada grupo?',

    alternativas: [

      { letra: 'A', texto: '3 plumones', es_correcta: false },

      { letra: 'B', texto: '5 plumones', es_correcta: true },

      { letra: 'C', texto: '8 plumones', es_correcta: false },

      { letra: 'D', texto: '16 plumones', es_correcta: false }

    ],

    respuestaCorrecta: 'B',

    puntaje: 1,

    fuente: 'Liberada Oficial'

  },

  // 2. Álgebra - Razonamiento

  {

    id: 'preg-2',

    asignaturaId: 'asig-1',

    ejeTematicoId: 'eje-mat-2',

    habilidadId: 'hab-mat-3',

    tipo: 'seleccion_multiple',

    nivel: '8° Básico',

    dificultad: 'alta',

    enunciado: 'Cierto juego consiste en dar un paso hacia adelante si se saca una ficha azul y un paso hacia atrás si se saca una ficha roja. Si Juan sacó 20 fichas en total y terminó 2 pasos más adelante de donde partió, ¿cuántas fichas de cada color sacó?',

    alternativas: [

      { letra: 'A', texto: '8 azules y 12 rojas', es_correcta: false },

      { letra: 'B', texto: '10 azules y 10 rojas', es_correcta: false },

      { letra: 'C', texto: '11 azules y 9 rojas', es_correcta: true },

      { letra: 'D', texto: '12 azules y 8 rojas', es_correcta: false }

    ],

    respuestaCorrecta: 'C',

    puntaje: 1,

    fuente: 'Liberada Oficial'

  },

  // 3. Geometría - Aplicación (CRÍTICA)

  {

    id: 'preg-3',

    asignaturaId: 'asig-1',

    ejeTematicoId: 'eje-mat-3',

    habilidadId: 'hab-mat-2',

    tipo: 'seleccion_multiple',

    nivel: '8° Básico',

    dificultad: 'media',

    enunciado: 'Un terreno rectangular mide 12 metros de largo y 9 metros de ancho. Si el dueño quiere dividir el terreno trazando una cerca en la diagonal principal, ¿cuál es la longitud total de la cerca diagonal?',

    alternativas: [

      { letra: 'A', texto: '12 metros', es_correcta: false },

      { letra: 'B', texto: '15 metros', es_correcta: true },

      { letra: 'C', texto: '21 metros', es_correcta: false },

      { letra: 'D', texto: '25 metros', es_correcta: false }

    ],

    respuestaCorrecta: 'B',

    puntaje: 1,

    fuente: 'Banco Institucional'

  },

  // 4. Geometría - Razonamiento (CRÍTICA)

  {

    id: 'preg-4',

    asignaturaId: 'asig-1',

    ejeTematicoId: 'eje-mat-3',

    habilidadId: 'hab-mat-3',

    tipo: 'seleccion_multiple',

    nivel: '8° Básico',

    dificultad: 'alta',

    enunciado: 'Un triángulo tiene lados que miden 6 cm, 8 cm y 10 cm. ¿Es este un triángulo rectángulo y cuál es la razón matemática correcta?',

    alternativas: [

      { letra: 'A', texto: 'Sí, porque cumple el Teorema de Pitágoras (6² + 8² = 10²)', es_correcta: true },

      { letra: 'B', texto: 'No, porque 6 + 8 es distinto de 10', es_correcta: false },

      { letra: 'C', texto: 'Sí, porque todos sus lados son números pares', es_correcta: false },

      { letra: 'D', texto: 'No se puede determinar sin medir sus ángulos interiores', es_correcta: false }

    ],

    respuestaCorrecta: 'A',

    puntaje: 1,

    fuente: 'Liberada Oficial'

  },

  // 5. Probabilidades - Resolver Problemas

  {

    id: 'preg-5',

    asignaturaId: 'asig-1',

    ejeTematicoId: 'eje-mat-4',

    habilidadId: 'hab-mat-1',

    tipo: 'seleccion_multiple',

    nivel: '8° Básico',

    dificultad: 'media',

    enunciado: 'En una bolsa hay 5 bolitas rojas, 3 azules y 2 verdes. Si se saca una bolita al azar, ¿cuál es la probabilidad de extraer una bolita de color azul?',

    alternativas: [

      { letra: 'A', texto: '3/10 (30%)', es_correcta: true },

      { letra: 'B', texto: '3/8 (37.5%)', es_correcta: false },

      { letra: 'C', texto: '5/10 (50%)', es_correcta: false },

      { letra: 'D', texto: '2/10 (20%)', es_correcta: false }

    ],

    respuestaCorrecta: 'A',

    puntaje: 1,

    fuente: 'Banco Institucional'

  },

  // 6. Pregunta de Desarrollo (Álgebra)

  {

    id: 'preg-6',

    asignaturaId: 'asig-1',

    ejeTematicoId: 'eje-mat-2',

    habilidadId: 'hab-mat-4',

    tipo: 'desarrollo',

    nivel: '8° Básico',

    dificultad: 'media',

    enunciado: 'Explica paso a paso cómo resolver la ecuación 2x + 8 = 20. Escribe el valor final de x y justifica tu procedimiento despejando la incógnita.',

    alternativas: [],

    respuestaCorrecta: null,

    puntaje: 2,

    fuente: 'Elaboración Docente'

  },

  // 7. Porcentajes y Proporcionalidad - Números

  {

    id: 'preg-7',

    asignaturaId: 'asig-1',

    ejeTematicoId: 'eje-mat-1',

    habilidadId: 'hab-mat-2',

    tipo: 'seleccion_multiple',

    nivel: '8° Básico',

    dificultad: 'media',

    enunciado: 'Una chaqueta cuesta $40.000 y se encuentra con un descuento del 25%. ¿Cuánto se paga finalmente por la chaqueta?',

    alternativas: [

      { letra: 'A', texto: '$10.000', es_correcta: false },

      { letra: 'B', texto: '$25.000', es_correcta: false },

      { letra: 'C', texto: '$30.000', es_correcta: true },

      { letra: 'D', texto: '$35.000', es_correcta: false }

    ],

    respuestaCorrecta: 'C',

    puntaje: 1,

    fuente: 'Liberada Oficial'

  },

  // 8. Geometría - ├ürea del círculo

  {

    id: 'preg-8',

    asignaturaId: 'asig-1',

    ejeTematicoId: 'eje-mat-3',

    habilidadId: 'hab-mat-1',

    tipo: 'seleccion_multiple',

    nivel: '8° Básico',

    dificultad: 'baja',

    enunciado: '¿Cuál es el área de un círculo cuyo radio mide 5 cm? (Considere π ≈ 3,14)',

    alternativas: [

      { letra: 'A', texto: '15,7 cm²', es_correcta: false },

      { letra: 'B', texto: '31,4 cm²', es_correcta: false },

      { letra: 'C', texto: '78,5 cm²', es_correcta: true },

      { letra: 'D', texto: '100 cm²', es_correcta: false }

    ],

    respuestaCorrecta: 'C',

    puntaje: 1,

    fuente: 'Banco Institucional'

  },

  // 9. Funciones y Ecuaciones - II Medio

  {

    id: 'preg-9',

    asignaturaId: 'asig-1',

    ejeTematicoId: 'eje-mat-2',

    habilidadId: 'hab-mat-4',

    tipo: 'seleccion_multiple',

    nivel: 'II medio',

    dificultad: 'media',

    enunciado: 'Dada la función afín f(x) = 3x - 5, ¿cuál es el valor de f(4)?',

    alternativas: [

      { letra: 'A', texto: '7', es_correcta: true },

      { letra: 'B', texto: '12', es_correcta: false },

      { letra: 'C', texto: '17', es_correcta: false },

      { letra: 'D', texto: '-7', es_correcta: false }

    ],

    respuestaCorrecta: 'A',

    puntaje: 1,

    fuente: 'Liberada Oficial PAES'


  },

  // === BANCO EXTENDIDO MATEMÁTICA 8° BÁSICO (preg-30 a preg-50) ===

  { id: 'preg-30', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-1', habilidadId: 'hab-mat-2',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'baja',
    enunciado: 'El precio de un artículo aumentó de $8.000 a $10.000. ¿Cuánto fue el porcentaje de aumento?',
    alternativas: [
      { letra: 'A', texto: '20%', es_correcta: false },
      { letra: 'B', texto: '25%', es_correcta: true },
      { letra: 'C', texto: '30%', es_correcta: false },
      { letra: 'D', texto: '80%', es_correcta: false }
    ], respuestaCorrecta: 'B', puntaje: 1, fuente: 'Banco Institucional' },

  { id: 'preg-31', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-2', habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'media',
    enunciado: 'Resuelve la ecuación: 3x − 7 = 14. ¿Cuál es el valor de x?',
    alternativas: [
      { letra: 'A', texto: 'x = 5', es_correcta: false },
      { letra: 'B', texto: 'x = 6', es_correcta: false },
      { letra: 'C', texto: 'x = 7', es_correcta: true },
      { letra: 'D', texto: 'x = 9', es_correcta: false }
    ], respuestaCorrecta: 'C', puntaje: 1, fuente: 'Liberada Oficial' },

  { id: 'preg-32', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-3', habilidadId: 'hab-mat-2',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'media',
    enunciado: 'Un ángulo exterior de un polígono regular mide 40°. ¿Cuántos lados tiene el polígono?',
    alternativas: [
      { letra: 'A', texto: '7 lados', es_correcta: false },
      { letra: 'B', texto: '8 lados', es_correcta: false },
      { letra: 'C', texto: '9 lados', es_correcta: true },
      { letra: 'D', texto: '10 lados', es_correcta: false }
    ], respuestaCorrecta: 'C', puntaje: 1, fuente: 'Banco Institucional' },

  { id: 'preg-33', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-4', habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'baja',
    enunciado: 'Se lanza un dado justo de 6 caras. ¿Cuál es la probabilidad de obtener un número par?',
    alternativas: [
      { letra: 'A', texto: '1/6', es_correcta: false },
      { letra: 'B', texto: '1/3', es_correcta: false },
      { letra: 'C', texto: '1/2', es_correcta: true },
      { letra: 'D', texto: '2/3', es_correcta: false }
    ], respuestaCorrecta: 'C', puntaje: 1, fuente: 'Liberada Oficial' },

  { id: 'preg-34', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-1', habilidadId: 'hab-mat-3',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'alta',
    enunciado: 'En una tienda venden tres productos cuyos precios son $1.500, $2.300 y $3.200. Si compras uno de cada tipo y pagas con un billete de $10.000, ¿cuánto de vuelto recibes?',
    alternativas: [
      { letra: 'A', texto: '$2.800', es_correcta: false },
      { letra: 'B', texto: '$3.000', es_correcta: true },
      { letra: 'C', texto: '$3.200', es_correcta: false },
      { letra: 'D', texto: '$4.000', es_correcta: false }
    ], respuestaCorrecta: 'B', puntaje: 1, fuente: 'Banco Institucional' },

  { id: 'preg-35', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-2', habilidadId: 'hab-mat-4',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'media',
    enunciado: 'El doble de un número menos 5 es igual a 13. ¿Cuál es ese número?',
    alternativas: [
      { letra: 'A', texto: '4', es_correcta: false },
      { letra: 'B', texto: '7', es_correcta: false },
      { letra: 'C', texto: '9', es_correcta: true },
      { letra: 'D', texto: '11', es_correcta: false }
    ], respuestaCorrecta: 'C', puntaje: 1, fuente: 'Liberada Oficial' },

  { id: 'preg-36', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-3', habilidadId: 'hab-mat-3',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'media',
    enunciado: 'Un rectángulo tiene un perímetro de 28 cm y su largo mide el doble de su ancho. ¿Cuánto mide el ancho?',
    alternativas: [
      { letra: 'A', texto: '4 cm', es_correcta: false },
      { letra: 'B', texto: '5 cm', es_correcta: false },
      { letra: 'C', texto: '6 cm', es_correcta: false },
      { letra: 'D', texto: '4,67 cm', es_correcta: true }
    ], respuestaCorrecta: 'D', puntaje: 1, fuente: 'Banco Institucional' },

  { id: 'preg-37', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-4', habilidadId: 'hab-mat-2',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'media',
    enunciado: 'Las edades de 5 estudiantes son: 12, 14, 13, 15 y 11 años. ¿Cuál es el promedio (media aritmética) de sus edades?',
    alternativas: [
      { letra: 'A', texto: '12 años', es_correcta: false },
      { letra: 'B', texto: '13 años', es_correcta: true },
      { letra: 'C', texto: '14 años', es_correcta: false },
      { letra: 'D', texto: '15 años', es_correcta: false }
    ], respuestaCorrecta: 'B', puntaje: 1, fuente: 'Liberada Oficial' },

  { id: 'preg-38', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-1', habilidadId: 'hab-mat-2',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'baja',
    enunciado: '¿Cuál de los siguientes números es divisible por 3 Y por 5 simultáneamente?',
    alternativas: [
      { letra: 'A', texto: '25', es_correcta: false },
      { letra: 'B', texto: '30', es_correcta: true },
      { letra: 'C', texto: '35', es_correcta: false },
      { letra: 'D', texto: '45', es_correcta: false }
    ], respuestaCorrecta: 'B', puntaje: 1, fuente: 'Banco Institucional' },

  { id: 'preg-39', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-2', habilidadId: 'hab-mat-3',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'alta',
    enunciado: 'Si a + b = 10 y a − b = 4, ¿cuánto vale a × b?',
    alternativas: [
      { letra: 'A', texto: '16', es_correcta: false },
      { letra: 'B', texto: '21', es_correcta: true },
      { letra: 'C', texto: '24', es_correcta: false },
      { letra: 'D', texto: '40', es_correcta: false }
    ], respuestaCorrecta: 'B', puntaje: 1, fuente: 'Liberada Oficial PAES' },

  { id: 'preg-40', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-3', habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'baja',
    enunciado: 'Un cubo tiene una arista que mide 4 cm. ¿Cuál es su volumen?',
    alternativas: [
      { letra: 'A', texto: '16 cm³', es_correcta: false },
      { letra: 'B', texto: '24 cm³', es_correcta: false },
      { letra: 'C', texto: '48 cm³', es_correcta: false },
      { letra: 'D', texto: '64 cm³', es_correcta: true }
    ], respuestaCorrecta: 'D', puntaje: 1, fuente: 'Banco Institucional' },

  { id: 'preg-41', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-4', habilidadId: 'hab-mat-3',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'alta',
    enunciado: 'De un grupo de 50 estudiantes, 30 prefieren Matemática y 20 prefieren Lenguaje. Si se elige un estudiante al azar, ¿cuál es la probabilidad de que prefiera Lenguaje?',
    alternativas: [
      { letra: 'A', texto: '2/3', es_correcta: false },
      { letra: 'B', texto: '2/5', es_correcta: true },
      { letra: 'C', texto: '3/5', es_correcta: false },
      { letra: 'D', texto: '1/2', es_correcta: false }
    ], respuestaCorrecta: 'B', puntaje: 1, fuente: 'Banco Institucional' },

  { id: 'preg-42', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-1', habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'media',
    enunciado: '¿Cuál es el resultado de: (−3)² + (−2)³?',
    alternativas: [
      { letra: 'A', texto: '−17', es_correcta: false },
      { letra: 'B', texto: '1', es_correcta: true },
      { letra: 'C', texto: '17', es_correcta: false },
      { letra: 'D', texto: '−1', es_correcta: false }
    ], respuestaCorrecta: 'B', puntaje: 1, fuente: 'Liberada Oficial' },

  { id: 'preg-43', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-2', habilidadId: 'hab-mat-2',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'media',
    enunciado: 'Simplifica la expresión algebraica: 4x + 3y − 2x + y.',
    alternativas: [
      { letra: 'A', texto: '2x + 4y', es_correcta: true },
      { letra: 'B', texto: '6x + 4y', es_correcta: false },
      { letra: 'C', texto: '2x + 2y', es_correcta: false },
      { letra: 'D', texto: '6x + 2y', es_correcta: false }
    ], respuestaCorrecta: 'A', puntaje: 1, fuente: 'Banco Institucional' },

  { id: 'preg-44', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-3', habilidadId: 'hab-mat-2',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'media',
    enunciado: 'Un triángulo tiene una base de 10 cm y una altura de 6 cm. ¿Cuál es su área?',
    alternativas: [
      { letra: 'A', texto: '16 cm²', es_correcta: false },
      { letra: 'B', texto: '30 cm²', es_correcta: true },
      { letra: 'C', texto: '60 cm²', es_correcta: false },
      { letra: 'D', texto: '32 cm²', es_correcta: false }
    ], respuestaCorrecta: 'B', puntaje: 1, fuente: 'Liberada Oficial' },

  { id: 'preg-45', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-1', habilidadId: 'hab-mat-3',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'alta',
    enunciado: 'María tiene 3/4 de un litro de jugo y su hermano tiene 2/3 de un litro. Si los juntan, ¿cuánto jugo tienen en total?',
    alternativas: [
      { letra: 'A', texto: '5/7 L', es_correcta: false },
      { letra: 'B', texto: '6/7 L', es_correcta: false },
      { letra: 'C', texto: '17/12 L', es_correcta: true },
      { letra: 'D', texto: '5/12 L', es_correcta: false }
    ], respuestaCorrecta: 'C', puntaje: 1, fuente: 'Banco Institucional' },

  { id: 'preg-46', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-4', habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'baja',
    enunciado: 'En un gráfico de barras se muestra que 15 alumnos prefieren fútbol, 10 básquetbol y 5 tenis. ¿Qué porcentaje del total prefiere fútbol?',
    alternativas: [
      { letra: 'A', texto: '25%', es_correcta: false },
      { letra: 'B', texto: '40%', es_correcta: false },
      { letra: 'C', texto: '50%', es_correcta: true },
      { letra: 'D', texto: '60%', es_correcta: false }
    ], respuestaCorrecta: 'C', puntaje: 1, fuente: 'Liberada Oficial' },

  { id: 'preg-47', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-2', habilidadId: 'hab-mat-4',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'media',
    enunciado: 'Pedro trabaja 5 horas al día y gana $2.500 por hora. Si quiere ahorrar $30.000, ¿cuántos días deberá trabajar?',
    alternativas: [
      { letra: 'A', texto: '2 días', es_correcta: false },
      { letra: 'B', texto: '3 días', es_correcta: false },
      { letra: 'C', texto: '4 días', es_correcta: false },
      { letra: 'D', texto: '2,4 días', es_correcta: true }
    ], respuestaCorrecta: 'D', puntaje: 1, fuente: 'Banco Institucional' },

  { id: 'preg-48', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-3', habilidadId: 'hab-mat-3',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'alta',
    enunciado: 'En la figura, dos rectas paralelas son cortadas por una transversal. Si uno de los ángulos alternos internos mide 65°, ¿cuánto mide su ángulo correspondiente?',
    alternativas: [
      { letra: 'A', texto: '25°', es_correcta: false },
      { letra: 'B', texto: '115°', es_correcta: false },
      { letra: 'C', texto: '65°', es_correcta: true },
      { letra: 'D', texto: '90°', es_correcta: false }
    ], respuestaCorrecta: 'C', puntaje: 1, fuente: 'Liberada Oficial' },

  { id: 'preg-49', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-1', habilidadId: 'hab-mat-2',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'media',
    enunciado: 'Una empresa fabrica 240 productos por hora. ¿Cuántos productos fabrica en 7,5 horas?',
    alternativas: [
      { letra: 'A', texto: '1.600', es_correcta: false },
      { letra: 'B', texto: '1.700', es_correcta: false },
      { letra: 'C', texto: '1.800', es_correcta: true },
      { letra: 'D', texto: '2.000', es_correcta: false }
    ], respuestaCorrecta: 'C', puntaje: 1, fuente: 'Banco Institucional' },

  { id: 'preg-50', asignaturaId: 'asig-1', ejeTematicoId: 'eje-mat-2', habilidadId: 'hab-mat-3',
    tipo: 'seleccion_multiple', nivel: '8° Básico', dificultad: 'alta',
    enunciado: 'Si 2(x + 3) = 4x − 2, ¿cuánto vale x?',
    alternativas: [
      { letra: 'A', texto: 'x = 2', es_correcta: false },
      { letra: 'B', texto: 'x = 3', es_correcta: false },
      { letra: 'C', texto: 'x = 4', es_correcta: true },
      { letra: 'D', texto: 'x = 5', es_correcta: false }
    ], respuestaCorrecta: 'C', puntaje: 1, fuente: 'Liberada Oficial PAES' },

  

  // 12. Ciencias Naturales - Biología

  {

    id: 'preg-12',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-1',

    habilidadId: 'hab-cie-1',

    tipo: 'seleccion_multiple',

    nivel: '8° Básico',

    dificultad: 'baja',

    enunciado: '¿Cuál de los siguientes organelos celulares es responsable de realizar la fotosíntesis en las células vegetales?',

    alternativas: [

      { letra: 'A', texto: 'Mitocondria', es_correcta: false },

      { letra: 'B', texto: 'Cloroplasto', es_correcta: true },

      { letra: 'C', texto: 'Núcleo', es_correcta: false },

      { letra: 'D', texto: 'Ribosoma', es_correcta: false }

    ],

    respuestaCorrecta: 'B',

    puntaje: 1,

    fuente: 'Liberada Oficial'

  },

  // 13. Ciencias Naturales - Física

  {

    id: 'preg-13',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-2',

    habilidadId: 'hab-cie-2',

    tipo: 'seleccion_multiple',

    nivel: 'II medio',

    dificultad: 'media',

    enunciado: 'Según la Primera Ley de Newton (Ley de Inercia), ¿qué le sucede a un objeto en movimiento si no actúa ninguna fuerza neta sobre él?',

    alternativas: [

      { letra: 'A', texto: 'Se detiene inmediatamente.', es_correcta: false },

      { letra: 'B', texto: 'Aumenta su velocidad gradualmente.', es_correcta: false },

      { letra: 'C', texto: 'Continúa moviéndose en línea recta a velocidad constante.', es_correcta: true },

      { letra: 'D', texto: 'Comienza a girar en círculos.', es_correcta: false }

    ],

    respuestaCorrecta: 'C',

    puntaje: 1,

    fuente: 'Liberada Oficial PAES'

  },

  // 14. Ciencias Naturales - Química

  {

    id: 'preg-14',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-3',

    habilidadId: 'hab-cie-3',

    tipo: 'seleccion_multiple',

    nivel: '8° Básico',

    dificultad: 'media',

    enunciado: 'Si se disuelven 20 gramos de sal en 100 gramos de agua pura, ¿cuál es el soluto y cuál es el solvente en esta solución?',

    alternativas: [

      { letra: 'A', texto: 'La sal es el soluto y el agua es el solvente.', es_correcta: true },

      { letra: 'B', texto: 'El agua es el soluto y la sal es el solvente.', es_correcta: false },

      { letra: 'C', texto: 'Ambos son solutos.', es_correcta: false },

      { letra: 'D', texto: 'No se forma una solución homogénea.', es_correcta: false }

    ],

    respuestaCorrecta: 'A',

    puntaje: 1,

    fuente: 'Banco Institucional'

  },

  // 15. Desarrollo - Ciencias

  {

    id: 'preg-15',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-1',

    habilidadId: 'hab-cie-3',

    tipo: 'desarrollo',

    nivel: '8° Básico',

    dificultad: 'alta',

    enunciado: 'Describe el impacto de la deforestación masiva en el ciclo del carbono y la acumulación de dióxido de carbono (CO2) en la atmósfera.',

    alternativas: [],

    respuestaCorrecta: null,

    puntaje: 3,

    fuente: 'Elaboración Docente'

  },

  // 16. Lectura - Idea Principal

  {

    id: 'preg-16',

    asignaturaId: 'asig-2',

    ejeTematicoId: 'eje-len-1',

    habilidadId: 'hab-len-2',

    tipo: 'seleccion_multiple',

    nivel: '8° Básico',

    dificultad: 'media',

    enunciado: '¿Cuál es el tema central o idea principal de un artículo que analiza la migración de las aves durante el otoño hacia zonas más cálidas?',

    alternativas: [

      { letra: 'A', texto: 'La velocidad de vuelo de las aves rapaces en cautiverio.', es_correcta: false },

      { letra: 'B', texto: 'Las causas climáticas y biológicas de la migración estacional de las aves.', es_correcta: true },

      { letra: 'C', texto: 'El tipo de alimentación de los mamíferos durante el invierno.', es_correcta: false },

      { letra: 'D', texto: 'La construcción de nidos en zonas de alta cordillera.', es_correcta: false }

    ],

    respuestaCorrecta: 'B',

    puntaje: 1,

    fuente: 'Liberada Oficial SIMCE'

  },

  // 17. Lectura - Vocabulario Contextual

  {

    id: 'preg-17',

    asignaturaId: 'asig-2',

    ejeTematicoId: 'eje-len-2',

    habilidadId: 'hab-len-1',

    tipo: 'seleccion_multiple',

    nivel: '8° Básico',

    dificultad: 'media',

    enunciado: 'En la frase: "La científica mostró un compromiso INQUEBRANTABLE con la protección de los glaciares", ¿qué término reemplaza mejor a la palabra resaltada?',

    alternativas: [

      { letra: 'A', texto: 'Fragil', es_correcta: false },

      { letra: 'B', texto: 'Firme', es_correcta: true },

      { letra: 'C', texto: 'Temporal', es_correcta: false },

      { letra: 'D', texto: 'Dudoso', es_correcta: false }

    ],

    respuestaCorrecta: 'B',

    puntaje: 1,

    fuente: 'Banco Institucional'

  },

  // 18. Lectura - Textos Argumentativos

  {

    id: 'preg-18',

    asignaturaId: 'asig-2',

    ejeTematicoId: 'eje-len-2',

    habilidadId: 'hab-len-3',

    tipo: 'seleccion_multiple',

    nivel: '8° Básico',

    dificultad: 'alta',

    enunciado: '¿Cuál es la función de un argumento dentro de una carta al director publicada en un periódico nacional?',

    alternativas: [

      { letra: 'A', texto: 'Respaldar con razones fundadas la postura o tesis sostenida por el autor.', es_correcta: true },

      { letra: 'B', texto: 'Narrar cronológicamente una secuencia de acontecimientos ficticios.', es_correcta: false },

      { letra: 'C', texto: 'Definir el significado de palabras técnicas o científicas poco comunes.', es_correcta: false },

      { letra: 'D', texto: 'Enumerar los datos biográficos de una personalidad histórica.', es_correcta: false }

    ],

    respuestaCorrecta: 'A',

    puntaje: 1,

    fuente: 'Liberada Oficial PAES'

  },

  // 19. Lectura - Inferencia Global

  {

    id: 'preg-19',

    asignaturaId: 'asig-2',

    ejeTematicoId: 'eje-len-1',

    habilidadId: 'hab-len-3',

    tipo: 'seleccion_multiple',

    nivel: '8° Básico',

    dificultad: 'media',

    enunciado: 'Si un relato describe el rostro preocupado de una madre mirando constantemente el reloj mientras espera la llegada del tren nocturno, ¿qué actitud se infiere de la protagonista?',

    alternativas: [

      { letra: 'A', texto: 'Indiferencia absoluta ante la llegada del tren.', es_correcta: false },

      { letra: 'B', texto: 'Ansiedad e impaciencia por el arribo de su ser querido.', es_correcta: true },

      { letra: 'C', texto: 'Alegría desbordante y festiva.', es_correcta: false },

      { letra: 'D', texto: 'Enojo con la compañía de ferrocarriles.', es_correcta: false }

    ],

    respuestaCorrecta: 'B',

    puntaje: 1,

    fuente: 'Liberada Oficial SIMCE'

  },

  // 20. Lectura - Desarrollo Comprensión

  {

    id: 'preg-20',

    asignaturaId: 'asig-2',

    ejeTematicoId: 'eje-len-2',

    habilidadId: 'hab-len-3',

    tipo: 'desarrollo',

    nivel: '8° Básico',

    dificultad: 'alta',

    enunciado: 'Redacte una breve postura argumentativa (mínimo 3 líneas) señalando la importancia del uso responsable de las redes sociales en jóvenes escolares.',

    alternativas: [],

    respuestaCorrecta: null,

    puntaje: 2,

    fuente: 'Elaboración Docente'

  },

  // === 2. CIENCIAS NATURALES 6° BÁSICO (SIMCE OFICIAL) ===

  {

    id: 'preg-cn6b-01',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-1',

    habilidadId: 'hab-cie-1',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'baja',

    enunciado: '¿Cuál de estos ejemplos corresponde al nivel de organización más básico de los seres vivos?',

    alternativas: [

      { letra: 'A', texto: 'El corazón.', es_correcta: false },

      { letra: 'B', texto: 'El glóbulo rojo.', es_correcta: true },

      { letra: 'C', texto: 'El sistema óseo.', es_correcta: false },

      { letra: 'D', texto: 'El tejido muscular.', es_correcta: false }

    ],

    respuestaCorrecta: 'B',

    puntaje: 3,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-02',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-2',

    habilidadId: 'hab-cie-1',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'baja',

    enunciado: '¿Qué función realiza el estómago en el sistema digestivo?',

    alternativas: [

      { letra: 'A', texto: 'Secreta los jugos gástricos que permiten la formación del quilo.', es_correcta: false },

      { letra: 'B', texto: 'Forma el quimo permitiendo que este avance hacia el intestino delgado.', es_correcta: true },

      { letra: 'C', texto: 'Elabora el bolo alimenticio que contiene las sustancias para disgregar los nutrientes.', es_correcta: false },

      { letra: 'D', texto: 'Absorbe gran parte de los nutrientes a través de microvellosidades transportándolos a la sangre.', es_correcta: false }

    ],

    respuestaCorrecta: 'B',

    puntaje: 3,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-03',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-2',

    habilidadId: 'hab-cie-3',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'alta',

    enunciado: 'En un estudio científico, se midió la cantidad de un nutriente que permanecía dentro del sistema digestivo a medida que avanzaba por los distintos órganos. El siguiente gráfico muestra los resultados obtenidos.\n\nConsiderando la información del gráfico, ¿en qué estructura del sistema digestivo fue absorbida la mayor parte del nutriente?',

    imagenUrl: '/preguntas/simce_cn_6b/p03_nutrientes.png',

    alternativas: [

      { letra: 'A', texto: 'En la boca.', es_correcta: false },

      { letra: 'B', texto: 'En el estómago.', es_correcta: false },

      { letra: 'C', texto: 'En el intestino grueso.', es_correcta: false },

      { letra: 'D', texto: 'En el intestino delgado.', es_correcta: true }

    ],

    respuestaCorrecta: 'D',

    puntaje: 5,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-04',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-3',

    habilidadId: 'hab-cie-1',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'baja',

    enunciado: '¿Qué estructura del sistema respiratorio es la encargada de conducir el aire directamente hacia los bronquios?',

    alternativas: [

      { letra: 'A', texto: 'Pulmón', es_correcta: false },

      { letra: 'B', texto: 'Alvéolo', es_correcta: false },

      { letra: 'C', texto: 'Tráquea', es_correcta: true },

      { letra: 'D', texto: 'Fosa nasal', es_correcta: false }

    ],

    respuestaCorrecta: 'C',

    puntaje: 3,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-05',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-3',

    habilidadId: 'hab-cie-3',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'alta',

    enunciado: 'Un grupo de estudiantes midió su frecuencia respiratoria (cantidad de respiraciones por minuto) antes y después de realizar tres actividades de distinta intensidad. La siguiente tabla muestra el promedio de los resultados obtenidos:\n\n| Tipo de Actividad | Frecuencia Respiratoria Inicial (resp/min) | Frecuencia Respiratoria Final (resp/min) |\n|---|---|---|\n| Estar sentado (Reposo) | 18 | 20 |\n| Caminata suave | 18 | 32 |\n| Carrera rápida | 18 | 55 |\n\nSegún los resultados, ¿cuál de estas es una conclusión correcta al aumentar la intensidad de la actividad física?',

    alternativas: [

      { letra: 'A', texto: 'La frecuencia respiratoria se mantiene constante para conservar energía.', es_correcta: false },

      { letra: 'B', texto: 'La frecuencia respiratoria aumenta para satisfacer la necesidad de oxígeno del cuerpo.', es_correcta: true },

      { letra: 'C', texto: 'La frecuencia respiratoria aumenta porque el corazón bombea más lento durante el ejercicio.', es_correcta: false },

      { letra: 'D', texto: 'La frecuencia respiratoria aumenta para impedir que ingrese dióxido de carbono desde el aire.', es_correcta: false }

    ],

    respuestaCorrecta: 'B',

    puntaje: 5,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-06',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-4',

    habilidadId: 'hab-cie-1',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'baja',

    enunciado: '¿Cuál de estos procesos involucra directamente a los sistemas respiratorio y circulatorio?',

    alternativas: [

      { letra: 'A', texto: 'La formación de orina.', es_correcta: false },

      { letra: 'B', texto: 'El intercambio de gases.', es_correcta: true },

      { letra: 'C', texto: 'La ventilación pulmonar.', es_correcta: false },

      { letra: 'D', texto: 'La absorción de nutrientes.', es_correcta: false }

    ],

    respuestaCorrecta: 'B',

    puntaje: 3,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-07',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-4',

    habilidadId: 'hab-cie-2',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'media',

    enunciado: 'El siguiente esquema muestra una obstrucción en la vena cava superior del corazón humano.\n\n¿Cuál sería la consecuencia directa de esta obstrucción?',

    imagenUrl: '/preguntas/simce_cn_6b/p07_venacava.png',

    alternativas: [

      { letra: 'A', texto: 'El corazón dejaría de recibir la sangre proveniente de las piernas y el abdomen.', es_correcta: false },

      { letra: 'B', texto: 'El corazón bombearía un mayor volumen de sangre al resto de los órganos del cuerpo.', es_correcta: false },

      { letra: 'C', texto: 'La sangre con dióxido de carbono proveniente de la cabeza y los brazos no podría regresar al corazón.', es_correcta: true },

      { letra: 'D', texto: 'La sangre proveniente de los pulmones no podría ingresar al corazón para ser distribuida al resto del cuerpo.', es_correcta: false }

    ],

    respuestaCorrecta: 'C',

    puntaje: 4,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-08',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-5',

    habilidadId: 'hab-cie-2',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'media',

    enunciado: 'Luego de un control médico a una persona le recomendaron aumentar el consumo de alimentos ricos en hierro. ¿Cuál de estos alimentos debería integrar a su dieta?',

    alternativas: [

      { letra: 'A', texto: 'Leche', es_correcta: false },

      { letra: 'B', texto: 'Lentejas', es_correcta: true },

      { letra: 'C', texto: 'Zanahoria', es_correcta: false },

      { letra: 'D', texto: 'Arroz blanco', es_correcta: false }

    ],

    respuestaCorrecta: 'B',

    puntaje: 4,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-09',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-5',

    habilidadId: 'hab-cie-2',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'media',

    enunciado: '¿Qué consecuencia directa tendría una persona al eliminar por completo el consumo de alimentos que contengan lípidos?',

    alternativas: [

      { letra: 'A', texto: 'Sus músculos perderían la capacidad de contraerse y relajarse con fuerza.', es_correcta: false },

      { letra: 'B', texto: 'Su cuerpo quedaría sin reserva de energía para situaciones de emergencia.', es_correcta: true },

      { letra: 'C', texto: 'Su energía se agotaría rápidamente al realizar actividad física breve e intensa.', es_correcta: false },

      { letra: 'D', texto: 'Sus huesos se volverían frágiles dificultando la capacidad de sostener el peso del cuerpo.', es_correcta: false }

    ],

    respuestaCorrecta: 'B',

    puntaje: 4,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-10',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-6',

    habilidadId: 'hab-cie-1',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'baja',

    enunciado: '¿Cuál de estas alteraciones del sistema cardiovascular podría presentar una persona que ha fumado por más de 25 años una cajetilla diaria?',

    alternativas: [

      { letra: 'A', texto: 'Inflamación de bronquios.', es_correcta: false },

      { letra: 'B', texto: 'Dilatación de vasos sanguíneos.', es_correcta: false },

      { letra: 'C', texto: 'Obstrucción de vasos sanguíneos.', es_correcta: true },

      { letra: 'D', texto: 'Disminución de latidos del corazón.', es_correcta: false }

    ],

    respuestaCorrecta: 'C',

    puntaje: 3,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-11',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-7',

    habilidadId: 'hab-cie-3',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'alta',

    enunciado: 'Un equipo de investigación quería saber qué producto de limpieza es más efectivo para eliminar bacterias. Para ello, prepararon 3 muestras de cultivo idénticas, cada una con 100.000 microorganismos. Luego realizaron lo siguiente:\n- A la muestra 1 le agregaron agua.\n- A la muestra 2 le agregaron cloro.\n- A la muestra 3 le agregaron povidona.\nDespués de esperar 2 horas, contaron la cantidad de microorganismos que sobrevivieron en cada placa.\n\nEn este diseño experimental, ¿cuál es la variable independiente?',

    alternativas: [

      { letra: 'A', texto: 'El tipo de sustancia aplicado a cada muestra.', es_correcta: true },

      { letra: 'B', texto: 'La cantidad inicial de microorganismos por muestra.', es_correcta: false },

      { letra: 'C', texto: 'La cantidad final de microorganismos vivos en cada muestra.', es_correcta: false },

      { letra: 'D', texto: 'El tiempo de espera luego de aplicar la sustancia a cada muestra.', es_correcta: false }

    ],

    respuestaCorrecta: 'A',

    puntaje: 5,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-12',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-8',

    habilidadId: 'hab-cie-2',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'media',

    enunciado: 'El científico Jean Baptista van Helmont realizó un experimento para investigar el crecimiento de los árboles. Plantó un sauce de 2 kg en una maceta con 90 kg de tierra. Durante cinco años, regó la planta solo con agua.\nAl finalizar, el sauce pesó 76 kg y la tierra 89,95 kg.\n\nDe acuerdo con el procedimiento y los resultados, ¿cuál de estas afirmaciones es correcta?',

    alternativas: [

      { letra: 'A', texto: 'La tierra disminuye su masa porque es consumida por el árbol.', es_correcta: false },

      { letra: 'B', texto: 'El aumento de tamaño del árbol se produce a partir de sustancias distintas a la tierra.', es_correcta: true },

      { letra: 'C', texto: 'La tierra disminuye su masa porque se transforma en la energía que hace crecer al árbol.', es_correcta: false },

      { letra: 'D', texto: 'El aumento de tamaño del árbol se debe a la acumulación del agua en la tierra de la maceta.', es_correcta: false }

    ],

    respuestaCorrecta: 'B',

    puntaje: 4,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-13',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-8',

    habilidadId: 'hab-cie-3',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'alta',

    enunciado: 'Mateo cree que la luz podría influir en el crecimiento de las plantas, pero quiere comprobarlo. Para ello, consigue:\n- 2 maceteros con plantas del mismo tamaño.\n- 1 caja de cartón grueso.\n- 1 caja de plástico transparente.\n- Agua para el riego.\n\n¿Qué debe hacer Mateo con estos materiales para comprobar que la luz es necesaria para el crecimiento de las plantas?',

    alternativas: [

      { letra: 'A', texto: 'Poner una de las plantas bajo la caja de plástico transparente y la otra usarla de control, midiendo su altura diariamente.', es_correcta: false },

      { letra: 'B', texto: 'Poner ambas plantas bajo la caja de cartón, regar con la misma cantidad de agua y ver si logran sobrevivir en la oscuridad.', es_correcta: false },

      { letra: 'C', texto: 'Poner una planta bajo la caja de cartón y la otra bajo la caja de plástico, y dejar de regar la planta que está en la caja de cartón.', es_correcta: false },

      { letra: 'D', texto: 'Poner una planta bajo la caja de cartón y la otra bajo la caja de plástico, asegurándose de regar ambas con la misma cantidad de agua.', es_correcta: true }

    ],

    respuestaCorrecta: 'D',

    puntaje: 5,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-14',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-9',

    habilidadId: 'hab-cie-1',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'baja',

    enunciado: '¿Qué función cumplen los organismos productores en las cadenas alimentarias?',

    alternativas: [

      { letra: 'A', texto: 'Proveer energía a los diferentes niveles tróficos del ecosistema.', es_correcta: true },

      { letra: 'B', texto: 'Extraer la energía desde el suelo para transferirla a los herbívoros.', es_correcta: false },

      { letra: 'C', texto: 'Consumir vegetales para producir la energía que necesitan los carnívoros.', es_correcta: false },

      { letra: 'D', texto: 'Descomponer los restos de seres vivos para devolver los nutrientes a la tierra.', es_correcta: false }

    ],

    respuestaCorrecta: 'A',

    puntaje: 3,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-15',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-10',

    habilidadId: 'hab-cie-1',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'baja',

    enunciado: '¿Cuál es la función de las trompas de Falopio?',

    alternativas: [

      { letra: 'A', texto: 'Producir las células sexuales femeninas.', es_correcta: false },

      { letra: 'B', texto: 'Albergar al embrión durante su desarrollo.', es_correcta: false },

      { letra: 'C', texto: 'Conectar el útero con el exterior del cuerpo.', es_correcta: false },

      { letra: 'D', texto: 'Conducir el ovocito desde el ovario hacia el útero.', es_correcta: true }

    ],

    respuestaCorrecta: 'D',

    puntaje: 3,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-16',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-10',

    habilidadId: 'hab-cie-2',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'media',

    enunciado: 'Si un médico necesita evaluar la capacidad biológica de un paciente para producir gametos masculinos, ¿qué estructura debe examinar específicamente?',

    alternativas: [

      { letra: 'A', texto: 'El testículo.', es_correcta: true },

      { letra: 'B', texto: 'La próstata.', es_correcta: false },

      { letra: 'C', texto: 'El epidídimo.', es_correcta: false },

      { letra: 'D', texto: 'El conducto deferente.', es_correcta: false }

    ],

    respuestaCorrecta: 'A',

    puntaje: 4,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-17',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-11',

    habilidadId: 'hab-cie-1',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'baja',

    enunciado: '¿Cuál fue el PRINCIPAL aporte de Thomas Edison en el desarrollo de la electricidad?',

    alternativas: [

      { letra: 'A', texto: 'Construyó la pila galvánica.', es_correcta: false },

      { letra: 'B', texto: 'Fabricó la primera ampolleta.', es_correcta: true },

      { letra: 'C', texto: 'Inventó el motor de corriente alterna.', es_correcta: false },

      { letra: 'D', texto: 'Demostró que esta podía conducirse.', es_correcta: false }

    ],

    respuestaCorrecta: 'B',

    puntaje: 3,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-18',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-11',

    habilidadId: 'hab-cie-1',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'baja',

    enunciado: '¿Qué tipos de energía están involucrados PRINCIPALMENTE en el funcionamiento de una plancha encendida?',

    alternativas: [

      { letra: 'A', texto: 'Eléctrica y térmica.', es_correcta: true },

      { letra: 'B', texto: 'Lumínica y térmica.', es_correcta: false },

      { letra: 'C', texto: 'Eléctrica y mecánica.', es_correcta: false },

      { letra: 'D', texto: 'Lumínica y mecánica.', es_correcta: false }

    ],

    respuestaCorrecta: 'A',

    puntaje: 3,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-19',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-11',

    habilidadId: 'hab-cie-2',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'media',

    enunciado: '¿En qué formas se manifiesta PRINCIPALMENTE la energía eléctrica cuando un secador de pelo está en funcionamiento?',

    alternativas: [

      { letra: 'A', texto: 'Química, sonora y térmica.', es_correcta: false },

      { letra: 'B', texto: 'Térmica, cinética y sonora.', es_correcta: true },

      { letra: 'C', texto: 'Sonora, lumínica y cinética.', es_correcta: false },

      { letra: 'D', texto: 'Lumínica, térmica y química.', es_correcta: false }

    ],

    respuestaCorrecta: 'B',

    puntaje: 4,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-20',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-12',

    habilidadId: 'hab-cie-1',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'baja',

    enunciado: 'Camila está dibujando el plano de un circuito eléctrico, pero olvidó incluir el elemento que proporciona la energía para que funcione. Observa los siguientes símbolos:\n\n¿Qué símbolo debe dibujar Camila para representar el componente que le falta?',

    imagenUrl: '/preguntas/simce_cn_6b/p20_simbolos.png',

    alternativas: [

      { letra: 'A', texto: 'Símbolo A (Resistencia)', es_correcta: false },

      { letra: 'B', texto: 'Símbolo B (Fuente de poder / Pila)', es_correcta: true },

      { letra: 'C', texto: 'Símbolo C (Interruptor)', es_correcta: false },

      { letra: 'D', texto: 'Símbolo D (Ampolleta)', es_correcta: false }

    ],

    respuestaCorrecta: 'B',

    puntaje: 3,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-21',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-12',

    habilidadId: 'hab-cie-2',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'media',

    enunciado: 'En el siguiente modelo de un circuito eléctrico, el limón cumple una función fundamental.\n\nSi se retira el limón del circuito, ¿por qué otro componente debe reemplazarse para que la ampolleta logre encenderse?',

    imagenUrl: '/preguntas/simce_cn_6b/p21_limon.png',

    alternativas: [

      { letra: 'A', texto: 'Por una pila.', es_correcta: true },

      { letra: 'B', texto: 'Por un motor.', es_correcta: false },

      { letra: 'C', texto: 'Por un interruptor.', es_correcta: false },

      { letra: 'D', texto: 'Por un cable de cobre.', es_correcta: false }

    ],

    respuestaCorrecta: 'A',

    puntaje: 4,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-22',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-12',

    habilidadId: 'hab-cie-3',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'alta',

    enunciado: 'Jorge y Andrea armaron un circuito eléctrico simple. Luego realizaron tres pruebas utilizando la misma pila, la misma ampolleta y el mismo grosor de cable, modificando solo la longitud del cable (Prueba 1: 15 cm, Prueba 2: 50 cm, Prueba 3: 100 cm).\n\nA partir de este diseño experimental, ¿cuál es la variable independiente en la investigación?',

    alternativas: [

      { letra: 'A', texto: 'El grosor del cable utilizado.', es_correcta: false },

      { letra: 'B', texto: 'El material del cable utilizado.', es_correcta: false },

      { letra: 'C', texto: 'La longitud del cable en cada prueba.', es_correcta: true },

      { letra: 'D', texto: 'La intensidad luminosa de la ampolleta en cada prueba.', es_correcta: false }

    ],

    respuestaCorrecta: 'C',

    puntaje: 5,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-23',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-13',

    habilidadId: 'hab-cie-2',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'media',

    enunciado: '¿Por qué es necesario utilizar guantes de caucho al manipular cables eléctricos?',

    alternativas: [

      { letra: 'A', texto: 'Porque absorben la corriente para evitar que el circuito se caliente.', es_correcta: false },

      { letra: 'B', texto: 'Porque desvían la corriente hacia el suelo como un material conductor.', es_correcta: false },

      { letra: 'C', texto: 'Porque protegen las manos de posibles cortes con los metales del circuito.', es_correcta: false },

      { letra: 'D', texto: 'Porque actúan como un aislante que impide el paso de la corriente hacia el cuerpo.', es_correcta: true }

    ],

    respuestaCorrecta: 'D',

    puntaje: 4,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-24',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-13',

    habilidadId: 'hab-cie-2',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'media',

    enunciado: 'Durante un experimento, un grupo de estudiantes nota que uno de los cables de su circuito eléctrico ha perdido parte de su cubierta exterior. Para evitar recibir una descarga eléctrica al manipular el circuito y prevenir que el material se queme si el cable se calienta mucho, necesitan envolver la zona dañada.\n\n¿Cuál de estos materiales es el más adecuado y seguro para solucionar este problema?',

    alternativas: [

      { letra: 'A', texto: 'Un trozo de papel.', es_correcta: false },

      { letra: 'B', texto: 'Un trozo de algodón.', es_correcta: false },

      { letra: 'C', texto: 'Una cinta de plástico.', es_correcta: true },

      { letra: 'D', texto: 'Una cinta de papel aluminio.', es_correcta: false }

    ],

    respuestaCorrecta: 'C',

    puntaje: 4,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-25',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-12',

    habilidadId: 'hab-cie-3',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'alta',

    enunciado: 'Ingrid necesita construir un circuito eléctrico que contenga una ampolleta, dos pilas y dos interruptores. Observa los esquemas:\n\n¿Cuál de estos esquemas representa el circuito que debe construir Ingrid?',

    imagenUrl: '/preguntas/simce_cn_6b/p25_circuitos.png',

    alternativas: [

      { letra: 'A', texto: 'Esquema A (1 ampolleta, 2 pilas y 2 interruptores)', es_correcta: true },

      { letra: 'B', texto: 'Esquema B', es_correcta: false },

      { letra: 'C', texto: 'Esquema C', es_correcta: false },

      { letra: 'D', texto: 'Esquema D', es_correcta: false }

    ],

    respuestaCorrecta: 'A',

    puntaje: 5,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-26',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-13',

    habilidadId: 'hab-cie-1',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'baja',

    enunciado: '¿Cuál de estos materiales permite el desplazamiento de las cargas eléctricas a través de un circuito?',

    alternativas: [

      { letra: 'A', texto: 'Vidrio', es_correcta: false },

      { letra: 'B', texto: 'Hierro', es_correcta: true },

      { letra: 'C', texto: 'Plástico', es_correcta: false },

      { letra: 'D', texto: 'Madera', es_correcta: false }

    ],

    respuestaCorrecta: 'B',

    puntaje: 3,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-27',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-14',

    habilidadId: 'hab-cie-2',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'media',

    enunciado: '¿Cuál de estas acciones permite ahorrar energía eléctrica de manera efectiva en el hogar?',

    alternativas: [

      { letra: 'A', texto: 'Priorizar el uso de la luz natural durante el día.', es_correcta: true },

      { letra: 'B', texto: 'Mantener conectados cargadores de celulares.', es_correcta: false },

      { letra: 'C', texto: 'Instalar ampolletas de mayor potencia en las habitaciones.', es_correcta: false },

      { letra: 'D', texto: 'Utilizar artefactos durante la mañana para disminuir el costo de su uso.', es_correcta: false }

    ],

    respuestaCorrecta: 'A',

    puntaje: 4,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-28',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-14',

    habilidadId: 'hab-cie-2',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'media',

    enunciado: 'El refrigerador es uno de los aparatos que más energía eléctrica consume en el hogar. ¿Qué acción ayudaría a reducir su consumo de energía?',

    alternativas: [

      { letra: 'A', texto: 'Limitar el tiempo que la puerta permanece abierta.', es_correcta: true },

      { letra: 'B', texto: 'Guardar alimentos que aún estén calientes en su interior.', es_correcta: false },

      { letra: 'C', texto: 'Tener pocos alimentos guardados para evitar su sobrecarga.', es_correcta: false },

      { letra: 'D', texto: 'Mantener desenchufado durante la noche para que el motor descanse.', es_correcta: false }

    ],

    respuestaCorrecta: 'A',

    puntaje: 4,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-29',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-15',

    habilidadId: 'hab-cie-1',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'baja',

    enunciado: 'El nivel del mar sube y baja a lo largo del día, fenómeno conocido como marea. ¿Qué factor de la naturaleza origina este movimiento de las aguas?',

    alternativas: [

      { letra: 'A', texto: 'La rotación constante que realiza el planeta Tierra sobre su propio eje.', es_correcta: false },

      { letra: 'B', texto: 'El cambio de temperatura que sufren las corrientes en el fondo marino.', es_correcta: false },

      { letra: 'C', texto: 'La atracción gravitacional que ejercen la Luna con el Sol sobre la Tierra.', es_correcta: true },

      { letra: 'D', texto: 'El empuje constante que genera el viento sobre la superficie del océano.', es_correcta: false }

    ],

    respuestaCorrecta: 'C',

    puntaje: 3,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-30',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-15',

    habilidadId: 'hab-cie-3',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'alta',

    enunciado: 'El siguiente gráfico muestra cómo varía la temperatura del agua a medida que se desciende hacia el fondo del océano.\n\nA partir de la información del gráfico, ¿cuál de estas conclusiones es correcta?',

    imagenUrl: '/preguntas/simce_cn_6b/p30_oceano.png',

    alternativas: [

      { letra: 'A', texto: 'La temperatura del agua aumenta de manera gradual desde la superficie al fondo del océano.', es_correcta: false },

      { letra: 'B', texto: 'La temperatura del agua puede llegar a los 0 °C si se desciende más allá de los 4500 metros del océano.', es_correcta: false },

      { letra: 'C', texto: 'La temperatura del agua desciende de manera brusca en los primeros 1000 metros de profundidad del océano.', es_correcta: true },

      { letra: 'D', texto: 'La temperatura del agua presenta su mayor caída entre los 2000 y los 4500 metros de profundidad del océano.', es_correcta: false }

    ],

    respuestaCorrecta: 'C',

    puntaje: 5,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-31',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-16',

    habilidadId: 'hab-cie-2',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'media',

    enunciado: '¿Qué acción humana permite prevenir que los químicos usados en el mantenimiento del pasto de un parque contaminen un río cercano?',

    alternativas: [

      { letra: 'A', texto: 'Aplicar los productos químicos directo a la tierra.', es_correcta: false },

      { letra: 'B', texto: 'Sustituir los productos químicos por abonos naturales.', es_correcta: true },

      { letra: 'C', texto: 'Mezclar los químicos con abundante agua antes de aplicar.', es_correcta: false },

      { letra: 'D', texto: 'Instalar filtros de limpieza para eliminar los químicos que lleguen al agua.', es_correcta: false }

    ],

    respuestaCorrecta: 'B',

    puntaje: 4,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-32',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-17',

    habilidadId: 'hab-cie-1',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'baja',

    enunciado: '¿Qué es la litosfera?',

    alternativas: [

      { letra: 'A', texto: 'Capa sólida más externa de la Tierra.', es_correcta: true },

      { letra: 'B', texto: 'Capa de gases que envuelve a la Tierra.', es_correcta: false },

      { letra: 'C', texto: 'Capa de agua líquida de la superficie de la Tierra.', es_correcta: false },

      { letra: 'D', texto: 'Capa de metal que se encuentra al interior de la Tierra.', es_correcta: false }

    ],

    respuestaCorrecta: 'A',

    puntaje: 3,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-33',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-17',

    habilidadId: 'hab-cie-3',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'alta',

    enunciado: 'El siguiente gráfico muestra las principales fuentes de emisión de gases contaminantes de la atmósfera de una región del país.\n\nConsiderando la principal fuente contaminante, ¿cuál de estas medidas ayudaría a disminuir de forma efectiva la emisión de gases contaminantes en esta región?',

    imagenUrl: '/preguntas/simce_cn_6b/p33_emisiones.png',

    alternativas: [

      { letra: 'A', texto: 'Sancionar la quema de árboles en las zonas agrícolas.', es_correcta: false },

      { letra: 'B', texto: 'Fomentar el uso del transporte público en las ciudades.', es_correcta: false },

      { letra: 'C', texto: 'Prohibir la realización de fogatas al interior de los bosques.', es_correcta: false },

      { letra: 'D', texto: 'Restringir el uso de estufas a leña para calefaccionar viviendas.', es_correcta: true }

    ],

    respuestaCorrecta: 'D',

    puntaje: 5,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-34',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-18',

    habilidadId: 'hab-cie-1',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'baja',

    enunciado: '¿Cuál es la importancia de mantener la cubierta vegetal para la protección del suelo?',

    alternativas: [

      { letra: 'A', texto: 'Absorber el agua superficial y mantener el terreno húmedo.', es_correcta: false },

      { letra: 'B', texto: 'Sostener las partículas de tierra y disminuir la fuerza del agua de lluvia.', es_correcta: true },

      { letra: 'C', texto: 'Producir nuevos minerales y aumentar el oxígeno disponible en la tierra.', es_correcta: false },

      { letra: 'D', texto: 'Filtrar sustancias del agua de lluvia y evitar que el sol caliente la superficie.', es_correcta: false }

    ],

    respuestaCorrecta: 'B',

    puntaje: 3,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

  {

    id: 'preg-cn6b-35',

    asignaturaId: 'asig-3',

    ejeTematicoId: 'eje-cie-6b-18',

    habilidadId: 'hab-cie-3',

    tipo: 'seleccion_multiple',

    nivel: '6° básico',

    dificultad: 'alta',

    enunciado: 'Angélica y Juan realizaron el siguiente experimento:\n1. Tomaron dos bandejas idénticas y las llenaron con la misma cantidad de suelo arcilloso.\n2. En la bandeja 1 dejaron solo el suelo y en la bandeja 2 plantaron una capa de pasto sobre el suelo.\n3. Luego, dieron la misma inclinación a ambas bandejas y les arrojaron exactamente 1 litro de agua con una regadera.\n4. Finalmente, observaron y compararon cuánta tierra fue arrastrada por el agua hacia un recipiente grande colocado debajo de cada bandeja.\n\nA partir de este procedimiento, ¿cuál es la pregunta de investigación que intentaban responder Angélica y Juan con su experimento?',

    alternativas: [

      { letra: 'A', texto: '¿De qué manera la inclinación de las bandejas influye en la cantidad de agua que logra absorber el suelo?', es_correcta: false },

      { letra: 'B', texto: '¿De qué manera la presencia de una capa de pasto afecta la cantidad de suelo que es arrastrado por el agua?', es_correcta: true },

      { letra: 'C', texto: '¿De qué manera la cantidad de agua arrojada afecta la cantidad de suelo que es arrastrado hacia el recipiente?', es_correcta: false },

      { letra: 'D', texto: '¿De qué manera el tipo de suelo influye en el crecimiento del pasto cuando son regados con la misma cantidad de agua?', es_correcta: false }

    ],

    respuestaCorrecta: 'B',

    puntaje: 1,

    fuente: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico'

  },

];



export const cursosMock: Curso[] = [

  cursoLenguaje2MMock,

  {

    id: 'curso-1',

    nombre: '8° Básico A',

    nivel: '8° básico',

    profesorId: currentUserProfesor.id,

    establecimiento: APP_CONFIG.nombreEstablecimiento,

    anio: 2026,

    codigoInvitacion: 'DEMO2026'

  },

  {

    id: 'curso-2',

    nombre: '8° Básico B',

    nivel: '8° básico',

    profesorId: currentUserProfesor.id,

    establecimiento: APP_CONFIG.nombreEstablecimiento,

    anio: 2026,

    codigoInvitacion: 'B8B2026'

  },

  {

    id: 'curso-6a',

    nombre: '6° Básico A',

    nivel: '6° básico',

    profesorId: currentUserProfesorCiencias.id,

    establecimiento: APP_CONFIG.nombreEstablecimiento,

    anio: 2026,

    codigoInvitacion: 'CN6A2026'

  },

  {

    id: 'curso-6b',

    nombre: '6° Básico B',

    nivel: '6° básico',

    profesorId: currentUserProfesorCiencias.id,

    establecimiento: APP_CONFIG.nombreEstablecimiento,

    anio: 2026,

    codigoInvitacion: 'CN6B2026'

  }

];



export const pruebasMock: Prueba[] = [

  // ✅ Ensayo SIMCE Lenguaje 2° Medio — María Teresa González (Escuela Premilitar)
  pruebaLenguaje2MMock,

  // ⚠️ Las siguientes pruebas son de demo para otras especialidades (no visibles al docente de Lenguaje)
  {

    id: 'prueba-cn6b-101',

    titulo: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico',

    descripcion: 'Evaluación integral de cobertura curricular: Sistemas del cuerpo humano, Célula, Ecosistemas, Energía Eléctrica, Océanos y Capas de la Tierra.',

    asignaturaId: 'asig-3',

    asignaturaNombre: 'Ciencias Naturales',

    nivel: '6° básico',

    profesorId: currentUserProfesorCiencias.id,

    cursoId: 'curso-6a',

    cursoNombre: '6° Básico A',

    codigoPublico: 'SIMCE-6A-CN3',

    duracionMinutos: 90,

    creadoEn: '2026-08-14',

    preguntasIds: ["preg-cn6b-01", "preg-cn6b-02", "preg-cn6b-03", "preg-cn6b-04", "preg-cn6b-05", "preg-cn6b-06", "preg-cn6b-07", "preg-cn6b-08", "preg-cn6b-09", "preg-cn6b-10", "preg-cn6b-11", "preg-cn6b-12", "preg-cn6b-13", "preg-cn6b-14", "preg-cn6b-15", "preg-cn6b-16", "preg-cn6b-17", "preg-cn6b-18", "preg-cn6b-19", "preg-cn6b-20", "preg-cn6b-21", "preg-cn6b-22", "preg-cn6b-23", "preg-cn6b-24", "preg-cn6b-25", "preg-cn6b-26", "preg-cn6b-27", "preg-cn6b-28", "preg-cn6b-29", "preg-cn6b-30", "preg-cn6b-31", "preg-cn6b-32", "preg-cn6b-33", "preg-cn6b-34", "preg-cn6b-35"],

    totalPreguntas: 35,

    estado: 'activa'

  },

  {

    id: 'prueba-101',

    titulo: 'Evaluación Diagnóstica Nacional de Matemática 8° Básico',

    descripcion: 'Evaluación integral de cobertura curricular: Números, Álgebra, Geometría y Probabilidad.',

    asignaturaId: 'asig-1',

    asignaturaNombre: 'Matemática',

    nivel: '8° básico',

    profesorId: currentUserProfesor.id,

    cursoId: 'curso-1',

    cursoNombre: '8° Básico A',

    codigoPublico: 'EVAL-8A-MAT',

    duracionMinutos: 45,

    creadoEn: '2026-08-10',

    preguntasIds: ['preg-1', 'preg-2', 'preg-3', 'preg-4', 'preg-5', 'preg-6', 'preg-7', 'preg-8', 'preg-9',
                   'preg-30', 'preg-31', 'preg-32', 'preg-33', 'preg-34', 'preg-35', 'preg-36', 'preg-37',
                   'preg-38', 'preg-39', 'preg-40', 'preg-41', 'preg-42', 'preg-43', 'preg-44', 'preg-45',
                   'preg-46', 'preg-47', 'preg-48', 'preg-49', 'preg-50'],

    totalPreguntas: 30,
    estado: 'activa'
  },
  {
    id: 'prueba-demo-leng-8b',
    titulo: 'Evaluación Diagnóstica Lenguaje y Comunicación 8° Básico (Demo)',
    descripcion: 'Evaluación formativa demo de comprensión lectora, textos argumentativos y dramáticos.',
    asignaturaId: 'asig-2',
    asignaturaNombre: 'Lenguaje y Comunicación',
    nivel: '8° básico',
    profesorId: currentUserProfesorLenguaje.id,
    cursoId: 'curso-2',
    cursoNombre: '8° Básico B',
    codigoPublico: 'EVAL-8B-LENG',
    duracionMinutos: 45,
    creadoEn: '2026-08-10',
    preguntasIds: ['preg-1', 'preg-2', 'preg-3'],
    totalPreguntas: 3,
    estado: 'activa'
  }
];



export const rendicionesMock: RendicionPrueba[] = [

  {

    id: 'rend-1',

    pruebaId: 'prueba-101',

    alumnoId: '00000000-0000-0000-0000-000000000002',

    alumnoNombre: 'Pedro Soto',

    alumnoRut: '22.876.543-0',

    fechaRendicion: '2026-08-11 10:15',

    puntajeObtenido: 5,

    puntajeMaximo: 7,

    porcentajeLogro: 71,

    puntajeEscalaNacional: 284,

    respuestas: [

      { preguntaId: 'preg-1', respuestaDada: 'B', esCorrecta: true, tiempoSegundos: 45 },

      { preguntaId: 'preg-2', respuestaDada: 'C', esCorrecta: true, tiempoSegundos: 120 },

      { preguntaId: 'preg-3', respuestaDada: 'A', esCorrecta: false, tiempoSegundos: 90 },

      { preguntaId: 'preg-4', respuestaDada: 'A', esCorrecta: true, tiempoSegundos: 110 },

      { preguntaId: 'preg-5', respuestaDada: 'A', esCorrecta: true, tiempoSegundos: 60 },

      { preguntaId: 'preg-6', respuestaDada: 'Resté 8 a 20 dando 12 y dividí entre 2, x = 6', esCorrecta: true, tiempoSegundos: 180 }

    ],

    estado: 'enviada'

  },

  {

    id: 'rend-2',

    pruebaId: 'prueba-101',

    alumnoId: '00000000-0000-0000-0000-000000000003',

    alumnoNombre: 'Ana López',

    alumnoRut: '23.111.111-1',

    fechaRendicion: '2026-08-11 10:20',

    puntajeObtenido: 3,

    puntajeMaximo: 7,

    porcentajeLogro: 43,

    puntajeEscalaNacional: 215,

    respuestas: [

      { preguntaId: 'preg-1', respuestaDada: 'B', esCorrecta: true, tiempoSegundos: 50 },

      { preguntaId: 'preg-2', respuestaDada: 'A', esCorrecta: false, tiempoSegundos: 130 },

      { preguntaId: 'preg-3', respuestaDada: 'C', esCorrecta: false, tiempoSegundos: 95 },

      { preguntaId: 'preg-4', respuestaDada: 'B', esCorrecta: false, tiempoSegundos: 80 },

      { preguntaId: 'preg-5', respuestaDada: 'A', esCorrecta: true, tiempoSegundos: 70 },

      { preguntaId: 'preg-6', respuestaDada: '2x = 20 - 8 => 2x = 12 => x = 6', esCorrecta: true, tiempoSegundos: 150 }

    ],

    estado: 'enviada'

  },

  {

    id: 'rend-3',

    pruebaId: 'prueba-101',

    alumnoId: '00000000-0000-0000-0000-000000000004',

    alumnoNombre: 'Carlos Martínez',

    alumnoRut: '22.222.222-2',

    fechaRendicion: '2026-08-11 10:22',

    puntajeObtenido: 2,

    puntajeMaximo: 7,

    porcentajeLogro: 28,

    puntajeEscalaNacional: 190,

    respuestas: [

      { preguntaId: 'preg-1', respuestaDada: 'A', esCorrecta: false, tiempoSegundos: 60 },

      { preguntaId: 'preg-2', respuestaDada: 'B', esCorrecta: false, tiempoSegundos: 140 },

      { preguntaId: 'preg-3', respuestaDada: 'A', esCorrecta: false, tiempoSegundos: 100 },

      { preguntaId: 'preg-4', respuestaDada: 'C', esCorrecta: false, tiempoSegundos: 85 },

      { preguntaId: 'preg-5', respuestaDada: 'B', esCorrecta: false, tiempoSegundos: 75 },

      { preguntaId: 'preg-6', respuestaDada: 'x = 10', esCorrecta: false, tiempoSegundos: 90 }

    ],

    estado: 'enviada'

  },

  {

    id: 'rend-4',

    pruebaId: 'prueba-101',

    alumnoId: '00000000-0000-0000-0000-000000000005',

    alumnoNombre: 'Sofía Valenzuela',

    alumnoRut: '23.444.555-9',

    fechaRendicion: '2026-08-11 10:25',

    puntajeObtenido: 6,

    puntajeMaximo: 7,

    porcentajeLogro: 85,

    puntajeEscalaNacional: 312,

    respuestas: [

      { preguntaId: 'preg-1', respuestaDada: 'B', esCorrecta: true, tiempoSegundos: 40 },

      { preguntaId: 'preg-2', respuestaDada: 'C', esCorrecta: true, tiempoSegundos: 110 },

      { preguntaId: 'preg-3', respuestaDada: 'B', esCorrecta: true, tiempoSegundos: 70 },

      { preguntaId: 'preg-4', respuestaDada: 'A', esCorrecta: true, tiempoSegundos: 90 },

      { preguntaId: 'preg-5', respuestaDada: 'A', esCorrecta: true, tiempoSegundos: 50 },

      { preguntaId: 'preg-6', respuestaDada: '2x = 12, x = 6', esCorrecta: true, tiempoSegundos: 120 }

    ],

    estado: 'enviada'

  }

];



export const rendicionesCienciasMock: RendicionPrueba[] = [

  {

    "id": "rend-cn6b-1",

    "pruebaId": "prueba-cn6b-101",

    "alumnoId": "00000000-0000-0000-0000-000000000002",

    "alumnoNombre": "Pedro Soto",

    "alumnoRut": "22.876.543-0",

    "fechaRendicion": "2026-08-14 10:15",

    "puntajeObtenido": 109,

    "puntajeMaximo": 131,

    "porcentajeLogro": 83,

    "puntajeEscalaNacional": 304,

    "respuestas": [

      {

        "preguntaId": "preg-cn6b-01",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 46

      },

      {

        "preguntaId": "preg-cn6b-02",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 47

      },

      {

        "preguntaId": "preg-cn6b-03",

        "respuestaDada": "D",

        "esCorrecta": true,

        "tiempoSegundos": 48

      },

      {

        "preguntaId": "preg-cn6b-04",

        "respuestaDada": "C",

        "esCorrecta": true,

        "tiempoSegundos": 49

      },

      {

        "preguntaId": "preg-cn6b-05",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 50

      },

      {

        "preguntaId": "preg-cn6b-06",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 51

      },

      {

        "preguntaId": "preg-cn6b-07",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 52

      },

      {

        "preguntaId": "preg-cn6b-08",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 53

      },

      {

        "preguntaId": "preg-cn6b-09",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 54

      },

      {

        "preguntaId": "preg-cn6b-10",

        "respuestaDada": "C",

        "esCorrecta": true,

        "tiempoSegundos": 55

      },

      {

        "preguntaId": "preg-cn6b-11",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 56

      },

      {

        "preguntaId": "preg-cn6b-12",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 57

      },

      {

        "preguntaId": "preg-cn6b-13",

        "respuestaDada": "D",

        "esCorrecta": true,

        "tiempoSegundos": 58

      },

      {

        "preguntaId": "preg-cn6b-14",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 59

      },

      {

        "preguntaId": "preg-cn6b-15",

        "respuestaDada": "D",

        "esCorrecta": true,

        "tiempoSegundos": 60

      },

      {

        "preguntaId": "preg-cn6b-16",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 61

      },

      {

        "preguntaId": "preg-cn6b-17",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 62

      },

      {

        "preguntaId": "preg-cn6b-18",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 63

      },

      {

        "preguntaId": "preg-cn6b-19",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 64

      },

      {

        "preguntaId": "preg-cn6b-20",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 65

      },

      {

        "preguntaId": "preg-cn6b-21",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 66

      },

      {

        "preguntaId": "preg-cn6b-22",

        "respuestaDada": "C",

        "esCorrecta": true,

        "tiempoSegundos": 67

      },

      {

        "preguntaId": "preg-cn6b-23",

        "respuestaDada": "D",

        "esCorrecta": true,

        "tiempoSegundos": 68

      },

      {

        "preguntaId": "preg-cn6b-24",

        "respuestaDada": "C",

        "esCorrecta": true,

        "tiempoSegundos": 69

      },

      {

        "preguntaId": "preg-cn6b-25",

        "respuestaDada": "C",

        "esCorrecta": false,

        "tiempoSegundos": 70

      },

      {

        "preguntaId": "preg-cn6b-26",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 71

      },

      {

        "preguntaId": "preg-cn6b-27",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 72

      },

      {

        "preguntaId": "preg-cn6b-28",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 73

      },

      {

        "preguntaId": "preg-cn6b-29",

        "respuestaDada": "C",

        "esCorrecta": true,

        "tiempoSegundos": 74

      },

      {

        "preguntaId": "preg-cn6b-30",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 45

      },

      {

        "preguntaId": "preg-cn6b-31",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 46

      },

      {

        "preguntaId": "preg-cn6b-32",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 47

      },

      {

        "preguntaId": "preg-cn6b-33",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 48

      },

      {

        "preguntaId": "preg-cn6b-34",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 49

      },

      {

        "preguntaId": "preg-cn6b-35",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 50

      }

    ],

    "estado": "enviada"

  },

  {

    "id": "rend-cn6b-2",

    "pruebaId": "prueba-cn6b-101",

    "alumnoId": "00000000-0000-0000-0000-000000000003",

    "alumnoNombre": "Ana López",

    "alumnoRut": "23.111.111-1",

    "fechaRendicion": "2026-08-14 10:20",

    "puntajeObtenido": 72,

    "puntajeMaximo": 131,

    "porcentajeLogro": 55,

    "puntajeEscalaNacional": 262,

    "respuestas": [

      {

        "preguntaId": "preg-cn6b-01",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 46

      },

      {

        "preguntaId": "preg-cn6b-02",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 47

      },

      {

        "preguntaId": "preg-cn6b-03",

        "respuestaDada": "D",

        "esCorrecta": true,

        "tiempoSegundos": 48

      },

      {

        "preguntaId": "preg-cn6b-04",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 49

      },

      {

        "preguntaId": "preg-cn6b-05",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 50

      },

      {

        "preguntaId": "preg-cn6b-06",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 51

      },

      {

        "preguntaId": "preg-cn6b-07",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 52

      },

      {

        "preguntaId": "preg-cn6b-08",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 53

      },

      {

        "preguntaId": "preg-cn6b-09",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 54

      },

      {

        "preguntaId": "preg-cn6b-10",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 55

      },

      {

        "preguntaId": "preg-cn6b-11",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 56

      },

      {

        "preguntaId": "preg-cn6b-12",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 57

      },

      {

        "preguntaId": "preg-cn6b-13",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 58

      },

      {

        "preguntaId": "preg-cn6b-14",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 59

      },

      {

        "preguntaId": "preg-cn6b-15",

        "respuestaDada": "D",

        "esCorrecta": true,

        "tiempoSegundos": 60

      },

      {

        "preguntaId": "preg-cn6b-16",

        "respuestaDada": "C",

        "esCorrecta": false,

        "tiempoSegundos": 61

      },

      {

        "preguntaId": "preg-cn6b-17",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 62

      },

      {

        "preguntaId": "preg-cn6b-18",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 63

      },

      {

        "preguntaId": "preg-cn6b-19",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 64

      },

      {

        "preguntaId": "preg-cn6b-20",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 65

      },

      {

        "preguntaId": "preg-cn6b-21",

        "respuestaDada": "C",

        "esCorrecta": false,

        "tiempoSegundos": 66

      },

      {

        "preguntaId": "preg-cn6b-22",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 67

      },

      {

        "preguntaId": "preg-cn6b-23",

        "respuestaDada": "D",

        "esCorrecta": true,

        "tiempoSegundos": 68

      },

      {

        "preguntaId": "preg-cn6b-24",

        "respuestaDada": "C",

        "esCorrecta": true,

        "tiempoSegundos": 69

      },

      {

        "preguntaId": "preg-cn6b-25",

        "respuestaDada": "C",

        "esCorrecta": false,

        "tiempoSegundos": 70

      },

      {

        "preguntaId": "preg-cn6b-26",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 71

      },

      {

        "preguntaId": "preg-cn6b-27",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 72

      },

      {

        "preguntaId": "preg-cn6b-28",

        "respuestaDada": "C",

        "esCorrecta": false,

        "tiempoSegundos": 73

      },

      {

        "preguntaId": "preg-cn6b-29",

        "respuestaDada": "C",

        "esCorrecta": true,

        "tiempoSegundos": 74

      },

      {

        "preguntaId": "preg-cn6b-30",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 45

      },

      {

        "preguntaId": "preg-cn6b-31",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 46

      },

      {

        "preguntaId": "preg-cn6b-32",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 47

      },

      {

        "preguntaId": "preg-cn6b-33",

        "respuestaDada": "D",

        "esCorrecta": true,

        "tiempoSegundos": 48

      },

      {

        "preguntaId": "preg-cn6b-34",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 49

      },

      {

        "preguntaId": "preg-cn6b-35",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 50

      }

    ],

    "estado": "enviada"

  },

  {

    "id": "rend-cn6b-3",

    "pruebaId": "prueba-cn6b-101",

    "alumnoId": "00000000-0000-0000-0000-000000000004",

    "alumnoNombre": "Carlos Martínez",

    "alumnoRut": "22.222.222-2",

    "fechaRendicion": "2026-08-14 10:25",

    "puntajeObtenido": 57,

    "puntajeMaximo": 131,

    "porcentajeLogro": 44,

    "puntajeEscalaNacional": 246,

    "respuestas": [

      {

        "preguntaId": "preg-cn6b-01",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 46

      },

      {

        "preguntaId": "preg-cn6b-02",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 47

      },

      {

        "preguntaId": "preg-cn6b-03",

        "respuestaDada": "D",

        "esCorrecta": true,

        "tiempoSegundos": 48

      },

      {

        "preguntaId": "preg-cn6b-04",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 49

      },

      {

        "preguntaId": "preg-cn6b-05",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 50

      },

      {

        "preguntaId": "preg-cn6b-06",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 51

      },

      {

        "preguntaId": "preg-cn6b-07",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 52

      },

      {

        "preguntaId": "preg-cn6b-08",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 53

      },

      {

        "preguntaId": "preg-cn6b-09",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 54

      },

      {

        "preguntaId": "preg-cn6b-10",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 55

      },

      {

        "preguntaId": "preg-cn6b-11",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 56

      },

      {

        "preguntaId": "preg-cn6b-12",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 57

      },

      {

        "preguntaId": "preg-cn6b-13",

        "respuestaDada": "D",

        "esCorrecta": true,

        "tiempoSegundos": 58

      },

      {

        "preguntaId": "preg-cn6b-14",

        "respuestaDada": "C",

        "esCorrecta": false,

        "tiempoSegundos": 59

      },

      {

        "preguntaId": "preg-cn6b-15",

        "respuestaDada": "D",

        "esCorrecta": true,

        "tiempoSegundos": 60

      },

      {

        "preguntaId": "preg-cn6b-16",

        "respuestaDada": "C",

        "esCorrecta": false,

        "tiempoSegundos": 61

      },

      {

        "preguntaId": "preg-cn6b-17",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 62

      },

      {

        "preguntaId": "preg-cn6b-18",

        "respuestaDada": "C",

        "esCorrecta": false,

        "tiempoSegundos": 63

      },

      {

        "preguntaId": "preg-cn6b-19",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 64

      },

      {

        "preguntaId": "preg-cn6b-20",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 65

      },

      {

        "preguntaId": "preg-cn6b-21",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 66

      },

      {

        "preguntaId": "preg-cn6b-22",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 67

      },

      {

        "preguntaId": "preg-cn6b-23",

        "respuestaDada": "D",

        "esCorrecta": true,

        "tiempoSegundos": 68

      },

      {

        "preguntaId": "preg-cn6b-24",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 69

      },

      {

        "preguntaId": "preg-cn6b-25",

        "respuestaDada": "C",

        "esCorrecta": false,

        "tiempoSegundos": 70

      },

      {

        "preguntaId": "preg-cn6b-26",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 71

      },

      {

        "preguntaId": "preg-cn6b-27",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 72

      },

      {

        "preguntaId": "preg-cn6b-28",

        "respuestaDada": "C",

        "esCorrecta": false,

        "tiempoSegundos": 73

      },

      {

        "preguntaId": "preg-cn6b-29",

        "respuestaDada": "C",

        "esCorrecta": true,

        "tiempoSegundos": 74

      },

      {

        "preguntaId": "preg-cn6b-30",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 45

      },

      {

        "preguntaId": "preg-cn6b-31",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 46

      },

      {

        "preguntaId": "preg-cn6b-32",

        "respuestaDada": "C",

        "esCorrecta": false,

        "tiempoSegundos": 47

      },

      {

        "preguntaId": "preg-cn6b-33",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 48

      },

      {

        "preguntaId": "preg-cn6b-34",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 49

      },

      {

        "preguntaId": "preg-cn6b-35",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 50

      }

    ],

    "estado": "enviada"

  },

  {

    "id": "rend-cn6b-4",

    "pruebaId": "prueba-cn6b-101",

    "alumnoId": "00000000-0000-0000-0000-000000000005",

    "alumnoNombre": "Sofía Valenzuela",

    "alumnoRut": "23.444.555-9",

    "fechaRendicion": "2026-08-14 10:30",

    "puntajeObtenido": 122,

    "puntajeMaximo": 131,

    "porcentajeLogro": 93,

    "puntajeEscalaNacional": 319,

    "respuestas": [

      {

        "preguntaId": "preg-cn6b-01",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 46

      },

      {

        "preguntaId": "preg-cn6b-02",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 47

      },

      {

        "preguntaId": "preg-cn6b-03",

        "respuestaDada": "D",

        "esCorrecta": true,

        "tiempoSegundos": 48

      },

      {

        "preguntaId": "preg-cn6b-04",

        "respuestaDada": "C",

        "esCorrecta": true,

        "tiempoSegundos": 49

      },

      {

        "preguntaId": "preg-cn6b-05",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 50

      },

      {

        "preguntaId": "preg-cn6b-06",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 51

      },

      {

        "preguntaId": "preg-cn6b-07",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 52

      },

      {

        "preguntaId": "preg-cn6b-08",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 53

      },

      {

        "preguntaId": "preg-cn6b-09",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 54

      },

      {

        "preguntaId": "preg-cn6b-10",

        "respuestaDada": "C",

        "esCorrecta": true,

        "tiempoSegundos": 55

      },

      {

        "preguntaId": "preg-cn6b-11",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 56

      },

      {

        "preguntaId": "preg-cn6b-12",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 57

      },

      {

        "preguntaId": "preg-cn6b-13",

        "respuestaDada": "D",

        "esCorrecta": true,

        "tiempoSegundos": 58

      },

      {

        "preguntaId": "preg-cn6b-14",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 59

      },

      {

        "preguntaId": "preg-cn6b-15",

        "respuestaDada": "D",

        "esCorrecta": true,

        "tiempoSegundos": 60

      },

      {

        "preguntaId": "preg-cn6b-16",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 61

      },

      {

        "preguntaId": "preg-cn6b-17",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 62

      },

      {

        "preguntaId": "preg-cn6b-18",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 63

      },

      {

        "preguntaId": "preg-cn6b-19",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 64

      },

      {

        "preguntaId": "preg-cn6b-20",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 65

      },

      {

        "preguntaId": "preg-cn6b-21",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 66

      },

      {

        "preguntaId": "preg-cn6b-22",

        "respuestaDada": "C",

        "esCorrecta": true,

        "tiempoSegundos": 67

      },

      {

        "preguntaId": "preg-cn6b-23",

        "respuestaDada": "D",

        "esCorrecta": true,

        "tiempoSegundos": 68

      },

      {

        "preguntaId": "preg-cn6b-24",

        "respuestaDada": "C",

        "esCorrecta": true,

        "tiempoSegundos": 69

      },

      {

        "preguntaId": "preg-cn6b-25",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 70

      },

      {

        "preguntaId": "preg-cn6b-26",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 71

      },

      {

        "preguntaId": "preg-cn6b-27",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 72

      },

      {

        "preguntaId": "preg-cn6b-28",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 73

      },

      {

        "preguntaId": "preg-cn6b-29",

        "respuestaDada": "C",

        "esCorrecta": true,

        "tiempoSegundos": 74

      },

      {

        "preguntaId": "preg-cn6b-30",

        "respuestaDada": "A",

        "esCorrecta": false,

        "tiempoSegundos": 45

      },

      {

        "preguntaId": "preg-cn6b-31",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 46

      },

      {

        "preguntaId": "preg-cn6b-32",

        "respuestaDada": "A",

        "esCorrecta": true,

        "tiempoSegundos": 47

      },

      {

        "preguntaId": "preg-cn6b-33",

        "respuestaDada": "D",

        "esCorrecta": true,

        "tiempoSegundos": 48

      },

      {

        "preguntaId": "preg-cn6b-34",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 49

      },

      {

        "preguntaId": "preg-cn6b-35",

        "respuestaDada": "B",

        "esCorrecta": true,

        "tiempoSegundos": 50

      }

    ],

    "estado": "enviada"

  }

];



export const rendicionesLenguajeMock: RendicionPrueba[] = [

  {

    id: 'rend-len-1',

    pruebaId: 'prueba-102',

    alumnoId: '00000000-0000-0000-0000-000000000002',

    alumnoNombre: 'Pedro Soto',

    alumnoRut: '22.876.543-0',

    fechaRendicion: '2026-08-05 11:00',

    puntajeObtenido: 4,

    puntajeMaximo: 5,

    porcentajeLogro: 80,

    puntajeEscalaNacional: 295,

    respuestas: [

      { preguntaId: 'preg-10', respuestaDada: 'B', esCorrecta: true, tiempoSegundos: 50 },

      { preguntaId: 'preg-11', respuestaDada: 'C', esCorrecta: true, tiempoSegundos: 40 }

    ],

    estado: 'enviada'

  },

  {

    id: 'rend-len-2',

    pruebaId: 'prueba-102',

    alumnoId: '00000000-0000-0000-0000-000000000003',

    alumnoNombre: 'Ana López',

    alumnoRut: '23.111.111-1',

    fechaRendicion: '2026-08-05 11:05',

    puntajeObtenido: 3,

    puntajeMaximo: 5,

    porcentajeLogro: 60,

    puntajeEscalaNacional: 250,

    respuestas: [

      { preguntaId: 'preg-10', respuestaDada: 'A', esCorrecta: false, tiempoSegundos: 75 },

      { preguntaId: 'preg-11', respuestaDada: 'C', esCorrecta: true, tiempoSegundos: 45 }

    ],

    estado: 'enviada'

  },

  {

    id: 'rend-len-3',

    pruebaId: 'prueba-102',

    alumnoId: '00000000-0000-0000-0000-000000000004',

    alumnoNombre: 'Carlos Martínez',

    alumnoRut: '22.222.222-2',

    fechaRendicion: '2026-08-05 11:10',

    puntajeObtenido: 2,

    puntajeMaximo: 5,

    porcentajeLogro: 40,

    puntajeEscalaNacional: 210,

    respuestas: [

      { preguntaId: 'preg-10', respuestaDada: 'D', esCorrecta: false, tiempoSegundos: 90 },

      { preguntaId: 'preg-11', respuestaDada: 'B', esCorrecta: false, tiempoSegundos: 60 }

    ],

    estado: 'enviada'

  },

  {

    id: 'rend-len-4',

    pruebaId: 'prueba-102',

    alumnoId: '00000000-0000-0000-0000-000000000005',

    alumnoNombre: 'Sofía Valenzuela',

    alumnoRut: '23.444.555-9',

    fechaRendicion: '2026-08-05 11:12',

    puntajeObtenido: 5,

    puntajeMaximo: 5,

    porcentajeLogro: 100,

    puntajeEscalaNacional: 335,

    respuestas: [

      { preguntaId: 'preg-10', respuestaDada: 'B', esCorrecta: true, tiempoSegundos: 42 },

      { preguntaId: 'preg-11', respuestaDada: 'C', esCorrecta: true, tiempoSegundos: 35 }

    ],

    estado: 'enviada'

  }

];

export const reporteCursoMock: ReporteTabuladoCurso = {
  pruebaId: 'prueba-101',
  pruebaTitulo: 'Evaluación Diagnóstica Nacional de Matemática 8° Básico',
  cursoNombre: '8° Básico A',
  totalAlumnosRendidos: 4,
  totalAlumnosMatriculados: 28,
  promedioPorcentajeLogro: 57,
  promedioEscalaNacional: 250,
  desgloseEjes: [
    { ejeId: 'eje-mat-1', codigo: 'MAT-NUM-8', nombre: 'Números y Operaciones', preguntasTotal: 4, respuestasCorrectas: 3, porcentajeLogro: 75, estado: 'optimo' },
    { ejeId: 'eje-mat-2', codigo: 'MAT-ALG-8', nombre: 'Álgebra y Funciones', preguntasTotal: 8, respuestasCorrectas: 5, porcentajeLogro: 62, estado: 'alerta' },
    { ejeId: 'eje-mat-3', codigo: 'MAT-GEO-8', nombre: 'Geometría y Triángulos', preguntasTotal: 8, respuestasCorrectas: 2, porcentajeLogro: 25, estado: 'critico' },
    { ejeId: 'eje-mat-4', codigo: 'MAT-PRO-8', nombre: 'Probabilidad y Estadística', preguntasTotal: 4, respuestasCorrectas: 3, porcentajeLogro: 75, estado: 'optimo' }
  ],
  desgloseHabilidades: [
    { habilidadId: 'hab-mat-2', codigo: 'MAT-APL', nombre: 'Aplicar Algoritmos y Conceptos', preguntasTotal: 8, respuestasCorrectas: 5, porcentajeLogro: 62 },
    { habilidadId: 'hab-mat-3', codigo: 'MAT-RAZ', nombre: 'Razonar y Argumentar', preguntasTotal: 8, respuestasCorrectas: 3, porcentajeLogro: 37 },
    { habilidadId: 'hab-mat-1', codigo: 'MAT-RES', nombre: 'Resolver Problemas', preguntasTotal: 4, respuestasCorrectas: 3, porcentajeLogro: 75 }
  ],
  preguntasMasFalladas: [
    {
      pregunta: preguntasMock[2],
      porcentajeError: 75,
      alternativaMasVotada: 'A (12 metros - Error por sumar lados sin Pitágoras)',
      totalRespuestas: 4
    },
    {
      pregunta: preguntasMock[3],
      porcentajeError: 50,
      alternativaMasVotada: 'C (Sí, porque todos sus lados son pares - Distractor de concepto)',
      totalRespuestas: 4
    },
    {
      pregunta: preguntasMock[1],
      porcentajeError: 50,
      alternativaMasVotada: 'A (8 azules y 12 rojas - Error de signo)',
      totalRespuestas: 4
    }
  ],
  planAccionReforzamiento: [
    {
      id: 'plan-1',
      titulo: 'Reforzamiento Intensivo de Teorema de Pitágoras y Geometría Rectangular',
      eje: 'Geometría (MAT-GEO-8)',
      habilidad: 'Razonar y Argumentar / Aplicar',
      nivelAlerta: 'alta',
      diagnostico: 'El 75% del curso falló al determinar la diagonal en figuras rectangulares. Los alumnos tienden a sumar directamente las dimensiones del rectángulo (12 + 9) en lugar de aplicar el Teorema de Pitágoras (a² + b² = c²). Se evidencia una confusión conceptual profunda entre perímetro y longitud diagonal.',
      sugerenciaPedagogica: 'Realizar 2 sesiones prácticas con material concreto e ilustración gráfica de triángulos rectángulos (terna pitagórica 3-4-5 y sus múltiplos 9-12-15). Modelar el cálculo paso a paso y enfatizar la comprobación visual de la hipotenusa.',
      ejerciciosRecomendados: [
        'Guía Práctica N° 4: Cálculo de diagonales en canchas y terrenos.',
        'Ejercicio interactivo: Identificación de ternas pitagóricas en cuadriláteros.',
        'Simulador virtual: Descomposición de rectángulos en 2 triángulos rectángulos congruentes.'
      ]
    },
    {
      id: 'plan-2',
      titulo: 'Nivelación de Sistemas de Ecuaciones Racionales y Planteamiento de Problemas',
      eje: 'Álgebra y Funciones (MAT-ALG-8)',
      habilidad: 'Razonar y Argumentar',
      nivelAlerta: 'media',
      diagnostico: 'El 50% de los estudiantes confunde el valor relativo de desplazamientos positivos y negativos (fichas azules vs rojas). El distractor A (8 azules y 12 rojas) fue el más seleccionado por no considerar que las fichas rojas restan posición.',
      sugerenciaPedagogica: 'Utilizar la recta numérica dinámica para representar movimientos hacia adelante (+1) y hacia atrás (-1). Plantear el sistema x + y = 20 y x - y = 2 como un juego de balanzas.',
      ejerciciosRecomendados: [
        'Taller grupal: Resolución de problemas de variación de posición mediante recta numérica.',
        'Desafío interactivo: Creación de tablas de prueba y error estructuradas.'
      ]
    }
  ],
  rendiciones: rendicionesMock
};

export const reporteCienciasMock: ReporteTabuladoCurso = {
  pruebaId: 'prueba-cn6b-101',
  pruebaTitulo: 'Ensayo 3 SIMCE Ciencias Naturales 6° Básico',
  cursoNombre: '6° Básico A',
  totalAlumnosRendidos: 4,
  totalAlumnosMatriculados: 32,
  promedioPorcentajeLogro: 64,
  promedioEscalaNacional: 276,
  desgloseEjes: [
    {
      ejeId: 'eje-cie-6b-1',
      codigo: 'CIE-OA01',
      nombre: 'Concepto de célula y niveles de organización',
      preguntasTotal: 1,
      respuestasCorrectas: 3,
      porcentajeLogro: 75,
      estado: 'optimo'
    },
    {
      ejeId: 'eje-cie-6b-2',
      codigo: 'CIE-OA02',
      nombre: 'Estructuras y funciones del sistema digestivo',
      preguntasTotal: 2,
      respuestasCorrectas: 6,
      porcentajeLogro: 75,
      estado: 'optimo'
    },
    {
      ejeId: 'eje-cie-6b-3',
      codigo: 'CIE-OA03',
      nombre: 'Sistema respiratorio y ventilación',
      preguntasTotal: 2,
      respuestasCorrectas: 7,
      porcentajeLogro: 88,
      estado: 'optimo'
    },
    {
      ejeId: 'eje-cie-6b-4',
      codigo: 'CIE-OA04',
      nombre: 'Sistema circulatorio y vasos sanguíneos',
      preguntasTotal: 2,
      respuestasCorrectas: 2,
      porcentajeLogro: 25,
      estado: 'critico'
    },
    {
      ejeId: 'eje-cie-6b-12',
      codigo: 'CIE-OA12',
      nombre: 'Componentes y símbolos de circuitos eléctricos',
      preguntasTotal: 3,
      respuestasCorrectas: 3,
      porcentajeLogro: 38,
      estado: 'critico'
    },
    {
      ejeId: 'eje-cie-6b-13',
      codigo: 'CIE-OA13',
      nombre: 'Materiales conductores y aislantes',
      preguntasTotal: 3,
      respuestasCorrectas: 9,
      porcentajeLogro: 75,
      estado: 'optimo'
    },
    {
      ejeId: 'eje-cie-6b-15',
      codigo: 'CIE-OA15',
      nombre: 'Océanos, lagos y variación de temperatura',
      preguntasTotal: 2,
      respuestasCorrectas: 3,
      porcentajeLogro: 38,
      estado: 'critico'
    },
    {
      ejeId: 'eje-cie-6b-17',
      codigo: 'CIE-OA17',
      nombre: 'Capas de la Tierra, atmósfera y suelo',
      preguntasTotal: 3,
      respuestasCorrectas: 8,
      porcentajeLogro: 67,
      estado: 'alerta'
    }
  ],
  desgloseHabilidades: [
    {
      habilidadId: 'hab-cie-1',
      codigo: 'CIE-CON',
      nombre: 'Conocimiento y Comprensión',
      preguntasTotal: 14,
      respuestasCorrectas: 42,
      porcentajeLogro: 75
    },
    {
      habilidadId: 'hab-cie-2',
      codigo: 'CIE-APL',
      nombre: 'Aplicación',
      preguntasTotal: 12,
      respuestasCorrectas: 31,
      porcentajeLogro: 65
    },
    {
      habilidadId: 'hab-cie-3',
      codigo: 'CIE-RAZ',
      nombre: 'Razonamiento y Pensamiento Científico',
      preguntasTotal: 9,
      respuestasCorrectas: 18,
      porcentajeLogro: 50
    }
  ],
  preguntasMasFalladas: [
    {
      pregunta: preguntasMock[6],
      porcentajeError: 75,
      alternativaMasVotada: 'A (El corazón dejaría de recibir sangre de piernas y abdomen - Error de anatomía vascular)',
      totalRespuestas: 4
    },
    {
      pregunta: preguntasMock[19],
      porcentajeError: 50,
      alternativaMasVotada: 'C (Interruptor - Confusión de símbolo fuente de energía)',
      totalRespuestas: 4
    },
    {
      pregunta: preguntasMock[29],
      porcentajeError: 50,
      alternativaMasVotada: 'A (La temperatura aumenta de manera gradual - Lectura invertida de gráfico)',
      totalRespuestas: 4
    }
  ],
  planAccionReforzamiento: [
    {
      id: 'plan-cn-1',
      titulo: 'Reforzamiento de Anatomía Cardiovascular y Circulación Mayor/Menor',
      eje: 'Sistema Circulatorio (CIE-OA04)',
      habilidad: 'Razonamiento y Pensamiento Científico',
      nivelAlerta: 'alta',
      diagnostico: 'El 75% del curso confunde la vena cava superior con la vena cava inferior.',
      sugerenciaPedagogica: 'Utilizar el modelo 3D y láminas interactivas del recorrido sanguíneo.',
      ejerciciosRecomendados: [
        'Guía interactiva N° 2: Mapeo del circuito sanguíneo y vasos principales.',
        'Taller de laboratorio: Esquema anatómico con flechas de flujo venoso y arterial.',
        'Simulador virtual: Impacto de oclusiones en cavidades cardíacas.'
      ]
    },
    {
      id: 'plan-cn-2',
      titulo: 'Interpretación de Simbología en Circuitos Eléctricos y Fuentes de Poder',
      eje: 'Circuitos Eléctricos Simples (CIE-OA12)',
      habilidad: 'Conocimiento y Comprensión / Aplicación',
      nivelAlerta: 'media',
      diagnostico: 'El 50% de los estudiantes confunde el símbolo normalizado de batería con interruptores.',
      sugerenciaPedagogica: 'Realizar una sesión de armado práctico de circuitos en mesa con simbología pictórica vs esquemática.',
      ejerciciosRecomendados: [
        'Ficha de lectura técnica: Catálogo de simbología eléctrica básica.',
        'Desafío práctico: Conversión de esquemas gráficos a diagramas de circuito reales.'
      ]
    }
  ],
  rendiciones: rendicionesMock
};

export const reporteLenguajeDemoMock: ReporteTabuladoCurso = {
  pruebaId: 'prueba-len-demo-101',
  pruebaTitulo: 'Ensayo SIMCE Lenguaje y Comunicación 8° Básico — Demo',
  cursoNombre: '8° Básico A',
  totalAlumnosRendidos: 4,
  totalAlumnosMatriculados: 28,
  promedioPorcentajeLogro: 68,
  promedioEscalaNacional: 258,
  desgloseEjes: [
    { ejeId: 'eje-len-1', codigo: 'LEN-LOC', nombre: 'Localizar Información Explícita', preguntasTotal: 10, respuestasCorrectas: 32, porcentajeLogro: 80, estado: 'optimo' },
    { ejeId: 'eje-len-2', codigo: 'LEN-INT', nombre: 'Interpretar y Relacionar Textos', preguntasTotal: 12, respuestasCorrectas: 31, porcentajeLogro: 65, estado: 'alerta' },
    { ejeId: 'eje-len-3', codigo: 'LEN-REF', nombre: 'Reflexionar y Evaluar Sentido Global', preguntasTotal: 8, respuestasCorrectas: 18, porcentajeLogro: 56, estado: 'alerta' },
    { ejeId: 'eje-len-4', codigo: 'LEN-ARG', nombre: 'Lectura Crítica y Argumentación', preguntasTotal: 5, respuestasCorrectas: 10, porcentajeLogro: 50, estado: 'alerta' }
  ],
  desgloseHabilidades: [
    { habilidadId: 'hab-len-1', codigo: 'LEN-LOC', nombre: 'Localizar Información', preguntasTotal: 10, respuestasCorrectas: 32, porcentajeLogro: 80 },
    { habilidadId: 'hab-len-2', codigo: 'LEN-INT', nombre: 'Interpretar y Relacionar', preguntasTotal: 15, respuestasCorrectas: 38, porcentajeLogro: 63 },
    { habilidadId: 'hab-len-3', codigo: 'LEN-REF', nombre: 'Reflexionar e Inferir', preguntasTotal: 10, respuestasCorrectas: 21, porcentajeLogro: 52 }
  ],
  preguntasMasFalladas: [
    {
      pregunta: preguntasMock[0] || {} as Pregunta,
      porcentajeError: 60,
      alternativaMasVotada: 'C (Confusión de propósito comunicativo en texto argumentativo)',
      totalRespuestas: 4
    }
  ],
  planAccionReforzamiento: [
    {
      id: 'plan-len-demo-1',
      titulo: 'Reforzamiento de Comprensión Lectora e Inferencia Textual',
      eje: 'Reflexionar y Evaluar (LEN-REF)',
      habilidad: 'Reflexionar e Inferir',
      nivelAlerta: 'alta',
      diagnostico: 'Dificultad recurrente en identificar la tesis central y argumentos de respaldo en editoriales y columnas de opinión.',
      sugerenciaPedagogica: 'Implementar rutina de pensamiento "Veo, Pienso, Me Pregunto" en textos expositivos y debates guiados.',
      ejerciciosRecomendados: [
        'Guía N° 4: Distinción entre hecho y opinión en medios masivos de comunicación.',
        'Taller de lectura: Identificación de conectores argumentativos y contraargumentos.'
      ]
    }
  ],
  rendiciones: rendicionesMock
};

export const reportePremilitarRealMock: ReporteTabuladoCurso = {
  pruebaId: 'prueba-102',
  pruebaTitulo: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026',
  cursoNombre: '2° Medio',
  totalAlumnosRendidos: 0,
  totalAlumnosMatriculados: 0,
  promedioPorcentajeLogro: 0,
  promedioEscalaNacional: 0,
  desgloseEjes: [
    { ejeId: 'eje-len-2m-1', codigo: 'LEN-LIT-2M', nombre: 'Lectura de Textos Literarios (Narrativa y Epistolar)', preguntasTotal: 3, respuestasCorrectas: 0, porcentajeLogro: 0, estado: 'alerta' },
    { ejeId: 'eje-len-2m-2', codigo: 'LEN-NOLIT-2M', nombre: 'Lectura de Textos No Literarios (Expositivos y Científicos)', preguntasTotal: 18, respuestasCorrectas: 0, porcentajeLogro: 0, estado: 'alerta' },
    { ejeId: 'eje-len-2m-3', codigo: 'LEN-ARG-2M', nombre: 'Lectura Crítica de Textos Argumentativos y Medios Masivos', preguntasTotal: 7, respuestasCorrectas: 0, porcentajeLogro: 0, estado: 'alerta' },
    { ejeId: 'eje-len-2m-4', codigo: 'LEN-ESC-2M', nombre: 'Escritura y Fundamentación Textual (Desarrollo y Rúbricas)', preguntasTotal: 2, respuestasCorrectas: 0, porcentajeLogro: 0, estado: 'alerta' }
  ],
  desgloseHabilidades: [
    { habilidadId: 'hab-len-1', codigo: 'LEN-LOC', nombre: 'Localizar Información', preguntasTotal: 6, respuestasCorrectas: 0, porcentajeLogro: 0 },
    { habilidadId: 'hab-len-2', codigo: 'LEN-INT', nombre: 'Interpretar y Relacionar', preguntasTotal: 14, respuestasCorrectas: 0, porcentajeLogro: 0 },
    { habilidadId: 'hab-len-3', codigo: 'LEN-REF', nombre: 'Reflexionar e Inferir', preguntasTotal: 10, respuestasCorrectas: 0, porcentajeLogro: 0 }
  ],
  preguntasMasFalladas: [],
  planAccionReforzamiento: [],
  rendiciones: []
};

export const reporteLenguajeMock = reporteLenguajeDemoMock;

// ─── SANDBOX DEMO SPECIALIZED DATA ──────────────────────────────

export interface SimceHistoricoPunto {
  anio: string;
  matematica: number;
  lenguaje: number;
  ciencias: number;
  promedioNacional: number;
}

export const simceHistoricoMock: SimceHistoricoPunto[] = [
  { anio: '2023', matematica: 232, lenguaje: 245, ciencias: 238, promedioNacional: 240 },
  { anio: '2024', matematica: 241, lenguaje: 250, ciencias: 244, promedioNacional: 243 },
  { anio: '2025', matematica: 250, lenguaje: 258, ciencias: 252, promedioNacional: 247 },
  { anio: '2026 Proy.', matematica: 265, lenguaje: 270, ciencias: 262, promedioNacional: 250 }
];

export interface MapaCalorCursoItem {
  cursoId: string;
  cursoNombre: string;
  nivel: string;
  profesorJefe: string;
  matematicaLogro: number;
  lenguajeLogro: number;
  cienciasLogro: number;
  alumnosEnRiesgo: number;
  estadoGeneral: 'critico' | 'alerta' | 'optimo';
}

export const mapaCalorCursosMock: MapaCalorCursoItem[] = [
  {
    cursoId: 'curso-1',
    cursoNombre: '8° Básico A',
    nivel: '8° Básico',
    profesorJefe: 'María González',
    matematicaLogro: 57,
    lenguajeLogro: 70,
    cienciasLogro: 62,
    alumnosEnRiesgo: 4,
    estadoGeneral: 'alerta'
  },
  {
    cursoId: 'curso-2',
    cursoNombre: '8° Básico B',
    nivel: '8° Básico',
    profesorJefe: 'Carlos Morales',
    matematicaLogro: 48,
    lenguajeLogro: 64,
    cienciasLogro: 55,
    alumnosEnRiesgo: 6,
    estadoGeneral: 'critico'
  },
  {
    cursoId: 'curso-6a',
    cursoNombre: '6° Básico A',
    nivel: '6° Básico',
    profesorJefe: 'Patricia Muñoz',
    matematicaLogro: 68,
    lenguajeLogro: 76,
    cienciasLogro: 65,
    alumnosEnRiesgo: 2,
    estadoGeneral: 'optimo'
  },
  {
    cursoId: 'curso-6b',
    cursoNombre: '6° Básico B',
    nivel: '6° Básico',
    profesorJefe: 'Patricia Muñoz',
    matematicaLogro: 54,
    lenguajeLogro: 68,
    cienciasLogro: 65,
    alumnosEnRiesgo: 5,
    estadoGeneral: 'alerta'
  }
];

export interface AlumnoAlertaCritica {
  id: string;
  nombre: string;
  curso: string;
  asignaturaCritica: string;
  ejeCritico: string;
  porcentajeLogro: number;
  planGenerado: boolean;
  diagnosticoBreve: string;
}

export const alumnosAlertasCriticasMock: AlumnoAlertaCritica[] = [
  {
    id: 'al-martin-s',
    nombre: 'Martín Sepúlveda',
    curso: '8° Básico B',
    asignaturaCritica: 'Matemática',
    ejeCritico: 'Álgebra y Funciones (Ecuaciones e Inecuaciones)',
    porcentajeLogro: 28,
    planGenerado: true,
    diagnosticoBreve: 'Confusión sistemática en despeje de incógnitas con coeficientes negativos y productos notables.'
  },
  {
    id: 'al-camila-r',
    nombre: 'Camila Rojas',
    curso: '8° Básico A',
    asignaturaCritica: 'Matemática',
    ejeCritico: 'Geometría (Teorema de Pitágoras)',
    porcentajeLogro: 35,
    planGenerado: true,
    diagnosticoBreve: 'Identifica hipotenusa pero aplica resta en lugar de suma en catetos al calcular distancias.'
  },
  {
    id: 'al-ignacio-p',
    nombre: 'Ignacio Pérez',
    curso: '6° Básico B',
    asignaturaCritica: 'Ciencias Naturales',
    ejeCritico: 'Sistemas del Cuerpo Humano (Circulatorio y Respiratorio)',
    porcentajeLogro: 32,
    planGenerado: true,
    diagnosticoBreve: 'Dificultad en correlacionar intercambio gaseoso alveolar con transporte de O2 en eritrocitos.'
  },
  {
    id: 'al-valentina-t',
    nombre: 'Valentina Torres',
    curso: '8° Básico B',
    asignaturaCritica: 'Lenguaje',
    ejeCritico: 'Textos No Literarios (Inferencia y Propósito del Autor)',
    porcentajeLogro: 40,
    planGenerado: false,
    diagnosticoBreve: 'Infiere intención emocional subjetiva en textos expositivos formales sin evidencia textual.'
  }
];

export const planReforzamientoMartinSepulveda = {
  alumno: 'Martín Sepúlveda',
  rut: '23.456.789-1',
  curso: '8° Básico B',
  asignatura: 'Matemática',
  profesor: 'María González',
  puntajeDiagnostico: '215 pts (Nivel Inicial)',
  brechaPrincipal: 'Álgebra y Funciones — Ecuaciones lineales con fracciones y números enteros',
  objetivosAprendizaje: [
    'OA 02: Representar y resolver ecuaciones e inecuaciones lineales de la forma ax + b = c.',
    'Habilidad: Aplicar Algoritmos y Conceptos (MAT-APL).'
  ],
  diagnosticoDetallado: 'Martín presenta solidez en operaciones aritméticas básicas (82% en Números), pero cae abruptamente al 28% cuando la incógnita incluye coeficientes fraccionarios o signos negativos en la distributividad. Tiende a omitir el cambio de signo al trasponer términos.',
  actividadesSugeridas: [
    {
      semana: 'Semana 1',
      foco: 'Balanza de ecuaciones y modelado concreto',
      detalle: 'Ejercicios interactivos con balanza digital para afianzar el concepto de equivalencia antes del cálculo abstracto.'
    },
    {
      semana: 'Semana 2',
      foco: 'Propiedad distributiva con signos negativos: a(bx - c)',
      detalle: 'Guía focalizada de 10 ejercicios con resolución guiada paso a paso y verificación de soluciones.'
    },
    {
      semana: 'Semana 3',
      foco: 'Mini-ensayo formativo de 5 preguntas de Álgebra',
      detalle: 'Comprobación de progreso en plataforma Sysget Saber con reporte inmediato al apoderado.'
    }
  ],
  materialDescargable: 'Ficha_Reforzamiento_Algebra_8B_MartinS.pdf'
};

export const evaluacionEscrituraIAMock = {
  estudiante: 'Sofía Valenzuela (8° Básico A)',
  tipoTexto: 'Texto Argumentativo — Ensayo de Opinión',
  tema: '¿Debe prohibirse el uso de teléfonos celulares en las aulas de clase?',
  puntajeGlobal: 18,
  puntajeMaximo: 20,
  nivelAlcanzado: 'Destacado (Nivel 4 / 4)',
  rubricaCriterios: [
    { criterio: 'Tesis y Postura', puntaje: 4, max: 4, feedback: 'Tesis explícita, clara y sustentada desde el párrafo introductorio.' },
    { criterio: 'Calidad de Argumentos', puntaje: 4, max: 4, feedback: 'Utiliza dos argumentos sólidos basados en evidencia pedagógica y un contraargumento refutado adecuadamente.' },
    { criterio: 'Cohesión y Conectores', puntaje: 3, max: 4, feedback: 'Buen uso de conectores causales y consecutivos. Se sugiere variar conectores adversativos (abusa de "sin embargo").' },
    { criterio: 'Ortografía y Vocabulario', puntaje: 4, max: 4, feedback: 'Vocabulario preciso y registro formal consistente. Cero faltas de acentuación diacrítica.' },
    { criterio: 'Conclusión y Síntesis', puntaje: 3, max: 4, feedback: 'Cierre convincente que sintetiza la postura, aunque podría proyectar una propuesta de solución más concreta.' }
  ],
  retroalimentacionIA: 'El texto demuestra un dominio sobresaliente de la estructura argumentativa para 8° Básico. Se recomienda a la docente felicitar a la estudiante y motivarla a redactar columnas de opinión para el periódico escolar.',
  tiempoCorreccionIA: '1.2 segundos (Motor NLP Curricular Sysget)'
};
