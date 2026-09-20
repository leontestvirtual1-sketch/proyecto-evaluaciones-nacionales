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

async function check() {
  const ids = ['preg-paes-m1-23-03', 'preg-paes-m1-23-10', 'preg-paes-m1-23-21', 'preg-paes-m1-23-38', 'preg-paes-m1-23-47', 'preg-paes-m1-23-52', 'preg-paes-m1-23-60'];
  const { data } = await supabase.from('preguntas').select('id, enunciado, imagen_url, alternativas').in('id', ids);
  for (const q of data) {
    console.log(`\n=================== ${q.id} ===================`);
    console.log('imagen_url:', q.imagen_url);
    console.log('enunciado:', q.enunciado);
    console.log('alternativas:', q.alternativas);
  }
}

check();
