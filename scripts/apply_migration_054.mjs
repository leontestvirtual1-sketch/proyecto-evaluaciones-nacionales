import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Faltan variables de entorno Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function apply() {
  console.log('🚀 Aplicando Migración 054: Saneamiento PAES Competencia Lectora 2026 Forma 101...');

  // 1. Actualizar Cabecera de Evaluación
  const { data: updatedEval, error: errEval } = await supabase
    .from('evaluaciones')
    .update({
      titulo: 'PAES Oficial Competencia Lectora — Proceso 2026 (Forma 101 — Invierno)',
      descripcion: 'Evaluación oficial DEMRE de Competencia Lectora aplicada en el Proceso de Admisión 2026 (Forma 101 — Invierno). Incluye 65 preguntas de selección múltiple (60 válidas y 5 piloto de calibración) sobre textos literarios, expositivos y argumentativos, evaluando Localizar, Interpretar y Evaluar información.',
      descripcion_catalogo: 'Prueba oficial DEMRE PAES Competencia Lectora 2026 (Forma 101 — Invierno) completa con 65 ítems, escala oficial DEMRE de 100 a 1000 puntos y pauta docente con justificación curricular.',
      total_preguntas: 65,
      updated_at: new Date().toISOString()
    })
    .eq('id', 'eval-paes-lect-2026-f103')
    .select('id, titulo, total_preguntas');

  if (errEval) {
    console.error('❌ Error al actualizar cabecera en evaluaciones:', errEval);
    process.exit(1);
  }
  console.log('✅ Cabecera de evaluación actualizada:', updatedEval);

  // 2. Cargar Dataset
  const dataset = JSON.parse(fs.readFileSync('scripts/data/paes_lect_2026_reales_65.json', 'utf8'));
  console.log(`📦 Actualizando ${dataset.length} preguntas en Supabase...`);

  let updatedCount = 0;
  for (const p of dataset) {
    const { error: errPreg } = await supabase
      .from('preguntas')
      .update({
        enunciado: p.enunciado,
        alternativas: p.alternativas,
        respuesta_correcta: p.respuesta_correcta,
        puntaje: p.puntaje,
        eje_tematico_id: p.eje_tematico_id,
        habilidad_id: p.habilidad_id,
        fuente: p.fuente,
        updated_at: new Date().toISOString()
      })
      .eq('id', p.id);

    if (errPreg) {
      console.error(`❌ Error actualizando ${p.id}:`, errPreg);
      process.exit(1);
    }
    updatedCount++;
  }

  console.log(`🎉 Ingesta exitosa: ${updatedCount}/65 preguntas actualizadas y limpiadas en Supabase.`);
}

apply();
