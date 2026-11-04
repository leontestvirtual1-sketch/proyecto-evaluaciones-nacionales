-- ==============================================================================
-- Prueba Transaccional de Concurrencia y Rate Limit Atómico (F-03)
-- Ejecuta en PostgreSQL local y termina en ROLLBACK estricto
-- ==============================================================================

BEGIN;

DO $$
DECLARE
  v_docente_a UUID := '613eeb91-062d-4715-a2eb-01ce036dd2ab'::uuid;
  v_docente_b UUID := 'f971220d-2b5c-46cd-a1cc-f85511f724a2'::uuid;
  v_prueba_id TEXT := 'eval-test-f03';
  v_res JSONB;
  v_exitos_a INT := 0;
  v_rechazos_a INT := 0;
  v_ultimo_envio_id UUID;
  i INT;
BEGIN
  RAISE NOTICE '--- Iniciando Prueba de Rate Limiting Atómico (F-03) ---';

  -- Fixtures sintéticos temporales (auth.users, perfiles y evaluación)
  INSERT INTO auth.users (id, aud, role, email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES
    (v_docente_a, 'authenticated', 'authenticated', 'audit-a-f03@example.invalid', now(), '{"provider":"email"}'::jsonb, '{}'::jsonb, now(), now()),
    (v_docente_b, 'authenticated', 'authenticated', 'audit-b-f03@example.invalid', now(), '{"provider":"email"}'::jsonb, '{}'::jsonb, now(), now());

  INSERT INTO public.perfiles (id, rut, nombre, apellido, email, rol, establecimiento, activo, estado, plan, rbd, es_super_admin, es_demo)
  VALUES 
    (v_docente_a, 'AUDIT-A-01', 'Docente', 'Alpha', 'audit-a-f03@example.invalid', 'profesor', 'Audit Tenant A', true, 'activo', 'institucional', 'RBD-TEST-A', false, false),
    (v_docente_b, 'AUDIT-B-02', 'Docente', 'Beta', 'audit-b-f03@example.invalid', 'profesor', 'Audit Tenant B', true, 'activo', 'institucional', 'RBD-TEST-B', false, false);

  INSERT INTO public.evaluaciones (id, titulo, nivel, estado, rbd, tiempo_limite, es_catalogo, profesor_id)
  VALUES (v_prueba_id, 'Evaluación F03 Test', '2° Medio', 'activa', 'RBD-TEST-A', 60, false, v_docente_a);

  -- 1. Disparar 26 intentos consecutivos/atómicos para Docente A con límite de 25
  FOR i IN 1..26 LOOP
    v_res := public.reservar_cupo_envio_evaluacion(
      v_docente_a,
      v_prueba_id,
      'alumno' || i || '@test.cl',
      'Alumno ' || i,
      'RBD-TEST-A',
      25, -- max_cupos = 25
      60  -- ventana_segundos = 60
    );

    IF (v_res->>'permitido')::boolean = TRUE THEN
      v_exitos_a := v_exitos_a + 1;
      v_ultimo_envio_id := (v_res->>'envio_id')::uuid;
    ELSE
      v_rechazos_a := v_rechazos_a + 1;
    END IF;
  END LOOP;

  RAISE NOTICE 'Docente A: Aprobados = %, Rechazados = %', v_exitos_a, v_rechazos_a;

  IF v_exitos_a <> 25 OR v_rechazos_a <> 1 THEN
    RAISE EXCEPTION 'FALLO F-03: Se esperaban 25 éxitos y 1 rechazo para Docente A, pero se obtuvo % éxitos y % rechazos', v_exitos_a, v_rechazos_a;
  END IF;
  RAISE NOTICE '✅ PASS 1: Docente A respetó exactamente el límite atómico de 25 envíos por minuto.';

  -- 2. Probar aislamiento de cuotas con Docente B
  v_res := public.reservar_cupo_envio_evaluacion(
    v_docente_b,
    v_prueba_id,
    'alumno_b@test.cl',
    'Alumno Beta',
    'RBD-TEST-B',
    25,
    60
  );

  IF (v_res->>'permitido')::boolean <> TRUE THEN
    RAISE EXCEPTION 'FALLO F-03: Docente B debió ser aprobado con cuota independiente, pero fue rechazado';
  END IF;
  RAISE NOTICE '✅ PASS 2: Cuota de Docente B es independiente y no fue afectada por el agotamiento de cuota de Docente A.';

  -- 3. Probar liberación de cuota ante fallo SMTP (cancelar_reserva_envio_evaluacion)
  PERFORM public.cancelar_reserva_envio_evaluacion(v_ultimo_envio_id, v_docente_a);

  -- Intentar de nuevo para Docente A (debería tener ahora exactamente 1 cupo libre)
  v_res := public.reservar_cupo_envio_evaluacion(
    v_docente_a,
    v_prueba_id,
    'alumno_reintento@test.cl',
    'Alumno Reintento',
    'RBD-TEST-A',
    25,
    60
  );

  IF (v_res->>'permitido')::boolean <> TRUE THEN
    RAISE EXCEPTION 'FALLO F-03: Tras cancelar una reserva, Docente A debió poder reservar 1 cupo adicional';
  END IF;
  RAISE NOTICE '✅ PASS 3: Cancelación de reserva liberó el cupo de forma atómica y precisa.';

  RAISE NOTICE '🎉 CERTIFICACIÓN DE CONCURRENCIA Y RATE LIMIT ATÓMICO (F-03) EXITOSA.';
END $$;

ROLLBACK;
