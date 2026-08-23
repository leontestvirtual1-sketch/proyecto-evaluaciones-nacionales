-- ==============================================================================
-- Migracion 027: Catalogo de Evaluaciones SIMCE Globales + Solicitudes
-- Fecha: 2026-08-23
-- ==============================================================================

BEGIN;

-- 1. Columnas de catalogo en evaluaciones
ALTER TABLE public.evaluaciones
  ADD COLUMN IF NOT EXISTS es_catalogo          BOOLEAN  NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS precio_clp           INTEGER  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS descripcion_catalogo  TEXT     DEFAULT NULL;

-- Marcar evaluaciones sin profesor_id como catalogo automaticamente
UPDATE public.evaluaciones
SET es_catalogo = TRUE
WHERE profesor_id IS NULL
  AND es_catalogo = FALSE;

-- 2. Tabla de solicitudes de acceso a evaluaciones del catalogo
CREATE TABLE IF NOT EXISTS public.solicitudes_evaluacion (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluacion_id     TEXT         NOT NULL REFERENCES public.evaluaciones(id) ON DELETE CASCADE,
  profesor_id       UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  establecimiento   TEXT         NOT NULL DEFAULT '',
  rbd               TEXT         DEFAULT NULL,
  mensaje           TEXT         DEFAULT NULL,
  estado            TEXT         NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
  aprobado_por      UUID         REFERENCES auth.users(id) ON DELETE SET NULL,
  fecha_resolucion  TIMESTAMPTZ  DEFAULT NULL,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE public.solicitudes_evaluacion ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Docente ve sus solicitudes" ON public.solicitudes_evaluacion;
CREATE POLICY "Docente ve sus solicitudes"
  ON public.solicitudes_evaluacion FOR SELECT
  USING (profesor_id = auth.uid());

DROP POLICY IF EXISTS "Docente inserta sus solicitudes" ON public.solicitudes_evaluacion;
CREATE POLICY "Docente inserta sus solicitudes"
  ON public.solicitudes_evaluacion FOR INSERT
  WITH CHECK (profesor_id = auth.uid());

DROP POLICY IF EXISTS "Admin gestiona solicitudes" ON public.solicitudes_evaluacion;
CREATE POLICY "Admin gestiona solicitudes"
  ON public.solicitudes_evaluacion FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND p.rol = 'admin'
    )
  );

-- 3. RPC: docente solicita acceso a evaluacion del catalogo
CREATE OR REPLACE FUNCTION public.docente_solicitar_evaluacion(
  p_evaluacion_id TEXT,
  p_mensaje       TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_evaluacion_titulo TEXT;
  v_es_catalogo       BOOLEAN;
  v_existing          UUID;
  v_solicitud_id      UUID;
  v_perfil            RECORD;
BEGIN
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

-- 4. RPC: admin asigna evaluacion a docente
CREATE OR REPLACE FUNCTION public.admin_asignar_evaluacion_a_docente(
  p_solicitud_id  UUID,
  p_evaluacion_id TEXT,
  p_profesor_id   UUID,
  p_curso_id      TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
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

-- 5. RPC: admin rechaza solicitud
CREATE OR REPLACE FUNCTION public.admin_rechazar_solicitud_evaluacion(
  p_solicitud_id UUID,
  p_motivo       TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
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

COMMIT;
