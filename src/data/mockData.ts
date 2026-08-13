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
  ReporteTabuladoCurso
} from '../types';

export const currentUserProfesor: UserProfile = {
  id: '00000000-0000-0000-0000-000000000001',
  rut: '12.345.678-9',
  nombre: 'María',
  apellido: 'González',
  email: 'maria.gonzalez@escuelademo.cl',
  rol: 'profesor',
  establecimiento: APP_CONFIG.nombreEstablecimiento
};

export const currentUserAlumno: UserProfile = {
  id: '00000000-0000-0000-0000-000000000002',
  rut: '22.876.543-0',
  nombre: 'Pedro',
  apellido: 'Soto',
  email: 'pedro.soto@escuelademo.cl',
  rol: 'alumno',
  establecimiento: APP_CONFIG.nombreEstablecimiento
};

export const asignaturasMock: Asignatura[] = [
  { id: 'asig-1', codigo: 'MAT', nombre: 'Matemática' },
  { id: 'asig-2', codigo: 'LEN', nombre: 'Lenguaje y Comunicación (Lectura)' },
  { id: 'asig-3', codigo: 'CN', nombre: 'Ciencias Naturales' }
];

export const ejesTematicosMock: EjeTematico[] = [
  // Matemática 8° Básico / Media
  { id: 'eje-mat-1', codigo: 'MAT-NUM-8', nombre: 'Números y Operaciones', asignaturaId: 'asig-1' },
  { id: 'eje-mat-2', codigo: 'MAT-ALG-8', nombre: 'Álgebra y Funciones', asignaturaId: 'asig-1' },
  { id: 'eje-mat-3', codigo: 'MAT-GEO-8', nombre: 'Geometría', asignaturaId: 'asig-1' },
  { id: 'eje-mat-4', codigo: 'MAT-PRO-8', nombre: 'Probabilidad y Estadística', asignaturaId: 'asig-1' },
  // Lenguaje
  { id: 'eje-len-1', codigo: 'LEN-LEC-8', nombre: 'Comprensión Lectora (Textos Literarios)', asignaturaId: 'asig-2' },
  { id: 'eje-len-2', codigo: 'LEN-INF-8', nombre: 'Textos No Literarios e Informativos', asignaturaId: 'asig-2' },
  // Ciencias
  { id: 'eje-cie-1', codigo: 'CIE-BIO', nombre: 'Biología y Ecosistemas', asignaturaId: 'asig-3' },
  { id: 'eje-cie-2', codigo: 'CIE-FIS', nombre: 'Física y Fuerzas', asignaturaId: 'asig-3' },
  { id: 'eje-cie-3', codigo: 'CIE-QUI', nombre: 'Química y Materia', asignaturaId: 'asig-3' }
];

export const habilidadesMock: Habilidad[] = [
  // Matemática
  { id: 'hab-mat-1', codigo: 'MAT-RES', nombre: 'Resolver Problemas', asignaturaId: 'asig-1' },
  { id: 'hab-mat-2', codigo: 'MAT-APL', nombre: 'Aplicar Algoritmos y Conceptos', asignaturaId: 'asig-1' },
  { id: 'hab-mat-3', codigo: 'MAT-RAZ', nombre: 'Razonar y Argumentar', asignaturaId: 'asig-1' },
  { id: 'hab-mat-4', codigo: 'MAT-MOD', nombre: 'Modelar situaciones', asignaturaId: 'asig-1' },
  // Lenguaje
  { id: 'hab-len-1', codigo: 'LEN-LOC', nombre: 'Localizar Información', asignaturaId: 'asig-2' },
  { id: 'hab-len-2', codigo: 'LEN-INT', nombre: 'Interpretar y Relacionar', asignaturaId: 'asig-2' },
  { id: 'hab-len-3', codigo: 'LEN-REF', nombre: 'Reflexionar e Inferir', asignaturaId: 'asig-2' },
  // Ciencias
  { id: 'hab-cie-1', codigo: 'CIE-OBS', nombre: 'Observar y Reconocer', asignaturaId: 'asig-3' },
  { id: 'hab-cie-2', codigo: 'CIE-APL', nombre: 'Aplicar principios científicos', asignaturaId: 'asig-3' },
  { id: 'hab-cie-3', codigo: 'CIE-ANL', nombre: 'Analizar y Concluir', asignaturaId: 'asig-3' }
];

export const preguntasMock: Pregunta[] = [
  // 1. Números - Aplicación
  {
    id: 'preg-1',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-1',
    habilidadId: 'hab-mat-2',
    tipo: 'seleccion_multiple',
    nivel: '8° básico',
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
    nivel: '8° básico',
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
    nivel: '8° básico',
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
    nivel: '8° básico',
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
    nivel: '8° básico',
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
    nivel: '8° básico',
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
    nivel: '8° básico',
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
  // 8. Geometría - Área del círculo
  {
    id: 'preg-8',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-3',
    habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple',
    nivel: '8° básico',
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
  // 10. Lectura - Inferencia Local
  {
    id: 'preg-10',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-1',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '8° básico',
    dificultad: 'media',
    enunciado: 'Lea el texto: "El viejo pescador observó las nubes oscuras en el horizonte y recogió sus redes rápidamente antes de que el viento cambiara de rumbo". ¿Qué se puede inferir del comportamiento del pescador?',
    alternativas: [
      { letra: 'A', texto: 'Tenía miedo de perder su embarcación.', es_correcta: false },
      { letra: 'B', texto: 'Anticipaba la llegada inminente de una tormenta.', es_correcta: true },
      { letra: 'C', texto: 'Ya había completado su cuota de pesca del día.', es_correcta: false },
      { letra: 'D', texto: 'Deseaba vender el pescado antes del atardecer.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Liberada Oficial'
  },
  // 11. Lectura - Propósito Comunicativo
  {
    id: 'preg-11',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '8° básico',
    dificultad: 'baja',
    enunciado: '¿Cuál es la función principal de una noticia publicada en un periódico o portal de noticias digital?',
    alternativas: [
      { letra: 'A', texto: 'Expresar los sentimientos íntimos del autor.', es_correcta: false },
      { letra: 'B', texto: 'Entretener al lector mediante una historia fantástica.', es_correcta: false },
      { letra: 'C', texto: 'Informar de manera objetiva sobre un hecho reciente de interés público.', es_correcta: true },
      { letra: 'D', texto: 'Convencer al lector de comprar un producto determinado.', es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 1,
    fuente: 'Banco Institucional'
  },
  // 12. Ciencias Naturales - Biología
  {
    id: 'preg-12',
    asignaturaId: 'asig-3',
    ejeTematicoId: 'eje-cie-1',
    habilidadId: 'hab-cie-1',
    tipo: 'seleccion_multiple',
    nivel: '8° básico',
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
    nivel: '8° básico',
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
    nivel: '8° básico',
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
    nivel: '8° básico',
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
    nivel: '8° básico',
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
    nivel: '8° básico',
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
    nivel: '8° básico',
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
    nivel: '8° básico',
    dificultad: 'alta',
    enunciado: 'Redacte una breve postura argumentativa (mínimo 3 líneas) señalando la importancia del uso responsable de las redes sociales en jóvenes escolares.',
    alternativas: [],
    respuestaCorrecta: null,
    puntaje: 2,
    fuente: 'Elaboración Docente'
  }
];

export const cursosMock: Curso[] = [
  {
    id: 'curso-1',
    nombre: '8° Básico A',
    nivel: '8° básico',
    profesorId: currentUserProfesor.id,
    establecimiento: 'Escuela Bicentenario Demo',
    anio: 2026,
    codigoInvitacion: 'DEMO2026'
  },
  {
    id: 'curso-2',
    nombre: '8° Básico B',
    nivel: '8° básico',
    profesorId: currentUserProfesor.id,
    establecimiento: 'Escuela Bicentenario Demo',
    anio: 2026,
    codigoInvitacion: 'B8B2026'
  }
];

export const pruebasMock: Prueba[] = [
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
    preguntasIds: ['preg-1', 'preg-2', 'preg-3', 'preg-4', 'preg-5', 'preg-6'],
    totalPreguntas: 6,
    estado: 'activa'
  },
  {
    id: 'prueba-102',
    titulo: 'Ensayo Formativo N° 1 - Comprensión Lectora',
    descripcion: 'Evaluación formativa de inferencia y localización de información en textos narrativos.',
    asignaturaId: 'asig-2',
    asignaturaNombre: 'Lenguaje y Comunicación',
    nivel: '8° básico',
    profesorId: currentUserProfesor.id,
    cursoId: 'curso-1',
    cursoNombre: '8° Básico A',
    codigoPublico: 'EVAL-8A-LEN',
    duracionMinutos: 30,
    creadoEn: '2026-08-01',
    preguntasIds: ['preg-1'],
    totalPreguntas: 5,
    estado: 'finalizada'
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
      pregunta: preguntasMock[2], // Pregunta 3 Geometría
      porcentajeError: 75,
      alternativaMasVotada: 'A (12 metros - Error por sumar lados sin Pitágoras)',
      totalRespuestas: 4
    },
    {
      pregunta: preguntasMock[3], // Pregunta 4 Teorema de Pitágoras
      porcentajeError: 50,
      alternativaMasVotada: 'C (Sí, porque todos sus lados son pares - Distractor de concepto)',
      totalRespuestas: 4
    },
    {
      pregunta: preguntasMock[1], // Pregunta 2 Álgebra
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

export const reporteLenguajeMock: ReporteTabuladoCurso = {
  pruebaId: 'prueba-102',
  pruebaTitulo: 'Ensayo Formativo N° 1 - Comprensión Lectora',
  cursoNombre: '8° Básico A',
  totalAlumnosRendidos: 4,
  totalAlumnosMatriculados: 28,
  promedioPorcentajeLogro: 70,
  promedioEscalaNacional: 272,
  desgloseEjes: [
    { ejeId: 'eje-len-1', codigo: 'LEN-LEC-8', nombre: 'Comprensión Lectora (Textos Literarios)', preguntasTotal: 3, respuestasCorrectas: 3, porcentajeLogro: 85, estado: 'optimo' },
    { ejeId: 'eje-len-2', codigo: 'LEN-INF-8', nombre: 'Textos No Literarios e Informativos', preguntasTotal: 2, respuestasCorrectas: 1, porcentajeLogro: 52, estado: 'alerta' }
  ],
  desgloseHabilidades: [
    { habilidadId: 'hab-len-1', codigo: 'LEN-LOC', nombre: 'Localizar Información', preguntasTotal: 2, respuestasCorrectas: 2, porcentajeLogro: 90 },
    { habilidadId: 'hab-len-2', codigo: 'LEN-INT', nombre: 'Interpretar y Relacionar', preguntasTotal: 2, respuestasCorrectas: 1, porcentajeLogro: 68 },
    { habilidadId: 'hab-len-3', codigo: 'LEN-REF', nombre: 'Reflexionar e Inferir', preguntasTotal: 1, respuestasCorrectas: 0, porcentajeLogro: 45 }
  ],
  preguntasMasFalladas: [
    {
      pregunta: preguntasMock[9],
      porcentajeError: 50,
      alternativaMasVotada: 'A (Tenía miedo de perder su embarcación - Inferencia no sustentada)',
      totalRespuestas: 4
    },
    {
      pregunta: preguntasMock[10],
      porcentajeError: 25,
      alternativaMasVotada: 'B (Entretener al lector mediante una historia fantástica)',
      totalRespuestas: 4
    }
  ],
  planAccionReforzamiento: [
    {
      id: 'plan-len-1',
      titulo: 'Taller de Inferencia Implícita y Claves Contextuales en Textos Narrativos e Informativos',
      eje: 'Textos No Literarios e Informativos (LEN-INF-8)',
      habilidad: 'Reflexionar e Inferir (LEN-REF)',
      nivelAlerta: 'alta',
      diagnostico: 'El 50% de los estudiantes confunde las deducciones e inferencias lógicas sustentadas en el texto con suposiciones personales o interpretaciones subjetivas sin evidencia textual. La opción A (temor del pescador) fue elegida por inferir emociones no mencionadas explícita ni implícitamente.',
      sugerenciaPedagogica: 'Modelar en la pizarra la diferencia entre "marcas textuales" (pistas que deja el autor) y "suposiciones personales". Practicar la técnica de rastreo de evidencia textual antes de marcar una alternativa.',
      ejerciciosRecomendados: [
        'Guía de Lectura Crítica N° 1: Identificación de pistas contextuales e inferencias válidas.',
        'Taller grupal: Análisis de propósito implícito en microcuentos y crónicas.',
        'Ficha de autocontrol: "¿Qué dice el texto?" vs "¿Qué supongo yo?".'
      ]
    }
  ],
  rendiciones: rendicionesLenguajeMock
};

