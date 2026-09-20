/**
 * tests/tenant-isolation.authenticated.test.ts  (BORRADOR)
 *
 * Prueba aislamiento REAL entre dos colegios con usuarios autenticados.
 * Ejecutar SOLO contra STAGING (o un proyecto de pruebas), nunca contra producción.
 *
 * Variables de entorno (en .env.test.local, ignorado por git):
 *   SUPABASE_URL, SUPABASE_ANON_KEY
 *   TEST_A_EMAIL, TEST_A_PASSWORD, TEST_A_RBD      -> docente del colegio A
 *   TEST_B_RBD, TEST_B_CURSO_ID, TEST_B_EVALUACION_ID, TEST_B_PREGUNTA_ID -> datos del colegio B
 *   REQUIRE_TENANT_TESTS=1  -> falla si faltan variables (usar en CI)
 *
 * Uso mínimo de fixtures: en staging crear 2 docentes (A y B) y 1 curso, 1 evaluación
 * y 1 pregunta del colegio B (ver PLAN_FASE0, paso 0.5).
 */
import { createClient } from '@supabase/supabase-js';

const env = process.env;
const REQUIRED = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'TEST_A_EMAIL', 'TEST_A_PASSWORD', 'TEST_A_RBD',
  'TEST_B_RBD', 'TEST_B_CURSO_ID', 'TEST_B_EVALUACION_ID', 'TEST_B_PREGUNTA_ID'];
const missing = REQUIRED.filter((k) => !env[k]);

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => Promise<void>) {
  try { await fn(); passed++; console.log(`  PASS  ${name}`); }
  catch (e: any) { failed++; console.error(`  FAIL  ${name}\n        ${e?.message ?? e}`); }
}
function assert(cond: unknown, msg: string) { if (!cond) throw new Error(msg); }

async function main() {
  if (missing.length) {
    const msg = `Pruebas de aislamiento OMITIDAS: faltan variables (${missing.join(', ')})`;
    if (env.REQUIRE_TENANT_TESTS === '1') { console.error(msg); process.exit(1); }
    console.warn(`\n*** ${msg} ***\n*** Esto NO es un aprobado: el aislamiento no fue verificado. ***`);
    return;
  }

  const A_RBD = env.TEST_A_RBD!;
  const B_RBD = env.TEST_B_RBD!;
  const anon = createClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!);
  const a = createClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!);
  const { data: login, error: loginErr } = await a.auth.signInWithPassword({
    email: env.TEST_A_EMAIL!, password: env.TEST_A_PASSWORD!,
  });
  if (loginErr || !login.user) throw new Error(`No se pudo iniciar sesión como docente A: ${loginErr?.message}`);
  const aId = login.user.id;

  console.log('\n== Lectura: el docente A solo ve datos de su RBD ==');
  for (const tabla of ['cursos', 'evaluaciones', 'preguntas', 'perfiles'] as const) {
    await test(`A no ve filas de ${tabla} del RBD B`, async () => {
      const { data, error } = await a.from(tabla).select('id, rbd').eq('rbd', B_RBD);
      assert(!error, `error inesperado: ${error?.message}`);
      assert((data ?? []).length === 0, `${tabla}: A ve ${(data ?? []).length} filas del RBD B`);
    });
  }
  await test('A no ve rendiciones de la evaluación de B', async () => {
    const { data } = await a.from('rendiciones').select('id').eq('prueba_id', env.TEST_B_EVALUACION_ID!);
    assert((data ?? []).length === 0, 'A ve rendiciones de una evaluación de otro colegio');
  });

  console.log('\n== Escalada de privilegios sobre el propio perfil ==');
  for (const cambio of [{ es_super_admin: true }, { rol: 'admin' }, { rbd: B_RBD }, { estado: 'activo' }, { plan: 'institucional' }]) {
    await test(`A no puede modificar su perfil con ${JSON.stringify(cambio)}`, async () => {
      await a.from('perfiles').update(cambio as any).eq('id', aId);
      const { data } = await a.from('perfiles').select('es_super_admin, rol, rbd, plan').eq('id', aId).single();
      assert(data && data.es_super_admin !== true, 'A se convirtió en super admin');
      assert(data && data.rol !== 'admin', 'A cambió su rol a admin');
      assert(data && data.rbd === A_RBD, 'A cambió su RBD');
    });
  }

  console.log('\n== Escritura cruzada ==');
  await test('A no puede crear una evaluación en un curso de B', async () => {
    const { error } = await a.from('evaluaciones').insert({
      id: `test-tenant-${Date.now()}`, titulo: 'test aislamiento', curso_id: env.TEST_B_CURSO_ID,
    } as any);
    assert(error, 'la inserción en un curso de otro colegio NO fue rechazada');
  });
  await test('A no puede modificar una pregunta de B', async () => {
    const { data } = await a.from('preguntas').update({ enunciado: 'manipulada' }).eq('id', env.TEST_B_PREGUNTA_ID!).select();
    assert((data ?? []).length === 0, 'A modificó una pregunta de otro colegio');
  });
  await test('A no puede insertar una rendición en la evaluación de B', async () => {
    const { error } = await a.from('rendiciones').insert({
      id: `test-rend-${Date.now()}`, prueba_id: env.TEST_B_EVALUACION_ID, alumno_id: aId,
    } as any);
    assert(error, 'la rendición cruzada NO fue rechazada');
  });

  console.log('\n== Regresión funcional: crear pregunta sin enviar rbd ==');
  await test('la pregunta creada por A queda con el RBD de A y A como propietario', async () => {
    const id = `test-preg-${Date.now()}`;
    const { error } = await a.from('preguntas').insert({
      id,
      asignatura_id: 'asig-1',
      nivel: '2° Medio',
      dificultad: 'media',
      enunciado: 'test',
      tipo: 'seleccion_multiple',
      alternativas: [],
      respuesta_correcta: 'A',
    } as any);
    assert(!error, `A no pudo crear una pregunta propia: ${error?.message}`);
    const { data } = await a.from('preguntas').select('rbd, propietario_id').eq('id', id).single();
    assert(data?.rbd === A_RBD && data?.propietario_id === aId, 'la pregunta no quedó estampada con el tenant de A');
    await a.from('preguntas').delete().eq('id', id);
  });

  console.log('\n== Anónimo ==');
  await test('anon no puede ejecutar admin_cambiar_estado_usuario', async () => {
    const { error } = await anon.rpc('admin_cambiar_estado_usuario', {
      p_target_user_id: aId, p_nuevo_estado: 'activo', p_nuevo_plan: 'free',
    });
    assert(error, 'la RPC sensible es ejecutable por anon');
  });
  await test('anon no lee tablas críticas', async () => {
    for (const t of ['perfiles', 'cursos', 'evaluaciones', 'preguntas', 'rendiciones']) {
      const { data } = await anon.from(t).select('id').limit(1);
      assert((data ?? []).length === 0, `anon lee filas de ${t}`);
    }
  });

  console.log('\n== Storage ==');
  // Usar PNG válido (1x1 transparente) para probar aislamiento por ruta y no por tipo MIME
  const pngBlob = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 10, 73, 68, 65, 84, 120, 156, 99, 0, 1, 0, 0, 5, 0, 1, 13, 10, 45, 180, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);
  await test('A no puede escribir en rutas del catálogo', async () => {
    const { error } = await a.storage.from('evaluaciones-media')
      .upload(`simce_test/${Date.now()}.png`, pngBlob, { contentType: 'image/png', upsert: true });
    assert(error, 'A pudo escribir fuera de uploads/<su rbd>/');
  });
  await test('A sí puede escribir en uploads/<su rbd>/', async () => {
    const path = `uploads/${A_RBD}/test_${Date.now()}.png`;
    const { error } = await a.storage.from('evaluaciones-media').upload(path, pngBlob, { contentType: 'image/png' });
    assert(!error, `A no pudo subir a su propia carpeta: ${error?.message}`);
    await a.storage.from('evaluaciones-media').remove([path]);
  });

  console.log(`\nResultado: ${passed} OK, ${failed} fallidas`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
