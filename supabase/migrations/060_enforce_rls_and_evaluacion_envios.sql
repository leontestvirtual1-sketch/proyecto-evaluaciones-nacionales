-- Migración 060: Creación y blindaje RLS de evaluacion_envios y bloqueo estricto (FAIL-CLOSED)
-- Resuelve validación V-01 de la Auditoría de Seguridad

BEGIN;

-- 1. Asegurar tabla public.evaluacion_envios
CREATE TABLE IF NOT EXISTS public.evaluacion_envios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prueba_id TEXT NOT NULL REFERENCES public.evaluaciones(id) ON DELETE CASCADE,
  alumno_email TEXT NOT NULL,
  alumno_nombre TEXT NOT NULL,
  docente_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
  rbd TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para consultas operativas rápidas
CREATE INDEX IF NOT EXISTS idx_eval_envios_prueba ON public.evaluacion_envios(prueba_id);
CREATE INDEX IF NOT EXISTS idx_eval_envios_docente ON public.evaluacion_envios(docente_id);
CREATE INDEX IF NOT EXISTS idx_eval_envios_rbd ON public.evaluacion_envios(rbd);

-- 2. Habilitar y forzar Row Level Security (RLS)
ALTER TABLE public.evaluacion_envios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluacion_envios FORCE ROW LEVEL SECURITY;

-- 3. Políticas RLS
DROP POLICY IF EXISTS "Docentes ven sus envios o del mismo RBD" ON public.evaluacion_envios;
CREATE POLICY "Docentes ven sus envios o del mismo RBD"
  ON public.evaluacion_envios FOR SELECT
  USING (
    docente_id = auth.uid()
    OR public.is_admin()
    OR (rbd IS NOT NULL AND public.is_admin_of_rbd(rbd))
  );

DROP POLICY IF EXISTS "Docentes insertan sus envios" ON public.evaluacion_envios;
CREATE POLICY "Docentes insertan sus envios"
  ON public.evaluacion_envios FOR INSERT
  WITH CHECK (
    docente_id = auth.uid()
    OR public.is_admin()
  );

-- 4. Revocar accesos anónimos
REVOKE ALL ON TABLE public.evaluacion_envios FROM anon;
GRANT SELECT, INSERT ON TABLE public.evaluacion_envios TO authenticated;

-- 5. AUDITORÍA AUTOMÁTICA FAIL-CLOSED (V-01)
-- Si alguna tabla en public no tiene rowsecurity, ABORTA la transacción con excepción
DO $$
DECLARE
  r RECORD;
  tablas_sin_rls INT := 0;
  tablas_nombres TEXT := '';
BEGIN
  FOR r IN (
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
      AND rowsecurity = FALSE
  ) LOOP
    tablas_sin_rls := tablas_sin_rls + 1;
    tablas_nombres := tablas_nombres || r.tablename || ', ';
  END LOOP;

  IF tablas_sin_rls > 0 THEN
    RAISE EXCEPTION 'BLOQUEO DE DESPLIEGUE (FAIL-CLOSED): Las siguientes tablas en public carecen de RLS: %', tablas_nombres;
  END IF;

  RAISE NOTICE 'CONFIRMACIÓN CERTIFICADA: 100%% de las tablas públicas tienen RLS activo y verificado.';
END $$;

COMMIT;

