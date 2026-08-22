-- Sysget Saber: aislamiento de datos por docente y establecimiento.
-- Ejecutar primero en Supabase SQL Editor sobre un proyecto de prueba y luego
-- en producción. No borra registros existentes.

BEGIN;

-- Sólo la cuenta operativa de plataforma debe marcarse como superadmin.
-- No marque docentes ni administradores de establecimiento con este atributo.
ALTER TABLE public.perfiles
  ADD COLUMN IF NOT EXISTS es_super_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Ayudantes RLS. Una cuenta administradora sólo administra su propio RBD.
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
        es_super_admin
        OR (rol = 'admin' AND rbd IS NOT DISTINCT FROM target_rbd)
      )
  )
$$;

-- Cada pregunta pertenece a un único perfil. No existe lectura compartida.
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
  alternativas JSONB NOT NULL DEFAULT '[]'::jsonb,
  respuesta_correcta TEXT,
  puntaje NUMERIC(6,2) NOT NULL DEFAULT 1 CHECK (puntaje > 0),
  fuente TEXT NOT NULL DEFAULT 'Creada por docente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_preguntas_propietario ON public.preguntas(propietario_id);

-- Relación explícita entre alumno y curso. Evita inferir cursos desde textos.
CREATE TABLE IF NOT EXISTS public.matriculas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alumno_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
  curso_id TEXT NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (alumno_id, curso_id)
);

CREATE INDEX IF NOT EXISTS idx_matriculas_alumno ON public.matriculas(alumno_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_curso ON public.matriculas(curso_id);

ALTER TABLE public.preguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matriculas ENABLE ROW LEVEL SECURITY;

-- Reemplaza las reglas de lectura sin filtro del esquema anterior.
DROP POLICY IF EXISTS "Lectura de cursos por establecimiento" ON public.cursos;
CREATE POLICY "Cursos visibles al docente responsable o admin del RBD"
  ON public.cursos FOR SELECT
  USING (profesor_jefe_id = auth.uid() OR public.is_admin_of_rbd(rbd));

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

CREATE POLICY "Preguntas privadas del propietario"
  ON public.preguntas FOR SELECT
  USING (propietario_id = auth.uid());

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

-- Los docentes pueden consultar los perfiles de alumnos matriculados en sus cursos.
DROP POLICY IF EXISTS "Perfiles lectura autorizada" ON public.perfiles;
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

-- Evaluaciones: sólo su autor o un administrador de su establecimiento.
DROP POLICY IF EXISTS "Lectura de evaluaciones autorizadas" ON public.evaluaciones;
CREATE POLICY "Evaluaciones visibles al autor o admin del RBD"
  ON public.evaluaciones FOR SELECT
  USING (
    profesor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.cursos c
      WHERE c.id = curso_id AND public.is_admin_of_rbd(c.rbd)
    )
  );

-- Rendiciones: alumno propio, docente responsable del curso o admin del RBD.
DROP POLICY IF EXISTS "Lectura de rendiciones propias o de docente" ON public.rendiciones;
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

COMMIT;
