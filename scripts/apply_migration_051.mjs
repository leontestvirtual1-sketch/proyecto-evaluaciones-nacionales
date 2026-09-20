import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
let url = '', key = '';
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
    url = trimmed.slice('VITE_SUPABASE_URL='.length).replace(/['"]/g, '');
  }
  if (trimmed.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
    key = trimmed.slice('SUPABASE_SERVICE_ROLE_KEY='.length).replace(/['"]/g, '');
  }
}

if (!url || !key) {
  console.error('Faltan credenciales en .env.local');
  process.exit(1);
}

const sb = createClient(url, key);

async function main() {
  console.log('=== APLICANDO MIGRACIÓN 051 (CONTENCIÓN FASE 1.1) ===');
  const { data, error } = await sb
    .from('evaluaciones')
    .update({
      es_catalogo: false,
      estado: 'borrador',
      updated_at: new Date().toISOString()
    })
    .in('id', ['eval-simce-mat-2m-e3', 'eval-simce-len-2m-e6'])
    .select('id, titulo, es_catalogo, estado');

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  console.log('Evaluaciones actualizadas con éxito:');
  console.table(data);
}

main();
