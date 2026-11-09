-- Migración 072: Reparación matemática y editorial de M2 Invierno 2024 Pregunta 27
-- Restaura la ecuación cuadrática formal 2x^2 + kx - k = 0 y las 5 alternativas A-E con clave B
BEGIN;

UPDATE public.preguntas
SET enunciado = '**27. Si las raíces (o soluciones) de la ecuación $2x^2 + kx - k = 0$ son $x_1$ y $x_2$, con $k \ne 0$, ¿cuál de las siguientes expresiones es igual a $(x_1 + 1)(x_2 + 1)$?**',
    alternativas = '[{"letra":"A","texto":"1","es_correcta":false},{"letra":"B","texto":"1 - k","es_correcta":true},{"letra":"C","texto":"1 + k","es_correcta":false},{"letra":"D","texto":"1 - k^2","es_correcta":false},{"letra":"E","texto":"k^2","es_correcta":false}]'::jsonb,
    respuesta_correcta = 'B'
WHERE id = 'preg-paes-mat2-24inv-27';

COMMIT;
