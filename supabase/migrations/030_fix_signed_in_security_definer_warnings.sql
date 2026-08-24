-- ==============================================================================
-- Migración 030: Resolver advertencias "Signed-In Users Can Execute SECURITY DEFINER"
-- Fecha: 2026-08-23
-- 
-- 1. Convierte is_admin() a SECURITY INVOKER (resuelve la advertencia en Supabase)
-- 2. Revoca permisos de ejecución a authenticated/anon/PUBLIC en las funciones RPC
--    administrativas para que solo puedan ser invocadas de forma segura por service_role.
-- ==============================================================================

BEGIN;

-- 1. Convertir public.is_admin() a SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.perfiles
    WHERE id = auth.uid()
      AND (rol = 'admin' OR es_super_admin = TRUE)
  );
$$;

-- 2. Revocar permisos de ejecución a nivel PostgREST en las funciones SECURITY DEFINER
REVOKE EXECUTE ON FUNCTION public.admin_asignar_evaluacion_a_docente(UUID, TEXT, UUID, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_rechazar_solicitud_evaluacion(UUID, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.docente_solicitar_evaluacion(TEXT, TEXT) FROM PUBLIC, anon, authenticated;

-- Permisos exclusivos a service_role y postgres
GRANT EXECUTE ON FUNCTION public.admin_asignar_evaluacion_a_docente(UUID, TEXT, UUID, TEXT) TO service_role, postgres;
GRANT EXECUTE ON FUNCTION public.admin_rechazar_solicitud_evaluacion(UUID, TEXT) TO service_role, postgres;
GRANT EXECUTE ON FUNCTION public.docente_solicitar_evaluacion(TEXT, TEXT) TO service_role, postgres;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role, postgres;

COMMIT;
