-- ==============================================================================
-- Migración 043: Corrección Crítica de Políticas RLS
-- Auditoría Tercera de Seguimiento — Sysget Saber (commit 3210f5f)
-- ==============================================================================
-- Hallazgo 1 (CRÍTICO): OR auth.uid() IS NULL abre escritura anónima en rendiciones.
--   service_role ya tiene BYPASSRLS y nunca evalúa estas políticas; la cláusula
--   solo beneficiaba a requests anónimos con la anon key pública.
-- Hallazgo 2 (CRÍTICO): Política de preguntas comparaba is_admin_of_rbd contra
--   el propio RBD del admin (current_user_rbd()), sin cruzarlo con el RBD real
--   del dueño de la pregunta. Se agrega columna rbd a preguntas y se corrige.
-- Hallazgo 4 (INFORMATIVO): Verificación idempotente de trigger y constraint de
--   RBD que se editaron sobre 041 ya aplicado. Esta migración los re-aplica
--   de forma segura usando CREATE OR REPLACE / IF NOT EXISTS.
-- ==============================================================================

BEGIN;

-- ==============================================================================
-- HALLAZGO 1: CERRAR VÍA DE ESCRITURA ANÓNIMA EN PUBLIC.RENDICIONES
-- ==============================================================================
-- La política anterior tenía OR auth.uid() IS NULL que permitía a cualquier
-- request anónimo insertar rendiciones. Se elimina esa cláusula.
-- service_role tiene BYPASSRLS y no necesita esta excepción.
-- V-02 (Doubt-Driven): Permitir inserción al alumno O al docente/admin responsable
-- para soportar digitación de hojas físicas OMR en educación básica.

DROP POLICY IF EXISTS "Rendiciones insertables por alumno o sistema" ON public.rendiciones;
DROP POLICY IF EXISTS "Rendiciones insertables por alumno autenticado" ON public.rendiciones;
DROP POLICY IF EXISTS "Rendiciones insertables por alumno o docente responsable" ON public.rendiciones;

CREATE POLICY "Rendiciones insertables por alumno o docente responsable"
  ON public.rendiciones FOR INSERT
  WITH CHECK (
    alumno_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.evaluaciones e
      JOIN public.cursos c ON c.id = e.curso_id
      WHERE e.id = prueba_id
        AND (e.profesor_id = auth.uid() OR c.profesor_jefe_id = auth.uid() OR public.is_admin_of_rbd(c.rbd))
    )
  );

-- V-01 (Doubt-Driven): Asegurar que el profesor autor de la prueba (e.profesor_id)
-- pueda SELECT, UPDATE y calificar rendiciones aunque no sea el profesor jefe del curso.
DROP POLICY IF EXISTS "Rendiciones visibles por relacion academica" ON public.rendiciones;

CREATE POLICY "Rendiciones visibles por relacion academica"
  ON public.rendiciones FOR SELECT
  USING (
    alumno_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.evaluaciones e
      JOIN public.cursos c ON c.id = e.curso_id
      WHERE e.id = prueba_id
        AND (e.profesor_id = auth.uid() OR c.profesor_jefe_id = auth.uid() OR public.is_admin_of_rbd(c.rbd))
    )
  );

DROP POLICY IF EXISTS "Rendiciones actualizables por sistema" ON public.rendiciones;
DROP POLICY IF EXISTS "Rendiciones eliminables por admin del RBD" ON public.rendiciones;
DROP POLICY IF EXISTS "Rendiciones actualizables por docente o admin" ON public.rendiciones;

CREATE POLICY "Rendiciones actualizables por docente o admin"
  ON public.rendiciones FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM public.evaluaciones e
      JOIN public.cursos c ON c.id = e.curso_id
      WHERE e.id = prueba_id
        AND (e.profesor_id = auth.uid() OR c.profesor_jefe_id = auth.uid() OR public.is_admin_of_rbd(c.rbd))
    )
  );

CREATE POLICY "Rendiciones eliminables por admin del RBD"
  ON public.rendiciones FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM public.evaluaciones e
      JOIN public.cursos c ON c.id = e.curso_id
      WHERE e.id = prueba_id
        AND public.is_admin_of_rbd(c.rbd)
    )
  );

-- ==============================================================================
-- HALLAZGO 2: AISLAMIENTO REAL POR RBD EN PUBLIC.PREGUNTAS
-- ==============================================================================
-- La tabla preguntas no tenía columna rbd, así que is_admin_of_rbd comparaba
-- siempre el RBD del admin consigo mismo (current_user_rbd()), sin filtrar por
-- el colegio dueño de la pregunta. Se agrega la columna y se corrige la política.

ALTER TABLE public.preguntas ADD COLUMN IF NOT EXISTS rbd TEXT;

-- Poblar rbd desde el perfil del propietario para preguntas existentes
UPDATE public.preguntas p
SET rbd = pf.rbd
FROM public.perfiles pf
WHERE pf.id = p.propietario_id
  AND p.rbd IS NULL;

-- Índice para la nueva columna
CREATE INDEX IF NOT EXISTS idx_preguntas_rbd ON public.preguntas(rbd);

-- Reconstruir la política SELECT con comparación real contra rbd de la pregunta
DROP POLICY IF EXISTS "Preguntas privadas del propietario" ON public.preguntas;

CREATE POLICY "Preguntas privadas del propietario"
  ON public.preguntas FOR SELECT
  USING (
    propietario_id = auth.uid()
    OR public.is_admin_of_rbd(rbd)
  );

-- V-03 (Doubt-Driven): Al insertar preguntas, propagar rbd obligatoriamente
DROP POLICY IF EXISTS "Creacion de preguntas propias" ON public.preguntas;

CREATE POLICY "Creacion de preguntas propias"
  ON public.preguntas FOR INSERT
  WITH CHECK (
    propietario_id = auth.uid()
    AND (
      public.is_admin_of_rbd(NULL) -- Super Admin global
      OR (rbd IS NOT NULL AND rbd = public.current_user_rbd())
    )
  );

-- ==============================================================================
-- HALLAZGO 4: RE-APLICACIÓN IDEMPOTENTE DE TRIGGER Y CONSTRAINT DE RBD
-- (Estos cambios se editaron sobre 041 ya aplicado; los re-aplicamos aquí de
-- forma segura para garantizar que estén activos en producción)
-- ==============================================================================

-- Trigger: RAISE EXCEPTION en lugar de RAISE WARNING
CREATE OR REPLACE FUNCTION public.check_user_rbd_integrity()
RETURNS TRIGGER AS $$
BEGIN
  -- Super admin no requiere RBD fijo
  IF NEW.es_super_admin = TRUE OR NEW.email = 'leontestvirtual1@gmail.com' THEN
    RETURN NEW;
  END IF;

  -- Usuarios de demo reciben RBD de demo si está vacío
  IF NEW.es_demo = TRUE AND (NEW.rbd IS NULL OR TRIM(NEW.rbd) = '') THEN
    NEW.rbd := '9999';
    RETURN NEW;
  END IF;

  -- Para profesores y alumnos en producción: RBD obligatorio (EXCEPTION, no WARNING)
  IF NEW.rol IN ('profesor', 'alumno') AND (NEW.rbd IS NULL OR TRIM(NEW.rbd) = '') THEN
    RAISE EXCEPTION
      'Operación rechazada: El usuario % con rol % debe tener un RBD institucional asignado obligatoriamente.',
      NEW.email, NEW.rol;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_user_rbd_integrity ON public.perfiles;
CREATE TRIGGER trg_check_user_rbd_integrity
  BEFORE INSERT OR UPDATE ON public.perfiles
  FOR EACH ROW EXECUTE FUNCTION public.check_user_rbd_integrity();

-- Constraint CHECK idempotente
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_profesor_alumno_rbd_required'
  ) THEN
    ALTER TABLE public.perfiles
      ADD CONSTRAINT check_profesor_alumno_rbd_required
      CHECK (
        es_super_admin = TRUE
        OR es_demo = TRUE
        OR rol NOT IN ('profesor', 'alumno')
        OR (rbd IS NOT NULL AND TRIM(rbd) <> '')
      );
  END IF;
END $$;

COMMIT;

-- ==============================================================================
-- VERIFICACIÓN POST-MIGRACIÓN
-- Ejecutar para confirmar que no quedan políticas abiertas:
--
-- SELECT tablename, policyname, cmd, qual
-- FROM pg_policies
-- WHERE tablename IN ('rendiciones','preguntas')
--   AND schemaname = 'public'
-- ORDER BY tablename, cmd;
--
-- Verificar que rendiciones no tiene política INSERT con uid() IS NULL:
-- No debe aparecer "auth.uid() IS NULL" en ningún qual de rendiciones INSERT.
-- ==============================================================================
