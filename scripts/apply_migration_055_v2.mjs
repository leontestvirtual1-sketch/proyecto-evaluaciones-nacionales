/**
 * apply_migration_055_v2.mjs
 * Aplica migración 055 usando la Supabase REST API directamente.
 * Estrategia: usa fetch al endpoint /rest/v1/rpc con la función pg_query
 * si existe, o bien crea temporalmente una función SECURITY DEFINER para DDL.
 *
 * Alternativa robusta: usa la Supabase Management API (api.supabase.com)
 * con el access token si está disponible.
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Carga variables de entorno desde .env.local manualmente
const envContent = readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim();
  env[key] = val;
}

const supabaseUrl = env.VITE_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Faltan VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

// Extraer el project ref de la URL (ej: khtdzgfqjggycrcbrytw)
const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
console.log(`📦 Project Ref: ${projectRef}`);

const sbAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

/**
 * Ejecuta SQL usando el endpoint de Supabase Management API.
 * Requiere SUPABASE_ACCESS_TOKEN (personal access token, no service_role).
 * Fallback: intenta con pg_query RPC o exec_sql.
 */
async function executeSql(sql, description) {
  console.log(`\n🔧 ${description}`);

  // Método 1: Intentar vía Management API si hay access token
  const accessToken = env.SUPABASE_ACCESS_TOKEN;
  if (accessToken) {
    const url = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sql })
    });
    if (resp.ok) {
      const data = await resp.json();
      console.log(`  ✅ Management API OK:`, data);
      return true;
    }
    const errText = await resp.text();
    console.log(`  ⚠️  Management API falló (${resp.status}): ${errText}`);
  }

  // Método 2: Intentar vía RPC exec_sql (función personalizada)
  const { error: rpcErr } = await sbAdmin.rpc('exec_sql', { sql_text: sql });
  if (!rpcErr) {
    console.log(`  ✅ RPC exec_sql OK`);
    return true;
  }
  console.log(`  ⚠️  exec_sql no disponible: ${rpcErr.message}`);

  // Método 3: Intentar vía endpoint SQL directo de PostgREST (no soporta DDL)
  // No aplicable para DDL.

  return false;
}

async function verifyColumnsExist() {
  // Intenta hacer un select de la columna verificada_at para ver si ya existe
  const { data, error } = await sbAdmin
    .from('evaluaciones')
    .select('id, verificada_at')
    .limit(1);
  
  if (error) {
    if (error.message.includes('verificada_at') || error.code === '42703') {
      return false; // columna no existe
    }
    // Otro error
    console.log('  Error inesperado al verificar columnas:', error.message);
    return null;
  }
  return true; // columna existe
}

async function markVerifiedEvaluations() {
  const now = new Date().toISOString();
  const ids = ['eval-simce-mat-2m-e3', 'eval-paes-lect-2026-f103'];

  const { data, error } = await sbAdmin
    .from('evaluaciones')
    .update({ verificada_at: now, updated_at: now })
    .in('id', ids)
    .select('id, titulo, verificada_at');

  if (error) {
    console.error(`  ❌ Error marcando verificadas: ${error.message}`);
    return false;
  }
  console.log(`  ✅ Evaluaciones verificadas:`);
  for (const ev of (data || [])) {
    console.log(`     - ${ev.id}: ${ev.titulo} → verificada_at=${ev.verificada_at}`);
  }
  return true;
}

async function apply() {
  console.log('🚀 Migración 055 v2: Verificando estado de columnas...\n');

  // 1. Verificar si las columnas ya existen
  const columnsExist = await verifyColumnsExist();

  if (columnsExist === true) {
    console.log('✅ Columnas verificada_at y verificada_por YA EXISTEN en public.evaluaciones.');
    console.log('   Procediendo a marcar evaluaciones verificadas...');
    const ok = await markVerifiedEvaluations();
    if (ok) {
      console.log('\n✅ Migración 055 completada exitosamente.');
    }
    return;
  }

  if (columnsExist === false) {
    console.log('⚠️  Columnas NO existen. Intentando aplicar DDL...');

    const ddl = `
      ALTER TABLE public.evaluaciones
      ADD COLUMN IF NOT EXISTS verificada_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS verificada_por UUID;
    `;

    const ok = await executeSql(ddl, 'ALTER TABLE ADD COLUMN verificada_at, verificada_por');

    if (!ok) {
      console.error('\n❌ No se pudo aplicar el DDL automáticamente.');
      console.error('   Ejecuta manualmente en el SQL Editor de Supabase:');
      console.error('');
      console.error('   ALTER TABLE public.evaluaciones');
      console.error('   ADD COLUMN IF NOT EXISTS verificada_at TIMESTAMPTZ,');
      console.error('   ADD COLUMN IF NOT EXISTS verificada_por UUID;');
      console.error('');
      console.error('   Luego ejecuta: node scripts/apply_migration_055_v2.mjs');
      process.exit(1);
    }

    // Verificar de nuevo
    const verified = await verifyColumnsExist();
    if (!verified) {
      console.error('❌ Las columnas no se crearon correctamente.');
      process.exit(1);
    }
  }

  // 2. Marcar evaluaciones verificadas
  const marked = await markVerifiedEvaluations();
  if (marked) {
    console.log('\n✅ Migración 055 completada exitosamente.');
  } else {
    process.exit(1);
  }
}

apply().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
