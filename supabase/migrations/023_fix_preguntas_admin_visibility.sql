-- =====================================================================
-- Migración 023: Corrección — Visibilidad Total del Banco para Admin
-- Causa raíz: La migración 20260822_private_teacher_data.sql sobrescribió
-- las políticas RLS de public.preguntas restringiendo SELECT/INSERT/UPDATE/DELETE
-- exclusivamente a "propietario_id = auth.uid()", impidiendo que el Super Admin
-- institucional (rol = 'admin') pueda supervisar y gestionar el catálogo completo.
-- =====================================================================

BEGIN;

-- 1. Limpieza de nombres de políticas anteriores para evitar conflictos
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

-- 2. SELECT: Propietario o Administrador (Super Admin)
CREATE POLICY "Preguntas lectura propietario o admin"
  ON public.preguntas FOR SELECT
  USING (
    propietario_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p_admin
      WHERE p_admin.id = auth.uid() 
        AND (p_admin.rol = 'admin' OR p_admin.es_super_admin = TRUE)
    )
  );

-- 3. INSERT: Propietario o Administrador
CREATE POLICY "Preguntas insercion propietario o admin"
  ON public.preguntas FOR INSERT
  WITH CHECK (
    propietario_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p_admin
      WHERE p_admin.id = auth.uid() 
        AND (p_admin.rol = 'admin' OR p_admin.es_super_admin = TRUE)
    )
  );

-- 4. UPDATE: Propietario o Administrador
CREATE POLICY "Preguntas edicion propietario o admin"
  ON public.preguntas FOR UPDATE
  USING (
    propietario_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p_admin
      WHERE p_admin.id = auth.uid() 
        AND (p_admin.rol = 'admin' OR p_admin.es_super_admin = TRUE)
    )
  )
  WITH CHECK (
    propietario_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p_admin
      WHERE p_admin.id = auth.uid() 
        AND (p_admin.rol = 'admin' OR p_admin.es_super_admin = TRUE)
    )
  );

-- 5. DELETE: Propietario o Administrador
CREATE POLICY "Preguntas eliminacion propietario o admin"
  ON public.preguntas FOR DELETE
  USING (
    propietario_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p_admin
      WHERE p_admin.id = auth.uid() 
        AND (p_admin.rol = 'admin' OR p_admin.es_super_admin = TRUE)
    )
  );

COMMIT;
