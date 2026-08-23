-- ==============================================================================
-- Migración 019: Sincronización Integral de Evaluaciones, Cursos e Imágenes
-- Sysget Saber — Escuela Premilitar (Lengua y Literatura 2° Medio) y Colegio Mi Casa (Matemática)
-- ==============================================================================

BEGIN;

-- 1. Asegurar columnas en public.preguntas
ALTER TABLE public.preguntas 
  ADD COLUMN IF NOT EXISTS imagen_url TEXT,
  ADD COLUMN IF NOT EXISTS tabla_markdown TEXT;

-- 2. Asegurar que las preguntas con figuras e imágenes tengan su URL exacta
UPDATE public.preguntas
SET imagen_url = '/preguntas/simce_len_2m/image1.jpeg'
WHERE id = 'preg-len2m-20';

UPDATE public.preguntas
SET imagen_url = '/preguntas/simce_len_2m_jun/image1.png'
WHERE id = 'preg-len2m-jun-20';

-- 3. Actualizar preguntas oficiales de Ciencias Naturales 6° Básico con imágenes
UPDATE public.preguntas SET imagen_url = '/preguntas/simce_cn_6b/p03_nutrientes.png' WHERE id = 'preg-cn6b-03';
UPDATE public.preguntas SET imagen_url = '/preguntas/simce_cn_6b/p07_venacava.png' WHERE id = 'preg-cn6b-07';
UPDATE public.preguntas SET imagen_url = '/preguntas/simce_cn_6b/p20_simbolos.png' WHERE id = 'preg-cn6b-20';
UPDATE public.preguntas SET imagen_url = '/preguntas/simce_cn_6b/p21_limon.png' WHERE id = 'preg-cn6b-21';
UPDATE public.preguntas SET imagen_url = '/preguntas/simce_cn_6b/p25_circuitos.png' WHERE id = 'preg-cn6b-25';
UPDATE public.preguntas SET imagen_url = '/preguntas/simce_cn_6b/p30_oceano.png' WHERE id = 'preg-cn6b-30';
UPDATE public.preguntas SET imagen_url = '/preguntas/simce_cn_6b/p33_emisiones.png' WHERE id = 'preg-cn6b-33';

-- 4. Crear tabla pruebas si no existía con RLS habilitado
CREATE TABLE IF NOT EXISTS public.pruebas (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  asignatura_id TEXT NOT NULL,
  asignatura_nombre TEXT,
  nivel TEXT NOT NULL,
  profesor_id UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
  curso_id TEXT,
  curso_nombre TEXT,
  codigo_acceso TEXT,
  tiempo_limite INTEGER DEFAULT 90,
  total_preguntas INTEGER DEFAULT 30,
  pregunta_ids JSONB DEFAULT '[]'::jsonb,
  estado TEXT DEFAULT 'activa',
  establecimiento TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pruebas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura de pruebas publicas o por perfil" ON public.pruebas;
CREATE POLICY "Lectura de pruebas publicas o por perfil"
  ON public.pruebas FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Insercion y actualizacion de pruebas por profesor o admin" ON public.pruebas;
CREATE POLICY "Insercion y actualizacion de pruebas por profesor o admin"
  ON public.pruebas FOR ALL
  USING (
    profesor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND (p.rol = 'admin' OR p.es_super_admin = TRUE)
    )
  )
  WITH CHECK (
    profesor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND (p.rol = 'admin' OR p.es_super_admin = TRUE)
    )
  );

-- 5. Poblar las 3 Evaluaciones Oficiales de María Teresa / Escuela Premilitar
DO $$
DECLARE
  v_mteresa_id UUID;
  v_admin_id UUID;
BEGIN
  SELECT id INTO v_mteresa_id FROM auth.users WHERE email IN ('mariateresa.gonzalez@premil.cl', 'luis.leon@premil.cl') LIMIT 1;
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'leontestvirtual1@gmail.com' LIMIT 1;

  INSERT INTO public.pruebas (
    id, titulo, descripcion, asignatura_id, asignatura_nombre, nivel,
    profesor_id, curso_id, curso_nombre, codigo_acceso, tiempo_limite, total_preguntas,
    pregunta_ids, estado, establecimiento, created_at, updated_at
  )
  VALUES
    (
      'prueba-len2m-101',
      'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026',
      'Evaluación formativa oficial SIMCE (Agosto 2026): Textos expositivos, artículos de opinión, reportajes, divulgación científica botánica y literatura epistolar.',
      'asig-2', 'Lengua y Literatura', '2° Medio',
      COALESCE(v_mteresa_id, v_admin_id), 'curso-prem-2m', '2° Medio A',
      'SIMCE-2M-LEN-AGO', 90, 30,
      '["preg-len2m-01","preg-len2m-02","preg-len2m-03","preg-len2m-04","preg-len2m-05","preg-len2m-06","preg-len2m-07","preg-len2m-08","preg-len2m-09","preg-len2m-10","preg-len2m-11","preg-len2m-12","preg-len2m-13","preg-len2m-14","preg-len2m-15","preg-len2m-16","preg-len2m-17","preg-len2m-18","preg-len2m-19","preg-len2m-20","preg-len2m-21","preg-len2m-22","preg-len2m-23","preg-len2m-24","preg-len2m-25","preg-len2m-26","preg-len2m-27","preg-len2m-28","preg-len2m-29","preg-len2m-30"]'::jsonb,
      'activa', 'Escuela Premilitar Héroes de la Concepción',
      '2026-08-16 10:00:00+00', NOW()
    ),
    (
      'prueba-len2m-jun-101',
      'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026',
      'Evaluación intermedia SIMCE (Junio 2026): Análisis de textos narrativos, artículos de divulgación científica espacial y textos argumentativos.',
      'asig-2', 'Lengua y Literatura', '2° Medio',
      COALESCE(v_mteresa_id, v_admin_id), 'curso-prem-2m', '2° Medio A',
      'SIMCE-2M-LEN-JUN', 90, 30,
      '["preg-len2m-jun-01","preg-len2m-jun-02","preg-len2m-jun-03","preg-len2m-jun-04","preg-len2m-jun-05","preg-len2m-jun-06","preg-len2m-jun-07","preg-len2m-jun-08","preg-len2m-jun-09","preg-len2m-jun-10","preg-len2m-jun-11","preg-len2m-jun-12","preg-len2m-jun-13","preg-len2m-jun-14","preg-len2m-jun-15","preg-len2m-jun-16","preg-len2m-jun-17","preg-len2m-jun-18","preg-len2m-jun-19","preg-len2m-jun-20","preg-len2m-jun-21","preg-len2m-jun-22","preg-len2m-jun-23","preg-len2m-jun-24","preg-len2m-jun-25","preg-len2m-jun-26","preg-len2m-jun-27","preg-len2m-jun-28","preg-len2m-jun-29","preg-len2m-jun-30"]'::jsonb,
      'activa', 'Escuela Premilitar Héroes de la Concepción',
      '2026-06-15 10:00:00+00', NOW()
    ),
    (
      'prueba-len2m-abr-101',
      'Ensayo Diagnóstico Lengua y Literatura 2° Medio — Abril 2026',
      'Diagnóstico inicial SIMCE (Abril 2026): Habilidades de localización, interpretación, reflexión crítica y evaluación de fuentes informativas.',
      'asig-2', 'Lengua y Literatura', '2° Medio',
      COALESCE(v_mteresa_id, v_admin_id), 'curso-prem-2m', '2° Medio A',
      'SIMCE-2M-LEN-ABR', 90, 30,
      '["preg-len2m-abr-01","preg-len2m-abr-02","preg-len2m-abr-03","preg-len2m-abr-04","preg-len2m-abr-05","preg-len2m-abr-06","preg-len2m-abr-07","preg-len2m-abr-08","preg-len2m-abr-09","preg-len2m-abr-10","preg-len2m-abr-11","preg-len2m-abr-12","preg-len2m-abr-13","preg-len2m-abr-14","preg-len2m-abr-15","preg-len2m-abr-16","preg-len2m-abr-17","preg-len2m-abr-18","preg-len2m-abr-19","preg-len2m-abr-20","preg-len2m-abr-21","preg-len2m-abr-22","preg-len2m-abr-23","preg-len2m-abr-24","preg-len2m-abr-25","preg-len2m-abr-26","preg-len2m-abr-27","preg-len2m-abr-28","preg-len2m-abr-29","preg-len2m-abr-30"]'::jsonb,
      'activa', 'Escuela Premilitar Héroes de la Concepción',
      '2026-04-10 10:00:00+00', NOW()
    )
  ON CONFLICT (id) DO UPDATE SET
    titulo = EXCLUDED.titulo,
    descripcion = EXCLUDED.descripcion,
    asignatura_id = EXCLUDED.asignatura_id,
    asignatura_nombre = EXCLUDED.asignatura_nombre,
    nivel = EXCLUDED.nivel,
    curso_id = EXCLUDED.curso_id,
    curso_nombre = EXCLUDED.curso_nombre,
    codigo_acceso = EXCLUDED.codigo_acceso,
    tiempo_limite = EXCLUDED.tiempo_limite,
    total_preguntas = EXCLUDED.total_preguntas,
    pregunta_ids = EXCLUDED.pregunta_ids,
    estado = EXCLUDED.estado,
    establecimiento = EXCLUDED.establecimiento,
    updated_at = NOW();

END $$;

COMMIT;
