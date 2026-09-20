import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error(`.env.local no encontrado en ${envPath}`);
  }
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i > 0) {
      const k = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      process.env[k] = v;
    }
  }
}
loadEnv();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const STORAGE_BASE = 'https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/simce_mat_2m_e3';
const PUNTAJE = 2; // Decisión D2: 2 pts por pregunta -> 68 pts total

async function main() {
  console.log('🚀 FASE 2 — Reconstrucción Mat 2° Medio Ensayo 3 desde fuente\n');

  const jsonPath = path.resolve(__dirname, 'data/mat2m_e3_preguntas_reales_34.json');
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  const { data: { users }, error: uErr } = await supabase.auth.admin.listUsers();
  if (uErr) {
    console.warn('⚠️ No se pudo listar usuarios admin:', uErr.message);
  }
  const admin = users?.find(u => u.email === 'leontestvirtual1@gmail.com') || users?.[0];
  const adminId = admin?.id || '99cf9f8f-720f-4e74-b8d9-eae95208b421';

  console.log(`Admin ID: ${adminId}`);
  console.log(`Dataset fuente: ${raw.preguntas.length} preguntas cargadas desde JSON\n`);

  // PASO 1: Eliminar preg-mat2m-e3-35 (inventada, no está en solucionario)
  console.log('PASO 1: Eliminando preg-mat2m-e3-35 (pregunta inventada)...');
  const { error: delErr } = await supabase.from('preguntas').delete().eq('id', 'preg-mat2m-e3-35');
  if (delErr) {
    console.warn('  ⚠️ Error al borrar P35:', delErr.message);
  } else {
    console.log('  ✅ preg-mat2m-e3-35 eliminada de Supabase.\n');
  }

  // PASO 2: Upsert de las 34 preguntas reales
  console.log('PASO 2: Upsert de 34 preguntas reales con puntaje 2...');
  const preguntas = [];
  for (const p of raw.preguntas) {
    const imgUrl = p.figura ? `${STORAGE_BASE}/${p.figura}` : null;

    // D1: P26 adaptada - marcar fuente
    const fuente = p.numero === 26
      ? 'Ensayo 3 SIMCE Matemática 2° Medio — Umáximo (adaptada: escalas 1:64/1:43)'
      : 'Ensayo 3 SIMCE Matemática 2° Medio — Umáximo';

    preguntas.push({
      id: p.id,
      propietario_id: adminId,
      asignatura_id: 'asig-1', // Matemática
      eje_tematico_id: p.eje_tematico_id,
      habilidad_id: p.habilidad_id,
      tipo: 'seleccion_multiple',
      nivel: '2° Medio',
      dificultad: p.dificultad,
      imagen_url: imgUrl,
      enunciado: p.enunciado,
      alternativas: p.alternativas,
      respuesta_correcta: p.respuesta_correcta,
      puntaje: PUNTAJE,
      fuente,
      updated_at: new Date().toISOString(),
    });
  }

  let ok = 0, err = 0;
  for (let i = 0; i < preguntas.length; i += 10) {
    const batch = preguntas.slice(i, i + 10);
    const { error } = await supabase.from('preguntas').upsert(batch, { onConflict: 'id' });
    if (error) {
      console.error(`  ❌ Lote ${i + 1}-${i + batch.length}: ${error.message}`);
      err += batch.length;
    } else {
      console.log(`  ✅ Lote ${i + 1}-${i + batch.length} guardado.`);
      ok += batch.length;
    }
  }
  console.log(`\n  Resultado preguntas: ${ok} OK / ${err} errores\n`);
  if (err > 0) {
    throw new Error('Hubo errores al insertar preguntas en Supabase.');
  }

  // PASO 3: Actualizar evaluación en catálogo
  console.log('PASO 3: Actualizando evaluación en catálogo...');
  const { error: evErr } = await supabase.from('evaluaciones').update({
    titulo: 'Ensayo 3 SIMCE Matemática 2° Medio',
    descripcion: 'Instrumento Ensayo 3 SIMCE Matemática de 2° Medio (Umáximo). 34 preguntas verificadas contra el solucionario oficial. Cubre Números, Álgebra, Geometría y Probabilidad.',
    total_preguntas: 34,
    estado: 'activa',
    es_catalogo: true,
    verificada_at: new Date().toISOString(),
    verificada_por: adminId,
    updated_at: new Date().toISOString(),
  }).eq('id', 'eval-simce-mat-2m-e3');

  if (evErr) {
    console.error('  ❌ Error actualizando evaluación:', evErr.message);
    throw evErr;
  } else {
    console.log('  ✅ Evaluación eval-simce-mat-2m-e3 actualizada (total_preguntas: 34, activa, es_catalogo: true).\n');
  }

  // PASO 4: Verificación final
  console.log('PASO 4: Verificación de integridad en base de datos...');
  const { data: dbPregs, error: fetchErr } = await supabase
    .from('preguntas')
    .select('id,respuesta_correcta,puntaje')
    .like('id', 'preg-mat2m-e3-%')
    .order('id');

  if (fetchErr) {
    console.error('  ❌ Error al leer preguntas:', fetchErr.message);
    return;
  }

  const dist = { A: 0, B: 0, C: 0, D: 0 };
  let puntajeTotal = 0;
  for (const p of dbPregs) {
    dist[p.respuesta_correcta] = (dist[p.respuesta_correcta] || 0) + 1;
    puntajeTotal += (p.puntaje || 0);
  }

  console.log(`  Total preguntas en DB: ${dbPregs.length}`);
  console.log(`  Distribución de claves: A=${dist.A} B=${dist.B} C=${dist.C} D=${dist.D}`);
  console.log(`  Puntaje total acumulado: ${puntajeTotal} pts`);

  const maxCount = Math.max(...Object.values(dist));
  const maxPct = (maxCount / dbPregs.length) * 100;
  if (maxPct > 45) {
    console.warn(`  ⚠️ Una clave supera el 45% (${maxPct.toFixed(1)}%)`);
  } else {
    console.log(`  ✅ Distribución balanceada (máxima clave: ${maxPct.toFixed(1)}%)`);
  }

  const extra35 = dbPregs.find(p => p.id === 'preg-mat2m-e3-35');
  if (extra35) {
    console.warn('  ⚠️ preg-mat2m-e3-35 aún existe en la BD!');
  } else {
    console.log('  ✅ preg-mat2m-e3-35 confirmada eliminada.');
  }

  console.log('\n🎉 FASE 2 completada exitosamente.');
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
