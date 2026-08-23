-- ==============================================================================
-- Migración 026: Registrar Logo Oficial de Colegio Mi Casa en Supabase
-- ==============================================================================

BEGIN;

-- 1. Asegurar columna lema si no existiera
ALTER TABLE public.establecimientos 
ADD COLUMN IF NOT EXISTS lema TEXT DEFAULT 'Formando el Futuro';

-- 2. Actualizar tabla establecimientos
UPDATE public.establecimientos
SET
  logo_url = '/logos/colegio-mi-casa.png',
  lema = 'Formando el Futuro'
WHERE rbd = '1234' OR rbd = '99999' OR nombre ILIKE '%Colegio Mi Casa%';

-- 3. Actualizar perfil de Susana Pizarro
UPDATE public.perfiles
SET
  logo_url = '/logos/colegio-mi-casa.png'
WHERE email = 'nentitasusana@hotmail.com' OR rbd = '1234';

COMMIT;

