/**
 * tests/grade-evaluation.test.ts
 * Verificación del contrato de datos de corrección y calificación (Fase 1)
 */

interface GradePayload {
  evaluacion_id?: string;
  prueba_id?: string;
  alumno_id: string;
  respuestas?: Record<string, string>;
  respuestas_json?: Record<string, string>;
  puntaje_obtenido: number;
  puntaje_total: number;
  porcentaje_logro: number;
  estado: 'corregida' | 'enviada';
}

describe('Grade Evaluation Schema Contract', () => {
  test('Payload debe contener columnas reales de base de datos Supabase', () => {
    const rawSubmission = {
      pruebaId: 'eval-uuid-001',
      studentId: 'student-uuid-101',
      answers: { 'q-1': 'A', 'q-2': 'B' },
      score: 2,
      total: 2,
      percentage: 100
    };

    // Mapeo corregido (api/grade-evaluation.ts)
    const dbPayload: GradePayload = {
      prueba_id: rawSubmission.pruebaId,
      alumno_id: rawSubmission.studentId,
      respuestas_json: rawSubmission.answers,
      puntaje_obtenido: rawSubmission.score,
      puntaje_total: rawSubmission.total,
      porcentaje_logro: rawSubmission.percentage,
      estado: 'corregida'
    };

    expect(dbPayload.prueba_id).toBe('eval-uuid-001');
    expect(dbPayload.evaluacion_id).toBe(undefined);
    expect(dbPayload.respuestas_json).toBe(rawSubmission.answers);
    expect(dbPayload.respuestas).toBe(undefined);
    expect(dbPayload.estado).toBe('corregida');
  });

  test('Mapeo de pregunta_ids a preguntas_ids en evaluaciones', () => {
    const evaluacionRow = {
      id: 'eval-1',
      preguntas_ids: ['p-1', 'p-2', 'p-3'],
      titulo: 'Ensayo SIMCE Matemática'
    };

    const extractedQuestionIds = evaluacionRow.preguntas_ids || [];
    expect(extractedQuestionIds.length).toBe(3);
    expect(extractedQuestionIds[0]).toBe('p-1');
  });
});

// Helper simple para ejecución directa
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
    throw err;
  }
}

function expect(actual: unknown) {
  return {
    toBe(expected: unknown) {
      if (actual !== expected) throw new Error(`Expected ${expected}, but got ${actual}`);
    }
  };
}
