/**
 * tests/content-integrity.test.ts
 * Suite de verificación automatizada de integridad de contenido oficial (Fase 5.3)
 * Valida consistencia de manifiestos oficiales de claves y datasets sin requerir conexión a DB.
 */

import fs from 'fs';
import path from 'path';

describe('Suite de Integridad de Contenido Oficial (Fase 5.3)', () => {
  const clavesDir = path.resolve('scripts/data/claves_oficiales');

  test('Los manifiestos de claves oficiales existen y son válidos', () => {
    expect(fs.existsSync(clavesDir)).toBe(true);
    const files = fs.readdirSync(clavesDir).filter(f => f.endsWith('.json') && !f.includes('tabla'));
    expect(files.length >= 2).toBe(true);
  });

  test('SIMCE Mat 2M E3: Manifiesto oficial tiene 34 preguntas y claves no sesgadas', () => {
    const manifestPath = path.join(clavesDir, 'simce_mat_2m_e3.json');
    expect(fs.existsSync(manifestPath)).toBe(true);
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    expect(manifest.n_preguntas).toBe(34);
    expect(Object.keys(manifest.claves).length).toBe(34);

    const dist: Record<string, number> = {};
    for (const clave of Object.values(manifest.claves) as string[]) {
      dist[clave] = (dist[clave] || 0) + 1;
    }

    // Ninguna letra debe superar el 50% en una prueba de 34 preguntas
    for (const [letra, count] of Object.entries(dist)) {
      const pct = (count / 34) * 100;
      expect(pct < 50).toBe(true);
    }
  });

  test('PAES Lectora 2026 Forma 101: Manifiesto oficial tiene 65 preguntas y 5 pilotos', () => {
    const manifestPath = path.join(clavesDir, 'paes_lectora_2026_f101.json');
    expect(fs.existsSync(manifestPath)).toBe(true);
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    expect(manifest.n_preguntas).toBe(65);
    expect(manifest.preguntas_puntuables).toBe(60);
    expect(manifest.preguntas_piloto.length).toBe(5);
    expect(Object.keys(manifest.claves).length).toBe(65);
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
