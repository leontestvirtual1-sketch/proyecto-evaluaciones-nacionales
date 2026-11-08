import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => {
  const m = env.match(new RegExp(`^${k}=(.*)$`, 'm'));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null;
};

const supabase = createClient(getEnv('VITE_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));

// Normalizar decimales partidos: ,0 75 → 0,75; ,3 00 → 3,00; ,0 12 → 0,12
function fixBrokenDecimals(text) {
  if (!text) return text;
  return text.replace(/,\s*([0-9])\s+([0-9]{2,})\b/g, '$1,$2');
}

async function run() {
  console.log("=== NORMALIZACIÓN DE DECIMALES PARTIDOS EN CIENCIAS (SUPABASE) ===");
  
  const report = JSON.parse(fs.readFileSync('scripts/audit_deep_paes_report.json', 'utf8'));
  const targetIds = report.preguntas_con_decimales_rotos.map(item => item.id);
  console.log(`Preguntas identificadas con decimales partidos: ${targetIds.length}`);

  const { data: questions, error } = await supabase
    .from('preguntas')
    .select('id, enunciado, alternativas, respuesta_correcta')
    .in('id', targetIds);

  if (error) {
    console.error("Error al cargar preguntas:", error);
    process.exit(1);
  }

  let successCount = 0;
  for (const q of questions) {
    const fixedEnunciado = fixBrokenDecimals(q.enunciado);
    let altsChanged = false;
    const fixedAlts = (q.alternativas || []).map(alt => {
      const fixedTexto = fixBrokenDecimals(alt.texto);
      if (fixedTexto !== alt.texto) altsChanged = true;
      return { ...alt, texto: fixedTexto };
    });

    const { error: updErr } = await supabase
      .from('preguntas')
      .update({
        enunciado: fixedEnunciado,
        alternativas: fixedAlts,
        respuesta_correcta: q.respuesta_correcta // Inmutabilidad
      })
      .eq('id', q.id);

    if (updErr) {
      console.error(`Error actualizando ${q.id}:`, updErr);
    } else {
      successCount++;
    }
  }

  console.log(`Preguntas normalizadas con éxito: ${successCount} / ${questions.length}`);
}

run();

