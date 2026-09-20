import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Faltan variables de entorno Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function apply() {
  console.log('🚀 Aplicando Migración 055: verificada_at en public.evaluaciones...');

  // 1. Ejecutar DDL vía RPC execute_sql_internal si está disponible, o actualizar registros
  // Intentemos con execute_sql_internal
  const ddl = `
    ALTER TABLE public.evaluaciones
    ADD COLUMN IF NOT EXISTS verificada_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS verificada_por UUID;
  `;

  const { error: ddlErr } = await supabase.rpc('execute_sql_internal', { sql: ddl });
  if (ddlErr) {
    console.log('execute_sql_internal no disponible o falló:', ddlErr.message);
    // Verificar si las columnas ya existen intentando un update
  } else {
    console.log('✅ Columnas verificada_at y verificada_por agregadas.');
  }

  // 2. Marcar evaluaciones verificadas
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('evaluaciones')
    .update({ verificada_at: now, updated_at: now })
    .in('id', ['eval-simce-mat-2m-e3', 'eval-paes-lect-2026-f103'])
    .select('id, titulo, verificada_at');

  if (error) {
    console.error('❌ Error actualizando verificada_at:', error.message);
    process.exit(1);
  }

  console.log('✅ Evaluaciones marcadas con verificada_at:', data);
}

apply();
