/**
 * tests/pedagogical-scoring.test.ts
 * Suite de Pruebas Pedagógicas para Sysget Saber (TDD - Fase 2)
 * 
 * Verifica con casos de borde:
 * - Conversión de aciertos a puntaje estimado SIMCE (0 - 350)
 * - Conversión de aciertos a puntaje estimado PAES (100 - 1000)
 * - Cálculo de porcentaje de logro por Eje Curricular y Habilidad
 * - Asignación de Nivel de Logro MINEDUC (Insuficiente, Elemental, Adecuado)
 * - Manejo seguro de pruebas vacías (0 preguntas) y respuestas en blanco o nulas
 */

import {
  calcularPuntajeSimce,
  calcularPuntajePaes,
  calcularLogroPorAgrupador,
  determinarNivelLogroMineduc,
  ItemEvaluacion,
  RespuestaEstudiante
} from '../src/utils/scoringUtils';

describe('Suite Pedagógica de Calificación Curricular (TDD)', () => {

  // 1. TRANSFORMACIÓN A PUNTAJE ESTIMADO SIMCE
  test('calcularPuntajeSimce: 0 aciertos debe retornar puntaje mínimo base SIMCE (150)', () => {
    const puntaje = calcularPuntajeSimce(0, 35);
    expect(puntaje).toBe(150);
  });

  test('calcularPuntajeSimce: 100% de aciertos debe retornar puntaje máximo SIMCE (350)', () => {
    const puntaje = calcularPuntajeSimce(35, 35);
    expect(puntaje).toBe(350);
  });

  test('calcularPuntajeSimce: 0 preguntas totales retorna mínimo base (150) sin NaN', () => {
    const puntaje = calcularPuntajeSimce(0, 0);
    expect(puntaje).toBe(150);
  });

  // 2. TRANSFORMACIÓN A PUNTAJE ESTIMADO PAES
  test('calcularPuntajePaes: 0 aciertos debe retornar puntaje mínimo base PAES (100)', () => {
    const puntaje = calcularPuntajePaes(0, 65);
    expect(puntaje).toBe(100);
  });

  test('calcularPuntajePaes: 100% de aciertos debe retornar puntaje máximo PAES (1000)', () => {
    const puntaje = calcularPuntajePaes(65, 65);
    expect(puntaje).toBe(1000);
  });

  // 3. CLASIFICACIÓN DE NIVELES DE LOGRO MINEDUC
  test('determinarNivelLogroMineduc: < 50% es Insuficiente', () => {
    expect(determinarNivelLogroMineduc(0)).toBe('Insuficiente');
    expect(determinarNivelLogroMineduc(49)).toBe('Insuficiente');
  });

  test('determinarNivelLogroMineduc: 50% a 69% es Elemental', () => {
    expect(determinarNivelLogroMineduc(50)).toBe('Elemental');
    expect(determinarNivelLogroMineduc(69)).toBe('Elemental');
  });

  test('determinarNivelLogroMineduc: >= 70% es Adecuado', () => {
    expect(determinarNivelLogroMineduc(70)).toBe('Adecuado');
    expect(determinarNivelLogroMineduc(100)).toBe('Adecuado');
  });

  // 4. CÁLCULO DE LOGRO POR EJE CURRICULAR / HABILIDAD
  test('calcularLogroPorAgrupador: calcula correctamente porcentajes por Eje temático', () => {
    const preguntas: ItemEvaluacion[] = [
      { id: 'p1', eje: 'Números', correcta: 'A' },
      { id: 'p2', eje: 'Números', correcta: 'B' },
      { id: 'p3', eje: 'Geometría', correcta: 'C' },
      { id: 'p4', eje: 'Geometría', correcta: 'D' }
    ];

    const respuestas: Record<string, RespuestaEstudiante> = {
      p1: 'A', // Correcta
      p2: 'C', // Incorrecta
      p3: 'C', // Correcta
      p4: 'D'  // Correcta
    };

    const logros = calcularLogroPorAgrupador(preguntas, respuestas, 'eje');
    
    // Números: 1 de 2 = 50%
    expect(logros['Números'].total).toBe(2);
    expect(logros['Números'].correctas).toBe(1);
    expect(logros['Números'].porcentaje).toBe(50);
    expect(logros['Números'].nivel).toBe('Elemental');

    // Geometría: 2 de 2 = 100%
    expect(logros['Geometría'].total).toBe(2);
    expect(logros['Geometría'].correctas).toBe(2);
    expect(logros['Geometría'].porcentaje).toBe(100);
    expect(logros['Geometría'].nivel).toBe('Adecuado');
  });

  test('calcularLogroPorAgrupador: respuestas en blanco o nulas no suman como acierto', () => {
    const preguntas: ItemEvaluacion[] = [
      { id: 'p1', eje: 'Álgebra', correcta: 'A' },
      { id: 'p2', eje: 'Álgebra', correcta: 'B' }
    ];

    const respuestas: Record<string, RespuestaEstudiante> = {
      p1: 'BLANCO',
      p2: 'NULO'
    };

    const logros = calcularLogroPorAgrupador(preguntas, respuestas, 'eje');
    expect(logros['Álgebra'].correctas).toBe(0);
    expect(logros['Álgebra'].porcentaje).toBe(0);
    expect(logros['Álgebra'].nivel).toBe('Insuficiente');
  });

});

// Arnés de ejecución compatible sin dependencias externas
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
        throw new Error(`Esperado ${JSON.stringify(expected)}, pero se obtuvo ${JSON.stringify(actual)}`);
      }
    }
  };
}
