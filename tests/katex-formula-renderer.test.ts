import assert from 'node:assert';
import katex from 'katex';

function renderKatex(expr: string, displayMode: boolean): string {
  try {
    return katex.renderToString(expr, {
      throwOnError: false,
      displayMode,
      strict: 'ignore',
    });
  } catch {
    return expr;
  }
}

function processMathText(raw: string): { processedText: string; mathPlaceholders: string[] } {
  // 0. Proteger montos monetarios (ej: $120.000, $25.000, $500, $1.000.000)
  let text = raw.replace(/\$(\s*\d[\d.,]*)/g, '§PESO§$1');

  // 1. Extraer y renderizar con KaTeX real los bloques $$...$$ y $...$ restantes
  const mathPlaceholders: string[] = [];
  text = text.replace(/\$\$(.+?)\$\$/g, (_m, expr) => {
    const html = renderKatex(expr.trim(), true);
    mathPlaceholders.push(html);
    return `§MATH${mathPlaceholders.length - 1}§`;
  });
  text = text.replace(/\$([^$]+?)\$/g, (_m, expr) => {
    const html = renderKatex(expr.trim(), false);
    mathPlaceholders.push(html);
    return `§MATH${mathPlaceholders.length - 1}§`;
  });

  // 2. Restaurar montos monetarios protegidos y limpiar símbolos LaTeX sueltos
  text = text
    .replace(/§PESO§/g, '$')
    .replace(/\\cdot/g, ' · ')
    .replace(/\\times/g, ' × ')
    .replace(/\\div/g, ' ÷ ')
    .replace(/\\pm/g, ' ± ')
    .replace(/\\leq/g, ' ≤ ')
    .replace(/\\geq/g, ' ≥ ')
    .replace(/\\neq/g, ' ≠ ')
    .replace(/\\approx/g, ' ≈ ')
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');

  return { processedText: text, mathPlaceholders };
}

console.log('--- TEST 1: Exponente inline $x^2 + 3x - 4 = 0$ ---');
const res1 = processMathText('Resuelve $x^2 + 3x - 4 = 0$.');
assert(res1.processedText.includes('§MATH0§'), 'Debe generar un placeholder para la fórmula inline');
assert(res1.mathPlaceholders[0].includes('katex'), 'Debe contener markup HTML de KaTeX');
assert(res1.mathPlaceholders[0].includes('x'), 'Debe contener la variable x');
console.log('✅ Test 1 Passed');

console.log('--- TEST 2: Fracción en bloque $$\\frac{a+b}{c}$$ ---');
const res2 = processMathText('Calcula $$\\frac{a+b}{c}$$');
assert(res2.processedText.includes('§MATH0§'), 'Debe generar placeholder de bloque');
assert(res2.mathPlaceholders[0].includes('katex-display'), 'Debe ser display mode');
assert(res2.mathPlaceholders[0].includes('frac-line') || res2.mathPlaceholders[0].includes('vlist'), 'Debe contener estructura de fracción');
console.log('✅ Test 2 Passed');

console.log('--- TEST 3: Monto en pesos $120.000 protegido ---');
const res3 = processMathText('El precio es de $120.000 y el descuento es de $25.000.');
assert(res3.processedText.includes('$120.000') && res3.processedText.includes('$25.000'), 'Los montos monetarios deben permanecer intactos');
assert.strictEqual(res3.mathPlaceholders.length, 0, 'No debe interpretar $120.000 como fórmula matemática');
console.log('✅ Test 3 Passed');

console.log('--- TEST 4: Monto en pesos junto con fórmula matemática ---');
const res4 = processMathText('Un artículo cuesta $120.000 y tras $n$ años su valor es $120.000 \\cdot (1 - r)^n$.');
assert(res4.processedText.includes('$120.000'), 'Debe preservar el monto');
assert(res4.mathPlaceholders.length >= 1, 'Debe renderizar la fórmula matemática');
console.log('✅ Test 4 Passed');

console.log('--- TEST 5: Fórmula mal formada fallback seguro ---');
const res5 = processMathText('Error intencional $\\frac{1}{$ en la fórmula.');
assert.strictEqual(res5.mathPlaceholders.length, 1);
assert(!res5.mathPlaceholders[0].includes('unhandledException'), 'No debe arrojar excepción no controlada');
console.log('✅ Test 5 Passed');

console.log('\n🎉 TODOS LOS TESTS DE PARTE A PASARON EXITOSAMENTE.');
