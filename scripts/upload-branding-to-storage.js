import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
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
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const BUCKET_NAME = 'evaluaciones-media';

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Error: Faltan credenciales Supabase en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false }
});

const MIME_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

async function uploadFile(localPath, storagePath) {
  if (!fs.existsSync(localPath)) {
    console.warn(`⚠️ Archivo no encontrado: ${localPath}`);
    return null;
  }
  const ext = path.extname(localPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const fileBuffer = fs.readFileSync(localPath);

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true
    });

  if (error) {
    console.error(`❌ Error subiendo ${storagePath}: ${error.message}`);
    return null;
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
  console.log(`✅ Subido: ${storagePath} -> ${data.publicUrl}`);
  return data.publicUrl;
}

async function uploadBranding() {
  console.log('\n🚀 Subiendo logos institucionales y favicon a Supabase Storage...\n');

  // 1. Favicon y App Icon
  await uploadFile(path.resolve(__dirname, '../public/favicon.svg'), 'branding/favicon.svg');
  if (fs.existsSync(path.resolve(__dirname, '../public/favicon.png'))) {
    await uploadFile(path.resolve(__dirname, '../public/favicon.png'), 'branding/favicon.png');
  }
  await uploadFile(path.resolve(__dirname, '../public/sysget-paes-icon.svg'), 'branding/sysget-paes-icon.svg');

  // 2. Logos de colegios
  const logosDir = path.resolve(__dirname, '../public/logos');
  if (fs.existsSync(logosDir)) {
    const logos = fs.readdirSync(logosDir);
    for (const logo of logos) {
      await uploadFile(path.join(logosDir, logo), `branding/logos/${logo}`);
    }
  }

  console.log('\n🎉 ¡Branding subido con éxito a Supabase Storage!\n');
}

uploadBranding();
