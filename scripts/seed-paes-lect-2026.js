import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx > -1) {
      const key = trimmed.substring(0, idx).trim();
      let val = trimmed.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

loadEnv();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

async function main() {
  console.log('🚀 Iniciando ingesta de PAES Competencia Lectora 2026 (65 preguntas)...');

  // 1. Obtener admin user id
  const { data: users } = await supabase.auth.admin.listUsers();
  const admin = users?.users?.find(u => u.email === 'leontestvirtual1@gmail.com') || users?.users?.[0];
  const adminId = admin?.id;
  console.log(`Admin ID: ${adminId}`);

  // 2. Crear evaluación en catálogo
  const evaluacion = {
    id: 'eval-paes-lect-2026-f103',
    titulo: 'PAES Oficial Competencia Lectora — Proceso 2026',
    descripcion: 'Evaluación oficial DEMRE de Competencia Lectora aplicada en el Proceso de Admisión 2026. Incluye 65 preguntas de selección múltiple (60 válidas y 5 piloto de calibración) sobre textos literarios, expositivos y argumentativos, evaluando Localizar, Interpretar y Evaluar información.',
    asignatura_id: 'asig-2',
    nivel: '4° Medio',
    tiempo_limite: 150,
    estado: 'activa',
    es_catalogo: true,
    precio_clp: 29990,
    descripcion_catalogo: 'Prueba oficial DEMRE PAES Competencia Lectora 2026 completa con 65 ítems, escala oficial DEMRE de 100 a 1000 puntos y pauta docente con justificación curricular.',
    profesor_id: null,
    total_preguntas: 65,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { error: evErr } = await supabase.from('evaluaciones').upsert(evaluacion, { onConflict: 'id' });
  if (evErr) {
    console.error('❌ Error insertando evaluación:', evErr.message);
  } else {
    console.log(`✅ Evaluación insertada: ${evaluacion.titulo}`);
  }

  // 3. Cargar y persistir preguntas
  const parsedData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../scratch/paes_lect_2026_final_65.json'), 'utf8'));

  const preguntas = [];

  for (const p of parsedData) {
    const num = String(p.numero).padStart(2, '0');

    preguntas.push({
      id: `preg-paes-lec-26-${num}`,
      propietario_id: adminId,
      asignatura_id: 'asig-2',
      eje_tematico_id: p.eje_id,
      habilidad_id: p.habilidad_id,
      tipo: 'seleccion_multiple',
      nivel: '4° Medio',
      dificultad: p.complejidad,
      imagen_url: null,
      enunciado: p.enunciado,
      alternativas: p.alternativas,
      respuesta_correcta: p.clave,
      puntaje: p.puntaje,
      fuente: 'PAES Oficial Competencia Lectora 2026',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  console.log(`\n📦 Insertando ${preguntas.length} preguntas en Supabase (lotes de 15)...`);
  let success = 0;
  for (let i = 0; i < preguntas.length; i += 15) {
    const batch = preguntas.slice(i, i + 15);
    const { error: pregErr } = await supabase.from('preguntas').upsert(batch, { onConflict: 'id' });
    if (pregErr) {
      console.error(`❌ Error en lote ${i + 1}-${i + batch.length}:`, pregErr.message);
    } else {
      console.log(`✅ Lote ${i + 1}-${i + batch.length} insertado.`);
      success += batch.length;
    }
  }

  console.log(`\n🎉 Ingesta exitosa: ${success}/${preguntas.length} preguntas de PAES Competencia Lectora 2026 persistidas en Supabase.`);
}

main();
