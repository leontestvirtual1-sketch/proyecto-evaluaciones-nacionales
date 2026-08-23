-- ==============================================================================
-- Migración 019: Sincronización Definitiva y Estructura Robusta de Tablas
-- Sysget Saber — Evaluaciones, Banco de Preguntas (Lenguaje e Imágenes) y Cursos
-- ==============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────────────────────────────────────
-- 1. ADAPTACIÓN SEGURA DE TIPOS DE COLUMNAS (UUID -> TEXT)
-- ──────────────────────────────────────────────────────────────────────────────

-- Liberar Foreign Keys dependientes que bloqueaban el cambio a TEXT
ALTER TABLE IF EXISTS public.matriculas DROP CONSTRAINT IF EXISTS matriculas_curso_id_fkey;
ALTER TABLE IF EXISTS public.pruebas DROP CONSTRAINT IF EXISTS pruebas_curso_id_fkey;
ALTER TABLE IF EXISTS public.rendiciones DROP CONSTRAINT IF EXISTS rendiciones_curso_id_fkey;

-- Convertir curso_id en tablas dependientes a TEXT
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'matriculas' AND column_name = 'curso_id' AND data_type = 'uuid') THEN
    ALTER TABLE public.matriculas ALTER COLUMN curso_id TYPE TEXT;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'pruebas' AND column_name = 'curso_id' AND data_type = 'uuid') THEN
    ALTER TABLE public.pruebas ALTER COLUMN curso_id TYPE TEXT;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cursos' AND column_name = 'id' AND data_type = 'uuid') THEN
    ALTER TABLE public.cursos ALTER COLUMN id TYPE TEXT;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'pruebas' AND column_name = 'id' AND data_type = 'uuid') THEN
    ALTER TABLE public.pruebas ALTER COLUMN id TYPE TEXT;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'preguntas' AND column_name = 'id' AND data_type = 'uuid') THEN
    ALTER TABLE public.preguntas ALTER COLUMN id TYPE TEXT;
  END IF;
END $$;

-- Columnas en public.cursos
ALTER TABLE public.cursos 
  ADD COLUMN IF NOT EXISTS profesor_jefe_id UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS rbd TEXT,
  ADD COLUMN IF NOT EXISTS total_alumnos INTEGER NOT NULL DEFAULT 0;

-- Columnas en public.pruebas
ALTER TABLE public.pruebas
  ADD COLUMN IF NOT EXISTS asignatura_nombre TEXT,
  ADD COLUMN IF NOT EXISTS curso_nombre TEXT,
  ADD COLUMN IF NOT EXISTS total_preguntas INTEGER DEFAULT 30,
  ADD COLUMN IF NOT EXISTS codigo_acceso TEXT,
  ADD COLUMN IF NOT EXISTS tiempo_limite INTEGER DEFAULT 90,
  ADD COLUMN IF NOT EXISTS pregunta_ids JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'activa',
  ADD COLUMN IF NOT EXISTS establecimiento TEXT;

-- Columnas en public.preguntas
ALTER TABLE public.preguntas 
  ADD COLUMN IF NOT EXISTS imagen_url TEXT,
  ADD COLUMN IF NOT EXISTS tabla_markdown TEXT;

-- ──────────────────────────────────────────────────────────────────────────────
-- 2. CURSOS OFICIALES DE PRODUCCIÓN
-- ──────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  v_admin_id UUID;
  v_susana_id UUID;
  v_mteresa_id UUID;
BEGIN
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'leontestvirtual1@gmail.com' LIMIT 1;
  SELECT id INTO v_susana_id FROM auth.users WHERE email = 'nentitasusana@hotmail.com' LIMIT 1;
  SELECT id INTO v_mteresa_id FROM auth.users WHERE email IN ('mariateresa.gonzalez@premil.cl', 'luis.leon@premil.cl') LIMIT 1;

  INSERT INTO public.cursos (id, nombre, nivel, anio, codigo_invitacion, total_alumnos, establecimiento, rbd, profesor_jefe_id, activo)
  VALUES
    ('curso-prem-2m', '2° Medio A', '2° Medio', 2026, 'PREM2M26', 0, 'Escuela Premilitar Héroes de la Concepción', '31030', COALESCE(v_mteresa_id, v_admin_id), true),
    ('curso-mc-4b', '4° Básico A', '4° Básico', 2026, 'MC4B2026', 0, 'Colegio Mi Casa', '1234', COALESCE(v_susana_id, v_admin_id), true),
    ('curso-mc-6b', '6° Básico A', '6° Básico', 2026, 'MC6B2026', 0, 'Colegio Mi Casa', '1234', COALESCE(v_susana_id, v_admin_id), true),
    ('curso-mc-8b', '8° Básico A', '8° Básico', 2026, 'MC8B2026', 0, 'Colegio Mi Casa', '1234', COALESCE(v_susana_id, v_admin_id), true)
  ON CONFLICT (id) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    nivel = EXCLUDED.nivel,
    rbd = EXCLUDED.rbd,
    establecimiento = EXCLUDED.establecimiento,
    profesor_jefe_id = EXCLUDED.profesor_jefe_id,
    activo = true;
END $$;

-- ──────────────────────────────────────────────────────────────────────────────
-- 3. BANCO DE PREGUNTAS CON IMÁGENES
-- ──────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  v_mteresa_id UUID;
  v_admin_id UUID;
  v_owner UUID;
BEGIN
  SELECT id INTO v_mteresa_id FROM auth.users WHERE email IN ('mariateresa.gonzalez@premil.cl', 'luis.leon@premil.cl') LIMIT 1;
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'leontestvirtual1@gmail.com' LIMIT 1;
  v_owner := COALESCE(v_mteresa_id, v_admin_id);

  IF v_owner IS NOT NULL THEN
    INSERT INTO public.preguntas (
      id, propietario_id, asignatura_id, eje_tematico_id, habilidad_id,
      tipo, nivel, dificultad, enunciado, alternativas, respuesta_correcta, puntaje, fuente, imagen_url, created_at, updated_at
    )
    VALUES
      (
        'preg-len2m-01', v_owner, 'asig-2', 'eje-len-2m-2', 'hab-len-1',
        'seleccion_multiple', '2° Medio', 'baja',
        'Lectura 1: Lee el siguiente texto expositivo sobre Airbnb en lago Rupanco y contesta.\n\n1. ¿Cuál es la función de Airbnb?',
        '[{"letra":"A","texto":"Obtener alojamiento en el sur de Chile.","es_correcta":false},{"letra":"B","texto":"Conseguir alojamiento en cualquier lugar del mundo.","es_correcta":true},{"letra":"C","texto":"Desconectar a los usuarios del ruido de la ciudad.","es_correcta":false},{"letra":"D","texto":"Facilitar el arriendo de una cabaña en el lago Rupanco.","es_correcta":false}]'::jsonb,
        'B', 1, 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026', NULL, NOW(), NOW()
      ),
      (
        'preg-len2m-02', v_owner, 'asig-2', 'eje-len-2m-2', 'hab-len-2',
        'seleccion_multiple', '2° Medio', 'media',
        'Lectura 1 (Continuación):\n\n2. ¿Qué se puede afirmar sobre el entorno de la cabaña?',
        '[{"letra":"A","texto":"Que el volcán se puede visitar a pie desde el alojamiento.","es_correcta":false},{"letra":"B","texto":"Que cuenta con un lago, al que no se puede acceder por tábanos.","es_correcta":false},{"letra":"C","texto":"Que presenta un clima frío durante la mayor parte del año.","es_correcta":false},{"letra":"D","texto":"Que cuenta con múltiples paisajes que son visibles desde la cabaña por su ubicación en altura.","es_correcta":true}]'::jsonb,
        'D', 1, 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026', NULL, NOW(), NOW()
      ),
      (
        'preg-len2m-03', v_owner, 'asig-2', 'eje-len-2m-2', 'hab-len-1',
        'seleccion_multiple', '2° Medio', 'baja',
        'Lectura 1 (Continuación):\n\n3. ¿Qué opción contiene información correcta sobre la cabaña?',
        '[{"letra":"A","texto":"Puede albergar hasta cuatro huéspedes.","es_correcta":true},{"letra":"B","texto":"Tiene vista al lago, pero no a los volcanes.","es_correcta":false},{"letra":"C","texto":"Cuenta con dos dormitorios y un baño.","es_correcta":false},{"letra":"D","texto":"En el quincho, se pueden encontrar animales de granja.","es_correcta":false}]'::jsonb,
        'A', 1, 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026', NULL, NOW(), NOW()
      ),
      (
        'preg-len2m-04', v_owner, 'asig-2', 'eje-len-2m-2', 'hab-len-2',
        'seleccion_multiple', '2° Medio', 'media',
        'Lectura 1 (Continuación):\n\n4. ¿Qué implicancias tiene que no haya televisión ni wifi en la cabaña?',
        '[{"letra":"A","texto":"Dificulta la comunicación con los dueños de la casa.","es_correcta":false},{"letra":"B","texto":"Imposibilita comunicarse en caso de emergencia.","es_correcta":false},{"letra":"C","texto":"Beneficia la desconexión y el disfrute del lugar.","es_correcta":true},{"letra":"D","texto":"Favorece la relación con vecinos y familiares.","es_correcta":false}]'::jsonb,
        'C', 1, 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026', NULL, NOW(), NOW()
      ),
      (
        'preg-len2m-20', v_owner, 'asig-2', 'eje-len-2m-2', 'hab-len-3',
        'seleccion_multiple', '2° Medio', 'baja',
        'Lectura 4: Figura 1: Representación botánica del árbol, frutos y flores de tejocote (Crataegus mexicana).\n\n20. ¿Qué función comunicativa tiene la figura en el artículo?',
        '[{"letra":"A","texto":"Mostrar diversos tipos de Crataegus mexicana.","es_correcta":false},{"letra":"B","texto":"Ilustrar visualmente las partes botánicas de la planta del tejocote (árbol, flores y frutos).","es_correcta":true},{"letra":"C","texto":"Representar el ciclo vital de la planta Crataegus mexicana.","es_correcta":false},{"letra":"D","texto":"Contrastar las características del tejocote con las del espino.","es_correcta":false}]'::jsonb,
        'B', 1, 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026', '/preguntas/simce_len_2m/image1.jpeg', NOW(), NOW()
      )
    ON CONFLICT (id) DO UPDATE SET
      enunciado = EXCLUDED.enunciado,
      alternativas = EXCLUDED.alternativas,
      respuesta_correcta = EXCLUDED.respuesta_correcta,
      imagen_url = EXCLUDED.imagen_url,
      fuente = EXCLUDED.fuente,
      updated_at = NOW();
  END IF;
END $$;

-- ──────────────────────────────────────────────────────────────────────────────
-- 4. EVALUACIONES OFICIALES PREMILITAR
-- ──────────────────────────────────────────────────────────────────────────────
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
      '["preg-len2m-01","preg-len2m-02","preg-len2m-03","preg-len2m-04","preg-len2m-20"]'::jsonb,
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
      '["preg-len2m-jun-01","preg-len2m-jun-02","preg-len2m-jun-20"]'::jsonb,
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
      '["preg-len2m-abr-01","preg-len2m-abr-02"]'::jsonb,
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

-- ──────────────────────────────────────────────────────────────────────────────
-- 5. POLÍTICAS RLS SEGURAS
-- ──────────────────────────────────────────────────────────────────────────────
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

COMMIT;
