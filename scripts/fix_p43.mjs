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

async function main() {
  const enunciado = `Una empresa vende crema para las manos en envases con forma de cilindros rectos de 20 cm de altura y de distintos diámetros.

Por una promoción se decide aumentar en su 20 % la capacidad de cada envase, manteniendo la altura de los envases cilíndricos.

¿Cuál de las siguientes funciones permite determinar el volumen de los nuevos envases, en $\\text{cm}^3$, con $r$ el radio del envase sin promoción, en cm?`;

  const alternativas = [
    {
      letra: 'A',
      texto: '$p(r) = 16 \\cdot r^2 \\cdot \\pi$',
      es_correcta: false
    },
    {
      letra: 'B',
      texto: '$g(r) = 24 \\cdot r^2 \\cdot \\pi$',
      es_correcta: true
    },
    {
      letra: 'C',
      texto: '$f(r) = 28{,}8 \\cdot r^2 \\cdot \\pi$',
      es_correcta: false
    },
    {
      letra: 'D',
      texto: '$h(r) = 576 \\cdot r^2 \\cdot \\pi$',
      es_correcta: false
    }
  ];

  const { data, error } = await supabase
    .from('preguntas')
    .update({
      enunciado: enunciado,
      alternativas: alternativas,
      respuesta_correcta: 'B',
      updated_at: new Date().toISOString()
    })
    .eq('id', 'preg-paes-m1-23-43')
    .select('id, enunciado, alternativas, respuesta_correcta');

  if (error) {
    console.error('Error updating P43:', error);
  } else {
    console.log('✅ Pregunta 43 actualizada exitosamente en Supabase:');
    console.log(JSON.stringify(data, null, 2));
  }
}

main().catch(console.error);
