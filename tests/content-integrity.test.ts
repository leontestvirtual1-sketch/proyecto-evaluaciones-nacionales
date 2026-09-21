/**
 * tests/content-integrity.test.ts
 * Suite de verificación automatizada de integridad de contenido oficial (Fase 5.3)
 * Valida consistencia de manifiestos oficiales de claves y datasets sin requerir conexión a DB.
 * Compatible con tsx (mismo runner que el resto del proyecto).
 */

import fs from 'fs';
import path from 'path';

const CLAVES_DIR = path.resolve('scripts/data/claves_oficiales');

// ── Mini test runner (compatible tsx, idéntico al patrón de otros tests) ─────

let totalPass = 0;
let totalFail = 0;
const failures: string[] = [];

function describe(suite: string, fn: () => void) {
  console.log(`\n  📋 ${suite}`);
  fn();
}

function it(name: string, fn: () => void) {
  try {
    fn();
    console.log(`    ✅ ${name}`);
    totalPass++;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`    ❌ ${name}\n       ${msg}`);
    totalFail++;
    failures.push(`${name}: ${msg}`);
  }
}

function expect(actual: unknown, label?: string) {
  return {
    toBe(expected: unknown) {
      if (actual !== expected) {
        throw new Error(
          `${label ?? ''} Esperado: ${JSON.stringify(expected)}, obtenido: ${JSON.stringify(actual)}`
        );
      }
    },
    toBeDefined() {
      if (actual === undefined || actual === null) {
        throw new Error(`${label ?? ''} Valor no definido: ${JSON.stringify(actual)}`);
      }
    },
    toBeGreaterThanOrEqual(n: number) {
      if ((actual as number) < n) {
        throw new Error(`${label ?? ''} ${actual} < ${n}`);
      }
    },
    toBeGreaterThan(n: number) {
      if ((actual as number) <= n) {
        throw new Error(`${label ?? ''} ${actual} <= ${n}`);
      }
    },
    toBeLessThan(n: number) {
      if ((actual as number) >= n) {
        throw new Error(`${label ?? ''} ${actual} >= ${n}`);
      }
    },
    toBeLessThanOrEqual(n: number) {
      if ((actual as number) > n) {
        throw new Error(`${label ?? ''} ${actual} > ${n}`);
      }
    },
    toHaveLength(n: number) {
      const arr = actual as unknown[];
      if (!Array.isArray(arr) || arr.length !== n) {
        throw new Error(`${label ?? ''} Longitud esperada ${n}, obtenida ${Array.isArray(arr) ? arr.length : '(no es array)'}`);
      }
    },
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadManifest(filename: string) {
  const manifestPath = path.join(CLAVES_DIR, filename);
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifiesto no encontrado: ${filename}`);
  }
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function checkKeyDistribution(
  claves: Record<string, string>,
  n: number,
  maxPct = 60
) {
  const dist: Record<string, number> = {};
  for (const clave of Object.values(claves)) {
    dist[clave] = (dist[clave] || 0) + 1;
  }
  for (const [letra, count] of Object.entries(dist)) {
    const pct = (count / n) * 100;
    if (pct >= maxPct) {
      throw new Error(
        `Sesgo crítico en clave '${letra}': ${pct.toFixed(1)}% (máximo ${maxPct}%)`
      );
    }
  }
  return dist;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

console.log('\n🛡️  Suite de Integridad de Contenido Oficial (Fase 5.3)');
console.log('='.repeat(60));

describe('Manifiestos de claves oficiales', () => {
  it('El directorio claves_oficiales existe', () => {
    expect(fs.existsSync(CLAVES_DIR)).toBe(true);
  });

  it('Hay al menos 3 manifiestos JSON versionados', () => {
    const files = fs.readdirSync(CLAVES_DIR)
      .filter(f => f.endsWith('.json') && !f.includes('tabla'));
    expect(files.length).toBeGreaterThanOrEqual(3);
  });
});

describe('SIMCE Matemática 2° Medio Ensayo 3', () => {
  const manifest = loadManifest('simce_mat_2m_e3.json');

  it('evaluacion_id = eval-simce-mat-2m-e3', () => {
    expect(manifest.evaluacion_id).toBe('eval-simce-mat-2m-e3');
  });

  it('tiene exactamente 34 preguntas', () => {
    expect(manifest.n_preguntas).toBe(34);
    expect(Object.keys(manifest.claves).length).toBe(34);
  });

  it('claves secuenciales 1–34 completas', () => {
    for (let i = 1; i <= 34; i++) {
      expect(manifest.claves[String(i)], `Falta clave pregunta ${i}`).toBeDefined();
    }
  });

  it('todas las claves son A/B/C/D', () => {
    const validas = new Set(['A', 'B', 'C', 'D']);
    for (const [num, letra] of Object.entries(manifest.claves as Record<string, string>)) {
      if (!validas.has(letra)) {
        throw new Error(`Clave inválida '${letra}' en pregunta ${num}`);
      }
    }
  });

  it('ninguna clave supera 60% de frecuencia', () => {
    checkKeyDistribution(manifest.claves, 34, 60);
  });

  it('puntaje esperado = 68 pts', () => {
    expect(manifest.puntaje_esperado).toBe(68);
  });
});

describe('SIMCE Matemática 6° Básico Ensayo 3', () => {
  const manifest = loadManifest('simce_mat_6b_e3.json');

  it('evaluacion_id = eval-simce-mat-6b-e3', () => {
    expect(manifest.evaluacion_id).toBe('eval-simce-mat-6b-e3');
  });

  it('tiene exactamente 35 preguntas', () => {
    expect(manifest.n_preguntas).toBe(35);
    expect(Object.keys(manifest.claves).length).toBe(35);
  });

  it('claves secuenciales 1–35 completas', () => {
    for (let i = 1; i <= 35; i++) {
      expect(manifest.claves[String(i)], `Falta clave pregunta ${i}`).toBeDefined();
    }
  });

  it('todas las claves son A/B/C/D', () => {
    const validas = new Set(['A', 'B', 'C', 'D']);
    for (const [num, letra] of Object.entries(manifest.claves as Record<string, string>)) {
      if (!validas.has(letra)) {
        throw new Error(`Clave inválida '${letra}' en pregunta ${num}`);
      }
    }
  });

  it('ninguna clave supera 60% de frecuencia', () => {
    checkKeyDistribution(manifest.claves, 35, 60);
  });

  it('puntaje esperado = 70 pts', () => {
    expect(manifest.puntaje_esperado).toBe(70);
  });
});

describe('PAES Competencia Lectora 2026 Forma 101 Invierno', () => {
  const manifest = loadManifest('paes_lectora_2026_f101.json');

  it('apunta a eval-paes-lect-2026-f103 (id interno histórico)', () => {
    expect(manifest.evaluacion_id).toBe('eval-paes-lect-2026-f103');
  });

  it('tiene exactamente 65 preguntas', () => {
    expect(manifest.n_preguntas).toBe(65);
    expect(Object.keys(manifest.claves).length).toBe(65);
  });

  it('60 puntuables y 5 piloto', () => {
    expect(manifest.preguntas_puntuables).toBe(60);
    expect(Array.isArray(manifest.preguntas_piloto)).toBe(true);
    expect(manifest.preguntas_piloto.length).toBe(5);
  });

  it('los números piloto están en rango 1–65', () => {
    for (const num of manifest.preguntas_piloto as number[]) {
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(65);
    }
  });

  it('claves secuenciales 1–65 completas', () => {
    for (let i = 1; i <= 65; i++) {
      expect(manifest.claves[String(i)], `Falta clave pregunta ${i}`).toBeDefined();
    }
  });

  it('todas las claves son A/B/C/D', () => {
    const validas = new Set(['A', 'B', 'C', 'D']);
    for (const [num, letra] of Object.entries(manifest.claves as Record<string, string>)) {
      if (!validas.has(letra)) {
        throw new Error(`Clave inválida '${letra}' en pregunta ${num}`);
      }
    }
  });

  it('ninguna clave supera 60% de frecuencia (65 preguntas)', () => {
    checkKeyDistribution(manifest.claves, 65, 60);
  });
});

describe('Higiene del directorio public/', () => {
  it('no contiene archivos PDF', () => {
    const publicDir = path.resolve('public');
    const pdfFiles: string[] = [];

    function scan(dir: string) {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) scan(full);
        else if (entry.name.toLowerCase().endsWith('.pdf')) pdfFiles.push(full);
      }
    }

    scan(publicDir);
    if (pdfFiles.length > 0) {
      throw new Error(`PDFs en public/: ${pdfFiles.join(', ')}`);
    }
  });

  it('no contiene solucionarios confidenciales en public/', () => {
    const publicDir = path.resolve('public');
    const sospechosos: string[] = [];

    function scan(dir: string) {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) scan(full);
        else if (/solucionario|pauta.*confidencial/i.test(entry.name)) sospechosos.push(full);
      }
    }

    scan(publicDir);
    if (sospechosos.length > 0) {
      throw new Error(`Archivos confidenciales en public/: ${sospechosos.join(', ')}`);
    }
  });
});

// ── Resultado final ───────────────────────────────────────────────────────────

console.log('\n' + '='.repeat(60));
console.log(`Resultado: ${totalPass} PASS | ${totalFail} FAIL`);

if (totalFail > 0) {
  console.error('\n❌ FALLOS:');
  failures.forEach(f => console.error(`  • ${f}`));
  process.exit(1);
} else {
  console.log('\n🎉 Suite de integridad: TODAS LAS VERIFICACIONES PASARON');
  process.exit(0);
}
