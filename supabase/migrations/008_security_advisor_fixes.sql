-- ============================================================
-- Migración 008: Corrección de Advertencias del Security Advisor de Supabase
-- Proyecto: Sysget Saber
-- ============================================================

-- 1. Arreglar "Function Search Path Mutable" para public.set_updated_at()
-- Fijar 'search_path = public' para evitar secuestro de funciones por ruta de búsqueda mutable
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

-- 2. Asegurar que las funciones de utilidad no tengan permisos de ejecución anónima indebida si no son necesarias
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.set_updated_at() TO authenticated, service_role;
