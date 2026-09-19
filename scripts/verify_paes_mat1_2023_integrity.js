import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx > -1) {
      const key = trimmed.substring(0, idx).trim();
      let val = trimmed.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

loadEnv();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// Claves oficiales DEMRE de la PAUTA DOCENTE (fuente de verdad)
const clavesOficialesDEMRE = {
  1:'B', 2:'A', 3:'C', 4:'A', 5:'C', 6:'D', 7:'D', 8:'A', 9:'D', 10:'C',
  11:'A', 12:'D', 13:'C', 14:'B', 15:'C', 16:'A', 17:'C', 18:'D', 19:'B', 20:'C',
  21:'A', 22:'B', 23:'D', 24:'D', 25:'A', 26:'B', 27:'C', 28:'D', 29:'A', 30:'D',
  31:'A', 32:'A', 33:'C', 34:'B', 35:'C', 36:'B', 37:'B', 38:'B', 39:'D', 40:'C',
  41:'C', 42:'C', 43:'B', 44:'C', 45:'A', 46:'B', 47:'C', 48:'B', 49:'D', 50:'B',
  51:'B', 52:'B', 53:'D', 54:'B', 55:'A', 56:'D', 57:'B', 58:'D', 59:'D', 60:'C',
  61:'A', 62:'B', 63:'A', 64:'C', 65:'B'
};

async function main() {
  console.log('🔍 Verificando integridad de las 65 preguntas PAES M1 2023 Forma 113...\n');

  const { data, error } = await supabase
    .from('preguntas')
    .select('id, alternativas, respuesta_correcta, fuente')
    .like('id', 'preg-paes-m1-23-%')
    .order('id');

  if (error) throw error;

  const issues = [];
  const missing = [];

  for (let num = 1; num <= 65; num++) {
    const id = `preg-paes-m1-23-${String(num).padStart(2, '0')}`;
    const row = data.find(r => r.id === id);

    if (!row) {
      missing.push(id);
      continue;
    }

    const alts = Array.isArray(row.alternativas) ? row.alternativas : [];
    const correctas = alts.filter(a => a.es_correcta === true);
    const expected = clavesOficialesDEMRE[num];

    if (correctas.length !== 1) {
      issues.push({ id, num, problema: `${correctas.length} alternativas marcadas como correctas (se espera 1)`, expected });
    } else if (correctas[0].letra !== expected) {
      issues.push({ id, num, problema: `Clave incorrecta: tiene ${correctas[0].letra}, esperado DEMRE=${expected}`, expected });
    }

    if (row.respuesta_correcta !== expected) {
      issues.push({ id, num, problema: `respuesta_correcta en DB="${row.respuesta_correcta}" pero DEMRE=${expected}`, expected });
    }
  }

  if (missing.length > 0) {
    console.warn('⚠️  Preguntas faltantes en DB:');
    missing.forEach(id => console.warn('  -', id));
    console.log();
  }

  if (issues.length === 0) {
    console.log('✅ TODAS LAS 65 PREGUNTAS VERIFICADAS — integridad OK.\n');
  } else {
    console.log(`❌ Se encontraron ${issues.length} problemas de integridad:\n`);
    issues.forEach(i => console.log(`  Q${i.num} (${i.id}): ${i.problema}`));
    console.log();
    process.exit(1);
  }

  console.log(`Total en DB con patrón preg-paes-m1-23-*: ${data.length}`);
}

main().catch(e => { console.error(e); process.exit(1); });
