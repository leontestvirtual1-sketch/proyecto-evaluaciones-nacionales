-- Migración 047: Corrección y adición de figuras oficiales y sistema de ecuaciones en Pregunta 32 PAES M1 2023
UPDATE public.preguntas
SET enunciado = '¿Cuál de los siguientes puntos ubicados en el plano cartesiano representa mejor a la intersección de las rectas asociadas al sistema?

![Sistema de ecuaciones](https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/figura_p32_sistema.png)

**Recta 1:** 2y - 3x = -4  
**Recta 2:** 3x - y = 0',
    imagen_url = NULL,
    alternativas = '[
      {"letra": "A", "texto": "![Plano cartesiano Opción A](https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/figura_p32_opcion_a.png)", "es_correcta": true},
      {"letra": "B", "texto": "![Plano cartesiano Opción B](https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/figura_p32_opcion_b.png)", "es_correcta": false},
      {"letra": "C", "texto": "![Plano cartesiano Opción C](https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/figura_p32_opcion_c.png)", "es_correcta": false},
      {"letra": "D", "texto": "![Plano cartesiano Opción D](https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/figura_p32_opcion_d.png)", "es_correcta": false}
    ]'::jsonb,
    respuesta_correcta = 'A',
    updated_at = NOW()
WHERE id = 'preg-paes-m1-23-32';
