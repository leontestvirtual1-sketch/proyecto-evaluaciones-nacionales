import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Faltan variables de entorno Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function apply() {
  console.log('Aplicando corrección de puntaje para SIMCE Matemática 6B E3...');

  // 1. Actualizar preguntas a 2 puntos cada una
  const { data: updatedPregs, error: errPregs } = await supabase
    .from('preguntas')
    .update({ puntaje: 2, updated_at: new Date().toISOString() })
    .like('id', 'preg-mat6b-e3-%')
    .select('id, puntaje');

  if (errPregs) {
    console.error('Error al actualizar preguntas:', errPregs);
    process.exit(1);
  }

  console.log(`✅ ${updatedPregs.length} preguntas actualizadas con puntaje = 2.`);
  const suma = updatedPregs.reduce((acc, p) => acc + p.puntaje, 0);
  console.log(`Puntaje total resultante: ${suma} puntos (esperado: 70).`);

  // 2. Actualizar evaluaciones a total_preguntas = 35
  const { data: updatedEvals, error: errEvals } = await supabase
    .from('evaluaciones')
    .update({ total_preguntas: 35, updated_at: new Date().toISOString() })
    .in('id', ['eval-simce-mat-6b-e3', 'eval-simce-mat-6b-ensayo3'])
    .select('id, total_preguntas');

  if (errEvals) {
    console.error('Error al actualizar evaluaciones:', errEvals);
    process.exit(1);
  }

  console.log(`✅ Evaluaciones actualizadas:`, updatedEvals);
}

apply();
