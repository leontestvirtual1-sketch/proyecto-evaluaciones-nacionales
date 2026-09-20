-- ==============================================================================
-- Migración 056: Hardening de Seguridad, Aislamiento Multi-Tenant y Prevención de Escalada
-- ==============================================================================

-- 1. PREVENCIÓN DE ESCALADA DE PRIVILEGIOS EN PUBLIC.PERFILES
-- Impide que cualquier usuario autenticado modifique campos críticos de su perfil
CREATE OR REPLACE FUNCTION public.check_perfiles_update_security()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Super admin o service_role tienen vía libre
  IF current_user = 'service_role' OR public.is_admin() THEN
    RETURN NEW;
  END IF;

  -- Para usuarios regulares, bloquear modificación de privilegios y tenant
  IF NEW.es_super_admin IS DISTINCT FROM OLD.es_super_admin THEN
    RAISE EXCEPTION 'Operación no permitida: no puede modificar es_super_admin';
  END IF;

  IF NEW.rol IS DISTINCT FROM OLD.rol THEN
    RAISE EXCEPTION 'Operación no permitida: no puede modificar rol';
  END IF;

  IF NEW.rbd IS DISTINCT FROM OLD.rbd THEN
    RAISE EXCEPTION 'Operación no permitida: no puede modificar rbd';
  END IF;

  IF NEW.estado IS DISTINCT FROM OLD.estado THEN
    RAISE EXCEPTION 'Operación no permitida: no puede modificar estado';
  END IF;

  IF NEW.plan IS DISTINCT FROM OLD.plan THEN
    RAISE EXCEPTION 'Operación no permitida: no puede modificar plan';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_perfiles_security ON public.perfiles;
CREATE TRIGGER trg_perfiles_security
BEFORE UPDATE ON public.perfiles
FOR EACH ROW
EXECUTE FUNCTION public.check_perfiles_update_security();


-- 2. ESTAMPADO AUTOMÁTICO DE TENANT Y AUTOR EN PUBLIC.PREGUNTAS
-- Garantiza que si el cliente no envía rbd o propietario_id, se completen automáticamente
-- antes de que se evalúe la política RLS WITH CHECK
CREATE OR REPLACE FUNCTION public.stamp_pregunta_tenant()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.propietario_id IS NULL THEN
    NEW.propietario_id := auth.uid();
  END IF;

  IF NEW.rbd IS NULL THEN
    NEW.rbd := public.current_user_rbd();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_stamp_pregunta_tenant ON public.preguntas;
CREATE TRIGGER trg_stamp_pregunta_tenant
BEFORE INSERT ON public.preguntas
FOR EACH ROW
EXECUTE FUNCTION public.stamp_pregunta_tenant();


-- 3. COLUMNA RBD EN PUBLIC.EVALUACIONES Y ESTAMPADO AUTOMÁTICO
ALTER TABLE public.evaluaciones
ADD COLUMN IF NOT EXISTS rbd TEXT;

CREATE INDEX IF NOT EXISTS idx_evaluaciones_rbd ON public.evaluaciones(rbd);

-- Sincronizar rbd de evaluaciones existentes desde cursos
UPDATE public.evaluaciones e
SET rbd = c.rbd
FROM public.cursos c
WHERE e.curso_id = c.id AND (e.rbd IS NULL OR e.rbd = '');

-- Trigger para evaluaciones
CREATE OR REPLACE FUNCTION public.stamp_evaluacion_tenant()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.profesor_id IS NULL THEN
    NEW.profesor_id := auth.uid();
  END IF;

  IF NEW.rbd IS NULL THEN
    IF NEW.curso_id IS NOT NULL THEN
      SELECT c.rbd INTO NEW.rbd FROM public.cursos c WHERE c.id = NEW.curso_id;
    END IF;
    IF NEW.rbd IS NULL THEN
      NEW.rbd := public.current_user_rbd();
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_stamp_evaluacion_tenant ON public.evaluaciones;
CREATE TRIGGER trg_stamp_evaluacion_tenant
BEFORE INSERT ON public.evaluaciones
FOR EACH ROW
EXECUTE FUNCTION public.stamp_evaluacion_tenant();


-- 4. HARDENING DE STORAGE: AISLAMIENTO POR CARPETA UPLOADS/<RBD>/
DROP POLICY IF EXISTS "Subida de imágenes de evaluaciones para usuarios autenticados" ON storage.objects;
DROP POLICY IF EXISTS "Subida de imágenes de evaluaciones por tenant" ON storage.objects;

CREATE POLICY "Subida de imágenes de evaluaciones por tenant"
ON storage.objects FOR INSERT
TO authenticated, service_role
WITH CHECK (
  bucket_id = 'evaluaciones-media'
  AND (
    current_user = 'service_role'
    OR public.is_admin()
    OR (
      (storage.foldername(name))[1] = 'uploads'
      AND (storage.foldername(name))[2] = public.current_user_rbd()
    )
  )
);
