-- ==============================================================================
-- Migración 061: Blindaje definitivo de evaluacion_envios y eliminación de recursión RLS
-- Resuelve:
--   - F-08: Cross-tenant write en evaluacion_envios
--   - F-07: Eliminación de is_admin() global no acotado por tenant
--   - Eliminación de políticas legacy recursivas en perfiles y cursos (001, 003, 011, 017)
-- ==============================================================================

BEGIN;

-- 1. Eliminar políticas legacy que causaban recursión infinita y bypass multi-tenant
DROP POLICY IF EXISTS "Admin puede gestionar todos los perfiles" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles actualizacion autorizada" ON public.perfiles;
DROP POLICY IF EXISTS "Profesores ven todos los perfiles del establecimiento" ON public.perfiles;

DROP POLICY IF EXISTS "Cursos lectura general" ON public.cursos;
DROP POLICY IF EXISTS "Cursos insercion" ON public.cursos;
DROP POLICY IF EXISTS "Cursos actualizacion" ON public.cursos;
DROP POLICY IF EXISTS "Cursos eliminacion" ON public.cursos;

-- 2. Asegurar políticas estrictas por RBD en public.evaluaciones (sin is_admin() global)
DROP POLICY IF EXISTS "Evaluaciones visibles con catalogo y admin" ON public.evaluaciones;
CREATE POLICY "Evaluaciones visibles con catalogo y admin"
  ON public.evaluaciones FOR SELECT
  USING (
    profesor_id = auth.uid()
    OR es_catalogo = TRUE
    OR (rbd IS NOT NULL AND public.is_admin_of_rbd(rbd))
    OR EXISTS (
      SELECT 1 FROM public.cursos c
      WHERE c.id = curso_id AND public.is_admin_of_rbd(c.rbd)
    )
  );

DROP POLICY IF EXISTS "Evaluaciones gestionadas con admin" ON public.evaluaciones;
CREATE POLICY "Evaluaciones gestionadas con admin"
  ON public.evaluaciones FOR ALL
  USING (
    profesor_id = auth.uid()
    OR (rbd IS NOT NULL AND public.is_admin_of_rbd(rbd))
    OR EXISTS (
      SELECT 1 FROM public.cursos c
      WHERE c.id = curso_id AND public.is_admin_of_rbd(c.rbd)
    )
  );

-- 3. Blindaje de public.evaluacion_envios
-- Revocar accesos amplios heredados
REVOKE ALL ON TABLE public.evaluacion_envios FROM anon, authenticated;

-- Conceder sólo lectura a authenticated (service_role ejecuta inserciones de backend de forma segura)
GRANT SELECT ON TABLE public.evaluacion_envios TO authenticated;

-- Asegurar RLS habilitado y forzado
ALTER TABLE public.evaluacion_envios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluacion_envios FORCE ROW LEVEL SECURITY;

-- Limpiar políticas anteriores
DROP POLICY IF EXISTS "Docentes ven sus envios o del mismo RBD" ON public.evaluacion_envios;
DROP POLICY IF EXISTS "Docentes insertan sus envios" ON public.evaluacion_envios;
DROP POLICY IF EXISTS "Docentes ven sus envios aislados" ON public.evaluacion_envios;
DROP POLICY IF EXISTS "Docentes insertan sus envios aislados" ON public.evaluacion_envios;

-- SELECT: Solo pueden leer envíos propios del mismo RBD o administradores de ese RBD
CREATE POLICY "Docentes ven sus envios aislados"
  ON public.evaluacion_envios FOR SELECT
  USING (
    (
      docente_id = auth.uid()
      AND (rbd IS NULL OR rbd = public.current_user_rbd())
    )
    OR public.is_admin_of_rbd(rbd)
  );

-- INSERT (F-08): En caso de re-concesión de INSERT, prohíbe terminantemente inserciones cross-tenant.
CREATE POLICY "Docentes insertan sus envios aislados"
  ON public.evaluacion_envios FOR INSERT
  WITH CHECK (
    (
      docente_id = auth.uid()
      AND rbd IS NOT NULL
      AND rbd = public.current_user_rbd()
      AND EXISTS (
        SELECT 1 FROM public.evaluaciones e
        WHERE e.id = prueba_id
          AND (e.rbd = public.current_user_rbd() OR e.es_catalogo = TRUE)
      )
    )
    OR (
      public.is_admin_of_rbd(rbd)
      AND EXISTS (
        SELECT 1 FROM public.evaluaciones e
        WHERE e.id = prueba_id
          AND (e.rbd = rbd OR e.es_catalogo = TRUE)
      )
    )
  );

-- 4. Auditoría automática Fail-Closed: aborta si alguna tabla de public carece de RLS
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
