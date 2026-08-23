-- ============================================================
-- Sysget Saber — Esquema SQL Local para Supabase (PostgreSQL)
-- Proyecto: sysget-saber
-- Generado: 2026-08-12
-- ============================================================

-- Habilitar Row Level Security en todas las tablas

-- ============================================================
-- 1. PERFILES DE USUARIOS (extiende auth.users de Supabase)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.perfiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  rut         TEXT NOT NULL,
  nombre      TEXT NOT NULL,
  apellido    TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  rol         TEXT NOT NULL CHECK (rol IN ('profesor', 'alumno', 'admin')),
  establecimiento TEXT NOT NULL DEFAULT 'Escuela Bicentenario Demo',
  activo      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para perfiles
CREATE POLICY "Usuarios pueden leer su propio perfil"
  ON public.perfiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON public.perfiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Profesores ven todos los perfiles del establecimiento"
  ON public.perfiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.perfiles p
    WHERE p.id = auth.uid() AND p.rol IN ('profesor', 'admin')
      AND p.establecimiento = perfiles.establecimiento
  ));

-- ============================================================
-- 2. ASIGNATURAS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.asignaturas (
  id      TEXT PRIMARY KEY,
  codigo  TEXT NOT NULL UNIQUE,
  nombre  TEXT NOT NULL
);

ALTER TABLE public.asignaturas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de asignaturas" ON public.asignaturas FOR SELECT USING (TRUE);

-- ============================================================
-- 3. EJES TEMÁTICOS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ejes_tematicos (
  id            TEXT PRIMARY KEY,
  codigo        TEXT NOT NULL,
  nombre        TEXT NOT NULL,
  asignatura_id TEXT NOT NULL REFERENCES public.asignaturas(id)
);

ALTER TABLE public.ejes_tematicos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de ejes" ON public.ejes_tematicos FOR SELECT USING (TRUE);

-- ============================================================
-- 4. HABILIDADES COGNITIVAS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.habilidades (
  id            TEXT PRIMARY KEY,
  codigo        TEXT NOT NULL,
  nombre        TEXT NOT NULL,
  asignatura_id TEXT NOT NULL REFERENCES public.asignaturas(id)
);

ALTER TABLE public.habilidades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de habilidades" ON public.habilidades FOR SELECT USING (TRUE);

-- ============================================================
-- 5. CURSOS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cursos (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre              TEXT NOT NULL,
  nivel               TEXT NOT NULL,
  anio                INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  codigo_invitacion   TEXT NOT NULL UNIQUE,
  establecimiento     TEXT NOT NULL,
  activo              BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profesores leen cursos de su establecimiento"
  ON public.cursos FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.perfiles p
    WHERE p.id = auth.uid() AND p.establecimiento = cursos.establecimiento
  ));

CREATE POLICY "Profesores crean y editan cursos"
  ON public.cursos FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.perfiles p
    WHERE p.id = auth.uid() AND p.rol IN ('profesor', 'admin')
      AND p.establecimiento = cursos.establecimiento
  ));

-- ============================================================
-- 6. MATRÍCULA ALUMNO-CURSO
-- ============================================================
CREATE TABLE IF NOT EXISTS public.matriculas (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
  curso_id  UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(alumno_id, curso_id)
);

ALTER TABLE public.matriculas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Alumnos y profesores leen matriculas" ON public.matriculas FOR SELECT USING (TRUE);

-- ============================================================
-- 7. BANCO DE PREGUNTAS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.preguntas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asignatura_id   TEXT NOT NULL REFERENCES public.asignaturas(id),
  eje_tematico_id TEXT NOT NULL REFERENCES public.ejes_tematicos(id),
  habilidad_id    TEXT NOT NULL REFERENCES public.habilidades(id),
  tipo            TEXT NOT NULL CHECK (tipo IN ('seleccion_multiple', 'desarrollo')),
  nivel           TEXT NOT NULL,
  dificultad      TEXT NOT NULL CHECK (dificultad IN ('baja', 'media', 'alta')),
  enunciado       TEXT NOT NULL,
  imagen_url      TEXT,
  alternativas    JSONB,           -- [{ "letra": "A", "texto": "...", "es_correcta": true }]
  respuesta_correcta TEXT,
  puntaje         INTEGER NOT NULL DEFAULT 1,
  fuente          TEXT NOT NULL DEFAULT 'Elaboración Docente',
  establecimiento TEXT NOT NULL,
  creador_id      UUID REFERENCES public.perfiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.preguntas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profesores leen preguntas de su establecimiento"
  ON public.preguntas FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.perfiles p
    WHERE p.id = auth.uid() AND p.rol IN ('profesor', 'admin')
      AND p.establecimiento = preguntas.establecimiento
  ));

CREATE POLICY "Profesores crean preguntas"
  ON public.preguntas FOR INSERT
  WITH CHECK (auth.uid() = creador_id);

CREATE POLICY "Creador actualiza sus preguntas"
  ON public.preguntas FOR UPDATE
  USING (auth.uid() = creador_id);

CREATE POLICY "Creador elimina sus preguntas"
  ON public.preguntas FOR DELETE
  USING (auth.uid() = creador_id);

-- ============================================================
-- 8. PRUEBAS (EVALUACIONES)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pruebas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo          TEXT NOT NULL,
  descripcion     TEXT,
  asignatura_id   TEXT REFERENCES public.asignaturas(id),
  nivel           TEXT NOT NULL,
  profesor_id     UUID NOT NULL REFERENCES public.perfiles(id),
  curso_id        UUID NOT NULL REFERENCES public.cursos(id),
  estado          TEXT NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador', 'activa', 'cerrada')),
  tiempo_limite   INTEGER,              -- en minutos; NULL = sin límite
  fecha_apertura  TIMESTAMPTZ,
  fecha_cierre    TIMESTAMPTZ,
  codigo_acceso   TEXT,                 -- para compartir con alumnos
  pregunta_ids    JSONB NOT NULL DEFAULT '[]',  -- array de IDs de preguntas
  establecimiento TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.pruebas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profesores gestionan sus pruebas"
  ON public.pruebas FOR ALL
  USING (auth.uid() = profesor_id);

CREATE POLICY "Alumnos ven pruebas activas"
  ON public.pruebas FOR SELECT
  USING (estado = 'activa');

-- ============================================================
-- 9. RENDICIONES (Intentos de Evaluación por Alumno)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.rendiciones (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prueba_id       UUID NOT NULL REFERENCES public.pruebas(id),
  alumno_id       UUID NOT NULL REFERENCES public.perfiles(id),
  respuestas      JSONB NOT NULL DEFAULT '{}', -- { "pregunta_id": "A", ... }
  puntaje_total   INTEGER,
  puntaje_maximo  INTEGER,
  porcentaje_logro DECIMAL(5,2),
  estado          TEXT NOT NULL DEFAULT 'en_progreso' CHECK (estado IN ('en_progreso', 'completada', 'abandonada')),
  inicio_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fin_at          TIMESTAMPTZ,
  UNIQUE(prueba_id, alumno_id)  -- un alumno rinde una sola vez por prueba
);

ALTER TABLE public.rendiciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alumnos ven y gestionan sus propias rendiciones"
  ON public.rendiciones FOR ALL
  USING (auth.uid() = alumno_id);

CREATE POLICY "Profesores ven rendiciones de sus pruebas"
  ON public.rendiciones FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.pruebas p
    WHERE p.id = rendiciones.prueba_id AND p.profesor_id = auth.uid()
  ));

-- ============================================================
-- 10. TRIGGER: auto-actualizar updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_perfiles_updated_at
  BEFORE UPDATE ON public.perfiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_pruebas_updated_at
  BEFORE UPDATE ON public.pruebas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- SEEDS DE TAXONOMÍA CURRICULAR (Asignaturas, Ejes, Habilidades)
-- ============================================================
INSERT INTO public.asignaturas (id, codigo, nombre) VALUES
  ('asig-1', 'MAT', 'Matemática'),
  ('asig-2', 'LEC', 'Lectura'),
  ('asig-3', 'CIE', 'Ciencias Naturales'),
  ('asig-4', 'HIS', 'Historia y Ciencias Sociales')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.ejes_tematicos (id, codigo, nombre, asignatura_id) VALUES
  ('eje-mat-1', 'MAT-NUM', 'Números y Operaciones', 'asig-1'),
  ('eje-mat-2', 'MAT-ALG', 'Álgebra y Funciones', 'asig-1'),
  ('eje-mat-3', 'MAT-GEO', 'Geometría', 'asig-1'),
  ('eje-mat-4', 'MAT-EST', 'Estadística y Probabilidad', 'asig-1'),
  ('eje-lec-1', 'LEC-TXT', 'Comprensión de Textos', 'asig-2'),
  ('eje-lec-2', 'LEC-LIT', 'Literatura y Contexto', 'asig-2'),
  ('eje-cie-1', 'CIE-BIO', 'Biología', 'asig-3'),
  ('eje-cie-2', 'CIE-FIS', 'Física', 'asig-3'),
  ('eje-cie-3', 'CIE-QUI', 'Química', 'asig-3'),
  ('eje-his-1', 'HIS-CHI', 'Historia de Chile', 'asig-4'),
  ('eje-his-2', 'HIS-UNI', 'Historia Universal', 'asig-4')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.habilidades (id, codigo, nombre, asignatura_id) VALUES
  ('hab-mat-1', 'CON', 'Conocer', 'asig-1'),
  ('hab-mat-2', 'APL', 'Aplicar', 'asig-1'),
  ('hab-mat-3', 'RAZ', 'Razonar y Argumentar', 'asig-1'),
  ('hab-lec-1', 'LOC', 'Localizar', 'asig-2'),
  ('hab-lec-2', 'INT', 'Interpretar e Integrar', 'asig-2'),
  ('hab-lec-3', 'REF', 'Reflexionar y Evaluar', 'asig-2'),
  ('hab-cie-1', 'OBS', 'Observar y Preguntar', 'asig-3'),
  ('hab-cie-2', 'COM', 'Comparar y Clasificar', 'asig-3'),
  ('hab-cie-3', 'CON', 'Concluir y Comunicar', 'asig-3')
ON CONFLICT (id) DO NOTHING;
