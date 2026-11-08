import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: evals, error } = await supabase
    .from('evaluaciones')
    .select('id, titulo, codigo_acceso, total_preguntas, pregunta_ids, asignatura_id, asignatura_nombre')
    .ilike('id', '%paes%')
    .order('id');

  if (error) {
    console.error(error);
    return;
  }

  console.log(`=== EVALUACIONES PAES EN SUPABASE PRODUCCIÓN: ${evals.length} ===\n`);

  const bySubject = {};
  for (const e of evals) {
    const sub = e.asignatura_nombre || e.asignatura_id || 'Otras';
    if (!bySubject[sub]) bySubject[sub] = [];
    bySubject[sub].push(e);
  }

  for (const [sub, list] of Object.entries(bySubject)) {
    console.log(`\n📚 Asignatura: ${sub} (${list.length} formas)`);
    for (const e of list) {
      const count = e.pregunta_ids?.length || 0;
      console.log(`  • [${e.id}] ${e.titulo}`);
      console.log(`    Total esperado: ${e.total_preguntas} | IDs en BD: ${count} | Código: ${e.codigo_acceso}`);
    }
  }

  // Ahora chequear preguntas con PUA en TODAS las preguntas PAES de Supabase
  const allIds = evals.flatMap(e => e.pregunta_ids || []);
  const uniqueIds = [...new Set(allIds)];
  console.log(`\nTotal preguntas referenciadas en Supabase PAES: ${uniqueIds.length}`);

  let puaCount = 0;
  const puaBySubject = {};
  const BATCH_SIZE = 100;

  for (let i = 0; i < uniqueIds.length; i += BATCH_SIZE) {
    const batch = uniqueIds.slice(i, i + BATCH_SIZE);
    const { data: pregs } = await supabase
      .from('preguntas')
      .select('id, asignatura_id, enunciado, alternativas')
      .in('id', batch);

    for (const q of pregs || []) {
      const text = [
        q.enunciado || '',
        ...(Array.isArray(q.alternativas) ? q.alternativas.map(a => `${a.letra}: ${a.texto}`) : [])
      ].join('\n');

      const matches = text.match(/[\uF000-\uF8FF]/g);
      if (matches) {
        puaCount++;
        const sub = q.asignatura_id;
        puaBySubject[sub] = (puaBySubject[sub] || 0) + 1;
      }
    }
  }

  console.log(`\n=== ANÁLISIS DE CARACTERES PUA EN TODAS LAS PREGUNTAS PAES (SUPABASE) ===`);
  console.log(`Preguntas con PUA restantes en Supabase: ${puaCount}`);
  console.log('Distribución por asignatura_id:', puaBySubject);
}

check().catch(console.error);

