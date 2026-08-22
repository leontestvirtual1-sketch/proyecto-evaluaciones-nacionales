-- ============================================================
-- Sysget Saber — Esquema Consolidado DDL (Entrega Limpia)
-- Sin semillas de personas ni credenciales reales.
-- ============================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: COMUNAS Y REGIONES OFICIALES
CREATE TABLE IF NOT EXISTS public.comunas (
  id              SERIAL PRIMARY KEY,
  nombre          TEXT NOT NULL UNIQUE,
  region_numero   TEXT NOT NULL DEFAULT '13',
  region_nombre   TEXT NOT NULL DEFAULT 'Región Metropolitana de Santiago',
  provincia       TEXT NOT NULL DEFAULT 'Santiago',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.comunas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura pública de comunas" ON public.comunas;
CREATE POLICY "Lectura pública de comunas" ON public.comunas FOR SELECT USING (TRUE);

-- Precarga de 52 comunas de la RM
INSERT INTO public.comunas (nombre, region_numero, region_nombre, provincia) VALUES
  ('Cerrillos', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Cerro Navia', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Conchalí', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('El Bosque', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Estación Central', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Huechuraba', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Independencia', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('La Cisterna', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('La Florida', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('La Granja', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('La Pintana', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('La Reina', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Las Condes', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Lo Barnechea', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Lo Espejo', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Lo Prado', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Macul', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Maipú', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Ñuñoa', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Pedro Aguirre Cerda', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Peñalolén', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Providencia', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Pudahuel', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Quilicura', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Quinta Normal', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Recoleta', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Renca', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('San Joaquín', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('San Miguel', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('San Ramón', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Santiago', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Vitacura', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Puente Alto', '13', 'Región Metropolitana de Santiago', 'Cordillera'),
  ('Pirque', '13', 'Región Metropolitana de Santiago', 'Cordillera'),
  ('San José de Maipo', '13', 'Región Metropolitana de Santiago', 'Cordillera'),
  ('Colina', '13', 'Región Metropolitana de Santiago', 'Chacabuco'),
  ('Lampa', '13', 'Región Metropolitana de Santiago', 'Chacabuco'),
  ('Tiltil', '13', 'Región Metropolitana de Santiago', 'Chacabuco'),
  ('San Bernardo', '13', 'Región Metropolitana de Santiago', 'Maipo'),
  ('Buin', '13', 'Región Metropolitana de Santiago', 'Maipo'),
  ('Calera de Tango', '13', 'Región Metropolitana de Santiago', 'Maipo'),
  ('Paine', '13', 'Región Metropolitana de Santiago', 'Maipo'),
  ('Melipilla', '13', 'Región Metropolitana de Santiago', 'Melipilla'),
  ('Alhué', '13', 'Región Metropolitana de Santiago', 'Melipilla'),
  ('Curacaví', '13', 'Región Metropolitana de Santiago', 'Melipilla'),
  ('María Pinto', '13', 'Región Metropolitana de Santiago', 'Melipilla'),
  ('San Pedro', '13', 'Región Metropolitana de Santiago', 'Melipilla'),
  ('Talagante', '13', 'Región Metropolitana de Santiago', 'Talagante'),
  ('El Monte', '13', 'Región Metropolitana de Santiago', 'Talagante'),
  ('Isla de Maipo', '13', 'Región Metropolitana de Santiago', 'Talagante'),
  ('Padre Hurtado', '13', 'Región Metropolitana de Santiago', 'Talagante'),
  ('Peñaflor', '13', 'Región Metropolitana de Santiago', 'Talagante')
ON CONFLICT (nombre) DO NOTHING;

-- 3. TABLA: ESTABLECIMIENTOS EDUCATIVOS
CREATE TABLE IF NOT EXISTS public.establecimientos (
  rbd             TEXT PRIMARY KEY,
  nombre          TEXT NOT NULL,
  comuna          TEXT,
  dependencia     TEXT DEFAULT 'Particular Subvencionado',
  logo_url        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.establecimientos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura pública de establecimientos" ON public.establecimientos;
CREATE POLICY "Lectura pública de establecimientos" ON public.establecimientos FOR SELECT USING (TRUE);

-- 4. TABLA: PERFILES DE USUARIOS (DOCENTES, ADMINS, ALUMNOS)
CREATE TABLE IF NOT EXISTS public.perfiles (
  id                        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  rut                       TEXT,
  nombre                    TEXT NOT NULL,
  apellido                  TEXT,
  apellido_paterno          TEXT,
  apellido_materno          TEXT,
  email                     TEXT NOT NULL UNIQUE,
  rol                       TEXT NOT NULL DEFAULT 'profesor' CHECK (rol IN ('admin', 'profesor', 'alumno')),
  establecimiento           TEXT,
  rbd                       TEXT REFERENCES public.establecimientos(rbd) ON UPDATE CASCADE ON DELETE SET NULL,
  comuna                    TEXT,
  dependencia               TEXT,
  asignatura_id             TEXT,
  asignatura_nombre         TEXT,
  cargo                     TEXT,
  estado                    TEXT NOT NULL DEFAULT 'pendiente_aprobacion' CHECK (estado IN ('activo', 'pendiente_aprobacion', 'suspendido', 'rechazado')),
  activo                    BOOLEAN NOT NULL DEFAULT FALSE,
  plan                      TEXT NOT NULL DEFAULT 'trial' CHECK (plan IN ('free', 'trial', 'pro', 'institucional')),
  dias_restantes_trial      INTEGER DEFAULT 30,
  approval_token            TEXT,
  approval_token_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '72 hours'),
  fecha_registro            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_perfiles_email ON public.perfiles(email);
CREATE INDEX IF NOT EXISTS idx_perfiles_rbd ON public.perfiles(rbd);
CREATE INDEX IF NOT EXISTS idx_perfiles_approval_token ON public.perfiles(approval_token) WHERE approval_token IS NOT NULL;

ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Perfiles lectura autorizada" ON public.perfiles;
CREATE POLICY "Perfiles lectura autorizada"
  ON public.perfiles FOR SELECT
  USING (
    auth.uid() = id 
    OR EXISTS (
      SELECT 1 FROM public.perfiles p_admin 
      WHERE p_admin.id = auth.uid() AND p_admin.rol = 'admin'
    )
  );

DROP POLICY IF EXISTS "Perfiles actualizacion autorizada con control de atributos" ON public.perfiles;
CREATE POLICY "Perfiles actualizacion autorizada con control de atributos"
  ON public.perfiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND (
      rol = (SELECT p.rol FROM public.perfiles p WHERE p.id = auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.perfiles p_admin 
        WHERE p_admin.id = auth.uid() AND p_admin.rol = 'admin'
      )
    )
    AND (
      estado = (SELECT p.estado FROM public.perfiles p WHERE p.id = auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.perfiles p_admin 
        WHERE p_admin.id = auth.uid() AND p_admin.rol = 'admin'
      )
    )
  );

-- 5. TABLA: CURSOS
CREATE TABLE IF NOT EXISTS public.cursos (
  id                TEXT PRIMARY KEY,
  nombre            TEXT NOT NULL,
  nivel             TEXT NOT NULL,
  rbd               TEXT REFERENCES public.establecimientos(rbd) ON UPDATE CASCADE ON DELETE CASCADE,
  profesor_jefe_id  UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura de cursos por establecimiento" ON public.cursos;
CREATE POLICY "Lectura de cursos por establecimiento" ON public.cursos FOR SELECT USING (TRUE);

-- 6. TABLA: EVALUACIONES Y ENSAYOS
CREATE TABLE IF NOT EXISTS public.evaluaciones (
  id                TEXT PRIMARY KEY,
  titulo            TEXT NOT NULL,
  descripcion       TEXT,
  asignatura_id     TEXT NOT NULL,
  asignatura_nombre TEXT NOT NULL,
  nivel             TEXT NOT NULL,
  profesor_id       UUID REFERENCES public.perfiles(id) ON DELETE CASCADE,
  curso_id          TEXT REFERENCES public.cursos(id) ON DELETE SET NULL,
  curso_nombre      TEXT,
  codigo_publico    TEXT NOT NULL UNIQUE,
  duracion_minutos  INTEGER NOT NULL DEFAULT 45,
  preguntas_ids     TEXT[] NOT NULL DEFAULT '{}',
  total_preguntas   INTEGER NOT NULL DEFAULT 0,
  estado            TEXT NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador', 'activa', 'finalizada')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.evaluaciones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura de evaluaciones autorizadas" ON public.evaluaciones;
CREATE POLICY "Lectura de evaluaciones autorizadas" ON public.evaluaciones FOR SELECT USING (TRUE);

-- 7. TABLA: RENDICIONES DE ALUMNOS
CREATE TABLE IF NOT EXISTS public.rendiciones (
  id                        TEXT PRIMARY KEY,
  prueba_id                 TEXT REFERENCES public.evaluaciones(id) ON DELETE CASCADE,
  alumno_id                 UUID REFERENCES public.perfiles(id) ON DELETE CASCADE,
  alumno_nombre             TEXT NOT NULL,
  alumno_rut                TEXT,
  fecha_rendicion           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  puntaje_obtenido          NUMERIC(5,2) NOT NULL DEFAULT 0,
  puntaje_maximo            NUMERIC(5,2) NOT NULL DEFAULT 0,
  porcentaje_logro          INTEGER NOT NULL DEFAULT 0,
  puntaje_escala_nacional   INTEGER NOT NULL DEFAULT 100,
  respuestas_json           JSONB NOT NULL DEFAULT '[]'::jsonb,
  estado                    TEXT NOT NULL DEFAULT 'enviada' CHECK (estado IN ('en_progreso', 'enviada', 'corregida')),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.rendiciones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura de rendiciones propias o de docente" ON public.rendiciones;
CREATE POLICY "Lectura de rendiciones propias o de docente" ON public.rendiciones FOR SELECT USING (TRUE);
