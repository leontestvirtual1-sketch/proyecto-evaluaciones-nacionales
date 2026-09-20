import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

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

const sb = createClient(url, key);
const { data, error } = await sb.from('preguntas').select('*').ilike('id', 'preg-mat2m-e3-%').order('id');
if (error) {
  console.error('Error:', error);
} else {
  console.log('Total preguntas encontradas:', data.length);
  fs.writeFileSync('scratch/supabase_mat2m_e3_current.json', JSON.stringify(data, null, 2), 'utf8');
  console.log('Guardado en scratch/supabase_mat2m_e3_current.json');
}
