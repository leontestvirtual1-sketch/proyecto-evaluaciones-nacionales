-- Migración 048: Corrección de ecuación y alternativas A, B, C, D con figuras en Pregunta 38 PAES M1 2023
UPDATE public.preguntas
SET enunciado = '¿Cuál de los siguientes gráficos representa mejor a la función f definida por $f(x) = (x + 3)^2$, con dominio el conjunto de los números reales?',
    imagen_url = NULL,
    alternativas = '[
      {"letra": "A", "texto": "![Gráfico Opción A](https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/figura_p38_opcion_a.png)", "es_correcta": false},
      {"letra": "B", "texto": "![Gráfico Opción B](https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/figura_p38_opcion_b.png)", "es_correcta": true},
      {"letra": "C", "texto": "![Gráfico Opción C](https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/figura_p38_opcion_c.png)", "es_correcta": false},
      {"letra": "D", "texto": "![Gráfico Opción D](https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/figura_p38_opcion_d.png)", "es_correcta": false}
    ]'::jsonb,
    respuesta_correcta = 'B',
    updated_at = NOW()
WHERE id = 'preg-paes-m1-23-38';
