/**
 * scripts/setup_test_fixtures.mjs
 * Consulta la DB para obtener los IDs necesarios para tenant-isolation.authenticated.test.ts
 * y verifica si existen los 2 docentes de test necesarios.
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
  console.log('🔍 Consultando fixtures disponibles en la DB...\n');

  // 1. Listar colegios (establecimientos) con RBD distintos
  const { data: perfiles } = await sbAdmin
    .from('perfiles')
    .select('id, nombre, apellido_paterno, email, rol, rbd, estado')
    .not('rbd', 'is', null)
    .neq('rol', 'admin')
    .order('rbd');
  
  console.log('=== PERFILES DOCENTES DISPONIBLES ===');
  const rbdSet = new Set();
  for (const p of perfiles || []) {
    rbdSet.add(p.rbd);
    console.log(`  ${p.email} | rol=${p.rol} | rbd=${p.rbd} | estado=${p.estado}`);
  }
  console.log(`\n  RBDs únicos: ${[...rbdSet].join(', ')}`);

  // 2. Listar cursos por RBD
  const { data: cursos } = await sbAdmin
    .from('cursos')
    .select('id, nombre, rbd')
    .order('rbd')
    .limit(10);
  
  console.log('\n=== CURSOS DISPONIBLES ===');
  for (const c of cursos || []) {
    console.log(`  id=${c.id} | ${c.nombre} | rbd=${c.rbd}`);
  }

  // 3. Listar evaluaciones por RBD
  const { data: evals } = await sbAdmin
    .from('evaluaciones')
    .select('id, titulo, rbd')
    .not('rbd', 'is', null)
    .limit(10);
  
  console.log('\n=== EVALUACIONES CON RBD ===');
  for (const e of evals || []) {
    console.log(`  id=${e.id} | rbd=${e.rbd} | ${e.titulo?.substring(0, 50)}`);
  }

  // 4. Listar preguntas con propietario
  const { data: pregs } = await sbAdmin
    .from('preguntas')
    .select('id, rbd, propietario_id')
    .not('rbd', 'is', null)
    .limit(5);
  
  console.log('\n=== PREGUNTAS CON RBD ===');
  for (const p of pregs || []) {
    console.log(`  id=${p.id} | rbd=${p.rbd} | propietario=${p.propietario_id}`);
  }

  // 5. Verificar si existen usuarios test
  const { data: authUsers } = await sbAdmin.auth.admin.listUsers({ perPage: 50 });
  const testUsers = authUsers?.users?.filter(u => 
    u.email?.includes('test') || u.email?.includes('Test')
  );
  console.log('\n=== USUARIOS AUTH CON "test" EN EMAIL ===');
  for (const u of testUsers || []) {
    console.log(`  id=${u.id} | email=${u.email}`);
  }

  // Resumen de RBDs distintos
  const rbds = [...rbdSet];
  if (rbds.length >= 2) {
    console.log('\n✅ HAY AL MENOS 2 RBDs DISTINTOS DISPONIBLES:');
    console.log(`   RBD A: ${rbds[0]}`);
    console.log(`   RBD B: ${rbds[1]}`);
    console.log('\n   Para ejecutar el test autenticado, necesitas:');
    console.log('   1. Un docente con email/password en el RBD A');
    console.log('   2. Datos (curso, evaluacion, pregunta) del RBD B');
  } else {
    console.log('\n⚠️  Solo hay 1 RBD. Para el test cross-tenant necesitas 2 colegios con datos.');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
