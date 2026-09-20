import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectLastQuestions() {
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
    .select('id, enunciado, alternativas, respuesta_correcta')
    .in('id', ids)
    .order('id', { ascending: true });

  for (const p of pregs) {
    console.log(`\n=================== ${p.id} (Clave: ${p.respuesta_correcta}) ===================`);
    console.log('Enunciado:', p.enunciado);
    for (const a of p.alternativas) {
      console.log(`[${a.letra}] (Len: ${a.texto.length}): ${a.texto.substring(0, 150)}...`);
    }
  }
}

inspectLastQuestions();
