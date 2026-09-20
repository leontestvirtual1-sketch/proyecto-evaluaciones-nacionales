/**
 * scripts/create_test_user_and_fixtures.mjs
 * 
 * Crea los fixtures necesarios para tenant-isolation.authenticated.test.ts:
 * 1. Crea un usuario de test para el colegio A (RBD 1234) con email/password conocido
 * 2. Crea una evaluación de test para el colegio B (RBD 31030)
 * 3. Genera el archivo .env.test.local con todas las variables necesarias
 */
import { readFileSync, writeFileSync } from 'fs';
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

const TEST_A_EMAIL = 'test.docente.a@sysget-test.local';
const TEST_A_PASSWORD = 'TestPassword123!';
const TEST_A_RBD = '1234';
const TEST_B_RBD = '31030';
const TEST_B_CURSO_ID = 'curso-prem-2m'; // 2° Medio A del colegio B
const TEST_B_PREGUNTA_ID = 'preg-len2m-01'; // pregunta del colegio B

async function main() {
  console.log('🔧 Configurando fixtures para tenant-isolation.authenticated.test.ts\n');

  // 1. Verificar/crear usuario de test A
  console.log('1. Buscando usuario de test A...');
  const { data: existingUsers } = await sbAdmin.auth.admin.listUsers({ perPage: 100 });
  let testUserA = existingUsers?.users?.find(u => u.email === TEST_A_EMAIL);

  if (testUserA) {
    console.log(`   ✅ Usuario de test ya existe: ${testUserA.id}`);
    // Actualizar contraseña para asegurar consistencia
    await sbAdmin.auth.admin.updateUserById(testUserA.id, { password: TEST_A_PASSWORD });
    console.log(`   ✅ Contraseña actualizada.`);
  } else {
    console.log(`   Creando usuario de test: ${TEST_A_EMAIL}`);
    const { data: created, error } = await sbAdmin.auth.admin.createUser({
      email: TEST_A_EMAIL,
      password: TEST_A_PASSWORD,
      email_confirm: true,
      user_metadata: { nombre: 'Test', apellido: 'Docente A' }
    });
    if (error) {
      console.error(`   ❌ Error creando usuario: ${error.message}`);
      process.exit(1);
    }
    testUserA = created.user;
    console.log(`   ✅ Usuario creado: ${testUserA.id}`);
  }

  // 2. Crear/verificar perfil para el usuario A en el colegio A
  console.log('\n2. Verificando perfil del docente A...');
  const { data: perfil, error: perfilErr } = await sbAdmin
    .from('perfiles')
    .select('id, rol, rbd')
    .eq('id', testUserA.id)
    .single();

  if (perfilErr || !perfil) {
    // Insertar perfil
    const { error: insertErr } = await sbAdmin
      .from('perfiles')
      .insert({
        id: testUserA.id,
        nombre: 'Test',
        apellido: 'Docente-A',
        email: TEST_A_EMAIL,
        rut: '99999999-9',
        rol: 'profesor',
        establecimiento: 'Colegio Mi Casa Test',
        rbd: TEST_A_RBD,
        estado: 'activo',
        plan: 'free',
        activo: true
      });
    if (insertErr) {
      console.error(`   ❌ Error creando perfil: ${insertErr.message}`);
      process.exit(1);
    }
    console.log(`   ✅ Perfil creado con RBD ${TEST_A_RBD}`);
  } else {
    console.log(`   ✅ Perfil existe: rol=${perfil.rol}, rbd=${perfil.rbd}`);
    if (perfil.rbd !== TEST_A_RBD) {
      await sbAdmin.from('perfiles').update({ rbd: TEST_A_RBD }).eq('id', testUserA.id);
      console.log(`   ✅ RBD actualizado a ${TEST_A_RBD}`);
    }
  }

  // 3. Crear evaluación de test para el colegio B
  console.log('\n3. Creando evaluación de test para colegio B...');
  const TEST_B_EVAL_ID = 'test-eval-rbd-b-isolation';
  const { error: evalErr } = await sbAdmin
    .from('evaluaciones')
    .upsert({
      id: TEST_B_EVAL_ID,
      titulo: '[TEST] Evaluación Aislamiento RBD B',
      curso_id: TEST_B_CURSO_ID,
      nivel: '2° Medio',
      profesor_id: 'f5e2cc1c-3d63-4799-ac40-c97f49c8602c', // María Teresa (Docente B)
      establecimiento: 'Escuela Premilitar',
      estado: 'borrador',
      tiempo_limite: 60,
      total_preguntas: 0,
      es_catalogo: false
    }, { onConflict: 'id' });

  if (evalErr) {
    console.error(`   ⚠️ Error creando evaluación de test: ${evalErr.message}`);
  } else {
    console.log(`   ✅ Evaluación de test creada/actualizada: ${TEST_B_EVAL_ID}`);
  }

  // 4. Generar .env.test.local
  console.log('\n4. Generando .env.test.local...');
  const envTestContent = `# .env.test.local — Variables para tenant-isolation.authenticated.test.ts
# IGNORADO POR GIT — NO COMMITEAR
# Generado automáticamente por scripts/create_test_user_and_fixtures.mjs

SUPABASE_URL=${env.VITE_SUPABASE_URL}
SUPABASE_ANON_KEY=${env.VITE_SUPABASE_ANON_KEY}

# Docente A: RBD 1234 (Colegio Mi Casa)
TEST_A_EMAIL=${TEST_A_EMAIL}
TEST_A_PASSWORD=${TEST_A_PASSWORD}
TEST_A_RBD=${TEST_A_RBD}

# Datos del Colegio B (Escuela Premilitar): RBD 31030
TEST_B_RBD=${TEST_B_RBD}
TEST_B_CURSO_ID=${TEST_B_CURSO_ID}
TEST_B_EVALUACION_ID=${TEST_B_EVAL_ID}
TEST_B_PREGUNTA_ID=${TEST_B_PREGUNTA_ID}
`;

  writeFileSync('.env.test.local', envTestContent);
  console.log('   ✅ .env.test.local generado.\n');

  console.log('='.repeat(60));
  console.log('✅ FIXTURES LISTOS. Ejecuta:');
  console.log('   npx tsx --env-file=.env.test.local tests/tenant-isolation.authenticated.test.ts');
  console.log('='.repeat(60));
}

main().catch(e => { console.error(e); process.exit(1); });
