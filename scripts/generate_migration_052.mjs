import fs from 'fs';

const jsonPath = 'scripts/data/mat2m_e3_preguntas_reales_34.json';
const outPath = 'supabase/migrations/052_rebuild_mat2m_e3_from_source.sql';

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const CDN_BASE = 'https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/simce_mat_2m_e3/';

const lines = [
  '-- ==============================================================================;',
  '-- Migración 052: Reconstrucción Fiel Ensayo 3 SIMCE Matemática 2° Medio;',
  '-- Fuente: Solucionario Oficial Umáximo (34 preguntas reales).;',
  '-- P26 adaptada para coherencia matemática exacta con escalas 1:64 y 1:43 (x = L·64/43).;',
  '-- Pregunta 35 eliminada (no existe en la fuente oficial).;',
  '-- ==============================================================================;',
  'BEGIN;',
  '',
  'UPDATE public.evaluaciones',
  "SET descripcion = 'Ensayo 3 SIMCE Matemática 2° Medio (Umáximo). 34 preguntas de selección múltiple: Números y Operaciones, Álgebra, Geometría, Medición y Probabilidad y Estadística.',",
  "    descripcion_catalogo = 'Ensayo de práctica SIMCE Matemática 2° Medio con 34 ítems de selección múltiple.',",
  '    total_preguntas = 34,',
  '    updated_at = NOW()',
  "WHERE id = 'eval-simce-mat-2m-e3';",
  ''
];

for (const p of data.preguntas) {
  const qId = p.id;
  const numStr = String(p.numero).padStart(2, '0');
  const comment = `-- P${numStr}: ${p.eje_tematico_id} / ${p.habilidad_id} / clave ${p.respuesta_correcta}`;
  
  const imgValue = p.figura ? `'${CDN_BASE}${p.figura}'` : 'NULL';
  const altsJson = JSON.stringify(p.alternativas);

  lines.push(comment);
  lines.push('UPDATE public.preguntas SET');
  lines.push(`    enunciado = $q$${p.enunciado}$q$,`);
  lines.push(`    alternativas = $q$${altsJson}$q$::jsonb,`);
  lines.push(`    respuesta_correcta = '${p.respuesta_correcta}',`);
  lines.push(`    eje_tematico_id = '${p.eje_tematico_id}',`);
  lines.push(`    habilidad_id = '${p.habilidad_id}',`);
  lines.push(`    dificultad = '${p.dificultad}',`);
  lines.push('    puntaje = 1,');
  lines.push(`    imagen_url = ${imgValue},`);
  lines.push('    updated_at = NOW()');
  lines.push(`WHERE id = '${qId}';`);
  lines.push('');
}

lines.push('-- P35: Eliminación de pregunta inventada que no existe en el instrumento oficial');
lines.push("DELETE FROM public.preguntas WHERE id = 'preg-mat2m-e3-35';");
lines.push('');
lines.push('COMMIT;');
lines.push('');

// Fix semicolons on comment headers
const content = lines.join('\n').replace(/;--/g, '--').replace(/;\n/g, '\n');
fs.writeFileSync(outPath, content, 'utf8');
console.log(`Migración generada exitosamente en ${outPath}`);
