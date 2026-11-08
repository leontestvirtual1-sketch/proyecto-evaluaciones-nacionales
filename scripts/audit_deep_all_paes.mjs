import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => {
  const m = env.match(new RegExp(`^${k}=(.*)$`, 'm'));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null;
};

const supabase = createClient(getEnv('VITE_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));

async function deepAudit() {
  console.log("=================================================================");
  console.log("   AUDITORÍA PROFUNDA DE CALIDAD E INTEGRIDAD - PAES EN SUPABASE");
  console.log("=================================================================\n");

  // 1. Obtener todas las evaluaciones PAES
  const { data: evals, error: evalErr } = await supabase
    .from('evaluaciones')
    .select('id, titulo, asignatura_id, total_preguntas, pregunta_ids, codigo_acceso')
    .ilike('id', '%paes%')
    .order('id');

  if (evalErr) {
    console.error("Error al obtener evaluaciones:", evalErr);
    process.exit(1);
  }

  console.log(`Evaluaciones PAES registradas: ${evals.length}`);

  // 2. Obtener todas las preguntas referenciadas
  const allReferencedIds = new Set();
  const evalSummary = [];

  for (const e of evals) {
    const pids = e.pregunta_ids || [];
    pids.forEach(id => allReferencedIds.add(id));
    evalSummary.push({
      id: e.id,
      titulo: e.titulo,
      asignatura_id: e.asignatura_id,
      total_preguntas: e.total_preguntas,
      count_pids: pids.length,
      pids: pids,
      has_duplicates: new Set(pids).size !== pids.length,
    });
  }

  console.log(`Total IDs de preguntas únicos referenciados en evaluaciones PAES: ${allReferencedIds.size}`);

  // Cargar todas las preguntas de la BD (con paginación)
  const idArray = Array.from(allReferencedIds);
  const questionsMap = new Map();
  const BATCH_SIZE = 500;

  for (let i = 0; i < idArray.length; i += BATCH_SIZE) {
    const chunk = idArray.slice(i, i + BATCH_SIZE);
    const { data: qData, error: qErr } = await supabase
      .from('preguntas')
      .select('id, asignatura_id, enunciado, alternativas, respuesta_correcta, puntaje')
      .in('id', chunk);

    if (qErr) {
      console.error("Error cargando lote de preguntas:", qErr);
      process.exit(1);
    }

    qData.forEach(q => questionsMap.set(q.id, q));
  }

  console.log(`Preguntas encontradas en tabla 'preguntas': ${questionsMap.size}`);

  // 3. Revisión por Evaluación
  const issues = {
    evaluaciones_sin_preguntas: [],
    evaluaciones_mismatch_conteo: [],
    preguntas_inexistentes: [],
    preguntas_duplicadas_en_eval: [],
    preguntas_con_pua: [],
    preguntas_con_mojibake: [],
    preguntas_con_caracteres_control: [],
    preguntas_con_reemplazo_invalido: [],
    preguntas_con_decimales_rotos: [],
    preguntas_con_coords_rotas: [],
    preguntas_con_instrucciones: [],
    preguntas_sin_enunciado: [],
    preguntas_conteo_alts_anomalo: [],
    preguntas_clave_invalida: [],
    preguntas_clave_no_en_alts: []
  };

  for (const es of evalSummary) {
    if (es.count_pids === 0) {
      issues.evaluaciones_sin_preguntas.push({ id: es.id, titulo: es.titulo });
    } else if (es.count_pids !== es.total_preguntas) {
      issues.evaluaciones_mismatch_conteo.push({
        id: es.id,
        titulo: es.titulo,
        esperado: es.total_preguntas,
        actual: es.count_pids
      });
    }

    if (es.has_duplicates) {
      issues.preguntas_duplicadas_en_eval.push({ id: es.id, titulo: es.titulo });
    }

    for (const pid of es.pids) {
      if (!questionsMap.has(pid)) {
        issues.preguntas_inexistentes.push({ eval_id: es.id, pregunta_id: pid });
      }
    }
  }

  // 4. Revisión profunda de cada Pregunta existente
  const mojibakeRegex = /(Ã¡|Ã©|Ã­|Ã³|Ãº|Ã±|Ã‘|â€œ|â€|â€“|â€”|Ã‚|Ã‰|Ã“|Ãš|Ã|Â¿|Â¡)/;
  const puaRegex = /[\uE000-\uF8FF]/;
  // Permitir \t (tab=9), \n (lf=10), \r (cr=13). Bloquear el resto de caracteres de control
  const controlCharsRegex = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/;
  const brokenDecimalRegex = /,\s*[0-9]\s+[0-9]{2,}\b/;
  const brokenCoordRegex = /\(\s*,\s*[a-zA-Z0-9_-]+\s+[a-zA-Z0-9_-]+\s*\)/;
  const adminInstructionsRegex = /(anota tu número de Cédula|hoja de respuestas|Seleccione la alternativa correcta según el análisis y comprensión del contenido)/i;

  for (const [qid, q] of questionsMap.entries()) {
    const enun = q.enunciado || '';
    const alts = Array.isArray(q.alternativas) ? q.alternativas : [];
    const allText = enun + ' ' + alts.map(a => `${a.letra || ''} ${a.texto || ''}`).join(' ');

    // a. Enunciado vacío o ultra corto
    if (!enun.trim() || enun.trim().length < 15) {
      issues.preguntas_sin_enunciado.push({ id: qid, len: enun.trim().length });
    }

    // b. Instrucciones administrativas en vez de pregunta real
    if (adminInstructionsRegex.test(enun)) {
      issues.preguntas_con_instrucciones.push({ id: qid, snippet: enun.slice(0, 80) });
    }

    // c. Caracteres PUA
    if (puaRegex.test(allText)) {
      const match = allText.match(puaRegex);
      issues.preguntas_con_pua.push({ id: qid, charCode: 'U+' + match[0].charCodeAt(0).toString(16).toUpperCase() });
    }

    // d. Caracteres de control no válidos
    if (controlCharsRegex.test(allText)) {
      issues.preguntas_con_caracteres_control.push({ id: qid });
    }

    // e. Símbolo de reemplazo  (\uFFFD)
    if (allText.includes('\uFFFD')) {
      issues.preguntas_con_reemplazo_invalido.push({ id: qid });
    }

    // f. Mojibake UTF-8
    if (mojibakeRegex.test(allText)) {
      const m = allText.match(mojibakeRegex);
      issues.preguntas_con_mojibake.push({ id: qid, pattern: m[0] });
    }

    // g. Decimales partidos (,0 75)
    if (brokenDecimalRegex.test(allText)) {
      const m = allText.match(brokenDecimalRegex);
      issues.preguntas_con_decimales_rotos.push({ id: qid, sample: m[0] });
    }

    // h. Coordenadas rotas (,x y)
    if (brokenCoordRegex.test(allText)) {
      const m = allText.match(brokenCoordRegex);
      issues.preguntas_con_coords_rotas.push({ id: qid, sample: m[0] });
    }

    // i. Conteo de alternativas anómalo
    if (alts.length < 4 || alts.length > 5) {
      issues.preguntas_conteo_alts_anomalo.push({ id: qid, numAlts: alts.length });
    }

    // j. Clave oficial de respuesta
    const key = (q.respuesta_correcta || '').trim().toUpperCase();
    if (!['A', 'B', 'C', 'D', 'E'].includes(key)) {
      issues.preguntas_clave_invalida.push({ id: qid, key: q.respuesta_correcta });
    } else {
      const altLetters = alts.map(a => (a.letra || '').trim().toUpperCase());
      if (altLetters.length > 0 && !altLetters.includes(key)) {
        issues.preguntas_clave_no_en_alts.push({ id: qid, key, altLetters });
      }
    }
  }

  // 5. Presentación del Reporte
  console.log("\n=================================================================");
  console.log("                      REPORTE DE RESULTADOS");
  console.log("=================================================================\n");

  console.log("1. INTEGRIDAD DE TEXTOS Y CARACTERES:");
  console.log(`  • Caracteres PUA (U+E000 - U+F8FF): ${issues.preguntas_con_pua.length}`);
  console.log(`  • Caracteres de control no imprimibles: ${issues.preguntas_con_caracteres_control.length}`);
  console.log(`  • Glifos de reemplazo  (U+FFFD): ${issues.preguntas_con_reemplazo_invalido.length}`);
  console.log(`  • Secuencias Mojibake UTF-8: ${issues.preguntas_con_mojibake.length}`);
  console.log(`  • Decimales partidos (,0 75): ${issues.preguntas_con_decimales_rotos.length}`);
  console.log(`  • Coordenadas rotas (,x y): ${issues.preguntas_con_coords_rotas.length}`);

  console.log("\n2. CALIDAD DE ENUNCIADOS Y ESTRUCTURA:");
  console.log(`  • Preguntas sin enunciado / vacío: ${issues.preguntas_sin_enunciado.length}`);
  console.log(`  • Preguntas con texto de instrucciones administrativas: ${issues.preguntas_con_instrucciones.length}`);
  console.log(`  • Preguntas con conteo de alternativas anómalo (≠ 4 y ≠ 5): ${issues.preguntas_conteo_alts_anomalo.length}`);
  console.log(`  • Preguntas con clave de respuesta inválida: ${issues.preguntas_clave_invalida.length}`);
  console.log(`  • Preguntas cuya clave no existe en las alternativas: ${issues.preguntas_clave_no_en_alts.length}`);

  console.log("\n3. COBERTURA Y REFERENCIAS DE EVALUACIONES:");
  console.log(`  • Evaluaciones sin preguntas (0 IDs): ${issues.evaluaciones_sin_preguntas.length}`);
  if (issues.evaluaciones_sin_preguntas.length > 0) {
    issues.evaluaciones_sin_preguntas.forEach(e => console.log(`    - [${e.id}] ${e.titulo}`));
  }
  console.log(`  • Evaluaciones con discrepancia de conteo (actual vs total_preguntas): ${issues.evaluaciones_mismatch_conteo.length}`);
  if (issues.evaluaciones_mismatch_conteo.length > 0) {
    issues.evaluaciones_mismatch_conteo.forEach(e => console.log(`    - [${e.id}] Esperado: ${e.esperado} | Actual: ${e.actual}`));
  }
  console.log(`  • Preguntas inexistentes en tabla 'preguntas' (IDs huérfanos): ${issues.preguntas_inexistentes.length}`);
  console.log(`  • Preguntas duplicadas dentro de la misma evaluación: ${issues.preguntas_duplicadas_en_eval.length}`);

  // Guardar reporte JSON
  fs.writeFileSync('scripts/audit_deep_paes_report.json', JSON.stringify(issues, null, 2), 'utf8');
  console.log("\nReporte detallado guardado en: scripts/audit_deep_paes_report.json");
}

deepAudit().catch(console.error);
