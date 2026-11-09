import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env.local');
const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '')];
    })
);

const sb = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { count } = await sb.from('preguntas').select('*', { count: 'exact', head: true }).eq('asignatura_id', 'asig-5');
  console.log('✅ Total preguntas Biología en DB:', count);

  const { data: evals } = await sb.from('evaluaciones').select('id, titulo, total_preguntas, es_catalogo, estado, pregunta_ids').eq('asignatura_id', 'asig-5');
  console.log('\nEvaluaciones Biología en DB:');
  evals.forEach(e => {
    console.log(`  - ${e.id}: ${e.total_preguntas} preguntas (IDs: ${e.pregunta_ids?.length || 0}) | Estado: ${e.estado} | Catálogo: ${e.es_catalogo}`);
  });

  const { data: ejes } = await sb.from('ejes_tematicos').select('id, nombre').eq('asignatura_id', 'asig-5');
  console.log('\nEjes Temáticos:', ejes.map(x => `${x.id}: ${x.nombre}`));

  const { data: habs } = await sb.from('habilidades').select('id, nombre').eq('asignatura_id', 'asig-5');
  console.log('\nHabilidades:', habs.map(x => `${x.id}: ${x.nombre}`));
}

main();

