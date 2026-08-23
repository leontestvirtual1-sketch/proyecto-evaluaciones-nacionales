-- =====================================================================
-- Migración 017: Alineación de Tablas y RLS Total para Producción
-- Sysget Saber — Plataforma de Evaluaciones Nacionales
-- Ejecutar en Supabase SQL Editor (Proyecto de Producción)
-- =====================================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────────────
-- 1. EXTENSIÓN Y COLUMNAS EN CURSOS
-- ─────────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Asegurar columnas en public.cursos
ALTER TABLE public.cursos 
  ADD COLUMN IF NOT EXISTS profesor_jefe_id UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS rbd TEXT,
  ADD COLUMN IF NOT EXISTS total_alumnos INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_cursos_profesor_jefe ON public.cursos(profesor_jefe_id);
CREATE INDEX IF NOT EXISTS idx_cursos_rbd ON public.cursos(rbd);

-- Asegurar columnas en public.perfiles
ALTER TABLE public.perfiles
  ADD COLUMN IF NOT EXISTS es_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'trial',
  ADD COLUMN IF NOT EXISTS estado TEXT NOT NULL DEFAULT 'activo',
  ADD COLUMN IF NOT EXISTS cargo TEXT,
  ADD COLUMN IF NOT EXISTS rbd TEXT,
  ADD COLUMN IF NOT EXISTS asignatura_id TEXT,
  ADD COLUMN IF NOT EXISTS asignatura_nombre TEXT,
  ADD COLUMN IF NOT EXISTS approval_token TEXT;

-- Marcar administradores oficiales como superadmin
UPDATE public.perfiles
SET es_super_admin = TRUE,
    rol = 'admin',
    estado = 'activo',
    plan = 'institucional'
WHERE LOWER(email) IN (
  'leontestvirtual1@gmail.com',
  'leontesvirtual1@gmail.com',
  'luis_leon_g@hotmail.com',
  'admin@sysget.cl'
);

-- ─────────────────────────────────────────────────────────────────────
-- 2. POLÍTICAS RLS: public.preguntas
-- Administrador: Acceso y visualización de TODAS las preguntas.
-- Docente: Gestión de sus propias preguntas (propietario_id = auth.uid()).
-- ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.preguntas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Preguntas privadas del propietario" ON public.preguntas;
DROP POLICY IF EXISTS "Admin lee todas las preguntas" ON public.preguntas;
DROP POLICY IF EXISTS "Preguntas visibles por propietario o admin" ON public.preguntas;
DROP POLICY IF EXISTS "Admin gestiona todas las preguntas" ON public.preguntas;
DROP POLICY IF EXISTS "Creacion de preguntas propias" ON public.preguntas;
DROP POLICY IF EXISTS "Edicion de preguntas propias" ON public.preguntas;
DROP POLICY IF EXISTS "Eliminacion de preguntas propias" ON public.preguntas;
DROP POLICY IF EXISTS "Preguntas lectura propietario o admin" ON public.preguntas;
DROP POLICY IF EXISTS "Preguntas insercion propietario o admin" ON public.preguntas;
DROP POLICY IF EXISTS "Preguntas actualizacion propietario o admin" ON public.preguntas;
DROP POLICY IF EXISTS "Preguntas eliminacion propietario o admin" ON public.preguntas;

CREATE POLICY "Preguntas lectura propietario o admin"
  ON public.preguntas FOR SELECT
  USING (
    propietario_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND (p.rol = 'admin' OR p.es_super_admin = TRUE)
    )
  );

CREATE POLICY "Preguntas insercion propietario o admin"
  ON public.preguntas FOR INSERT
  WITH CHECK (
    propietario_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND (p.rol = 'admin' OR p.es_super_admin = TRUE)
    )
  );

CREATE POLICY "Preguntas actualizacion propietario o admin"
  ON public.preguntas FOR UPDATE
  USING (
    propietario_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND (p.rol = 'admin' OR p.es_super_admin = TRUE)
    )
  )
  WITH CHECK (
    propietario_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND (p.rol = 'admin' OR p.es_super_admin = TRUE)
    )
  );

CREATE POLICY "Preguntas eliminacion propietario o admin"
  ON public.preguntas FOR DELETE
  USING (
    propietario_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND (p.rol = 'admin' OR p.es_super_admin = TRUE)
    )
  );

-- ─────────────────────────────────────────────────────────────────────
-- 3. POLÍTICAS RLS: public.perfiles
-- Administrador: Ve todos los usuarios para Gestión de Usuarios.
-- Usuario: Ve su propio perfil.
-- ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios pueden leer su propio perfil" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles visibles segun pertenencia academica" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles lectura autorizada" ON public.perfiles;
DROP POLICY IF EXISTS "Admin lee y gestiona todos los perfiles" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles actualizacion autorizada" ON public.perfiles;

CREATE POLICY "Perfiles lectura autorizada"
  ON public.perfiles FOR SELECT
  USING (
    id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND (p.rol = 'admin' OR p.es_super_admin = TRUE)
    )
  );

CREATE POLICY "Perfiles actualizacion autorizada"
  ON public.perfiles FOR UPDATE
  USING (
    id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND (p.rol = 'admin' OR p.es_super_admin = TRUE)
    )
  )
  WITH CHECK (
    id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND (p.rol = 'admin' OR p.es_super_admin = TRUE)
    )
  );

-- ─────────────────────────────────────────────────────────────────────
-- 4. POLÍTICAS RLS: public.cursos
-- ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cursos visibles al docente responsable o admin del RBD" ON public.cursos;
DROP POLICY IF EXISTS "Cursos creados por responsable o admin del RBD" ON public.cursos;
DROP POLICY IF EXISTS "Cursos modificados por responsable o admin del RBD" ON public.cursos;
DROP POLICY IF EXISTS "Cursos eliminados por responsable o admin del RBD" ON public.cursos;
DROP POLICY IF EXISTS "Profesores leen cursos de su establecimiento" ON public.cursos;
DROP POLICY IF EXISTS "Profesores crean y editan cursos" ON public.cursos;
DROP POLICY IF EXISTS "Cursos lectura general" ON public.cursos;
DROP POLICY IF EXISTS "Cursos insercion" ON public.cursos;
DROP POLICY IF EXISTS "Cursos actualizacion" ON public.cursos;
DROP POLICY IF EXISTS "Cursos eliminacion" ON public.cursos;

CREATE POLICY "Cursos lectura general"
  ON public.cursos FOR SELECT
  USING (
    profesor_jefe_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND (p.rol = 'admin' OR p.es_super_admin = TRUE)
    )
  );

CREATE POLICY "Cursos insercion"
  ON public.cursos FOR INSERT
  WITH CHECK (
    profesor_jefe_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND (p.rol = 'admin' OR p.es_super_admin = TRUE)
    )
  );

CREATE POLICY "Cursos actualizacion"
  ON public.cursos FOR UPDATE
  USING (
    profesor_jefe_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND (p.rol = 'admin' OR p.es_super_admin = TRUE)
    )
  )
  WITH CHECK (
    profesor_jefe_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND (p.rol = 'admin' OR p.es_super_admin = TRUE)
    )
  );

CREATE POLICY "Cursos eliminacion"
  ON public.cursos FOR DELETE
  USING (
    profesor_jefe_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND (p.rol = 'admin' OR p.es_super_admin = TRUE)
    )
  );

COMMIT;
