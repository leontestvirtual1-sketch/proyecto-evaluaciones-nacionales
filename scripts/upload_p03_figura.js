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
  const localPath = path.resolve(__dirname, '../public/preguntas/paes_mat1_2023_forma113/figura_p03_piramide.png');
  const fileBuffer = fs.readFileSync(localPath);
  const storagePath = 'paes_mat1_2023_forma113/figura_p03_piramide.png';

  const { data, error } = await supabase.storage
    .from('evaluaciones-media')
    .upload(storagePath, fileBuffer, {
      contentType: 'image/png',
      upsert: true
    });

  if (error) {
    console.error('Error subiendo imagen:', error);
  } else {
    console.log('✅ Figura pirámide P3 subida exitosamente a Supabase Storage:', storagePath);
  }
}

main();
