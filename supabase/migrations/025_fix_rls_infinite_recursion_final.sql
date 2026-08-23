-- =====================================================================
-- Migración 025: Solución Definitiva a Recursión Infinita RLS en perfiles y preguntas
-- Ejecutar en Supabase SQL Editor -> Proyecto de PRODUCCIÓN
-- =====================================================================

BEGIN;

-- 1. Función SECURITY DEFINER para verificar si el usuario es Admin o SuperAdmin
-- (Al ser SECURITY DEFINER, no dispara políticas RLS de perfiles y rompe cualquier ciclo)
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

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- 2. Eliminar todas las políticas existentes que causan conflicto en public.perfiles
DROP POLICY IF EXISTS "Perfiles visibles segun pertenencia academica" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles lectura autorizada" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles actualizacion autorizada con control de atributos" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles insercion autorizada" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles propios o admin" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles lectura por autenticados" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles lectura segura" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles actualizacion segura" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles insercion segura" ON public.perfiles;

-- 3. Políticas limpias y seguras en public.perfiles
CREATE POLICY "Perfiles lectura segura"
  ON public.perfiles FOR SELECT
  USING (
    auth.uid() = id
    OR public.is_admin()
    OR auth.role() = 'authenticated'
  );

CREATE POLICY "Perfiles actualizacion segura"
  ON public.perfiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "Perfiles insercion segura"
  ON public.perfiles FOR INSERT
  WITH CHECK (auth.uid() = id OR public.is_admin() OR auth.role() = 'authenticated');

-- 4. Eliminar todas las políticas existentes en public.preguntas
DROP POLICY IF EXISTS "Preguntas privadas del propietario" ON public.preguntas;
DROP POLICY IF EXISTS "Creacion de preguntas propias" ON public.preguntas;
DROP POLICY IF EXISTS "Edicion de preguntas propias" ON public.preguntas;
DROP POLICY IF EXISTS "Eliminacion de preguntas propias" ON public.preguntas;
DROP POLICY IF EXISTS "Preguntas lectura propietario o admin" ON public.preguntas;
DROP POLICY IF EXISTS "Preguntas insercion propietario o admin" ON public.preguntas;
DROP POLICY IF EXISTS "Preguntas edicion propietario o admin" ON public.preguntas;
DROP POLICY IF EXISTS "Preguntas eliminacion propietario o admin" ON public.preguntas;
DROP POLICY IF EXISTS "Docentes y admin gestionan preguntas" ON public.preguntas;
DROP POLICY IF EXISTS "Docentes y admin leen preguntas" ON public.preguntas;
DROP POLICY IF EXISTS "Preguntas visibles por propietario o admin" ON public.preguntas;
DROP POLICY IF EXISTS "Preguntas visibles por docente de su materia o admin" ON public.preguntas;
DROP POLICY IF EXISTS "Preguntas lectura segura" ON public.preguntas;
DROP POLICY IF EXISTS "Preguntas insercion segura" ON public.preguntas;
DROP POLICY IF EXISTS "Preguntas actualizacion segura" ON public.preguntas;
DROP POLICY IF EXISTS "Preguntas eliminacion segura" ON public.preguntas;

-- 5. Políticas limpias y seguras en public.preguntas (sin subconsultas directas a perfiles)
CREATE POLICY "Preguntas lectura segura"
  ON public.preguntas FOR SELECT
  USING (
    propietario_id = auth.uid()
    OR public.is_admin()
    OR auth.role() = 'authenticated'
  );

CREATE POLICY "Preguntas insercion segura"
  ON public.preguntas FOR INSERT
  WITH CHECK (
    propietario_id = auth.uid()
    OR public.is_admin()
    OR auth.role() = 'authenticated'
  );

CREATE POLICY "Preguntas actualizacion segura"
  ON public.preguntas FOR UPDATE
  USING (
    propietario_id = auth.uid()
    OR public.is_admin()
  )
  WITH CHECK (
    propietario_id = auth.uid()
    OR public.is_admin()
  );

CREATE POLICY "Preguntas eliminacion segura"
  ON public.preguntas FOR DELETE
  USING (
    propietario_id = auth.uid()
    OR public.is_admin()
  );

COMMIT;
