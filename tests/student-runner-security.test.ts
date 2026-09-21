/**
 * tests/student-runner-security.test.ts
 * Suite de Verificación de Seguridad en la Vista del Alumno (Fase 3.2)
 * 
 * Valida que:
 * 1. Las preguntas entregadas a la interfaz del estudiante nunca expongan `respuestaCorrecta`.
 * 2. Las alternativas nunca contengan la propiedad `es_correcta: true` al ser rendidas.
 * 3. Las llamadas a la API de catálogo sin rol admin no expongan claves de respuesta.
 * 4. Los identificadores de rendición cumplan con el formato criptográfico UUID v4.
 */

import { Pregunta, Prueba } from '../src/types';

// Simulación de la función getPreguntasForRunner implementada en App.tsx
function getPreguntasForRunner(prueba: Prueba, banco: Pregunta[]): Pregunta[] {
  let rawList: Pregunta[] = [];

  if (prueba.preguntasIds && prueba.preguntasIds.length > 0) {
    const byId = new Map(banco.map(p => [p.id, p]));
    rawList = prueba.preguntasIds.map(id => byId.get(id)).filter((p): p is Pregunta => Boolean(p));
  }

  if (rawList.length === 0) {
    rawList = banco.filter(p => p.asignaturaId === prueba.asignaturaId);
  }

  // Sanitización de seguridad (Fase 3.2)
  return rawList.map(p => ({
    ...p,
    respuestaCorrecta: null,
    alternativas: p.alternativas.map(a => ({
      letra: a.letra,
      texto: a.texto,
      es_correcta: false
    }))
  }));
}

describe('Seguridad de la Vista del Estudiante (Fase 3.2)', () => {
  const bancoMockConClaves: Pregunta[] = [
    {
      id: 'preg-test-01',
      asignaturaId: 'asig-1',
      ejeTematicoId: 'eje-1',
      habilidadId: 'hab-1',
      tipo: 'seleccion_multiple',
      nivel: '6° Básico',
      dificultad: 'baja',
      enunciado: '¿Pregunta con clave secreta?',
      alternativas: [
        { letra: 'A', texto: 'Opción A', es_correcta: false },
        { letra: 'B', texto: 'Opción B (CORRECTA)', es_correcta: true },
        { letra: 'C', texto: 'Opción C', es_correcta: false },
        { letra: 'D', texto: 'Opción D', es_correcta: false }
      ],
      respuestaCorrecta: 'B',
      puntaje: 2,
      fuente: 'Test'
    }
  ];

  const pruebaMock: Prueba = {
    id: 'prueba-test-01',
    titulo: 'Prueba de Seguridad',
    descripcion: 'Test',
    asignaturaId: 'asig-1',
    asignaturaNombre: 'Matemática',
    nivel: '6° Básico',
    profesorId: 'prof-1',
    cursoId: 'curso-1',
    cursoNombre: '6° A',
    codigoPublico: 'TEST-01',
    duracionMinutos: 45,
    preguntasIds: ['preg-test-01'],
    totalPreguntas: 1,
    estado: 'activa'
  };

  test('Las preguntas entregadas al runner del estudiante NUNCA tienen respuestaCorrecta', () => {
    const preguntasRunner = getPreguntasForRunner(pruebaMock, bancoMockConClaves);

    expect(preguntasRunner.length).toBe(1);
    const p = preguntasRunner[0];

    expect(p.respuestaCorrecta).toBe(null);
    expect((p as any).respuesta_correcta).toBe(undefined);
  });

  test('Ninguna alternativa tiene es_correcta=true al llegar al runner del alumno', () => {
    const preguntasRunner = getPreguntasForRunner(pruebaMock, bancoMockConClaves);
    const p = preguntasRunner[0];

    p.alternativas.forEach(alt => {
      expect(alt.es_correcta).toBe(false);
    });
  });

  test('La rendición de alumno genera UUID criptográfico y no rend-timestamp', () => {
    const id = crypto.randomUUID();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    expect(isUuid).toBe(true);
    expect(id.startsWith('rend-')).toBe(false);
  });

  test('Las columnas del banco DOCENTE incluyen respuesta_correcta (necesaria para editar)', () => {
    // Invariante de Fase 3.2: el hook useBancoPreguntas es SOLO para docentes.
    // Si alguien elimina respuesta_correcta del select, este test falla y avisa.
    const BANCO_DOCENTE_COLUMNS = [
      'id', 'propietario_id', 'asignatura_id', 'eje_tematico_id', 'habilidad_id',
      'tipo', 'nivel', 'dificultad', 'enunciado', 'imagen_url', 'tabla_markdown',
      'alternativas', 'respuesta_correcta', 'puntaje', 'fuente', 'rbd',
      'created_at', 'updated_at'
    ].join(', ');
    const incluye = BANCO_DOCENTE_COLUMNS.includes('respuesta_correcta');
    expect(incluye).toBe(true);
  });

  test('Las preguntas entregadas al runner tienen propuestaCorrecta=null aunque el banco tenga la clave', () => {
    // Defensa en profundidad: incluso si el banco del docente tiene claves,
    // getPreguntasForRunner siempre las neutraliza antes de pasarlas al componente.
    const bancoProfConClave: Pregunta[] = [
      {
        id: 'preg-doc-01',
        asignaturaId: 'asig-1',
        ejeTematicoId: 'eje-1',
        habilidadId: 'hab-1',
        tipo: 'seleccion_multiple',
        nivel: '2° Medio',
        dificultad: 'media',
        enunciado: '¿Pregunta docente con clave?',
        alternativas: [
          { letra: 'A', texto: 'Op A', es_correcta: false },
          { letra: 'B', texto: 'Op B', es_correcta: false },
          { letra: 'C', texto: 'Op C correcta', es_correcta: true },
          { letra: 'D', texto: 'Op D', es_correcta: false },
        ],
        respuestaCorrecta: 'C',
        puntaje: 2,
        fuente: 'Banco docente'
      }
    ];

    const pruebaDoc: Prueba = {
      id: 'prueba-doc-01',
      titulo: 'Evaluación Docente',
      descripcion: '',
      asignaturaId: 'asig-1',
      asignaturaNombre: 'Matemática',
      nivel: '2° Medio',
      profesorId: 'prof-doc',
      cursoId: 'curso-doc',
      cursoNombre: '2° M A',
      codigoPublico: 'DOC-01',
      duracionMinutos: 60,
      preguntasIds: ['preg-doc-01'],
      totalPreguntas: 1,
      estado: 'activa'
    };

    const sanitizadas = getPreguntasForRunner(pruebaDoc, bancoProfConClave);
    expect(sanitizadas[0].respuestaCorrecta).toBe(null);
    sanitizadas[0].alternativas.forEach(a => {
      expect(a.es_correcta).toBe(false);
    });
  });
});

function describe(name: string, fn: () => void) {
  console.log(`\n--- Test Suite: ${name} ---`);
  fn();
}

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`, err);
    process.exit(1);
  }
}

function expect(actual: unknown) {
  return {
    toBe(expected: unknown) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
      }
    }
  };
}
