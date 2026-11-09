import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => {
  const m = env.match(new RegExp(`^${k}=(.*)$`, 'm'));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null;
};
const supabase = createClient(getEnv('VITE_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));

const dummy25 = [
  'preg-paes-his-25reg-04', 'preg-paes-his-25reg-09', 'preg-paes-his-25reg-14',
  'preg-paes-his-25reg-19', 'preg-paes-his-25reg-20', 'preg-paes-his-25reg-21',
  'preg-paes-his-25reg-22', 'preg-paes-his-25reg-23', 'preg-paes-his-25reg-28',
  'preg-paes-his-25reg-31', 'preg-paes-his-25reg-36', 'preg-paes-his-25reg-37',
  'preg-paes-his-25reg-40', 'preg-paes-his-25reg-41', 'preg-paes-his-25reg-43',
  'preg-paes-his-25reg-50', 'preg-paes-his-25reg-51', 'preg-paes-his-25reg-54',
  'preg-paes-his-25reg-57', 'preg-paes-his-25reg-63'
];

const dummy26 = [
  'preg-paes-his-26reg-05', 'preg-paes-his-26reg-18', 'preg-paes-his-26reg-19',
  'preg-paes-his-26reg-22', 'preg-paes-his-26reg-25', 'preg-paes-his-26reg-26',
  'preg-paes-his-26reg-29', 'preg-paes-his-26reg-31', 'preg-paes-his-26reg-33',
  'preg-paes-his-26reg-34', 'preg-paes-his-26reg-38', 'preg-paes-his-26reg-39',
  'preg-paes-his-26reg-41', 'preg-paes-his-26reg-44', 'preg-paes-his-26reg-49',
  'preg-paes-his-26reg-51', 'preg-paes-his-26reg-54', 'preg-paes-his-26reg-57',
  'preg-paes-his-26reg-61', 'preg-paes-his-26reg-65'
];

async function align() {
  console.log("Alineando evaluaciones de Historia Regular 2025 y 2026 con la selección oficial DEMRE (45 ítems)...");

  // 1. Obtener eval 2025
  const { data: e25 } = await supabase.from('evaluaciones').select('pregunta_ids').eq('id', 'eval-paes-his-2025-reg-f103').single();
  const realPids25 = (e25.pregunta_ids || []).filter(id => !dummy25.includes(id));
  
  // 2. Obtener eval 2026
  const { data: e26 } = await supabase.from('evaluaciones').select('pregunta_ids').eq('id', 'eval-paes-his-2026-reg-f103').single();
  const realPids26 = (e26.pregunta_ids || []).filter(id => !dummy26.includes(id));

  console.log(`PIDs filtrados 2025: ${realPids25.length} (esperado: 45)`);
  console.log(`PIDs filtrados 2026: ${realPids26.length} (esperado: 45)`);

  // 3. Actualizar evaluaciones en Supabase
  const { error: err25 } = await supabase
    .from('evaluaciones')
    .update({
      total_preguntas: realPids25.length,
      pregunta_ids: realPids25,
      titulo: 'PAES Oficial Historia y Ciencias Sociales — Proceso 2025 (Selección Oficial Forma 103 — Regular)'
    })
    .eq('id', 'eval-paes-his-2025-reg-f103');

  if (err25) console.error("Error actualizando eval 2025:", err25);
  else console.log("✓ Evaluacion 2025 actualizada a 45 preguntas oficiales");

  const { error: err26 } = await supabase
    .from('evaluaciones')
    .update({
      total_preguntas: realPids26.length,
      pregunta_ids: realPids26,
      titulo: 'PAES Oficial Historia y Ciencias Sociales — Proceso 2026 (Selección Oficial Forma 103 — Regular)'
    })
    .eq('id', 'eval-paes-his-2026-reg-f103');

  if (err26) console.error("Error actualizando eval 2026:", err26);
  else console.log("✓ Evaluacion 2026 actualizada a 45 preguntas oficiales");

  // 4. Eliminar las 40 preguntas dummy de la tabla preguntas
  const allDummy = [...dummy25, ...dummy26];
  const { error: delErr } = await supabase
    .from('preguntas')
    .delete()
    .in('id', allDummy);

  if (delErr) console.error("Error eliminando preguntas dummy:", delErr);
  else console.log(`✓ Eliminadas ${allDummy.length} preguntas dummy de tabla preguntas`);

  // 5. Generar archivo de migración SQL
  const sqlLines = [
    '--',
    '-- Migración 069: Alineación de Historia Regular 2025 y 2026 con la Selección Oficial DEMRE de 45 preguntas',
    '-- Remueve los 40 ítems artificiales no liberados por DEMRE para garantizar integridad pedagógica',
    '--',
    'BEGIN;',
    '',
    `UPDATE public.evaluaciones`,
    `SET total_preguntas = 45,`,
    `    pregunta_ids = '${JSON.stringify(realPids25)}'::jsonb,`,
    `    titulo = 'PAES Oficial Historia y Ciencias Sociales — Proceso 2025 (Selección Oficial Forma 103 — Regular)'`,
    `WHERE id = 'eval-paes-his-2025-reg-f103';`,
    '',
    `UPDATE public.evaluaciones`,
    `SET total_preguntas = 45,`,
    `    pregunta_ids = '${JSON.stringify(realPids26)}'::jsonb,`,
    `    titulo = 'PAES Oficial Historia y Ciencias Sociales — Proceso 2026 (Selección Oficial Forma 103 — Regular)'`,
    `WHERE id = 'eval-paes-his-2026-reg-f103';`,
    '',
    `DELETE FROM public.preguntas WHERE id IN (${allDummy.map(id => `'${id}'`).join(', ')});`,
    '',
    'COMMIT;',
    ''
  ];

  fs.writeFileSync('supabase/migrations/069_align_historia_regular_selections.sql', sqlLines.join('\n'), 'utf8');
  console.log("✓ Migración guardada en supabase/migrations/069_align_historia_regular_selections.sql");
}

align();

