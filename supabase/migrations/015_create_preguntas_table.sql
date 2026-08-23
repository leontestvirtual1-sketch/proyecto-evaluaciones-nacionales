-- =====================================================================
-- Migración 015: Tabla public.preguntas — Banco de Preguntas por Docente
-- Ejecutar en Supabase SQL Editor.
-- Reemplaza la estructura previa si existía y crea la tabla definitiva.
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────────
-- 1. Eliminar tabla previa obsoleta si existía con columnas antiguas
-- ─────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS public.preguntas CASCADE;

-- ─────────────────────────────────────────────────────────────────────
-- 2. TABLA DEFINITIVA: preguntas
-- Cada pregunta pertenece a un único docente (propietario_id).
-- RLS garantiza que ningún docente vea las preguntas de otro.
-- ID como TEXT permite IDs semánticos ('preg-len2m-01') y autogenerados.
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE public.preguntas (
  id                  TEXT        PRIMARY KEY DEFAULT ('preg-' || uuid_generate_v4()::text),
  propietario_id      UUID        NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
  asignatura_id       TEXT        NOT NULL,
  eje_tematico_id     TEXT,
  habilidad_id        TEXT,
  tipo                TEXT        NOT NULL CHECK (tipo IN ('seleccion_multiple', 'desarrollo')),
  nivel               TEXT        NOT NULL,
  dificultad          TEXT        NOT NULL CHECK (dificultad IN ('baja', 'media', 'alta')),
  enunciado           TEXT        NOT NULL,
  imagen_url          TEXT,
  tabla_markdown      TEXT,
  alternativas        JSONB       NOT NULL DEFAULT '[]'::jsonb,
  respuesta_correcta  TEXT,
  puntaje             NUMERIC(6,2) NOT NULL DEFAULT 1 CHECK (puntaje > 0),
  fuente              TEXT        NOT NULL DEFAULT 'Creada por docente',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices de performance
CREATE INDEX IF NOT EXISTS idx_preguntas_propietario  ON public.preguntas(propietario_id);
CREATE INDEX IF NOT EXISTS idx_preguntas_asignatura   ON public.preguntas(asignatura_id);
CREATE INDEX IF NOT EXISTS idx_preguntas_nivel        ON public.preguntas(nivel);

-- ─────────────────────────────────────────────────────────────────────
-- 3. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.preguntas ENABLE ROW LEVEL SECURITY;

-- Docente solo ve SUS preguntas
DROP POLICY IF EXISTS "Preguntas privadas del propietario"   ON public.preguntas;
CREATE POLICY "Preguntas privadas del propietario"
  ON public.preguntas FOR SELECT
  USING (propietario_id = auth.uid());

-- Docente solo crea preguntas a su nombre
DROP POLICY IF EXISTS "Creacion de preguntas propias"        ON public.preguntas;
CREATE POLICY "Creacion de preguntas propias"
  ON public.preguntas FOR INSERT
  WITH CHECK (propietario_id = auth.uid());

-- Docente solo edita sus propias preguntas
DROP POLICY IF EXISTS "Edicion de preguntas propias"         ON public.preguntas;
CREATE POLICY "Edicion de preguntas propias"
  ON public.preguntas FOR UPDATE
  USING  (propietario_id = auth.uid())
  WITH CHECK (propietario_id = auth.uid());

-- Docente solo elimina sus propias preguntas
DROP POLICY IF EXISTS "Eliminacion de preguntas propias"     ON public.preguntas;
CREATE POLICY "Eliminacion de preguntas propias"
  ON public.preguntas FOR DELETE
  USING (propietario_id = auth.uid());
