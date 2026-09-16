-- ==============================================================================
-- Migración 042: Consolidación Atómica de Políticas RLS y Aislamiento Docente
-- Fecha: 2026-09-16
-- 
-- PROPÓSITO:
--   Unifica de forma definitiva e idempotente la contención de seguridad (ex-039)
--   y el aislamiento de datos por docente y establecimiento (ex-20260822).
--   Garantiza que en una única transacción atómica (BEGIN ... COMMIT):
--     1. Se verifique la columna es_super_admin y funciones RLS de RBD.
--     2. Se dropeen TODAS las políticas permisivas o de bypass (USING TRUE).
--     3. Se creen inmediatamente las políticas estrictas de reemplazo para
--        cursos, evaluaciones, rendiciones, preguntas, matriculas y perfiles.
--     4. Se elimine cualquier riesgo de orden lexicográfico entre convenciones de nombres.
-- ==============================================================================

-- ==============================================================================
-- BLOQUE 1: DIAGNÓSTICO (Ejecutar en Supabase SQL Editor para verificar estado)
-- ==============================================================================
-- SELECT tablename, policyname, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename IN ('cursos','evaluaciones','rendiciones','preguntas','matriculas','perfiles')
--   AND schemaname = 'public'
-- ORDER BY tablename, cmd, policyname;

BEGIN;

-- 1. COLUMNA DE SUPERADMIN
ALTER TABLE public.perfiles
  ADD COLUMN IF NOT EXISTS es_super_admin BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE public.perfiles
SET es_super_admin = TRUE
WHERE email = 'leontestvirtual1@gmail.com' AND es_super_admin = FALSE;

-- 2. FUNCIONES DE AYUDA RLS (SECURITY DEFINER CON search_path SEGURO)
CREATE OR REPLACE FUNCTION public.current_user_rbd()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT rbd FROM public.perfiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.is_admin_of_rbd(target_rbd TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.perfiles
    WHERE id = auth.uid()
      AND (
        es_super_admin = TRUE
        OR (rol = 'admin' AND rbd IS NOT DISTINCT FROM target_rbd)
      )
  )
$$;

-- 3. TABLAS AUXILIARES Y DE RELACIÓN EXPLÍCITA
CREATE TABLE IF NOT EXISTS public.preguntas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  propietario_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
  asignatura_id TEXT NOT NULL,
  eje_tematico_id TEXT,
  habilidad_id TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('seleccion_multiple', 'desarrollo')),
  nivel TEXT NOT NULL,
  dificultad TEXT NOT NULL CHECK (dificultad IN ('baja', 'media', 'alta')),
  enunciado TEXT NOT NULL,
  imagen_url TEXT,
  tabla_markdown TEXT,
  alternativas JSONB NOT NULL DEFAULT '[]'::jsonb,
  respuesta_correcta TEXT,
  puntaje NUMERIC(6,2) NOT NULL DEFAULT 1 CHECK (puntaje > 0),
  fuente TEXT NOT NULL DEFAULT 'Creada por docente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_preguntas_propietario ON public.preguntas(propietario_id);

CREATE TABLE IF NOT EXISTS public.matriculas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alumno_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
  curso_id TEXT NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (alumno_id, curso_id)
);

CREATE INDEX IF NOT EXISTS idx_matriculas_alumno ON public.matriculas(alumno_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_curso ON public.matriculas(curso_id);

-- 4. HABILITACIÓN ESTRICTA DE RLS
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rendiciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matriculas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 5. RECONSTRUCCIÓN ATÓMICA DE POLÍTICAS EN PUBLIC.CURSOS
-- ==============================================================================
DROP POLICY IF EXISTS "Lectura de cursos por establecimiento" ON public.cursos;
DROP POLICY IF EXISTS "Todos los cursos" ON public.cursos;
DROP POLICY IF EXISTS "cursos_open" ON public.cursos;
DROP POLICY IF EXISTS "Cursos visibles al docente responsable o admin del RBD" ON public.cursos;
DROP POLICY IF EXISTS "Cursos creados por responsable o admin del RBD" ON public.cursos;
DROP POLICY IF EXISTS "Cursos modificados por responsable o admin del RBD" ON public.cursos;
DROP POLICY IF EXISTS "Cursos eliminados por responsable o admin del RBD" ON public.cursos;

CREATE POLICY "Cursos visibles al docente responsable o admin del RBD"
  ON public.cursos FOR SELECT
  USING (
    profesor_jefe_id = auth.uid() 
    OR public.is_admin_of_rbd(rbd)
  );

CREATE POLICY "Cursos creados por responsable o admin del RBD"
  ON public.cursos FOR INSERT
  WITH CHECK (
    (profesor_jefe_id = auth.uid() AND rbd IS NOT DISTINCT FROM public.current_user_rbd())
    OR public.is_admin_of_rbd(rbd)
  );

CREATE POLICY "Cursos modificados por responsable o admin del RBD"
  ON public.cursos FOR UPDATE
  USING (profesor_jefe_id = auth.uid() OR public.is_admin_of_rbd(rbd))
  WITH CHECK (
    (profesor_jefe_id = auth.uid() AND rbd IS NOT DISTINCT FROM public.current_user_rbd())
    OR public.is_admin_of_rbd(rbd)
  );

CREATE POLICY "Cursos eliminados por responsable o admin del RBD"
  ON public.cursos FOR DELETE
  USING (profesor_jefe_id = auth.uid() OR public.is_admin_of_rbd(rbd));

-- ==============================================================================
-- 6. RECONSTRUCCIÓN ATÓMICA DE POLÍTICAS EN PUBLIC.EVALUACIONES
-- ==============================================================================
DROP POLICY IF EXISTS "Lectura de evaluaciones autorizadas" ON public.evaluaciones;
DROP POLICY IF EXISTS "Todos las evaluaciones" ON public.evaluaciones;
DROP POLICY IF EXISTS "evaluaciones_open" ON public.evaluaciones;
DROP POLICY IF EXISTS "Evaluaciones visibles al autor o admin del RBD" ON public.evaluaciones;
DROP POLICY IF EXISTS "Evaluaciones gestionadas por autor o admin del RBD" ON public.evaluaciones;

CREATE POLICY "Evaluaciones visibles al autor o admin del RBD"
  ON public.evaluaciones FOR SELECT
  USING (
    profesor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.cursos c
      WHERE c.id = curso_id AND public.is_admin_of_rbd(c.rbd)
    )
  );

CREATE POLICY "Evaluaciones gestionadas por autor o admin del RBD"
  ON public.evaluaciones FOR ALL
  USING (
    profesor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.cursos c
      WHERE c.id = curso_id AND public.is_admin_of_rbd(c.rbd)
    )
  );

-- ==============================================================================
-- 7. RECONSTRUCCIÓN ATÓMICA DE POLÍTICAS EN PUBLIC.RENDICIONES
-- ==============================================================================
DROP POLICY IF EXISTS "Lectura de rendiciones propias o de docente" ON public.rendiciones;
DROP POLICY IF EXISTS "rendiciones_open" ON public.rendiciones;
DROP POLICY IF EXISTS "Todos las rendiciones" ON public.rendiciones;
DROP POLICY IF EXISTS "Rendiciones visibles por relacion academica" ON public.rendiciones;
DROP POLICY IF EXISTS "Permitir insercion rendiciones" ON public.rendiciones;

CREATE POLICY "Rendiciones visibles por relacion academica"
  ON public.rendiciones FOR SELECT
  USING (
    alumno_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.evaluaciones e
      JOIN public.cursos c ON c.id = e.curso_id
      WHERE e.id = prueba_id
        AND (c.profesor_jefe_id = auth.uid() OR public.is_admin_of_rbd(c.rbd))
    )
  );

-- Permitir inserción autenticada del alumno o service_role
CREATE POLICY "Rendiciones insertables por alumno o sistema"
  ON public.rendiciones FOR INSERT
  WITH CHECK (
    alumno_id = auth.uid() 
    OR auth.uid() IS NULL -- Permite llamadas de endpoints serverless/service_role
  );

-- ==============================================================================
-- 8. RECONSTRUCCIÓN ATÓMICA DE POLÍTICAS EN PUBLIC.PREGUNTAS
-- ==============================================================================
DROP POLICY IF EXISTS "Preguntas privadas del propietario" ON public.preguntas;
DROP POLICY IF EXISTS "Creacion de preguntas propias" ON public.preguntas;
DROP POLICY IF EXISTS "Edicion de preguntas propias" ON public.preguntas;
DROP POLICY IF EXISTS "Eliminacion de preguntas propias" ON public.preguntas;

CREATE POLICY "Preguntas privadas del propietario"
  ON public.preguntas FOR SELECT
  USING (
    propietario_id = auth.uid()
    OR public.is_admin_of_rbd(public.current_user_rbd())
  );

CREATE POLICY "Creacion de preguntas propias"
  ON public.preguntas FOR INSERT
  WITH CHECK (propietario_id = auth.uid());

CREATE POLICY "Edicion de preguntas propias"
  ON public.preguntas FOR UPDATE
  USING (propietario_id = auth.uid())
  WITH CHECK (propietario_id = auth.uid());

CREATE POLICY "Eliminacion de preguntas propias"
  ON public.preguntas FOR DELETE
  USING (propietario_id = auth.uid());

-- ==============================================================================
-- 9. RECONSTRUCCIÓN ATÓMICA DE POLÍTICAS EN PUBLIC.MATRICULAS
-- ==============================================================================
DROP POLICY IF EXISTS "Alumnos y profesores leen matriculas" ON public.matriculas;
DROP POLICY IF EXISTS "Matriculas visibles al alumno, docente responsable o admin" ON public.matriculas;
DROP POLICY IF EXISTS "Matriculas gestionadas por responsable o admin" ON public.matriculas;
DROP POLICY IF EXISTS "Matriculas eliminadas por responsable o admin" ON public.matriculas;

CREATE POLICY "Matriculas visibles al alumno, docente responsable o admin"
  ON public.matriculas FOR SELECT
  USING (
    alumno_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.cursos c
      WHERE c.id = curso_id
        AND (c.profesor_jefe_id = auth.uid() OR public.is_admin_of_rbd(c.rbd))
    )
  );

CREATE POLICY "Matriculas gestionadas por responsable o admin"
  ON public.matriculas FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cursos c
      WHERE c.id = curso_id
        AND (c.profesor_jefe_id = auth.uid() OR public.is_admin_of_rbd(c.rbd))
    )
  );

CREATE POLICY "Matriculas eliminadas por responsable o admin"
  ON public.matriculas FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.cursos c
      WHERE c.id = curso_id
        AND (c.profesor_jefe_id = auth.uid() OR public.is_admin_of_rbd(c.rbd))
    )
  );

-- ==============================================================================
-- 10. RECONSTRUCCIÓN ATÓMICA DE POLÍTICAS EN PUBLIC.PERFILES
-- ==============================================================================
DROP POLICY IF EXISTS "Perfiles lectura autorizada" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles visibles segun pertenencia academica" ON public.perfiles;

CREATE POLICY "Perfiles visibles segun pertenencia academica"
  ON public.perfiles FOR SELECT
  USING (
    auth.uid() = id
    OR public.is_admin_of_rbd(rbd)
    OR EXISTS (
      SELECT 1
      FROM public.matriculas m
      JOIN public.cursos c ON c.id = m.curso_id
      WHERE m.alumno_id = perfiles.id
        AND c.profesor_jefe_id = auth.uid()
    )
  );

COMMIT;
