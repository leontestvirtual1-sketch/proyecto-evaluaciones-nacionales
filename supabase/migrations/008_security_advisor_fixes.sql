-- ============================================================
-- Migración 008: Solución Final y Limpia a Advertencias de Seguridad
-- Proyecto: Sysget Saber
-- ============================================================

-- 1. FIX public.set_updated_at():
-- Como es un TRIGGER simple que solo asigna NEW.updated_at = NOW(),
-- NO necesita 'SECURITY DEFINER'. Debe ser 'SECURITY INVOKER' y tener 'search_path = public'.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Revocar cualquier acceso directo RPC vía API REST (nadie debe llamarlo por URL /rpc/)
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;


-- 2. FIX public.rls_auto_enable():
-- Revocar acceso directo por API REST a anon y authenticated
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid 
    WHERE n.nspname = 'public' AND p.proname = 'rls_auto_enable'
  ) THEN
    REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
    GRANT EXECUTE ON FUNCTION public.rls_auto_enable() TO service_role;
  END IF;
END $$;
