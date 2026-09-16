-- ==============================================================================
-- Migración 041: Auditoría y Consistencia de RBD en Perfiles Docentes y Cursos
-- Plan de Saneamiento y Migración Multitenant - Fase 3
-- ==============================================================================

-- 1. Regularizar RBDs conocidos para perfiles existentes si estuvieran nulos o vacíos
UPDATE public.perfiles
SET rbd = '31030', establecimiento = 'Escuela Premilitar Héroes de la Concepción'
WHERE (rbd IS NULL OR TRIM(rbd) = '')
  AND (LOWER(email) LIKE '%premil%' OR LOWER(establecimiento) LIKE '%premilitar%');

UPDATE public.perfiles
SET rbd = '1234', establecimiento = 'Colegio Mi Casa'
WHERE (rbd IS NULL OR TRIM(rbd) = '')
  AND (LOWER(email) LIKE '%susana%' OR LOWER(establecimiento) LIKE '%mi casa%');

UPDATE public.perfiles
SET rbd = '9999', establecimiento = 'Liceo Bicentenario Los Andes', es_demo = true
WHERE (rbd IS NULL OR TRIM(rbd) = '')
  AND (email = 'admin@sysget.cl' OR LOWER(establecimiento) LIKE '%bicentenario%');

-- 2. Asegurar que cursos tengan rbd poblado a partir de su establecimiento o profesor
UPDATE public.cursos c
SET rbd = p.rbd
FROM public.perfiles p
WHERE c.profesor_id = p.id
  AND (c.rbd IS NULL OR TRIM(c.rbd) = '')
  AND p.rbd IS NOT NULL;

-- 3. Crear índice para cursos por RBD
CREATE INDEX IF NOT EXISTS idx_cursos_rbd ON public.cursos(rbd);

-- 4. Función de validación de integridad para nuevos registros de profesor/alumno
CREATE OR REPLACE FUNCTION public.check_user_rbd_integrity()
RETURNS TRIGGER AS $$
BEGIN
  -- Super admin no requiere RBD fijo
  IF NEW.es_super_admin = true OR NEW.email = 'leontestvirtual1@gmail.com' THEN
    RETURN NEW;
  END IF;

  -- Usuarios de demo reciben RBD de demo si está vacío
  IF NEW.es_demo = true AND (NEW.rbd IS NULL OR TRIM(NEW.rbd) = '') THEN
    NEW.rbd := '9999';
    RETURN NEW;
  END IF;

  -- Para profesores y alumnos en producción, exigir obligatoriamente RBD válido (Directivas 1 y 4)
  IF NEW.rol IN ('profesor', 'alumno') AND (NEW.rbd IS NULL OR TRIM(NEW.rbd) = '') THEN
    RAISE EXCEPTION 'Operación rechazada: El usuario % con rol % debe tener un RBD institucional asignado obligatoriamente.', NEW.email, NEW.rol;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_user_rbd_integrity ON public.perfiles;
CREATE TRIGGER trg_check_user_rbd_integrity
BEFORE INSERT OR UPDATE ON public.perfiles
FOR EACH ROW
EXECUTE FUNCTION public.check_user_rbd_integrity();

-- 5. Restricción a nivel de base de datos para garantizar que el RBD no sea nulo ni vacío en producción
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_profesor_alumno_rbd_required'
  ) THEN
    ALTER TABLE public.perfiles
      ADD CONSTRAINT check_profesor_alumno_rbd_required
      CHECK (
        es_super_admin = true 
        OR es_demo = true 
        OR rol NOT IN ('profesor', 'alumno') 
        OR (rbd IS NOT NULL AND TRIM(rbd) <> '')
      );
  END IF;
END $$;

