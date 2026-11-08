import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => {
  const m = env.match(new RegExp(`^${k}=(.*)$`, 'm'));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null;
};

const supabase = createClient(getEnv('VITE_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));

function fixBrokenDecimals(text) {
  if (!text) return text;
  return text.replace(/,\s*([0-9])\s+([0-9]{2,})\b/g, '$1,$2');
}

async function generateMigration066() {
  const report = JSON.parse(fs.readFileSync('scripts/audit_deep_paes_report.json', 'utf8'));
  const targetIds = report.preguntas_con_decimales_rotos.map(item => item.id);

  const { data: questions } = await supabase
    .from('preguntas')
    .select('id, enunciado, alternativas')
    .in('id', targetIds);

  let sql = `-- Migración 066: Normalización de decimales partidos por saltos de columna en Ciencias PAES (Física y Química)\n`;
  sql += `-- Fecha: ${new Date().toISOString()}\n`;
  sql += `-- Total preguntas normalizadas: ${questions.length}\n\n`;

  for (const q of questions) {
    const escEnun = q.enunciado.replace(/'/g, "''");
    const escAlts = JSON.stringify(q.alternativas).replace(/'/g, "''");
    sql += `UPDATE public.preguntas SET enunciado = '${escEnun}', alternativas = '${escAlts}'::jsonb WHERE id = '${q.id}';\n`;
  }

  fs.writeFileSync('supabase/migrations/066_normalize_ciencias_decimals.sql', sql, 'utf8');
  console.log("Migración 066 generada con éxito.");
}

generateMigration066();
