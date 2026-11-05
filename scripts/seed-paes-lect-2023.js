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

// Storage Base URL
const STORAGE_BASE = 'https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_lectora_2023_forma103';

// Mapeo de inicio de lecturas
const lecturaInicio = {
  1: 1,   // Lectura 1: Q1 a Q7
  2: 8,   // Lectura 2: Q8 a Q16
  3: 17,  // Lectura 3: Q17 a Q23
  4: 24,  // Lectura 4: Q24 a Q32
  5: 33,  // Lectura 5: Q33 a Q40
  6: 41,  // Lectura 6: Q41 a Q49
  7: 50,  // Lectura 7: Q50 a Q58
  8: 59   // Lectura 8: Q59 a Q65
};

async function main() {
  console.log('🚀 Actualizando preguntas de PAES Lectora 2023 con formato limpio (sin repetición innecesaria y con imágenes)...');

  // Obtener admin ID
  const { data: users } = await supabase.auth.admin.listUsers();
  const admin = users?.users?.find(u => u.email === 'leontestvirtual1@gmail.com') || users?.users?.[0];
  const adminId = admin?.id;

  // Cargar lecturas y preguntas
  const parsedData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../scratch/paes_lectora_2023_parsed.json'), 'utf8'));
  const lecturasMap = {};
  parsedData.lecturas.forEach(l => {
    lecturasMap[l.numero] = l.texto;
  });

  const updates = [];

  for (const p of parsedData.preguntas) {
    const qNum = p.numero;
    const numStr = String(qNum).padStart(2, '0');
    const id = `preg-paes-lec-23-${numStr}`;
    const clave = clavesDemre[qNum];
    const esInicioLectura = (lecturaInicio[p.lectura_num] === qNum);

    // 1. Imagen según pregunta
    let imgUrl = null;
    if (qNum === 1 || qNum === 3) {
      imgUrl = `${STORAGE_BASE}/figura_p04_guias_alimentarias_minsal.png`;
    } else if (qNum >= 8 && qNum <= 11) {
      imgUrl = `${STORAGE_BASE}/figura_lectura2_timeline_fotografia.png`;
    } else if (qNum === 12) {
      imgUrl = `${STORAGE_BASE}/figura_p13_q12_cinematografia_movimiento.png`;
    } else if (qNum === 24) {
      imgUrl = `${STORAGE_BASE}/figura_p22_ilustracion_lectura4.png`;
    } else if (qNum === 33) {
      imgUrl = `${STORAGE_BASE}/figura_p26_almacigos_lectura5.png`;
    } else if (qNum === 34) {
      imgUrl = `${STORAGE_BASE}/figura_p27_trasplante_lectura5.png`;
    } else if (qNum === 59) {
      imgUrl = `${STORAGE_BASE}/figura_p42_ilustracion_lectura8.png`;
    }

    // 2. Construcción del Enunciado:
    // - Si es la PRIMERA pregunta de la lectura (Q1, Q8, Q17, Q24, Q33, Q41, Q50, Q59):
    //   Lleva el encabezado y el texto completo de la lectura, seguido de la pregunta.
    // - Si es una pregunta subsiguiente (Q2, Q3, etc.):
    //   Solo lleva el indicador de continuación y la pregunta en negrita para NO repetir el párrafo largo.
    let enunciado;
    if (esInicioLectura) {
      const textoLectura = lecturasMap[p.lectura_num] || '';
      const rango = parsedData.lecturas.find(l => l.numero === p.lectura_num)?.preguntas_rango || '';
      enunciado = `### LECTURA ${p.lectura_num} (Preguntas ${rango})\n\n${textoLectura}\n\n---\n\n**${qNum}. ${p.enunciado}**`;
    } else {
      enunciado = `Lectura ${p.lectura_num} (Continuación):\n\n**${qNum}. ${p.enunciado}**`;
    }

    // 3. Alternativas limpias con clave oficial
    const alternativas = p.alternativas.map(alt => ({
      letra: alt.letra,
      texto: alt.texto,
      es_correcta: alt.letra === clave
    }));

    // 4. Eje y Habilidad
    const ejeId = (p.lectura_num === 3 || p.lectura_num === 7) ? 'eje-lec-2' : 'eje-lec-1';
    const enuncLower = p.enunciado.toLowerCase();
    let habId = 'hab-lec-2';
    if (enuncLower.includes('se afirma') || enuncLower.includes('de acuerdo con') || enuncLower.includes('según el') || enuncLower.includes('en el texto se') || enuncLower.includes('cuál de los siguientes')) {
      habId = 'hab-lec-1';
    } else if (enuncLower.includes('función') || enuncLower.includes('propósito') || enuncLower.includes('tono') || enuncLower.includes('calificar') || enuncLower.includes('credibilidad') || enuncLower.includes('con qué objetivo') || enuncLower.includes('se concluye')) {
      habId = 'hab-lec-3';
    }

    updates.push({
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
      fuente: 'PAES Oficial Competencia Lectora 2023 (Forma 103)',
      updated_at: new Date().toISOString()
    });
  }

  console.log(`📦 Actualizando ${updates.length} preguntas en Supabase...`);
  for (let i = 0; i < updates.length; i += 15) {
    const batch = updates.slice(i, i + 15);
    const { error } = await supabase.from('preguntas').upsert(batch, { onConflict: 'id' });
    if (error) {
      console.error(`  ❌ Error en lote ${i/15 + 1}:`, error.message);
    } else {
      console.log(`  ✅ Lote ${i/15 + 1} actualizado (${Math.min(i + 15, updates.length)}/${updates.length})`);
    }
  }

  console.log('\n🎉 ¡Preguntas de PAES Lectora 2023 actualizadas con éxito!');
  console.log('• Pregunta 1 ahora contiene la Lectura 1 completa Y la fotografía oficial de las Guías Alimentarias del MINSAL.');
  console.log('• Pregunta 3 también contiene la fotografía oficial vinculada para cotejo directo.');
  console.log('• Preguntas 2 a 7 ya NO repiten el párrafo gigante, mostrando "Lectura 1 (Continuación):" de forma limpia.');
}

main().catch(console.error);
