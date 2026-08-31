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

function refineMath(enunciado, numero) {
  let res = enunciado;

  if (numero === 1) {
    res = `Por el arriendo de un juego inflable se cobra una cuota fija de **$120.000** por cuatro horas, más **$25.000** por cada hora adicional.

¿Cuántas horas como máximo puede arrendar una empresa el juego inflable si tiene un presupuesto de **$240.000** para este efecto?`;
  } else if (numero === 2) {
    res = `Considera el número $p$ distinto de cero que es multiplicado dos veces por $1,25$ y luego, dos veces por $0,75$, tal como se representa a continuación:

$$p \\cdot 1,25 \\cdot 1,25 \\cdot 0,75 \\cdot 0,75$$

¿Qué pueden representar dichas multiplicaciones, respecto del número original $p$?`;
  } else if (numero === 3) {
    res = `En la figura adjunta se cumple que la suma de los valores de los casilleros contiguos de una fila es igual al valor inmediatamente superior a ellos (por ejemplo $p + q = f$).

| Fila Superior | | | |
| :---: | :---: | :---: | :---: |
| | | **[ 25 ]** | |
| | **[ f ]** | | **[ ]** |
| **[ p ]** | | **[ q ]** | **[ 4 ]** |

Si la suma de los tres valores de la última fila es $17$, ¿cuál es el valor de $p + f$?`;
  } else {
    // Limpiezas generales para las demás preguntas
    res = res.replace(/\s*/g, '= +');
    res = res.replace(/f\s*q\s*p\s*=\s*\+/g, 'p + q = f');
    res = res.replace(/f\s*p\s*[\+＋]/g, 'p + f');
    res = res.replace(/[•]/g, ' · ');
    res = res.replace(/075,075,125,1,25\s*p\s*·\s*·\s*·\s*·/g, 'p · 1,25 · 1,25 · 0,75 · 0,75');
  }

  return res;
}

async function polishAll() {
  console.log('🎨 Pulintiendo preguntas de PAES Matemática 1 2023...');
  const jsonPath = path.resolve(__dirname, '../scratch/paes_m1_2023_cleaned_65.json');
  const preguntas = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  for (const p of preguntas) {
    p.enunciado = refineMath(p.enunciado, p.numero);

    // Ajustar alternativas si es pregunta 2
    if (p.numero === 2) {
      p.alternativas = [
        { letra: 'A', texto: 'Que hubo dos aumentos del 25% y luego, dos disminuciones del 25%.', es_correcta: true },
        { letra: 'B', texto: 'Que no hubo aumento de p ni disminución de p.', es_correcta: false },
        { letra: 'C', texto: 'Que hubo dos aumentos de 0,25 y luego, dos disminuciones de 0,75.', es_correcta: false },
        { letra: 'D', texto: 'Que hubo dos aumentos del 25% y luego, dos disminuciones del 75%.', es_correcta: false }
      ];
    }

    const num = String(p.numero).padStart(2, '0');
    const id = `preg-paes-m1-23-${num}`;

    await supabase
      .from('preguntas')
      .update({
        enunciado: p.enunciado,
        alternativas: p.alternativas,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
  }

  console.log('✨ Preguntas pulidas y sincronizadas en Supabase.');
}

polishAll();
