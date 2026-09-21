-- ==============================================================================
-- Migracion 057: RPC get_preguntas_evaluacion - Sin claves para el alumno
-- Fase 3.2 del Plan de Accion Sysget Saber
-- ==============================================================================
BEGIN;

CREATE OR REPLACE FUNCTION public.get_preguntas_evaluacion(p_evaluacion_id TEXT)
RETURNS TABLE (
  id               TEXT,
  asignatura_id    TEXT,
  eje_tematico_id  TEXT,
  habilidad_id     TEXT,
  tipo             TEXT,
  nivel            TEXT,
  dificultad       TEXT,
  enunciado        TEXT,
  imagen_url       TEXT,
  tabla_markdown   TEXT,
  alternativas     JSONB,
  puntaje          NUMERIC,
  fuente           TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_evaluacion RECORD;
BEGIN
  SELECT preguntas_ids, estado, es_catalogo
  INTO v_evaluacion
  FROM public.evaluaciones
  WHERE id = p_evaluacion_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Evaluacion no encontrada: %', p_evaluacion_id
      USING ERRCODE = 'P0002';
  END IF;

  IF v_evaluacion.estado IS DISTINCT FROM 'activa' THEN
    RAISE EXCEPTION 'Evaluacion no disponible (estado: %)', v_evaluacion.estado
      USING ERRCODE = 'P0001';
  END IF;

  RETURN QUERY
    SELECT
      p.id,
      p.asignatura_id,
      p.eje_tematico_id,
      p.habilidad_id,
      p.tipo,
      p.nivel,
      p.dificultad,
      p.enunciado,
      p.imagen_url,
      p.tabla_markdown,
      (
        SELECT jsonb_agg(
          jsonb_build_object('letra', alt->>'letra', 'texto', alt->>'texto')
          ORDER BY alt->>'letra'
        )
        FROM jsonb_array_elements(p.alternativas) AS alt
      ) AS alternativas,
      p.puntaje,
      p.fuente
    FROM public.preguntas p
    JOIN (
      SELECT elem::TEXT AS pid, ordinality
      FROM jsonb_array_elements_text(
        (SELECT preguntas_ids::JSONB FROM public.evaluaciones WHERE id = p_evaluacion_id)
      ) WITH ORDINALITY AS t(elem, ordinality)
    ) ord ON p.id = ord.pid
    ORDER BY ord.ordinality;
END;
$$;

REVOKE ALL ON FUNCTION public.get_preguntas_evaluacion(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_preguntas_evaluacion(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_preguntas_evaluacion(TEXT) TO service_role;

COMMIT;
