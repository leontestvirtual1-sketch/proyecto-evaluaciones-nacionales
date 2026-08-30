-- ============================================================================
-- Migración 037: PAES Oficial Competencia Matemática 1 (M1) — Proceso 2023 (Forma 113)
-- Catálogo General Sysget Saber (es_catalogo = TRUE, profesor_id = NULL)
-- Total Preguntas: 65 (60 puntuables + 5 piloto) | DEMRE Oficial
-- ============================================================================

BEGIN;

-- 1. Cabecera en public.evaluaciones
INSERT INTO public.evaluaciones (
  id, titulo, descripcion, asignatura_id, nivel, tiempo_limite, estado, es_catalogo, precio_clp, descripcion_catalogo, profesor_id, total_preguntas, created_at, updated_at
) VALUES (
  'eval-paes-mat1-2023-f113',
  'PAES Oficial Competencia Matemática 1 (M1) — Proceso 2023 (Forma 113)',
  'Evaluación oficial DEMRE de Competencia Matemática 1 (M1) aplicada en el Proceso de Admisión 2023 (Forma 113). Incluye 65 preguntas de selección múltiple (60 válidas y 5 piloto) cubriendo Números, Álgebra y Funciones, Geometría y Probabilidad y Estadística.',
  'asig-1',
  '4° Medio',
  140,
  'activa',
  TRUE,
  0,
  'Prueba oficial DEMRE PAES M1 2023 Forma 113 completa con 65 ítems, escala oficial DEMRE de 100 a 1000 puntos y pauta docente con justificación curricular.',
  NULL,
  65,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  descripcion = EXCLUDED.descripcion,
  es_catalogo = EXCLUDED.es_catalogo,
  updated_at = NOW();

-- 2. Ítems en public.preguntas
INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-01',
  'asig-1',
  'eje-mat-1',
  'hab-mat-2',
  'seleccion_multiple',
  '4° Medio',
  'baja',
  NULL,
  'Por el arriendo de un juego inflable se cobra una cuota fija de 
000
120
$
 por cuatro 
horas, más 
000
25
$
 por cada hora adicional. 
 
¿Cuántas horas como máximo puede arrendar una empresa el juego inflable si 
tiene un presupuesto de 
000
240
$
 para este efecto?',
  '[{"letra": "A", "texto": "4", "es_correcta": false}, {"letra": "B", "texto": "8", "es_correcta": true}, {"letra": "C", "texto": "9", "es_correcta": false}, {"letra": "D", "texto": "10", "es_correcta": false}]'::jsonb,
  'B',
  1,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-02',
  'asig-1',
  'eje-mat-1',
  'hab-mat-1',
  'seleccion_multiple',
  '4° Medio',
  'baja',
  NULL,
  'Considera el número p distinto de cero que es multiplicado dos veces por 
25
,1
                  
y luego, dos veces por 
75
,0
, tal como se representa a continuación: 
 
75
,0
75
,0
25
,1
25
,1
p




 
 
¿Qué pueden representar dichas multiplicaciones, respecto del número original p ?',
  '[{"letra": "A", "texto": "Que hubo dos aumentos del % 25 y luego, dos disminuciones del % 25 .", "es_correcta": true}, {"letra": "B", "texto": "Que no hubo aumento de p ni disminución de p.", "es_correcta": false}, {"letra": "C", "texto": "Que hubo dos aumentos de 25 ,0 y luego, dos disminuciones de 75 ,0 .", "es_correcta": false}, {"letra": "D", "texto": "Que hubo dos aumentos del % 25 y luego, dos disminuciones del % 75 . FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'A',
  1,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-03',
  'asig-1',
  'eje-mat-1',
  'hab-mat-4',
  'seleccion_multiple',
  '4° Medio',
  'baja',
  NULL,
  'En la figura adjunta se cumple que la suma de los valores de los casilleros 
contiguos de una fila es igual al valor inmediatamente superior a ellos                  
(por ejemplo 
f
q
p


). 
 
 
 
 
 
 
 
Si la suma de los tres valores de la última fila es 17 , ¿cuál es el valor de 
f
p 
?',
  '[{"letra": "A", "texto": "12", "es_correcta": false}, {"letra": "B", "texto": "13", "es_correcta": false}, {"letra": "C", "texto": "18", "es_correcta": true}, {"letra": "D", "texto": "21", "es_correcta": false}]'::jsonb,
  'C',
  1,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-04',
  'asig-1',
  'eje-mat-1',
  'hab-mat-3',
  'seleccion_multiple',
  '4° Medio',
  'baja',
  NULL,
  'La automotora “Mi auto” tiene cinco marcas de automóviles, cada marca tiene tres 
modelos y cada modelo está en tres colores distintos. 
 
La automotora “Viaje feliz” tiene cuatro marcas de automóviles, cada marca tiene 
tres modelos y cada modelo en cuatro colores distintos. 
 
Si las marcas de los automóviles de las automotoras son distintas entre sí, ¿cuál de 
las siguientes afirmaciones es verdadera?',
  '[{"letra": "A", "texto": "La automotora “Viaje feliz” ofrece tres posibilidades distintas más para elegir un automóvil que la automotora “Mi auto”.", "es_correcta": true}, {"letra": "B", "texto": "Ambas automotoras ofrecen la misma cantidad de posibilidades distintas para elegir un automóvil.", "es_correcta": false}, {"letra": "C", "texto": "La automotora “Mi auto” ofrece más posibilidades distintas para elegir un automóvil que la automotora “Viaje feliz”.", "es_correcta": false}, {"letra": "D", "texto": "El total de las distintas posibilidades de elegir un automóvil está determinado por la suma entre la cantidad de marcas, de modelos y de colores. 25 f p q 4 FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'A',
  1,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-05',
  'asig-1',
  'eje-mat-1',
  'hab-mat-2',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'El modelo RVA de colores, permite crear cualquier color mediante la mezcla de los 
distintos tonos de tres colores: rojo, verde y azul. Los valores de la intensidad de 
cada uno de estos colores van desde el 0 al 255 y cada color creado tiene un 
código de tres números donde el primero representa al rojo, el segundo al verde y 
el tercero al azul. 
 
El código de la mezcla de dos colores se obtiene haciendo el promedio de cada 
uno de los valores de los colores originales tal como se presenta a continuación: 
 
 
 
 
 
 
¿Con qué color hay que mezclar el color 

120
,
60
,
160
 para obtener el color 


60
,
80
,
170
?',
  '[{"letra": "A", "texto": "  60 , 20 , 10", "es_correcta": false}, {"letra": "B", "texto": "  60 , 100 , 180", "es_correcta": false}, {"letra": "C", "texto": "  0 , 100 , 180", "es_correcta": true}, {"letra": "D", "texto": "  90 , 70 , 165", "es_correcta": false}]'::jsonb,
  'C',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-06',
  'asig-1',
  'eje-mat-1',
  'hab-mat-1',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'En la temporada de invierno, la diferencia horaria entre Nueva Zelanda y Chile es 
de 
h
16
, desde Chile. Por ejemplo, si en Chile son las 11 de la mañana de un 
lunes, en Nueva Zelanda son las 3 de la mañana del martes. 
 
En la misma temporada la diferencia horaria entre México y Chile es de 
h
1

, 
desde Chile. Es decir, cuando en Chile son las 11 de la mañana de un lunes, en 
México son las 10 de la mañana del mismo día. 
 
¿Cuál es la diferencia horaria entre Nueva Zelanda y México, desde México, en la 
temporada de invierno?',
  '[{"letra": "A", "texto": "h 17 ", "es_correcta": false}, {"letra": "B", "texto": "h 15 ", "es_correcta": false}, {"letra": "C", "texto": "h 15", "es_correcta": false}, {"letra": "D", "texto": "h 17 Colores para mezclar Color resultante   c ,b ,a ,  t ,n , m        2 t c , 2 n b , 2 m a FORMA 113  2023", "es_correcta": true}]'::jsonb,
  'D',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-07',
  'asig-1',
  'eje-mat-1',
  'hab-mat-4',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'Un comerciante compra una cantidad de naranjas a razón de 3 kilogramos por 
600
$
 y las vende todas a razón de 4 kilogramos por 1000
$
.  
 
Si obtuvo una ganancia de 3000
$
, ¿cuántos kilogramos de naranjas compró?',
  '[{"letra": "A", "texto": "8", "es_correcta": false}, {"letra": "B", "texto": "12", "es_correcta": false}, {"letra": "C", "texto": "25", "es_correcta": false}, {"letra": "D", "texto": "60", "es_correcta": true}]'::jsonb,
  'D',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-08',
  'asig-1',
  'eje-mat-1',
  'hab-mat-3',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  '¿Cuál es el 
%
40
 del 
%
15
 de 300 ?',
  '[{"letra": "A", "texto": "18", "es_correcta": true}, {"letra": "B", "texto": "75", "es_correcta": false}, {"letra": "C", "texto": "165", "es_correcta": false}, {"letra": "D", "texto": "180", "es_correcta": false}]'::jsonb,
  'A',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-09',
  'asig-1',
  'eje-mat-1',
  'hab-mat-2',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'Si el precio de un helado es 500
$
, ¿cuál de las siguientes expresiones representa 
el valor del helado aumentado en su 
%
120
?',
  '[{"letra": "A", "texto": "500 120 500  ", "es_correcta": false}, {"letra": "B", "texto": "500 20 500  ", "es_correcta": false}, {"letra": "C", "texto": "500 20 ,1 ", "es_correcta": false}, {"letra": "D", "texto": "500 20 ,2  FORMA 113  2023", "es_correcta": true}]'::jsonb,
  'D',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-10',
  'asig-1',
  'eje-mat-1',
  'hab-mat-1',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'Los cuadrados congruentes de las cuadrículas de 5 por 5 que aparecen en las 
opciones sirven para contar el puntaje que se ha obtenido en cierto juego con 
cartas. 
 
Una persona inicialmente tiene 8 puntos de un total de 25. Luego de una buena 
jugada, el juego la bonifica con un aumento del 
%
25
 respecto de los puntos que 
tiene en ese momento. 
 
¿Cuál de las siguientes opciones presenta de forma correcta el cambio entre la 
situación inicial de 8 puntos y el puntaje final luego de la bonificación? 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
Puntaje inicial 
Puntaje final',
  '[{"letra": "A", "texto": "Puntaje inicial Puntaje final", "es_correcta": false}, {"letra": "B", "texto": "Puntaje inicial Puntaje final", "es_correcta": false}, {"letra": "C", "texto": "Puntaje inicial Puntaje final", "es_correcta": true}, {"letra": "D", "texto": "FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'C',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-11',
  'asig-1',
  'eje-mat-1',
  'hab-mat-4',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'En un estudio realizado a un grupo de 25 personas, se les consultó por su bebida 
favorita, de entre cuatro disponibles (Almíbar, Refrescante, Quitased y Frutirico).         
En la tabla adjunta se presentan los resultados obtenidos. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
¿Cuál de las siguientes afirmaciones es verdadera?',
  '[{"letra": "A", "texto": "El % 80 de las personas prefiere la bebida Almíbar o la bebida Quitased.", "es_correcta": true}, {"letra": "B", "texto": "Un % 16 ,0 de las personas prefiere la bebida Refrescante.", "es_correcta": false}, {"letra": "C", "texto": "Las personas que prefieren la bebida Frutirico representan un % 1 de las personas que prefieren la bebida Quitased.", "es_correcta": false}, {"letra": "D", "texto": "Las personas que prefieren la bebida Almíbar o la bebida Frutirico representan menos del % 50 del total de personas.", "es_correcta": false}]'::jsonb,
  'A',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-12',
  'asig-1',
  'eje-mat-1',
  'hab-mat-3',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  '¿Qué porcentaje es 4740 de 
800
15
?',
  '[{"letra": "A", "texto": "% 3,0", "es_correcta": false}, {"letra": "B", "texto": "% 3", "es_correcta": false}, {"letra": "C", "texto": "% 3 ,3", "es_correcta": false}, {"letra": "D", "texto": "% 30 Bebida Cantidad de personas Almíbar 12 Refrescante 4 Quitased 8 Frutirico 1 FORMA 113  2023", "es_correcta": true}]'::jsonb,
  'D',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-13',
  'asig-1',
  'eje-mat-1',
  'hab-mat-2',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'Un profesor ve algunos resultados de una encuesta por internet realizada a       
100 personas un determinado día, de las cuales el 
%
25
 omitió la última pregunta. 
Una semana después se realiza la misma encuesta a otras 100 personas, de las 
cuales un 
%
35
 omitió la última pregunta. 
 
 
El profesor le pide a cuatro de sus estudiantes que realicen conclusiones de estos 
datos. 
 
 Sebastián señala: del total de personas encuestadas un 
%
60
 omitió la 
última pregunta. 
 Angélica señala: en la segunda encuesta la omisión total tuvo un aumento 
de 10 puntos porcentuales con respecto a la omisión total de la primera 
encuesta. 
 Luisa señala: del total de personas encuestadas 60 personas omitieron la 
última pregunta. 
 Manuel señala: en la segunda encuesta la pregunta más omitida fue la 
última. 
 
¿Cuál de ellos está en lo correcto?',
  '[{"letra": "A", "texto": "Sebastián", "es_correcta": false}, {"letra": "B", "texto": "Angélica", "es_correcta": false}, {"letra": "C", "texto": "Luisa", "es_correcta": true}, {"letra": "D", "texto": "Manuel FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'C',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-14',
  'asig-1',
  'eje-mat-1',
  'hab-mat-1',
  'seleccion_multiple',
  '4° Medio',
  'media',
  '/preguntas/paes_mat1_2023_forma113/p12_img_4.png',
  'Un estudiante realiza el siguiente procedimiento para determinar el resultado de la 
expresión 
2
2
2
3
3
2









, cometiendo un error en el desarrollo. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
¿En cuál de los pasos se cometió el error?',
  '[{"letra": "A", "texto": "En el Paso 1", "es_correcta": false}, {"letra": "B", "texto": "En el Paso 2", "es_correcta": true}, {"letra": "C", "texto": "En el Paso 3", "es_correcta": false}, {"letra": "D", "texto": "En el Paso 4 2 2 2 3 3 2          2 2 2 3 2 3             4 2 3 2 3        4 4 9       256 6561 Paso 1 Paso 2 Paso 3 Paso 4 FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'B',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-15',
  'asig-1',
  'eje-mat-1',
  'hab-mat-4',
  'seleccion_multiple',
  '4° Medio',
  'alta',
  NULL,
  'En la tabla adjunta se presentan las equivalencias de las medidas de 
almacenamiento de información de una computadora, cuya unidad básica es el bit. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
¿Cuántos Gigabytes equivalen a un Zettabyte?',
  '[{"letra": "A", "texto": "10 2", "es_correcta": false}, {"letra": "B", "texto": "12 2", "es_correcta": false}, {"letra": "C", "texto": "40 2", "es_correcta": true}, {"letra": "D", "texto": "50 2 Medida Simbología Equivalencia Byte B 8 bits Kilobyte KB 1024 B Megabyte MB 1024 KB Gigabyte GB 1024 MB Terabyte TB 1024 GB Petabyte PB 1024 TB Exabyte EB 1024 PB Zettabyte ZB 1024 EB Yottabyte YB 1024 ZB FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'C',
  3,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-16',
  'asig-1',
  'eje-mat-1',
  'hab-mat-3',
  'seleccion_multiple',
  '4° Medio',
  'alta',
  NULL,
  '¿Cuál es el valor de 

2
3
1
6
2
3



?',
  '[{"letra": "A", "texto": "27 2 ", "es_correcta": true}, {"letra": "B", "texto": "1 ", "es_correcta": false}, {"letra": "C", "texto": "3 2", "es_correcta": false}, {"letra": "D", "texto": "2 3", "es_correcta": false}]'::jsonb,
  'A',
  3,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-17',
  'asig-1',
  'eje-mat-1',
  'hab-mat-2',
  'seleccion_multiple',
  '4° Medio',
  'alta',
  NULL,
  'Tres figuras están formadas por cuadrados congruentes entre sí que presentan una 
regla de formación que consiste en duplicar el lado de cada figura respecto de la 
anterior, como se presenta a continuación: 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
¿En cuál de las siguientes tablas se relaciona cada figura con la cantidad de 
cuadrados que la componen? 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
Figura 
1 
2 
3 
Cantidad de cuadrados 
(41)0 
42 
43',
  '[{"letra": "A", "texto": "Opción A", "es_correcta": false}, {"letra": "B", "texto": "Figura 1 2 3 Cantidad de cuadrados 22 22 2 22 4", "es_correcta": false}, {"letra": "C", "texto": "Figura 1 2 3 Cantidad de cuadrados (21)2 (22)2 (23)2", "es_correcta": true}, {"letra": "D", "texto": "Figura 1 2 3 Cantidad de cuadrados (22)0 (22)2 (22)4 Fig. 1 Fig. 2 Fig. 3 FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'C',
  3,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-18',
  'asig-1',
  'eje-mat-2',
  'hab-mat-1',
  'seleccion_multiple',
  '4° Medio',
  'baja',
  NULL,
  'En la tabla adjunta se presenta el precio original y el precio oferta de tres productos 
que están con un descuento en un almacén. 
 
 
 
 
 
 
 
 
 
 
 
¿Cuál de las siguientes afirmaciones es verdadera respecto al porcentaje de 
descuento de los productos?',
  '[{"letra": "A", "texto": "Al comprar los tres productos, el descuento es un % 45 del total original.", "es_correcta": false}, {"letra": "B", "texto": "El porcentaje de descuento en el té es mayor que el porcentaje de descuento en el azúcar.", "es_correcta": false}, {"letra": "C", "texto": "El porcentaje de descuento de cada producto es la diferencia entre el valor original y el precio oferta, y todo multiplicado por 100 .", "es_correcta": false}, {"letra": "D", "texto": "La leche tiene el doble de porcentaje de descuento que el té.", "es_correcta": true}]'::jsonb,
  'D',
  1,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-19',
  'asig-1',
  'eje-mat-2',
  'hab-mat-4',
  'seleccion_multiple',
  '4° Medio',
  'baja',
  NULL,
  'Cierto tipo de bacteria se cuadruplica cada una hora. 
 
Si en un instante hay 320 de estas bacterias en un lugar, ¿cuál de las siguientes 
expresiones permite determinar la cantidad de bacterias que habrá n horas  
después de ese instante?',
  '[{"letra": "A", "texto": "n 4 320 ", "es_correcta": false}, {"letra": "B", "texto": "n 4 320 ", "es_correcta": true}, {"letra": "C", "texto": " n 4 320 ", "es_correcta": false}, {"letra": "D", "texto": "4 320n  Productos de oferta de la semana Producto Precio original Precio oferta Leche (1 L) $1000 $800 Té (100 unidades) $2000 $1800 Azúcar (1 kg) $1000 $850 FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'B',
  1,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-20',
  'asig-1',
  'eje-mat-2',
  'hab-mat-3',
  'seleccion_multiple',
  '4° Medio',
  'media',
  '/preguntas/paes_mat1_2023_forma113/p16_img_1.jpeg',
  'El largo de un rectángulo mide el triple de su ancho. 
 
Si su ancho mide 
mm
3k
, con k un número entero positivo, ¿cuál de las 
siguientes expresiones representa el área del rectángulo, en 
2
mm ?',
  '[{"letra": "A", "texto": "2 k k 9 ", "es_correcta": false}, {"letra": "B", "texto": "1 k 2 9 ", "es_correcta": false}, {"letra": "C", "texto": "1 k 2 3 ", "es_correcta": true}, {"letra": "D", "texto": "2 k k 3 ", "es_correcta": false}]'::jsonb,
  'C',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-21',
  'asig-1',
  'eje-mat-2',
  'hab-mat-2',
  'seleccion_multiple',
  '4° Medio',
  'media',
  '/preguntas/paes_mat1_2023_forma113/p17_img_1.png',
  'Considera las variables directamente proporcionales m y n , con 
3
n 
. Cuando 
121
m 
 se tiene que 
363
n 
. 
 
¿Cuál de los siguientes gráficos representa mejor la relación entre m y n ?',
  '[{"letra": "D", "texto": "n m 3 9", "es_correcta": false}, {"letra": "C", "texto": "n m 3 9", "es_correcta": false}, {"letra": "B", "texto": "n m 3 1", "es_correcta": false}, {"letra": "A", "texto": "n m 3 1 FORMA 113  2023", "es_correcta": true}]'::jsonb,
  'A',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-22',
  'asig-1',
  'eje-mat-2',
  'hab-mat-1',
  'seleccion_multiple',
  '4° Medio',
  'media',
  '/preguntas/paes_mat1_2023_forma113/p18_img_1.jpeg',
  '¿Cuál de las siguientes expresiones es igual que 


a
(b
c)
a
(b
c)





?',
  '[{"letra": "A", "texto": "2 2 2 c b a  ", "es_correcta": false}, {"letra": "B", "texto": "2 2 2 c b ab 2 a   ", "es_correcta": true}, {"letra": "C", "texto": "2 2 2 2 2 c b b a a   ", "es_correcta": false}, {"letra": "D", "texto": "2 2 )c b ( a  ", "es_correcta": false}]'::jsonb,
  'B',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-23',
  'asig-1',
  'eje-mat-2',
  'hab-mat-4',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'El volumen del paralelepípedo de la figura adjunta, en metros cúbicos, es 


x
15
x
2
x
2
3


, con x un número real mayor que 5 . 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
¿Cuál de las siguientes expresiones representa el valor de p ?',
  '[{"letra": "A", "texto": "3 x ", "es_correcta": false}, {"letra": "B", "texto": "5 x ", "es_correcta": false}, {"letra": "C", "texto": "5 x2 ", "es_correcta": false}, {"letra": "D", "texto": "3 x  p metros x metros (x – 5) metros FORMA 113  2023", "es_correcta": true}]'::jsonb,
  'D',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-24',
  'asig-1',
  'eje-mat-2',
  'hab-mat-3',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'La expresión 




3
a
1
a
1
a
2




 se factoriza como el producto de dos 
factores, tal que uno de ellos es 
1
a 
. 
 
¿Cuál de las siguientes expresiones corresponde al otro factor de la expresión?',
  '[{"letra": "A", "texto": "  2 a 3 a2  ", "es_correcta": false}, {"letra": "B", "texto": "  2 a ", "es_correcta": false}, {"letra": "C", "texto": "  2 a a2  ", "es_correcta": false}, {"letra": "D", "texto": "  2 a 2 ", "es_correcta": true}]'::jsonb,
  'D',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-25',
  'asig-1',
  'eje-mat-2',
  'hab-mat-2',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'Una persona desea preparar galletas y tiene una receta para doce galletas. 
 
 
 
 
 
 
 
 
 
 
 
 
 
Al revisar su cocina, se da cuenta de que dispone de los siguientes ingredientes: 
 
 
g
500
 de azúcar 
 
g
600
 de mantequilla 
 
kg
1
 de harina 
 
4 huevos enteros 
 
¿Cuál es la cantidad máxima de galletas que la persona podrá preparar, 
manteniendo las cantidades de los ingredientes de la receta original haciendo de a 
12 galletas?',
  '[{"letra": "A", "texto": "36", "es_correcta": true}, {"letra": "B", "texto": "40", "es_correcta": false}, {"letra": "C", "texto": "48", "es_correcta": false}, {"letra": "D", "texto": "60 r FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'A',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-26',
  'asig-1',
  'eje-mat-2',
  'hab-mat-1',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'La ley de Hooke establece que el estiramiento que sufre un resorte es 
directamente proporcional a la masa que sujeta. 
 
En la figura adjunta se presenta cómo se estira un resorte cuando se le cuelgan 
diferentes masas. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
¿Cuál es el valor de x ?',
  '[{"letra": "A", "texto": "4", "es_correcta": false}, {"letra": "B", "texto": "6", "es_correcta": true}, {"letra": "C", "texto": "8", "es_correcta": false}, {"letra": "D", "texto": "2 27 2 cm x cm 3 kg 9 kg FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'B',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-27',
  'asig-1',
  'eje-mat-2',
  'hab-mat-4',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'Para dibujar las proporciones del cuerpo humano existen varios cánones que se 
miden en “cabezas”, unidad que hace referencia a la altura de la cabeza del 
individuo. 
 
El canon que se representa en la figura adjunta se llama “canon de las siete 
cabezas y media” y plantea que la figura humana masculina en la adultez se puede 
modelar por 7 2
1 cabezas de altura y ancho máximo de 2 cabezas. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
Loomis, A. (2005). El dibujo de figura en todo su valor. Continen 1. 
 
 
Si se usa este modelo, ¿cuánto debe medir el ancho máximo del dibujo de un 
hombre adulto si se sabe que la estatura en el dibujo es de 
cm
15
?',
  '[{"letra": "A", "texto": "cm 6", "es_correcta": false}, {"letra": "B", "texto": "cm 5", "es_correcta": false}, {"letra": "C", "texto": "cm 4", "es_correcta": true}, {"letra": "D", "texto": "cm 1 FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'C',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-28',
  'asig-1',
  'eje-mat-2',
  'hab-mat-3',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'En la siguiente tabla se presenta la velocidad 
)
V
(
 permitida al conducir en las 
calles y caminos de Chile. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
¿Cuál de las siguientes afirmaciones es verdadera?',
  '[{"letra": "A", "texto": "Si un automovilista excede en h km 10 la velocidad máxima permitida cuando condujo en una zona de escuela, entonces iba a una velocidad de h km 20 .", "es_correcta": false}, {"letra": "B", "texto": "Un automovilista tiene permitido conducir a una velocidad de h km 110 en zonas rurales con camino de una pista de circulación por sentido.", "es_correcta": false}, {"letra": "C", "texto": "Si un automovilista en zona urbana decide aumentar su velocidad h km 20 , alcanzando la velocidad máxima permitida, entonces iba a h km 70 .", "es_correcta": false}, {"letra": "D", "texto": "Un automovilista tiene permitido conducir a una de velocidad de h km 100 en zonas rurales. Zonas urbanas h km 50 V  Zonas de escuela: en horario de entrada y salida de estudiantes h km 30 V  Zonas rurales: caminos con una pista de circulación por sentido. h km 100 V  caminos con dos o más pistas de circulación por sentido. h km 120 V  Comisión Nacional de Seguridad de Tránsito. (s.f.). Normativa relacionada con Velocidad. https://www.conaset.cl/normativa- velocidad/#:~:text=En%20zonas%20urbanas%2C%20el%20l%C3%ADmite,es%20de%20120%20km%2Fh FORMA 113  2023", "es_correcta": true}]'::jsonb,
  'D',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-29',
  'asig-1',
  'eje-mat-2',
  'hab-mat-2',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'En una tienda de mascotas se dispone de un monto máximo de 
000
50
$
 para pagar 
la electricidad que se consume en un mes.  
 
La empresa eléctrica que suministra este servicio realiza el cobro, en pesos, 
mediante la función 
5000
x
100
)
x
(c


, siendo x la cantidad de kWh consumidos 
en el mes. 
 
¿Cuál de los siguientes conjuntos contiene a todos y únicamente los posibles 
valores del consumo en kWh en el mes que se puede solventar con el monto 
disponible en esa tienda?',
  '[{"letra": "A", "texto": "  450 ,0", "es_correcta": true}, {"letra": "B", "texto": "  450 ,0", "es_correcta": false}, {"letra": "C", "texto": "  550 ,0", "es_correcta": false}, {"letra": "D", "texto": "  5500 ,0 FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'A',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-30',
  'asig-1',
  'eje-mat-2',
  'hab-mat-1',
  'seleccion_multiple',
  '4° Medio',
  'media',
  '/preguntas/paes_mat1_2023_forma113/p23_img_1.png',
  'Un cargador de celular del tipo A carga 
%
1
 de la capacidad de la batería                
cada 3 minutos y un cargador del tipo B carga %
1
 de la capacidad de la batería 
cada 2 minutos.  
 
Se tienen dos celulares de las mismas características. Uno tiene un 
%
20
 de 
batería cargada y se conecta al cargador del tipo A, mientras que el otro celular 
tiene un 
%
15
 de su batería cargada y se conecta al cargador del tipo B.  
 
¿Cuál de los siguientes gráficos representa de mejor manera el porcentaje de  
carga de las baterías a medida que transcurren los minutos?',
  '[{"letra": "A", "texto": "Opción A", "es_correcta": false}, {"letra": "B", "texto": "Opción B", "es_correcta": false}, {"letra": "C", "texto": "Opción C", "es_correcta": false}, {"letra": "D", "texto": "minutos Porcentaje de carga Tiempo en minutos Porcentaje de carga 15 20 Tiempo en minutos Porcentaje de carga 15 20 Tiempo en minutos Porcentaje de carga 15 20 Tiempo en FORMA 113  2023", "es_correcta": true}]'::jsonb,
  'D',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-31',
  'asig-1',
  'eje-mat-2',
  'hab-mat-4',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'En una frutería cada durazno cuesta 
480
$
 y cada mango cuesta 
400
$
. Una 
persona gastó 6800
$
 en total comprando solo 16 frutas entre duraznos y mangos. 
 
¿Cuál de las siguientes ecuaciones permite determinar la cantidad x de duraznos 
que compró la persona?',
  '[{"letra": "A", "texto": "  6800 x 16 400 x 480   ", "es_correcta": true}, {"letra": "B", "texto": "  6800 16 x 400 x 480   ", "es_correcta": false}, {"letra": "C", "texto": "16 x 400 x 480  ", "es_correcta": false}, {"letra": "D", "texto": "  16 6800 x 400 480   ", "es_correcta": false}]'::jsonb,
  'A',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-32',
  'asig-1',
  'eje-mat-2',
  'hab-mat-3',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  '¿Cuál de los siguientes puntos ubicados en el plano cartesiano representa mejor 
a la intersección de las rectas asociadas al sistema                         ?',
  '[{"letra": "B", "texto": "Opción B", "es_correcta": false}, {"letra": "C", "texto": "Opción C", "es_correcta": false}, {"letra": "D", "texto": "2y  3x = 4 3x – y = 0", "es_correcta": false}, {"letra": "A", "texto": "X Y X Y X Y X Y FORMA 113  2023", "es_correcta": true}]'::jsonb,
  'A',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-33',
  'asig-1',
  'eje-mat-2',
  'hab-mat-2',
  'seleccion_multiple',
  '4° Medio',
  'alta',
  NULL,
  '¿Cuáles son las soluciones de la ecuación 
0
35
x
12
x2



?',
  '[{"letra": "A", "texto": "14  y 10 ", "es_correcta": false}, {"letra": "B", "texto": "7  y 5 ", "es_correcta": false}, {"letra": "C", "texto": "7 y 5", "es_correcta": true}, {"letra": "D", "texto": "14 y 10", "es_correcta": false}]'::jsonb,
  'C',
  3,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-34',
  'asig-1',
  'eje-mat-2',
  'hab-mat-1',
  'seleccion_multiple',
  '4° Medio',
  'alta',
  NULL,
  'En un espejo de forma cuadrada se quiere colocar cuatro adornos con forma de 
triángulo isósceles congruentes entre sí en sus esquinas, tal como se representa 
en la siguiente figura: 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
¿Cuál de los siguientes valores debe tener x para que el área libre de adornos del 
espejo sea 
2
cm
56
?',
  '[{"letra": "A", "texto": "cm 2", "es_correcta": false}, {"letra": "B", "texto": "cm 2", "es_correcta": true}, {"letra": "C", "texto": "cm 2 2", "es_correcta": false}, {"letra": "D", "texto": "cm 4 8 cm x cm x cm FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'B',
  3,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-35',
  'asig-1',
  'eje-mat-2',
  'hab-mat-4',
  'seleccion_multiple',
  '4° Medio',
  'alta',
  NULL,
  'Una persona controla un dron y comienza a hacerlo descender verticalmente con 
una rapidez constante de 5 metros por segundo.  
 
Si al momento de iniciar el descenso el dron se encontraba a una altura                  
de 80 metros con respecto al suelo, ¿cuál de los siguientes gráficos representa 
mejor la altura del dron con respecto al suelo, a medida que transcurre el tiempo, 
en segundos, desde el inicio del descenso?',
  '[{"letra": "A", "texto": "Opción A", "es_correcta": false}, {"letra": "B", "texto": "Opción B", "es_correcta": false}, {"letra": "C", "texto": "Opción C", "es_correcta": true}, {"letra": "D", "texto": "Tiempo en segundos 80 Altura en metros 16 Tiempo en segundos 80 Altura en metros 5 Tiempo en segundos 80 Altura en metros 16 Tiempo en segundos 80 Altura en metros 5 FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'C',
  3,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-36',
  'asig-1',
  'eje-mat-2',
  'hab-mat-3',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'Ignacio se dedica a vender productos encargados por sus clientes, que importa 
mediante una aplicación móvil. El precio de venta al que Ignacio vende los 
productos lo determina según la función 

2500
x
5,1
x
P


, tal que x 
representa el precio, en pesos, al que compra el producto en la aplicación. 
 
¿Cuál de las siguientes afirmaciones es verdadera?',
  '[{"letra": "A", "texto": "Ignacio cobra un costo fijo de   2500 5,1 $  a todos los productos que vende.", "es_correcta": false}, {"letra": "B", "texto": "Ignacio realiza un recargo de un % 50 del precio del producto importado sin considerar ese recargo en el cargo fijo.", "es_correcta": true}, {"letra": "C", "texto": "Ignacio cobra un costo fijo de   2500 5,1 $  a todos los productos que vende.", "es_correcta": false}, {"letra": "D", "texto": "Ignacio realiza un recargo de % 5,1 del precio del producto importado sin considerar el cargo fijo.", "es_correcta": false}]'::jsonb,
  'B',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-37',
  'asig-1',
  'eje-mat-3',
  'hab-mat-2',
  'seleccion_multiple',
  '4° Medio',
  'baja',
  NULL,
  'En una distribuidora envasaron 
L
360
 de detergente líquido en bidones de 
L
3
         
y de 
L
5
 de capacidad. 
 
Si se ocuparon en total 100 bidones, ¿cuál de los siguientes valores es la 
diferencia entre la cantidad de bidones de distinta capacidad que se usaron?',
  '[{"letra": "A", "texto": "25", "es_correcta": false}, {"letra": "B", "texto": "40", "es_correcta": true}, {"letra": "C", "texto": "48", "es_correcta": false}, {"letra": "D", "texto": "50 FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'B',
  1,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-38',
  'asig-1',
  'eje-mat-3',
  'hab-mat-1',
  'seleccion_multiple',
  '4° Medio',
  'baja',
  '/preguntas/paes_mat1_2023_forma113/p28_img_1.jpeg',
  '¿Cuál de los siguientes gráficos representa mejor a la función f definida por 


2
3
x
x
f


, con dominio el conjunto de los números reales?',
  '[{"letra": "A", "texto": "Opción A", "es_correcta": false}, {"letra": "C", "texto": "Opción C", "es_correcta": false}, {"letra": "D", "texto": "Y X 3 Y X 3 Y X 3", "es_correcta": false}, {"letra": "B", "texto": "Y X 3 FORMA 113  2023", "es_correcta": true}]'::jsonb,
  'B',
  1,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-39',
  'asig-1',
  'eje-mat-3',
  'hab-mat-4',
  'seleccion_multiple',
  '4° Medio',
  'media',
  '/preguntas/paes_mat1_2023_forma113/p29_img_1.png',
  '¿En cuál de las siguientes figuras la medida del segmento PQ es la que se indica, 
de acuerdo a las condiciones dadas en cada una de ellas?',
  '[{"letra": "A", "texto": "Opción A", "es_correcta": false}, {"letra": "B", "texto": "Opción B", "es_correcta": false}, {"letra": "C", "texto": "Opción C", "es_correcta": false}, {"letra": "D", "texto": "Triángulo ABP equilátero de lado cm 1 , tal que Q está en el segmento AB. Cuadrado APBQ de lado cm 5,1 A Q P B cm 3 Rectángulo APBQ de lados cm 2 y cm 3 A Q P B cm 5 Cuadrado APBQ de lado cm 1 A Q P B cm 2 cm 3 P A Q B FORMA 113  2023", "es_correcta": true}]'::jsonb,
  'D',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-40',
  'asig-1',
  'eje-mat-3',
  'hab-mat-3',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'Una fábrica de repisas usa escuadras triangulares para afirmar sus repisas, como 
se representa en la figura adjunta. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
En la fábrica se siguen las siguientes reglas de construcción: 
 El cateto de la escuadra en contacto con la repisa debe medir 3
2 del ancho 
de la repisa. 
 
 La hipotenusa de la escuadra debe medir el doble de su cateto que está en 
contacto con la repisa. 
 
Según esta regla de construcción, ¿cuánto debería medir el cateto de la escuadra 
que va adosado en la pared para poner una repisa de ancho 
cm
30
?',
  '[{"letra": "A", "texto": "cm 5 45", "es_correcta": false}, {"letra": "B", "texto": "cm 5 20", "es_correcta": false}, {"letra": "C", "texto": "cm 3 20", "es_correcta": true}, {"letra": "D", "texto": "cm 3 45 FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'C',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-41',
  'asig-1',
  'eje-mat-3',
  'hab-mat-2',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'Para proteger una antena de 
m
20
 de altura de los fuertes vientos, una empresa 
telefónica decidió colocar dos cables anclados (P y Q) desde la parte más alta de la 
antena al suelo, tal como se representa en la siguiente figura: 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
Para realizar este anclaje, ¿cuál es la cantidad de cable P y Q que se necesita 
desde la parte más alta de la antena hasta el suelo?',
  '[{"letra": "A", "texto": " m 25 32 ", "es_correcta": false}, {"letra": "B", "texto": " m 50 8 ", "es_correcta": false}, {"letra": "C", "texto": " m 544 425 ", "es_correcta": true}, {"letra": "D", "texto": "m 57 FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'C',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-42',
  'asig-1',
  'eje-mat-3',
  'hab-mat-1',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'En la figura adjunta los lados del rectángulo gris miden 
cm
3
 y 
cm
9
. Alrededor de 
este rectángulo se ha dibujado un rectángulo separado en 
cm
x
 del borde del 
rectángulo gris, tal como se representa a continuación: 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
¿Cuál de las siguientes expresiones representa el perímetro, en cm , del rectángulo 
mayor?',
  '[{"letra": "A", "texto": "x 4 12 ", "es_correcta": false}, {"letra": "B", "texto": "   x 2 3 x 2 9  ", "es_correcta": false}, {"letra": "C", "texto": "  x 4 12 2 ", "es_correcta": true}, {"letra": "D", "texto": "   27 x 2 3 x 2 9    x cm x cm x cm x cm FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'C',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-43',
  'asig-1',
  'eje-mat-3',
  'hab-mat-4',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'Una empresa vende crema para las manos en envases con forma de cilindros 
rectos de 
cm
20
 de altura y de distintos diámetros. 
 
Por una promoción se decide aumentar en su 
%
20
 la capacidad de cada envase, 
manteniendo la altura de los envases cilíndricos. 
 
¿Cuál de las siguientes funciones permite determinar el volumen de los nuevos 
envases, en 
3
cm , con r el radio del envase sin promoción, en cm ?',
  '[{"letra": "A", "texto": "     2r 16 r p", "es_correcta": false}, {"letra": "B", "texto": "     2r 24 r g", "es_correcta": true}, {"letra": "C", "texto": "     2r 8, 28 r f", "es_correcta": false}, {"letra": "D", "texto": "     2r 576 r h", "es_correcta": false}]'::jsonb,
  'B',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-44',
  'asig-1',
  'eje-mat-3',
  'hab-mat-3',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'Para cierta actividad se aconseja beber diariamente al menos 
L
1
 de agua por 
cada 
kg
35
 de masa corporal. 
 
Para una persona de masa corporal 
kg
P
 que tiene una botella de forma cilíndrica 
de diámetro 
cm
6
 y altura 
cm
20
, ¿cuál de las siguientes expresiones permite 
determinar la cantidad de veces, en un día, que debe consumir el contenido de la 
botella llena de agua, para cumplir lo que se aconseja?',
  '[{"letra": "A", "texto": "20 36 π P  ", "es_correcta": false}, {"letra": "B", "texto": "20 36 1000 35 P    ", "es_correcta": false}, {"letra": "C", "texto": "20 9 1000 35 P    ", "es_correcta": true}, {"letra": "D", "texto": "20 9 π 35 P   FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'C',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-45',
  'asig-1',
  'eje-mat-3',
  'hab-mat-2',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  '¿Cuál de las figuras dadas en las opciones se puede obtener usando solo 
traslaciones de la figura adjunta?',
  '[{"letra": "B", "texto": "Opción B", "es_correcta": false}, {"letra": "C", "texto": "Opción C", "es_correcta": false}, {"letra": "A", "texto": "Opción A", "es_correcta": true}, {"letra": "D", "texto": "Y X X Y Y X X Y X Y FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'A',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-46',
  'asig-1',
  'eje-mat-3',
  'hab-mat-1',
  'seleccion_multiple',
  '4° Medio',
  'media',
  '/preguntas/paes_mat1_2023_forma113/p34_img_3.jpeg',
  'En el plano cartesiano de la cuadrícula adjunta se tiene un punto de inicio el cual se 
debe mover 
cm
3
 al este y 
cm
2
 al norte, para luego trasladarse 
cm
5
 al sur y 
cm
4
 al oeste, llegando al punto final. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
Si cada lado de los cuadrados de la cuadrícula equivalen a 
cm
1
, ¿cuál de los 
siguientes vectores representa el camino desde el punto de inicio hasta el punto 
final?',
  '[{"letra": "A", "texto": "  5 ,4 v   ", "es_correcta": false}, {"letra": "B", "texto": "  3 ,1 u   ", "es_correcta": true}, {"letra": "C", "texto": "  3 ,1 r  ", "es_correcta": false}, {"letra": "D", "texto": " 1 ,3 s   Y X Punto de inicio N S E O FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'B',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-47',
  'asig-1',
  'eje-mat-3',
  'hab-mat-4',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  '¿Cuál de las siguientes imágenes tiene más de dos ejes de simetría?',
  '[{"letra": "A", "texto": "Opción A", "es_correcta": false}, {"letra": "B", "texto": "Opción B", "es_correcta": false}, {"letra": "C", "texto": "Opción C", "es_correcta": true}, {"letra": "D", "texto": "Opción D", "es_correcta": false}]'::jsonb,
  'C',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-48',
  'asig-1',
  'eje-mat-3',
  'hab-mat-3',
  'seleccion_multiple',
  '4° Medio',
  'media',
  '/preguntas/paes_mat1_2023_forma113/p35_img_1.png',
  'A un punto P del plano cartesiano se le aplica una reflexión respecto al origen de 
este obteniéndose el punto Q , luego el punto Q se traslada según el vector 
)
3
,2
(
v


 obteniéndose el punto R . 
 
Si R tiene coordenadas 
)
4
,5
(
, ¿cuáles son las coordenadas del punto P ?',
  '[{"letra": "A", "texto": ") 7 ,3 (", "es_correcta": false}, {"letra": "B", "texto": ")1 ,7 (  ", "es_correcta": true}, {"letra": "C", "texto": ")1 ,7 ( ", "es_correcta": false}, {"letra": "D", "texto": ") 7 ,3 (  ", "es_correcta": false}]'::jsonb,
  'B',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-49',
  'asig-1',
  'eje-mat-3',
  'hab-mat-2',
  'seleccion_multiple',
  '4° Medio',
  'media',
  '/preguntas/paes_mat1_2023_forma113/p36_img_1.png',
  '¿En cuál de los siguientes cuadriláteros las rectas punteadas corresponden a sus 
ejes de simetría?',
  '[{"letra": "A", "texto": "Opción A", "es_correcta": false}, {"letra": "B", "texto": "Opción B", "es_correcta": false}, {"letra": "C", "texto": "Opción C", "es_correcta": false}, {"letra": "D", "texto": "Opción D", "es_correcta": true}]'::jsonb,
  'D',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-50',
  'asig-1',
  'eje-mat-3',
  'hab-mat-1',
  'seleccion_multiple',
  '4° Medio',
  'alta',
  NULL,
  'En la figura adjunta se representa una casa y un árbol con las respectivas 
sombras que ellos proyectan en un mismo instante del día. 
 
 
 
 
 
 
 
 
 
 
 
 
 
¿Cuál es el valor de x ?',
  '[{"letra": "A", "texto": "4", "es_correcta": false}, {"letra": "B", "texto": "12", "es_correcta": true}, {"letra": "C", "texto": "18", "es_correcta": false}, {"letra": "D", "texto": "26", "es_correcta": false}]'::jsonb,
  'B',
  3,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-51',
  'asig-1',
  'eje-mat-3',
  'hab-mat-4',
  'seleccion_multiple',
  '4° Medio',
  'alta',
  NULL,
  'La retina es un tejido sensible a la luz situada en la superficie interior del ojo similar 
a una tela donde se proyectan imágenes, como se representa en la siguiente 
figura. 
 
 
 
 
 
 
 
 
 
Para estimar la altura t en que se ve un objeto en la retina de un ojo, se puede 
utilizar la relación 
h
m
t


, tal que h es la altura real del objeto en metros y 
p
metros
017
,0
m 
, con p la distancia, en metros, entre el objeto y el ojo. 
 
Si la altura real de un objeto es 2 metros y está ubicado a una distancia de                   
4,3
 metros  de un ojo, ¿qué altura tiene el objeto en la retina del ojo?',
  '[{"letra": "A", "texto": "001 ,0 metros", "es_correcta": false}, {"letra": "B", "texto": "01 ,0 metros", "es_correcta": true}, {"letra": "C", "texto": "1,0 metros", "es_correcta": false}, {"letra": "D", "texto": "1 metros t p h FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'B',
  3,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-52',
  'asig-1',
  'eje-mat-3',
  'hab-mat-3',
  'seleccion_multiple',
  '4° Medio',
  'alta',
  NULL,
  'Una persona apoya una escalera de 
m
15
 sobre una pandereta de 
m
5,1
 de altura, 
para poder llegar a cierta altura de un edificio, tal como se representa en la 
siguiente figura:  
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
El punto de apoyo de la escalera en la pandereta está justo cuando completa los 
m
2
 de escalera. 
 
¿A qué altura de la pared del edificio llega la escalera que colocó la persona?',
  '[{"letra": "A", "texto": "A m 5, 15", "es_correcta": false}, {"letra": "B", "texto": "A m 25 , 11", "es_correcta": true}, {"letra": "C", "texto": "A m 75 ,9", "es_correcta": false}, {"letra": "D", "texto": "A m 5 2 m Pandereta FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'B',
  3,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-53',
  'asig-1',
  'eje-mat-5',
  'hab-mat-2',
  'seleccion_multiple',
  '4° Medio',
  'baja',
  NULL,
  'Carmen quiere saber la altura de su pieza y decidió colocar sobre una mesa, que 
tiene una altura de 
cm
75
, una regla de 
cm
15
. 
 
La regla la posicionó de manera vertical, a una distancia de 
cm
20
 del borde de la 
mesa, desde donde ella puede apreciar el extremo superior de la altura de la pieza 
como se representa en la figura adjunta. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
Si la distancia desde el extremo de la mesa a la pared es de 
cm
200
, ¿cuál es la 
medida de la altura de la pieza de Carmen?',
  '[{"letra": "A", "texto": "cm 135", "es_correcta": false}, {"letra": "B", "texto": "cm 150", "es_correcta": false}, {"letra": "C", "texto": "cm 210", "es_correcta": false}, {"letra": "D", "texto": "cm 225 200 cm FORMA 113  2023", "es_correcta": true}]'::jsonb,
  'D',
  1,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-54',
  'asig-1',
  'eje-mat-5',
  'hab-mat-1',
  'seleccion_multiple',
  '4° Medio',
  'baja',
  NULL,
  'Se realiza una encuesta a un grupo de personas, sobre la cantidad de plantas que 
tiene cada una en su casa. Los resultados se presentan en el gráfico adjunto. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
¿Cuál de los siguientes argumentos respalda que la respuesta mayoritaria de los 
encuestados fue 3 plantas?',
  '[{"letra": "A", "texto": "Porque hay 3 barras que llegan al mismo número.", "es_correcta": false}, {"letra": "B", "texto": "Porque el 3 tiene la barra más alta.", "es_correcta": true}, {"letra": "C", "texto": "Porque la diferencia entre la barra más alta y la más baja es 3.", "es_correcta": false}, {"letra": "D", "texto": "Porque la barra del medio tiene frecuencia 3. Frecuencia 1 2 3 7 6 5 4 0 4 2 3 1 Cantidad de plantas FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'B',
  1,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-55',
  'asig-1',
  'eje-mat-5',
  'hab-mat-4',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'A un grupo de personas se le consultó acerca de la cantidad de películas vistas 
el último mes. En la tabla adjunta se presenta la distribución de los resultados 
de dicha consulta. 
 
 
 
 
 
 
 
 
 
 
 
 
 
Si se agregan personas al grupo de tal manera que la frecuencia de todos los datos 
aumenta en un 
%
20
, ¿cuál de las siguientes expresiones representa la cantidad 
total de personas que hay finalmente en el grupo?',
  '[{"letra": "A", "texto": "t2,1 h 2,1 300  ", "es_correcta": true}, {"letra": "B", "texto": "t2,1 h 2,1 ", "es_correcta": false}, {"letra": "C", "texto": "300", "es_correcta": false}, {"letra": "D", "texto": "12 Cantidad de películas vistas el último mes Frecuencia 1 h 2 200 3 t 4 50 FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'A',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-56',
  'asig-1',
  'eje-mat-5',
  'hab-mat-3',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'Con la información recolectada en un estudio sobre el consumo de legumbres de 
un país se construyó un gráfico en el que se presenta el porcentaje de la población 
que consumió legumbres al menos una vez por semana, durante los años 2018, 
2019 y 2020. 
 
 
 
 
 
 
 
 
 
 
 
 
 
¿Cuál de las siguientes afirmaciones se puede deducir de los datos del gráfico?',
  '[{"letra": "A", "texto": "El gráfico es incorrecto, porque los porcentajes de consumo en las barras no suman % 100 .", "es_correcta": false}, {"letra": "B", "texto": "La comida favorita de este país son las legumbres puesto que en el año 2020 el % 90 de la población la consumía al menos una vez por semana.", "es_correcta": false}, {"letra": "C", "texto": "En el año 2021 más del % 90 de la población consumirá legumbres al menos una vez por semana.", "es_correcta": false}, {"letra": "D", "texto": "El gráfico presenta que la población de este país ha aumentado en forma sostenida el consumo de legumbres durante los años en estudio. 2018 2019 2020 Años Porcentaje de consumo de legumbres 47 % 72 % 90 % FORMA 113  2023", "es_correcta": true}]'::jsonb,
  'D',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-57',
  'asig-1',
  'eje-mat-5',
  'hab-mat-2',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'En el gráfico de la figura adjunta se presenta la cantidad de goles que tuvo a favor 
y en contra un equipo de fútbol en cuatro partidos jugados. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
¿Cuál de las siguientes afirmaciones es verdadera?',
  '[{"letra": "A", "texto": "En total, en los cuatro partidos se hicieron 7 goles entre los equipos que participaron.", "es_correcta": false}, {"letra": "B", "texto": "El equipo ganó más partidos de los que perdió.", "es_correcta": true}, {"letra": "C", "texto": "En todos los partidos el equipo hizo goles.", "es_correcta": false}, {"letra": "D", "texto": "La mayor diferencia entre los goles a favor y los goles en contra fue en el tercer partido.", "es_correcta": false}]'::jsonb,
  'B',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-58',
  'asig-1',
  'eje-mat-5',
  'hab-mat-1',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'Los resultados de las dos primeras pruebas de matemática de Esteban son un             
3,5
 y un 
9,5
. 
 
¿Cuál de las siguientes notas es la mínima que debe obtener Esteban en la tercera 
prueba para que su promedio sea de al menos un 
9,5
 en las tres pruebas?',
  '[{"letra": "A", "texto": "9,5", "es_correcta": false}, {"letra": "B", "texto": "1,6", "es_correcta": false}, {"letra": "C", "texto": "2,6", "es_correcta": false}, {"letra": "D", "texto": "5,6 Cantidad de goles 1er 2do 3er 4to Goles en contra Goles a favor 1 2 3 Partido jugado FORMA 113  2023", "es_correcta": true}]'::jsonb,
  'D',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-59',
  'asig-1',
  'eje-mat-5',
  'hab-mat-4',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'Los trabajadores de una empresa tienen tres tipos de sueldos según su puesto de 
trabajo. Hay n trabajadores con un sueldo de 
000
800
$
, m trabajadores con un 
sueldo de 
000
500
$
 y w trabajadores con un sueldo de 
000
100
1
$
. 
 
 
¿Cuál de las siguientes fórmulas permite determinar el promedio X de los sueldos 
de todos los trabajadores de esta empresa?',
  '[{"letra": "A", "texto": "w m n 000 100 1 000 500 000 800 X     ", "es_correcta": false}, {"letra": "B", "texto": "  w m n 3 000 100 1 000 500 000 800 X         ", "es_correcta": false}, {"letra": "C", "texto": "3 w 000 100 1 m 000 500 n 000 800 X      ", "es_correcta": false}, {"letra": "D", "texto": "w m n w 000 100 1 m 000 500 n 000 800 X         FORMA 113  2023", "es_correcta": true}]'::jsonb,
  'D',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-60',
  'asig-1',
  'eje-mat-5',
  'hab-mat-3',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'En el diagrama de cajón adjunto se presenta la distribución de los tiempos que 
un grupo de 100 personas logró mantenerse en postura de sentadilla con la 
espalda apoyada en la pared en un gimnasio. 
 
 
 
 
 
 
 
 
 
Las instructoras del gimnasio garantizan que después de tomar el entrenamiento 
básico por una semana, las personas cuyos tiempos son menores al segundo 
cuartil aumentarán su tiempo en 
s
30
 y el resto de las personas aumentarán su 
tiempo en 
s
15
. 
 
Si estas 100 personas toman el entrenamiento y la promesa de las instructoras es 
efectiva, ¿cuál de las siguientes afirmaciones es verdadera luego de una semana 
de entrenamiento?',
  '[{"letra": "A", "texto": "Exactamente 2 personas durarán más de s 60 .", "es_correcta": false}, {"letra": "B", "texto": "A lo más 3 personas durarán más de s 60 .", "es_correcta": false}, {"letra": "C", "texto": "Al menos 25 personas durarán más de s 60 .", "es_correcta": true}, {"letra": "D", "texto": "Exactamente 50 personas durarán más de s 60 . 15 25 30 46 70 Tiempo en segundos FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'C',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-61',
  'asig-1',
  'eje-mat-5',
  'hab-mat-2',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'En la tabla adjunta se presenta la distribución de la edad de un grupo de                     
150 personas. 
 
 
 
 
 
 
 
 
 
 
 
 
¿En qué intervalo se encuentra el percentil 20 de las edades?',
  '[{"letra": "A", "texto": "  35 , 30", "es_correcta": true}, {"letra": "B", "texto": "  45 , 40", "es_correcta": false}, {"letra": "C", "texto": "  30 , 25", "es_correcta": false}, {"letra": "D", "texto": "  40 , 35", "es_correcta": false}]'::jsonb,
  'A',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-62',
  'asig-1',
  'eje-mat-5',
  'hab-mat-1',
  'seleccion_multiple',
  '4° Medio',
  'media',
  NULL,
  'En la siguiente tabla se presenta la distribución del puntaje obtenido en una 
prueba de matemática por todo el estudiantado de primero medio de un colegio. 
 
 
 
 
 
 
 
 
Si se realiza una prueba recuperativa para los estudiantes que estuvieron bajo el 
percentil 40 de los puntajes obtenidos, ¿cuántos estudiantes podrán optar a la 
prueba recuperativa?',
  '[{"letra": "A", "texto": "39", "es_correcta": false}, {"letra": "B", "texto": "75", "es_correcta": true}, {"letra": "C", "texto": "79", "es_correcta": false}, {"letra": "D", "texto": "80 Edad (en años) Frecuencia   30 , 25 12   35 , 30 24   40 , 35 36   45 , 40 30   50 , 45 24   55 , 50 12   60 , 55 12 Puntaje Frecuencia Frecuencia acumulada 10 30 30 20 45 75 30 30 105 40 45 150 50 50 200 FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'B',
  2,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-63',
  'asig-1',
  'eje-mat-5',
  'hab-mat-4',
  'seleccion_multiple',
  '4° Medio',
  'alta',
  NULL,
  'Se consultó a un grupo de 50 personas acerca de su sabor favorito de cierto tipo 
de helado. En la tabla adjunta se registran los resultados obtenidos. 
 
 
 
 
 
 
 
 
 
 
 
Si se elige a una de estas personas al azar, ¿cuál es la probabilidad de que su 
sabor favorito sea de vainilla o de frutilla?',
  '[{"letra": "A", "texto": "10 3", "es_correcta": true}, {"letra": "B", "texto": "50 6 50 9 ", "es_correcta": false}, {"letra": "C", "texto": "54 1", "es_correcta": false}, {"letra": "D", "texto": "15 1", "es_correcta": false}]'::jsonb,
  'A',
  3,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-64',
  'asig-1',
  'eje-mat-5',
  'hab-mat-3',
  'seleccion_multiple',
  '4° Medio',
  'alta',
  NULL,
  'Una caja contiene seis tarjetas todas del mismo tipo y en cada una de ellas hay 
una palabra escrita. Las palabras escritas en cuatro de las tarjetas son: CLASE, 
SOL, TEMPRANO y LEON. 
 
Se sabe que al extraer al azar una tarjeta de la caja la probabilidad de que la 
palabra escrita en ella tenga menos de tres letras vocales es 3
2 . 
 
¿Cuáles de las siguientes palabras podrían estar escritas en las otras dos tarjetas?',
  '[{"letra": "A", "texto": "VASO y RED", "es_correcta": false}, {"letra": "B", "texto": "CINCO y SEIS", "es_correcta": false}, {"letra": "C", "texto": "CUADRILATERO y CANTO", "es_correcta": true}, {"letra": "D", "texto": "PARALELOGRAMO y GIGANTESCO Sabor Frecuencia vainilla 9 chocolate 15 frutilla 6 manjar 20 FORMA 113  2023", "es_correcta": false}]'::jsonb,
  'C',
  3,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-paes-m1-23-65',
  'asig-1',
  'eje-mat-5',
  'hab-mat-2',
  'seleccion_multiple',
  '4° Medio',
  'alta',
  NULL,
  'Si se lanzan tres monedas, ¿cuál es la probabilidad de obtener al menos un 
sello?',
  '[{"letra": "A", "texto": "3 1", "es_correcta": false}, {"letra": "B", "texto": "8 7", "es_correcta": true}, {"letra": "C", "texto": "8 1", "es_correcta": false}, {"letra": "D", "texto": "2 1", "es_correcta": false}]'::jsonb,
  'B',
  3,
  'PAES Oficial Matemática 1 2023 Forma 113',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

COMMIT;