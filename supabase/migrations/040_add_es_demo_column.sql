-- ==============================================================================
-- Migración 040: Agregar columnas es_demo y es_super_admin a perfiles
-- Plan de Saneamiento y Migración Multitenant - Fase 3
-- ==============================================================================

-- 1. Agregar columna es_demo si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'perfiles' 
      AND column_name = 'es_demo'
  ) THEN
    ALTER TABLE public.perfiles ADD COLUMN es_demo BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;

-- 2. Agregar columna es_super_admin si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'perfiles' 
      AND column_name = 'es_super_admin'
  ) THEN
    ALTER TABLE public.perfiles ADD COLUMN es_super_admin BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;

-- 3. Marcar cuentas de demostración
UPDATE public.perfiles
SET es_demo = true
WHERE email = 'admin@sysget.cl'
   OR email LIKE '%@demo.cl'
   OR email LIKE '%@escuelademo.cl'
   OR LOWER(establecimiento) LIKE '%liceo bicentenario los andes%';

-- 4. Marcar cuenta oficial de Super Admin
UPDATE public.perfiles
SET es_super_admin = true
WHERE email = 'leontestvirtual1@gmail.com';

-- 5. Crear índices para filtrado rápido y aislamiento multitenant
CREATE INDEX IF NOT EXISTS idx_perfiles_es_demo ON public.perfiles(es_demo);
CREATE INDEX IF NOT EXISTS idx_perfiles_rbd ON public.perfiles(rbd);
CREATE INDEX IF NOT EXISTS idx_perfiles_es_super_admin ON public.perfiles(es_super_admin);

COMMENT ON COLUMN public.perfiles.es_demo IS 'Indica si el usuario pertenece al ambiente de demostración simulado (Liceo Bicentenario Los Andes).';
COMMENT ON COLUMN public.perfiles.es_super_admin IS 'Indica si el usuario tiene privilegios globales de plataforma sin restricción de RBD.';
