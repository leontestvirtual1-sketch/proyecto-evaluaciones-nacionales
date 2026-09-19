-- Migración 045: Inserción de imagen pedagógica inline [IMAGEN] en Pregunta 5 PAES M1 2023
UPDATE public.preguntas
SET enunciado = 'El modelo RVA de colores, permite crear cualquier color mediante la mezcla de los distintos tonos de tres colores: rojo, verde y azul. Los valores de la intensidad de cada uno de estos colores van desde el 0 al 255 y cada color creado tiene un código de tres números donde el primero representa al rojo, el segundo al verde y el tercero al azul.

El código de la mezcla de dos colores se obtiene haciendo el promedio de cada uno de los valores de los colores originales tal como se presenta a continuación:

[IMAGEN]

¿Con qué color hay que mezclar el color (160, 60, 120) para obtener el color (170, 80, 60)?'
WHERE id = 'preg-paes-m1-23-05';
