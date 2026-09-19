import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load env
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

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// 2. Mapping of questions to cropped figures
// Question number -> filename in public/preguntas/paes_mat1_2023_forma113
const questionFigures = {
  3: 'figura_p03_piramide.png',
  10: 'figura_p10_cuadriculas_opciones.png',
  11: 'figura_p11_tabla_bebidas.png',
  17: 'figura_p17_cajas.png',
  21: 'figura_p21_graficos_opciones.png',
  23: 'figura_p23_recta.png',
  26: 'figura_p26_resorte.png',
  27: 'figura_p27_canon.png',
  30: 'figura_p30_bateria.png',
  32: 'figura_p32_planos_opciones.png',
  34: 'figura_p34_tabla_func.png',
  35: 'figura_p35_geometria.png',
  38: 'figura_p38_parabolas_opciones.png',
  39: 'figura_p39_triangulos_opciones.png',
  40: 'figura_p40_repisa.png',
  41: 'figura_p41_antena.png',
  42: 'figura_p42_rectangulo.png',
  45: 'figura_p45_figura.png',
  46: 'figura_p46_cuadricula.png',
  47: 'figura_p47_simetria.png',
  49: 'figura_p49_cuadrilateros.png',
  50: 'figura_p50_casa_arbol.png',
  51: 'figura_p51_ojo_retina.png',
  52: 'figura_p52_escalera.png',
  53: 'figura_p53_mesa.png',
  54: 'figura_p54_plantas.png',
  56: 'figura_p56_legumbres.png',
  57: 'figura_p57_diagrama_caja.png',
  60: 'figura_p60_grafico_barras.png'
};

async function main() {
  console.log('🚀 1. Subiendo figuras a Supabase Storage (bucket evaluaciones-media)...');
  const imgDir = path.resolve(__dirname, '../public/preguntas/paes_mat1_2023_forma113');
  const uploadedUrls = {};

  for (const [qNum, fileName] of Object.entries(questionFigures)) {
    const localPath = path.join(imgDir, fileName);
    if (!fs.existsSync(localPath)) {
      console.warn(`  ⚠️ Archivo no encontrado: ${localPath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(localPath);
    const storagePath = `paes_mat1_2023_forma113/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('evaluaciones-media')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error(`  ❌ Error subiendo ${fileName}:`, uploadError.message);
    } else {
      const { data: pubData } = supabase.storage
        .from('evaluaciones-media')
        .getPublicUrl(storagePath);
      
      uploadedUrls[qNum] = pubData.publicUrl;
      console.log(`  ✅ Q${qNum.padStart(2, '0')} -> ${pubData.publicUrl}`);
    }
  }

  console.log(`\n🔄 2. Sincronizando preguntas en Supabase DB (preg-paes-m1-23-01 a 65)...`);

  // Reset wrong or stale images on all questions first
  for (let i = 1; i <= 65; i++) {
    const id = `preg-paes-m1-23-${String(i).padStart(2, '0')}`;
    const correctUrl = uploadedUrls[i] || null;

    const updatePayload = {
      imagen_url: correctUrl,
      updated_at: new Date().toISOString()
    };

    // targeted fix for Q03 clean enunciado
    if (i === 3) {
      updatePayload.enunciado = "En la figura adjunta se cumple que la suma de los valores de los casilleros contiguos de una fila es igual al valor inmediatamente superior a ellos (por ejemplo $p + q = f$).\n\nSi la suma de los tres valores de la última fila es 17, ¿cuál es el valor de $p + f$?";
      updatePayload.alternativas = [
        { letra: 'A', texto: '12', es_correcta: false },
        { letra: 'B', texto: '13', es_correcta: false },
        { letra: 'C', texto: '18', es_correcta: true },
        { letra: 'D', texto: '21', es_correcta: false }
      ];
      updatePayload.respuesta_correcta = 'C';
    }

    // targeted fix for Q11 table markdown
    if (i === 11) {
      updatePayload.enunciado = "En un estudio realizado a un grupo de 25 personas, se les consultó por su bebida favorita, de entre cuatro disponibles (Almíbar, Refrescante, Quitased y Frutirico). En la tabla adjunta se presentan los resultados obtenidos:\n\n| Bebida | Cantidad de personas |\n|---|---|\n| Almíbar | 12 |\n| Refrescante | 4 |\n| Quitased | 8 |\n| Frutirico | 1 |\n\n¿Cuál de las siguientes afirmaciones es verdadera?";
    }

    const { error: dbError } = await supabase
      .from('preguntas')
      .update(updatePayload)
      .eq('id', id);

    if (dbError) {
      console.error(`  ❌ Error actualizando ${id}:`, dbError.message);
    } else {
      if (correctUrl) {
        console.log(`  🖼️  ${id} actualizado con figura: ${correctUrl}`);
      }
    }
  }

  console.log('\n🎉 ¡Proceso completado! Todas las figuras fueron recortadas, subidas a Supabase Storage e insertadas en sus respectivas preguntas.');
}

main().catch(console.error);
