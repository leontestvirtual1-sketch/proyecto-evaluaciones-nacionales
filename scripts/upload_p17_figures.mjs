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
  'figura_p17_cuadrados.png',
  'figura_p17_tablas_opciones.png',
  'figura_p17_opcion_a.png',
  'figura_p17_opcion_b.png',
  'figura_p17_opcion_c.png',
  'figura_p17_opcion_d.png'
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

  // Now update Pregunta 17 in Supabase
  // Enunciado includes the stimulus figure!
  const nuevoEnunciado = `Tres figuras están formadas por cuadrados congruentes entre sí que presentan una regla de formación que consiste en duplicar el lado de cada figura respecto de la anterior, como se presenta a continuación:

![Figuras congruentes](${uploadedUrls['figura_p17_cuadrados.png']})

¿En cuál de las siguientes tablas se relaciona cada figura con la cantidad de cuadrados que la componen?`;

  // Alternatives: each alternative has its cropped table
  const alternativas = [
    {
      letra: 'A',
      texto: `![Tabla Opción A](${uploadedUrls['figura_p17_opcion_a.png']})`,
      es_correcta: false
    },
    {
      letra: 'B',
      texto: `![Tabla Opción B](${uploadedUrls['figura_p17_opcion_b.png']})`,
      es_correcta: false
    },
    {
      letra: 'C',
      texto: `![Tabla Opción C](${uploadedUrls['figura_p17_opcion_c.png']})`,
      es_correcta: true
    },
    {
      letra: 'D',
      texto: `![Tabla Opción D](${uploadedUrls['figura_p17_opcion_d.png']})`,
      es_correcta: false
    }
  ];

  const { data, error: updateError } = await supabase
    .from('preguntas')
    .update({
      enunciado: nuevoEnunciado,
      imagen_url: null, // the images are cleanly placed inside the enunciado and alternatives!
      alternativas: alternativas,
      respuesta_correcta: 'C',
      updated_at: new Date().toISOString()
    })
    .eq('id', 'preg-paes-m1-23-17')
    .select('id, enunciado, alternativas, imagen_url');

  if (updateError) {
    console.error('Error actualizando Pregunta 17:', updateError);
  } else {
    console.log('✅ Pregunta 17 actualizada con éxito en Supabase!');
  }
}

main().catch(console.error);
