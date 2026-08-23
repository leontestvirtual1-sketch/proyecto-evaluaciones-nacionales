-- ==============================================================================
-- Migración 023: Permitir a Docentes consultar Preguntas de su Asignatura en Supabase
-- ==============================================================================

-- 1. Actualizar la política RLS de SELECT en public.preguntas
DROP POLICY IF EXISTS "Preguntas visibles por propietario o admin" ON public.preguntas;
DROP POLICY IF EXISTS "Preguntas visibles por docente de su materia o admin" ON public.preguntas;

CREATE POLICY "Preguntas visibles por docente de su materia o admin"
  ON public.preguntas FOR SELECT
  USING (
    propietario_id = auth.uid()
    OR propietario_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() 
        AND (p.rol = 'admin' OR p.asignatura_id = public.preguntas.asignatura_id)
    )
  );

-- 2. Asegurar que las 90 preguntas de Lenguaje tengan asignatura_id = 'asig-2'
UPDATE public.preguntas
SET asignatura_id = 'asig-2'
WHERE id LIKE 'preg-len2m%';
