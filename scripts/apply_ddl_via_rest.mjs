/**
 * apply_ddl_via_rest.mjs
 * Aplica DDL usando el endpoint interno de Supabase que acepta SQL raw
 * a través del REST API con Authorization Bearer service_role.
 *
 * Nota: Supabase expone /rest/v1/rpc para funciones, pero no para DDL.
 * Sin embargo, podemos crear temporalmente una función SQL que ejecute DDL
 * y luego llamarla vía RPC.
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Carga variables de entorno
const envContent = readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
}

const supabaseUrl = env.VITE_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
const projectRef = new URL(supabaseUrl).hostname.split('.')[0];

const sbAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function applyDDLViaFunction() {
  console.log('🚀 Estrategia: Crear función temporal para DDL y ejecutar via RPC\n');

  // Paso 1: Crear una función SQL temporal que ejecute el ALTER TABLE
  const createFn = `
    CREATE OR REPLACE FUNCTION public._temp_add_verificada_cols()
    RETURNS TEXT
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      ALTER TABLE public.evaluaciones
        ADD COLUMN IF NOT EXISTS verificada_at TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS verificada_por UUID;
      RETURN 'OK: Columns added';
    EXCEPTION WHEN OTHERS THEN
      RETURN 'ERROR: ' || SQLERRM;
    END;
    $$;
  `;

  // Intentar crear la función via fetch directo al endpoint SQL de Supabase
  // usando el formato de query que acepta el proxy de Supabase
  const url = `${supabaseUrl}/rest/v1/rpc/_temp_add_verificada_cols`;
  
  // Primero intentamos si la función ya existe (de una corrida anterior)
  const { data: existingData, error: existingErr } = await sbAdmin.rpc('_temp_add_verificada_cols');
  
  if (!existingErr && existingData) {
    console.log('✅ Función temporal encontrada. Resultado:', existingData);
    return existingData === 'OK: Columns added' || existingData.startsWith('OK');
  }

  console.log('   Función no existe aún. Necesita crearse via SQL Editor.');
  console.log('   Error:', existingErr?.message);
  return false;
}

async function checkColumnsExist() {
  console.log('\n🔍 Verificando si columnas verificada_at existen...');
  
  // Usar information_schema via RPC si existe, o intentar select directo
  const { data, error } = await sbAdmin
    .from('evaluaciones')
    .select('id, verificada_at')
    .limit(1);
  
  if (error && (error.message.includes('verificada_at') || error.code === '42703')) {
    console.log('   ❌ Columna verificada_at NO existe.');
    return false;
  }
  if (error) {
    console.log('   ⚠️  Error inesperado:', error.message);
    return null;
  }
  console.log('   ✅ Columna verificada_at EXISTE.');
  return true;
}

async function markVerifiedEvaluations() {
  console.log('\n📋 Marcando evaluaciones como verificadas...');
  const now = new Date().toISOString();
  const ids = ['eval-simce-mat-2m-e3', 'eval-paes-lect-2026-f103'];

  const { data, error } = await sbAdmin
    .from('evaluaciones')
    .update({ verificada_at: now, updated_at: now })
    .in('id', ids)
    .select('id, titulo, verificada_at');

  if (error) {
    console.error('   ❌ Error:', error.message);
    return false;
  }
  if (!data || data.length === 0) {
    console.log('   ⚠️  No se encontraron evaluaciones con esos IDs. Verificando IDs disponibles...');
    const { data: allEvals } = await sbAdmin
      .from('evaluaciones')
      .select('id, titulo')
      .limit(20);
    console.log('   IDs disponibles:', allEvals?.map(e => e.id));
    return false;
  }
  for (const ev of data) {
    console.log(`   ✅ ${ev.id}: ${ev.titulo} → ${ev.verificada_at}`);
  }
  return true;
}

async function printManualInstructions() {
  console.log('\n' + '='.repeat(70));
  console.log('🛑 DDL MANUAL REQUERIDO');
  console.log('='.repeat(70));
  console.log('\nAbre el SQL Editor de Supabase en:');
  console.log(`https://supabase.com/dashboard/project/${projectRef}/sql/new\n`);
  console.log('Y ejecuta este SQL:\n');
  console.log('─'.repeat(50));
  console.log(`-- Migración 055: Agregar columnas de verificación`);
  console.log(`ALTER TABLE public.evaluaciones`);
  console.log(`ADD COLUMN IF NOT EXISTS verificada_at TIMESTAMPTZ,`);
  console.log(`ADD COLUMN IF NOT EXISTS verificada_por UUID;`);
  console.log('─'.repeat(50));
  console.log('\nDespués ejecuta: node scripts/apply_ddl_via_rest.mjs');
  console.log('='.repeat(70) + '\n');
}

async function main() {
  const exists = await checkColumnsExist();
  
  if (exists === true) {
    const marked = await markVerifiedEvaluations();
    if (marked) {
      console.log('\n✅ Migración 055 COMPLETA.');
    }
    return;
  }

  // Las columnas no existen - intentar via función temporal
  const ok = await applyDDLViaFunction();
  if (ok) {
    // Verificar de nuevo
    const nowExists = await checkColumnsExist();
    if (nowExists) {
      await markVerifiedEvaluations();
      console.log('\n✅ Migración 055 COMPLETA.');
      return;
    }
  }

  // No se pudo aplicar automáticamente
  await printManualInstructions();
  process.exit(2);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
