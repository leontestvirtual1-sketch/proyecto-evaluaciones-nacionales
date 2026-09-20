import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectLecturaHeaders() {
  const ids = [
    'preg-paes-lec-26-01',
    'preg-paes-lec-26-09',
    'preg-paes-lec-26-18',
    'preg-paes-lec-26-27',
    'preg-paes-lec-26-38',
    'preg-paes-lec-26-48',
    'preg-paes-lec-26-56'
  ];

  const { data: pregs } = await supabase
    .from('preguntas')
    .select('id, enunciado')
    .in('id', ids)
    .order('id', { ascending: true });

  for (const p of pregs) {
    console.log(`\n=================== ${p.id} ===================`);
    console.log(`Longitud enunciado: ${p.enunciado.length}`);
    console.log(`Primeros 250 chars:\n${p.enunciado.substring(0, 250)}...`);
  }
}

inspectLecturaHeaders();
