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

// Palabras que NUNCA deberían aparecer dentro del texto de una alternativa
// (indican "bleed" de tablas/marcas de agua de otra parte de la página del PDF)
const BLACKLIST_ALTERNATIVA = [
  /forma\s+\d+\s*[|│▌]?\s*\d{4}/i,
  /precio\s+original/i,
  /oferta\s+de\s+la\s+semana/i,
  /equivalencia/i,
  /kilobyte|megabyte|gigabyte|terabyte/i,
  /productos\s+de\s+oferta/i,
  /leche\s*\(\s*1\s*L/i,
];

// Heurística de exponente perdido: 2-4 tokens sueltos (letra+número o solo número) separados por espacio,
// sin ningún operador matemático (+, -, ·, /, %, ^, etc.) — típico de "base exp" mal extraído
const RE_NUMEROS_SUELTOS = /^\s*[a-zA-Z]?\s*\d+(\s+\d+){1,3}\s*[·]?\s*$/;

function alternativaSospechosa(texto) {
  if (BLACKLIST_ALTERNATIVA.some(re => re.test(texto))) return 'bleed_contenido_ajeno';
  if (RE_NUMEROS_SUELTOS.test(texto)) return 'posible_exponente_perdido';
  if (texto.trim().length > 200) return 'alternativa_demasiado_larga';
  if (/alternativa\s+[ABCD]/i.test(texto)) return 'placeholder_sin_contenido';
  return null;
}

async function main() {
  const filtroFuente = process.argv[2]; // opcional: filtrar por fuente, ej. "Forma 113"
  const { data, error } = await supabase
    .from('preguntas')
    .select('id, fuente, enunciado, alternativas, respuesta_correcta');
  if (error) throw error;

  const sospechosas = [];
  for (const row of data) {
    if (filtroFuente && !String(row.fuente || '').includes(filtroFuente)) continue;
    const alts = Array.isArray(row.alternativas) ? row.alternativas : [];
    for (const alt of alts) {
      const motivo = alternativaSospechosa(String(alt.texto || ''));
      if (motivo) {
        sospechosas.push({
          id: row.id,
          fuente: row.fuente,
          respuesta_correcta: row.respuesta_correcta,
          letra: alt.letra,
          motivo,
          texto: alt.texto,
          enunciado_excerpt: String(row.enunciado || '').slice(0, 120),
        });
      }
    }
  }

  const outDir = path.resolve(__dirname, '../scratch_reportes');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'preguntas_sospechosas.json');
  fs.writeFileSync(outPath, JSON.stringify(sospechosas, null, 2));

  console.log(`Encontradas ${sospechosas.length} alternativas sospechosas.`);
  console.log(`Reporte escrito en: ${outPath}`);
  if (sospechosas.length > 0) {
    console.table(
      sospechosas.map(s => ({
        id: s.id,
        letra: s.letra,
        motivo: s.motivo,
        texto: String(s.texto || '').slice(0, 60),
      }))
    );
  }
}

main().catch(e => { console.error(e); process.exit(1); });
