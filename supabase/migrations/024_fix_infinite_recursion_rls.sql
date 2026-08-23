-- =====================================================================
-- Migración 024: Corrección de Recursión Infinita en RLS (Error 42P17)
-- Fecha: 2026-08-23
--
-- Causa raíz:
--   La política RLS "Perfiles lectura autorizada" y "Preguntas lectura..."
--   realizaban subconsultas directas sobre public.perfiles para verificar
--   si el usuario actual era admin (SELECT ... FROM public.perfiles ...).
--   Esto causaba que PostgreSQL re-evaluara la misma política de SELECT
--   en bucle infinito (error 42P17) y abortara la consulta a preguntas.
--
-- Solución:
--   1. Crear función SECURITY DEFINER public.is_admin() que consulta perfiles
--      con privilegios del sistema, sin disparar RLS ni recursión.
--   2. Reescribir políticas de public.perfiles y public.preguntas usando
--      public.is_admin().
-- =====================================================================

BEGIN;

-- 1. Función que determina si el usuario actual es admin, SIN disparar RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.perfiles
    WHERE id = auth.uid()
      AND (rol = 'admin' OR es_super_admin = TRUE)
  )
$$;

-- Otorgar ejecución a usuarios autenticados
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 2. Reescribir políticas de public.perfiles usando is_admin()
DROP POLICY IF EXISTS "Perfiles lectura autorizada" ON public.perfiles;
CREATE POLICY "Perfiles lectura autorizada"
  ON public.perfiles FOR SELECT
  USING (
    auth.uid() = id
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Perfiles actualizacion autorizada con control de atributos" ON public.perfiles;
CREATE POLICY "Perfiles actualizacion autorizada con control de atributos"
  ON public.perfiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (
    auth.uid() = id OR public.is_admin()
  );

-- 3. Reescribir políticas de public.preguntas usando is_admin()
DROP POLICY IF EXISTS "Preguntas lectura propietario o admin" ON public.preguntas;
CREATE POLICY "Preguntas lectura propietario o admin"
  ON public.preguntas FOR SELECT
  USING (
    propietario_id = auth.uid()
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Preguntas insercion propietario o admin" ON public.preguntas;
CREATE POLICY "Preguntas insercion propietario o admin"
  ON public.preguntas FOR INSERT
  WITH CHECK (
    propietario_id = auth.uid()
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Preguntas edicion propietario o admin" ON public.preguntas;
CREATE POLICY "Preguntas edicion propietario o admin"
  ON public.preguntas FOR UPDATE
  USING (
    propietario_id = auth.uid()
    OR public.is_admin()
  )
  WITH CHECK (
    propietario_id = auth.uid()
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Preguntas eliminacion propietario o admin" ON public.preguntas;
CREATE POLICY "Preguntas eliminacion propietario o admin"
  ON public.preguntas FOR DELETE
  USING (
    propietario_id = auth.uid()
    OR public.is_admin()
  );

COMMIT;
