-- Script de setup de fixtures para prueba de concurrencia real (F-03)
-- Se ejecuta UNA SOLA VEZ antes de lanzar los jobs paralelos.
-- Termina con COMMIT para que las fixtures sean visibles por las conexiones paralelas.

BEGIN;

-- Limpiar fixtures anteriores si existieran
DELETE FROM public.evaluacion_envios
  WHERE docente_id IN (
    '613eeb91-0000-4f03-a200-000000000001'::uuid,
    '613eeb91-0000-4f03-a200-000000000002'::uuid
  );

DELETE FROM public.evaluaciones WHERE id IN ('eval-f03-concurrent-test');

DELETE FROM public.perfiles WHERE id IN (
  '613eeb91-0000-4f03-a200-000000000001'::uuid,
  '613eeb91-0000-4f03-a200-000000000002'::uuid
);

DELETE FROM auth.users WHERE id IN (
  '613eeb91-0000-4f03-a200-000000000001'::uuid,
  '613eeb91-0000-4f03-a200-000000000002'::uuid
);

-- Insertar usuarios en auth
INSERT INTO auth.users (id, aud, role, email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES
  ('613eeb91-0000-4f03-a200-000000000001'::uuid, 'authenticated', 'authenticated',
   'f03-docente-a@concurrent.invalid', now(),
   '{"provider":"email"}'::jsonb, '{}'::jsonb, now(), now()),
  ('613eeb91-0000-4f03-a200-000000000002'::uuid, 'authenticated', 'authenticated',
   'f03-docente-b@concurrent.invalid', now(),
   '{"provider":"email"}'::jsonb, '{}'::jsonb, now(), now());

-- Perfiles
INSERT INTO public.perfiles (id, rut, nombre, apellido, email, rol, establecimiento, activo, estado, plan, rbd, es_super_admin, es_demo)
VALUES
  ('613eeb91-0000-4f03-a200-000000000001'::uuid,
   'F03-CONC-A-01', 'Docente', 'Concurrent-A',
   'f03-docente-a@concurrent.invalid', 'profesor', 'Colegio Concurrent Test A',
   true, 'activo', 'institucional', 'RBD-CONC-A', false, false),
  ('613eeb91-0000-4f03-a200-000000000002'::uuid,
   'F03-CONC-B-02', 'Docente', 'Concurrent-B',
   'f03-docente-b@concurrent.invalid', 'profesor', 'Colegio Concurrent Test B',
   true, 'activo', 'institucional', 'RBD-CONC-B', false, false);

-- Evaluación del docente A
INSERT INTO public.evaluaciones (id, titulo, nivel, estado, rbd, tiempo_limite, es_catalogo, profesor_id)
VALUES ('eval-f03-concurrent-test', 'Evaluación Concurrencia F03', '2° Medio',
        'activa', 'RBD-CONC-A', 60, false,
        '613eeb91-0000-4f03-a200-000000000001'::uuid);

COMMIT;

