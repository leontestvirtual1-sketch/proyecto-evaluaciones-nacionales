-- Migración 049: Corrección de caracteres Symbol/PUA en fórmulas de Pregunta 43 PAES M1 2023
UPDATE public.preguntas
SET enunciado = 'Una empresa vende crema para las manos en envases con forma de cilindros rectos de 20 cm de altura y de distintos diámetros.

Por una promoción se decide aumentar en su 20 % la capacidad de cada envase, manteniendo la altura de los envases cilíndricos.

¿Cuál de las siguientes funciones permite determinar el volumen de los nuevos envases, en $\text{cm}^3$, con $r$ el radio del envase sin promoción, en cm?',
    alternativas = '[
      {"letra": "A", "texto": "$p(r) = 16 \\cdot r^2 \\cdot \\pi$", "es_correcta": false},
      {"letra": "B", "texto": "$g(r) = 24 \\cdot r^2 \\cdot \\pi$", "es_correcta": true},
      {"letra": "C", "texto": "$f(r) = 28{,}8 \\cdot r^2 \\cdot \\pi$", "es_correcta": false},
      {"letra": "D", "texto": "$h(r) = 576 \\cdot r^2 \\cdot \\pi$", "es_correcta": false}
    ]'::jsonb,
    respuesta_correcta = 'B',
    updated_at = NOW()
WHERE id = 'preg-paes-m1-23-43';
