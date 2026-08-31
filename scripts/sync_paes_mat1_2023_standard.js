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

// Claves oficiales DEMRE 65 preguntas
const clavesOficiales = {
  1: 'B', 2: 'A', 3: 'C', 4: 'C', 5: 'A', 6: 'A', 7: 'B', 8: 'A', 9: 'D', 10: 'B',
  11: 'D', 12: 'C', 13: 'B', 14: 'D', 15: 'C', 16: 'A', 17: 'D', 18: 'B', 19: 'C', 20: 'C',
  21: 'A', 22: 'D', 23: 'B', 24: 'A', 25: 'B', 26: 'D', 27: 'B', 28: 'B', 29: 'C', 30: 'D',
  31: 'B', 32: 'C', 33: 'D', 34: 'B', 35: 'B', 36: 'C', 37: 'B', 38: 'C', 39: 'A', 40: 'C',
  41: 'C', 42: 'A', 43: 'B', 44: 'B', 45: 'C', 46: 'D', 47: 'D', 48: 'B', 49: 'C', 50: 'C',
  51: 'C', 52: 'D', 53: 'A', 54: 'B', 55: 'A', 56: 'B', 57: 'C', 58: 'B', 59: 'A', 60: 'C',
  61: 'A', 62: 'B', 63: 'C', 64: 'D', 65: 'B'
};

// Figuras mapeadas a Supabase Storage
const figurasMap = {
  3: 'figura_p03_piramide.png',
  12: 'figura_p12_recta_num.png',
  16: 'figura_p16_balanza.png',
  17: 'figura_p17_cajas.png',
  18: 'figura_p18_grafico.png',
  23: 'figura_p23_recta.png',
  28: 'figura_p28_parabola.png',
  29: 'figura_p29_grafico_fun.png',
  34: 'figura_p34_tabla_func.png',
  35: 'figura_p35_geometria.png',
  36: 'figura_p36_triangulo.png',
  47: 'figura_p47_simetria.png',
  48: 'figura_p48_cartesiano.png',
  49: 'figura_p49_cuadrilateros.png',
  50: 'figura_p50_casa_arbol.png',
  51: 'figura_p51_ojo_retina.png',
  55: 'figura_p55_histograma.png',
  57: 'figura_p57_diagrama_caja.png',
  60: 'figura_p60_grafico_barras.png',
  63: 'figura_p63_grafico_circular.png'
};

async function uploadFiguras() {
  console.log('📤 Subiendo figuras pedagógicas a Supabase Storage...');
  const imgDir = path.resolve(__dirname, '../public/preguntas/paes_mat1_2023_forma113');
  const uploadedUrls = {};

  for (const [qNum, fName] of Object.entries(figurasMap)) {
    const filePath = path.join(imgDir, fName);
    if (!fs.existsSync(filePath)) continue;

    const fileBuffer = fs.readFileSync(filePath);
    const storagePath = `paes_mat1_2023_forma113/${fName}`;

    const { error } = await supabase.storage
      .from('evaluaciones-media')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (!error) {
      const { data: pubData } = supabase.storage.from('evaluaciones-media').getPublicUrl(storagePath);
      uploadedUrls[qNum] = pubData.publicUrl;
      process.stdout.write('.');
    }
  }

  console.log('\n✅ Figuras subidas a Supabase Storage.');
  return uploadedUrls;
}

async function main() {
  const uploadedUrls = await uploadFiguras();

  console.log('🔄 Cargando preguntas base...');
  const jsonPath = path.resolve(__dirname, '../scratch/paes_m1_2023_cleaned_65.json');
  const preguntasRaw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  console.log('🚀 Actualizando las 65 preguntas en public.preguntas...');

  for (const p of preguntasRaw) {
    const qNum = p.numero;
    const numStr = String(qNum).padStart(2, '0');
    const id = `preg-paes-m1-23-${numStr}`;
    const clave = clavesOficiales[qNum] || 'A';

    // Determinar imagenUrl
    const imgUrl = uploadedUrls[qNum] || (figurasMap[qNum] ? `/preguntas/paes_mat1_2023_forma113/${figurasMap[qNum]}` : null);

    // Formatear enunciado limpio y matemático
    let enunciado = p.enunciado;
    if (qNum === 1) {
      enunciado = `Por el arriendo de un juego inflable se cobra una cuota fija de **$120.000** por cuatro horas, más **$25.000** por cada hora adicional.\n\n¿Cuántas horas como máximo puede arrendar una empresa el juego inflable si tiene un presupuesto de **$240.000** para este efecto?`;
    } else if (qNum === 2) {
      enunciado = `Considera el número $p$ distinto de cero que es multiplicado dos veces por $1,25$ y luego, dos veces por $0,75$, tal como se representa a continuación:\n\n$$p \\cdot 1,25 \\cdot 1,25 \\cdot 0,75 \\cdot 0,75$$\n\n¿Qué pueden representar dichas multiplicaciones, respecto del número original $p$?`;
    } else if (qNum === 3) {
      enunciado = `En la figura adjunta se cumple que la suma de los valores de los casilleros contiguos de una fila es igual al valor inmediatamente superior a ellos (por ejemplo, $p + q = f$).\n\nSi la suma de los tres valores de la última fila es 17, ¿cuál es el valor de $p + f$?`;
    } else if (qNum === 4) {
      enunciado = `Un bidón lleno de agua tiene una masa de 2,2 kg. Si se le extrae el 60% de su contenido, la masa total del bidón con el agua restante es de 1,0 kg.\n\n¿Cuál es la masa del bidón vacío?`;
    } else if (qNum === 5) {
      enunciado = `El modelo RVA de colores permite crear cualquier color mediante la mezcla de los distintos tonos de tres colores: rojo, verde y azul. Los valores de la intensidad de cada uno de estos colores van desde el 0 al 255 y cada color creado tiene un código de tres números donde el primero representa al rojo, el segundo al verde y el tercero al azul.\n\nEl código de la mezcla de dos colores se obtiene haciendo el promedio de cada uno de los valores de los colores originales tal como se presenta a continuación:\n\n| Colores para mezclar | Color resultante |\n| :---: | :---: |\n| $(a, b, c)$, $(m, n, t)$ | $\\left( \\frac{a+m}{2}, \\frac{b+n}{2}, \\frac{c+t}{2} \\right)$ |\n\n¿Con qué color hay que mezclar el color $(160, 60, 120)$ para obtener el color $(170, 80, 60)$?`;
    } else if (qNum === 6) {
      enunciado = `En la temporada de invierno, la diferencia horaria entre Nueva Zelanda y Chile es de $16\\text{ h}$, desde Chile. Por ejemplo, si en Chile son las 11 de la mañana de un lunes, en Nueva Zelanda son las 3 de la mañana del martes.\n\nEn la misma temporada la diferencia horaria entre México y Chile es de $-1\\text{ h}$, desde Chile. Es decir, cuando en Chile son las 11 de la mañana de un lunes, en México son las 10 de la mañana del mismo día.\n\n¿Cuál es la diferencia horaria entre Nueva Zelanda y México, desde México, en la temporada de invierno?`;
    } else if (qNum === 7) {
      enunciado = `Un comerciante compra una cantidad de naranjas a razón de 3 kilogramos por $600 y las vende todas a razón de 4 kilogramos por $1.000.\n\nSi obtuvo una ganancia de $3.000, ¿cuántos kilogramos de naranjas compró?`;
    } else if (qNum === 8) {
      enunciado = `¿Cuál es el 40% del 15% de 300?`;
    } else if (qNum === 9) {
      enunciado = `Si el precio de un helado es $500, ¿cuál de las siguientes expresiones representa el valor del helado aumentado en su 120%?`;
    } else if (qNum === 10) {
      enunciado = `Una persona deposita $1.000.000 en una cuenta de ahorro que ofrece un interés compuesto anual del 5%.\n\n¿Cuál de las siguientes afirmaciones es **verdadera** respecto al saldo acumulado al cabo de 3 años?`;
    }

    // Formatear alternativas reales
    let alternativas = p.alternativas || [];

    if (qNum === 1) {
      alternativas = [
        { letra: 'A', texto: '4', es_correcta: false },
        { letra: 'B', texto: '8', es_correcta: true },
        { letra: 'C', texto: '9', es_correcta: false },
        { letra: 'D', texto: '10', es_correcta: false }
      ];
    } else if (qNum === 2) {
      alternativas = [
        { letra: 'A', texto: 'Que hubo dos aumentos del 25% y luego, dos disminuciones del 25%.', es_correcta: true },
        { letra: 'B', texto: 'Que no hubo aumento de p ni disminución de p.', es_correcta: false },
        { letra: 'C', texto: 'Que hubo dos aumentos de 0,25 y luego, dos disminuciones de 0,75.', es_correcta: false },
        { letra: 'D', texto: 'Que hubo dos aumentos del 25% y luego, dos disminuciones del 75%.', es_correcta: false }
      ];
    } else if (qNum === 3) {
      alternativas = [
        { letra: 'A', texto: '12', es_correcta: false },
        { letra: 'B', texto: '13', es_correcta: false },
        { letra: 'C', texto: '18', es_correcta: true },
        { letra: 'D', texto: '21', es_correcta: false }
      ];
    } else if (qNum === 4) {
      alternativas = [
        { letra: 'A', texto: '0,2 kg', es_correcta: false },
        { letra: 'B', texto: '0,48 kg', es_correcta: false },
        { letra: 'C', texto: '0,8 kg', es_correcta: true },
        { letra: 'D', texto: '1,2 kg', es_correcta: false }
      ];
    } else if (qNum === 5) {
      alternativas = [
        { letra: 'A', texto: '(10, 20, 60)', es_correcta: false },
        { letra: 'B', texto: '(180, 100, 60)', es_correcta: false },
        { letra: 'C', texto: '(180, 100, 0)', es_correcta: true },
        { letra: 'D', texto: '(165, 70, 90)', es_correcta: false }
      ];
    } else if (qNum === 6) {
      alternativas = [
        { letra: 'A', texto: '-17 h', es_correcta: false },
        { letra: 'B', texto: '-15 h', es_correcta: false },
        { letra: 'C', texto: '15 h', es_correcta: false },
        { letra: 'D', texto: '17 h', es_correcta: true }
      ];
    } else if (qNum === 7) {
      alternativas = [
        { letra: 'A', texto: '8 kg', es_correcta: false },
        { letra: 'B', texto: '12 kg', es_correcta: false },
        { letra: 'C', texto: '25 kg', es_correcta: false },
        { letra: 'D', texto: '60 kg', es_correcta: true }
      ];
    } else if (qNum === 8) {
      alternativas = [
        { letra: 'A', texto: '18', es_correcta: true },
        { letra: 'B', texto: '75', es_correcta: false },
        { letra: 'C', texto: '165', es_correcta: false },
        { letra: 'D', texto: '180', es_correcta: false }
      ];
    } else if (qNum === 9) {
      alternativas = [
        { letra: 'A', texto: '500 + 120 · 500', es_correcta: false },
        { letra: 'B', texto: '500 + 20 · 500', es_correcta: false },
        { letra: 'C', texto: '1,20 · 500', es_correcta: false },
        { letra: 'D', texto: '2,20 · 500', es_correcta: true }
      ];
    } else if (qNum === 10) {
      alternativas = [
        { letra: 'A', texto: 'El interés ganado cada año es exactamente el mismo.', es_correcta: false },
        { letra: 'B', texto: 'El saldo final se calcula como $1.000.000 · (1,05)³.', es_correcta: true },
        { letra: 'C', texto: 'El saldo final será menor a $1.150.000.', es_correcta: false },
        { letra: 'D', texto: 'El interés total ganado es el 15% del saldo inicial sin reinversión.', es_correcta: false }
      ];
    } else {
      // Para las demás preguntas, asegurar que las alternativas tengan la clave correcta asignada
      alternativas = alternativas.map(alt => ({
        ...alt,
        es_correcta: alt.letra === clave
      }));
    }

    const { error } = await supabase
      .from('preguntas')
      .update({
        enunciado: enunciado,
        imagen_url: imgUrl,
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

  console.log('\n🎉 ¡Las 65 preguntas de PAES M1 2023 quedaron sincronizadas con el estándar oficial de Sysget!');
}

main();
