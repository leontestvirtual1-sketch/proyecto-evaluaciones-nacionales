import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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

const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function run() {
  const { data: preguntas, error } = await supabase
    .from('preguntas')
    .select('id, enunciado, alternativas, respuesta_correcta, imagen_url')
    .like('id', 'preg-paes-m1-23-%')
    .order('id');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Auditoría de ${preguntas.length} preguntas PAES M1 2023:\n`);

  const desordenadas = [];
  const textoSospechoso = [];

  for (const p of preguntas) {
    const alts = Array.isArray(p.alternativas) ? p.alternativas : [];
    const letras = alts.map(a => a.letra);
    const letrasEsperadas = ['A', 'B', 'C', 'D'].slice(0, letras.length);

    const esDesordenada = letras.join(',') !== letrasEsperadas.join(',');
    if (esDesordenada) {
      desordenadas.push({ id: p.id, letras, esperado: letrasEsperadas });
    }

    const sospechosos = alts.filter(a => 
      /opci[oó]n\s+[A-D]/i.test(a.texto) ||
      /^[A-D]\)$/i.test(a.texto?.trim()) ||
      /[YX]\s+[YX]\s+[YX]/i.test(a.texto) ||
      /forma\s+113/i.test(a.texto)
    );

    if (sospechosos.length > 0) {
      textoSospechoso.push({ id: p.id, sospechosos });
    }
  }

  console.log(`--- PREGUNTAS CON ALTERNATIVAS DESORDENADAS (${desordenadas.length}) ---`);
  for (const d of desordenadas) {
    console.log(`ID: ${d.id} -> Letras actuales: [${d.letras.join(', ')}]`);
  }

  console.log(`\n--- PREGUNTAS CON TEXTO SOSPECHOSO EN ALTERNATIVAS (${textoSospechoso.length}) ---`);
  for (const s of textoSospechoso) {
    console.log(`ID: ${s.id} ->`, s.sospechosos.map(a => `${a.letra}: "${a.texto}"`));
  }
}

run();
