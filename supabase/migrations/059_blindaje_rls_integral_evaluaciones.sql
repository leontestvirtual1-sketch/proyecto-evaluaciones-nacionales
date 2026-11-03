-- ==============================================================================
-- Migración 059: Blindaje Integral Row Level Security (RLS)
-- Proyecto: Sysget Saber (Evaluaciones Nacionales SIMCE / PAES)
-- Fecha: 2026-09-25
-- Descripción:
--   1. Activa RLS y FORCE RLS en todas las tablas operativas y privadas.
--   2. Revoca permisos al rol 'anon' en tablas sensibles (preguntas, rendiciones,
--      matrículas, perfiles, etc.).
--   3. Garantiza acceso de lectura pública exclusivamente a catálogos base.
--   4. Valida en bloque que el 100% de las tablas públicas cuenten con RLS.
-- ==============================================================================

BEGIN;

-- 1. IDENTIDAD, PERFILES Y MULTI-TENANT INSTITUCIONAL
ALTER TABLE IF EXISTS public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.perfiles FORCE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.establecimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.comunas ENABLE ROW LEVEL SECURITY;

-- 2. ESTRUCTURA ACADÉMICA Y ESTUDIANTES
ALTER TABLE IF EXISTS public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cursos FORCE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.matriculas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.matriculas FORCE ROW LEVEL SECURITY;

-- 3. INSTRUMENTOS DE EVALUACIÓN Y BANCO DE PREGUNTAS (CLAVES PSICOMÉTRICAS)
ALTER TABLE IF EXISTS public.evaluaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.evaluaciones FORCE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.pruebas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pruebas FORCE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.preguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.preguntas FORCE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.solicitudes_evaluacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.solicitudes_evaluacion FORCE ROW LEVEL SECURITY;

-- 4. RENDICIONES Y RESULTADOS DE ALUMNOS (PII ESTUDIANTIL)
ALTER TABLE IF EXISTS public.rendiciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.rendiciones FORCE ROW LEVEL SECURITY;

-- 5. CATÁLOGO CURRICULAR MINEDUC
ALTER TABLE IF EXISTS public.asignaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ejes_tematicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.habilidades ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 6. REFORZAMIENTO DE PERMISOS: CIERRE DE LA DATA API PARA ROL ANÓNIMO
-- ==============================================================================

-- Revocar acceso al rol 'anon' sobre tablas que contienen datos personales o académicos
REVOKE ALL ON TABLE public.perfiles FROM anon;
REVOKE ALL ON TABLE public.cursos FROM anon;
REVOKE ALL ON TABLE public.matriculas FROM anon;
REVOKE ALL ON TABLE public.preguntas FROM anon;
REVOKE ALL ON TABLE public.rendiciones FROM anon;
REVOKE ALL ON TABLE public.solicitudes_evaluacion FROM anon;

-- Solo lectura pública permitida sobre catálogos institucionales y curriculares
GRANT SELECT ON TABLE public.comunas TO anon, authenticated;
GRANT SELECT ON TABLE public.establecimientos TO anon, authenticated;
GRANT SELECT ON TABLE public.asignaturas TO anon, authenticated;
GRANT SELECT ON TABLE public.ejes_tematicos TO anon, authenticated;
GRANT SELECT ON TABLE public.habilidades TO anon, authenticated;

-- ==============================================================================
-- 7. AUDITORÍA AUTOMÁTICA DE CIERRE EN TIEMPO DE EJECUCIÓN
-- ==============================================================================
DO $$
DECLARE
  r RECORD;
  tablas_sin_rls INT := 0;
BEGIN
  FOR r IN (
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
      AND rowsecurity = FALSE
  ) LOOP
    RAISE WARNING 'ALERTA DE SEGURIDAD: La tabla public.% NO tiene RLS activo!', r.tablename;
    tablas_sin_rls := tablas_sin_rls + 1;
  END LOOP;

  IF tablas_sin_rls = 0 THEN
    RAISE NOTICE 'CONFIRMACIÓN: El 100%% de las tablas públicas en Sysget Saber cuentan con RLS activo y blindado.';
  END IF;
END $$;

COMMIT;
