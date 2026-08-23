-- ==============================================================================
-- Migración 026: Registrar Logo Oficial de Colegio Mi Casa en Supabase
-- ==============================================================================

BEGIN;

-- 1. Actualizar tabla establecimientos
UPDATE public.establecimientos
SET
  logo_url = '/logos/colegio-mi-casa.png',
  lema = 'Formando el Futuro'
WHERE rbd = '1234' OR nombre ILIKE '%Colegio Mi Casa%';

-- 2. Actualizar perfil de Susana Pizarro si existe
UPDATE public.perfiles
SET
  logo_url = '/logos/colegio-mi-casa.png'
WHERE email = 'nentitasusana@hotmail.com' OR rbd = '1234';

COMMIT;
