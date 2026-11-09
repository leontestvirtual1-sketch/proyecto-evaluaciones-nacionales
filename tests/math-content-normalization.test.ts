import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanSymbolFont, normalizeText, sanitizeEnunciadoLine } from '../src/utils/mathContentNormalizer.ts';

test('--- Suite de Normalización de Contenido Matemático y Científico PAES (Módulo Compartido) ---', async (t) => {
  await t.test('Normaliza correctamente caracteres PUA de Symbol Font a símbolos legibles (M1, M2 y Ciencias)', () => {
    // Caso de operaciones básicas y multiplicaciones incluyendo U+F0B4
    const input = '3\uF0D7p \uF02B 5\uF03D8 \uF02D 2 \uF0B4 10';
    assert.strictEqual(cleanSymbolFont(input), '3·p + 5=8 - 2 · 10');

    // Desigualdades y conjuntos
    const ineq = 'x \uF0A3 10 \uF0C7 y \uF0B3 0, \uF070 \uF0CE \uF0A5';
    assert.strictEqual(cleanSymbolFont(ineq), 'x ≤ 10 ∩ y ≥ 0, π ∈ ∞');

    // Letras griegas
    const greek = '\uF061 \uF02B \uF062 \uF03D 90\uF0B0';
    assert.strictEqual(cleanSymbolFont(greek), 'α + β = 90°');

    // Símbolos científicos específicos (Física y Química)
    const science = 'λ=\uF06C, Δ=\uF044, R=30\uF057, F\uF0AE, A\uF0DFB, m=\uF0B15\uF06D, δ=\uF064';
    assert.strictEqual(cleanSymbolFont(science), 'λ=λ, Δ=Δ, R=30Ω, F→, A↔B, m=±5μ, δ=δ');

    // Símbolos de viñetas y marcas en folletos DEMRE
    const markers = '\uF0D8 Caso A, plumavit\uF0E2';
    assert.strictEqual(cleanSymbolFont(markers), '► Caso A, plumavit®');
  });

  await t.test('Resuelve decimales partidos horizontalmente (,0 75 -> 0,75 y ,1 25 -> 1,25)', () => {
    // Caso M1 2023 Pregunta 2
    const rawFormula = 'p  ,1 25  ,1 25  ,0 75  ,0 75';
    const cleaned = normalizeText(rawFormula);
    assert.ok(cleaned.includes('1,25'));
    assert.ok(cleaned.includes('0,75'));
    assert.ok(!cleaned.includes(',0 75'));
    assert.ok(!cleaned.includes(',1 25'));

    // En alternativas
    const altC = 'Que hubo dos aumentos de ,0 25 y luego, dos disminuciones de ,0 75.';
    assert.strictEqual(normalizeText(altC), 'Que hubo dos aumentos de 0,25 y luego, dos disminuciones de 0,75.');
  });

  await t.test('CRÍTICO: No fusiona ni altera filas adyacentes de tablas numéricas con saltos de línea', () => {
    // Caso Química 2024 Invierno P7 reportado en auditoría
    const tableData1 = '| 50,0 | 12,5 |\n| 130,0 | 36,0 |';
    assert.strictEqual(normalizeText(tableData1), '| 50,0 | 12,5 |\n| 130,0 | 36,0 |');

    // Si vienen como líneas sueltas con números
    const lines = '50,0\n12,5';
    const norm = normalizeText(lines);
    assert.ok(norm.includes('50,0'));
    assert.ok(norm.includes('12,5'));
    assert.ok(!norm.includes('500,12,5'));
  });

  await t.test('No altera comas de listas legítimas ni años separados por coma', () => {
    const list = 'Para los valores 1, 2, 3 y 4 de la variable';
    assert.strictEqual(normalizeText(list), list);

    const years = 'durante los años 2018, 2019 y 2020';
    assert.strictEqual(normalizeText(years), years);
  });

  await t.test('Reconstruye coordenadas rotas e invertidas de plano cartesiano', () => {
    // Caso M2 2023 Pregunta 41
    const p41 = '¿Para qué puntos(,x y) en el plano cartesiano se cumple?';
    assert.ok(normalizeText(p41).includes('puntos (x, y)'));

    // Caso M2 2023 Pregunta 38 (origen del plano)
    const p38 = 'el punto(,0 0) es el centro de homotecia';
    assert.ok(normalizeText(p38).includes('el punto (0, 0)'));

    // Alternativas con coordenadas
    const altCoords = 'Para los puntos de la forma(,x 0).';
    assert.ok(normalizeText(altCoords).includes('(x, 0)'));

    const altPuntos = 'Para los puntos(,x 0).';
    assert.strictEqual(normalizeText(altPuntos), 'Para los puntos (x, 0).');
  });

  await t.test('Une palabras cortadas por guion silábico sin espacio espurio', () => {
    const hyphenated = 'Durante la Confederación Perú-\nBoliviana en el siglo XIX';
    const res = normalizeText(hyphenated);
    assert.ok(res.includes('Perú-Boliviana'));
  });

  await t.test('Sanitiza números de enunciado iniciales preservando negrita y sin asteriscos huérfanos', () => {
    // Caso reporte usuario: enunciado envuelto en **N. pregunta?**
    const pMinsal = '**6. ¿Qué estrategia del MINSAL es reconocida como símbolo de vida sana y alimentación saludable?**';
    assert.strictEqual(
      sanitizeEnunciadoLine(pMinsal),
      '**¿Qué estrategia del MINSAL es reconocida como símbolo de vida sana y alimentación saludable?**'
    );

    const pCredibilidad = '**7. ¿Qué elemento de este texto otorga credibilidad a la información?**';
    assert.strictEqual(
      sanitizeEnunciadoLine(pCredibilidad),
      '**¿Qué elemento de este texto otorga credibilidad a la información?**'
    );

    // Formato estándar sin asteriscos
    assert.strictEqual(
      sanitizeEnunciadoLine('23. ¿Cuál es el valor de x en la ecuación?'),
      '¿Cuál es el valor de x en la ecuación?'
    );

    // Formato con sólo el número en negrita
    assert.strictEqual(
      sanitizeEnunciadoLine('**23.** ¿Cuál es el valor de x?'),
      '¿Cuál es el valor de x?'
    );

    // Limpieza de asterisco huérfano terminal en caso de split desbalanceado
    assert.strictEqual(
      sanitizeEnunciadoLine('¿Qué estrategia del MINSAL es reconocida?**'),
      '¿Qué estrategia del MINSAL es reconocida?'
    );

    // Negrita interna legítima no debe alterarse
    assert.strictEqual(
      sanitizeEnunciadoLine('14. ¿Cuál de las siguientes afirmaciones es **verdadera**?'),
      '¿Cuál de las siguientes afirmaciones es **verdadera**?'
    );
  });
});
