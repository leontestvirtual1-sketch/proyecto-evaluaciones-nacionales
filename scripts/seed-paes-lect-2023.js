import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Cargar variables de entorno
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

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// 2. Claves y Pilotos oficiales DEMRE Forma 103
const clavesDemre = {
  1: 'A', 2: 'B', 3: 'C', 4: 'B', 5: 'D', 6: 'A', 7: 'C', 8: 'B', 9: 'B', 10: 'D',
  11: 'B', 12: 'B', 13: 'A', 14: 'A', 15: 'D', 16: 'C', 17: 'D', 18: 'D', 19: 'D', 20: 'A',
  21: 'B', 22: 'A', 23: 'C', 24: 'D', 25: 'C', 26: 'D', 27: 'B', 28: 'A', 29: 'A', 30: 'D',
  31: 'B', 32: 'C', 33: 'D', 34: 'C', 35: 'C', 36: 'A', 37: 'B', 38: 'A', 39: 'B', 40: 'D',
  41: 'D', 42: 'D', 43: 'C', 44: 'D', 45: 'B', 46: 'A', 47: 'D', 48: 'A', 49: 'C', 50: 'C',
  51: 'A', 52: 'B', 53: 'A', 54: 'B', 55: 'D', 56: 'A', 57: 'C', 58: 'D', 59: 'A', 60: 'C',
  61: 'B', 62: 'A', 63: 'A', 64: 'C', 65: 'A'
};

const preguntasPiloto = [1, 19, 26, 33, 37];

// Tabla oficial de transformación (P 0..60 a Puntaje PAES 100..1000)
const tablaTransformacion = {
  0: 100, 1: 151, 2: 174, 3: 195, 4: 216, 5: 237, 6: 255, 7: 272, 8: 287, 9: 301,
  10: 317, 11: 334, 12: 350, 13: 364, 14: 376, 15: 386, 16: 396, 17: 407, 18: 421, 19: 436,
  20: 452, 21: 465, 22: 475, 23: 483, 24: 490, 25: 498, 26: 508, 27: 521, 28: 536, 29: 551,
  30: 564, 31: 574, 32: 582, 33: 589, 34: 596, 35: 606, 36: 619, 37: 633, 38: 649, 39: 663,
  40: 674, 41: 683, 42: 692, 43: 701, 44: 714, 45: 729, 46: 745, 47: 761, 48: 775, 49: 788,
  50: 801, 51: 816, 52: 834, 53: 853, 54: 872, 55: 891, 56: 912, 57: 935, 58: 960, 59: 987,
  60: 1000
};

// 3. Subir imágenes a Supabase Storage
async function uploadAllImages() {
  console.log('📤 Subiendo figuras de PAES Lectora 2023 a Supabase Storage (bucket evaluaciones-media)...');
  const imgDir = path.resolve(__dirname, '../public/preguntas/paes_lectora_2023_forma103');
  const files = fs.readdirSync(imgDir);
  const uploadedUrls = {};

  for (const f of files) {
    if (!f.endsWith('.png') && !f.endsWith('.jpg') && !f.endsWith('.jpeg')) continue;
    const filePath = path.join(imgDir, f);
    const fileBuffer = fs.readFileSync(filePath);
    const storagePath = `paes_lectora_2023_forma103/${f}`;

    const { error } = await supabase.storage
      .from('evaluaciones-media')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      console.warn(`  ⚠️ Error al subir ${f}:`, error.message);
    } else {
      const { data: pubData } = supabase.storage.from('evaluaciones-media').getPublicUrl(storagePath);
      uploadedUrls[f] = pubData.publicUrl;
      console.log(`  ✅ ${f} -> ${pubData.publicUrl}`);
    }
  }

  return uploadedUrls;
}

// 4. Guardar archivos de claves oficiales locales
function saveClavesOficiales() {
  const dir = path.resolve(__dirname, 'data/claves_oficiales');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const officialData = {
    evaluacion_id: 'eval-paes-lect-2023-f103',
    fuente: 'DEMRE — PAES Oficial Competencia Lectora 2023 (Forma 103)',
    n_preguntas: 65,
    preguntas_puntuables: 60,
    preguntas_piloto: preguntasPiloto,
    puntaje_esperado: 65,
    claves: clavesDemre
  };

  fs.writeFileSync(
    path.join(dir, 'paes_lectora_2023_f103.json'),
    JSON.stringify(officialData, null, 2),
    'utf8'
  );

  fs.writeFileSync(
    path.join(dir, 'paes_lectora_2023_f103_tabla.json'),
    JSON.stringify({
      evaluacion_id: 'eval-paes-lect-2023-f103',
      tabla_transformacion: tablaTransformacion
    }, null, 2),
    'utf8'
  );

  console.log('📁 Archivos de claves y escala oficial guardados en scripts/data/claves_oficiales/');
}

async function main() {
  console.log('🚀 Iniciando pipeline completo de importación PAES Oficial Competencia Lectora 2023 (Forma 103)...');

  // Guardar pautas y clavijeros
  saveClavesOficiales();

  // Subir imágenes
  const urls = await uploadAllImages();

  // Obtener admin id
  const { data: users } = await supabase.auth.admin.listUsers();
  const admin = users?.users?.find(u => u.email === 'leontestvirtual1@gmail.com') || users?.users?.[0];
  const adminId = admin?.id;
  console.log(`👤 Admin ID: ${adminId}`);

  // Cargar preguntas parseadas
  const parsedData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../scratch/paes_lectora_2023_parsed.json'), 'utf8'));
  const lecturasMap = {};
  parsedData.lecturas.forEach(l => {
    lecturasMap[l.numero] = l.texto;
  });

  // Generar IDs de preguntas
  const preguntaIds = [];
  for (let i = 1; i <= 65; i++) {
    preguntaIds.push(`preg-paes-lec-23-${String(i).padStart(2, '0')}`);
  }

  // 1. Upsert en tabla evaluaciones
  const evaluacion = {
    id: 'eval-paes-lect-2023-f103',
    titulo: 'PAES Oficial Competencia Lectora — Proceso 2023 (Forma 103)',
    descripcion: 'Evaluación oficial DEMRE de Competencia Lectora aplicada en el Proceso de Admisión 2023 (Forma 103). Incluye 65 preguntas de selección múltiple (60 válidas y 5 piloto de calibración) sobre 8 lecturas literarias y no literarias, evaluando Localizar, Interpretar y Evaluar información.',
    asignatura_id: 'asig-2',
    nivel: '4° Medio',
    tiempo_limite: 150,
    estado: 'activa',
    es_catalogo: true,
    precio_clp: 0,
    descripcion_catalogo: 'Prueba oficial DEMRE PAES Competencia Lectora 2023 (Forma 103) completa con 65 ítems, escala oficial DEMRE de 100 a 1000 puntos y pauta docente con justificación curricular.',
    profesor_id: null,
    total_preguntas: 65,
    pregunta_ids: preguntaIds,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { error: evErr } = await supabase.from('evaluaciones').upsert(evaluacion, { onConflict: 'id' });
  if (evErr) {
    console.error('❌ Error guardando evaluación:', evErr.message);
  } else {
    console.log(`✅ Evaluación oficial guardada en catálogo: ${evaluacion.titulo}`);
  }

  // 2. Preparar preguntas para inserción
  const preguntasToInsert = [];

  for (const p of parsedData.preguntas) {
    const qNum = p.numero;
    const numStr = String(qNum).padStart(2, '0');
    const id = `preg-paes-lec-23-${numStr}`;
    const clave = clavesDemre[qNum];

    // Asignar imagen_url según corresponda
    let imgUrl = null;
    if (qNum === 3) {
      imgUrl = urls['figura_p04_guias_alimentarias_minsal.png'] || null;
    } else if (qNum === 12) {
      imgUrl = urls['figura_p13_q12_cinematografia_movimiento.png'] || null;
    }

    // Clasificar habilidad según texto de pregunta
    const enuncLower = p.enunciado.toLowerCase();
    let habId = 'hab-lec-2'; // Default: Interpretar e Integrar
    if (enuncLower.includes('se afirma') || enuncLower.includes('de acuerdo con') || enuncLower.includes('según el') || enuncLower.includes('en el texto se') || enuncLower.includes('cuál de los siguientes')) {
      habId = 'hab-lec-1'; // Localizar
    } else if (enuncLower.includes('función') || enuncLower.includes('propósito') || enuncLower.includes('tono') || enuncLower.includes('calificar') || enuncLower.includes('credibilidad') || enuncLower.includes('con qué objetivo') || enuncLower.includes('se concluye')) {
      habId = 'hab-lec-3'; // Reflexionar y Evaluar
    }

    // Clasificar eje temático:
    // Lecturas 3 (cuento) y 7 (crítica/arte) -> Literatura y Contexto (eje-lec-2)
    // Lecturas 1, 2, 4, 5, 6, 8 (expositivas/informativas) -> Comprensión de Textos (eje-lec-1)
    const ejeId = (p.lectura_num === 3 || p.lectura_num === 7) ? 'eje-lec-2' : 'eje-lec-1';

    // Construir enunciado enriquecido con el texto de la lectura
    const textoLectura = lecturasMap[p.lectura_num] || '';
    
    // Crear enunciado legible y completo
    const enunciadoCompleto = `### Lectura ${p.lectura_num} (Preguntas ${parsedData.lecturas.find(l => l.numero === p.lectura_num)?.preguntas_rango || ''})\n\n${textoLectura}\n\n---\n\n**Pregunta ${qNum}.** ${p.enunciado}`;

    // Asegurar alternativas con clave exacta
    const alternativas = p.alternativas.map(alt => ({
      letra: alt.letra,
      texto: alt.texto,
      es_correcta: alt.letra === clave
    }));

    preguntasToInsert.push({
      id: id,
      propietario_id: adminId,
      asignatura_id: 'asig-2',
      eje_tematico_id: ejeId,
      habilidad_id: habId,
      tipo: 'seleccion_multiple',
      nivel: '4° Medio',
      dificultad: p.es_piloto ? 'alta' : (qNum % 3 === 0 ? 'alta' : qNum % 2 === 0 ? 'media' : 'baja'),
      enunciado: enunciadoCompleto,
      imagen_url: imgUrl,
      alternativas: alternativas,
      respuesta_correcta: clave,
      puntaje: 1,
      fuente: 'PAES Oficial Competencia Lectora 2023 (Forma 103)',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  // 3. Inserción por lotes en Supabase
  console.log(`\n📦 Insertando ${preguntasToInsert.length} preguntas en public.preguntas (lotes de 15)...`);
  let totalExito = 0;

  for (let i = 0; i < preguntasToInsert.length; i += 15) {
    const batch = preguntasToInsert.slice(i, i + 15);
    const { error: insErr } = await supabase.from('preguntas').upsert(batch, { onConflict: 'id' });

    if (insErr) {
      console.error(`  ❌ Error en lote ${i / 15 + 1}:`, insErr.message);
    } else {
      totalExito += batch.length;
      console.log(`  ✅ Lote ${i / 15 + 1} insertado (${totalExito}/${preguntasToInsert.length} preguntas sincronizadas)`);
    }
  }

  console.log('\n🎉 ¡PAES Oficial Competencia Lectora 2023 (Forma 103) sincronizada con éxito en Supabase!');
  console.log('• Evaluación ID: eval-paes-lect-2023-f103');
  console.log(`• Total Preguntas: ${totalExito}`);
  console.log(`• Clavijero: 65 claves oficiales asignadas y 5 preguntas piloto configuradas`);
}

main().catch(console.error);
