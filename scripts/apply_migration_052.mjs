import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
let url = '', key = '';
for (const line of envContent.split('\n')) {
  const t = line.trim();
  if (t.startsWith('VITE_SUPABASE_URL=')) url = t.slice('VITE_SUPABASE_URL='.length).replace(/['"]/g, '');
  if (t.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) key = t.slice('SUPABASE_SERVICE_ROLE_KEY='.length).replace(/['"]/g, '');
}

const sb = createClient(url, key);

const CDN_BASE = 'https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/simce_mat_2m_e3/';

// Mapeo de figuras que ya están en Supabase Storage (de scratch/backup_impact_phase0.json)
const EXISTING_IMAGES = {
  'preg-mat2m-e3-19': `${CDN_BASE}p19_plano_rectas.png`,
  'preg-mat2m-e3-22': `${CDN_BASE}p22_recta_plano.png`,
  'preg-mat2m-e3-27': `${CDN_BASE}p27_circulo_sector.png`,
  'preg-mat2m-e3-28': `${CDN_BASE}p28_figura_geometria.png`,
  'preg-mat2m-e3-29': `${CDN_BASE}p29_triangulo_trig.png`,
  'preg-mat2m-e3-31': `${CDN_BASE}p31_tablero_galton.png`,
  'preg-mat2m-e3-32': `${CDN_BASE}p32_diagrama_videojuegos.png`,
  'preg-mat2m-e3-03': `${CDN_BASE}p03_tabla_esports.png`,
};

async function main() {
  console.log('=== APLICANDO MIGRACIÓN 052 VIA API (FASE 2.2) ===');

  const jsonData = JSON.parse(fs.readFileSync('scripts/data/mat2m_e3_preguntas_reales_34.json', 'utf8'));
  let updated = 0;
  let errors = 0;

  for (const p of jsonData.preguntas) {
    const imgUrl = EXISTING_IMAGES[p.id] || null;

    const { error } = await sb
      .from('preguntas')
      .update({
        enunciado: p.enunciado,
        alternativas: p.alternativas,
        respuesta_correcta: p.respuesta_correcta,
        eje_tematico_id: p.eje_tematico_id,
        habilidad_id: p.habilidad_id,
        dificultad: p.dificultad,
        puntaje: 1,
        imagen_url: imgUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', p.id);

    if (error) {
      console.error(`❌ Error en ${p.id}:`, error.message);
      errors++;
    } else {
      console.log(`  ✅ ${p.id} (clave: ${p.respuesta_correcta})`);
      updated++;
    }
  }

  // Actualizar metadatos de la evaluación
  const { error: evErr } = await sb
    .from('evaluaciones')
    .update({
      descripcion: 'Ensayo 3 SIMCE Matemática 2° Medio (Umáximo). 34 preguntas de selección múltiple: Números y Operaciones, Álgebra, Geometría, Medición y Probabilidad y Estadística.',
      descripcion_catalogo: 'Ensayo de práctica SIMCE Matemática 2° Medio con 34 ítems de selección múltiple.',
      total_preguntas: 34,
      updated_at: new Date().toISOString()
    })
    .eq('id', 'eval-simce-mat-2m-e3');

  if (evErr) {
    console.error('❌ Error actualizando evaluación:', evErr.message);
    errors++;
  } else {
    console.log('\n✅ Metadatos de evaluación actualizados (34 preguntas)');
  }

  // Eliminar la pregunta 35 inventada
  const { error: delErr } = await sb
    .from('preguntas')
    .delete()
    .eq('id', 'preg-mat2m-e3-35');

  if (delErr) {
    console.error('❌ Error eliminando preg-mat2m-e3-35:', delErr.message);
    errors++;
  } else {
    console.log('✅ preg-mat2m-e3-35 eliminada (no existía en la fuente)');
  }

  console.log(`\n=== RESULTADO: ${updated} preguntas actualizadas, ${errors} errores ===`);
}

main();
