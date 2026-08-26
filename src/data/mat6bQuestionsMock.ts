import { Pregunta, EjeTematico, Prueba } from '../types';

export const ejesTematicosMatematica6BMock: EjeTematico[] = [
  { id: 'eje-mat-6b-1', codigo: 'MAT-6B-NUM-POS', nombre: 'Valor posicional y operaciones en números naturales', asignaturaId: 'asig-1' },
  { id: 'eje-mat-6b-2', codigo: 'MAT-6B-NUM-COMB', nombre: 'Precedencia de operaciones y cálculos combinados', asignaturaId: 'asig-1' },
  { id: 'eje-mat-6b-3', codigo: 'MAT-6B-NUM-FRAC', nombre: 'Fracciones impropias y números mixtos', asignaturaId: 'asig-1' },
  { id: 'eje-mat-6b-4', codigo: 'MAT-6B-NUM-ADFRAC', nombre: 'Adición y sustracción de fracciones', asignaturaId: 'asig-1' },
  { id: 'eje-mat-6b-5', codigo: 'MAT-6B-NUM-DEC', nombre: 'Operaciones con números decimales', asignaturaId: 'asig-1' },
  { id: 'eje-mat-6b-6', codigo: 'MAT-6B-NUM-RAZ', nombre: 'Concepto y cálculo de razones', asignaturaId: 'asig-1' },
  { id: 'eje-mat-6b-7', codigo: 'MAT-6B-NUM-PORC', nombre: 'Concepto y representación de porcentajes', asignaturaId: 'asig-1' },
  { id: 'eje-mat-6b-8', codigo: 'MAT-6B-NUM-MULTDEC', nombre: 'Multiplicación de decimales por potencias de 10', asignaturaId: 'asig-1' },
  { id: 'eje-mat-6b-9', codigo: 'MAT-6B-NUM-DIN', nombre: 'Resolución de problemas con dinero y operaciones', asignaturaId: 'asig-1' },
  { id: 'eje-mat-6b-10', codigo: 'MAT-6B-NUM-PRIM', nombre: 'Números primos y compuestos', asignaturaId: 'asig-1' },
  { id: 'eje-mat-6b-11', codigo: 'MAT-6B-ALG-SUC', nombre: 'Patrones y sucesiones numéricas/geométricas', asignaturaId: 'asig-1' },
  { id: 'eje-mat-6b-12', codigo: 'MAT-6B-ALG-ECU', nombre: 'Ecuaciones e inecuaciones de primer grado', asignaturaId: 'asig-1' },
  { id: 'eje-mat-6b-13', codigo: 'MAT-6B-ALG-MOD', nombre: 'Modelación con lenguaje algebraico y desigualdades', asignaturaId: 'asig-1' },
  { id: 'eje-mat-6b-14', codigo: 'MAT-6B-GEO-AREA', nombre: 'Cálculo de áreas de triángulos y cuadriláteros', asignaturaId: 'asig-1' },
  { id: 'eje-mat-6b-15', codigo: 'MAT-6B-GEO-PLANO', nombre: 'Ubicación y coordenadas en el plano cartesiano', asignaturaId: 'asig-1' },
  { id: 'eje-mat-6b-16', codigo: 'MAT-6B-GEO-3D2D', nombre: 'Figuras 3D y 2D (aristas, caras y perpendicularidad)', asignaturaId: 'asig-1' },
  { id: 'eje-mat-6b-17', codigo: 'MAT-6B-GEO-CONG', nombre: 'Congruencia y transformaciones isométricas', asignaturaId: 'asig-1' },
  { id: 'eje-mat-6b-18', codigo: 'MAT-6B-MED-LONG', nombre: 'Conversión de unidades de longitud del sistema métrico', asignaturaId: 'asig-1' },
  { id: 'eje-mat-6b-19', codigo: 'MAT-6B-DAT-PROB', nombre: 'Comparación y estimación de probabilidades', asignaturaId: 'asig-1' },
  { id: 'eje-mat-6b-20', codigo: 'MAT-6B-DAT-TALLO', nombre: 'Diagramas de tallo y hojas', asignaturaId: 'asig-1' },
  { id: 'eje-mat-6b-21', codigo: 'MAT-6B-DAT-PROM', nombre: 'Cálculo e interpretación del promedio aritmético', asignaturaId: 'asig-1' }
];

export const preguntasMatematica6BMock: Pregunta[] = [
  {
    id: 'preg-mat6b-e3-01',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-1',
    habilidadId: 'hab-mat-2',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'baja',
    enunciado: "¿Qué valor representa el dígito **3** en el número **5 237 491**?",
    alternativas: [
      { letra: 'A', texto: "3", es_correcta: false },
      { letra: 'B', texto: "30", es_correcta: false },
      { letra: 'C', texto: "30 000", es_correcta: true },
      { letra: 'D', texto: "3 000 000", es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 1,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-02',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-1',
    habilidadId: 'hab-mat-2',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'baja',
    enunciado: "¿Qué valor representa el dígito **6** en el número **5 726 378**?",
    alternativas: [
      { letra: 'A', texto: "6", es_correcta: false },
      { letra: 'B', texto: "6 000", es_correcta: true },
      { letra: 'C', texto: "60 000", es_correcta: false },
      { letra: 'D', texto: "600 000", es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-03',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-1',
    habilidadId: 'hab-mat-3',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'baja',
    enunciado: "Observa la cantidad de habitantes de algunas ciudades de Chile:\n\n| Ciudad | Cantidad de habitantes |\n| :--- | :---: |\n| Calama | 147 886 |\n| Talca | 201 797 |\n| Osorno | 145 475 |\n| Puerto Montt | 218 858 |\n\n¿Cuál de estas ciudades es la que tiene mayor cantidad de habitantes?",
    alternativas: [
      { letra: 'A', texto: "Calama", es_correcta: false },
      { letra: 'B', texto: "Talca", es_correcta: false },
      { letra: 'C', texto: "Osorno", es_correcta: false },
      { letra: 'D', texto: "Puerto Montt", es_correcta: true }
    ],
    respuestaCorrecta: 'D',
    puntaje: 1,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-04',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-1',
    habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'media',
    enunciado: "¿Cuál es el resultado de la siguiente operación combinada?\n\n$$3 \\cdot 8 - 6 : 2$$",
    alternativas: [
      { letra: 'A', texto: "3", es_correcta: false },
      { letra: 'B', texto: "9", es_correcta: false },
      { letra: 'C', texto: "15", es_correcta: false },
      { letra: 'D', texto: "21", es_correcta: true }
    ],
    respuestaCorrecta: 'D',
    puntaje: 2,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-05',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-1',
    habilidadId: 'hab-mat-2',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'media',
    imagenUrl: '/preguntas/simce_mat_6b_e3/p05_recta_numerica.png',
    enunciado: "Observa la recta numérica:\n\n¿Cuál es el número mixto que se encuentra en el punto **P** de la recta numérica?",
    alternativas: [
      { letra: 'A', texto: "1 3/5", es_correcta: true },
      { letra: 'B', texto: "1 4/5", es_correcta: false },
      { letra: 'C', texto: "1 3/6", es_correcta: false },
      { letra: 'D', texto: "1 4/6", es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 2,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-06',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-1',
    habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'media',
    enunciado: "María y Pedro están compartiendo una pizza. María ha comido $\\frac{5}{6}$ de la pizza y Pedro ha comido $\\frac{1}{3}$. ¿Cuánto más ha comido María que Pedro?",
    alternativas: [
      { letra: 'A', texto: "1/6", es_correcta: false },
      { letra: 'B', texto: "4/3", es_correcta: false },
      { letra: 'C', texto: "2/6", es_correcta: false },
      { letra: 'D', texto: "1/2", es_correcta: true }
    ],
    respuestaCorrecta: 'D',
    puntaje: 2,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-07',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-1',
    habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'baja',
    enunciado: "En una panadería, se usaron **2,75 kg** de harina el día lunes y **1,85 kg** de harina el día martes. ¿Cuántos kilogramos más de harina se usaron el día lunes?",
    alternativas: [
      { letra: 'A', texto: "0,90 kg", es_correcta: true },
      { letra: 'B', texto: "0,95 kg", es_correcta: false },
      { letra: 'C', texto: "1,10 kg", es_correcta: false },
      { letra: 'D', texto: "4,60 kg", es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-08',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-1',
    habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'media',
    enunciado: "En el 6° B de la escuela Los Alerces, se hizo una encuesta para decidir el color de las camisetas del equipo. Si de un total de **50** estudiantes, **30** prefirieron rojo y el resto azul, ¿cuál es la razón entre los que prefirieron azul y el total?",
    alternativas: [
      { letra: 'A', texto: "1 : 2", es_correcta: false },
      { letra: 'B', texto: "2 : 5", es_correcta: true },
      { letra: 'C', texto: "3 : 5", es_correcta: false },
      { letra: 'D', texto: "4 : 5", es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 2,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-09',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-1',
    habilidadId: 'hab-mat-2',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'baja',
    enunciado: "¿Qué número mixto es equivalente a la fracción impropia $\\frac{7}{3}$?",
    alternativas: [
      { letra: 'A', texto: "2 1/3", es_correcta: true },
      { letra: 'B', texto: "3 1/7", es_correcta: false },
      { letra: 'C', texto: "1 4/3", es_correcta: false },
      { letra: 'D', texto: "2 2/3", es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-10',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-1',
    habilidadId: 'hab-mat-2',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'baja',
    imagenUrl: '/preguntas/simce_mat_6b_e3/p10_circulo_porcentajes.png',
    enunciado: "El siguiente círculo está dividido en **10** partes iguales:\n\n¿Qué porcentaje de la superficie total representa el sector ennegrecido?",
    alternativas: [
      { letra: 'A', texto: "10%", es_correcta: false },
      { letra: 'B', texto: "20%", es_correcta: false },
      { letra: 'C', texto: "40%", es_correcta: true },
      { letra: 'D', texto: "50%", es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 1,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-11',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-1',
    habilidadId: 'hab-mat-2',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'baja',
    enunciado: "Observa la siguiente descomposición aditiva:\n\n$$3\\text{ UMi} + 4\\text{ CM} + 5\\text{ DM} + 6\\text{ UM} + 7\\text{ C} + 8\\text{ D} + 9\\text{ U}$$\n\n¿Cuál es el número correspondiente?",
    alternativas: [
      { letra: 'A', texto: "345 689", es_correcta: false },
      { letra: 'B', texto: "3 456 789", es_correcta: true },
      { letra: 'C', texto: "34 567 890", es_correcta: false },
      { letra: 'D', texto: "3 004 567 809", es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-12',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-1',
    habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'media',
    enunciado: "¿Cuál es el resultado de la siguiente suma de fracciones?\n\n$$\\frac{3}{4} + \\frac{2}{3}$$",
    alternativas: [
      { letra: 'A', texto: "5/7", es_correcta: false },
      { letra: 'B', texto: "5/12", es_correcta: false },
      { letra: 'C', texto: "6/12", es_correcta: false },
      { letra: 'D', texto: "17/12", es_correcta: true }
    ],
    respuestaCorrecta: 'D',
    puntaje: 2,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-13',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-1',
    habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'media',
    enunciado: "¿Cuál es el resultado de la expresión?\n\n$$52 - 12 : 4 + 6 \\cdot 3$$",
    alternativas: [
      { letra: 'A', texto: "12", es_correcta: false },
      { letra: 'B', texto: "31", es_correcta: false },
      { letra: 'C', texto: "48", es_correcta: false },
      { letra: 'D', texto: "67", es_correcta: true }
    ],
    respuestaCorrecta: 'D',
    puntaje: 2,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-14',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-1',
    habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'baja',
    enunciado: "¿Cuál es el resultado de la multiplicación?\n\n$$0,6 \\cdot 100$$",
    alternativas: [
      { letra: 'A', texto: "0,06", es_correcta: false },
      { letra: 'B', texto: "0,600", es_correcta: false },
      { letra: 'C', texto: "60", es_correcta: true },
      { letra: 'D', texto: "600", es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 1,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-15',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-1',
    habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'media',
    enunciado: "Fernanda necesita comprar algunos materiales para el colegio. Si compra un pack de cartulinas por **$1 200**, dos lápices de **$450** cada uno y una tijera de **$600**, ¿cuál de las siguientes expresiones representa el vuelto o cambio que recibe al pagar con un billete de **$5 000**?",
    alternativas: [
      { letra: 'A', texto: "5 000 − 1 200 + 450 + 600", es_correcta: false },
      { letra: 'B', texto: "5 000 − (1 200 + 450 + 600)", es_correcta: false },
      { letra: 'C', texto: "5 000 − 1 200 + 450 · 2 + 600", es_correcta: false },
      { letra: 'D', texto: "5 000 − (1 200 + 450 · 2 + 600)", es_correcta: true }
    ],
    respuestaCorrecta: 'D',
    puntaje: 2,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-16',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-1',
    habilidadId: 'hab-mat-2',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'baja',
    enunciado: "¿Cuál de los siguientes números es **compuesto**?",
    alternativas: [
      { letra: 'A', texto: "7", es_correcta: false },
      { letra: 'B', texto: "11", es_correcta: false },
      { letra: 'C', texto: "21", es_correcta: true },
      { letra: 'D', texto: "23", es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 1,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-17',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-2',
    habilidadId: 'hab-mat-4',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'media',
    imagenUrl: '/preguntas/simce_mat_6b_e3/p17_secuencia_figuras.png',
    enunciado: "La siguiente secuencia de figuras fue construida siguiendo una regla de formación:\n\n¿Cuántos círculos habrá en la **figura 5**?",
    alternativas: [
      { letra: 'A', texto: "8 círculos", es_correcta: false },
      { letra: 'B', texto: "10 círculos", es_correcta: true },
      { letra: 'C', texto: "16 círculos", es_correcta: false },
      { letra: 'D', texto: "30 círculos", es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 2,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-18',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-2',
    habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'media',
    imagenUrl: '/preguntas/simce_mat_6b_e3/p18_balanza_equilibrio.png',
    enunciado: "Observa la siguiente balanza en equilibrio:\n\n¿Cuál es el valor de $x$ en el platillo?",
    alternativas: [
      { letra: 'A', texto: "6", es_correcta: false },
      { letra: 'B', texto: "10", es_correcta: false },
      { letra: 'C', texto: "11", es_correcta: true },
      { letra: 'D', texto: "16", es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 2,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-19',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-2',
    habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'media',
    enunciado: "Si el doble de un número es **34**, ¿cuál es el consecutivo de ese número?",
    alternativas: [
      { letra: 'A', texto: "18", es_correcta: true },
      { letra: 'B', texto: "35", es_correcta: false },
      { letra: 'C', texto: "68", es_correcta: false },
      { letra: 'D', texto: "69", es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 2,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-20',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-2',
    habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'media',
    enunciado: "Considera la ecuación:\n\n$$x + 4 = 10$$\n\n¿Cuál es el resultado de la expresión $x + 2$?",
    alternativas: [
      { letra: 'A', texto: "6", es_correcta: false },
      { letra: 'B', texto: "8", es_correcta: true },
      { letra: 'C', texto: "14", es_correcta: false },
      { letra: 'D', texto: "16", es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 2,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-21',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-2',
    habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'media',
    enunciado: "Dada la ecuación algebraica:\n\n$$3x + 6 = 21$$\n\n¿Cuál es el valor de $x$?",
    alternativas: [
      { letra: 'A', texto: "5", es_correcta: true },
      { letra: 'B', texto: "9", es_correcta: false },
      { letra: 'C', texto: "45", es_correcta: false },
      { letra: 'D', texto: "81", es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 2,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-22',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-2',
    habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'media',
    enunciado: "En un terreno rectangular, la diferencia entre el doble del largo y la medida del ancho es exactamente **15 metros**. Si el ancho mide **5 metros**, ¿cuántos metros de largo tiene el terreno?",
    alternativas: [
      { letra: 'A', texto: "5", es_correcta: false },
      { letra: 'B', texto: "10", es_correcta: true },
      { letra: 'C', texto: "20", es_correcta: false },
      { letra: 'D', texto: "40", es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 2,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-23',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-2',
    habilidadId: 'hab-mat-4',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'media',
    enunciado: "Una tienda de libros obtiene una ganancia de **$3 500** por cada libro vendido. Si $y$ representa la cantidad de libros vendidos, ¿cuál de las siguientes expresiones representa la condición de que la ganancia sea, al menos, de **$70 000**?",
    alternativas: [
      { letra: 'A', texto: "3 500 ≥ 70 000y", es_correcta: false },
      { letra: 'B', texto: "3 500y ≥ 70 000", es_correcta: true },
      { letra: 'C', texto: "3 500 + y ≥ 70 000", es_correcta: false },
      { letra: 'D', texto: "70 000 + y ≥ 3 500", es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 2,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-24',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-3',
    habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'media',
    imagenUrl: '/preguntas/simce_mat_6b_e3/p24_triangulo_cuadricula.png',
    enunciado: "Observa el triángulo dibujado en la cuadrícula formada por cuadrados de $1\\text{ cm}^2$:\n\n¿Cuál es el área del triángulo?",
    alternativas: [
      { letra: 'A', texto: "11 cm²", es_correcta: false },
      { letra: 'B', texto: "12 cm²", es_correcta: true },
      { letra: 'C', texto: "13 cm²", es_correcta: false },
      { letra: 'D', texto: "16 cm²", es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 2,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-25',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-3',
    habilidadId: 'hab-mat-2',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'baja',
    imagenUrl: '/preguntas/simce_mat_6b_e3/p25_plano_cartesiano.png',
    enunciado: "Observa el rectángulo ABCD en el siguiente plano cartesiano:\n\n¿En qué coordenadas se encuentra ubicado el **vértice C**?",
    alternativas: [
      { letra: 'A', texto: "(2, 3)", es_correcta: false },
      { letra: 'B', texto: "(3, 2)", es_correcta: false },
      { letra: 'C', texto: "(3, 6)", es_correcta: false },
      { letra: 'D', texto: "(6, 3)", es_correcta: true }
    ],
    respuestaCorrecta: 'D',
    puntaje: 1,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-26',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-3',
    habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'media',
    enunciado: "¿En qué cubo las caras sombreadas de color gris son **paralelas**?\n\n| Opción A | Opción B |\n| :---: | :---: |\n| ![Cubo A](/preguntas/simce_mat_6b_e3/p26_cubo_a.png) | ![Cubo B](/preguntas/simce_mat_6b_e3/p26_cubo_b.png) |\n| **Opción C** | **Opción D** |\n| ![Cubo C](/preguntas/simce_mat_6b_e3/p26_cubo_c.png) | ![Cubo D](/preguntas/simce_mat_6b_e3/p26_cubo_d.png) |",
    alternativas: [
      { letra: 'A', texto: "Cubo A", es_correcta: false },
      { letra: 'B', texto: "Cubo B", es_correcta: true },
      { letra: 'C', texto: "Cubo C", es_correcta: false },
      { letra: 'D', texto: "Cubo D", es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 2,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-27',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-3',
    habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'baja',
    enunciado: "¿En cuál de las siguientes cuadrículas hay un **triángulo rectángulo**?\n\n| Opción A | Opción B |\n| :---: | :---: |\n| ![Grid A](/preguntas/simce_mat_6b_e3/p27_grid_a.png) | ![Grid B](/preguntas/simce_mat_6b_e3/p27_grid_b.png) |\n| **Opción C** | **Opción D** |\n| ![Grid C](/preguntas/simce_mat_6b_e3/p27_grid_c.png) | ![Grid D](/preguntas/simce_mat_6b_e3/p27_grid_d.png) |",
    alternativas: [
      { letra: 'A', texto: "Cuadrícula A", es_correcta: true },
      { letra: 'B', texto: "Cuadrícula B", es_correcta: false },
      { letra: 'C', texto: "Cuadrícula C", es_correcta: false },
      { letra: 'D', texto: "Cuadrícula D", es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-28',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-3',
    habilidadId: 'hab-mat-2',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'media',
    enunciado: "¿En cuál de las siguientes imágenes la **Figura 1** es **congruente** con la **Figura 2**?\n\n| Opción A | Opción B |\n| :---: | :---: |\n| ![Congruencia A](/preguntas/simce_mat_6b_e3/p28_cong_a.png) | ![Congruencia B](/preguntas/simce_mat_6b_e3/p28_cong_b.png) |\n| **Opción C** | **Opción D** |\n| ![Congruencia C](/preguntas/simce_mat_6b_e3/p28_cong_c.png) | ![Congruencia D](/preguntas/simce_mat_6b_e3/p28_cong_d.png) |",
    alternativas: [
      { letra: 'A', texto: "Imagen A", es_correcta: false },
      { letra: 'B', texto: "Imagen B", es_correcta: true },
      { letra: 'C', texto: "Imagen C", es_correcta: false },
      { letra: 'D', texto: "Imagen D", es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 2,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-29',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-3',
    habilidadId: 'hab-mat-3',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'alta',
    enunciado: "¿Cuál de las siguientes afirmaciones sobre la congruencia de triángulos es **siempre verdadera**?",
    alternativas: [
      { letra: 'A', texto: "Dos triángulos son congruentes si tienen la misma área.", es_correcta: false },
      { letra: 'B', texto: "Dos triángulos son congruentes si tienen dos ángulos iguales.", es_correcta: false },
      { letra: 'C', texto: "Dos triángulos equiláteros son congruentes si tienen el mismo perímetro.", es_correcta: true },
      { letra: 'D', texto: "Dos triángulos son congruentes si sus tres ángulos interiores son respectivamente iguales.", es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 3,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-30',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-4',
    habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'baja',
    enunciado: "Un atleta trota diariamente **3,5 km**. ¿Cuántos metros trota diariamente?",
    alternativas: [
      { letra: 'A', texto: "35 m", es_correcta: false },
      { letra: 'B', texto: "350 m", es_correcta: false },
      { letra: 'C', texto: "3 500 m", es_correcta: true },
      { letra: 'D', texto: "35 000 m", es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 1,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-31',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-4',
    habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'media',
    imagenUrl: '/preguntas/simce_mat_6b_e3/p31_area_rectangulo.png',
    enunciado: "El siguiente polígono es un rectángulo:\n\n¿Cuánto mide el área de la parte sombreada?",
    alternativas: [
      { letra: 'A', texto: "21 cm²", es_correcta: false },
      { letra: 'B', texto: "42 cm²", es_correcta: false },
      { letra: 'C', texto: "54 cm²", es_correcta: true },
      { letra: 'D', texto: "108 cm²", es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 2,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-32',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-5',
    habilidadId: 'hab-mat-1',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'media',
    enunciado: "Juan lanzó una moneda al aire 100 veces y obtuvo los siguientes resultados:\n\n- **45 veces** salió cara.\n- **55 veces** salió sello.\n\nSi Juan repite el experimento y lanza la moneda otras 100 veces, ¿cuál es la tendencia más probable para los resultados?",
    alternativas: [
      { letra: 'A', texto: "Saldrán más veces cara que sello.", es_correcta: false },
      { letra: 'B', texto: "Saldrán más veces sello que cara.", es_correcta: false },
      { letra: 'C', texto: "Saldrán exactamente 50 veces cara y 50 veces sello.", es_correcta: false },
      { letra: 'D', texto: "Saldrán aproximadamente 50 veces cara y 50 veces sello.", es_correcta: true }
    ],
    respuestaCorrecta: 'D',
    puntaje: 2,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-33',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-5',
    habilidadId: 'hab-mat-2',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'baja',
    imagenUrl: '/preguntas/simce_mat_6b_e3/p33_tallo_hojas.jpeg',
    enunciado: "El siguiente diagrama de tallo y hojas muestra la cantidad de páginas leídas de un libro por un grupo de personas durante una semana:\n\n¿Qué cantidad de páginas fue la máxima leída?",
    alternativas: [
      { letra: 'A', texto: "14", es_correcta: false },
      { letra: 'B', texto: "55", es_correcta: false },
      { letra: 'C', texto: "65", es_correcta: true },
      { letra: 'D', texto: "525", es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 1,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-34',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-5',
    habilidadId: 'hab-mat-3',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'alta',
    enunciado: "El promedio de las **4 calificaciones** de Diego en Matemática es exactamente **5,8**. Con esta información, ¿cuál de las siguientes afirmaciones es **siempre verdadera**?",
    alternativas: [
      { letra: 'A', texto: "Diego obtuvo al menos una calificación igual a 5,8.", es_correcta: false },
      { letra: 'B', texto: "La calificación más alta de Diego es mayor que 5,8.", es_correcta: false },
      { letra: 'C', texto: "La suma de las 4 calificaciones de Diego es igual a 23,2.", es_correcta: true },
      { letra: 'D', texto: "El valor 5,8 se encuentra en el centro de las notas ordenadas de menor a mayor.", es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 3,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
  {
    id: 'preg-mat6b-e3-35',
    asignaturaId: 'asig-1',
    ejeTematicoId: 'eje-mat-5',
    habilidadId: 'hab-mat-2',
    tipo: 'seleccion_multiple',
    nivel: '6° Básico',
    dificultad: 'baja',
    imagenUrl: '/preguntas/simce_mat_6b_e3/p35_ruleta.png',
    enunciado: "Observa la siguiente ruleta:\n\nSi se hace girar la flecha, ¿dónde es más probable que esta se detenga?",
    alternativas: [
      { letra: 'A', texto: "H", es_correcta: false },
      { letra: 'B', texto: "M", es_correcta: true },
      { letra: 'C', texto: "R", es_correcta: false },
      { letra: 'D', texto: "T", es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo 3 SIMCE Matemática 6° Básico'
  },
];

export const pruebaMatematica6BMock: Prueba = {
  id: 'prueba-simce-mat-6b-03',
  titulo: 'Ensayo 3 SIMCE Matemática 6° Básico',
  descripcion: 'Evaluación oficial de Matemática para 6° Básico con 35 ítems de cobertura curricular completa (Números y Operaciones, Patrones y Álgebra, Geometría, Medición y Datos y Probabilidades).',
  asignaturaId: 'asig-1',
  asignaturaNombre: 'Matemática',
  nivel: '6° Básico',
  profesorId: 'prof-demo-mat',
  cursoId: 'curso-6a',
  cursoNombre: '6° Básico A',
  codigoPublico: 'SIMCE-6B-MAT3',
  duracionMinutos: 90,
  creadoEn: '2026-08-25',
  preguntasIds: ['preg-mat6b-e3-01', 'preg-mat6b-e3-02', 'preg-mat6b-e3-03', 'preg-mat6b-e3-04', 'preg-mat6b-e3-05', 'preg-mat6b-e3-06', 'preg-mat6b-e3-07', 'preg-mat6b-e3-08', 'preg-mat6b-e3-09', 'preg-mat6b-e3-10', 'preg-mat6b-e3-11', 'preg-mat6b-e3-12', 'preg-mat6b-e3-13', 'preg-mat6b-e3-14', 'preg-mat6b-e3-15', 'preg-mat6b-e3-16', 'preg-mat6b-e3-17', 'preg-mat6b-e3-18', 'preg-mat6b-e3-19', 'preg-mat6b-e3-20', 'preg-mat6b-e3-21', 'preg-mat6b-e3-22', 'preg-mat6b-e3-23', 'preg-mat6b-e3-24', 'preg-mat6b-e3-25', 'preg-mat6b-e3-26', 'preg-mat6b-e3-27', 'preg-mat6b-e3-28', 'preg-mat6b-e3-29', 'preg-mat6b-e3-30', 'preg-mat6b-e3-31', 'preg-mat6b-e3-32', 'preg-mat6b-e3-33', 'preg-mat6b-e3-34', 'preg-mat6b-e3-35'],
  totalPreguntas: 35,
  estado: 'activa'
};
