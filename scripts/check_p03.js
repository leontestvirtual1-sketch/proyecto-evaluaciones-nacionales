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

async function main() {
  const { data: allQuestions, error } = await supabase
    .from('preguntas')
    .select('id, enunciado, imagen_url')
    .ilike('id', 'preg-paes-m1-23-%');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Total questions PAES M1 2023: ${allQuestions.length}`);
  const withImg = allQuestions.filter(q => q.imagen_url);
  console.log(`Questions with imagen_url: ${withImg.length}`);
  for (const q of withImg) {
    console.log(`  ${q.id}: ${q.imagen_url}`);
  }

  const withoutImg = allQuestions.filter(q => !q.imagen_url);
  console.log(`Questions WITHOUT imagen_url: ${withoutImg.length}`);
}

main();
