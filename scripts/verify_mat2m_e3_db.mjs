import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
let url = '', key = '';
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('VITE_SUPABASE_URL=')) url = trimmed.slice('VITE_SUPABASE_URL='.length).replace(/['"]/g, '');
  if (trimmed.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) key = trimmed.slice('SUPABASE_SERVICE_ROLE_KEY='.length).replace(/['"]/g, '');
}

const sb = createClient(url, key);

async function verify() {
  console.log('=== VERIFICACIÓN POST-MIGRACIÓN 052 (SIMCE MAT 2M E3) ===');

  // 1. Evaluación
  const { data: ev, error: evErr } = await sb
    .from('evaluaciones')
    .select('id, titulo, total_preguntas, estado, es_catalogo')
    .eq('id', 'eval-simce-mat-2m-e3')
    .single();

  if (evErr) {
    console.error('Error al consultar evaluacion:', evErr.message);
    return;
  }
  console.log('Evaluación:', ev);

  // 2. Preguntas
  const { data: preguntas, error: pErr } = await sb
    .from('preguntas')
    .select('id, respuesta_correcta, alternativas, imagen_url')
    .ilike('id', 'preg-mat2m-e3-%')
    .order('id');

  if (pErr) {
    console.error('Error al consultar preguntas:', pErr.message);
    return;
  }

  console.log(`Total preguntas en BD: ${preguntas.length}`);

  let errors = 0;
  const keyDist = { A: 0, B: 0, C: 0, D: 0, others: 0 };

  for (const p of preguntas) {
    const key = p.respuesta_correcta;
    if (keyDist[key] !== undefined) keyDist[key]++;
    else keyDist.others++;

    const alts = Array.isArray(p.alternativas)
      ? p.alternativas
      : JSON.parse(p.alternativas || '[]');

    const correctAlts = alts.filter(a => a.es_correcta);
    if (correctAlts.length !== 1) {
      console.error(`❌ ${p.id}: tiene ${correctAlts.length} alternativas correctas`);
      errors++;
    } else if (correctAlts[0].letra !== key) {
      console.error(`❌ ${p.id}: alternativa correcta (${correctAlts[0].letra}) no coincide con respuesta_correcta (${key})`);
      errors++;
    }
  }

  console.log('Distribución de claves:', keyDist);

  // 3. Chequear P26
  const p26 = preguntas.find(p => p.id === 'preg-mat2m-e3-26');
  console.log('P26 verificada:', { id: p26?.id, respuesta_correcta: p26?.respuesta_correcta });

  // 4. Chequear P35
  const p35 = preguntas.find(p => p.id === 'preg-mat2m-e3-35');
  if (p35) {
    console.error('❌ preg-mat2m-e3-35 todavía existe en la base de datos!');
    errors++;
  } else {
    console.log('✅ preg-mat2m-e3-35 eliminada correctamente');
  }

  if (errors === 0 && preguntas.length === 34) {
    console.log('\n🎉 VERIFICACIÓN EXITOSA: 34 preguntas íntegras, 1 correcta por fila, claves 100% coherentes.');
  } else {
    console.log(`\n⚠️ Se encontraron ${errors} discrepancias.`);
  }
}

verify();
