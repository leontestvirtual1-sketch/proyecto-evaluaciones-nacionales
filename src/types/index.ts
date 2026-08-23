export type UserRole = 'admin' | 'profesor' | 'alumno';
export type UserEstado = 'pendiente_aprobacion' | 'activo' | 'suspendido' | 'rechazado';
export type UserPlan = 'trial' | 'free' | 'pro' | 'institucional';

export interface EstablecimientoInfo {
  rbd: string;
  nombre: string;
  comuna: string;
  dependencia: string;
  logoUrl: string;
  lema?: string;
}

export interface UserProfile {
  id: string;
  rut: string;
  nombre: string;
  apellido: string;
  apellidoPaterno?: string;     // Apellido Paterno
  apellidoMaterno?: string;     // Apellido Materno
  email: string;
  rol: UserRole;
  establecimiento: string;
  rbd?: string;                // Código RBD oficial del establecimiento
  comuna?: string;             // Comuna del establecimiento
  dependencia?: string;        // Dependencia administrativa (Particular Subvencionado, Municipal, etc.)
  logoUrl?: string;            // Ruta al logo o insignia del colegio
  asignaturaId?: string;       // Asignatura principal para aislamiento de ambiente (ej. 'asig-1' = Matemática)
  asignaturaNombre?: string;   // Nombre descriptivo (ej. 'Matemática')
  cargo?: string;              // Cargo opcional (ej. 'Jefe de UTP', 'Docente de Aula')
  estado?: UserEstado;         // Estado de aprobación
  plan?: UserPlan;             // Plan de suscripción
  trialEndsAt?: string;        // Fecha de fin del período de prueba (30 días)
  diasRestantesTrial?: number; // Días restantes de prueba calculados
  fechaRegistro?: string;      // Fecha en que se registró la cuenta
  approvalToken?: string;      // Token de aprobación directa de 1-clic desde correo
}


export interface Asignatura {
  id: string;
  codigo: string;
  nombre: string;
}

export interface AlumnoBasico {
  id: string;
  rut: string;
  nombre: string;
  apellido: string;
  cursoId: string;
  cursoNombre: string;
  numeroDeLista?: number;
}

export interface EjeTematico {
  id: string;
  codigo: string;
  nombre: string;
  asignaturaId: string;
}

export interface Habilidad {
  id: string;
  codigo: string;
  nombre: string;
  asignaturaId: string;
}

export interface Alternativa {
  letra: string;
  texto: string;
  es_correcta: boolean;
}

export type TipoPregunta = 'seleccion_multiple' | 'desarrollo';
export type DificultadPregunta = 'baja' | 'media' | 'alta' | 'facil' | 'dificil';

export interface Pregunta {
  id: string;
  propietarioId?: string;
  propietarioNombre?: string;
  establecimiento?: string;
  asignaturaId: string;
  ejeTematicoId: string;
  habilidadId: string;
  tipo: TipoPregunta;
  nivel: string;
  dificultad: DificultadPregunta;
  enunciado: string;
  imagenUrl?: string;
  tablaMarkdown?: string;
  alternativas: Alternativa[];
  respuestaCorrecta: string | null;
  puntaje: number;
  fuente: string;
}

export interface Curso {
  id: string;
  nombre: string;
  nivel: string;
  profesorId: string;
  establecimiento: string;
  anio: number;
  codigoInvitacion: string;
}

export interface Prueba {
  id: string;
  titulo: string;
  descripcion: string;
  establecimiento?: string;
  asignaturaId: string;
  asignaturaNombre: string;
  nivel: string;
  profesorId: string;
  cursoId: string;
  cursoNombre: string;
  codigoPublico: string;
  duracionMinutos: number;
  creadoEn: string;
  preguntasIds: string[];
  totalPreguntas: number;
  estado: 'borrador' | 'activa' | 'finalizada';
}

export interface RespuestaAlumno {
  preguntaId: string;
  respuestaDada: string;
  esCorrecta: boolean;
  tiempoSegundos: number;
}

export interface RendicionPrueba {
  id: string;
  pruebaId: string;
  alumnoId: string;
  alumnoNombre: string;
  alumnoRut: string;
  fechaRendicion: string;
  puntajeObtenido: number;
  puntajeMaximo: number;
  porcentajeLogro: number;
  puntajeEscalaNacional: number; // Escala 100 - 350
  respuestas: RespuestaAlumno[];
  estado: 'en_progreso' | 'enviada';
}

export interface DesgloseEje {
  ejeId: string;
  codigo: string;
  nombre: string;
  preguntasTotal: number;
  respuestasCorrectas: number;
  porcentajeLogro: number;
  estado: 'critico' | 'alerta' | 'optimo';
}

export interface DesgloseHabilidad {
  habilidadId: string;
  codigo: string;
  nombre: string;
  preguntasTotal: number;
  respuestasCorrectas: number;
  porcentajeLogro: number;
}

export interface PreguntaFallada {
  pregunta: Pregunta;
  porcentajeError: number;
  alternativaMasVotada: string;
  totalRespuestas: number;
}

export interface ItemPlanReforzamiento {
  id: string;
  titulo: string;
  eje: string;
  habilidad: string;
  nivelAlerta: 'alta' | 'media' | 'baja';
  diagnostico: string;
  sugerenciaPedagogica: string;
  ejerciciosRecomendados: string[];
}

export interface ReporteTabuladoCurso {
  pruebaId: string;
  pruebaTitulo: string;
  cursoNombre: string;
  totalAlumnosRendidos: number;
  totalAlumnosMatriculados: number;
  promedioPorcentajeLogro: number;
  promedioEscalaNacional: number;
  desgloseEjes: DesgloseEje[];
  desgloseHabilidades: DesgloseHabilidad[];
  preguntasMasFalladas: PreguntaFallada[];
  planAccionReforzamiento: ItemPlanReforzamiento[];
  rendiciones: RendicionPrueba[];
}

export interface SeguimientoDocente {
  profesorId: string;
  profesorNombre: string;
  profesorEmail: string;
  avatarColor: string;
  iniciales: string;
  asignaturaId: string;
  asignaturaNombre: string;
  cursosAsignados: string[];
  totalEvaluacionesCreadas: number;
  totalEvaluacionesActivas: number;
  totalAlumnosEvaluados: number;
  totalAlumnosMatriculados: number;
  coberturaCurricularPorcentaje: number;
  promedioLogroAlumnos: number;
  puntajeSimceEstimado: number;
  estadoAvancePME: 'en_meta' | 'en_progreso' | 'requiere_apoyo';
  ejeMayorFortaleza: string;
  ejeMayorDebilidad: string;
  ultimaEvaluacionFecha: string;
  ultimaEvaluacionTitulo: string;
  ultimaEvaluacionId: string;
  planesRemedialesGenerados: number;
}
