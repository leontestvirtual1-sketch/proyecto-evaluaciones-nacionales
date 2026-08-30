import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Cargar variables de entorno desde .env.local o .env
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
  console.error('❌ Error: Falta VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
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
  '.webp': 'image/webp'
};

async function ensureBucketExists() {
  console.log(`🔍 Verificando bucket "${BUCKET_NAME}"...`);
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.warn('⚠️ No se pudieron listar buckets (puede ser por RLS), intentando crear directamente...', listError.message);
  }

  const exists = buckets?.some(b => b.name === BUCKET_NAME || b.id === BUCKET_NAME);
  if (!exists) {
    console.log(`📦 Creando bucket público "${BUCKET_NAME}"...`);
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp']
    });

    if (createError && !createError.message.includes('already exists')) {
      console.error('❌ Error creando bucket:', createError.message);
    } else {
      console.log(`✅ Bucket "${BUCKET_NAME}" creado o ya existente.`);
    }
  } else {
    console.log(`✅ Bucket "${BUCKET_NAME}" ya existe.`);
  }
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

async function uploadImages() {
  await ensureBucketExists();

  const preguntasDir = path.resolve(__dirname, '../public/preguntas');
  if (!fs.existsSync(preguntasDir)) {
    console.error(`❌ La carpeta "${preguntasDir}" no existe.`);
    return;
  }

  const files = getAllFiles(preguntasDir);
  console.log(`\n🚀 Iniciando subida de ${files.length} archivos de imagen a Supabase Storage (${BUCKET_NAME})...\n`);

  let successCount = 0;
  let failCount = 0;
  const uploadedUrls = new Map();

  for (const filePath of files) {
    const relativePath = path.relative(preguntasDir, filePath).replace(/\\/g, '/');
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const fileBuffer = fs.readFileSync(filePath);

    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(relativePath, fileBuffer, {
          contentType,
          upsert: true
        });

      if (error) {
        console.error(`❌ Falló ${relativePath}: ${error.message}`);
        failCount++;
      } else {
        const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(relativePath);
        uploadedUrls.set(`/preguntas/${relativePath}`, urlData.publicUrl);
        uploadedUrls.set(`preguntas/${relativePath}`, urlData.publicUrl);
        console.log(`✅ Subido: ${relativePath} (${(fileBuffer.length / 1024).toFixed(1)} KB) -> ${urlData.publicUrl}`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Error en ${relativePath}:`, err.message);
      failCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`📊 Resumen de Migración:`);
  console.log(`   - Exitosos: ${successCount}`);
  console.log(`   - Fallidos: ${failCount}`);
  console.log(`   - Total procesados: ${files.length}`);
  console.log(`========================================\n`);

  // Opcional: Actualizar preguntas en la base de datos si tienen rutas relativas
  console.log('🔄 Sincronizando URLs en tabla "preguntas" de Supabase...');
  const { data: preguntas, error: pregError } = await supabase
    .from('preguntas')
    .select('id, imagen_url, enunciado');

  if (pregError) {
    console.warn('⚠️ No se pudieron consultar preguntas de la DB:', pregError.message);
  } else if (preguntas && preguntas.length > 0) {
    let updatedCount = 0;
    for (const preg of preguntas) {
      let needsUpdate = false;
      let newImagenUrl = preg.imagen_url;
      let newEnunciado = preg.enunciado;

      if (preg.imagen_url && preg.imagen_url.startsWith('/preguntas/')) {
        const publicUrl = uploadedUrls.get(preg.imagen_url);
        if (publicUrl) {
          newImagenUrl = publicUrl;
          needsUpdate = true;
        }
      }

      // Reemplazar imágenes markdown en enunciado si existen
      if (newEnunciado && newEnunciado.includes('/preguntas/')) {
        for (const [localPath, publicUrl] of uploadedUrls.entries()) {
          if (newEnunciado.includes(localPath)) {
            newEnunciado = newEnunciado.replaceAll(localPath, publicUrl);
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('preguntas')
          .update({
            imagen_url: newImagenUrl,
            enunciado: newEnunciado
          })
          .eq('id', preg.id);

        if (!updateError) {
          updatedCount++;
        }
      }
    }
    console.log(`✅ ${updatedCount} preguntas actualizadas con URLs de Supabase Storage en la base de datos.`);
  }

  console.log('\n🎉 ¡Migración de imágenes a Supabase Storage finalizada con éxito!');
}

uploadImages();
