/**
 * scripts/setup_test_fixtures_v2.mjs
 * Versión con service_role - busca usuarios auth reales y sus perfiles
 */
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const envContent = readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
}

const sbAdmin = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function main() {
  // Listar todos los usuarios auth
  const { data: authData } = await sbAdmin.auth.admin.listUsers({ perPage: 100 });
  const users = authData?.users || [];
  
  console.log('=== TODOS LOS USUARIOS AUTH ===');
  for (const u of users) {
    console.log(`  ${u.email} | id=${u.id}`);
  }

  // Ahora buscar perfiles con service_role (bypassa RLS)
  const { data: perfiles, error } = await sbAdmin
    .from('perfiles')
    .select('id, nombre, apellido_paterno, email, rol, rbd, estado, plan')
    .order('rbd');

  console.log('\n=== TODOS LOS PERFILES (service_role) ===');
  if (error) console.error('Error:', error.message);
  for (const p of perfiles || []) {
    console.log(`  ${p.email} | rol=${p.rol} | rbd=${p.rbd} | estado=${p.estado} | plan=${p.plan}`);
  }

  // Cursos con rbd
  const { data: cursos } = await sbAdmin
    .from('cursos')
    .select('id, nombre, rbd')
    .order('rbd');
  
  console.log('\n=== CURSOS ===');
  for (const c of cursos || []) {
    console.log(`  ${c.id} | ${c.nombre} | rbd=${c.rbd}`);
  }

  // Evaluaciones propias (no del catálogo global)
  const { data: evals } = await sbAdmin
    .from('evaluaciones')
    .select('id, titulo, rbd, propietario_id')
    .limit(20);
  
  console.log('\n=== EVALUACIONES ===');
  for (const e of evals || []) {
    console.log(`  ${e.id} | rbd=${e.rbd} | propietario=${e.propietario_id} | ${e.titulo?.substring(0, 40)}`);
  }

  // Preguntas con propietario
  const { data: pregs } = await sbAdmin
    .from('preguntas')
    .select('id, rbd, propietario_id')
    .not('rbd', 'is', null)
    .limit(10);

  console.log('\n=== PREGUNTAS CON RBD ===');
  for (const p of pregs || []) {
    console.log(`  ${p.id} | rbd=${p.rbd} | propietario=${p.propietario_id}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
