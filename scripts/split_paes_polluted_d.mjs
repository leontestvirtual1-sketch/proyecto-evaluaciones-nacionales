import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function splitDetails() {
  const ids = [
    'preg-paes-lec-26-08',
    'preg-paes-lec-26-17',
    'preg-paes-lec-26-26',
    'preg-paes-lec-26-37',
    'preg-paes-lec-26-47',
    'preg-paes-lec-26-55'
  ];

  const { data: pregs } = await supabase
    .from('preguntas')
    .select('id, alternativas')
    .in('id', ids)
    .order('id', { ascending: true });

  for (const p of pregs) {
    const d = p.alternativas.find(a => a.letra === 'D');
    console.log(`\n=================== ${p.id} ===================`);
    const raw = d.texto;
    // Buscar donde empieza FORMA 101 o Lectura
    const m = raw.match(/\s*(FORMA\s*101.*|Lectura\s*\d+.*)/i);
    if (m) {
      const idx = m.index;
      const cleanAlt = raw.substring(0, idx).trim();
      const readingPart = raw.substring(idx).trim();
      console.log('--- ALTERNATIVA D LIMPIA ---');
      console.log(cleanAlt);
      console.log('--- LECTURA EXTRAIDA (primeros 200 chars) ---');
      console.log(readingPart.substring(0, 200) + '...');
      console.log(`Longitud lectura: ${readingPart.length}`);
    } else {
      console.log('NO MATCH en:', raw.substring(0, 100));
    }
  }
}

splitDetails();
