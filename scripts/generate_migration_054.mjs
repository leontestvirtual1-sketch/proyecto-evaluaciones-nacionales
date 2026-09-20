import fs from 'fs';
import path from 'path';

const datasetPath = 'scripts/data/paes_lect_2026_reales_65.json';
const data = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

let sql = `-- ==============================================================================
-- Migración 054: Saneamiento y Normalización PAES Competencia Lectora 2026 (Forma 101 Invierno)
-- - Corrección de rótulo a Forma 101 Invierno Oficial DEMRE
-- - Depuración de alternativas con textos de lectura pegados (Q08, Q17, Q26, Q37, Q47, Q55)
-- - Eliminación de pies de página FORMA 101 en todas las preguntas
-- - Formateo de lecturas compartidas según skill eval-markdown-formatter
-- - Asignación de 5 preguntas piloto (puntaje 0) y 60 puntuables (puntaje 1)
-- ==============================================================================

BEGIN;

-- 1. Actualización de cabecera en public.evaluaciones
UPDATE public.evaluaciones
SET
  titulo = 'PAES Oficial Competencia Lectora — Proceso 2026 (Forma 101 — Invierno)',
  descripcion = 'Evaluación oficial DEMRE de Competencia Lectora aplicada en el Proceso de Admisión 2026 (Forma 101 — Invierno). Incluye 65 preguntas de selección múltiple (60 válidas y 5 piloto de calibración) sobre textos literarios, expositivos y argumentativos, evaluando Localizar, Interpretar y Evaluar información.',
  descripcion_catalogo = 'Prueba oficial DEMRE PAES Competencia Lectora 2026 (Forma 101 — Invierno) completa con 65 ítems, escala oficial DEMRE de 100 a 1000 puntos y pauta docente con justificación curricular.',
  total_preguntas = 65,
  updated_at = NOW()
WHERE id = 'eval-paes-lect-2026-f103';

`;

for (const p of data) {
  const altsJson = JSON.stringify(p.alternativas).replace(/'/g, "''");
  // Escapar comillas simples en enunciado
  const enunciadoEscapado = p.enunciado.replace(/'/g, "''");
  
  sql += `UPDATE public.preguntas
SET
  enunciado = '${enunciadoEscapado}',
  alternativas = '${altsJson}'::jsonb,
  respuesta_correcta = '${p.respuesta_correcta}',
  puntaje = ${p.puntaje},
  eje_tematico_id = '${p.eje_tematico_id}',
  habilidad_id = '${p.habilidad_id}',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = '${p.id}';

`;
}

sql += `COMMIT;
`;

const outSqlPath = 'supabase/migrations/054_clean_paes_lect_2026_forma101.sql';
fs.writeFileSync(outSqlPath, sql, 'utf8');
console.log(`✅ Migración 054 generada exitosamente en ${outSqlPath}`);
