-- ==============================================================================
-- Migración 022: Renombrar tabla pruebas a evaluaciones y homologar dificultad
-- Fecha: 2026-08-23
-- Descripción:
--   1. Renombra la tabla public.pruebas a public.evaluaciones
--   2. Actualiza las políticas RLS correspondientes
--   3. Homologa la columna dificultad en public.preguntas ('baja', 'media', 'alta')
--   4. Refuerza el CHECK constraint en public.preguntas (dificultad)
-- ==============================================================================

BEGIN;

-- 1. Renombrar tabla public.pruebas a public.evaluaciones si existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'pruebas'
  ) THEN
    ALTER TABLE public.pruebas RENAME TO evaluaciones;
  END IF;
END $$;

-- 2. Asegurar RLS en public.evaluaciones
ALTER TABLE IF EXISTS public.evaluaciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura de pruebas publicas o por perfil" ON public.evaluaciones;
DROP POLICY IF EXISTS "Insercion y actualizacion de pruebas por profesor o admin" ON public.evaluaciones;
DROP POLICY IF EXISTS "Profesores gestionan sus pruebas" ON public.evaluaciones;
DROP POLICY IF EXISTS "Alumnos ven pruebas activas" ON public.evaluaciones;
DROP POLICY IF EXISTS "Lectura de evaluaciones autorizadas" ON public.evaluaciones;
DROP POLICY IF EXISTS "Gestion de evaluaciones por docente o admin" ON public.evaluaciones;

CREATE POLICY "Lectura de evaluaciones autorizadas"
  ON public.evaluaciones FOR SELECT
  USING (
    profesor_id = auth.uid()
    OR auth.role() = 'authenticated'
  );

CREATE POLICY "Gestion de evaluaciones por docente o admin"
  ON public.evaluaciones FOR ALL
  USING (
    profesor_id = auth.uid()
    OR auth.role() = 'authenticated'
  );

-- 3. Homologar valores de dificultad en preguntas
UPDATE public.preguntas 
SET dificultad = 'baja' 
WHERE dificultad IN ('facil', 'fácil');

UPDATE public.preguntas 
SET dificultad = 'alta' 
WHERE dificultad IN ('dificil', 'difícil');

-- 4. Asegurar restricción CHECK en public.preguntas
ALTER TABLE public.preguntas DROP CONSTRAINT IF EXISTS preguntas_dificultad_check;
ALTER TABLE public.preguntas ADD CONSTRAINT preguntas_dificultad_check 
  CHECK (dificultad IN ('baja', 'media', 'alta'));

COMMIT;
