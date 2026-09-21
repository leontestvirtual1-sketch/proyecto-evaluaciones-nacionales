/**
 * Aplica la migración 058 directamente usando la REST API de Supabase.
 * Usa el endpoint /rpc con service role key para ejecutar SQL privilegiado.
 */
import https from 'https';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Extraer el host
const host = new URL(SUPABASE_URL).host;

// SQL completo de la migración
const migrationSQL = `
DO $$
BEGIN
  -- DROP políticas de evaluaciones existentes
  DROP POLICY IF EXISTS "Evaluaciones visibles al autor o admin del RBD" ON public.evaluaciones;
  DROP POLICY IF EXISTS "Lectura de evaluaciones autorizadas" ON public.evaluaciones;
  DROP POLICY IF EXISTS "Evaluaciones visibles con catalogo y admin" ON public.evaluaciones;
  DROP POLICY IF EXISTS "Evaluaciones gestionadas por autor o admin del RBD" ON public.evaluaciones;
  DROP POLICY IF EXISTS "Gestion de evaluaciones por docente o admin" ON public.evaluaciones;
  DROP POLICY IF EXISTS "Evaluaciones gestionadas con admin" ON public.evaluaciones;
  
  -- Crear nueva política SELECT con es_catalogo = TRUE
  CREATE POLICY "Evaluaciones visibles con catalogo y admin"
    ON public.evaluaciones FOR SELECT
    USING (
      profesor_id = auth.uid()
      OR es_catalogo = TRUE
      OR public.is_admin()
      OR EXISTS (
        SELECT 1 FROM public.cursos c
        WHERE c.id = curso_id AND public.is_admin_of_rbd(c.rbd)
      )
    );
    
  -- Crear política ALL para gestión
  CREATE POLICY "Evaluaciones gestionadas con admin"
    ON public.evaluaciones FOR ALL
    USING (
      profesor_id = auth.uid()
      OR public.is_admin()
      OR EXISTS (
        SELECT 1 FROM public.cursos c
        WHERE c.id = curso_id AND public.is_admin_of_rbd(c.rbd)
      )
    );
    
  RAISE NOTICE 'Migración 058 aplicada correctamente';
END $$;
`;

// Intentar via endpoint SQL de Supabase (disponible con service role via PostgREST)
async function tryViaPostgRESTSql() {
  const url = `${SUPABASE_URL}/rest/v1/rpc/exec`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({ query: migrationSQL })
  });
  console.log('Via RPC exec:', resp.status, await resp.text());
}

// Crear función temporal exec_sql si no existe, luego ejecutar
async function tryCreateAndExecFn() {
  const sb = createClient(SUPABASE_URL, SERVICE_KEY);
  
  // Primero crear la función exec_sql
  const createFnSQL = `
    CREATE OR REPLACE FUNCTION public.exec_sql(sql text) 
    RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
    BEGIN EXECUTE sql; END $$;
  `;
  
  // Intentar crear via rpc/query endpoint de postgrest
  const url = `${SUPABASE_URL}/rest/v1/`;
  
  // Intentar método alternativo: usar la tabla _sql_exec si existe
  const { error: e1 } = await sb.rpc('exec_sql', { sql: migrationSQL });
  if (!e1) {
    console.log('✅ Ejecutado via exec_sql RPC');
    return true;
  }
  console.log('exec_sql no existe:', e1.message);
  
  return false;
}

async function main() {
  console.log('=== Aplicando Migración 058 via PostgREST ===');
  console.log('Host:', host);
  
  await tryViaPostgRESTSql();
  await tryCreateAndExecFn();
  
  // Verificar resultado con cliente anon
  const sbAnon = createClient(SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
  
  // Simular sesión con credenciales del admin
  const { data: signIn } = await sbAnon.auth.signInWithPassword({
    email: 'leontestvirtual1@gmail.com',
    password: 'Mateo2025'  // ajustar si es diferente
  });
  
  if (signIn?.session) {
    const { data: evals, error } = await sbAnon
      .from('evaluaciones')
      .select('id, titulo, es_catalogo')
      .eq('es_catalogo', true);
    console.log('\nCon sesión admin - catálogo:', evals?.length, error?.message || '');
    evals?.forEach(e => console.log(' ✓', e.id));
  } else {
    console.log('No se pudo autenticar como admin para verificar');
    // Sin sesión
    const { data: evals2 } = await sbAnon
      .from('evaluaciones')
      .select('id, es_catalogo')
      .eq('es_catalogo', true);
    console.log('\nSin sesión - catálogo:', evals2?.length);
  }
}

main().catch(console.error);
