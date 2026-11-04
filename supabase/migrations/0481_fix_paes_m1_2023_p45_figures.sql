-- ==============================================================================
-- Migración 048: Remediación Integral Pregunta 45 PAES M1 2023 Forma 113
-- 1. Enunciado con figura adjunta en el primer cuadrante.
-- 2. 4 alternativas gráficas de planos cartesianos ordenadas [A, B, C, D].
-- 3. Remediación orden alternativas Pregunta 21 [A, B, C, D].
-- ==============================================================================

UPDATE public.preguntas
SET
  enunciado = '¿Cuál de las figuras dadas en las opciones se puede obtener usando solo traslaciones de la figura adjunta?

![Figura adjunta](https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/figura_p45_adjunta.png)',
  imagen_url = NULL,
  alternativas = '[
    {"letra": "A", "texto": "![Plano cartesiano Opción A](https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/figura_p45_opcion_a.png)", "es_correcta": true},
    {"letra": "B", "texto": "![Plano cartesiano Opción B](https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/figura_p45_opcion_b.png)", "es_correcta": false},
    {"letra": "C", "texto": "![Plano cartesiano Opción C](https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/figura_p45_opcion_c.png)", "es_correcta": false},
    {"letra": "D", "texto": "![Plano cartesiano Opción D](https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/figura_p45_opcion_d.png)", "es_correcta": false}
  ]'::jsonb,
  respuesta_correcta = 'A',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-45';

UPDATE public.preguntas
SET
  alternativas = '[
    {"letra": "A", "texto": "n m 3 1 FORMA 113  2023", "es_correcta": true},
    {"letra": "B", "texto": "n m 3 1", "es_correcta": false},
    {"letra": "C", "texto": "n m 3 9", "es_correcta": false},
    {"letra": "D", "texto": "n m 3 9", "es_correcta": false}
  ]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-21';
