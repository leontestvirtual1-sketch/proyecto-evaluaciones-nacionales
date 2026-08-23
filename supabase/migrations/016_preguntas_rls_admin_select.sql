-- =====================================================================
-- Migración 016: Política RLS de Admin para tabla public.preguntas
-- El admin (rol = 'admin' en perfiles) debe poder ver todas las
-- preguntas de todos los docentes para el Banco Institucional.
-- Sin esta política, el Admin recibe 0 filas aunque la tabla tenga datos.
-- Ejecutar en Supabase SQL Editor.
-- =====================================================================

-- ─────────────────────────────────────────────────────────────────────
-- 1. Política de SELECT global para admins
--    Permite que usuarios con rol='admin' en la tabla perfiles
--    lean TODAS las preguntas de la institución.
-- ─────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin lee todas las preguntas" ON public.preguntas;
CREATE POLICY "Admin lee todas las preguntas"
  ON public.preguntas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.perfiles
      WHERE id = auth.uid()
        AND rol IN ('admin', 'superadmin')
    )
  );

-- ─────────────────────────────────────────────────────────────────────
-- 2. Política de INSERT/UPDATE/DELETE para admins (gestión institucional)
--    El admin puede crear preguntas institucionales (fuente: Banco oficial)
--    y editar o eliminar cualquier pregunta de la institución si es necesario.
-- ─────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin gestiona todas las preguntas" ON public.preguntas;
CREATE POLICY "Admin gestiona todas las preguntas"
  ON public.preguntas FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.perfiles
      WHERE id = auth.uid()
        AND rol IN ('admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.perfiles
      WHERE id = auth.uid()
        AND rol IN ('admin', 'superadmin')
    )
  );

-- ─────────────────────────────────────────────────────────────────────
-- 3. Nota: Las políticas existentes de docentes (015) siguen vigentes.
--    Un docente ve SOLO sus propias preguntas.
--    El admin ve TODAS.
-- ─────────────────────────────────────────────────────────────────────
