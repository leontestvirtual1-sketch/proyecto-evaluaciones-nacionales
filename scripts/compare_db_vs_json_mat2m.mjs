import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
let url = '', key = '';
for (const line of envContent.split('\n')) {
  const t = line.trim();
  if (t.startsWith('VITE_SUPABASE_URL=')) url = t.slice('VITE_SUPABASE_URL='.length).replace(/['"]/g, '');
  if (t.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) key = t.slice('SUPABASE_SERVICE_ROLE_KEY='.length).replace(/['"]/g, '');
}

const sb = createClient(url, key);

async function main() {
  const { data: dbRows } = await sb
    .from('preguntas')
    .select('id, respuesta_correcta, enunciado')
    .ilike('id', 'preg-mat2m-e3-%')
    .order('id');

  const jsonData = JSON.parse(fs.readFileSync('scripts/data/mat2m_e3_preguntas_reales_34.json', 'utf8'));
  const jsonMap = {};
  for (const p of jsonData.preguntas) jsonMap[p.id] = p;

  console.log('=== COMPARACIÓN DB vs JSON (Mat 2M E3) ===');
  console.log(`DB filas: ${dbRows.length}  |  JSON filas: ${jsonData.preguntas.length}`);

  let mismatches = 0;
  for (const row of dbRows) {
    const jp = jsonMap[row.id];
    if (!jp) {
      console.log(`⚠️  ${row.id}: existe en DB pero NO en JSON (posible fila extra)`);
      continue;
    }
    if (row.respuesta_correcta !== jp.respuesta_correcta) {
      console.log(`❌ ${row.id}: clave DB=${row.respuesta_correcta}  JSON=${jp.respuesta_correcta}`);
      mismatches++;
    }
    const firstLine = jp.enunciado.split('\n')[0].slice(0, 60);
    const dbFirst = (row.enunciado || '').split('\n')[0].slice(0, 60);
    if (dbFirst !== firstLine) {
      console.log(`❌ ${row.id}: enunciado diferente`);
      console.log(`   DB:   ${dbFirst}`);
      console.log(`   JSON: ${firstLine}`);
      mismatches++;
    }
  }

  if (mismatches === 0) {
    console.log('\n✅ DB y JSON están 100% sincronizados.');
  } else {
    console.log(`\n⚠️  ${mismatches} discrepancias encontradas.`);
  }
}

main();
