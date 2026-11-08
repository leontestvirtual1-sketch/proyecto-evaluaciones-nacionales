import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => {
  const m = env.match(new RegExp(`^${k}=(.*)$`, 'm'));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null;
};

const supabase = createClient(getEnv('VITE_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));

const p19_enunciado = '**19. Durante la primera mitad del siglo XIX, Chile como país independiente debió organizar la naciente República, lo que implicó grandes desafíos en pos de la conformación del Estado-nación. ¿Qué estrategia se implementó para llevar a cabo este proceso?**';

const p22_enunciado = '**22. El triunfo del ejército chileno en el conflicto contra la Confederación Perú-Boliviana (1836-1839) tuvo un significado importante en la consolidación del incipiente Estado-nación. En ese contexto, la victoria fue relevante para Chile, porque**';

async function run() {
  console.log("=== CORRECCIÓN EDITORIAL HISTORIA 2023 REGULAR (P19 & P22) ===");

  // Generar migración SQL 067
  let sql = `-- Migración 067: Corrección ortográfica y editorial de Historia 2023 Regular (P19 y P22)\n`;
  sql += `-- Corrige pérdida de letras/tildes en P19 y puntuación/guion en P22\n`;
  sql += `-- Fecha: ${new Date().toISOString()}\n\n`;

  sql += `UPDATE public.preguntas SET enunciado = '${p19_enunciado.replace(/'/g, "''")}' WHERE id = 'preg-paes-his-23reg-19';\n`;
  sql += `UPDATE public.preguntas SET enunciado = '${p22_enunciado.replace(/'/g, "''")}' WHERE id = 'preg-paes-his-23reg-22';\n`;

  fs.writeFileSync('supabase/migrations/067_fix_editorial_his2023_p19_p22.sql', sql, 'utf8');
  console.log("Migración 067 guardada en supabase/migrations/067_fix_editorial_his2023_p19_p22.sql");

  // Aplicar en Supabase
  const { error: err19 } = await supabase
    .from('preguntas')
    .update({ enunciado: p19_enunciado })
    .eq('id', 'preg-paes-his-23reg-19');

  if (err19) console.error("Error al actualizar P19:", err19);
  else console.log("✓ [preg-paes-his-23reg-19] Enunciado ortográfico restaurado con éxito.");

  const { error: err22 } = await supabase
    .from('preguntas')
    .update({ enunciado: p22_enunciado })
    .eq('id', 'preg-paes-his-23reg-22');

  if (err22) console.error("Error al actualizar P22:", err22);
  else console.log("✓ [preg-paes-his-23reg-22] Enunciado y puntuación restaurados con éxito.");
}

run();
