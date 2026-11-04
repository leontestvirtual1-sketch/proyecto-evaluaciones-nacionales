-- Script de teardown / limpieza para prueba de concurrencia real (F-03)
BEGIN;

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

COMMIT;
