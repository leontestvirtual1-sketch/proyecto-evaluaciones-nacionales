-- ==============================================================================
-- Migración 062: Control de Tasa Concurrente y Atómico en Base de Datos (F-03)
-- Resuelve:
--   - F-03: Prevenir race conditions en el rate limit de envío de evaluaciones.
--     La verificación de cupo y la reserva del envío se ejecutan atómicamente
--     dentro de una transacción protegida por pg_advisory_xact_lock.
--   - Cancelación segura de reserva en caso de fallo crítico en transporte SMTP.
--   - Registro formal en supabase_migrations.schema_migrations
-- ==============================================================================

BEGIN;

-- 1. Función RPC para reserva atómica de cupo de envío
CREATE OR REPLACE FUNCTION public.reservar_cupo_envio_evaluacion(
  p_docente_id UUID,
  p_prueba_id TEXT,
  p_alumno_email TEXT,
  p_alumno_nombre TEXT,
  p_rbd TEXT DEFAULT NULL,
  p_max_cupos INT DEFAULT 25,
  p_ventana_segundos INT DEFAULT 60
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_count INT;
  v_envio_id UUID;
  v_interval INTERVAL;
BEGIN
  -- Validaciones básicas de entrada
  IF p_docente_id IS NULL THEN
    RAISE EXCEPTION 'p_docente_id no puede ser nulo';
  END IF;
  IF p_prueba_id IS NULL OR length(trim(p_prueba_id)) = 0 THEN
    RAISE EXCEPTION 'p_prueba_id no puede estar vacío';
  END IF;
  IF p_alumno_email IS NULL OR length(trim(p_alumno_email)) = 0 THEN
    RAISE EXCEPTION 'p_alumno_email no puede estar vacío';
  END IF;

  v_interval := (GREATEST(1, COALESCE(p_ventana_segundos, 60)) || ' seconds')::interval;

  -- Serializar operaciones concurrentes exclusivamente para el mismo docente
  -- Sin bloquear a otros docentes concurrentes (lock hash en base a docente_id)
  PERFORM pg_advisory_xact_lock(hashtext(p_docente_id::text));

  -- Contar envíos efectuados en la ventana de tiempo
  SELECT COUNT(*)
  INTO v_count
  FROM public.evaluacion_envios
  WHERE docente_id = p_docente_id
    AND sent_at >= (now() - v_interval);

  -- Si se alcanza o sobrepasa el límite, rechazar inmediatamente
  IF v_count >= COALESCE(p_max_cupos, 25) THEN
    RETURN jsonb_build_object(
      'permitido', false,
      'cupos_usados', v_count,
      'max_cupos', COALESCE(p_max_cupos, 25),
      'ventana_segundos', COALESCE(p_ventana_segundos, 60),
      'mensaje', 'Límite de envíos por minuto alcanzado.'
    );
  END IF;

  -- Reservar e insertar de forma atómica en la misma transacción
  INSERT INTO public.evaluacion_envios (
    prueba_id,
    alumno_email,
    alumno_nombre,
    docente_id,
    rbd,
    sent_at
  ) VALUES (
    p_prueba_id,
    p_alumno_email,
    p_alumno_nombre,
    p_docente_id,
    p_rbd,
    now()
  )
  RETURNING id INTO v_envio_id;

  RETURN jsonb_build_object(
    'permitido', true,
    'envio_id', v_envio_id,
    'cupos_usados', v_count + 1,
    'max_cupos', COALESCE(p_max_cupos, 25),
    'ventana_segundos', COALESCE(p_ventana_segundos, 60)
  );
END;
$$;

-- 2. Función RPC para cancelar reserva en caso de fallo en transporte SMTP
CREATE OR REPLACE FUNCTION public.cancelar_reserva_envio_evaluacion(
  p_envio_id UUID,
  p_docente_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF p_envio_id IS NULL OR p_docente_id IS NULL THEN
    RETURN FALSE;
  END IF;

  DELETE FROM public.evaluacion_envios
  WHERE id = p_envio_id
    AND docente_id = p_docente_id;

  RETURN FOUND;
END;
$$;

-- 3. Permisos: funciones solo ejecutables por service_role y superusuarios
REVOKE ALL ON FUNCTION public.reservar_cupo_envio_evaluacion FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.cancelar_reserva_envio_evaluacion FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.reservar_cupo_envio_evaluacion TO service_role, postgres;
GRANT EXECUTE ON FUNCTION public.cancelar_reserva_envio_evaluacion TO service_role, postgres;

-- 4. Registrar migración en historial formal de Supabase
INSERT INTO supabase_migrations.schema_migrations (version, name)
VALUES ('062', 'atomic_rate_limit_envios')
ON CONFLICT (version) DO NOTHING;

-- 5. Auditoría Fail-Closed: asegurar que ninguna tabla pública quede sin RLS
DO $$
DECLARE
  r RECORD;
  tablas_sin_rls INT := 0;
  tablas_nombres TEXT := '';
BEGIN
  FOR r IN (
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
      AND rowsecurity = FALSE
  ) LOOP
    tablas_sin_rls := tablas_sin_rls + 1;
    tablas_nombres := tablas_nombres || r.tablename || ', ';
  END LOOP;

  IF tablas_sin_rls > 0 THEN
    RAISE EXCEPTION 'BLOQUEO DE DESPLIEGUE (FAIL-CLOSED): Tablas sin RLS detectadas: %', tablas_nombres;
  END IF;

  RAISE NOTICE 'CONFIRMACIÓN CERTIFICADA: RLS 100%% activo y verificado en public.';
END $$;

COMMIT;
