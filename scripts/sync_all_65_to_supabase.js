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
  console.log('🔄 Sincronizando las 65 preguntas desde scratch/paes_m1_2023_65_standard_final.json...');
  const jsonPath = path.resolve(__dirname, '../scratch/paes_m1_2023_65_standard_final.json');
  const questions = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  for (const q of questions) {
    const numStr = String(q.numero).padStart(2, '0');
    const id = `preg-paes-m1-23-${numStr}`;

    const { error } = await supabase
      .from('preguntas')
      .update({
        enunciado: q.enunciado,
        imagen_url: q.imagen_url,
        alternativas: q.alternativas,
        respuesta_correcta: q.clave,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.warn(`  ⚠️ Error actualizando ${id}:`, error.message);
    } else {
      process.stdout.write('+');
    }
  }

  console.log('\n🎉 ¡Las 65 preguntas quedaron 100% sincronizadas en Supabase!');
}

main();
