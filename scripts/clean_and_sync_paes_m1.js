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

function cleanMathString(str) {
  if (!str) return '';
  let res = str;

  // 1. Eliminar pie de página y marcas de agua
  res = res.replace(/FORMA\s+\d+[\s\S]*?(?=\n\n|$)/gi, '');
  res = res.replace(/-\s*\d+\s*-/g, '');
  res = res.replace(/www\.[a-z0-9.-]+\.[a-z]{2,}/gi, '');

  // 2. Reparar montos en dinero invertidos:
  // "000\n120\n$" -> "$120.000"
  // "000\n25\n$" -> "$25.000"
  // "000\n240\n$" -> "$240.000"
  res = res.replace(/000\s*\n\s*(\d{1,3})\s*\n\s*\$/g, '$$$1.000');
  res = res.replace(/(\d{1,3})\s*\n\s*000\s*\n\s*\$/g, '$$$1.000');
  res = res.replace(/\$\s*\n\s*(\d{1,3})\s*\n\s*000/g, '$$$1.000');
  res = res.replace(/\$\s*(\d{1,3})\s+000/g, '$$$1.000');

  // 3. Reparar decimales invertidos:
  // "25\n,1" -> "1,25"
  // "75\n,0" -> "0,75"
  // ",1 25" -> "1,25"
  // ",0 75" -> "0,75"
  res = res.replace(/(\d+)\s*\n\s*,(\d+)/g, '$2,$1');
  res = res.replace(/,(\d+)\s+(\d+)/g, '$1,$2');
  res = res.replace(/(\d+)\s*,\s*(\d+)/g, '$1,$2');

  // 4. Reparar porcentajes invertidos:
  // "% 25" -> "25%"
  // "% 75" -> "75%"
  res = res.replace(/%\s*(\d+)/g, '$1%');

  // 5. Reparar expresiones matemáticas con puntos centrados o caracteres raros
  res = res.replace(/75\s*,0\s*75\s*,0\s*25\s*,1\s*25\s*,1\s*p[\s\n·*]+/g, 'p · 1,25 · 1,25 · 0,75 · 0,75\n\n');
  res = res.replace(/[•]/g, ' · ');

  // 6. Caracteres unicode rotos o cajas
  res = res.replace(/[\u25a1\u25aa\u25ab\u25fc\u25fd\ufffd\uf02d]/g, '');

  // 7. Reparar saltos de línea innecesarios entre palabras dentro de una misma oración
  // Reemplazar saltos de línea simples que cortan oraciones por un espacio
  const lines = res.split('\n');
  const mergedLines = [];
  let buffer = '';

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l) {
      if (buffer) {
        mergedLines.push(buffer);
        buffer = '';
      }
      mergedLines.push('');
      continue;
    }

    // Si la línea actual es un encabezado o fórmula aislada o inicio de pregunta
    if (l.startsWith('#') || l.startsWith('|') || l.startsWith('$$')) {
      if (buffer) {
        mergedLines.push(buffer);
        buffer = '';
      }
      mergedLines.push(l);
      continue;
    }

    if (!buffer) {
      buffer = l;
    } else {
      // Si la línea anterior termina en punto o signo de interrogación o dos puntos, puede ser nuevo párrafo
      if (/[.:?!]$/.test(buffer) && (l.startsWith('¿') || l.startsWith('A)') || l.startsWith('Si '))) {
        mergedLines.push(buffer);
        buffer = l;
      } else {
        buffer += ' ' + l;
      }
    }
  }
  if (buffer) mergedLines.push(buffer);

  res = mergedLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();

  return res;
}

async function fixAll() {
  console.log('🔍 Cargando preguntas desde scratch/paes_m1_2023_final_65.json...');
  const jsonPath = path.resolve(__dirname, '../scratch/paes_m1_2023_final_65.json');
  const preguntasRaw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  const fixedPreguntas = [];

  for (const p of preguntasRaw) {
    const cleanEnunciado = cleanMathString(p.enunciado);
    const cleanAlternativas = (p.alternativas || []).map(alt => ({
      ...alt,
      texto: cleanMathString(alt.texto)
    }));

    fixedPreguntas.push({
      ...p,
      enunciado: cleanEnunciado,
      alternativas: cleanAlternativas
    });
  }

  // Guardar copia limpia en scratch
  fs.writeFileSync(
    path.resolve(__dirname, '../scratch/paes_m1_2023_cleaned_65.json'),
    JSON.stringify(fixedPreguntas, null, 2),
    'utf8'
  );

  console.log('✅ Generado scratch/paes_m1_2023_cleaned_65.json');
  console.log('\n--- MUESTRA PREGUNTA 1 LIMPIA ---');
  console.log(fixedPreguntas[0].enunciado);
  console.log(JSON.stringify(fixedPreguntas[0].alternativas, null, 2));

  console.log('\n--- MUESTRA PREGUNTA 2 LIMPIA ---');
  console.log(fixedPreguntas[1].enunciado);
  console.log(JSON.stringify(fixedPreguntas[1].alternativas, null, 2));

  console.log('\n--- MUESTRA PREGUNTA 3 LIMPIA ---');
  console.log(fixedPreguntas[2].enunciado);
  console.log(JSON.stringify(fixedPreguntas[2].alternativas, null, 2));

  // Actualizar en Supabase
  console.log('\n🚀 Actualizando en Supabase...');
  for (const p of fixedPreguntas) {
    const num = String(p.numero).padStart(2, '0');
    const id = `preg-paes-m1-23-${num}`;

    const { error } = await supabase
      .from('preguntas')
      .update({
        enunciado: p.enunciado,
        alternativas: p.alternativas,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.warn(`  ⚠️ Error actualizando ${id}:`, error.message);
    } else {
      process.stdout.write(`.` );
    }
  }
  console.log('\n🎉 ¡Todas las preguntas de PAES M1 2023 actualizadas con éxito en Supabase!');
}

fixAll();
