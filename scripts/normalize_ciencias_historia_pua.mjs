import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => {
  const m = env.match(new RegExp(`^${k}=(.*)$`, 'm'));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null;
};
const supabase = createClient(getEnv('VITE_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));

function cleanSymbolFont(text) {
  if (!text) return text;
  return text
    // Paréntesis, corchetes y llaves
    .replace(/[\uF028\uF0E6\uF0E7\uF0E8]/g, '(')
    .replace(/[\uF029\uF0F6\uF0F7\uF0F8]/g, ')')
    .replace(/[\uF05B\uF0E9\uF0EA\uF0EB]/g, '[')
    .replace(/[\uF05D\uF0F9\uF0FA\uF0FB]/g, ']')
    .replace(/\uF07B/g, '{')
    .replace(/\uF07D/g, '}')
    // Operadores básicos y multiplicaciones
    .replace(/\uF02B/g, '+')
    .replace(/[\uF02D\u2013\u2014]/g, '-')
    .replace(/[\uF0B7\uF0D7]/g, '·')
    .replace(/\uF0B8/g, '÷')
    .replace(/\uF03D/g, '=')
    .replace(/\uF0B9/g, '≠')
    .replace(/\uF0BB/g, '≈')
    .replace(/\uF03C/g, '<')
    .replace(/\uF03E/g, '>')
    .replace(/\uF0A3/g, '≤')
    .replace(/\uF0B3/g, '≥')
    // Símbolos matemáticos y conjuntos
    .replace(/\uF070/g, 'π')
    .replace(/\uF0B0/g, '°')
    .replace(/\uF0A5/g, '∞')
    .replace(/\uF0C7/g, '∩')
    .replace(/\uF0C8/g, '∪')
    .replace(/\uF0CE/g, '∈')
    .replace(/\uF07E/g, '~')
    .replace(/\uF05E/g, '^')
    // Letras griegas y constantes científicas
    .replace(/\uF061/g, 'α')
    .replace(/\uF062/g, 'β')
    .replace(/\uF071/g, 'θ')
    .replace(/\uF072/g, 'ρ')
    .replace(/\uF073/g, 'σ')
    .replace(/\uF044/g, 'Δ')
    .replace(/\uF064/g, 'δ')   // delta minúscula
    .replace(/\uF06C/g, 'λ')
    .replace(/\uF067/g, 'γ')
    .replace(/\uF077/g, 'ω')
    .replace(/\uF057/g, 'Ω')
    .replace(/[\uF06D\uF0B5]/g, 'μ')
    .replace(/\uF065/g, 'ε')
    .replace(/\uF066/g, 'φ')
    .replace(/\uF06E/g, 'η')
    // Operadores y flechas de reacciones y vectores
    .replace(/\uF0AE/g, '→')
    .replace(/\uF0AC/g, '←')
    .replace(/\uF0DF/g, '↔')
    .replace(/\uF0B1/g, '±')
    .replace(/\uF02F/g, '/')
    .replace(/\uF020/g, ' ')   // Symbol font space
    // Íconos auxiliares, viñetas y marcas registradas
    .replace(/\uF0FC/g, '✓')
    .replace(/[\uF0E3\uF8E9]/g, '©')
    .replace(/\uF0E2/g, '®')
    .replace(/[\uF138\uF0D8]/g, '►');
}

function hasPUA(text) {
  if (!text) return false;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= 0xE000 && code <= 0xF8FF) return true;
  }
  return false;
}

async function run() {
  console.log("=== NORMALIZACIÓN COMPLETA DE PUA EN SUPABASE (PAGINADA) ===");
  
  let allPregs = [];
  let from = 0;
  const PAGE_SIZE = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('preguntas')
      .select('*')
      .range(from, from + PAGE_SIZE - 1);
    
    if (error) {
      console.error("Error al obtener preguntas:", error);
      process.exit(1);
    }
    allPregs = allPregs.concat(data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  console.log(`Total preguntas recuperadas de Supabase: ${allPregs.length}`);

  const toUpdate = [];
  const unmappedPUA = new Set();

  for (const p of allPregs) {
    let changed = false;
    let newEnunciado = p.enunciado;
    let newAlternativas = p.alternativas;

    if (hasPUA(p.enunciado)) {
      newEnunciado = cleanSymbolFont(p.enunciado);
      changed = true;
      if (hasPUA(newEnunciado)) {
        for (let i = 0; i < newEnunciado.length; i++) {
          const c = newEnunciado.charCodeAt(i);
          if (c >= 0xE000 && c <= 0xF8FF) {
            unmappedPUA.add('U+' + c.toString(16).toUpperCase());
          }
        }
      }
    }

    if (Array.isArray(p.alternativas)) {
      const updatedAlts = p.alternativas.map(alt => {
        if (hasPUA(alt.texto)) {
          changed = true;
          const cleanedText = cleanSymbolFont(alt.texto);
          if (hasPUA(cleanedText)) {
            for (let i = 0; i < cleanedText.length; i++) {
              const c = cleanedText.charCodeAt(i);
              if (c >= 0xE000 && c <= 0xF8FF) {
                unmappedPUA.add('U+' + c.toString(16).toUpperCase());
              }
            }
          }
          return { ...alt, texto: cleanedText };
        }
        return alt;
      });
      if (changed) {
        newAlternativas = updatedAlts;
      }
    }

    if (changed) {
      toUpdate.push({
        id: p.id,
        asig: p.asignatura_id,
        enunciado: newEnunciado,
        alternativas: newAlternativas,
        respuesta_correcta: p.respuesta_correcta, // GARANTÍA DE INMUTABILIDAD
      });
    }
  }

  console.log(`Preguntas identificadas para normalizar: ${toUpdate.length}`);
  if (unmappedPUA.size > 0) {
    console.warn(`ADVERTENCIA: Se encontraron caracteres PUA no contemplados:`, Array.from(unmappedPUA));
  }

  if (toUpdate.length === 0) {
    console.log("No hay preguntas con PUA pendientes de actualizar.");
    return;
  }

  // Generar SQL para migración 064
  let sqlMigration = `-- Migración 064: Normalización de símbolos científicos y viñetas PUA en Ciencias, Historia y Lenguaje PAES\n`;
  sqlMigration += `-- Fecha: ${new Date().toISOString()}\n`;
  sqlMigration += `-- Cantidad de preguntas actualizadas: ${toUpdate.length}\n\n`;

  for (const item of toUpdate) {
    const escEnunciado = item.enunciado.replace(/'/g, "''");
    const escAlts = JSON.stringify(item.alternativas).replace(/'/g, "''");
    sqlMigration += `UPDATE public.preguntas SET enunciado = '${escEnunciado}', alternativas = '${escAlts}'::jsonb WHERE id = '${item.id}';\n`;
  }

  fs.writeFileSync('supabase/migrations/064_normalize_ciencias_historia_pua.sql', sqlMigration, 'utf8');
  console.log("Migración 064 guardada en supabase/migrations/064_normalize_ciencias_historia_pua.sql");

  console.log("Aplicando actualizaciones a Supabase...");
  let successCount = 0;
  for (const item of toUpdate) {
    const { error: updError } = await supabase
      .from('preguntas')
      .update({
        enunciado: item.enunciado,
        alternativas: item.alternativas
      })
      .eq('id', item.id);

    if (updError) {
      console.error(`Error al actualizar pregunta ${item.id}:`, updError);
    } else {
      successCount++;
    }
  }

  console.log(`Actualizadas con éxito: ${successCount} / ${toUpdate.length}`);
}

run();
