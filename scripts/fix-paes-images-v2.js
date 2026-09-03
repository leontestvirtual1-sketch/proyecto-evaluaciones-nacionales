import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('⚠️ No se encontró el archivo .env.local para cargar las credenciales.');
    return;
  }
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
  process.env.VITE_SUPABASE_URL || 'https://khtdzgfqjggycrcbrytw.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { persistSession: false } }
);

const corrections = {
  17: {
    fileName: 'p17_img_1.png',
    id: 'preg-paes-m1-23-17'
  },
  21: {
    fileName: 'preg_21.png',
    id: 'preg-paes-m1-23-21'
  },
  23: {
    fileName: 'preg_23.png',
    id: 'preg-paes-m1-23-23'
  },
  26: {
    fileName: 'preg_26.png',
    id: 'preg-paes-m1-23-26'
  }
};

async function fixImages() {
  console.log('📤 Iniciando reparación de imágenes corregidas...');
  const imgDir = path.resolve(__dirname, '../public/preguntas/paes_mat1_2023_forma113');
  
  for (const [qNum, data] of Object.entries(corrections)) {
    const filePath = path.join(imgDir, data.fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Archivo local no encontrado en public/: ${data.fileName}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const storagePath = `paes_mat1_2023_forma113/${data.fileName}`;
    
    // Subir a Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('evaluaciones-media')
      .upload(storagePath, fileBuffer, { contentType: 'image/png', upsert: true });

    if (uploadError) {
      console.error(`❌ Error al subir ${data.fileName}:`, uploadError.message);
      continue;
    }

    // Obtener URL pública para actualizar la DB de producción de manera robusta
    const { data: pubData } = supabase.storage.from('evaluaciones-media').getPublicUrl(storagePath);
    const publicUrl = pubData.publicUrl;

    const { error: dbError } = await supabase
      .from('preguntas')
      .update({ 
        imagen_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', data.id);

    if (dbError) {
      console.error(`❌ Error al actualizar DB para Pregunta ${qNum}:`, dbError.message);
    } else {
      console.log(`✅ Pregunta ${qNum} reparada con éxito (${data.fileName})`);
    }
  }
  console.log('🎉 Auditoría e inyección de imágenes completada exitosamente.');
}

if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  fixImages();
} else {
  console.log('⚠️ SUPABASE_SERVICE_ROLE_KEY no detectado. Modo Simulación local completado.');
}
