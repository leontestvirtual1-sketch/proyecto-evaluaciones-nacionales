import test from 'node:test';
import assert from 'node:assert/strict';

// Test the math normalization rules directly
function cleanSymbolFont(text: string): string {
  if (!text) return text;
  return text
    // Paréntesis, corchetes y llaves (incluyendo variantes apiladas de Symbol font)
    .replace(/[\uF028\uF0E6\uF0E7\uF0E8]/g, '(')
    .replace(/[\uF029\uF0F6\uF0F7\uF0F8]/g, ')')
    .replace(/[\uF05B\uF0E9\uF0EA\uF0EB]/g, '[')
    .replace(/[\uF05D\uF0F9\uF0FA\uF0FB]/g, ']')
    .replace(/\uF07B/g, '{')
    .replace(/\uF07D/g, '}')
    // Operadores básicos y multiplicaciones
    .replace(/\uF02B/g, '+')
    .replace(/[\uF02D\u2013\u2014]/g, '-')
    .replace(/[\uF0B7\uF0D7]/g, '·')
    .replace(/\uF0B8/g, '÷')
    .replace(/\uF03D/g, '=')
    .replace(/\uF0B9/g, '≠')
    .replace(/\uF0BB/g, '≈')
    .replace(/\uF03C/g, '<')
    .replace(/\uF03E/g, '>')
    .replace(/\uF0A3/g, '≤')
    .replace(/\uF0B3/g, '≥')
    // Símbolos matemáticos y conjuntos
    .replace(/\uF070/g, 'π')
    .replace(/\uF0B0/g, '°')
    .replace(/\uF0A5/g, '∞')
    .replace(/\uF0C7/g, '∩')
    .replace(/\uF0C8/g, '∪')
    .replace(/\uF0CE/g, '∈')
    .replace(/\uF07E/g, '~')
    .replace(/\uF05E/g, '^')
    // Letras griegas matemáticas
    .replace(/\uF061/g, 'α')
    .replace(/\uF062/g, 'β')
    .replace(/\uF071/g, 'θ')
    .replace(/\uF072/g, 'ρ')
    .replace(/\uF073/g, 'σ')
    .replace(/\uF044/g, 'Δ')
    // Íconos auxiliares de folletos DEMRE
    .replace(/\uF0FC/g, '✓')
    .replace(/\uF0E3/g, '©')
    .replace(/\uF138/g, '►');
}

function normalizeMathText(raw: string): string {
  let text = cleanSymbolFont(raw);
  // Decimales partidos: ,0 75 → 0,75
  text = text.replace(/,\s*([0-9])\s+([0-9]{2,})\b/g, '$1,$2');
  // Coordenadas rotas: (,x y) → (x, y) — genérico primero, cubre todos los casos
  text = text.replace(/\(\s*,\s*([a-zA-Z0-9_-]+)\s+([a-zA-Z0-9_-]+)\s*\)/g, '($1, $2)');
  // Palabras clave sin espacio antes del paréntesis ya corregido: puntos(x, y) → puntos (x, y)
  text = text.replace(/\b(punto|puntos|vector|vectores)\s*\(([^)]+)\)/gi, '$1 ($2)');
  return text;
}

test('--- Suite de Normalización de Contenido Matemático PAES (Fase Piloto M1 & M2) ---', async (t) => {
  await t.test('Normaliza correctamente caracteres PUA de Symbol Font a símbolos legibles', () => {
    // Caso de operaciones básicas y multiplicaciones
    const input = '3\uF0D7p \uF02B 5\uF03D8 \uF02D 2';
    assert.strictEqual(cleanSymbolFont(input), '3·p + 5=8 - 2');

    // Desigualdades y conjuntos
    const ineq = 'x \uF0A3 10 \uF0C7 y \uF0B3 0, \uF070 \uF0CE \uF0A5';
    assert.strictEqual(cleanSymbolFont(ineq), 'x ≤ 10 ∩ y ≥ 0, π ∈ ∞');

    // Letras griegas
    const greek = '\uF061 \uF02B \uF062 \uF03D 90\uF0B0';
    assert.strictEqual(cleanSymbolFont(greek), 'α + β = 90°');
  });

  await t.test('Resuelve decimales partidos verticalmente por la extracción (,0 75 -> 0,75 y ,1 25 -> 1,25)', () => {
    // Caso M1 2023 Pregunta 2
    const rawFormula = 'p  ,1 25  ,1 25  ,0 75  ,0 75';
    const cleaned = normalizeMathText(rawFormula);
    assert.ok(cleaned.includes('1,25'));
    assert.ok(cleaned.includes('0,75'));
    assert.ok(!cleaned.includes(',0 75'));
    assert.ok(!cleaned.includes(',1 25'));

    // En alternativas
    const altC = 'Que hubo dos aumentos de ,0 25 y luego, dos disminuciones de ,0 75.';
    assert.strictEqual(normalizeMathText(altC), 'Que hubo dos aumentos de 0,25 y luego, dos disminuciones de 0,75.');
  });

  await t.test('No altera comas de listas legítimas ni años separados por coma', () => {
    const list = 'Para los valores 1, 2, 3 y 4 de la variable';
    assert.strictEqual(normalizeMathText(list), list);

    const years = 'durante los años 2018, 2019 y 2020';
    assert.strictEqual(normalizeMathText(years), years);
  });

  await t.test('Reconstruye coordenadas rotas e invertidas de plano cartesiano', () => {
    // Caso M2 2023 Pregunta 41
    const p41 = '¿Para qué puntos(,x y) en el plano cartesiano se cumple?';
    assert.ok(normalizeMathText(p41).includes('puntos (x, y)'));

    // Caso M2 2023 Pregunta 38 (origen del plano)
    const p38 = 'el punto(,0 0) es el centro de homotecia';
    assert.ok(normalizeMathText(p38).includes('el punto (0, 0)'));

    // Alternativas con coordenadas (forma genérica — el espacio sólo se agrega con palabras clave)
    const altCoords = 'Para los puntos de la forma(,x 0).';
    // step1: (,x 0) → (x, 0); step2: 'forma' no es palabra clave, no agrega espacio
    assert.ok(normalizeMathText(altCoords).includes('(x, 0)'));
    // Pero sí con palabra clave explícita
    const altPuntos = 'Para los puntos(,x 0).';
    assert.strictEqual(normalizeMathText(altPuntos), 'Para los puntos (x, 0).');
  });
});
