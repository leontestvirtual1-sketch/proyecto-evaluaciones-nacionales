import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no encontradas.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanEvaluaciones() {
  console.log('🔄 Actualizando descripciones en tabla evaluaciones...');

  // 1. eval-paes-lect-2026-f103
  const { error: err1 } = await supabase
    .from('evaluaciones')
    .update({
      descripcion: 'Evaluación oficial estandarizada de Competencia Lectora aplicada en el Proceso de Admisión 2026 (Forma 101 — Invierno). Incluye 65 preguntas de selección múltiple (60 válidas y 5 piloto de calibración) sobre textos literarios, expositivos y argumentativos, evaluando Localizar, Interpretar y Evaluar información.',
      descripcion_catalogo: 'Prueba oficial PAES Competencia Lectora 2026 (Forma 101 — Invierno) completa con 65 ítems, escala oficial PAES de 100 a 1000 puntos y pauta docente con justificación curricular.'
    })
    .eq('id', 'eval-paes-lect-2026-f103');

  if (err1) throw err1;
  console.log('  ✅ Actualizada eval-paes-lect-2026-f103');

  // 2. eval-paes-mat1-2023-f113
  const { error: err2 } = await supabase
    .from('evaluaciones')
    .update({
      descripcion: 'Evaluación oficial estandarizada de Competencia Matemática 1 (M1) aplicada en el Proceso de Admisión 2023 (Forma 113). Incluye 65 preguntas de selección múltiple (60 válidas y 5 piloto) cubriendo Números, Álgebra y Funciones, Geometría y Probabilidad y Estadística.',
      descripcion_catalogo: 'Prueba oficial PAES M1 2023 (65 ítems, clavijero oficial, pauta docente completa). Disponible para establecimientos con plan Institucional o como compra directa.'
    })
    .eq('id', 'eval-paes-mat1-2023-f113');

  if (err2) throw err2;
  console.log('  ✅ Actualizada eval-paes-mat1-2023-f113');

  // 3. eval-simce-mat-2m-e3
  const { error: err3 } = await supabase
    .from('evaluaciones')
    .update({
      descripcion: 'Instrumento Ensayo 3 SIMCE Matemática de 2° Medio. 34 preguntas verificadas contra solucionario oficial. Cubre Números, Álgebra, Geometría y Probabilidad.'
    })
    .eq('id', 'eval-simce-mat-2m-e3');

  if (err3) throw err3;
  console.log('  ✅ Actualizada eval-simce-mat-2m-e3');
}

async function cleanPreguntas() {
  console.log('\n🔄 Actualizando fuentes en tabla preguntas...');

  // 1. PAES Lectora 2026
  const { data: pLect, error: errLect } = await supabase
    .from('preguntas')
    .update({ fuente: 'PAES Oficial Competencia Lectora 2026 (Forma 101 Invierno)' })
    .eq('fuente', 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)')
    .select('id');

  if (errLect) throw errLect;
  console.log(`  ✅ Actualizadas ${pLect?.length || 0} preguntas de PAES Lectora 2026`);

  // 2. SIMCE Mat 2M estándar
  const { data: pMat2m, error: errMat2m } = await supabase
    .from('preguntas')
    .update({ fuente: 'Ensayo 3 SIMCE Matemática 2° Medio' })
    .eq('fuente', 'Ensayo 3 SIMCE Matemática 2° Medio — Umáximo')
    .select('id');

  if (errMat2m) throw errMat2m;
  console.log(`  ✅ Actualizadas ${pMat2m?.length || 0} preguntas de SIMCE Mat 2M`);

  // 3. SIMCE Mat 2M adaptada P26
  const { data: pMat2mAd, error: errMat2mAd } = await supabase
    .from('preguntas')
    .update({ fuente: 'Ensayo 3 SIMCE Matemática 2° Medio (adaptada: escalas 1:64/1:43)' })
    .eq('fuente', 'Ensayo 3 SIMCE Matemática 2° Medio — Umáximo (adaptada: escalas 1:64/1:43)')
    .select('id');

  if (errMat2mAd) throw errMat2mAd;
  console.log(`  ✅ Actualizadas ${pMat2mAd?.length || 0} preguntas adaptadas de SIMCE Mat 2M`);
}

async function verify() {
  console.log('\n🔍 Verificando erradicación de marcas en base de datos...');

  const { data: evals } = await supabase
    .from('evaluaciones')
    .select('id, titulo, descripcion, descripcion_catalogo');

  let evalBrands = 0;
  evals?.forEach(e => {
    const str = `${e.titulo || ''} ${e.descripcion || ''} ${e.descripcion_catalogo || ''}`;
    if (/um[aá]ximo|demre/i.test(str)) {
      console.warn(`  ⚠️ Alerta en evaluación ${e.id}: ${str}`);
      evalBrands++;
    }
  });

  const { data: pregs } = await supabase
    .from('preguntas')
    .select('id, fuente')
    .or('fuente.ilike.%umaximo%,fuente.ilike.%umáximo%,fuente.ilike.%demre%');

  let pregBrands = pregs?.length || 0;
  if (pregBrands > 0) {
    console.warn(`  ⚠️ Alerta: ${pregBrands} preguntas aún contienen marcas en fuente`);
  }

  if (evalBrands === 0 && pregBrands === 0) {
    console.log('  🎉 ÉXITO: Cero menciones a Umáximo o DEMRE en la base de datos.');
  } else {
    console.error(`  ❌ Se encontraron ${evalBrands} evaluaciones y ${pregBrands} preguntas con marcas pendientes.`);
    process.exit(1);
  }
}

async function main() {
  console.log('========================================================================');
  console.log('🧹 Limpieza de Marcas de Terceros (Umáximo y DEMRE) en Supabase');
  console.log('========================================================================\n');

  await cleanEvaluaciones();
  await cleanPreguntas();
  await verify();
}

main().catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
