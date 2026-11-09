import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const envText = readFileSync(path.join(root, '.env.local'), 'utf8');
const env = {};
for (const line of envText.split('\n')) {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
}

const sb = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function run() {
  const evalId = 'eval-paes-lect-2023-f103';
  console.log(`📡 Consultando evaluación ${evalId}...`);
  
  const { data: evaluacion, error: errEval } = await sb
    .from('evaluaciones')
    .select('*')
    .eq('id', evalId)
    .maybeSingle();

  if (errEval) {
    console.error('Error al obtener evaluación:', errEval);
    process.exit(1);
  }

  if (!evaluacion) {
    console.error(`Evaluación ${evalId} no encontrada.`);
    process.exit(1);
  }

  console.log('Evaluación encontrada:', evaluacion.titulo);
  console.log('Total pregunta_ids:', evaluacion.pregunta_ids?.length);

  const ids = evaluacion.pregunta_ids || [];
  let allPreguntas = [];

  for (let i = 0; i < ids.length; i += 25) {
    const batch = ids.slice(i, i + 25);
    const { data, error } = await sb
      .from('preguntas')
      .select('id, enunciado, alternativas, respuesta_correcta, puntaje, imagen_url, fuente, tipo, eje_tematico_id, habilidad_id, dificultad, nivel')
      .in('id', batch);

    if (error) {
      console.error('Error obteniendo lote de preguntas:', error);
      process.exit(1);
    }
    allPreguntas = allPreguntas.concat(data || []);
  }

  const byId = new Map(allPreguntas.map(p => [p.id, p]));
  const ordered = ids.map((pid, idx) => {
    const p = byId.get(pid);
    if (!p) {
      return { posicion_evaluacion: idx + 1, id: pid, missing: true };
    }
    return {
      posicion_evaluacion: idx + 1,
      id: p.id,
      numero: p.numero ?? (idx + 1),
      enunciado: p.enunciado,
      alternativas: p.alternativas,
      respuesta_correcta: p.respuesta_correcta,
      imagen_url: p.imagen_url,
      puntaje: p.puntaje,
      fuente: p.fuente,
      tipo: p.tipo,
      eje_tematico_id: p.eje_tematico_id,
      habilidad_id: p.habilidad_id,
      dificultad: p.dificultad,
      nivel: p.nivel
    };
  });

  const snapshot = {
    metadata: {
      fecha_export: new Date().toISOString(),
      evaluacion_id: evaluacion.id,
      evaluacion_titulo: evaluacion.titulo,
      total_preguntas_evaluacion: evaluacion.total_preguntas,
      pregunta_ids_count: ids.length,
      preguntas_encontradas: allPreguntas.length,
      missing_count: ordered.filter(x => x.missing).length
    },
    preguntas: ordered
  };

  const outDir = path.join(root, 'scripts', 'data', 'auditoria_lectora_2023');
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'snapshot_paes_lectora_2023_forma103.json');
  writeFileSync(outPath, JSON.stringify(snapshot, null, 2), 'utf8');

  console.log(`✅ Snapshot guardado exitosamente en: ${outPath}`);
  console.log(`Total preguntas conciliadas: ${allPreguntas.length}/${ids.length}`);
}

run().catch(console.error);
