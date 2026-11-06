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

// 2. Claves y Pilotos oficiales DEMRE Forma 103 (Proceso 2024)
const clavesDemre = {
  1: 'C', 2: 'D', 3: 'A', 4: 'D', 5: 'C', 6: 'B', 7: 'B', 8: 'D', 9: 'C', 10: 'A',
  11: 'B', 12: 'A', 13: 'B', 14: 'B', 15: 'A', 16: 'D', 17: 'A', 18: 'D', 19: 'D', 20: 'B',
  21: 'A', 22: 'C', 23: 'A', 24: 'C', 25: 'D', 26: 'C', 27: 'D', 28: 'C', 29: 'A', 30: 'A',
  31: 'C', 32: 'C', 33: 'B', 34: 'C', 35: 'D', 36: 'D', 37: 'B', 38: 'C', 39: 'B', 40: 'A',
  41: 'B', 42: 'B', 43: 'A', 44: 'C', 45: 'D', 46: 'C', 47: 'C', 48: 'A', 49: 'B', 50: 'A',
  51: 'B', 52: 'C', 53: 'A', 54: 'C', 55: 'B', 56: 'D', 57: 'B', 58: 'D', 59: 'B', 60: 'A',
  61: 'D', 62: 'C', 63: 'C', 64: 'D', 65: 'C'
};

const preguntasPiloto = [1, 15, 37, 46, 63];

// 3. Storage
const BUCKET = 'evaluaciones-media';
const FOLDER = 'paes_lectora_2024_forma103';
const STORAGE_BASE = `${env.VITE_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${FOLDER}`;
const LOCAL_IMG_DIR = path.resolve(__dirname, `../public/preguntas/${FOLDER}`);

// 4. Mapeo de inicio de cada lectura en 2024
const lecturaInicio = {
  1: 1,   // Lectura 1: Q1 a Q7
  2: 8,   // Lectura 2: Q8 a Q16
  3: 17,  // Lectura 3: Q17 a Q24
  4: 25,  // Lectura 4: Q25 a Q32
  5: 33,  // Lectura 5: Q33 a Q39
  6: 40,  // Lectura 6: Q40 a Q47
  7: 48,  // Lectura 7: Q48 a Q57
  8: 58   // Lectura 8: Q58 a Q65
};

async function uploadImages() {
  console.log(`\n📤 Subiendo imágenes a Supabase Storage: ${BUCKET}/${FOLDER}...`);
  if (!fs.existsSync(LOCAL_IMG_DIR)) {
    console.warn(`  ⚠️ Directorio ${LOCAL_IMG_DIR} no encontrado.`);
    return;
  }
  const files = fs.readdirSync(LOCAL_IMG_DIR).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));
  for (const fname of files) {
    const fpath = path.join(LOCAL_IMG_DIR, fname);
    const buf = fs.readFileSync(fpath);
    const { error } = await supabase.storage.from(BUCKET).upload(`${FOLDER}/${fname}`, buf, {
      contentType: 'image/png',
      upsert: true
    });
    if (error) {
      console.error(`  ❌ Error subiendo ${fname}:`, error.message);
    } else {
      console.log(`  ✅ ${fname}`);
    }
  }
}

async function main() {
  console.log('🚀 Iniciando Ingesta Oficial de PAES Competencia Lectora 2024 (Forma 103)...');

  await uploadImages();

  // Obtener admin ID
  const { data: users } = await supabase.auth.admin.listUsers();
  const admin = users?.users?.find(u => u.email === 'leontestvirtual1@gmail.com') || users?.users?.[0];
  const adminId = admin?.id || '99cf9f8f-720f-4e74-b8d9-eae95208b421';

  // Cargar lecturas y preguntas parseadas
  const parsedPath = path.resolve(__dirname, '../scratch/paes_lectora_2024_parsed.json');
  const parsedData = JSON.parse(fs.readFileSync(parsedPath, 'utf8'));

  const lecturasMap = {};
  const lecturasRangoMap = {};
  parsedData.lecturas.forEach(l => {
    lecturasMap[l.numero] = l.texto;
    lecturasRangoMap[l.numero] = l.preguntas_rango ? `${l.preguntas_rango[0]} a ${l.preguntas_rango[1]}` : '';
  });

  const inserts = [];
  const preguntaIds = [];

  for (const p of parsedData.preguntas) {
    const qNum = p.numero;
    const numStr = String(qNum).padStart(2, '0');
    const id = `preg-paes-lec-24-${numStr}`;
    preguntaIds.push(id);

    const clave = clavesDemre[qNum];
    const esInicioLectura = (lecturaInicio[p.lectura_num] === qNum);

    // 1. Imagen directa de pregunta (si la pregunta consulta por un gráfico)
    let imgUrl = null;
    if (qNum === 16) {
      imgUrl = `${STORAGE_BASE}/figura_p16_pregunta_grafico.png`;
    } else if (qNum === 34) {
      imgUrl = `${STORAGE_BASE}/figura_p34_pregunta_flamencos.png`;
    }

    // 2. Construcción limpia del Enunciado:
    // - Si es la PRIMERA pregunta de la lectura: Lleva encabezado, texto completo y fotos inline.
    // - Si es una pregunta subsiguiente: Solo lleva "Lectura X (Continuación):" y la pregunta en negrita.
    let enunciado;
    if (esInicioLectura) {
      const textoLectura = lecturasMap[p.lectura_num] || '';
      const rango = lecturasRangoMap[p.lectura_num] || '';
      enunciado = `### LECTURA ${p.lectura_num} (Preguntas ${rango})\n\n${textoLectura}\n\n---\n\n**${qNum}. ${p.enunciado_pregunta}**`;
    } else {
      enunciado = `Lectura ${p.lectura_num} (Continuación):\n\n**${qNum}. ${p.enunciado_pregunta}**`;
    }

    // 3. Alternativas limpias con clave oficial
    const alternativas = p.alternativas.map(alt => ({
      letra: alt.letra,
      texto: alt.texto,
      es_correcta: alt.letra === clave
    }));

    // 4. Eje y Habilidad
    const ejeId = (p.lectura_num === 3) ? 'eje-lec-2' : 'eje-lec-1';
    const enuncLower = p.enunciado_pregunta.toLowerCase();
    let habId = 'hab-lec-2';
    if (enuncLower.includes('se afirma') || enuncLower.includes('de acuerdo con') || enuncLower.includes('según el') || enuncLower.includes('en el texto se') || enuncLower.includes('cuál de los siguientes')) {
      habId = 'hab-lec-1';
    } else if (enuncLower.includes('función') || enuncLower.includes('propósito') || enuncLower.includes('tono') || enuncLower.includes('calificar') || enuncLower.includes('perspectiva') || enuncLower.includes('con qué objetivo') || enuncLower.includes('se concluye')) {
      habId = 'hab-lec-3';
    }

    inserts.push({
      id,
      propietario_id: adminId,
      asignatura_id: 'asig-2',
      eje_tematico_id: ejeId,
      habilidad_id: habId,
      tipo: 'seleccion_multiple',
      nivel: '4° Medio',
      dificultad: p.es_piloto ? 'alta' : (qNum % 3 === 0 ? 'alta' : qNum % 2 === 0 ? 'media' : 'baja'),
      enunciado,
      imagen_url: imgUrl,
      alternativas,
      respuesta_correcta: clave,
      puntaje: 1,
      fuente: 'PAES Oficial Competencia Lectora 2024 (Forma 103)',
      updated_at: new Date().toISOString()
    });
  }

  console.log(`\n📦 Insertando/Actualizando ${inserts.length} preguntas en public.preguntas...`);
  for (let i = 0; i < inserts.length; i += 15) {
    const batch = inserts.slice(i, i + 15);
    const { error } = await supabase.from('preguntas').upsert(batch, { onConflict: 'id' });
    if (error) {
      console.error(`  ❌ Error en lote ${Math.floor(i/15) + 1}:`, error.message);
    } else {
      console.log(`  ✅ Lote ${Math.floor(i/15) + 1} procesado (${Math.min(i + 15, inserts.length)}/${inserts.length})`);
    }
  }

  // 5. Crear la Evaluación Oficial en public.evaluaciones
  console.log('\n📝 Creando evaluación oficial en public.evaluaciones...');
  const evalId = 'eval-paes-lect-2024-f103';
  const evalData = {
    id: evalId,
    titulo: 'PAES Oficial Competencia Lectora — Proceso 2024 (Forma 103)',
    descripcion: 'Facsímil liberado oficial DEMRE con 65 preguntas calibradas, 8 lecturas estructuradas, claves DEMRE verificadas y soporte visual en alta definición.',
    asignatura_id: 'asig-2',
    asignatura_nombre: 'Lenguaje y Comunicación',
    nivel: '4° Medio',
    profesor_id: adminId,
    estado: 'activa',
    tiempo_limite: 150,
    pregunta_ids: preguntaIds,
    total_preguntas: 65,
    es_catalogo: true,
    precio_clp: 0,
    descripcion_catalogo: 'Evaluación oficial nacional liberada por el DEMRE correspondiente al Proceso de Admisión 2024.',
    updated_at: new Date().toISOString()
  };

  const { error: evalError } = await supabase.from('evaluaciones').upsert(evalData, { onConflict: 'id' });
  if (evalError) {
    console.error('  ❌ Error registrando evaluación:', evalError.message);
  } else {
    console.log(`  ✅ Evaluación ${evalId} registrada y publicada con éxito.`);
  }

  console.log('\n🎉 ¡Ingesta de PAES Competencia Lectora 2024 finalizada con éxito!');
}

main().catch(console.error);
