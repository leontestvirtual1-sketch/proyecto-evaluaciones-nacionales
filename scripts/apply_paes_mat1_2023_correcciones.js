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
  const correccionesPath = path.resolve(__dirname, 'data/paes_mat1_2023_forma113_correcciones.json');
  const raw = JSON.parse(fs.readFileSync(correccionesPath, 'utf8'));
  // Eliminar la clave _meta que no es una pregunta
  const { _meta, ...correcciones } = raw;

  console.log(`📋 Aplicando ${Object.keys(correcciones).length} correcciones...`);
  console.log('   Fuente de verdad:', _meta?.fuente_verdad || 'PAUTA DEMRE OFICIAL');
  console.log();

  let ok = 0;
  let err = 0;

  for (const [numero, fix] of Object.entries(correcciones)) {
    const id = `preg-paes-m1-23-${String(numero).padStart(2, '0')}`;
    const updatePayload = {
      enunciado: fix.enunciado,
      alternativas: fix.alternativas,
      respuesta_correcta: fix.respuesta_correcta,
      updated_at: new Date().toISOString(),
    };
    if (fix.imagen_url !== undefined) {
      updatePayload.imagen_url = fix.imagen_url;
    }

    const { error } = await supabase
      .from('preguntas')
      .update(updatePayload)
      .eq('id', id);

    if (error) {
      console.warn(`⚠️  Error actualizando ${id}:`, error.message);
      err++;
    } else {
      console.log(`✅ ${id} (Q${numero}) — clave=${fix.respuesta_correcta}${fix.nota ? ' ⚠️  ' + fix.nota : ''}`);
      ok++;
    }
  }

  console.log();
  console.log(`Resultado: ${ok} OK / ${err} errores`);
}

main().catch(e => { console.error(e); process.exit(1); });
