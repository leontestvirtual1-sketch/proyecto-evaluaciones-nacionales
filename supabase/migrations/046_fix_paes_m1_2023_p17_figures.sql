-- Migración 046: Corrección y adición de figuras y tablas oficiales en Pregunta 17 PAES M1 2023
UPDATE public.preguntas
SET enunciado = 'Tres figuras están formadas por cuadrados congruentes entre sí que presentan una regla de formación que consiste en duplicar el lado de cada figura respecto de la anterior, como se presenta a continuación:

![Figuras congruentes](https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/figura_p17_cuadrados.png)

¿En cuál de las siguientes tablas se relaciona cada figura con la cantidad de cuadrados que la componen?',
    imagen_url = NULL,
    alternativas = '[
      {"letra": "A", "texto": "![Tabla Opción A](https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/figura_p17_opcion_a.png)", "es_correcta": false},
      {"letra": "B", "texto": "![Tabla Opción B](https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/figura_p17_opcion_b.png)", "es_correcta": false},
      {"letra": "C", "texto": "![Tabla Opción C](https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/figura_p17_opcion_c.png)", "es_correcta": true},
      {"letra": "D", "texto": "![Tabla Opción D](https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/figura_p17_opcion_d.png)", "es_correcta": false}
    ]'::jsonb,
    respuesta_correcta = 'C',
    updated_at = NOW()
WHERE id = 'preg-paes-m1-23-17';
