import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Faltan variables de entorno Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: pregs, error } = await supabase
    .from('preguntas')
    .select('id, puntaje, respuesta_correcta')
    .like('id', 'preg-mat6b-e3-%')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching:', error);
    return;
  }

  console.log(`Encontradas ${pregs.length} preguntas.`);
  const suma = pregs.reduce((acc, p) => acc + (p.puntaje || 0), 0);
  console.log(`Suma total de puntajes actual: ${suma}`);
  console.log('Detalle de puntajes actuales:');
  pregs.forEach(p => console.log(`${p.id}: puntaje=${p.puntaje}, clave=${p.respuesta_correcta}`));
}

check();
