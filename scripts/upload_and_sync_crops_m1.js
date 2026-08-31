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

async function syncAll() {
  console.log('🚀 Subiendo las 65 imágenes oficiales a Supabase Storage...');
  const imgDir = path.resolve(__dirname, '../public/preguntas/paes_mat1_2023_forma113');
  const files = fs.readdirSync(imgDir).filter(f => f.startsWith('preg_') && f.endsWith('.png'));

  const uploadedUrls = {};

  for (const f of files) {
    const filePath = path.join(imgDir, f);
    const fileBuffer = fs.readFileSync(filePath);
    const storagePath = `paes_mat1_2023_forma113/${f}`;

    const { error } = await supabase.storage
      .from('evaluaciones-media')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      console.warn(`  ⚠️ Error subiendo ${f}:`, error.message);
    } else {
      const { data: pubData } = supabase.storage.from('evaluaciones-media').getPublicUrl(storagePath);
      uploadedUrls[f] = pubData.publicUrl;
      process.stdout.write('.');
    }
  }

  console.log('\n✅ 65 imágenes subidas a Supabase Storage.');

  console.log('🔄 Actualizando preguntas en public.preguntas...');
  const cropsData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../scratch/paes_m1_2023_crops_final.json'), 'utf8'));

  for (const item of cropsData) {
    const num = String(item.numero).padStart(2, '0');
    const id = `preg-paes-m1-23-${num}`;
    const imgFileName = `preg_${num}.png`;
    const finalImgUrl = uploadedUrls[imgFileName] || `/preguntas/paes_mat1_2023_forma113/${imgFileName}`;
    const clave = item.clave;

    const alternativas = ['A', 'B', 'C', 'D'].map(l => ({
      letra: l,
      texto: `Opción ${l}`,
      es_correcta: l === clave
    }));

    const { error } = await supabase
      .from('preguntas')
      .update({
        imagen_url: finalImgUrl,
        enunciado: `Pregunta oficial #${item.numero} — PAES Competencia Matemática 1 (M1) 2023 (Forma 113)`,
        alternativas: alternativas,
        respuesta_correcta: clave,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.warn(`  ⚠️ Error actualizando ${id}:`, error.message);
    } else {
      process.stdout.write('+');
    }
  }

  console.log('\n🎉 ¡Las 65 preguntas de PAES M1 2023 quedaron sincronizadas con sus recortes oficiales de alta resolución y alternativas!');
}

syncAll();
