import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
let url = '', key = '';
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
    url = trimmed.slice('VITE_SUPABASE_URL='.length).replace(/['"]/g, '');
  }
  if (trimmed.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
    key = trimmed.slice('SUPABASE_SERVICE_ROLE_KEY='.length).replace(/['"]/g, '');
  }
}

if (!url || !key) {
  console.error('No se encontraron credenciales en .env.local');
  process.exit(1);
}

const sb = createClient(url, key);

async function runAudit() {
  console.log('=== CONSULTAS DE IMPACTO (FASE 0.3) ===');

  // 1. Evaluaciones que referencian o contienen preg-mat2m-e3 o preg-len2m-e6
  const { data: evals, error: errEvals } = await sb
    .from('evaluaciones')
    .select('*');

  if (errEvals) {
    console.error('Error al consultar evaluaciones:', errEvals.message);
    return;
  }

  const mat2mEvals = [];
  const len2mEvals = [];

  for (const ev of evals) {
    const pids = ev.preguntas_ids || [];
    const hasMat = pids.some(id => typeof id === 'string' && id.startsWith('preg-mat2m-e3'));
    const hasLen = pids.some(id => typeof id === 'string' && id.startsWith('preg-len2m-e6'));
    if (hasMat || ev.id === 'eval-simce-mat-2m-e3') {
      mat2mEvals.push({ id: ev.id, titulo: ev.titulo, estado: ev.estado, es_catalogo: ev.es_catalogo, count: pids.length, docente_id: ev.docente_id });
    }
    if (hasLen || ev.id === 'eval-simce-len-2m-e6') {
      len2mEvals.push({ id: ev.id, titulo: ev.titulo, estado: ev.estado, es_catalogo: ev.es_catalogo, count: pids.length, docente_id: ev.docente_id });
    }
  }

  console.log('\nEvaluaciones vinculadas a Mat 2M E3:', mat2mEvals);
  console.log('\nEvaluaciones vinculadas a Lectura 2M E6:', len2mEvals);

  const allTargetEvalIds = [...new Set([...mat2mEvals.map(e => e.id), ...len2mEvals.map(e => e.id)])];

  // 2. Rendiciones existentes
  if (allTargetEvalIds.length > 0) {
    const { data: rendiciones, error: errRend } = await sb
      .from('rendiciones')
      .select('*')
      .in('prueba_id', allTargetEvalIds);

    if (errRend) {
      console.error('Error al consultar rendiciones:', errRend.message);
    } else {
      console.log(`\nTotal rendiciones encontradas para estas evaluaciones: ${rendiciones.length}`);
      if (rendiciones.length > 0) {
        console.log('Detalle rendiciones:', rendiciones);
      }
    }
  }

  // 3. Respaldo de preguntas actuales en scratch/
  if (!fs.existsSync('scratch')) {
    fs.mkdirSync('scratch');
  }

  const { data: qMat } = await sb.from('preguntas').select('*').ilike('id', 'preg-mat2m-e3-%');
  const { data: qLen } = await sb.from('preguntas').select('*').ilike('id', 'preg-len2m-e6-%');
  const { data: evTarget } = await sb.from('evaluaciones').select('*').in('id', allTargetEvalIds);

  const backupData = {
    timestamp: new Date().toISOString(),
    evaluaciones: evTarget || [],
    preguntas_mat2m: qMat || [],
    preguntas_len2m: qLen || []
  };

  fs.writeFileSync('scratch/backup_impact_phase0.json', JSON.stringify(backupData, null, 2), 'utf8');
  console.log(`\nRespaldo guardado en scratch/backup_impact_phase0.json con:
- ${evTarget?.length || 0} evaluaciones
- ${qMat?.length || 0} preguntas Mat 2M
- ${qLen?.length || 0} preguntas Lectura 2M`);
}

runAudit();
