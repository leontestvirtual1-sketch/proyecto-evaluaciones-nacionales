/**
 * src/utils/scoringUtils.ts
 * Motor de Calificación Pedagógica Curricular — Sysget Saber
 *
 * Implementado bajo ciclo TDD (Red-Green-Refactor):
 * - calcularPuntajeSimce: Interpolación lineal 150-350 sobre tasa de aciertos
 * - calcularPuntajePaes: Interpolación lineal 100-1000 sobre tasa de aciertos
 * - determinarNivelLogroMineduc: Corte MINEDUC oficial (< 50% Insuficiente, 50–69% Elemental, ≥ 70% Adecuado)
 * - calcularLogroPorAgrupador: Desglose de aciertos y niveles por Eje o Habilidad MINEDUC
 */

export type RespuestaEstudiante = 'A' | 'B' | 'C' | 'D' | 'E' | 'BLANCO' | 'NULO';
export type NivelLogro = 'Insuficiente' | 'Elemental' | 'Adecuado';

export interface ItemEvaluacion {
  id: string;
  eje?: string;
  habilidad?: string;
  correcta: RespuestaEstudiante;
}

export interface ResultadoAgrupador {
  total: number;
  correctas: number;
  porcentaje: number;
  nivel: NivelLogro;
}

// ---------------------------------------------------------------------------
// Conversión a Puntaje SIMCE (escala 150 – 350)
// Interpolación lineal proporcional a la tasa de aciertos.
// Garantiza mínimo 150 aunque tasa sea 0 y nunca supera 350.
// ---------------------------------------------------------------------------
export function calcularPuntajeSimce(aciertos: number, totalPreguntas: number): number {
  if (totalPreguntas === 0) return 150;
  const tasa = Math.max(0, Math.min(1, aciertos / totalPreguntas));
  return Math.round(150 + tasa * (350 - 150));
}

// ---------------------------------------------------------------------------
// Conversión a Puntaje PAES (escala 100 – 1000)
// ---------------------------------------------------------------------------
export function calcularPuntajePaes(aciertos: number, totalPreguntas: number): number {
  if (totalPreguntas === 0) return 100;
  const tasa = Math.max(0, Math.min(1, aciertos / totalPreguntas));
  return Math.round(100 + tasa * (1000 - 100));
}

// ---------------------------------------------------------------------------
// Clasificación de Nivel de Logro MINEDUC
// Cortes estándar de la Agencia de Calidad de la Educación:
//   < 50%  → Insuficiente
//  50–69%  → Elemental
//   ≥ 70%  → Adecuado
// ---------------------------------------------------------------------------
export function determinarNivelLogroMineduc(porcentaje: number): NivelLogro {
  if (porcentaje >= 70) return 'Adecuado';
  if (porcentaje >= 50) return 'Elemental';
  return 'Insuficiente';
}

const RESPUESTAS_INVALIDAS: Set<RespuestaEstudiante> = new Set(['BLANCO', 'NULO']);

// ---------------------------------------------------------------------------
// Cálculo de logro por agrupador: 'eje' o 'habilidad'
// Devuelve un mapa { [nombreAgrupador]: ResultadoAgrupador }
// Respuestas BLANCO o NULO no cuentan como acierto.
// ---------------------------------------------------------------------------
export function calcularLogroPorAgrupador(
  preguntas: ItemEvaluacion[],
  respuestas: Record<string, RespuestaEstudiante>,
  agrupador: 'eje' | 'habilidad'
): Record<string, ResultadoAgrupador> {
  const acumulador: Record<string, { total: number; correctas: number }> = {};

  for (const pregunta of preguntas) {
    const clave = agrupador === 'eje' ? pregunta.eje : pregunta.habilidad;
    if (!clave) continue;

    if (!acumulador[clave]) acumulador[clave] = { total: 0, correctas: 0 };
    acumulador[clave].total++;

    const respuesta = respuestas[pregunta.id];
    const esCorrecta = respuesta && !RESPUESTAS_INVALIDAS.has(respuesta) && respuesta === pregunta.correcta;
    if (esCorrecta) acumulador[clave].correctas++;
  }

  const resultado: Record<string, ResultadoAgrupador> = {};
  for (const [clave, { total, correctas }] of Object.entries(acumulador)) {
    const porcentaje = total === 0 ? 0 : Math.round((correctas / total) * 100);
    resultado[clave] = {
      total,
      correctas,
      porcentaje,
      nivel: determinarNivelLogroMineduc(porcentaje)
    };
  }
  return resultado;
}
