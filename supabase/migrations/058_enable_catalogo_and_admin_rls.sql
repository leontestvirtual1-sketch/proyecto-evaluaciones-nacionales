-- ==============================================================================
-- Migración 058: Habilitar Visibilidad de Catálogo y Permisos Admin en Evaluaciones
-- 1. Habilita 'eval-simce-len-2m-e6' en el catálogo oficial (6 evaluaciones en total)
-- 2. Actualiza políticas RLS de public.evaluaciones para que:
--    - Evaluaciones con es_catalogo = TRUE sean visibles para usuarios autenticados
--    - Administradores (public.is_admin()) tengan visibilidad y gestión completa
-- ==============================================================================

BEGIN;

-- 1. Habilitar la 6ta evaluación oficial en el catálogo
UPDATE public.evaluaciones
SET es_catalogo = TRUE,
    estado = 'activa',
    verificada_at = NOW(),
    verificada_por = '99cf9f8f-720f-4e74-b8d9-eae95208b421',
    updated_at = NOW()
WHERE id = 'eval-simce-len-2m-e6';

-- 2. Políticas RLS actualizadas para public.evaluaciones
DROP POLICY IF EXISTS "Evaluaciones visibles al autor o admin del RBD" ON public.evaluaciones;
DROP POLICY IF EXISTS "Lectura de evaluaciones autorizadas" ON public.evaluaciones;
DROP POLICY IF EXISTS "Evaluaciones visibles con catalogo y admin" ON public.evaluaciones;

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

DROP POLICY IF EXISTS "Evaluaciones gestionadas por autor o admin del RBD" ON public.evaluaciones;
DROP POLICY IF EXISTS "Gestion de evaluaciones por docente o admin" ON public.evaluaciones;
DROP POLICY IF EXISTS "Evaluaciones gestionadas con admin" ON public.evaluaciones;

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

COMMIT;
