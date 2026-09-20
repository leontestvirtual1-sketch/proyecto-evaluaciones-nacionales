import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');
const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '')];
    })
);

const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const files = [
  'figura_p32_sistema.png',
  'figura_p32_all_options.png',
  'figura_p32_opcion_a.png',
  'figura_p32_opcion_b.png',
  'figura_p32_opcion_c.png',
  'figura_p32_opcion_d.png'
];

async function main() {
  const uploadedUrls = {};
  for (const f of files) {
    const filePath = path.resolve(__dirname, '../public/preguntas/paes_mat1_2023_forma113', f);
    const buffer = fs.readFileSync(filePath);
    const storagePath = `paes_mat1_2023_forma113/${f}`;

    const { error } = await supabase.storage
      .from('evaluaciones-media')
      .upload(storagePath, buffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      console.error('Error uploading', f, error);
    } else {
      const { data } = supabase.storage.from('evaluaciones-media').getPublicUrl(storagePath);
      uploadedUrls[f] = data.publicUrl;
      console.log(f, '->', data.publicUrl);
    }
  }

  // Build markdown enunciado
  const nuevoEnunciado = `¿Cuál de los siguientes puntos ubicados en el plano cartesiano representa mejor a la intersección de las rectas asociadas al sistema?

![Sistema de ecuaciones](${uploadedUrls['figura_p32_sistema.png']})

**Recta 1:** 2y - 3x = -4  
**Recta 2:** 3x - y = 0`;

  // Build alternatives A, B, C, D
  const alternativas = [
    {
      letra: 'A',
      texto: `![Plano cartesiano Opción A](${uploadedUrls['figura_p32_opcion_a.png']})`,
      es_correcta: true
    },
    {
      letra: 'B',
      texto: `![Plano cartesiano Opción B](${uploadedUrls['figura_p32_opcion_b.png']})`,
      es_correcta: false
    },
    {
      letra: 'C',
      texto: `![Plano cartesiano Opción C](${uploadedUrls['figura_p32_opcion_c.png']})`,
      es_correcta: false
    },
    {
      letra: 'D',
      texto: `![Plano cartesiano Opción D](${uploadedUrls['figura_p32_opcion_d.png']})`,
      es_correcta: false
    }
  ];

  const { data, error: updateError } = await supabase
    .from('preguntas')
    .update({
      enunciado: nuevoEnunciado,
      imagen_url: null,
      alternativas: alternativas,
      respuesta_correcta: 'A',
      updated_at: new Date().toISOString()
    })
    .eq('id', 'preg-paes-m1-23-32')
    .select('id, enunciado, alternativas, respuesta_correcta');

  if (updateError) {
    console.error('Error actualizando Pregunta 32:', updateError);
  } else {
    console.log('✅ Pregunta 32 actualizada con éxito en Supabase!');
    console.log(JSON.stringify(data, null, 2));
  }
}

main().catch(console.error);
