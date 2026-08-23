-- ==============================================================================
-- Migración 021: Limpieza de Datos Demo y Corrección de Cursos de Producción
-- Fecha: 2026-08-23
-- Descripción:
--   1. Elimina TODOS los datos demo insertados por 002_seed_demo_data.sql
--      que no deben existir en Supabase (ambiente de producción).
--   2. Elimina curso-mc-2m (2° Medio A de Colegio Mi Casa — incorrecto).
--   3. Crea curso-mc-6b (6° Básico A para Susana Pizarro — faltante).
-- ==============================================================================

BEGIN;

-- ============================================================
-- PASO 1: Eliminar datos demo (de 002_seed_demo_data.sql)
-- Orden: primero dependencias (rendiciones → pruebas/evaluaciones
--        → matrículas → cursos → preguntas → perfiles → auth.users)
-- ============================================================

-- 1.1 Rendiciones demo
DELETE FROM public.rendiciones
WHERE id = 'f0000000-0000-0000-0000-000000000001';

-- 1.2 Pruebas demo
DELETE FROM public.pruebas
WHERE id IN (
  'e0000000-0000-0000-0000-000000000001',
  'e0000000-0000-0000-0000-000000000002'
);

-- 1.3 Matrículas demo
DELETE FROM public.matriculas
WHERE curso_id IN (
  'c0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000002',
  'c0000000-0000-0000-0000-000000000003'
);

-- 1.4 Cursos demo de Premilitar (8° Básico A, 8° Básico B, 2° Medio A demo)
DELETE FROM public.cursos
WHERE id IN (
  'c0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000002',
  'c0000000-0000-0000-0000-000000000003'
);

-- 1.5 Preguntas demo (creadas por maria@demo.cl)
DELETE FROM public.preguntas
WHERE id IN (
  'd0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000002',
  'd0000000-0000-0000-0000-000000000003',
  'd0000000-0000-0000-0000-000000000004'
);

-- 1.6 Perfiles demo
DELETE FROM public.perfiles
WHERE id IN (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'
);

-- 1.7 Usuarios demo en auth.users
DELETE FROM auth.users
WHERE id IN (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'
);

-- ============================================================
-- PASO 2: Corregir cursos de Colegio Mi Casa
-- Eliminar 2° Medio A (incorrecto para Susana)
-- ============================================================

DELETE FROM public.pruebas    WHERE curso_id = 'curso-mc-2m';
DELETE FROM public.matriculas WHERE curso_id = 'curso-mc-2m';
DELETE FROM public.cursos     WHERE id = 'curso-mc-2m';

-- ============================================================
-- PASO 3: Crear 6° Básico A para Susana Pizarro (faltante)
-- ============================================================

INSERT INTO public.cursos (id, nombre, nivel, anio, codigo_invitacion, total_alumnos, establecimiento, rbd, profesor_jefe_id, activo)
SELECT
  'curso-mc-6b',
  '6° Básico A',
  '6° Básico',
  2026,
  'MC6B2026',
  0,
  'Colegio Mi Casa',
  '1234',
  p.id,
  true
FROM public.perfiles p
WHERE p.email = 'nentitasusana@hotmail.com'
LIMIT 1
ON CONFLICT (id) DO UPDATE SET
  nombre           = EXCLUDED.nombre,
  nivel            = EXCLUDED.nivel,
  rbd              = EXCLUDED.rbd,
  establecimiento  = EXCLUDED.establecimiento,
  profesor_jefe_id = EXCLUDED.profesor_jefe_id,
  activo           = true;

-- ============================================================
-- VERIFICACIÓN FINAL
-- Resultado esperado:
--   Premilitar  (RBD 31030): curso-prem-2m  → 2° Medio A   (María Teresa)
--   Colegio Mi Casa (RBD 1234): 
--     curso-mc-4b → 4° Básico A (Susana)
--     curso-mc-6b → 6° Básico A (Susana)
--     curso-mc-8b → 8° Básico A (Susana)
-- ============================================================

SELECT
  c.id,
  c.nombre,
  c.nivel,
  c.rbd,
  c.establecimiento,
  p.email         AS profesor_email,
  p.nombre        AS profesor_nombre
FROM public.cursos c
LEFT JOIN public.perfiles p ON p.id = c.profesor_jefe_id
WHERE c.rbd IN ('31030', '1234')
ORDER BY c.rbd, c.nivel;

COMMIT;
