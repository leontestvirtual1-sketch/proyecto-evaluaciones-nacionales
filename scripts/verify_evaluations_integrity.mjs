import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CLAVES_DIR = path.resolve('scripts/data/claves_oficiales');
const PUBLIC_DIR = path.resolve('public');

let totalChecks = 0;
let totalErrors = 0;
let totalWarnings = 0;

function reportPass(msg) {
  totalChecks++;
  console.log(`  ✅ PASS: ${msg}`);
}

function reportWarn(msg) {
  totalWarnings++;
  console.warn(`  ⚠️ WARN: ${msg}`);
}

function reportFail(msg) {
  totalChecks++;
  totalErrors++;
  console.error(`  ❌ FAIL: ${msg}`);
}

async function verifyPublicDirectory() {
  console.log('\n--- Verificación de Directorio public/ (Higiene de Archivos y Privacidad) ---');
  
  function scan(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else {
        if (entry.name.toLowerCase().endsWith('.pdf')) {
          reportFail(`Archivo PDF detectado en carpeta pública: ${fullPath}`);
        }
        if (/solucionario|pauta.*confidencial/i.test(entry.name)) {
          reportFail(`Archivo sospechoso de contener datos internos/personales en public: ${fullPath}`);
        }
      }
    }
  }

  scan(PUBLIC_DIR);
  if (totalErrors === 0) {
    reportPass('Directorio public/ limpio: cero PDFs ni solucionarios expuestos');
  }
}

async function verifyEvaluation(manifestPath) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  console.log(`\n--- Evaluando Integridad: ${manifest.evaluacion_id} (${manifest.fuente}) ---`);

  // 1. Obtener evaluación desde DB
  const { data: evalDb, error: evalErr } = await supabase
    .from('evaluaciones')
    .select('id, titulo, total_preguntas, es_catalogo, estado')
    .eq('id', manifest.evaluacion_id)
    .single();

  if (evalErr || !evalDb) {
    reportFail(`No se pudo encontrar la evaluación ${manifest.evaluacion_id} en la base de datos`);
    return;
  }

  // 2. Obtener preguntas
  const prefixMap = {
    'eval-simce-mat-2m-e3': 'preg-mat2m-e3-%',
    'eval-paes-lect-2026-f103': 'preg-paes-lec-26-%',
    'eval-simce-mat-6b-e3': 'preg-mat6b-e3-%'
  };

  const prefix = prefixMap[manifest.evaluacion_id];
  if (!prefix) {
    reportWarn(`Sin mapeo de prefijo para ${manifest.evaluacion_id}`);
    return;
  }

  const { data: pregs, error: pregErr } = await supabase
    .from('preguntas')
    .select('id, enunciado, alternativas, respuesta_correcta, puntaje')
    .like('id', prefix)
    .order('id', { ascending: true });

  if (pregErr || !pregs) {
    reportFail(`Error recuperando preguntas para ${manifest.evaluacion_id}: ${pregErr?.message}`);
    return;
  }

  // Conteo
  if (pregs.length === manifest.n_preguntas) {
    reportPass(`Total de preguntas coincide exactamente: ${pregs.length} / ${manifest.n_preguntas}`);
  } else {
    reportFail(`Total de preguntas discrepante: ${pregs.length} en DB vs ${manifest.n_preguntas} esperado`);
  }

  // Claves y coherencia de alternativas
  let clavesCoincidentes = 0;
  const distClaves = {};
  let sumaPuntajes = 0;

  pregs.forEach((p, idx) => {
    const qNum = idx + 1;
    const claveEsperada = manifest.claves[qNum] || manifest.claves[String(qNum)];
    sumaPuntajes += Number(p.puntaje || 0);

    // Conteo de distribución
    const claveReal = p.respuesta_correcta;
    distClaves[claveReal] = (distClaves[claveReal] || 0) + 1;

    // Verificar alternativas
    if (!Array.isArray(p.alternativas) || p.alternativas.length < 4) {
      reportFail(`Pregunta ${p.id} tiene menos de 4 alternativas`);
    } else {
      const correctas = p.alternativas.filter(a => a.es_correcta);
      if (correctas.length !== 1) {
        reportFail(`Pregunta ${p.id} tiene ${correctas.length} alternativas marcadas como es_correcta (debe ser 1)`);
      } else if (correctas[0].letra !== claveReal) {
        reportFail(`Pregunta ${p.id} tiene es_correcta en [${correctas[0].letra}] pero respuesta_correcta es [${claveReal}]`);
      }
    }

    // Coincidencia con clave oficial
    if (claveEsperada && claveReal === claveEsperada) {
      clavesCoincidentes++;
    } else if (claveEsperada) {
      reportFail(`Pregunta ${p.id} (Q${qNum}) clave DB '${claveReal}' no coincide con oficial '${claveEsperada}'`);
    }

    // Texto prohibido
    const textoCompleto = `${p.enunciado || ''} ${(p.alternativas || []).map(a => a.texto).join(' ')}`;
    if (/umaximo\.com/i.test(textoCompleto)) {
      reportFail(`Pregunta ${p.id} contiene marca de agua 'umaximo.com'`);
    }
    if (/[\uF000-\uF0FF]/.test(textoCompleto)) {
      reportFail(`Pregunta ${p.id} contiene caracteres corruptos PUA (Private Use Area)`);
    }
    if (/FORMA\s*101\s*[-–—]\s*2026/i.test(textoCompleto)) {
      reportFail(`Pregunta ${p.id} contiene pie de página sin limpiar 'FORMA 101 - 2026'`);
    }

    // Alternativas excesivamente largas
    (p.alternativas || []).forEach(a => {
      if ((a.texto || '').length > 300) {
        reportWarn(`Pregunta ${p.id} alternativa [${a.letra}] tiene longitud inusual (${a.texto.length} chars)`);
      }
    });
  });

  if (clavesCoincidentes === manifest.n_preguntas) {
    reportPass(`100% de las claves coinciden con el clavijero oficial (${clavesCoincidentes}/${manifest.n_preguntas})`);
  }

  // Verificar sesgo en distribución de claves
  const totalQ = pregs.length;
  console.log(`  📊 Distribución de claves: ${JSON.stringify(distClaves)}`);
  for (const [letra, count] of Object.entries(distClaves)) {
    const pct = (count / totalQ) * 100;
    if (totalQ >= 20 && pct > 60) {
      reportFail(`Sesgo crítico en letra '${letra}': ${count}/${totalQ} (${pct.toFixed(1)}% > 60% máximo permitido)`);
    } else if (totalQ >= 20 && pct > 45) {
      reportWarn(`Letra '${letra}' supera 45% de frecuencia (${pct.toFixed(1)}%)`);
    }
  }

  if (manifest.puntaje_esperado && sumaPuntajes === manifest.puntaje_esperado) {
    reportPass(`Suma de puntajes coincide: ${sumaPuntajes} pts`);
  } else if (manifest.puntaje_esperado) {
    reportWarn(`Suma de puntajes: ${sumaPuntajes} pts (esperado: ${manifest.puntaje_esperado})`);
  }
}

// 5.2 — Verificar que las imagen_url absolutas responden 200 (HEAD request)
async function verifyImageUrls(evaluacion_id: string): Promise<void>;
async function verifyImageUrls(evaluacion_id) {
  // Solo imágenes con URL absoluta (https://...)
  const { data: pregs, error } = await supabase
    .from('preguntas')
    .select('id, imagen_url')
    .like('imagen_url', 'https://%');

  if (error) {
    reportWarn(`Error al obtener imagen_url para ${evaluacion_id}: ${error.message}`);
    return;
  }

  let checked = 0;
  for (const p of (pregs || [])) {
    if (!p.imagen_url) continue;
    try {
      const resp = await fetch(p.imagen_url, { method: 'HEAD' });
      if (!resp.ok) {
        reportFail(`Imagen rota (HTTP ${resp.status}): ${p.id} → ${p.imagen_url}`);
      }
      checked++;
    } catch (e) {
      reportFail(`Imagen inaccesible (error de red): ${p.id} → ${p.imagen_url}`);
    }
  }
  if (checked > 0) reportPass(`${checked} imagen_url absolutas responden 200 OK`);
}

async function main() {
  console.log('🛡️  SYSGET SABER — Quality Gate de Integridad de Contenido (verify:content)');
  console.log('========================================================================');

  await verifyPublicDirectory();

  const manifestFiles = fs.readdirSync(CLAVES_DIR)
    .filter(f => f.endsWith('.json') && !f.includes('tabla'));

  for (const f of manifestFiles) {
    await verifyEvaluation(path.join(CLAVES_DIR, f));
  }

  console.log('\n--- Verificación de URLs de Imágenes (HEAD check) ---');
  await verifyImageUrls('all');


  console.log('\n========================================================================');
  console.log(`Resumen: ${totalChecks} verificaciones | ${totalErrors} errores | ${totalWarnings} advertencias`);

  if (totalErrors > 0) {
    console.error('\n❌ QUALITY GATE RECHAZADO: Se detectaron fallos críticos de integridad.');
    process.exit(1);
  } else {
    console.log('\n🎉 QUALITY GATE SUPERADO: Todo el contenido verificado es íntegro y fiel a la fuente.');
    process.exit(0);
  }
}

main();
