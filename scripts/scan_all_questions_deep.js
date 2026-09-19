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

async function main() {
  const { data, error } = await supabase
    .from('preguntas')
    .select('id, enunciado, alternativas, respuesta_correcta')
    .like('id', 'preg-paes-m1-23-%')
    .order('id');

  if (error) {
    console.error(error);
    return;
  }

  console.log(`Analizando ${data.length} preguntas de PAES M1 2023 Forma 113...`);
  const flagged = [];

  data.forEach((p, idx) => {
    const num = idx + 1;
    const allText = p.enunciado + ' ' + JSON.stringify(p.alternativas);
    const issues = [];

    // 1. Inverted currency / numbers: "000 120", "000 240", "más000"
    if (/000\s*\d+|\d+\s*000(?!\s*pesos|\s*\$)|000\s*\$|\$\s*000/i.test(allText)) {
      issues.push('Montos invertidos (ej. 000 120 o 000 240 $)');
    }
    // 2. Concatenated words without space: "porcuatrohoras", "más00025", "delos"
    if (/(?:porcuatrohoras|más000|delos|almenos|encada|delas|conel)/i.test(allText)) {
      issues.push('Palabras pegadas sin espacios (ej. porcuatrohoras)');
    }
    // 3. Inverted decimals: "25 ,1" o "75 ,0" o "% 25"
    if (/\d+\s*,\s*\d+|%\s*\d+/i.test(allText)) {
      issues.push('Decimales o porcentajes invertidos (ej. 25 ,1 o % 25)');
    }
    // 4. Bleed watermark: "FORMA 113"
    if (/forma\s*113/i.test(allText)) {
      issues.push('Marca de agua FORMA 113 pegada');
    }

    if (issues.length > 0) {
      flagged.push({ num, id: p.id, issues, enunciado: p.enunciado.slice(0, 80).replace(/\n/g, ' ') });
    }
  });

  console.log(`\nEncontradas ${flagged.length} preguntas con defectos de extracción:\n`);
  flagged.forEach(f => {
    console.log(`Q${f.num} (${f.id}): [${f.issues.join(' | ')}]`);
    console.log(`   "${f.enunciado}"\n`);
  });
}

main().catch(console.error);
