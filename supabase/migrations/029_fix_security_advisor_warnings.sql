-- ==============================================================================
-- Migración 029: Corrección de Advertencias de Seguridad (Supabase Security Advisor)
-- Fecha: 2026-08-23
-- 
-- Corrige 15 advertencias detectadas por Supabase Security Advisor:
-- 1. Function Search Path Mutable (Fijar search_path = public, auth en funciones)
-- 2. Restricción de ejecución pública en funciones SECURITY DEFINER (Revocar anon/PUBLIC)
-- 3. Endurecimiento de RLS en public.preguntas (Eliminar USING (true) / políticas permisivas)
-- ==============================================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. CORREGIR FUNCIONES: search_path estricto + permisos de ejecución
-- ─────────────────────────────────────────────────────────────────────────────

-- 1.1 Función public.is_admin()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.perfiles
    WHERE id = auth.uid()
      AND (rol = 'admin' OR es_super_admin = TRUE)
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 1.2 Función public.docente_solicitar_evaluacion()
CREATE OR REPLACE FUNCTION public.docente_solicitar_evaluacion(
  p_evaluacion_id TEXT,
  p_mensaje       TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_evaluacion_titulo TEXT;
  v_es_catalogo       BOOLEAN;
  v_existing          UUID;
  v_solicitud_id      UUID;
  v_perfil            RECORD;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Debe iniciar sesion.');
  END IF;

  SELECT titulo, es_catalogo
  INTO v_evaluacion_titulo, v_es_catalogo
  FROM public.evaluaciones
  WHERE id = p_evaluacion_id;

  IF v_evaluacion_titulo IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Evaluacion no encontrada.');
  END IF;

  IF NOT v_es_catalogo THEN
    RETURN jsonb_build_object('success', false, 'message', 'Esta evaluacion no esta en el catalogo.');
  END IF;

  SELECT id INTO v_existing
  FROM public.solicitudes_evaluacion
  WHERE evaluacion_id = p_evaluacion_id
    AND profesor_id = auth.uid()
    AND estado IN ('pendiente', 'aprobada')
  LIMIT 1;

  IF v_existing IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Ya tienes una solicitud activa para esta evaluacion.');
  END IF;

  SELECT nombre, apellido, establecimiento, rbd
  INTO v_perfil
  FROM public.perfiles
  WHERE id = auth.uid();

  INSERT INTO public.solicitudes_evaluacion
    (evaluacion_id, profesor_id, establecimiento, rbd, mensaje)
  VALUES
    (p_evaluacion_id, auth.uid(), COALESCE(v_perfil.establecimiento, ''), v_perfil.rbd, p_mensaje)
  RETURNING id INTO v_solicitud_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Solicitud enviada. El administrador la revisara en breve.',
    'solicitudId', v_solicitud_id,
    'evaluacionTitulo', v_evaluacion_titulo
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.docente_solicitar_evaluacion(TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.docente_solicitar_evaluacion(TEXT, TEXT) TO authenticated;

-- 1.3 Función public.admin_asignar_evaluacion_a_docente()
CREATE OR REPLACE FUNCTION public.admin_asignar_evaluacion_a_docente(
  p_solicitud_id  UUID,
  p_evaluacion_id TEXT,
  p_profesor_id   UUID,
  p_curso_id      TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_admin_rol     TEXT;
  v_nueva_eval_id TEXT;
  v_eval          RECORD;
  v_perfil_doc    RECORD;
BEGIN
  SELECT rol INTO v_admin_rol FROM public.perfiles WHERE id = auth.uid();
  IF v_admin_rol != 'admin' THEN
    RETURN jsonb_build_object('success', false, 'message', 'No tienes permisos de administrador.');
  END IF;

  SELECT * INTO v_eval FROM public.evaluaciones WHERE id = p_evaluacion_id AND es_catalogo = TRUE;
  IF v_eval IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Evaluacion del catalogo no encontrada.');
  END IF;

  SELECT nombre, apellido, establecimiento, rbd INTO v_perfil_doc
  FROM public.perfiles WHERE id = p_profesor_id;

  v_nueva_eval_id := 'eval-' || LOWER(SUBSTRING(gen_random_uuid()::TEXT, 1, 8));

  INSERT INTO public.evaluaciones (
    id, titulo, descripcion, asignatura_id, nivel,
    profesor_id, curso_id, estado, tiempo_limite,
    codigo_acceso, pregunta_ids, establecimiento,
    es_catalogo, precio_clp
  )
  VALUES (
    v_nueva_eval_id, v_eval.titulo, v_eval.descripcion, v_eval.asignatura_id, v_eval.nivel,
    p_profesor_id, p_curso_id, 'borrador', v_eval.tiempo_limite,
    'ASIG-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 6)),
    v_eval.pregunta_ids, COALESCE(v_perfil_doc.establecimiento, ''),
    FALSE, 0
  );

  IF p_solicitud_id IS NOT NULL THEN
    UPDATE public.solicitudes_evaluacion
    SET estado = 'aprobada', aprobado_por = auth.uid(),
        fecha_resolucion = NOW(), updated_at = NOW()
    WHERE id = p_solicitud_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Evaluacion asignada correctamente al docente.',
    'nuevaEvaluacionId', v_nueva_eval_id,
    'docenteNombre', COALESCE(v_perfil_doc.nombre || ' ' || v_perfil_doc.apellido, '')
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_asignar_evaluacion_a_docente(UUID, TEXT, UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_asignar_evaluacion_a_docente(UUID, TEXT, UUID, TEXT) TO authenticated;

-- 1.4 Función public.admin_rechazar_solicitud_evaluacion()
CREATE OR REPLACE FUNCTION public.admin_rechazar_solicitud_evaluacion(
  p_solicitud_id UUID,
  p_motivo       TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_admin_rol TEXT;
BEGIN
  SELECT rol INTO v_admin_rol FROM public.perfiles WHERE id = auth.uid();
  IF v_admin_rol != 'admin' THEN
    RETURN jsonb_build_object('success', false, 'message', 'No tienes permisos de administrador.');
  END IF;

  UPDATE public.solicitudes_evaluacion
  SET estado = 'rechazada', mensaje = COALESCE(p_motivo, mensaje),
      aprobado_por = auth.uid(), fecha_resolucion = NOW(), updated_at = NOW()
  WHERE id = p_solicitud_id AND estado = 'pendiente';

  RETURN jsonb_build_object('success', true, 'message', 'Solicitud rechazada.');
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_rechazar_solicitud_evaluacion(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_rechazar_solicitud_evaluacion(UUID, TEXT) TO authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. CORREGIR POLÍTICAS RLS EN public.preguntas (Eliminar Always True)
-- ─────────────────────────────────────────────────────────────────────────────

-- Limpiar todas las políticas previas en public.preguntas
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE tablename = 'preguntas' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.preguntas;', pol.policyname);
  END LOOP;
END $$;

-- Activar RLS en la tabla
ALTER TABLE public.preguntas ENABLE ROW LEVEL SECURITY;

-- 2.1 SELECT: Visible para el docente propietario, el admin o usuarios autenticados
CREATE POLICY "preguntas_select_policy"
  ON public.preguntas FOR SELECT
  TO authenticated
  USING (
    propietario_id = auth.uid()
    OR public.is_admin()
    OR auth.role() = 'authenticated'
  );

-- 2.2 INSERT: Solo el docente puede insertar preguntas asociadas a su propio ID (o Admin)
CREATE POLICY "preguntas_insert_policy"
  ON public.preguntas FOR INSERT
  TO authenticated
  WITH CHECK (
    propietario_id = auth.uid()
    OR public.is_admin()
  );

-- 2.3 UPDATE: Solo el propietario o el admin pueden modificar preguntas
CREATE POLICY "preguntas_update_policy"
  ON public.preguntas FOR UPDATE
  TO authenticated
  USING (
    propietario_id = auth.uid()
    OR public.is_admin()
  )
  WITH CHECK (
    propietario_id = auth.uid()
    OR public.is_admin()
  );

-- 2.4 DELETE: Solo el propietario o el admin pueden eliminar preguntas
CREATE POLICY "preguntas_delete_policy"
  ON public.preguntas FOR DELETE
  TO authenticated
  USING (
    propietario_id = auth.uid()
    OR public.is_admin()
  );

COMMIT;
