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
  'figura_p45_adjunta.png',
  'figura_p45_opcion_a.png',
  'figura_p45_opcion_b.png',
  'figura_p45_opcion_c.png',
  'figura_p45_opcion_d.png'
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

  // Actualizar Pregunta 45 en Supabase
  const nuevoEnunciado = `¿Cuál de las figuras dadas en las opciones se puede obtener usando solo traslaciones de la figura adjunta?

![Figura adjunta](${uploadedUrls['figura_p45_adjunta.png']})`;

  const nuevasAlternativas = [
    {
      letra: 'A',
      texto: `![Plano cartesiano Opción A](${uploadedUrls['figura_p45_opcion_a.png']})`,
      es_correcta: true
    },
    {
      letra: 'B',
      texto: `![Plano cartesiano Opción B](${uploadedUrls['figura_p45_opcion_b.png']})`,
      es_correcta: false
    },
    {
      letra: 'C',
      texto: `![Plano cartesiano Opción C](${uploadedUrls['figura_p45_opcion_c.png']})`,
      es_correcta: false
    },
    {
      letra: 'D',
      texto: `![Plano cartesiano Opción D](${uploadedUrls['figura_p45_opcion_d.png']})`,
      es_correcta: false
    }
  ];

  const { error: updateError } = await supabase
    .from('preguntas')
    .update({
      enunciado: nuevoEnunciado,
      imagen_url: null,
      alternativas: nuevasAlternativas,
      respuesta_correcta: 'A',
      updated_at: new Date().toISOString()
    })
    .eq('id', 'preg-paes-m1-23-45');

  if (updateError) {
    console.error('Error actualizando preg-paes-m1-23-45 en Supabase:', updateError);
  } else {
    console.log('✅ Pregunta preg-paes-m1-23-45 actualizada exitosamente en Supabase');
  }

  // Corregir también el orden de preg-paes-m1-23-21 si está invertido [D, C, B, A]
  const { data: p21 } = await supabase
    .from('preguntas')
    .select('alternativas')
    .eq('id', 'preg-paes-m1-23-21')
    .single();

  if (p21 && Array.isArray(p21.alternativas)) {
    const sorted = [...p21.alternativas].sort((a, b) => a.letra.localeCompare(b.letra));
    await supabase
      .from('preguntas')
      .update({ alternativas: sorted, updated_at: new Date().toISOString() })
      .eq('id', 'preg-paes-m1-23-21');
    console.log('✅ Pregunta preg-paes-m1-23-21 alternativas ordenadas a [A, B, C, D] en Supabase');
  }
}

main();
