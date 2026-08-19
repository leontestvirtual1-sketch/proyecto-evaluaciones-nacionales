-- ============================================================
-- Migración 008: Solución Completa a Advertencias del Security Advisor
-- Proyecto: Sysget Saber
-- ============================================================

-- 1. CORREGIR "Function Search Path Mutable" en public.set_updated_at()
-- Se define explícitamente search_path = public y se restringen permisos
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.set_updated_at() TO authenticated, service_role;


-- 2. CORREGIR "Public / Signed-in Users Can Execute SECURITY DEFINER Function" 
-- en public.rls_auto_enable()
-- (Revoca ejecución a roles públicos/anónimos y autenticados para que no sea invocable vía REST API)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid 
    WHERE n.nspname = 'public' AND p.proname = 'rls_auto_enable'
  ) THEN
    -- Revocar permiso de ejecución anónimo y de usuarios normales
    REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
    -- Asignar solo a service_role (backend administrativo)
    GRANT EXECUTE ON FUNCTION public.rls_auto_enable() TO service_role;
  END IF;
END $$;
