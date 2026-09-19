-- ====================================================================
-- MIGRATION 042: Saneamiento Global de Simbolos Symbol Font (PUA) y Marcas
-- Sanea 42 preguntas de PAES M1 2023 con caracteres no estandar (U+F000-U+F0FF)
-- ====================================================================

-- Pregunta 3
UPDATE public.preguntas SET
  enunciado = 'En la figura adjunta se cumple que la suma de los valores de los casilleros 
contiguos de una fila es igual al valor inmediatamente superior a ellos                  
(por ejemplo 
f
q
p
=
+
). 
 
 
 
 
 
 
 
Si la suma de los tres valores de la última fila es 17 , ¿cuál es el valor de 
f
p +
?',
  alternativas = '[{"letra": "A", "texto": "12", "es_correcta": false}, {"letra": "B", "texto": "13", "es_correcta": false}, {"letra": "C", "texto": "18", "es_correcta": true}, {"letra": "D", "texto": "21", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'C',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-03';

-- Pregunta 4
UPDATE public.preguntas SET
  enunciado = 'La automotora “Mi auto” tiene cinco marcas de automóviles, cada marca tiene tres 
modelos y cada modelo está en tres colores distintos. 
 
La automotora “Viaje feliz” tiene cuatro marcas de automóviles, cada marca tiene 
tres modelos y cada modelo en cuatro colores distintos. 
 
Si las marcas de los automóviles de las automotoras son distintas entre sí, ¿cuál de 
las siguientes afirmaciones es verdadera?',
  alternativas = '[{"letra": "A", "texto": "La automotora “Viaje feliz” ofrece tres posibilidades distintas más para elegir un automóvil que la automotora “Mi auto”.", "es_correcta": true}, {"letra": "B", "texto": "Ambas automotoras ofrecen la misma cantidad de posibilidades distintas para elegir un automóvil.", "es_correcta": false}, {"letra": "C", "texto": "La automotora “Mi auto” ofrece más posibilidades distintas para elegir un automóvil que la automotora “Viaje feliz”.", "es_correcta": false}, {"letra": "D", "texto": "El total de las distintas posibilidades de elegir un automóvil está determinado por la suma entre la cantidad de marcas, de modelos y de colores. 25 f p q 4", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'A',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-04';

-- Pregunta 5
UPDATE public.preguntas SET
  enunciado = 'El modelo RVA de colores, permite crear cualquier color mediante la mezcla de los 
distintos tonos de tres colores: rojo, verde y azul. Los valores de la intensidad de 
cada uno de estos colores van desde el 0 al 255 y cada color creado tiene un 
código de tres números donde el primero representa al rojo, el segundo al verde y 
el tercero al azul. 
 
El código de la mezcla de dos colores se obtiene haciendo el promedio de cada 
uno de los valores de los colores originales tal como se presenta a continuación: 
 
 
 
 
 
 
¿Con qué color hay que mezclar el color (
)
120
,
60
,
160
 para obtener el color 
(
)
60
,
80
,
170
?',
  alternativas = '[{"letra": "A", "texto": "( ) 60 , 20 , 10", "es_correcta": false}, {"letra": "B", "texto": "( ) 60 , 100 , 180", "es_correcta": false}, {"letra": "C", "texto": "( ) 0 , 100 , 180", "es_correcta": true}, {"letra": "D", "texto": "( ) 90 , 70 , 165", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'C',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-05';

-- Pregunta 6
UPDATE public.preguntas SET
  enunciado = 'En la temporada de invierno, la diferencia horaria entre Nueva Zelanda y Chile es 
de 
h
16
, desde Chile. Por ejemplo, si en Chile son las 11 de la mañana de un 
lunes, en Nueva Zelanda son las 3 de la mañana del martes. 
 
En la misma temporada la diferencia horaria entre México y Chile es de 
h
1
-
, 
desde Chile. Es decir, cuando en Chile son las 11 de la mañana de un lunes, en 
México son las 10 de la mañana del mismo día. 
 
¿Cuál es la diferencia horaria entre Nueva Zelanda y México, desde México, en la 
temporada de invierno?',
  alternativas = '[{"letra": "A", "texto": "h 17 -", "es_correcta": false}, {"letra": "B", "texto": "h 15 -", "es_correcta": false}, {"letra": "C", "texto": "h 15", "es_correcta": false}, {"letra": "D", "texto": "h 17 Colores para mezclar Color resultante ( ) c ,b ,a , ( )t ,n , m )) ) (( ( + + + 2 t c , 2 n b , 2 m a", "es_correcta": true}]'::jsonb,
  respuesta_correcta = 'D',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-06';

-- Pregunta 10
UPDATE public.preguntas SET
  enunciado = 'Los cuadrados congruentes de las cuadrículas de 5 por 5 que aparecen en las 
opciones sirven para contar el puntaje que se ha obtenido en cierto juego con 
cartas. 
 
Una persona inicialmente tiene 8 puntos de un total de 25. Luego de una buena 
jugada, el juego la bonifica con un aumento del 
25%
 respecto de los puntos que 
tiene en ese momento. 
 
¿Cuál de las siguientes opciones presenta de forma correcta el cambio entre la 
situación inicial de 8 puntos y el puntaje final luego de la bonificación? 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
Puntaje inicial 
Puntaje final',
  alternativas = '[{"letra": "A", "texto": "Puntaje inicial Puntaje final", "es_correcta": false}, {"letra": "B", "texto": "Puntaje inicial Puntaje final", "es_correcta": false}, {"letra": "C", "texto": "Puntaje inicial Puntaje final", "es_correcta": true}, {"letra": "D", "texto": "", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'C',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-10';

-- Pregunta 13
UPDATE public.preguntas SET
  enunciado = 'Un profesor ve algunos resultados de una encuesta por internet realizada a       
100 personas un determinado día, de las cuales el 
25%
 omitió la última pregunta. 
Una semana después se realiza la misma encuesta a otras 100 personas, de las 
cuales un 
35%
 omitió la última pregunta. 
 
 
El profesor le pide a cuatro de sus estudiantes que realicen conclusiones de estos 
datos. 
 
· Sebastián señala: del total de personas encuestadas un 
60%
 omitió la 
última pregunta. 
· Angélica señala: en la segunda encuesta la omisión total tuvo un aumento 
de 10 puntos porcentuales con respecto a la omisión total de la primera 
encuesta. 
· Luisa señala: del total de personas encuestadas 60 personas omitieron la 
última pregunta. 
· Manuel señala: en la segunda encuesta la pregunta más omitida fue la 
última. 
 
¿Cuál de ellos está en lo correcto?',
  alternativas = '[{"letra": "A", "texto": "Sebastián", "es_correcta": false}, {"letra": "B", "texto": "Angélica", "es_correcta": false}, {"letra": "C", "texto": "Luisa", "es_correcta": true}, {"letra": "D", "texto": "Manuel", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'C',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-13';

-- Pregunta 17
UPDATE public.preguntas SET
  enunciado = 'Tres figuras están formadas por cuadrados congruentes entre sí que presentan una 
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
  alternativas = '[{"letra": "A", "texto": "Opción A", "es_correcta": false}, {"letra": "B", "texto": "Figura 1 2 3 Cantidad de cuadrados 22 22 2 22 4", "es_correcta": false}, {"letra": "C", "texto": "Figura 1 2 3 Cantidad de cuadrados (21)2 (22)2 (23)2", "es_correcta": true}, {"letra": "D", "texto": "Figura 1 2 3 Cantidad de cuadrados (22)0 (22)2 (22)4 Fig. 1 Fig. 2 Fig. 3", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'C',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-17';

-- Pregunta 21
UPDATE public.preguntas SET
  enunciado = 'Considera las variables directamente proporcionales m y n , con 
3
n ≥
. Cuando 
121
m =
 se tiene que 
363
n =
. 
 
¿Cuál de los siguientes gráficos representa mejor la relación entre m y n ?',
  alternativas = '[{"letra": "D", "texto": "n 3 m 9", "es_correcta": false}, {"letra": "C", "texto": "n 3 m 9", "es_correcta": false}, {"letra": "B", "texto": "n 3 m 1", "es_correcta": false}, {"letra": "A", "texto": "n 3 m 1", "es_correcta": true}]'::jsonb,
  respuesta_correcta = 'A',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-21';

-- Pregunta 22
UPDATE public.preguntas SET
  enunciado = '¿Cuál de las siguientes expresiones es igual que (
)(
)
a
(b
c)
a
(b
c)
+
+
·
+
-
?',
  alternativas = '[{"letra": "A", "texto": "2 2 2 c b a - +", "es_correcta": false}, {"letra": "B", "texto": "2 2 2 c b ab 2 a - + +", "es_correcta": true}, {"letra": "C", "texto": "2 2 2 2 2 c b b a a - + +", "es_correcta": false}, {"letra": "D", "texto": "2 2 )c b ( a - +", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'B',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-22';

-- Pregunta 23
UPDATE public.preguntas SET
  enunciado = 'El volumen del paralelepípedo de la figura adjunta, en metros cúbicos, es 
(
)
x
15
x
2
x
2
3
-
-
, con x un número real mayor que 5 . 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
¿Cuál de las siguientes expresiones representa el valor de p ?',
  alternativas = '[{"letra": "A", "texto": "3 x -", "es_correcta": false}, {"letra": "B", "texto": "5 x +", "es_correcta": false}, {"letra": "C", "texto": "5 x2 -", "es_correcta": false}, {"letra": "D", "texto": "3 x + p metros x metros (x - 5) metros", "es_correcta": true}]'::jsonb,
  respuesta_correcta = 'D',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-23';

-- Pregunta 24
UPDATE public.preguntas SET
  enunciado = 'La expresión (
)
(
)(
)
3
a
1
a
1
a
2
-
+
+
+
 se factoriza como el producto de dos 
factores, tal que uno de ellos es (
)1
a +
. 
 
¿Cuál de las siguientes expresiones corresponde al otro factor de la expresión?',
  alternativas = '[{"letra": "A", "texto": "( ) 2 a 3 a2 - +", "es_correcta": false}, {"letra": "B", "texto": "( ) 2 a -", "es_correcta": false}, {"letra": "C", "texto": "( ) 2 a a2 - -", "es_correcta": false}, {"letra": "D", "texto": "( ) 2 a 2 -", "es_correcta": true}]'::jsonb,
  respuesta_correcta = 'D',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-24';

-- Pregunta 25
UPDATE public.preguntas SET
  enunciado = 'Una persona desea preparar galletas y tiene una receta para doce galletas. 
 
 
 
 
 
 
 
 
 
 
 
 
 
Al revisar su cocina, se da cuenta de que dispone de los siguientes ingredientes: 
 
· 
g
500
 de azúcar 
· 
g
600
 de mantequilla 
· 
kg
1
 de harina 
· 
4 huevos enteros 
 
¿Cuál es la cantidad máxima de galletas que la persona podrá preparar, 
manteniendo las cantidades de los ingredientes de la receta original haciendo de a 
12 galletas?',
  alternativas = '[{"letra": "A", "texto": "36", "es_correcta": true}, {"letra": "B", "texto": "40", "es_correcta": false}, {"letra": "C", "texto": "48", "es_correcta": false}, {"letra": "D", "texto": "60 r", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'A',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-25';

-- Pregunta 26
UPDATE public.preguntas SET
  enunciado = 'La ley de Hooke establece que el estiramiento que sufre un resorte es 
directamente proporcional a la masa que sujeta. 
 
En la figura adjunta se presenta cómo se estira un resorte cuando se le cuelgan 
diferentes masas. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
¿Cuál es el valor de x ?',
  alternativas = '[{"letra": "A", "texto": "4", "es_correcta": false}, {"letra": "B", "texto": "6", "es_correcta": true}, {"letra": "C", "texto": "8", "es_correcta": false}, {"letra": "D", "texto": "2 27 2 cm x 3 cm kg 9 kg", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'B',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-26';

-- Pregunta 27
UPDATE public.preguntas SET
  enunciado = 'Para dibujar las proporciones del cuerpo humano existen varios cánones que se 
miden en “cabezas”, unidad que hace referencia a la altura de la cabeza del 
individuo. 
 
El canon que se representa en la figura adjunta se llama “canon de las siete 
cabezas y media” y plantea que la figura humana masculina en la adultez se puede 
modelar por 7 2
1 cabezas de altura y ancho máximo de 2 cabezas. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
Loomis, A. (2005). El dibujo de figura en todo su valor. Continen 1. 
 
 
Si se usa este modelo, ¿cuánto debe medir el ancho máximo del dibujo de un 
hombre adulto si se sabe que la estatura en el dibujo es de 
15 cm
?',
  alternativas = '[{"letra": "A", "texto": "6 cm", "es_correcta": false}, {"letra": "B", "texto": "5 cm", "es_correcta": false}, {"letra": "C", "texto": "4 cm", "es_correcta": true}, {"letra": "D", "texto": "1 cm", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'C',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-27';

-- Pregunta 29
UPDATE public.preguntas SET
  enunciado = 'En una tienda de mascotas se dispone de un monto máximo de 
$50.000
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
+
=
, siendo x la cantidad de kWh consumidos 
en el mes. 
 
¿Cuál de los siguientes conjuntos contiene a todos y únicamente los posibles 
valores del consumo en kWh en el mes que se puede solventar con el monto 
disponible en esa tienda?',
  alternativas = '[{"letra": "A", "texto": "[ ] 40,50", "es_correcta": true}, {"letra": "B", "texto": "[ [ 40,50", "es_correcta": false}, {"letra": "C", "texto": "[ [ 50,50", "es_correcta": false}, {"letra": "D", "texto": "[ ] 550,00", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'A',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-29';

-- Pregunta 30
UPDATE public.preguntas SET
  enunciado = 'Un cargador de celular del tipo A carga 
1%
 de la capacidad de la batería                
cada 3 minutos y un cargador del tipo B carga 1%
 de la capacidad de la batería 
cada 2 minutos.  
 
Se tienen dos celulares de las mismas características. Uno tiene un 
20%
 de 
batería cargada y se conecta al cargador del tipo A, mientras que el otro celular 
tiene un 
15%
 de su batería cargada y se conecta al cargador del tipo B.  
 
¿Cuál de los siguientes gráficos representa de mejor manera el porcentaje de  
carga de las baterías a medida que transcurren los minutos?',
  alternativas = '[{"letra": "A", "texto": "Opción A", "es_correcta": false}, {"letra": "B", "texto": "Opción B", "es_correcta": false}, {"letra": "C", "texto": "Opción C", "es_correcta": false}, {"letra": "D", "texto": "minutos Porcentaje de carga Tiempo en minutos Porcentaje de carga 15 20 Tiempo en minutos Porcentaje de carga 15 20 Tiempo en minutos Porcentaje de carga 15 20 Tiempo en", "es_correcta": true}]'::jsonb,
  respuesta_correcta = 'D',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-30';

-- Pregunta 31
UPDATE public.preguntas SET
  enunciado = 'En una frutería cada durazno cuesta 
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
  alternativas = '[{"letra": "A", "texto": "( ) 6800 x 16 400 x 480 = - +", "es_correcta": true}, {"letra": "B", "texto": "( ) 6800 16 x 400 x 480 = - +", "es_correcta": false}, {"letra": "C", "texto": "16 x 400 x 480 = +", "es_correcta": false}, {"letra": "D", "texto": "( ) 16 6800 x 400 480 + = +", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'A',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-31';

-- Pregunta 32
UPDATE public.preguntas SET
  enunciado = '¿Cuál de los siguientes puntos ubicados en el plano cartesiano representa mejor 
a la intersección de las rectas asociadas al sistema                         ?',
  alternativas = '[{"letra": "B", "texto": "Opción B", "es_correcta": false}, {"letra": "C", "texto": "Opción C", "es_correcta": false}, {"letra": "D", "texto": "2y - 3x = -4 3x - y = 0", "es_correcta": false}, {"letra": "A", "texto": "X Y X Y X Y X Y", "es_correcta": true}]'::jsonb,
  respuesta_correcta = 'A',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-32';

-- Pregunta 33
UPDATE public.preguntas SET
  enunciado = '¿Cuáles son las soluciones de la ecuación 
0
35
x
12
x2
=
+
-
?',
  alternativas = '[{"letra": "A", "texto": "14 - y 10 -", "es_correcta": false}, {"letra": "B", "texto": "7 - y 5 -", "es_correcta": false}, {"letra": "C", "texto": "7 y 5", "es_correcta": true}, {"letra": "D", "texto": "14 y 10", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'C',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-33';

-- Pregunta 34
UPDATE public.preguntas SET
  enunciado = 'En un espejo de forma cuadrada se quiere colocar cuatro adornos con forma de 
triángulo isósceles congruentes entre sí en sus esquinas, tal como se representa 
en la siguiente figura: 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
¿Cuál de los siguientes valores debe tener x para que el área libre de adornos del 
espejo sea 
2
56 cm
?',
  alternativas = '[{"letra": "A", "texto": "2 cm", "es_correcta": false}, {"letra": "B", "texto": "2 cm", "es_correcta": true}, {"letra": "C", "texto": "2 cm 2", "es_correcta": false}, {"letra": "D", "texto": "4 cm 8 cm x cm x cm", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'B',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-34';

-- Pregunta 35
UPDATE public.preguntas SET
  enunciado = 'Una persona controla un dron y comienza a hacerlo descender verticalmente con 
una rapidez constante de 5 metros por segundo.  
 
Si al momento de iniciar el descenso el dron se encontraba a una altura                  
de 80 metros con respecto al suelo, ¿cuál de los siguientes gráficos representa 
mejor la altura del dron con respecto al suelo, a medida que transcurre el tiempo, 
en segundos, desde el inicio del descenso?',
  alternativas = '[{"letra": "A", "texto": "Opción A", "es_correcta": false}, {"letra": "B", "texto": "Opción B", "es_correcta": false}, {"letra": "C", "texto": "Opción C", "es_correcta": true}, {"letra": "D", "texto": "Tiempo en segundos 80 Altura en metros 16 Tiempo en segundos 80 Altura en metros 5 Tiempo en segundos 80 Altura en metros 16 Tiempo en segundos 80 Altura en metros 5", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'C',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-35';

-- Pregunta 36
UPDATE public.preguntas SET
  enunciado = 'Ignacio se dedica a vender productos encargados por sus clientes, que importa 
mediante una aplicación móvil. El precio de venta al que Ignacio vende los 
productos lo determina según la función 
()
2500
x
5,1
x
P
+
=
, tal que x 
representa el precio, en pesos, al que compra el producto en la aplicación. 
 
¿Cuál de las siguientes afirmaciones es verdadera?',
  alternativas = '[{"letra": "A", "texto": "Ignacio cobra un costo fijo de ( ) 2500 5,1 $ + a todos los productos que vende.", "es_correcta": false}, {"letra": "B", "texto": "Ignacio realiza un recargo de un 50% del precio del producto importado sin considerar ese recargo en el cargo fijo.", "es_correcta": true}, {"letra": "C", "texto": "Ignacio cobra un costo fijo de ( ) 2500 5,1 $ · a todos los productos que vende.", "es_correcta": false}, {"letra": "D", "texto": "Ignacio realiza un recargo de 5%,1 del precio del producto importado sin considerar el cargo fijo.", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'B',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-36';

-- Pregunta 37
UPDATE public.preguntas SET
  enunciado = 'En una distribuidora envasaron 
360 L
 de detergente líquido en bidones de 
3 L
         
y de 
5 L
 de capacidad. 
 
Si se ocuparon en total 100 bidones, ¿cuál de los siguientes valores es la 
diferencia entre la cantidad de bidones de distinta capacidad que se usaron?',
  alternativas = '[{"letra": "A", "texto": "25", "es_correcta": false}, {"letra": "B", "texto": "40", "es_correcta": true}, {"letra": "C", "texto": "48", "es_correcta": false}, {"letra": "D", "texto": "50", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'B',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-37';

-- Pregunta 38
UPDATE public.preguntas SET
  enunciado = '¿Cuál de los siguientes gráficos representa mejor a la función f definida por 
()
(
)2
3
x
x
f
+
=
, con dominio el conjunto de los números reales?',
  alternativas = '[{"letra": "A", "texto": "Opción A", "es_correcta": false}, {"letra": "C", "texto": "Opción C", "es_correcta": false}, {"letra": "D", "texto": "Y X 3 Y X -3 Y X 3", "es_correcta": false}, {"letra": "B", "texto": "Y X -3", "es_correcta": true}]'::jsonb,
  respuesta_correcta = 'B',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-38';

-- Pregunta 40
UPDATE public.preguntas SET
  enunciado = 'Una fábrica de repisas usa escuadras triangulares para afirmar sus repisas, como 
se representa en la figura adjunta. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
En la fábrica se siguen las siguientes reglas de construcción: 
· El cateto de la escuadra en contacto con la repisa debe medir 3
2 del ancho 
de la repisa. 
 
· La hipotenusa de la escuadra debe medir el doble de su cateto que está en 
contacto con la repisa. 
 
Según esta regla de construcción, ¿cuánto debería medir el cateto de la escuadra 
que va adosado en la pared para poner una repisa de ancho 
30 cm
?',
  alternativas = '[{"letra": "A", "texto": "5 cm 45", "es_correcta": false}, {"letra": "B", "texto": "5 cm 20", "es_correcta": false}, {"letra": "C", "texto": "3 cm 20", "es_correcta": true}, {"letra": "D", "texto": "3 cm 45", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'C',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-40';

-- Pregunta 41
UPDATE public.preguntas SET
  enunciado = 'Para proteger una antena de 
20 m
 de altura de los fuertes vientos, una empresa 
telefónica decidió colocar dos cables anclados (P y Q) desde la parte más alta de la 
antena al suelo, tal como se representa en la siguiente figura: 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
Para realizar este anclaje, ¿cuál es la cantidad de cable P y Q que se necesita 
desde la parte más alta de la antena hasta el suelo?',
  alternativas = '[{"letra": "A", "texto": "( )25 m 32 +", "es_correcta": false}, {"letra": "B", "texto": "( )50 m 8 +", "es_correcta": false}, {"letra": "C", "texto": "( )544 m 425 +", "es_correcta": true}, {"letra": "D", "texto": "57 m", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'C',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-41';

-- Pregunta 42
UPDATE public.preguntas SET
  enunciado = 'En la figura adjunta los lados del rectángulo gris miden 
3 cm
 y 
9 cm
. Alrededor de 
este rectángulo se ha dibujado un rectángulo separado en 
cm
x
 del borde del 
rectángulo gris, tal como se representa a continuación: 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
¿Cuál de las siguientes expresiones representa el perímetro, en cm , del rectángulo 
mayor?',
  alternativas = '[{"letra": "A", "texto": "x 4 12 +", "es_correcta": false}, {"letra": "B", "texto": "( )( ) x 2 3 x 2 9 + +", "es_correcta": false}, {"letra": "C", "texto": "( ) x 4 12 2 +", "es_correcta": true}, {"letra": "D", "texto": "( )( ) 27 x 2 3 x 2 9 - + + x cm x cm x cm x cm", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'C',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-42';

-- Pregunta 43
UPDATE public.preguntas SET
  enunciado = 'Una empresa vende crema para las manos en envases con forma de cilindros 
rectos de 
20 cm
 de altura y de distintos diámetros. 
 
Por una promoción se decide aumentar en su 
20%
 la capacidad de cada envase, 
manteniendo la altura de los envases cilíndricos. 
 
¿Cuál de las siguientes funciones permite determinar el volumen de los nuevos 
envases, en 
3
cm , con r el radio del envase sin promoción, en cm ?',
  alternativas = '[{"letra": "A", "texto": "() π · · = 2r 16 r p", "es_correcta": false}, {"letra": "B", "texto": "() π · · = 2r 24 r g", "es_correcta": true}, {"letra": "C", "texto": "() π · · = 2r 8, 28 r f", "es_correcta": false}, {"letra": "D", "texto": "() π · · = 2r 576 r h", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'B',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-43';

-- Pregunta 44
UPDATE public.preguntas SET
  enunciado = 'Para cierta actividad se aconseja beber diariamente al menos 
1 L
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
6 cm
 y altura 
20 cm
, ¿cuál de las siguientes expresiones permite 
determinar la cantidad de veces, en un día, que debe consumir el contenido de la 
botella llena de agua, para cumplir lo que se aconseja?',
  alternativas = '[{"letra": "A", "texto": "20 36 π P · ·", "es_correcta": false}, {"letra": "B", "texto": "20 36 1$35.000P · · π ·", "es_correcta": false}, {"letra": "C", "texto": "20 9 1$35.000P · · π ·", "es_correcta": true}, {"letra": "D", "texto": "20 9 π 35 P · ·", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'C',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-44';

-- Pregunta 45
UPDATE public.preguntas SET
  enunciado = '¿Cuál de las figuras dadas en las opciones se puede obtener usando solo 
traslaciones de la figura adjunta?',
  alternativas = '[{"letra": "B", "texto": "Opción B", "es_correcta": false}, {"letra": "C", "texto": "Opción C", "es_correcta": false}, {"letra": "A", "texto": "Opción A", "es_correcta": true}, {"letra": "D", "texto": "Y X X Y Y X X Y X Y", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'A',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-45';

-- Pregunta 46
UPDATE public.preguntas SET
  enunciado = 'En el plano cartesiano de la cuadrícula adjunta se tiene un punto de inicio el cual se 
debe mover 
3 cm
 al este y 
2 cm
 al norte, para luego trasladarse 
5 cm
 al sur y 
4 cm
 al oeste, llegando al punto final. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
Si cada lado de los cuadrados de la cuadrícula equivalen a 
1 cm
, ¿cuál de los 
siguientes vectores representa el camino desde el punto de inicio hasta el punto 
final?',
  alternativas = '[{"letra": "A", "texto": "( ) 5 ,4 v - - =", "es_correcta": false}, {"letra": "B", "texto": "( ) 3 ,1 u - - =", "es_correcta": true}, {"letra": "C", "texto": "( ) 3 ,1 r - =", "es_correcta": false}, {"letra": "D", "texto": "( )1 ,3 s - = Y X Punto de inicio N S E O", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'B',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-46';

-- Pregunta 48
UPDATE public.preguntas SET
  enunciado = 'A un punto P del plano cartesiano se le aplica una reflexión respecto al origen de 
este obteniéndose el punto Q , luego el punto Q se traslada según el vector 
)
3
,2
(
v
-
=
 obteniéndose el punto R . 
 
Si R tiene coordenadas 
)
4
,5
(
, ¿cuáles son las coordenadas del punto P ?',
  alternativas = '[{"letra": "A", "texto": ") 7 ,3 (", "es_correcta": false}, {"letra": "B", "texto": ")1 ,7 ( - -", "es_correcta": true}, {"letra": "C", "texto": ")1 ,7 ( -", "es_correcta": false}, {"letra": "D", "texto": ") 7 ,3 ( - -", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'B',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-48';

-- Pregunta 51
UPDATE public.preguntas SET
  enunciado = 'La retina es un tejido sensible a la luz situada en la superficie interior del ojo similar 
a una tela donde se proyectan imágenes, como se representa en la siguiente 
figura. 
 
 
 
 
 
 
 
 
 
Para estimar la altura t en que se ve un objeto en la retina de un ojo, se puede 
utilizar la relación 
h
m
t
·
=
, tal que h es la altura real del objeto en metros y 
p
metros
00,17
m =
, con p la distancia, en metros, entre el objeto y el ojo. 
 
Si la altura real de un objeto es 2 metros y está ubicado a una distancia de                   
4,3
 metros  de un ojo, ¿qué altura tiene el objeto en la retina del ojo?',
  alternativas = '[{"letra": "A", "texto": "00,01 metros", "es_correcta": false}, {"letra": "B", "texto": "0,01 metros", "es_correcta": true}, {"letra": "C", "texto": "1,0 metros", "es_correcta": false}, {"letra": "D", "texto": "1 metros t p h", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'B',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-51';

-- Pregunta 52
UPDATE public.preguntas SET
  enunciado = 'Una persona apoya una escalera de 
15 m
 sobre una pandereta de 
5,1 m
 de altura, 
para poder llegar a cierta altura de un edificio, tal como se representa en la 
siguiente figura:  
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
El punto de apoyo de la escalera en la pandereta está justo cuando completa los 
2 m
 de escalera. 
 
¿A qué altura de la pared del edificio llega la escalera que colocó la persona?',
  alternativas = '[{"letra": "A", "texto": "A 5 m, 15", "es_correcta": false}, {"letra": "B", "texto": "A 25 m , 11", "es_correcta": true}, {"letra": "C", "texto": "A 9,75 m", "es_correcta": false}, {"letra": "D", "texto": "A 5 m 2 m Pandereta", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'B',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-52';

-- Pregunta 53
UPDATE public.preguntas SET
  enunciado = 'Carmen quiere saber la altura de su pieza y decidió colocar sobre una mesa, que 
tiene una altura de 
75 cm
, una regla de 
15 cm
. 
 
La regla la posicionó de manera vertical, a una distancia de 
20 cm
 del borde de la 
mesa, desde donde ella puede apreciar el extremo superior de la altura de la pieza 
como se representa en la figura adjunta. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
Si la distancia desde el extremo de la mesa a la pared es de 
200 cm
, ¿cuál es la 
medida de la altura de la pieza de Carmen?',
  alternativas = '[{"letra": "A", "texto": "135 cm", "es_correcta": false}, {"letra": "B", "texto": "150 cm", "es_correcta": false}, {"letra": "C", "texto": "210 cm", "es_correcta": false}, {"letra": "D", "texto": "225 cm 200 cm", "es_correcta": true}]'::jsonb,
  respuesta_correcta = 'D',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-53';

-- Pregunta 54
UPDATE public.preguntas SET
  enunciado = 'Se realiza una encuesta a un grupo de personas, sobre la cantidad de plantas que 
tiene cada una en su casa. Los resultados se presentan en el gráfico adjunto. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
¿Cuál de los siguientes argumentos respalda que la respuesta mayoritaria de los 
encuestados fue 3 plantas?',
  alternativas = '[{"letra": "A", "texto": "Porque hay 3 barras que llegan al mismo número.", "es_correcta": false}, {"letra": "B", "texto": "Porque el 3 tiene la barra más alta.", "es_correcta": true}, {"letra": "C", "texto": "Porque la diferencia entre la barra más alta y la más baja es 3.", "es_correcta": false}, {"letra": "D", "texto": "Porque la barra del medio tiene frecuencia 3. Frecuencia 1 2 3 7 6 5 4 0 4 2 3 1 Cantidad de plantas", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'B',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-54';

-- Pregunta 55
UPDATE public.preguntas SET
  enunciado = 'A un grupo de personas se le consultó acerca de la cantidad de películas vistas 
el último mes. En la tabla adjunta se presenta la distribución de los resultados 
de dicha consulta. 
 
 
 
 
 
 
 
 
 
 
 
 
 
Si se agregan personas al grupo de tal manera que la frecuencia de todos los datos 
aumenta en un 
20%
, ¿cuál de las siguientes expresiones representa la cantidad 
total de personas que hay finalmente en el grupo?',
  alternativas = '[{"letra": "A", "texto": "t2,1 h 2,1 300 + +", "es_correcta": true}, {"letra": "B", "texto": "t2,1 h 2,1 +", "es_correcta": false}, {"letra": "C", "texto": "300", "es_correcta": false}, {"letra": "D", "texto": "12 Cantidad de películas vistas el último mes Frecuencia 1 h 2 200 3 t 4 50", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'A',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-55';

-- Pregunta 58
UPDATE public.preguntas SET
  enunciado = 'Los resultados de las dos primeras pruebas de matemática de Esteban son un             
3,5
 y un 
9,5
. 
 
¿Cuál de las siguientes notas es la mínima que debe obtener Esteban en la tercera 
prueba para que su promedio sea de al menos un 
9,5
 en las tres pruebas?',
  alternativas = '[{"letra": "A", "texto": "9,5", "es_correcta": false}, {"letra": "B", "texto": "1,6", "es_correcta": false}, {"letra": "C", "texto": "2,6", "es_correcta": false}, {"letra": "D", "texto": "5,6 Cantidad de goles 1er 2do 3er 4to Goles en contra Goles a favor 1 2 3 Partido jugado", "es_correcta": true}]'::jsonb,
  respuesta_correcta = 'D',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-58';

-- Pregunta 59
UPDATE public.preguntas SET
  enunciado = 'Los trabajadores de una empresa tienen tres tipos de sueldos según su puesto de 
trabajo. Hay n trabajadores con un sueldo de 
$800.000
, m trabajadores con un 
sueldo de 
$500.000
 y w trabajadores con un sueldo de 
$100.0001
$
. 
 
 
¿Cuál de las siguientes fórmulas permite determinar el promedio X de los sueldos 
de todos los trabajadores de esta empresa?',
  alternativas = '[{"letra": "A", "texto": "w m n $100.0001 $500.000$800.000X + + + + =", "es_correcta": false}, {"letra": "B", "texto": "( ) w m n 3 $100.0001 $500.000$800.000X + + )) ) (( ( + + =", "es_correcta": false}, {"letra": "C", "texto": "3 w $100.0001 m $500.000n $800.000X · + · + · =", "es_correcta": false}, {"letra": "D", "texto": "w m n w $100.0001 m $500.000n $800.000X + + · + · + · =", "es_correcta": true}]'::jsonb,
  respuesta_correcta = 'D',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-59';

-- Pregunta 60
UPDATE public.preguntas SET
  enunciado = 'En el diagrama de cajón adjunto se presenta la distribución de los tiempos que 
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
  alternativas = '[{"letra": "A", "texto": "Exactamente 2 personas durarán más de s 60 .", "es_correcta": false}, {"letra": "B", "texto": "A lo más 3 personas durarán más de s 60 .", "es_correcta": false}, {"letra": "C", "texto": "Al menos 25 personas durarán más de s 60 .", "es_correcta": true}, {"letra": "D", "texto": "Exactamente 50 personas durarán más de s 60 . 15 25 30 46 70 Tiempo en segundos", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'C',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-60';

-- Pregunta 61
UPDATE public.preguntas SET
  enunciado = 'En la tabla adjunta se presenta la distribución de la edad de un grupo de                     
150 personas. 
 
 
 
 
 
 
 
 
 
 
 
 
¿En qué intervalo se encuentra el percentil 20 de las edades?',
  alternativas = '[{"letra": "A", "texto": "[ [ 35 , 30", "es_correcta": true}, {"letra": "B", "texto": "[ [ 45 , 40", "es_correcta": false}, {"letra": "C", "texto": "[ [ 30 , 25", "es_correcta": false}, {"letra": "D", "texto": "[ [ 40 , 35", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'A',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-61';

-- Pregunta 64
UPDATE public.preguntas SET
  enunciado = 'Una caja contiene seis tarjetas todas del mismo tipo y en cada una de ellas hay 
una palabra escrita. Las palabras escritas en cuatro de las tarjetas son: CLASE, 
SOL, TEMPRANO y LEON. 
 
Se sabe que al extraer al azar una tarjeta de la caja la probabilidad de que la 
palabra escrita en ella tenga menos de tres letras vocales es 3
2 . 
 
¿Cuáles de las siguientes palabras podrían estar escritas en las otras dos tarjetas?',
  alternativas = '[{"letra": "A", "texto": "VASO y RED", "es_correcta": false}, {"letra": "B", "texto": "CINCO y SEIS", "es_correcta": false}, {"letra": "C", "texto": "CUADRILATERO y CANTO", "es_correcta": true}, {"letra": "D", "texto": "PARALELOGRAMO y GIGANTESCO Sabor Frecuencia vainilla 9 chocolate 15 frutilla 6 manjar 20", "es_correcta": false}]'::jsonb,
  respuesta_correcta = 'C',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-64';
