import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '')];
    })
);

const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkTables() {
  const ids = [11, 15, 18, 28, 55, 63].map(n => `preg-paes-m1-23-${String(n).padStart(2, '0')}`);
  const { data } = await supabase.from('preguntas').select('id, enunciado, imagen_url').in('id', ids);
  for (const q of data) {
    console.log(`\n=== ${q.id} ===`);
    console.log(q.enunciado.slice(0, 180));
    console.log('Has table syntax |---| ?', q.enunciado.includes('|'));
  }
}

checkTables();
