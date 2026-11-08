--
-- Migración 063: Normalización de Símbolos Matemáticos PUA, Decimales y Coordenadas en PAES M1 & M2
-- Total preguntas corregidas: 304
-- Fecha: 2026-11-08T00:56:57.129Z
--
BEGIN;

UPDATE public.preguntas
SET
  enunciado = 'El modelo RVA de colores, permite crear cualquier color mediante la mezcla de los
distintos tonos de tres colores: rojo, verde y azul. Los valores de la intensidad de
cada uno de estos colores van desde el 0 al 255 y cada color creado tiene un
código de tres números donde el primero representa al rojo, el segundo al verde y
el tercero al azul.
El código de la mezcla de dos colores se obtiene haciendo el promedio de cada
uno de los valores de los colores originales tal como se presenta a continuación:
Colores para mezclar Color resultante
(,a ,b c),(m, ,n)t ( (( a + 2 m, b + 2 n, 2 c + t ) ))
¿Con(170, 80 qué, 60 color)? hay que mezclar el color(160, 60, 120) para obtener el color',
  alternativas = '[{"letra":"A","texto":"(10, 20, 60)","es_correcta":false},{"letra":"B","texto":"(180, 100, 60)","es_correcta":false},{"letra":"C","texto":"(180, 100, 0)","es_correcta":true},{"letra":"D","texto":"(165, 70, 90)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-05';

UPDATE public.preguntas
SET
  enunciado = 'Si el precio de un helado es$500, ¿cuál de las siguientes expresiones representa
el valor del helado aumentado en su 120 %?',
  alternativas = '[{"letra":"A","texto":"500 + 120 · 500","es_correcta":false},{"letra":"B","texto":"500 + 20 · 500","es_correcta":false},{"letra":"C","texto":"1,20 · 500","es_correcta":false},{"letra":"D","texto":"2,20 · 500","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-09';

UPDATE public.preguntas
SET
  enunciado = 'En un estudio realizado a un grupo de 25 personas, se les consultó por su bebida
favorita, de entre cuatro disponibles (Almíbar, Refrescante, Quitased y Frutirico).
En la tabla adjunta se presentan los resultados obtenidos.
Bebida Cantidad de personas
Almíbar 12
Refrescante 4
Quitased 8
Frutirico 1
¿Cuál de las siguientes afirmaciones es verdadera?',
  alternativas = '[{"letra":"A","texto":"El 80 % de las personas prefiere la bebida Almíbar o la bebida Quitased.","es_correcta":true},{"letra":"B","texto":"Un 0,16 % de las personas prefiere la bebida Refrescante.","es_correcta":false},{"letra":"C","texto":"Las personas que prefieren la bebida Frutirico representan un 1 % de las personas que prefieren la bebida Quitased.","es_correcta":false},{"letra":"D","texto":"Las personas que prefieren la bebida Almíbar o la bebida Frutirico representan menos del 50 % del total de personas.","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-11';

UPDATE public.preguntas
SET
  enunciado = 'Un estudiante realiza el siguiente procedimiento para determinar el resultado de la
expresión ( (( 2 3 ) )) -2 (· (( 3 2 ) )) 2, cometiendo un error en el desarrollo.
( (( 2 3 ) )) -2 (· (( 3 2 ) )) 2
Paso 1 ( ( ( 3 2 ) ) ) 2 (· ( ( 3 2 ) ) ) 2
Paso 2 ( ( ( 3 2 · 3 2 ) ) ) 4
Paso 3 ( ( ( 9 4 ) ) ) 4
Paso 4 6561
256
¿En cuál de los pasos se cometió el error?',
  alternativas = '[{"letra":"A","texto":"En el Paso 1","es_correcta":false},{"letra":"B","texto":"En el Paso 2","es_correcta":true},{"letra":"C","texto":"En el Paso 3","es_correcta":false},{"letra":"D","texto":"En el Paso 4","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-14';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál es el valor de -3 6 2 · 2 3?',
  alternativas = '[{"letra":"A","texto":"B) --27 1 2","es_correcta":true},{"letra":"B","texto":"Opción B (ver figura)","es_correcta":false},{"letra":"C","texto":"2 3","es_correcta":false},{"letra":"D","texto":"3 2","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-16';

UPDATE public.preguntas
SET
  enunciado = 'Cierto tipo de bacteria se cuadruplica cada una hora.
Si en un instante hay 320 de estas bacterias en un lugar, ¿cuál de las siguientes
expresiones permite determinar la cantidad de bacterias que habrá n horas
después de ese instante?',
  alternativas = '[{"letra":"A","texto":"320 · 4 n","es_correcta":false},{"letra":"B","texto":"320 · 4 n","es_correcta":true},{"letra":"C","texto":"(320 · 4)n","es_correcta":false},{"letra":"D","texto":"320n · 4","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-19';

UPDATE public.preguntas
SET
  enunciado = 'El largo de un rectángulo mide el triple de su ancho.
Si su ancho mide 3k mm, con k un número entero positivo, ¿cuál de las
siguientes expresiones representa el área del rectángulo, en 2 mm?',
  alternativas = '[{"letra":"A","texto":"9 k + k 2","es_correcta":false},{"letra":"B","texto":"9 2 k + 1","es_correcta":false},{"letra":"C","texto":"3 2 k + 1","es_correcta":true},{"letra":"D","texto":"3 k + k 2","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-20';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál de las siguientes expresiones es igual que(a + (b + c))(· a + (b -c))?',
  alternativas = '[{"letra":"A","texto":"a 2 + b 2 -2 c","es_correcta":false},{"letra":"B","texto":"a 2 + 2 ab + b 2 -2 c","es_correcta":true},{"letra":"C","texto":"a 2 + a 2 b 2 + b 2 -2 c","es_correcta":false},{"letra":"D","texto":"a 2 +(b -)2 c","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-22';

UPDATE public.preguntas
SET
  enunciado = 'El(x 3 volumen -2 x 2 -15 del x), paralelepípedo con x un número de real la mayor figura que adjunta, 5. en metros cúbicos, es
(x -5) metros
p metros x metros
¿Cuál de las siguientes expresiones representa el valor de p?',
  alternativas = '[{"letra":"A","texto":"x -3","es_correcta":false},{"letra":"B","texto":"x + 5","es_correcta":false},{"letra":"C","texto":"x2 -5","es_correcta":false},{"letra":"D","texto":"x + 3","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-23';

UPDATE public.preguntas
SET
  enunciado = 'La factores, expresión tal que(a uno + 1) de 2 + ellos(a + es 1)(a(a -+ 3))1 se. factoriza como el producto de dos
¿Cuál de las siguientes expresiones corresponde al otro factor de la expresión?',
  alternativas = '[{"letra":"A","texto":"(a2 + 3 a -2)","es_correcta":false},{"letra":"B","texto":"(a -2)","es_correcta":false},{"letra":"C","texto":"(a2 -a -2)","es_correcta":false},{"letra":"D","texto":"(2 a -2)","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-24';

UPDATE public.preguntas
SET
  enunciado = 'En una tienda de mascotas se dispone de un monto máximo de$50.000 para pagar
la electricidad que se consume en un mes.
La empresa eléctrica que suministra este servicio realiza el cobro, en pesos,
mediante la función (c x) = 100 x + 5000, siendo x la cantidad de kWh consumidos
en el mes.
¿Cuál de los siguientes conjuntos contiene a todos y únicamente los posibles
valores del consumo en kWh en el mes que se puede solventar con el monto
disponible en esa tienda?',
  alternativas = '[{"letra":"A","texto":"[ 0,450 ]","es_correcta":true},{"letra":"B","texto":"[ 0,450 [","es_correcta":false},{"letra":"C","texto":"[ 0,550 [","es_correcta":false},{"letra":"D","texto":"[ 0,5500 ]","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-29';

UPDATE public.preguntas
SET
  enunciado = 'En una frutería cada durazno cuesta$480 y cada mango cuesta$400. Una
persona gastó$6.800 en total comprando solo 16 frutas entre duraznos y mangos.
¿Cuál de las siguientes ecuaciones permite determinar la cantidad x de duraznos
que compró la persona?',
  alternativas = '[{"letra":"A","texto":"480 x + 400(16 -x) = 6800","es_correcta":true},{"letra":"B","texto":"480 x + 400(x -16) = 6800","es_correcta":false},{"letra":"C","texto":"480 x + 400 x = 16","es_correcta":false},{"letra":"D","texto":"(480 + 400) x = 6800 + 16","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-31';

UPDATE public.preguntas
SET
  enunciado = '¿Cuáles son las soluciones de la ecuación x2 -12 x + 35 = 0?',
  alternativas = '[{"letra":"A","texto":"-14 y -10","es_correcta":false},{"letra":"B","texto":"-7 y -5","es_correcta":false},{"letra":"C","texto":"7 y 5","es_correcta":true},{"letra":"D","texto":"14 y 10","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-33';

UPDATE public.preguntas
SET
  enunciado = 'Ignacio se dedica a vender productos encargados por sus clientes, que importa
mediante productos una lo determina aplicación móvil. según El la precio función de venta P() x = al 5,1 que x + 2500 Ignacio, tal vende que los x
representa el precio, en pesos, al que compra el producto en la aplicación.
¿Cuál de las siguientes afirmaciones es verdadera?',
  alternativas = '[{"letra":"A","texto":"Ignacio cobra un costo fijo de$(5,1 + 2500) a todos los productos que vende.","es_correcta":false},{"letra":"B","texto":"Ignacio realiza un recargo de un 50 % del precio del producto importado sin considerar ese recargo en el cargo fijo.","es_correcta":true},{"letra":"C","texto":"Ignacio cobra un costo fijo de$(5,1 · 2500) a todos los productos que vende.","es_correcta":false},{"letra":"D","texto":"Ignacio realiza un recargo de 5,1 % del precio del producto importado sin considerar el cargo fijo.","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-36';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál de los siguientes gráficos representa mejor a la función f definida por
f() x =(x + 3)2, con dominio el conjunto de los números reales?',
  alternativas = '[{"letra":"A","texto":"Y B) Y 3 X -3 X","es_correcta":false},{"letra":"B","texto":"Opción B (ver figura)","es_correcta":true},{"letra":"C","texto":"Y D) Y 3 X X -3","es_correcta":false},{"letra":"D","texto":"Opción D (ver figura)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-38';

UPDATE public.preguntas
SET
  enunciado = 'Para proteger una antena de 20 m de altura de los fuertes vientos, una empresa
telefónica decidió colocar dos cables anclados (P y Q) desde la parte más alta de la
antena al suelo, tal como se representa en la siguiente figura:
Para realizar este anclaje, ¿cuál es la cantidad de cable P y Q que se necesita
desde la parte más alta de la antena hasta el suelo?',
  alternativas = '[{"letra":"A","texto":"(32 + 25)m","es_correcta":false},{"letra":"B","texto":"(8 + 50)m","es_correcta":false},{"letra":"C","texto":"(425 + 544)m","es_correcta":true},{"letra":"D","texto":"57 m","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-41';

UPDATE public.preguntas
SET
  enunciado = 'En la figura adjunta los lados del rectángulo gris miden 3 cm y 9 cm. Alrededor de
este rectángulo se ha dibujado un rectángulo separado en x cm del borde del
rectángulo gris, tal como se representa a continuación:
x cm
x cm x cm
x cm
¿Cuál de las siguientes expresiones representa el perímetro, en cm, del rectángulo
mayor?',
  alternativas = '[{"letra":"A","texto":"12 + 4 x","es_correcta":false},{"letra":"B","texto":"(9 + 2 x)(3 + 2 x)","es_correcta":false},{"letra":"C","texto":"2(12 + 4 x)","es_correcta":true},{"letra":"D","texto":"(9 + 2 x)(3 + 2 x) -27","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-42';

UPDATE public.preguntas
SET
  enunciado = 'Una empresa vende crema para las manos en envases con forma de cilindros
rectos de 20 cm de altura y de distintos diámetros.
Por una promoción se decide aumentar en su 20 % la capacidad de cada envase,
manteniendo la altura de los envases cilíndricos.
¿Cuál de las siguientes funciones permite determinar el volumen de los nuevos
envases, en 3 cm, con r el radio del envase sin promoción, en cm?',
  alternativas = '[{"letra":"A","texto":"p() r = 16 · 2r · \\pi","es_correcta":false},{"letra":"B","texto":"g() r = 24 · 2r · \\pi","es_correcta":true},{"letra":"C","texto":"f() r = 28 8, · 2r · \\pi","es_correcta":false},{"letra":"D","texto":"h() r = 576 · 2r · \\pi","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-43';

UPDATE public.preguntas
SET
  enunciado = 'Para cierta actividad se aconseja beber diariamente al menos 1 L de agua por
cada 35 kg de masa corporal.
Para una persona de masa corporal P kg que tiene una botella de forma cilíndrica
de diámetro 6 cm y altura 20 cm, ¿cuál de las siguientes expresiones permite
determinar la cantidad de veces, en un día, que debe consumir el contenido de la
botella llena de agua, para cumplir lo que se aconseja?',
  alternativas = '[{"letra":"A","texto":"π · 36 P · 20","es_correcta":false},{"letra":"B","texto":"\\pi  35 P · 36 · 1000 · 20","es_correcta":false},{"letra":"C","texto":"35 \\pi  P · · 9 1000 · 20","es_correcta":true},{"letra":"D","texto":"35 π · P 9 · 20","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-44';

UPDATE public.preguntas
SET
  enunciado = 'En el plano cartesiano de la cuadrícula adjunta se tiene un punto de inicio el cual se
debe mover 3 cm al este y 2 cm al norte, para luego trasladarse 5 cm al sur y
4 cm al oeste, llegando al punto final.
Y N
O E
S
Punto de inicio
X
Si cada lado de los cuadrados de la cuadrícula equivalen a 1 cm, ¿cuál de los
siguientes vectores representa el camino desde el punto de inicio hasta el punto
final?',
  alternativas = '[{"letra":"A","texto":"v =(-,4 -5)","es_correcta":false},{"letra":"B","texto":"u =(-,1 -3)","es_correcta":true},{"letra":"C","texto":"r =(1, -3)","es_correcta":false},{"letra":"D","texto":"s =(3, -)1","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-46';

UPDATE public.preguntas
SET
  enunciado = 'A un punto P del plano cartesiano se le aplica una reflexión respecto al origen de
este obteniéndose el punto Q, luego el punto Q se traslada según el vector
v =(-,2 3) obteniéndose el punto R.
Si R tiene coordenadas(5, 4), ¿cuáles son las coordenadas del punto P?',
  alternativas = '[{"letra":"A","texto":"(3, 7)","es_correcta":false},{"letra":"B","texto":"(-,7 -)1","es_correcta":true},{"letra":"C","texto":"(7, -)1","es_correcta":false},{"letra":"D","texto":"(-,3 -7)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-48';

UPDATE public.preguntas
SET
  enunciado = 'La retina es un tejido sensible a la luz situada en la superficie interior del ojo similar
a una tela donde se proyectan imágenes, como se representa en la siguiente
figura.
t p h
Para estimar la altura t en que se ve un objeto en la retina de un ojo, se puede
utilizar la relación t = m · h, tal que h es la altura real del objeto en metros y
m = 0,017 p metros, con p la distancia, en metros, entre el objeto y el ojo.
Si la altura real de un objeto es 2 metros y está ubicado a una distancia de
4,3 metros de un ojo, ¿qué altura tiene el objeto en la retina del ojo?',
  alternativas = '[{"letra":"A","texto":"0,001 metros","es_correcta":false},{"letra":"B","texto":"0,01 metros","es_correcta":true},{"letra":"C","texto":"1,0 metros","es_correcta":false},{"letra":"D","texto":"1 metros","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-51';

UPDATE public.preguntas
SET
  enunciado = 'Una persona apoya una escalera de 15 m sobre una pandereta de 5,1 m de altura,
para poder llegar a cierta altura de un edificio, tal como se representa en la
siguiente figura:
2 m
Pandereta
El punto de apoyo de la escalera en la pandereta está justo cuando completa los
2 m de escalera.
¿A qué altura de la pared del edificio llega la escalera que colocó la persona?',
  alternativas = '[{"letra":"A","texto":"A 15 5, m","es_correcta":false},{"letra":"B","texto":"A 11, 25 m","es_correcta":true},{"letra":"C","texto":"A 9,75 m","es_correcta":false},{"letra":"D","texto":"A 5 m","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-52';

UPDATE public.preguntas
SET
  enunciado = 'A un grupo de personas se le consultó acerca de la cantidad de películas vistas
el último mes. En la tabla adjunta se presenta la distribución de los resultados
de dicha consulta.
Cantidad vistas el de último películas mes Frecuencia
1 h
2 200
3 t
4 50
Si se agregan personas al grupo de tal manera que la frecuencia de todos los datos
aumenta en un 20 %, ¿cuál de las siguientes expresiones representa la cantidad
total de personas que hay finalmente en el grupo?',
  alternativas = '[{"letra":"A","texto":"300 + 2,1 h + t2,1","es_correcta":true},{"letra":"B","texto":"2,1 h + t2,1","es_correcta":false},{"letra":"C","texto":"300","es_correcta":false},{"letra":"D","texto":"12","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-55';

UPDATE public.preguntas
SET
  enunciado = 'Los trabajadores de una empresa tienen tres tipos de sueldos según su puesto de
trabajo. Hay n trabajadores con un sueldo de$800.000, m trabajadores con un
sueldo de$500.000 y w trabajadores con un sueldo de$1 100 000.
¿Cuál de las siguientes fórmulas permite determinar el promedio X de los sueldos
de todos los trabajadores de esta empresa?',
  alternativas = '[{"letra":"A","texto":"X = 800 000 + n 500 + 000 m + w + 1 100 000","es_correcta":false},{"letra":"B","texto":"X = ( (( 800 000 + 500 3 000 + 1 100 000 ) ))(n + m + w)","es_correcta":false},{"letra":"C","texto":"X = 800 000 · n + 500 $3.000· m + 1 100 000 · w","es_correcta":false},{"letra":"D","texto":"X = 800 000 · n + 500 n + 000 m + · m w + 1 100 000 · w","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-59';

UPDATE public.preguntas
SET
  enunciado = 'En la tabla adjunta se presenta la distribución de la edad de un grupo de
150 personas.
Edad [ [ [ [ [ [ [ 30 35 55 50 40 45 25 (en,,,,,,, 30 40 50 35 60 55 45 años) [ [ [ [ [ [ ] Frecuencia 12 12 12 36 30 24 24
¿En qué intervalo se encuentra el percentil 20 de las edades?',
  alternativas = '[{"letra":"A","texto":"[ 30, 35 [","es_correcta":true},{"letra":"B","texto":"[ 40, 45 [","es_correcta":false},{"letra":"C","texto":"[ 25, 30 [","es_correcta":false},{"letra":"D","texto":"[ 35, 40 [","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-61';

UPDATE public.preguntas
SET
  enunciado = 'Se consultó a un grupo de 50 personas acerca de su sabor favorito de cierto tipo
de helado. En la tabla adjunta se registran los resultados obtenidos.
Sabor Frecuencia
vainilla 9
chocolate 15
frutilla 6
manjar 20
Si se elige a una de estas personas al azar, ¿cuál es la probabilidad de que su
sabor favorito sea de vainilla o de frutilla?',
  alternativas = '[{"letra":"A","texto":"10 3","es_correcta":true},{"letra":"B","texto":"50 9 · 50 6","es_correcta":false},{"letra":"C","texto":"54 1","es_correcta":false},{"letra":"D","texto":"15 1","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-63';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál es el valor de 0,002 0,01 0,02?',
  alternativas = '[{"letra":"A","texto":"0,04","es_correcta":false},{"letra":"B","texto":"0,004","es_correcta":true},{"letra":"C","texto":",0 $4.000","es_correcta":false},{"letra":"D","texto":",0 $004.000","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-02';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál es el valor de 1 2 +(-)1 2 +()1,0 2?',
  alternativas = '[{"letra":"A","texto":"0,01","es_correcta":false},{"letra":"B","texto":",0 2","es_correcta":false},{"letra":"C","texto":"2,01","es_correcta":true},{"letra":"D","texto":"1,2","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-03';

UPDATE public.preguntas
SET
  enunciado = 'En la tabla adjunta se presenta la cantidad de metros cuadrados recomendados
para la crianza de cerdo de acuerdo con su masa.
Masa del cerdo Cantidad mínima de cerdo metros cuadrados por
Menos de 10 kg 0,15
Entre 10 kg y 20 kg ,0 2
Entre 20 kg y 30 kg 3,0
Entre 30 kg y 50 kg ,0 4
Entre 50 kg y 85 kg 0,55
Entre 85 kg y 110 kg 0,65
110 kg o más 1
Si se quiere hacer un chiquero para 12 cerdos del tipo Göttingen, que llegan a
tener una masa de entre 35 kg y 45 kg en edad adulta, ¿cuál es la cantidad
mínima de metros cuadrados que debe tener el chiquero para cumplir con la
recomendación?',
  alternativas = '[{"letra":"A","texto":",2 4","es_correcta":false},{"letra":"B","texto":",3 6","es_correcta":false},{"letra":"C","texto":"8,4","es_correcta":true},{"letra":"D","texto":"6,6","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-06';

UPDATE public.preguntas
SET
  enunciado = 'La temperatura en una cámara de frigorífico es de 12 ° C. Se necesita variar esta
temperatura hasta alcanzar los -36 ° C.
Si la temperatura desciende 3 ° C cada cinco minutos, ¿cuánto tiempo se tardará
en alcanzar dicha temperatura?',
  alternativas = '[{"letra":"A","texto":"85 minutos","es_correcta":false},{"letra":"B","texto":"80 minutos","es_correcta":true},{"letra":"C","texto":"60 minutos","es_correcta":false},{"letra":"D","texto":"48 minutos","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-08';

UPDATE public.preguntas
SET
  enunciado = 'En una panadería, un kilogramo de pan cuesta actualmente$1.800, pero su precio
subirá un 20 %.
Si se compraran x kilogramos de pan después del aumento del precio, ¿cuál de
las siguientes expresiones correspondería al monto total, en pesos, que se
pagaría?',
  alternativas = '[{"letra":"A","texto":"1 800 + 20 · x","es_correcta":false},{"letra":"B","texto":"1 800 + 2,0 · x","es_correcta":false},{"letra":"C","texto":"1 820 · x","es_correcta":false},{"letra":"D","texto":"2 160 · x","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-16';

UPDATE public.preguntas
SET
  enunciado = 'En la tabla adjunta se presentan algunas unidades de distancia utilizadas en el
Sistema Internacional y su equivalencia en metros.
Unidad Símbolo Equivalencia en metros
Yottametro Ym 1 $000.000$000.000$000.000$000.000m
Zettametro Zm 1 $000.000$000.000$000.000000 m
Exámetro Em 1 $000.000$000.000$000.000m
Petámetro Pm 1 $000.000$000.000000 m
Terámetro Tm 1 $000.000$000.000m
Gigámetro Gm 1 $000.000000 m
Megámetro Mm 1 $000.000m
Kilómetro Km 1 000 m
¿Cuál es el resultado de la operación 1 1 Ym Zm · 1 1 Em Pm?',
  alternativas = '[{"letra":"A","texto":"1 · 10 6","es_correcta":true},{"letra":"B","texto":"2 · 10 3","es_correcta":false},{"letra":"C","texto":"1 · 10 9 48","es_correcta":false},{"letra":"D","texto":"1 · 10 35","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-17';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál es el resultado de 2 2 8?',
  alternativas = '[{"letra":"A","texto":"2 1 2","es_correcta":true},{"letra":"B","texto":"3 4","es_correcta":false},{"letra":"C","texto":"2 14","es_correcta":false},{"letra":"D","texto":"2 2 ( (( 2 ) )) 5","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-18';

UPDATE public.preguntas
SET
  enunciado = 'Considera la expresión E = ( (( 15 8 3 ) )) 3.
¿Cuál de las siguientes expresiones representa un número entero menor que 200?',
  alternativas = '[{"letra":"A","texto":"288 · E","es_correcta":false},{"letra":"B","texto":"125 · E","es_correcta":false},{"letra":"C","texto":"250 · E","es_correcta":false},{"letra":"D","texto":"144 · E","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-19';

UPDATE public.preguntas
SET
  enunciado = 'El tiempo máximo en microsegundos que tarda un programa de computador en
ordenar alfabéticamente una lista con n nombres se puede modelar mediante la
expresión 0,001 · n · n.
Si una lista tiene 10 000 nombres, ¿cuántos microsegundos tardará como máximo
el programa en ordenar alfabéticamente los nombres de esta lista?',
  alternativas = '[{"letra":"A","texto":"10","es_correcta":false},{"letra":"B","texto":"1000","es_correcta":true},{"letra":"C","texto":"10 000","es_correcta":false},{"letra":"D","texto":"50 000","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-21';

UPDATE public.preguntas
SET
  enunciado = 'Una persona diseña un programa computacional que crea una copia de todos los
archivos del computador cada una hora.
La persona ejecuta el programa en su computador y al cabo de m horas este
posee un total de k · 2 m archivos, con m y k números enteros positivos.
Si la persona durante ese tiempo no elimina ni adiciona archivos, ¿cuál de las
siguientes afirmaciones es siempre verdadera?',
  alternativas = '[{"letra":"A","texto":"k es el tiempo que el programa tarda en llenar totalmente el disco duro del computador.","es_correcta":false},{"letra":"B","texto":"2 m representa la cantidad de veces que el programa copia todos los archivos.","es_correcta":false},{"letra":"C","texto":"k · 2 m -1 representa el total de archivos nuevos que se crearon con el programa.","es_correcta":false},{"letra":"D","texto":"k corresponde a la cantidad inicial de archivos que posee el computador antes de ejecutar el programa.","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-22';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál de las siguientes expresiones representa la tercera parte del sucesor de p?',
  alternativas = '[{"letra":"A","texto":"p 3 + 1","es_correcta":false},{"letra":"B","texto":"3(p +)1","es_correcta":false},{"letra":"C","texto":"p + 1 3","es_correcta":false},{"letra":"D","texto":"p 3 + 1","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-24';

UPDATE public.preguntas
SET
  enunciado = 'Una persona gastó$(a + 1600) en ocho días.
Si todos los días gastó lo mismo, ¿cuál de las siguientes expresiones representa lo
que gastó la persona en dos días?',
  alternativas = '[{"letra":"A","texto":"$( (( 1 4 a +400 ) ))","es_correcta":true},{"letra":"B","texto":"$( (( 1 4 a +1600 ) ))","es_correcta":false},{"letra":"C","texto":"$(2 a + 400)","es_correcta":false},{"letra":"D","texto":"$(2 a + 200)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-26';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál es la solución de la ecuación 2 3 + x = 3 2?',
  alternativas = '[{"letra":"A","texto":"0","es_correcta":false},{"letra":"B","texto":"1 6","es_correcta":false},{"letra":"C","texto":"-1","es_correcta":false},{"letra":"D","texto":"5 6","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-30';

UPDATE public.preguntas
SET
  enunciado = 'Al finalizar un trayecto, la cantidad L de litros de combustible que quedan en el
estanque de cierto vehículo, está dada por la expresión:
L = c -1,0 · x
en la que c es la cantidad de litros que tenía el estanque de este vehículo al iniciar
el trayecto, x es la cantidad de kilómetros que recorrió el vehículo y 1,0 es una
constante medida en litros por kilómetro.
Este vehículo, al iniciar el trayecto tenía en el estanque 50 litros y al finalizarlo
tenía 30 litros.
¿Cuántos kilómetros recorrió el vehículo en ese trayecto?',
  alternativas = '[{"letra":"A","texto":"800","es_correcta":false},{"letra":"B","texto":"250","es_correcta":false},{"letra":"C","texto":"200","es_correcta":true},{"letra":"D","texto":"2","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-31';

UPDATE public.preguntas
SET
  enunciado = 'Se hace una colecta para recaudar fondos, logrando recaudar$30.000 con
150 monedas de dos valores distintos.
El siguiente sistema de ecuaciones es un modelo para determinar la cantidad de
monedas de cada tipo:
x + y = 150
500 x + 50 y = 30 000
¿Cuál de las siguientes afirmaciones es verdadera?',
  alternativas = '[{"letra":"A","texto":"x e y corresponden a la cantidad de monedas de$500 y de$50, respectivamente.","es_correcta":true},{"letra":"B","texto":"Hay exactamente 500 monedas del tipo x y 50 monedas del tipo y.","es_correcta":false},{"letra":"C","texto":"Al considerar una moneda de cada tipo el valor total es$150.","es_correcta":false},{"letra":"D","texto":"Considerando solo las monedas de$500 se juntan$5.000.","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-34';

UPDATE public.preguntas
SET
  enunciado = 'En una tienda de ropa se necesita incorporar las ventas por Internet con reparto
a domicilio para aumentar sus ventas. Para el reparto se necesita contratar los
servicios de una empresa de vehículos de transporte y la tienda recibe dos
cotizaciones:
\cdot  Cobro empresa A en un mes: C)t(= 4$3.000· t + 4000
\cdot  Cobro empresa B en un mes: C)t(= 2000 · t
con t el tiempo de uso del servicio, en horas, y C)t(el costo del servicio, en
pesos.
¿Cuánto tiempo se debe usar el servicio en cada empresa para que el costo sea
el mismo?',
  alternativas = '[{"letra":"A","texto":"2,1 horas","es_correcta":false},{"letra":"B","texto":"2 horas","es_correcta":false},{"letra":"C","texto":"6 horas","es_correcta":true},{"letra":"D","texto":"12 horas","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-35';

UPDATE public.preguntas
SET
  enunciado = 'El Índice de Masa Corporal (IMC) de una persona se relaciona con su masa,
medida en kilogramos, y su estatura, medida en metros, a través de la expresión:
masa = estatura 2 · IMC
Si una persona tiene una masa de 54 kg y tiene un IMC = 24, ¿cuál es su
estatura según este modelo?',
  alternativas = '[{"letra":"A","texto":"1,05 m","es_correcta":false},{"letra":"B","texto":"1,125 m","es_correcta":false},{"letra":"C","texto":"5,1 m","es_correcta":true},{"letra":"D","texto":"2,25 m","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-36';

UPDATE public.preguntas
SET
  enunciado = 'Una empresa ha desarrollado la fórmula U(x) = -1 2(x -12) 2 + 1 $000.000que le
permite conocer la utilidad que tendrá, en pesos, al vender x unidades de un
artículo.
¿Cuántos artículos se deben vender para que la utilidad de la empresa sea de
$1 $000.000?',
  alternativas = '[{"letra":"A","texto":"6","es_correcta":false},{"letra":"B","texto":"12","es_correcta":true},{"letra":"C","texto":"13","es_correcta":false},{"letra":"D","texto":"14","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-37';

UPDATE public.preguntas
SET
  enunciado = 'La relación entre el puntaje que una persona obtiene en cierta prueba y su nota
está dada por la siguiente expresión: NOTA = puntaje 14 + 2.
¿Cuál de las siguientes afirmaciones es verdadera respecto a esta prueba?',
  alternativas = '[{"letra":"A","texto":"Para una nota 5,3 se necesita obtener un puntaje de 35 puntos.","es_correcta":false},{"letra":"B","texto":"Con 50 puntos se obtiene una nota superior a 6.","es_correcta":false},{"letra":"C","texto":"Cuando el puntaje aumenta en un punto, la nota aumenta en 2.","es_correcta":false},{"letra":"D","texto":"La mínima nota que se puede obtener en la prueba es un 2.","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-39';

UPDATE public.preguntas
SET
  enunciado = 'En un computador se simula el lanzamiento de un objeto desde una altura de
8 cm. La altura, en cm, que alcanza dicho objeto se modela por la función f
definida por f)t(= -t 2 + t2 + 8, tal que t representa el tiempo transcurrido desde
el lanzamiento, en s.
¿A qué altura se encontraría el objeto a los 3 s de ser lanzado?',
  alternativas = '[{"letra":"A","texto":"5 cm","es_correcta":true},{"letra":"B","texto":"8 cm","es_correcta":false},{"letra":"C","texto":"13 cm","es_correcta":false},{"letra":"D","texto":"23 cm","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-40';

UPDATE public.preguntas
SET
  enunciado = 'La medida d del diámetro de un círculo inscrito en un triángulo rectángulo se puede
determinar con la fórmula de Poncelet:
a + b = c + d
en la cual a y b son las medidas de los catetos del triángulo y c es la medida de la
hipotenusa.
Si las medidas de los catetos de un triángulo rectángulo son 8 cm y 6 cm, ¿cuál
es el perímetro del círculo inscrito en él?',
  alternativas = '[{"letra":"A","texto":"π cm","es_correcta":false},{"letra":"B","texto":"2 π cm","es_correcta":false},{"letra":"C","texto":"4 π cm","es_correcta":true},{"letra":"D","texto":"8 π cm","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-42';

UPDATE public.preguntas
SET
  enunciado = 'Una fábrica de espejos recibe un pedido para elaborar varios tamaños de espejos,
con la particularidad de que todos deben ser cuadrados y que en las esquinas se
sobrepongan triángulos rectángulos de madera iguales entre sí, como el que se
representa en la figura adjunta.
Considera triángulos de m madera y n como y p las como distintas las distintas medidas medidas que pueden que puede tener los tener catetos el lado de del los
espejo.
Si determinar todas las el área medidas() S que están ocupa en el cm, vidrio ¿cuál que se de ve las en siguientes cada espejo, fórmulas en cm permite?
2',
  alternativas = '[{"letra":"A","texto":"S = p 2 + 4 · m · n","es_correcta":false},{"letra":"B","texto":"S = p 2 -4 · m · n","es_correcta":false},{"letra":"C","texto":"S = p 2 + 2 · m · n","es_correcta":false},{"letra":"D","texto":"S = p 2 -2 · m · n","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-43';

UPDATE public.preguntas
SET
  enunciado = 'El punto (2, -3) es un vértice común de cuatro cuadrados cuyos lados miden
2 unidades y son paralelos a los ejes coordenados del plano cartesiano.
¿Cuál de las siguientes coordenadas podría corresponder a un vértice de alguno
de los cuadrados?',
  alternativas = '[{"letra":"A","texto":"(2, -2)","es_correcta":false},{"letra":"B","texto":"(4, -5)","es_correcta":true},{"letra":"C","texto":"(-,1 -3)","es_correcta":false},{"letra":"D","texto":"(,2)1","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-47';

UPDATE public.preguntas
SET
  enunciado = 'Una figura se mueve con las siguientes transformaciones isométricas desde su
posición inicial hasta su posición final como se presenta en la figura adjunta.
1) La figura en la posición inicial se rota en 90 ° en sentido horario con centro de
rotación el centro de la figura.
2) 3) Luego, Por último, se traslada se vuelve 2 metros a rotar en hacia 90 ° el en sur sentido y 6 metros horario al este. con centro de rotación el
centro de la figura, resultando la figura en la posición final.
¿Cuál de las siguientes secuencias de transformaciones isométricas permite
volver a dejar la figura en la posición inicial?',
  alternativas = '[{"letra":"A","texto":"Rotar en 180 ° en sentido horario con centro de rotación el centro de la figura y luego trasladar 2 metros al norte y 6 metros al oeste.","es_correcta":true},{"letra":"B","texto":"Rotar en 180 ° en sentido horario con centro de rotación el centro de la figura y luego trasladar 2 metros al sur y 6 metros al este.","es_correcta":false},{"letra":"C","texto":"Rotar en 90 ° en sentido antihorario con centro de rotación el centro de la figura y luego trasladar 2 metros al sur y 6 metros al este.","es_correcta":false},{"letra":"D","texto":"Rotar en 90 ° en sentido antihorario con centro de rotación el centro de la figura y trasladar 2 metros al norte y 6 metros al oeste.","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-48';

UPDATE public.preguntas
SET
  enunciado = 'Se quiere obtener el punto (12,)1 a partir del punto (-,3 5) mediante cuatro
transformaciones isométricas. Para esto se efectuaron los siguientes pasos,
cometiendo un error en uno de ellos.
Paso 1: al punto (-,3 5) se le aplica una reflexión con respecto al eje Y,
obteniendo el punto (3, 5).
Paso 2: al punto (3, 5) se le aplica una traslación según el vector (-,2 7),
obteniendo el punto ,1(12).
Paso 3: al punto ,1(12) se le aplica una rotación en 90 ° en sentido antihorario
con centro en el origen, obteniendo el punto (12, -)1.
Paso 4: al punto (12, -)1 se le aplica una reflexión con respecto al eje X,
obteniendo el punto (12,)1.
¿En cuál de los pasos se cometió el error?',
  alternativas = '[{"letra":"A","texto":"En el Paso 1","es_correcta":false},{"letra":"B","texto":"En el Paso 2","es_correcta":false},{"letra":"C","texto":"En el Paso 3","es_correcta":true},{"letra":"D","texto":"En el Paso 4","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-49';

UPDATE public.preguntas
SET
  enunciado = 'Ingrid representa las medidas de su casa en un plano a una escala en 1: 100.
¿Cuál de las siguientes fórmulas permitió a Ingrid llevar las medidas de su casa a
las medidas en el plano?',
  alternativas = '[{"letra":"A","texto":"Medidas en el plano = medida en 100 la realidad","es_correcta":false},{"letra":"B","texto":"Medidas en el plano =(medida en la realidad)100 ·","es_correcta":false},{"letra":"C","texto":"Medidas en el plano = medida 100 en la 2 realidad","es_correcta":false},{"letra":"D","texto":"Medidas en el plano = medida en 100 la realidad","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-52';

UPDATE public.preguntas
SET
  enunciado = 'En un taller de instrumentos se construirá una guitarra utilizando un plano que está
en escala 1: 8. En el plano, el largo del mástil de la guitarra es de 95 mm.
¿Cuál debe ser el largo del mástil de la guitarra que se construirá?',
  alternativas = '[{"letra":"A","texto":"103 cm","es_correcta":false},{"letra":"B","texto":"85 5, cm","es_correcta":false},{"letra":"C","texto":"76 cm","es_correcta":true},{"letra":"D","texto":"8,55 cm","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-53';

UPDATE public.preguntas
SET
  enunciado = 'En el taller de literatura de un colegio, se les preguntó a los 25 estudiantes cuántos
días tardaron en leer un libro. En base a las respuestas de los estudiantes se armó
la siguiente tabla que está incompleta:
Cantidad de días Frecuencia Frecuencia relativa
1 2 0,08
2 4 0,16
3
4 9 0,36
5 0,12
Total 25 1
¿Cuántos estudiantes se demoraron tres días en leer el libro?',
  alternativas = '[{"letra":"A","texto":"5","es_correcta":false},{"letra":"B","texto":"7","es_correcta":true},{"letra":"C","texto":"8","es_correcta":false},{"letra":"D","texto":"10","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-56';

UPDATE public.preguntas
SET
  enunciado = 'Un grupo de estudiantes quiere calcular la probabilidad de que al lanzar tres
monedas resulten las tres caras o las tres sellos, realizando el siguiente
procedimiento en el cual cometen un error.
Paso 1: anotan todos los resultados posibles, obteniendo ,c(,c)c, ,c()s,c,
,c(,s)c, ,c(,s)s, ,s(,c)c, ,s(,c)s, ,s(,s)c y ,s(,s)s.
Paso 2: eligen los resultados favorables, ,c(,c)c y ,s(,s)s.
Paso 3: calculan las probabilidades de cada resultado favorable por separado,
P(,c(,c)c) = 8 3 y P(,s(,s)s) = 8 3.
Paso 4: calculan P(tres caras o tres sellos) = P(,s(,s)s) + P(,c(,c)c) = 3 4.
¿En cuál de los pasos se cometió el error?',
  alternativas = '[{"letra":"A","texto":"En el Paso 1","es_correcta":false},{"letra":"B","texto":"En el Paso 2","es_correcta":false},{"letra":"C","texto":"En el Paso 3","es_correcta":true},{"letra":"D","texto":"En el Paso 4","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24inv-65';

UPDATE public.preguntas
SET
  enunciado = '¿En cuál de las siguientes opciones se representa la frase “el doble de la tercera
parte de la diferencia entre 8 y 6 ”?',
  alternativas = '[{"letra":"A","texto":"2 · 1 3 · 8 -6","es_correcta":false},{"letra":"B","texto":"2 · 1 3 ·(8 -6)","es_correcta":true},{"letra":"C","texto":"2 · 3 · 8 -6","es_correcta":false},{"letra":"D","texto":"2 · 3 ·(8 -6)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-04';

UPDATE public.preguntas
SET
  enunciado = 'Considera la siguiente secuencia de figuras, formadas por cuadrados y
triángulos, que se va formando con palitos de fósforo.
¿Cuál es la cantidad de palitos que se utilizan en la figura 25?',
  alternativas = '[{"letra":"A","texto":"7 · 25","es_correcta":false},{"letra":"B","texto":"5 · 25 + 2","es_correcta":true},{"letra":"C","texto":"3 · 25 + 4","es_correcta":false},{"letra":"D","texto":"2 · 25","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-10';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál es el valor de 14 2 + 5 1 -2?',
  alternativas = '[{"letra":"A","texto":"195 25","es_correcta":false},{"letra":"B","texto":"4899 25","es_correcta":false},{"letra":"C","texto":"221","es_correcta":true},{"letra":"D","texto":"171","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-17';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál de las siguientes opciones representa al número(888)2?',
  alternativas = '[{"letra":"A","texto":"2 6 · 111 2","es_correcta":true},{"letra":"B","texto":"26 · 111","es_correcta":false},{"letra":"C","texto":"2 5 · 111 2","es_correcta":false},{"letra":"D","texto":"25 · 111","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-18';

UPDATE public.preguntas
SET
  enunciado = 'Considera el número mtp de tres dígitos, tal que m es el de la centena, t es el
de la decena y p es el de la unidad.
¿Cuál de las siguientes expresiones representa a este número?',
  alternativas = '[{"letra":"A","texto":"m · 10 2 · t · 10 1 · p · 10 0","es_correcta":false},{"letra":"B","texto":"m · 10 3 · t · 10 2 · p · 10 1","es_correcta":false},{"letra":"C","texto":"m · 10 3 + t · 10 2 + p · 10 1","es_correcta":false},{"letra":"D","texto":"m · 10 2 + t · 10 1 + p · 10 0","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-19';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál es el valor de 2 · 2 2?',
  alternativas = '[{"letra":"A","texto":"2 -1 6 9","es_correcta":false},{"letra":"B","texto":"2 2 5","es_correcta":false},{"letra":"C","texto":"2 2","es_correcta":true},{"letra":"D","texto":"2 1","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-20';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál es el valor de 5 + 1 5 -?',
  alternativas = '[{"letra":"A","texto":"2","es_correcta":false},{"letra":"B","texto":"4","es_correcta":true},{"letra":"C","texto":"6","es_correcta":false},{"letra":"D","texto":"2 5","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-21';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál de las siguientes expresiones es igual a(2 x -3)2?',
  alternativas = '[{"letra":"A","texto":"2 x 2 -12 x + 9","es_correcta":false},{"letra":"B","texto":"4 x 2 -6 x -9","es_correcta":false},{"letra":"C","texto":"4 x 2 -12 x + 9","es_correcta":true},{"letra":"D","texto":"4 x 2 -9","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-24';

UPDATE public.preguntas
SET
  enunciado = 'A continuación se realiza la multiplicación(3 x + 4 · x 2 -6 x + 5, en la cual se
comete un error.
Paso 1: se aplica distributividad, 3 x ·(x 2 -obteniéndose: 6 x + 5) + 4 ·(x 2 -6 x + 5)
Paso 2: se desarrollan(las 3 x 2 multiplicaciones, -18 x + 15)(+ 4 obteniéndose: x 2 -24 x + 20)
Paso 3: se ordena la expresión por términos semejantes, obteniéndose:
3 x 2 + 4 x 2 -18 x -24 x + 15 + 20
Paso 4: se suman los términos semejantes, obteniéndose:
7 x 2 -42 x + 35
¿En cuál de los pasos se cometió el error?',
  alternativas = '[{"letra":"A","texto":"En el Paso 1","es_correcta":false},{"letra":"B","texto":"En el Paso 2","es_correcta":true},{"letra":"C","texto":"En el Paso 3","es_correcta":false},{"letra":"D","texto":"En el Paso 4","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-25';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál de las siguientes expresiones representa a “el doble del cubo de un
número x, disminuido en un tercio del mismo número”?',
  alternativas = '[{"letra":"A","texto":"(2 x) 3 -x 3","es_correcta":false},{"letra":"B","texto":"2 x 3 -1 3","es_correcta":false},{"letra":"C","texto":"2 ( ( ( x 3 -1 3 ) ) )","es_correcta":false},{"letra":"D","texto":"2 x 3 -x 3","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-26';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál de las siguientes expresiones es igual a -y -2(y -2)2?',
  alternativas = '[{"letra":"A","texto":"-3 y -4","es_correcta":false},{"letra":"B","texto":"-2 y 2 -y -4","es_correcta":false},{"letra":"C","texto":"-2 y 2 -y + 8","es_correcta":false},{"letra":"D","texto":"-2 y 2 + 7 y -8","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-27';

UPDATE public.preguntas
SET
  enunciado = 'Una receta indica usar 325 gramos de harina, entre otros ingredientes, para hacer
20 galletas.
Si se sigue esa receta, ¿cuál de las siguientes fórmulas permite determinar la
cantidad de gramos de harina que se necesitan para hacer n galletas?',
  alternativas = '[{"letra":"A","texto":"325 20 · n","es_correcta":true},{"letra":"B","texto":"325 · n","es_correcta":false},{"letra":"C","texto":"325 + n","es_correcta":false},{"letra":"D","texto":"325 20 · n","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-28';

UPDATE public.preguntas
SET
  enunciado = 'En una tienda de perfumería empacan jabones en cajas. En la figura adjunta se
representa la relación entre la cantidad de jabones y la cantidad de cajas que se
necesitan para empacar dicha cantidad de jabones.
Si esta relación se puede modelar mediante la función f definida por
(f x) = 20 · x, ¿qué representa el número 20?',
  alternativas = '[{"letra":"A","texto":"La constante de proporcionalidad directa.","es_correcta":true},{"letra":"B","texto":"La constante de proporcionalidad inversa.","es_correcta":false},{"letra":"C","texto":"La cantidad total de jabones.","es_correcta":false},{"letra":"D","texto":"La cantidad total de cajas.","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-29';

UPDATE public.preguntas
SET
  enunciado = 'En una frutería se llenan cajas de dos tipos. Un tipo de caja, cuando está llena de
fruta, pesa M kg y el otro tipo de caja, cuando está llena de fruta, pesa P kg. La
capacidad del camión donde se llevarán las cajas no puede superar los 2 100 kg.
Se sabe que la cantidad de cajas de los dos tipos que se colocarán en el camión es
la misma.
¿Cuál de las siguientes inecuaciones permite determinar la cantidad máxima de
cajas x de cada tipo que se pueden colocar en el camión?',
  alternativas = '[{"letra":"A","texto":"(M + P) · x \\le  2 100","es_correcta":true},{"letra":"B","texto":"M + P + x \\le  2 100","es_correcta":false},{"letra":"C","texto":"(M + P) · x < 2 100","es_correcta":false},{"letra":"D","texto":"(M + P) · 2 x < 2 100","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-31';

UPDATE public.preguntas
SET
  enunciado = 'En la tabla adjunta se indica la temperatura que alcanza cierto líquido en
determinado tiempo, a partir de los 0 ° C.
Temperatura(° C) Tiempo (min)
100 8
50 4
Si la temperatura alcanzada por el líquido es directamente proporcional al
tiempo que ha sido calentado, en ese orden, ¿cuál es la constante de
proporcionalidad?',
  alternativas = '[{"letra":"A","texto":"25 2","es_correcta":false},{"letra":"B","texto":"25 2","es_correcta":true},{"letra":"C","texto":"50","es_correcta":false},{"letra":"D","texto":"400","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-33';

UPDATE public.preguntas
SET
  enunciado = 'En la figura adjunta se presentan las medidas de tres segmentos con los que,
para algún valor de x, se puede construir un triángulo rectángulo.
(2x + 15) cm x cm
(2x + 10) cm
¿Cuál de las siguientes ecuaciones permite calcular el valor de x?',
  alternativas = '[{"letra":"A","texto":"x2 + 20 x + 125 = 0","es_correcta":false},{"letra":"B","texto":"7 x 2 + 100 x + 325 = 0","es_correcta":false},{"letra":"C","texto":"9 x 2 + 100 x + 325 = 0","es_correcta":false},{"letra":"D","texto":"x2 -20 x -125 = 0","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-36';

UPDATE public.preguntas
SET
  enunciado = 'Una psicóloga considera la función f definida por f() x = 30 000 x como su modelo
de f() x cobro es el por total paciente, mensual tal que que cobra x es por la ellas, cantidad en pesos. de sesiones que tuvo en un mes y
La psicóloga quiere hacer un ajuste a su modelo de cobro, considerando una tarifa
fija inicial y una tarifa por sesión de manera que la primera sesión del mes tenga el
mismo valor que en el modelo anterior, pero que el resto de las sesiones del mes
tengan un valor de un 20 % más económico que en el modelo anterior.
¿Cuál de las siguientes funciones es el nuevo modelo de cobro de la psicóloga?',
  alternativas = '[{"letra":"A","texto":"g() x = 24 000 x","es_correcta":false},{"letra":"B","texto":"h() x = 24 000 x + 6000","es_correcta":true},{"letra":"C","texto":"p() x = 18 000 x + 12 000","es_correcta":false},{"letra":"D","texto":"r() x = 12 000 x + 18 000","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-38';

UPDATE public.preguntas
SET
  enunciado = 'En una empresa lechera, el costo, en pesos, de procesar x litros de leche se
modela mediante la función f definida por (f x) = 300 x + 500. La empresa
encontró una forma de reducir ese costo un 25 %.
¿Cuál de las siguientes funciones modela el nuevo costo, en pesos?',
  alternativas = '[{"letra":"A","texto":"m(x) = 300 x + 475","es_correcta":false},{"letra":"B","texto":"g(x) = 225 x + 500","es_correcta":false},{"letra":"C","texto":"h(x) = 225 x + 375","es_correcta":true},{"letra":"D","texto":"(p x) = 75 x + 475","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-39';

UPDATE public.preguntas
SET
  enunciado = 'Considera la función f definida por f() n = 10 + 25 n -5 n 2, tal que n es un
número real.
¿Cuál es el valor de f() 1 + f() 2 + f() 3 + f() 4?',
  alternativas = '[{"letra":"A","texto":"120","es_correcta":false},{"letra":"B","texto":"140","es_correcta":true},{"letra":"C","texto":"195","es_correcta":false},{"letra":"D","texto":"440","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-40';

UPDATE public.preguntas
SET
  enunciado = 'La altura que alcanza el salto de un tipo de grillo puede representarse por medio
de la siguiente parábola:
Altura (cm)
40
30
20
10
0,5 1 1,5 2 Tiempo (s)
¿Cuál de las siguientes afirmaciones se puede deducir del gráfico?',
  alternativas = '[{"letra":"A","texto":"En 0,75 s, el grillo está a 30 cm de altura.","es_correcta":false},{"letra":"B","texto":"En 1 s, el grillo alcanza su mayor altura.","es_correcta":true},{"letra":"C","texto":"Solo a los 5,1 s, el grillo alcanza una altura de 30 cm.","es_correcta":false},{"letra":"D","texto":"A los 3 s, el grillo está bajo tierra.","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-42';

UPDATE public.preguntas
SET
  enunciado = 'Una reclinar fábrica hasta hace en un sillas ángulo de de escritorio 135 °, tal de como distinto se representa tamaño, las en la cuales figura se adjunta. pueden
A
O B
Para la distancia cualquier entre tamaño A y B de(silla, D AB) ¿cuál de manera de las que siguientes el respaldo fórmulas quede permite perpendicular determinar al
asiento?',
  alternativas = '[{"letra":"A","texto":"DAB = AO + BO","es_correcta":false},{"letra":"B","texto":"D AB = AO 2 + BO 2","es_correcta":true},{"letra":"C","texto":"D AB = 2 AO 2","es_correcta":false},{"letra":"D","texto":"D AB = 2 AO 2 -BO","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-44';

UPDATE public.preguntas
SET
  enunciado = 'Considera los vectores en el plano cartesiano F1 =(2, -)1, F2 =(-,3 2),
F3 =(a, b) y F 4 =(,4)3.
Si F 1 + F 2 + F 3 + F 4 =(6, 5), ¿cuál es el valor de a y b respectivamente?',
  alternativas = '[{"letra":"A","texto":"3 y 4","es_correcta":false},{"letra":"B","texto":"3 y 9","es_correcta":false},{"letra":"C","texto":"3 y 1","es_correcta":true},{"letra":"D","texto":"4 y 4","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-49';

UPDATE public.preguntas
SET
  enunciado = 'En vectores la figura uρ, vρ adjunta y wρ. se presentan los puntos A(1, 1), B(4, 2) y C(5, -1), y los
Y
A uρ B
wρ vρ
X
C
¿Cuál de las siguientes condiciones permite asegurar que el triángulo ABC es
rectángulo?',
  alternativas = '[{"letra":"A","texto":"Que el vector wρ es la suma de los vectores uρ y vρ.","es_correcta":false},{"letra":"B","texto":"Que el perímetro del triángulo ABC es igual a 20 + 2 10.","es_correcta":false},{"letra":"C","texto":"Que los módulos de los vectores uρ y vρ son iguales.","es_correcta":false},{"letra":"D","texto":"Que el área del triángulo ABC es igual a AB· 2 BC.","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-50';

UPDATE public.preguntas
SET
  enunciado = 'Una transformaciones persona lleva isométricas a cabo consecutivas los siguientes al punto (pasos -,5 5), para cometiendo realizar un error. cuatro
Paso 1: el(,0 punto 7).(-,5 5) se traslada según el vector (5, -2), obteniendo el punto
Paso 2: el y en punto sentido(,0 7 horario,) se rota obteniendo en 90 ° con el centro punto en(,7)0 el. origen del plano cartesiano
Paso 3: el(-punto ,7 0).(,7)0 se refleja con respecto al eje Y, obteniendo el punto
Paso 4: el(-punto ,7 0).(-,7 0) se refleja con respecto al eje X, obteniendo el punto
¿En cuál de los pasos se cometió el error?',
  alternativas = '[{"letra":"A","texto":"En el Paso 1","es_correcta":true},{"letra":"B","texto":"En el Paso 2","es_correcta":false},{"letra":"C","texto":"En el Paso 3","es_correcta":false},{"letra":"D","texto":"En el Paso 4","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-52';

UPDATE public.preguntas
SET
  enunciado = 'Para llegar a la casa de Diego, Juan desde su casa debe caminar 2 cuadras hacia
el este y 5 cuadras hacia el sur. Luego, para llegar a la casa de Pedro, desde la
casa de Diego, Juan debe caminar una cuadra hacia el este y una cuadra hacia el
sur. Considera que todas las cuadras son del mismo tamaño.
Se grafica en un plano cartesiano el recorrido realizado, considerando la casa de
Juan en el punto de origen del plano cartesiano, como el que se representa en la
figura adjunta. Norte (eje Y)
Oeste Este (eje X)
Sur
En el gráfico realizado en el plano cartesiano, ¿cuál de los siguientes es el vector
de traslación que permite trasladarse de la casa de Juan a la casa de Pedro?',
  alternativas = '[{"letra":"A","texto":"(-,3 -6)","es_correcta":false},{"letra":"B","texto":"(-,3 6)","es_correcta":false},{"letra":"C","texto":"(3, -6)","es_correcta":true},{"letra":"D","texto":"(3, 6)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-53';

UPDATE public.preguntas
SET
  enunciado = 'Una empresa realiza una investigación sobre los sueldos de las personas de las
distintas áreas que esta empresa tiene, y agrupa la información en el siguiente
histograma, en el que los sueldos están en millones de pesos.
Frecuencia
7
5
2
1
[ ,1 2 [ [ ,2 [3 [ ,3 4 [ [ ,4 5 [
Sueldo de las personas de distintas áreas
¿Cuál de las siguientes tablas representa los sueldos de las personas de la
empresa, en millones de pesos?',
  alternativas = '[{"letra":"A","texto":"Sueldos Frecuencia B) Sueldos Frecuencia 1,5 7 [1, 2[ 7 25,12 [2, 3[ 12 35,14 [3, 4[ 14 45,15 [4, 5[ 15","es_correcta":false},{"letra":"B","texto":"Opción B (ver figura)","es_correcta":false},{"letra":"C","texto":"D) Sueldos Frecuencia Sueldos Frecuencia [1, 2[ 7 1,5 7 [2, 3[ 5 2,5 5 [3, 4[ 2 3,5 2 [4, 5[ 1 4,5 1","es_correcta":true},{"letra":"D","texto":"Opción D (ver figura)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-55';

UPDATE public.preguntas
SET
  enunciado = 'A una reunión internacional asistirán personas que hablan francés, inglés y
español. Se sabe que, del total de ellas, seis solo hablan francés, diez solo hablan
inglés, tres personas hablan los tres idiomas y se encargarán de ser los
traductores.
Si se considera a x como la cantidad de personas que solo hablan español y no
hay personas que hablen dos idiomas, ¿cuál de las siguientes expresiones permite
calcular la probabilidad de que al elegir a una persona al azar esta hable español?',
  alternativas = '[{"letra":"A","texto":"19 x + x","es_correcta":false},{"letra":"B","texto":"x 1 + 3","es_correcta":false},{"letra":"C","texto":"x 19 + 3","es_correcta":false},{"letra":"D","texto":"x x + + 19 3","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-24reg-64';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál es el resultado de ( (( 8 3: -16 6 ) )) -8 3?',
  alternativas = '[{"letra":"A","texto":"-11 3","es_correcta":true},{"letra":"B","texto":"-3","es_correcta":false},{"letra":"C","texto":"11 3","es_correcta":false},{"letra":"D","texto":"3","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-03';

UPDATE public.preguntas
SET
  enunciado = 'En la siguiente infografía se presenta el pronóstico del tiempo para cierto día,
con la temperatura en grados Celsius.
¿Cuál será la variación de temperatura entre las 17:00 y las 21:00 horas?',
  alternativas = '[{"letra":"A","texto":"-6 ° C","es_correcta":false},{"letra":"B","texto":"-5 ° C","es_correcta":true},{"letra":"C","texto":"4 ° C","es_correcta":false},{"letra":"D","texto":"6 ° C","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-07';

UPDATE public.preguntas
SET
  enunciado = 'Una persona compró tres cuartos kilogramos de paltas, un kilogramo y medio de
naranjas y medio kilogramo de duraznos. Los precios se presentan a
continuación:
¿Cuál de las siguientes expresiones representa lo que gastó la persona en
paltas, naranjas y duraznos?',
  alternativas = '[{"letra":"A","texto":"0,75 ·$5.000 + 2,1 ·$1.100 + 2,0 ·$1.300","es_correcta":false},{"letra":"B","texto":"0,75 ·$5.000 + 5,1 ·$1.100 + 5,0 ·$1.300","es_correcta":true},{"letra":"C","texto":"4,3 ·$5.000 + 2,1 ·$1.100 + 2,0 ·$1.300","es_correcta":false},{"letra":"D","texto":"4,3 ·$5.000 + 5,1 ·$1.100 + 5,0 ·$1.300","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-09';

UPDATE public.preguntas
SET
  enunciado = 'Para transformar una distancia medida en millas a centímetros, se utiliza la
siguiente ecuación:
C = 160 934 · x,
tal que x es la distancia en millas y C es el equivalente en centímetros.
Si un kilómetro es equivalente a 100 000 centímetros, ¿cuántos kilómetros son
dos millas?',
  alternativas = '[{"letra":"A","texto":"32 1 86 800 000 kilómetros","es_correcta":false},{"letra":"B","texto":"80 467 kilómetros","es_correcta":false},{"letra":"C","texto":"3,21868 kilómetros","es_correcta":true},{"letra":"D","texto":"0,80467 kilómetros","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-11';

UPDATE public.preguntas
SET
  enunciado = 'En la siguiente infografía se presentan los porcentajes de los distintos tipos de
agua que hay en la Tierra.
FUENTE: FAO | ONU
Adaptado de Carrión, M (s. f.). ¿Cuánta agua hay en el mundo? El Ágora diario del agua.
¿Cuál de las siguientes afirmaciones es verdadera?',
  alternativas = '[{"letra":"A","texto":"Un 69 7, % del agua en el planeta está en los glaciares.","es_correcta":false},{"letra":"B","texto":"La mayor reserva de agua dulce en el planeta se encuentra en los glaciares.","es_correcta":true},{"letra":"C","texto":"Para determinar el porcentaje de agua que consume el ser humano de los ríos, se debe realizar la operación 0,007 · 3,0.","es_correcta":false},{"letra":"D","texto":"Hay más agua disponible en glaciares y acuíferos, en conjunto, que agua salada.","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-14';

UPDATE public.preguntas
SET
  enunciado = 'Según un estudio, la cantidad C de individuos de cierta población se modela
mediante la expresión C = 2000 · t1,1, tal que t es la cantidad de horas
transcurridas desde que comenzó el estudio.
¿En qué porcentaje aumenta la población de individuos cada hora?',
  alternativas = '[{"letra":"A","texto":"En un 1 %","es_correcta":false},{"letra":"B","texto":"En un 1,1 %","es_correcta":false},{"letra":"C","texto":"En un 10 %","es_correcta":true},{"letra":"D","texto":"En un 11 %","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-18';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál es el valor de 1 0 + 2 3?',
  alternativas = '[{"letra":"A","texto":"9","es_correcta":true},{"letra":"B","texto":"8","es_correcta":false},{"letra":"C","texto":"7","es_correcta":false},{"letra":"D","texto":"6","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-19';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál de las siguientes expresiones representa una descomposición del número
12 056?',
  alternativas = '[{"letra":"A","texto":"1 · 10 3 + 2 · 10 2 + 5 · 10 1 + 6 · 10 0","es_correcta":false},{"letra":"B","texto":"1 · 10 4 + 2 · 10 3 + 5 · 10 2 + 6 · 10 1","es_correcta":false},{"letra":"C","texto":"1 · 10 4 + 2 · 10 3 + 5 · 10 1 + 6 · 10 0","es_correcta":true},{"letra":"D","texto":"1 · 10 5 + 2 · 10 4 + 5 · 10 2 + 6 · 10 1","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-20';

UPDATE public.preguntas
SET
  enunciado = 'Los datos de la tabla adjunta permiten calcular la edad equivalente de un perro
de tamaño mediano con la edad de un ser humano.
Edad real de un perro de Su edad equivalente a
tamaño mediano en años un ser humano en años
05,10
1 18
2 27
3 33
4 39
5 45
6 51
7 57
8 63
9 69
10 75
11 80
12 85
Sultán es un perro de tamaño mediano que llegó a una familia cuando este tenía
6 meses de vida, esta familia lo tiene a su cuidado hace 5 años.
¿Cuál será la edad equivalente a un ser humano de Sultán dentro de dos años y
medio?',
  alternativas = '[{"letra":"A","texto":"45 años","es_correcta":false},{"letra":"B","texto":"60 años","es_correcta":false},{"letra":"C","texto":"63 años","es_correcta":true},{"letra":"D","texto":"85 años","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-21';

UPDATE public.preguntas
SET
  enunciado = 'Una constructora tiene un plan de construcción a cuatro años.
La jefatura del proyecto de esta constructora planifica que transcurridos x años de
empezada la obra, tengan construidos 2 · 2 x edificios.
¿Cuántos edificios se tiene planificado construir en total transcurridos esos
cuatro años?',
  alternativas = '[{"letra":"A","texto":"16","es_correcta":false},{"letra":"B","texto":"32","es_correcta":true},{"letra":"C","texto":"60","es_correcta":false},{"letra":"D","texto":"256","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-23';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál de las siguientes expresiones es igual a x2 + 5 x -6?',
  alternativas = '[{"letra":"A","texto":"(x + 1)(x -6)","es_correcta":false},{"letra":"B","texto":"(x + 6)(x -)1","es_correcta":true},{"letra":"C","texto":"(x + 2)(x + 3)","es_correcta":false},{"letra":"D","texto":"(x -2)(x -3)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-24';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál de las siguientes expresiones es igual a 1 2(-b -(b -2) + 2)?',
  alternativas = '[{"letra":"A","texto":"0","es_correcta":false},{"letra":"B","texto":"2","es_correcta":false},{"letra":"C","texto":"-b","es_correcta":false},{"letra":"D","texto":"-b + 2","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-25';

UPDATE public.preguntas
SET
  enunciado = 'A un paciente de 83 kg se le debe administrar una dosis de 0,05 g de
medicamento por cada kilogramo de masa corporal.
¿Cuántos gramos de medicamento se le deben administrar al paciente?',
  alternativas = '[{"letra":"A","texto":"1,66 g","es_correcta":false},{"letra":"B","texto":"4,15 g","es_correcta":true},{"letra":"C","texto":"166 g","es_correcta":false},{"letra":"D","texto":"415 g","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-26';

UPDATE public.preguntas
SET
  enunciado = 'Una huincha utilizada en construcción tiene dos unidades de medida distintas.
A continuación se representa un trozo de esta huincha:
0 Centímetros
0
Pulgadas
Si la longitud de un objeto es x pulgadas, ¿cuál de las siguientes expresiones
representa aproximadamente su longitud en centímetros?',
  alternativas = '[{"letra":"A","texto":"1,5 2 x","es_correcta":true},{"letra":"B","texto":"1,5 2 x","es_correcta":false},{"letra":"C","texto":"x + 1,3","es_correcta":false},{"letra":"D","texto":"x -1,3","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-27';

UPDATE public.preguntas
SET
  enunciado = 'Para regular la rapidez con la que se suministra suero a un paciente, se utiliza
un dispositivo llamado bomba de infusión.
Esta rapidez r, medida en mililitros por hora ( ( ( ml h ) ) ), se modela con la expresión
r = V t, tal que V es el volumen del suero, en ml, y t es la cantidad de horas
en que se suministra la totalidad del suero.
Si la bomba de infusión se programó para administrar 600 ml de suero con una
rapidez de 1200 ml h, ¿cuánto tiempo durará ese suministro?',
  alternativas = '[{"letra":"A","texto":"5 minutos","es_correcta":false},{"letra":"B","texto":"20 minutos","es_correcta":false},{"letra":"C","texto":"30 minutos","es_correcta":true},{"letra":"D","texto":"50 minutos","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-28';

UPDATE public.preguntas
SET
  enunciado = 'La fórmula de Euler establece que para cierto tipo de poliedros se cumple la
relación C + V = A + 2, tal que C es la cantidad de caras, A es la cantidad de
aristas y V es la cantidad de vértices del poliedro.
Si un poliedro con 8 vértices y 18 aristas cumple con la fórmula de Euler,
¿cuántas caras tiene?',
  alternativas = '[{"letra":"A","texto":"12","es_correcta":true},{"letra":"B","texto":"14","es_correcta":false},{"letra":"C","texto":"24","es_correcta":false},{"letra":"D","texto":"28","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-30';

UPDATE public.preguntas
SET
  enunciado = 'En una escalera, la parte horizontal de cada escalón se llama huella y la parte
vertical se llama contrahuella, tal como se representa en la siguiente imagen:
De acuerdo con la ley de Blondel, la relación ideal entre la medida de la
huella por la ecuación H y la medida H + 2 C de = 64 la. contrahuella C, ambas en centímetros, está dada
Si la huella de una escalera mide 30 cm, ¿cuánto debe medir su contrahuella
para que cumpla la ley de Blondel?',
  alternativas = '[{"letra":"A","texto":"4 cm","es_correcta":false},{"letra":"B","texto":"8 cm","es_correcta":false},{"letra":"C","texto":"15 cm","es_correcta":false},{"letra":"D","texto":"17 cm","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-31';

UPDATE public.preguntas
SET
  enunciado = 'Cuatro personas deciden aportar con dinero a un fondo común para iniciar un
emprendimiento. En el siguiente gráfico se representa la distribución de lo
aportado por cada una.
Si lo aportado por las cuatro personas se representa por x y Carla aportó
$150.000, ¿cuál de las siguientes ecuaciones tiene como solución el total del
dinero aportado al fondo?',
  alternativas = '[{"letra":"A","texto":"1 2 x + 1 4 x + 10 1 x + 20 3 x = 150 000","es_correcta":false},{"letra":"B","texto":"1 2 + 1 4 + 10 1 + 150 000 · 20 3 = x","es_correcta":false},{"letra":"C","texto":"1 2 x + 1 4 x + 10 1 x + 150 000 = x","es_correcta":true},{"letra":"D","texto":"1 2 + 1 4 + 10 1 + 150 000 = x","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-33';

UPDATE public.preguntas
SET
  enunciado = 'El rendimiento de un vehículo se calcula como la razón entre los kilómetros
recorridos y la cantidad de litros de bencina consumidos para recorrerlos, y se
expresa en kilómetros por litro ( ( ( km L ) ) ).
En el siguiente gráfico se representa la cantidad de kilómetros recorridos por cuatro
vehículos V 1, V 2, V 3 y V 4 en función de la cantidad de litros de bencina que
consumen para recorrerlos.
¿Cuál de los vehículos tiene mayor rendimiento?',
  alternativas = '[{"letra":"A","texto":"V 1","es_correcta":true},{"letra":"B","texto":"V 2","es_correcta":false},{"letra":"C","texto":"V 3","es_correcta":false},{"letra":"D","texto":"V 4","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-35';

UPDATE public.preguntas
SET
  enunciado = 'Gola y Colón son empresas de gasfitería que tienen distintas modalidades para
cobrar por sus trabajos.
Gola cobra a sus clientes diez mil pesos por visita domiciliaria más quince mil
por f() t = hora, 10 000 lo + 15 cual 000 t, se tal que puede t corresponde modelar por a la cantidad la función de horas determinada trabajadas. por
Colón cobra un 30 % menos por visita domiciliaria y un 20 % más por hora en
relación con lo que cobra Gola.
¿Cuál de las siguientes funciones modela el cobro que realiza Colón por su
trabajo, en términos de la cantidad t de horas trabajadas?',
  alternativas = '[{"letra":"A","texto":"k() t = 9990 + 15 000 t","es_correcta":false},{"letra":"B","texto":"g() t = 9970 + 15 020 t","es_correcta":false},{"letra":"C","texto":"h() t = 7000 + 18 000 t","es_correcta":true},{"letra":"D","texto":"j() t = 12 000 + 10 500 t","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-39';

UPDATE public.preguntas
SET
  enunciado = 'Dos estacionamientos cobran en función de la cantidad x de minutos que un
vehículo permanece estacionado.
Para calcular el cobro por estacionar, en pesos, se utilizan las siguientes
funciones:
Estacionamiento Estacionamiento 1: 2: f g()() x x = = 1000 p + 15 + x 25 x
¿Cuál es el valor de p, considerando que ambos estacionamientos cobran lo
mismo por 60 minutos de uso?',
  alternativas = '[{"letra":"A","texto":"94","es_correcta":false},{"letra":"B","texto":"400","es_correcta":false},{"letra":"C","texto":"1600","es_correcta":true},{"letra":"D","texto":"2500","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-40';

UPDATE public.preguntas
SET
  enunciado = 'Una persona dispone de$12.000 en monedas de$100 y$500, y en total tiene
36 monedas.
Para saber cuántas monedas tiene de cada tipo, efectúa el siguiente desarrollo,
cometiendo un error.
Paso 1: considera que x es la cantidad de monedas de$100 e y es la cantidad
de monedas de$500, planteando el siguiente sistema de ecuaciones:
100x + 500y = 12 000
x + y = 36
Paso 2: multiplica la segunda ecuación por -100, obteniendo
100x + 500y = 12 000
-100x + 100y = -3600
y luego suma hacia abajo las ecuaciones, obteniendo y = 14.
Paso 3: reemplaza el resultado anterior en la ecuación x + y = 36, obteniendo
x = 22.
Paso 4: por último, concluye que tiene 14 monedas de$500 y 22 monedas de
$100.
¿En cuál de los pasos se cometió el error?',
  alternativas = '[{"letra":"A","texto":"En el Paso 1","es_correcta":false},{"letra":"B","texto":"En el Paso 2","es_correcta":true},{"letra":"C","texto":"En el Paso 3","es_correcta":false},{"letra":"D","texto":"En el Paso 4","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-41';

UPDATE public.preguntas
SET
  enunciado = 'Una fábrica de juegos para niños crea figuras para adornar casas de juguete.
En esta empresa tienen un mismo modelo de camas con respaldo, compuesto por
dos paralelepípedos rectos, pero con distintas dimensiones dependiendo del alto
de la cama, como se representa a continuación:
¿Cuál de las siguientes expresiones permite determinar el volumen de este modelo
de cama, dependiendo de la altura x que tenga dicha cama?',
  alternativas = '[{"letra":"A","texto":"(x · 2 x · 2 x + x · 2 x · 5,1 x) 3 cm","es_correcta":true},{"letra":"B","texto":"2 x · 2 x · 5,1 x 3 cm","es_correcta":false},{"letra":"C","texto":"2 x · 2 x · x 3 cm","es_correcta":false},{"letra":"D","texto":"(3 x · 2 x · x + x · 2 x · 5,1 x) 3 cm","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-45';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál es el perímetro de un triángulo rectángulo isósceles de área 72 2 cm?',
  alternativas = '[{"letra":"A","texto":"(2 72 + 144)cm","es_correcta":false},{"letra":"B","texto":"(24 + 12 2)cm","es_correcta":true},{"letra":"C","texto":"(2 144 + 288)cm","es_correcta":false},{"letra":"D","texto":"(2 72 + 144)cm","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-49';

UPDATE public.preguntas
SET
  enunciado = 'Considera el punto C(1, -2) correspondiente a un vértice de un cuadrilátero
dibujado(-,5 -3). en un plano cartesiano, el cual será trasladado según el vector
¿Cuáles son las coordenadas de la imagen del punto C?',
  alternativas = '[{"letra":"A","texto":"(,6)1","es_correcta":false},{"letra":"B","texto":"(-,6 -)1","es_correcta":false},{"letra":"C","texto":"(-,4 -5)","es_correcta":true},{"letra":"D","texto":"(-,5 6)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-52';

UPDATE public.preguntas
SET
  enunciado = 'En la cuadrícula adjunta se dibuja la circunferencia T de radio 1 unidad con centro
en C(-,1 -2), la cual se traslada según el vector v =(3, 4), y luego se refleja con
respecto al eje Y, obteniéndose la circunferencia R.
¿Cuál de los siguientes puntos pertenece a la circunferencia R?',
  alternativas = '[{"letra":"A","texto":"(3, -2)","es_correcta":false},{"letra":"B","texto":"(-,2 3)","es_correcta":true},{"letra":"C","texto":"(,2)1","es_correcta":false},{"letra":"D","texto":"(-,3 0)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-53';

UPDATE public.preguntas
SET
  enunciado = 'En una oficina en la que se atiende público se tiene como política que, si una
persona espera 30 minutos o más para que la atiendan, se le entregará una
atención personalizada.
Para evaluar la política, cierto día se registró el tiempo que tuvieron que esperar
las personas atendidas en esa oficina y se resumió en la siguiente tabla:
Tiempo de espera Cantidad de
en minutos personas
[ 0,10 [ 3
[ 10, 20 [ 9
[ 20, 30 [ 11
[ 30, 40 [ 12
[ 40, 50 [ 7
[ 50, 60 [ 4
[ 60, 70 ] 4
¿Cuántas personas recibieron atención personalizada ese día?',
  alternativas = '[{"letra":"A","texto":"11","es_correcta":false},{"letra":"B","texto":"12","es_correcta":false},{"letra":"C","texto":"27","es_correcta":true},{"letra":"D","texto":"38","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-55';

UPDATE public.preguntas
SET
  enunciado = 'En un grupo de datos, la desviación de un dato se calcula como x -p, tal que
x es el dato y p es el promedio de los datos del grupo.
Considera los datos 3,01; 3,01; 2,98; 2,97 y 3, cuyo promedio es 2,994.
Si se calcula la desviación a cada uno de estos cinco datos, ¿cuál sería su
mediana?',
  alternativas = '[{"letra":"A","texto":"-0,006","es_correcta":false},{"letra":"B","texto":"-0,001","es_correcta":false},{"letra":"C","texto":"0,001","es_correcta":false},{"letra":"D","texto":"0,006","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-60';

UPDATE public.preguntas
SET
  enunciado = 'En la tabla adjunta se presenta la distribución de los participantes en los talleres
que ofrece una municipalidad.
Talleres Pintura al óleo Diseño Web Repostería Zumba
Cantidad de personas 20 18 x 26
Se sabe que al escoger al azar a una persona de los talleres, la probabilidad de
que esta participe en el taller de pintura al óleo es 0,25.
¿Cuál es la cantidad de personas que participa en el taller de repostería?',
  alternativas = '[{"letra":"A","texto":"48","es_correcta":false},{"letra":"B","texto":"32","es_correcta":false},{"letra":"C","texto":"16","es_correcta":true},{"letra":"D","texto":"4","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25inv-63';

UPDATE public.preguntas
SET
  enunciado = 'Considera la siguiente recta numérica:
-1 0 1
¿Cuál de los siguientes procedimientos representa la operación -5 +(-8)
usando la recta numérica?',
  alternativas = '[{"letra":"A","texto":"Ubicarse en el -5 y desplazarse 8 unidades a la izquierda.","es_correcta":true},{"letra":"B","texto":"Ubicarse en el -5 y desplazarse 8 unidades a la derecha.","es_correcta":false},{"letra":"C","texto":"Ubicarse en el -8 y desplazarse 5 unidades a la derecha.","es_correcta":false},{"letra":"D","texto":"Ubicarse en el -8 y desplazarse 3 unidades a la derecha.","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-02';

UPDATE public.preguntas
SET
  enunciado = 'Para encontrar el resultado de ( (( 5 4 ·(4 · 3 -6) ) )): ( (( 5 3 ·(12 -2 · 4))) ), se realiza el
siguiente procedimiento, cometiéndose un error.
Paso 1: se resuelven las operaciones de los paréntesis internos, obteniéndose
( (( 5 4 ·(-12) ) )): ( (( 5 3 · 40 ) )).
Paso 2: se resuelven las multiplicaciones, obteniéndose -48 5: 200 3.
Paso 3: se resuelve la división como -48 5 · 200 3.
Paso 4: se resuelve la multiplicación, obteniéndose -125 18.
¿En cuál de los pasos se cometió el error?',
  alternativas = '[{"letra":"A","texto":"En el Paso 1","es_correcta":true},{"letra":"B","texto":"En el Paso 2","es_correcta":false},{"letra":"C","texto":"En el Paso 3","es_correcta":false},{"letra":"D","texto":"En el Paso 4","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-03';

UPDATE public.preguntas
SET
  enunciado = 'Para conocer el equivalente en centímetros de una distancia medida en millas,
se utiliza el siguiente modelo:
C = 160 934 · x,
tal que x es la distancia en millas y C es el equivalente en centímetros.
Si un kilómetro es equivalente a 100 000 centímetros, ¿cuál de las siguientes
igualdades representa la equivalencia en kilómetros k de una distancia de
x millas?',
  alternativas = '[{"letra":"A","texto":"k = 100 160 $934.000· x","es_correcta":false},{"letra":"B","texto":"k = 160 934 · x · 100 000","es_correcta":false},{"letra":"C","texto":"k = 160 100 934 000 · x","es_correcta":true},{"letra":"D","texto":"k = 160 934 · x -100 000","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-09';

UPDATE public.preguntas
SET
  enunciado = 'Si p aumentado en su 40 % es 150, ¿cuál de las siguientes expresiones
corresponde a p?',
  alternativas = '[{"letra":"A","texto":"150 -40","es_correcta":false},{"letra":"B","texto":"100 140 · 150","es_correcta":true},{"letra":"C","texto":"150 140","es_correcta":false},{"letra":"D","texto":"150 -100 40","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-13';

UPDATE public.preguntas
SET
  enunciado = 'Una tienda ofrece un 20 % de descuento en el precio por la compra de
cualquier camisa. Una persona quiere comprar tres camisas que tienen un valor
de$30.000 cada una sin descuento.
¿Cuál de las siguientes expresiones representa el valor total que pagará
la persona?',
  alternativas = '[{"letra":"A","texto":"$( (( 3 · 30 000 · 100 20 ) ))","es_correcta":false},{"letra":"B","texto":"$( (( 3 · 30 000 · 100 80 ) ))","es_correcta":true},{"letra":"C","texto":"$( (( 3 · 30 000 · 100 60 ) ))","es_correcta":false},{"letra":"D","texto":"$( (( 3 · 30 000 · 100 40 ) ))","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-17';

UPDATE public.preguntas
SET
  enunciado = 'Si(x + 5) · P = x 2 -x -30, con x \ne  -5, ¿cuál de las siguientes expresiones es
igual a P?',
  alternativas = '[{"letra":"A","texto":"x -35","es_correcta":false},{"letra":"B","texto":"x2 -6","es_correcta":false},{"letra":"C","texto":"x + 6","es_correcta":false},{"letra":"D","texto":"x -6","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-24';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál de las siguientes expresiones es igual a b -3(b -)1?',
  alternativas = '[{"letra":"A","texto":"-2 b + 3","es_correcta":true},{"letra":"B","texto":"-2 b -1","es_correcta":false},{"letra":"C","texto":"-2 b + 1","es_correcta":false},{"letra":"D","texto":"-2 b -3","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-25';

UPDATE public.preguntas
SET
  enunciado = 'Una persona compró 20 kg de naranjas en$16.000 y 20 kg de manzanas
en$18.000.
Si la cantidad de kilogramos de frutas y su precio se modelan por medio de una
relación lineal, ¿cuál de las siguientes expresiones representa el precio total,
en pesos, al comprar x kg de cada fruta?',
  alternativas = '[{"letra":"A","texto":"( (( 16 20 000 + 18 20 000 ) )) · x","es_correcta":true},{"letra":"B","texto":"( (( 20 · 16 x 000 + 20 · 18 x 000 ) ))","es_correcta":false},{"letra":"C","texto":"(16 000 · x + 18 000 · x)","es_correcta":false},{"letra":"D","texto":"( ( ( 16 000 + x 18 000 ) ) )","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-26';

UPDATE public.preguntas
SET
  enunciado = 'Una persona va a comprar 18 yogures y el precio de cada uno es$M. Para ello
lleva un monto de$P, el cual es suficiente para comprar.
¿Cuál de las siguientes expresiones corresponde al dinero que le sobra?',
  alternativas = '[{"letra":"A","texto":"$(P -18 · M)","es_correcta":true},{"letra":"B","texto":"$( (( 18 P · M ) ))","es_correcta":false},{"letra":"C","texto":"$(P -M)","es_correcta":false},{"letra":"D","texto":"$( (( P M -18 ) ))","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-27';

UPDATE public.preguntas
SET
  enunciado = 'Para una fiesta se compraron tres botellas de jugo del mismo precio y
tres botellas de bebidas del mismo precio, gastándose en total$16 770.
Una botella de bebida es$390 más cara que una botella de jugo.
¿Cuál de las siguientes ecuaciones permite determinar el precio x de una
botella de jugo, en pesos?',
  alternativas = '[{"letra":"A","texto":"3 x + 390 = 16 770","es_correcta":false},{"letra":"B","texto":"6 x + 390 = 16 770","es_correcta":false},{"letra":"C","texto":"3 x + 3(x + 390) = 16 770","es_correcta":true},{"letra":"D","texto":"3 x + 3(x -390) = 16 770","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-31';

UPDATE public.preguntas
SET
  enunciado = 'La figura adjunta corresponde a una representación del triángulo de Pascal.
En esta representación, el número en cada casilla blanca corresponde a la suma
de las dos casillas inmediatamente superiores.
Ejemplo
¿Cuál de las siguientes expresiones representa a x en términos de p?',
  alternativas = '[{"letra":"A","texto":"p -15","es_correcta":false},{"letra":"B","texto":"p -10","es_correcta":true},{"letra":"C","texto":"p + 10","es_correcta":false},{"letra":"D","texto":"p + 15","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-32';

UPDATE public.preguntas
SET
  enunciado = 'En un partido de básquetbol, un jugador tiene la posibilidad de hacer
anotaciones que valen dos o tres puntos, dependiendo del lugar desde el que
lanzó el balón al anotar.
Un jugador marcó 37 puntos en el último partido haciendo cinco anotaciones de
dos puntos y x anotaciones de tres puntos.
¿Cuál de las siguientes ecuaciones permite determinar la cantidad de
anotaciones de tres puntos que hizo el jugador?',
  alternativas = '[{"letra":"A","texto":"x + 5 = 37","es_correcta":false},{"letra":"B","texto":"x + 10 = 37","es_correcta":false},{"letra":"C","texto":"3 x + 5 = 37","es_correcta":false},{"letra":"D","texto":"3 x + 10 = 37","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-33';

UPDATE public.preguntas
SET
  enunciado = 'Tomás y cuatro de sus amigos van a un parque de diversiones. El parque cobra
una entrada a todos los asistentes y un gasto adicional por entrar a cierta
atracción. Tomás decide pagar el total de estos gastos y luego cobrar a cada
quien su parte. Escribe lo siguiente en el chat del grupo de amigos que fueron al
parque.
Si Tomás pagó un total de$31.000 en su visita al parque, ¿cuál de las
siguientes ecuaciones permite calcular el precio x que se pagó por cada
entrada al parque?',
  alternativas = '[{"letra":"A","texto":"4000 · 4 + 5 x = 31 000","es_correcta":true},{"letra":"B","texto":"4000 · 4 + 3 x = 31 000","es_correcta":false},{"letra":"C","texto":"4000 · 5 + 4 x = 31 000","es_correcta":false},{"letra":"D","texto":"4000 · 5 + 5 x = 31 000","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-34';

UPDATE public.preguntas
SET
  enunciado = 'La cantidad n de chirridos por minuto que emite un grillo se relaciona con la
temperatura ambiental mediante la ecuación T = 10 + ( (( n -7 40 ) )), tal que T es la
temperatura ambiental en ° C.
¿Cuántos chirridos por minuto emitirá un grillo si la temperatura ambiental es
de 20 ° C?',
  alternativas = '[{"letra":"A","texto":"8","es_correcta":false},{"letra":"B","texto":"30","es_correcta":false},{"letra":"C","texto":"110","es_correcta":true},{"letra":"D","texto":"170","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-35';

UPDATE public.preguntas
SET
  enunciado = 'Una persona vende plantas por internet a$3.500 cada una. Un mes necesita
realizar ventas por un monto superior a$500.000.
A mediados del mes, ha vendido solo 40 plantas y teme que no alcance su
meta de ventas, por lo que decide comenzar a vender las plantas a$4.500 cada
una por el resto del mes.
¿Cuál de las siguientes inecuaciones permite calcular la cantidad x de plantas
que tiene que vender la segunda mitad del mes para alcanzar su meta?',
  alternativas = '[{"letra":"A","texto":"40 · 3500 x + 4500 < 500 000","es_correcta":false},{"letra":"B","texto":"40 · 3500 x + 4500 > 500 000","es_correcta":false},{"letra":"C","texto":"40 · 3500 + 4500 x < 500 000","es_correcta":false},{"letra":"D","texto":"40 · 3500 + 4500 x > 500 000","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-36';

UPDATE public.preguntas
SET
  enunciado = 'Considera la función cuadrática f, cuyo dominio es el conjunto de los números
reales, definida por f() x = ax 2 + bx + c.
Si los coeficientes b y c son cero, ¿cuál de los siguientes gráficos podría
corresponder a la gráfica asociada a f?',
  alternativas = '[{"letra":"A","texto":"Y B) Y X X","es_correcta":false},{"letra":"B","texto":"Opción B (ver figura)","es_correcta":true},{"letra":"C","texto":"Y D) Y X X","es_correcta":false},{"letra":"D","texto":"Opción D (ver figura)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-42';

UPDATE public.preguntas
SET
  enunciado = 'Un estudiante debe rendir cuatro pruebas en un semestre, de las cuales ya tiene
tres notas, estas son 5, 6 y 4.
¿Cuál de las siguientes expresiones permite determinar el promedio que tendría
el estudiante con su cuarta nota x?',
  alternativas = '[{"letra":"A","texto":"15 4 + x","es_correcta":true},{"letra":"B","texto":"15 2 + x","es_correcta":false},{"letra":"C","texto":"5 + 2 x","es_correcta":false},{"letra":"D","texto":"15 3 + x","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-44';

UPDATE public.preguntas
SET
  enunciado = 'En la tabla adjunta se presentan los resultados obtenidos al consultar a un grupo
de personas sobre la preferencia de estudiar una de las cuatro carreras
profesionales propuestas, tal que cada persona escogió solo una carrera.
Carrera profesional Frecuencia
Ingeniería civil 900
Periodismo 300
Medicina 700
Enfermería 400
Si se escoge a una de estas personas al azar, ¿cuál de las siguientes
expresiones permite determinar la probabilidad de que esta prefiera una carrera
del área de la salud?',
  alternativas = '[{"letra":"A","texto":"Frecuencia medicina 1100 + Frecuencia enfermería","es_correcta":false},{"letra":"B","texto":"Frecuencia medicina 2300 + Frecuencia enfermería","es_correcta":true},{"letra":"C","texto":"1 -Frecuencia medicina 2300 + Frecuencia enfermería","es_correcta":false},{"letra":"D","texto":"1 -Frecuencia medicina 1100 + Frecuencia enfermería","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-52';

UPDATE public.preguntas
SET
  enunciado = 'El Fondo Nacional de Salud (Fonasa) es un tipo de previsión de salud, junto con
las Isapres y otras instituciones.
Las personas solo pueden tener un tipo de previsión y las que tienen Fonasa se
categorizan en los tramos A, B, C y D, según su nivel socioeconómico.
En los gráficos adjuntos se presenta la distribución de la población de acuerdo
con los tipos de previsión y la distribución de la población con Fonasa en los
distintos tramos en 2021.
Adaptado de: Fonasa (2022). Cuenta Pública Participativa 2022.
Si se escogía al azar a una persona de la población nacional en 2021, ¿cuál es
la probabilidad de que hubiera estado clasificada en el tramo A de Fonasa?',
  alternativas = '[{"letra":"A","texto":"0,154","es_correcta":true},{"letra":"B","texto":"2,0","es_correcta":false},{"letra":"C","texto":"0,25","es_correcta":false},{"letra":"D","texto":"0,97","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-55';

UPDATE public.preguntas
SET
  enunciado = 'Una empresa de repostería usa un diseño de bandejas desmontables de forma
circular que se apilan una sobre otra para ir colocando diferentes dulces, tal
como se representa en la figura adjunta.
Primer piso
Para determinar el diámetro de la bandeja que va ubicada en el piso k, la
empresa usa la expresión ( (( ( 1 -2(k n --1 1) ) )) ) · p, tal que n representa la cantidad
de bandejas desmontables que se usarán y p es el diámetro de la bandeja del
primer piso, en centímetros.
La empresa tiene que preparar un diseño de cinco pisos tal que el diámetro de
la bandeja del primer piso mida 40 cm.
¿Cuál será el área de la bandeja del tercer piso donde irán los dulces?',
  alternativas = '[{"letra":"A","texto":"225\\pi  2 cm","es_correcta":true},{"letra":"B","texto":"240\\pi  2 cm","es_correcta":false},{"letra":"C","texto":"300\\pi  2 cm","es_correcta":false},{"letra":"D","texto":"900\\pi  2 cm","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-57';

UPDATE public.preguntas
SET
  enunciado = 'Considera un perfil rectangular de 6 m de largo hecho de aluminio de 8,4 mm
de grosor, tal como el que se representa a continuación:
¿Por cuál de los siguientes números hay que multiplicar el largo del perfil, en
mm, para obtener la cantidad de aluminio necesaria para confeccionar uno de
estos perfiles, en 3 mm?',
  alternativas = '[{"letra":"A","texto":"101 6, · 50 8, -(101 6, -8,4)(50 8, -8,4)","es_correcta":false},{"letra":"B","texto":"101 6, · 50 8, -(101 6, -8,4)(50 8, -2 · 8,4)","es_correcta":false},{"letra":"C","texto":"101 6, · 50 8, -(101 6, -2 · 8,4)(50 8, -8,4)","es_correcta":false},{"letra":"D","texto":"101 6, · 50 8, -(101 6, -2 · 8,4)(50 8, -2 · 8,4)","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-61';

UPDATE public.preguntas
SET
  enunciado = 'En la figura adjunta, el punto B es el simétrico del punto A con respecto a la
recta L, el punto D es el simétrico del punto C con respecto a la recta L y
CDB =50 °.
¿Cuánto mide uno de los ángulos formados por las rectas DB y CA?',
  alternativas = '[{"letra":"A","texto":"40 °","es_correcta":false},{"letra":"B","texto":"45 °","es_correcta":false},{"letra":"C","texto":"50 °","es_correcta":false},{"letra":"D","texto":"80 °","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-25reg-65';

UPDATE public.preguntas
SET
  enunciado = 'En el siguiente gráfico se presenta la electricidad total generada por diferentes
tecnologías en Chile durante 2021.
Generadoras de Chile (2022). Cifras destacadas del sector generación en 2021.
¿Cuál de las siguientes expresiones corresponde a la electricidad total generada
durante 2020?',
  alternativas = '[{"letra":"A","texto":"80 1045,155 GWh","es_correcta":false},{"letra":"B","texto":"80 155 104,5 · 100 GWh","es_correcta":true},{"letra":"C","texto":"80 155 100 · 104,5 GWh","es_correcta":false},{"letra":"D","texto":"1045,80 155 · 100 GWh","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-26reg-23';

UPDATE public.preguntas
SET
  enunciado = 'Considera que la suma de los primeros N números enteros positivos corresponde
a N(N 2 +)1.
¿Cuál es el valor de 1 1 + + 2 2 + + 3 3 + + ... ... + + 98 49 + + 99 50?',
  alternativas = '[{"letra":"A","texto":"17 66","es_correcta":true},{"letra":"B","texto":"99 25","es_correcta":false},{"letra":"C","texto":"50 · 51 · 4 99 · 100","es_correcta":false},{"letra":"D","texto":"49 · 50 4 · 98 · 99","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-01';

UPDATE public.preguntas
SET
  enunciado = 'Si p es un número racional distinto de 0, ¿cuál de las siguientes expresiones
representa siempre a p m?',
  alternativas = '[{"letra":"A","texto":"p p m 2 m m m","es_correcta":false},{"letra":"B","texto":"p 2 + p 2","es_correcta":false},{"letra":"C","texto":"p p 2 m m + + 1 1 m","es_correcta":true},{"letra":"D","texto":"p 2 · p 2","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-07';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál es el resultado de 3 · 3 3 · 5 3?',
  alternativas = '[{"letra":"A","texto":"10 3","es_correcta":false},{"letra":"B","texto":"10 3 3","es_correcta":false},{"letra":"C","texto":"30 3","es_correcta":false},{"letra":"D","texto":"3· 30 3","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-08';

UPDATE public.preguntas
SET
  enunciado = 'Considera los números reales a, b y c.
¿Con cuál de las siguientes igualdades se puede deducir que la expresión
2 a + 8 b + 50 c representa siempre a un número racional?',
  alternativas = '[{"letra":"A","texto":"a + 2 b + 5 c = 2","es_correcta":false},{"letra":"B","texto":"a + b + c = 60","es_correcta":false},{"letra":"C","texto":"a + 2 b + 5 c = 2","es_correcta":true},{"letra":"D","texto":"a + b + c = 2 + 8 + 50","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-09';

UPDATE public.preguntas
SET
  enunciado = 'Una calculadora científica tiene la tecla log que permite calcular logaritmos
en base 10.
Por ejemplo, si se teclea la siguiente secuencia de teclas:
log 1 0 + log(3 ÷ 2) =
la calculadora entrega la solución de la expresión log 10 10 + log 10 3 2.
¿Cuál de las siguientes secuencias de teclas permite obtener el valor de log2 256?',
  alternativas = '[{"letra":"A","texto":"log 2 5 6 ÷ log 2 =","es_correcta":true},{"letra":"B","texto":"log 2 5 6 ÷ 2 =","es_correcta":false},{"letra":"C","texto":"log 2(2 5 6) =","es_correcta":false},{"letra":"D","texto":"log 2 · log 2 5 6 =","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-10';

UPDATE public.preguntas
SET
  enunciado = 'Si log p = q, ¿cuál de las siguientes expresiones es igual a log 10 p 3?',
  alternativas = '[{"letra":"A","texto":"1 + q 3","es_correcta":false},{"letra":"B","texto":"10 q 3","es_correcta":false},{"letra":"C","texto":"10 + 3 q","es_correcta":false},{"letra":"D","texto":"3 q","es_correcta":false},{"letra":"E","texto":"1 + 3 q","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-12';

UPDATE public.preguntas
SET
  enunciado = 'La magnitud de un terremoto y la energía que este libera están relacionadas por
la fórmula log E = 5,1 · M + 11 8,, tal que E es la cantidad de energía liberada
medida en ergios y M es la magnitud del terremoto en grados Richter.
¿Cuál es la diferencia de magnitud, en grados Richter, entre un terremoto que
libera una cantidad de energía de 10 25 ergios y otro que libera 10 19 ergios?',
  alternativas = '[{"letra":"A","texto":"8,1","es_correcta":false},{"letra":"B","texto":"4","es_correcta":true},{"letra":"C","texto":"6","es_correcta":false},{"letra":"D","texto":"9,3","es_correcta":false},{"letra":"E","texto":"9","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-13';

UPDATE public.preguntas
SET
  enunciado = 'Considera dos cuadrados de lados a cm y x cm que se intersectan solo en un
punto que es un vértice, de tal manera que tienen una de sus diagonales en una
misma recta.
¿Cuál de las siguientes expresiones representa la menor área, en 2 cm, que hay
que agregar para construir un cuadrado que contenga a los cuadrados dados?',
  alternativas = '[{"letra":"A","texto":"a 2 + x 2","es_correcta":false},{"letra":"B","texto":"ax","es_correcta":false},{"letra":"C","texto":"2 ax","es_correcta":true},{"letra":"D","texto":"(x -a) 2 -a 2 -x 2","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-14';

UPDATE public.preguntas
SET
  enunciado = 'Considera la ecuación 3 x -p = 2 x + p + 1.
¿Cuál es el menor valor que puede tomar x para que p sea un número entero
positivo?',
  alternativas = '[{"letra":"A","texto":"0","es_correcta":false},{"letra":"B","texto":"1","es_correcta":false},{"letra":"C","texto":"2","es_correcta":false},{"letra":"D","texto":"3","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-15';

UPDATE public.preguntas
SET
  enunciado = 'En la figura adjunta, sobre los puntos A y B se traza una recta que divide al
plano en los semiplanos I y II, además, por estos puntos se trazan las
rectas 1 L y 2 L, formando los ángulos BAD y CBA, cuyas medidas están
entre 0 ° y 180 °.
L1 L2
D C
Semiplano I
A B
Semiplano II
Si BAD =(2 x + 10)° y CBA =(x + 20)°, ¿cuál de los siguientes conjuntos
contiene solo a los posibles valores de x en que las rectas 1 L y 2 L se
intersectan en algún punto perteneciente al semiplano II?',
  alternativas = '[{"letra":"A","texto":"] 50, ∞ [","es_correcta":false},{"letra":"B","texto":"] 50, 85 [","es_correcta":true},{"letra":"C","texto":"] -∞, 50 [","es_correcta":false},{"letra":"D","texto":"] 70, ∞ [","es_correcta":false},{"letra":"E","texto":"] 40, 85 [","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-16';

UPDATE public.preguntas
SET
  enunciado = 'Diego paga una compra de$c con 35 monedas, algunas de$a y el resto de$b.
Si M es la cantidad de monedas de$a y N es la cantidad de monedas de$b,
¿cuál de los siguientes sistemas de ecuaciones permite determinar la cantidad
de monedas de$a y de$b que utilizó Diego en su compra?',
  alternativas = '[{"letra":"A","texto":"M + N = a + b aM + bN = c","es_correcta":false},{"letra":"B","texto":"M + N = c aM + bN = 35","es_correcta":false},{"letra":"C","texto":"M + N = 35 aM + bN = c","es_correcta":true},{"letra":"D","texto":"M + N = 35 (a + b)(M + N) = c","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-17';

UPDATE public.preguntas
SET
  enunciado = 'En la figura adjunta 1 L // 2 L y θ -α = 5 °.
3 θ 3 θ 1 L
3 α α 2 L
¿Cuál es el valor de α + θ?',
  alternativas = '[{"letra":"A","texto":"35 °","es_correcta":true},{"letra":"B","texto":"33 °","es_correcta":false},{"letra":"C","texto":"25 °","es_correcta":false},{"letra":"D","texto":"30 °","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-18';

UPDATE public.preguntas
SET
  enunciado = 'Considera el sistema ax + by + 1 = 0, en x e y, con a y b números reales
bx + ay + 1 = 0
distintos entre sí, distintos de cero y a \ne  -b.
¿Cuál es la solución del sistema?',
  alternativas = '[{"letra":"A","texto":"x = a + 1 b; y = a + 1 b","es_correcta":false},{"letra":"B","texto":"x = a --1 b; y = a --1 b","es_correcta":false},{"letra":"C","texto":"x = a -+ 1 b; y = a + 1 b","es_correcta":false},{"letra":"D","texto":"x = a -+ 1 b; y = a -+ 1 b","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-19';

UPDATE public.preguntas
SET
  enunciado = 'Dos ciclistas viajan en sentidos opuestos en una misma carretera y en línea
recta, uno al encuentro del otro. Se encuentran separados inicialmente por una
distancia d, y la rapidez a la que se desplazan son v y w.
¿Cuál de las siguientes funciones permite calcular la distancia a la que están los
dos ciclistas, antes de encontrarse, en función del tiempo t?',
  alternativas = '[{"letra":"A","texto":"f)t(=(v -w t) + d","es_correcta":false},{"letra":"B","texto":"g)t(=(v + w t) -d","es_correcta":false},{"letra":"C","texto":"p)t(= d -(v -w t)","es_correcta":false},{"letra":"D","texto":"n)t(=(v -w t) -d","es_correcta":false},{"letra":"E","texto":"m)t(= d -(v + w t)","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-20';

UPDATE public.preguntas
SET
  enunciado = 'Considera los rectángulos de perímetro P y ancho x.
Si la función f corresponde al largo de ellos, ¿cuál de las siguientes funciones
representa a f?',
  alternativas = '[{"letra":"A","texto":"f(x) = P -x","es_correcta":false},{"letra":"B","texto":"f(x) = P 2 + x","es_correcta":false},{"letra":"C","texto":"f(x) = P -2 x","es_correcta":false},{"letra":"D","texto":"f(x) = P 2 -2 x","es_correcta":false},{"letra":"E","texto":"f(x) = P 2 -x","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-21';

UPDATE public.preguntas
SET
  enunciado = 'Considera la ecuación(x -3)(x -4) = 2.
¿Cuál de los siguientes argumentos es válido?',
  alternativas = '[{"letra":"A","texto":"La ecuación posee dos soluciones, porque x = 3 y x = 4 satisfacen la igualdad.","es_correcta":false},{"letra":"B","texto":"Las soluciones de la ecuación son x = 2 y x = 5, porque(2 -3)(2 -4) = 2 y(5 -3)(5 -4) = 2.","es_correcta":true},{"letra":"C","texto":"Las soluciones son x = 2 y x = 5, porque ambos valores satisfacen la ecuación x2 -7 x + 12 = 0.","es_correcta":false},{"letra":"D","texto":"Las soluciones de la ecuación son ambas positivas, porque el discriminante asociado a la ecuación es positivo.","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-22';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál de las siguientes condiciones para m permite asegurar que las
soluciones de la ecuación mx 2 + mx + 2 = 0, en x, no sean números reales?',
  alternativas = '[{"letra":"A","texto":"m < 0","es_correcta":false},{"letra":"B","texto":"m \\le  8","es_correcta":false},{"letra":"C","texto":"m \\le  8","es_correcta":false},{"letra":"D","texto":"-8 < m < 0","es_correcta":false},{"letra":"E","texto":"0 < m < 8","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-23';

UPDATE public.preguntas
SET
  enunciado = 'Considera un rectángulo cuya área es M 2 cm, tal que su largo mide 2 cm más
que su ancho.
¿Cuál de las siguientes expresiones representa el perímetro del rectángulo en
función de M?',
  alternativas = '[{"letra":"A","texto":"8 + 4 1 + M","es_correcta":false},{"letra":"B","texto":"2 M + 4","es_correcta":false},{"letra":"C","texto":"-4 + 4 1 + M","es_correcta":false},{"letra":"D","texto":"M 4 -4","es_correcta":false},{"letra":"E","texto":"4 1 + M","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-25';

UPDATE public.preguntas
SET
  enunciado = 'Considera la función cuadrática f, cuyo dominio es el conjunto de los números
reales, definida por f(x) = -(x -5) 2 + 2.
¿Cuál de los siguientes gráficos representa mejor a algunos de los puntos que
pertenecen a la gráfica de f?',
  alternativas = '[{"letra":"A","texto":"Y B) Y 2 2 5 X 5 X","es_correcta":false},{"letra":"B","texto":"Opción B (ver figura)","es_correcta":true},{"letra":"C","texto":"Y D) Y 2 2 -5 X -5 X","es_correcta":false},{"letra":"D","texto":"Opción D (ver figura)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-26';

UPDATE public.preguntas
SET
  enunciado = 'En la figura adjunta se representa la gráfica de la función f, cuyo dominio es el
conjunto de los números reales, definida por f(x) = -ax 2 + bx -c, con a, b y c
números reales.
Y
X
¿Cuál de las siguientes relaciones es verdadera?',
  alternativas = '[{"letra":"A","texto":"a > 0","es_correcta":true},{"letra":"B","texto":"-2 b a < 0","es_correcta":false},{"letra":"C","texto":"c > 0","es_correcta":false},{"letra":"D","texto":"b > 0","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-28';

UPDATE public.preguntas
SET
  enunciado = 'Se necesita determinar el perímetro del rectángulo ABCD, cuyo largo y ancho
miden(4 x +)1 cm y(x + 2) cm, respectivamente. Se sabe que ABCD es
semejante a un rectángulo cuyo largo y ancho miden 10 cm y 8 cm,
respectivamente.
Para determinar el perímetro del rectángulo ABCD se realiza el siguiente
procedimiento, cometiéndose un error:
Paso 1: como los rectángulos son semejantes se plantea la expresión:
4 x 8 + 1 = x 10 + 2
Paso 2: se resuelve la expresión anterior, obteniéndose x = 16 3.
Paso 3: se reemplaza este valor de x en(4 x +)1 cm y(x + 2) cm,
obteniéndose que el largo y el ancho del rectángulo son 7 4 cm y
16 35 cm, respectivamente.
Paso 4: se calcula el perímetro del rectángulo obteniéndose 63 8 cm.
¿En cuál de los pasos se cometió el error?',
  alternativas = '[{"letra":"A","texto":"En el Paso 1","es_correcta":true},{"letra":"B","texto":"En el Paso 2","es_correcta":false},{"letra":"C","texto":"En el Paso 3","es_correcta":false},{"letra":"D","texto":"En el Paso 4","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-30';

UPDATE public.preguntas
SET
  enunciado = 'Para determinar la altura de un poste vertical, Camilo coloca un espejo en el suelo
entre él y el poste, de tal manera que en un punto del espejo Camilo observa la
cima del poste, como se representa en la figura adjunta.
Poste
Camilo α α
Espejo
Si los ojos de Camilo están a una altura de 1,22 m, la distancia entre su pie y la
base del poste es de 9 m y la distancia entre su pie y el espejo es de 3 m, ¿cuál
es la altura del poste?',
  alternativas = '[{"letra":"A","texto":"2,44 m","es_correcta":true},{"letra":"B","texto":"5,4 m","es_correcta":false},{"letra":"C","texto":"9,66 m","es_correcta":false},{"letra":"D","texto":"21, 96 m","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-32';

UPDATE public.preguntas
SET
  enunciado = 'En la figura adjunta el Δ ABC es rectángulo en C y el Δ BDE es rectángulo
en E, con E en el segmento AB y D en el segmento CB.
C
D
A
E
B
Si AE =(4 x -1)cm, EB =(x + 1)cm, BD =(2 x -1)cm y DC =(2 x + 1)cm,
¿cuál es el valor del segmento CB?',
  alternativas = '[{"letra":"A","texto":"3 2 cm","es_correcta":false},{"letra":"B","texto":"4 cm","es_correcta":false},{"letra":"C","texto":"6 cm","es_correcta":false},{"letra":"D","texto":"12 cm","es_correcta":true},{"letra":"E","texto":"14 cm","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-34';

UPDATE public.preguntas
SET
  enunciado = 'En el triángulo ABC de la figura adjunta, AC = BC = 5 cm, la altura CF
mide 4 cm, DE // AB y la distancia entre estas paralelas es 1 cm.
C
D E
A F B
¿Cuál es el perímetro del trapecio ABED?',
  alternativas = '[{"letra":"A","texto":"8,25 cm","es_correcta":false},{"letra":"B","texto":"12 cm","es_correcta":false},{"letra":"C","texto":"12 5, cm","es_correcta":false},{"letra":"D","texto":"13 cm","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-35';

UPDATE public.preguntas
SET
  enunciado = 'Un objeto y la imagen que se forma de él en la retina del ojo humano se puede
modelar a través de la relación I = k · O, con k la razón de homotecia, I el
tamaño de la imagen y O el tamaño del objeto original, como se representa en la
siguiente figura:
Cristalino Retina
Imagen
Objeto
original
Se sabe que la distancia entre el centro de homotecia y el sector donde se forma la
imagen en la retina es, aproximadamente, de 24 mm.
Si un objeto de tamaño 5,0 m está a una distancia al centro de homotecia de 1 m,
¿cuál es el tamaño de la imagen que se forma en la retina, en metros?',
  alternativas = '[{"letra":"A","texto":"24 · 500 1","es_correcta":false},{"letra":"B","texto":"1$24.000· 1 5","es_correcta":false},{"letra":"C","texto":"1$24.000· 5,0","es_correcta":true},{"letra":"D","texto":"24 · 500","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-37';

UPDATE public.preguntas
SET
  enunciado = 'Considera el triángulo ABC de la figura adjunta, tal que D pertenece al
segmento BC.
C
β
D
α
A B
Si AB = p cm y DB = y cm, ¿cuál de las siguientes expresiones corresponde a la
medida del segmento CD, en cm?',
  alternativas = '[{"letra":"A","texto":"p · tan(α -β) -y","es_correcta":false},{"letra":"B","texto":"p · tan(90 ° -β) -y","es_correcta":true},{"letra":"C","texto":"p · tan(α -β) + y","es_correcta":false},{"letra":"D","texto":"p · tan(90 ° -β) + y","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-40';

UPDATE public.preguntas
SET
  enunciado = 'En el plano cartesiano de la cuadrícula de lado 1 cm de la figura adjunta, los
polígonos P, Q, R, S, T y M son congruentes entre sí.
Y
R
T
S
P
M Q
u
v X
¿Cuál(2 u + v de)? los siguientes polígonos es la imagen de M según la traslación dada por',
  alternativas = '[{"letra":"A","texto":"P","es_correcta":false},{"letra":"B","texto":"R","es_correcta":true},{"letra":"C","texto":"Q","es_correcta":false},{"letra":"D","texto":"S","es_correcta":false},{"letra":"E","texto":"T","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-44';

UPDATE public.preguntas
SET
  enunciado = 'En una competencia las normas indican que las puntuaciones recibidas por los
participantes se calcularán de la siguiente forma:
✓ cada uno de los 5 jueces dará un puntaje entre 1 y 20.
✓ para estos 5 puntajes se calculará el promedio x y desviación estándar θ.
✓ se eliminarán aquellos puntajes que no estén entre x -θ y x + θ.
✓ se calculará nuevamente el promedio, pero solo con los puntajes que estén
entre x -θ y x + θ, el cual corresponde al puntaje final del participante.
Si los jueces evalúan a Gabriel con 6, 8, 12, 9 y 15 puntos, ¿cuál es el puntaje
final obtenido por Gabriel?',
  alternativas = '[{"letra":"A","texto":"10 puntos","es_correcta":false},{"letra":"B","texto":"35 4 puntos","es_correcta":false},{"letra":"C","texto":"29 3 puntos","es_correcta":true},{"letra":"D","texto":"21 2 puntos","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-47';

UPDATE public.preguntas
SET
  enunciado = 'Considera las tiendas A, B y C dedicadas a la venta de relojes. Si un cliente
compra un reloj en una de estas tres tiendas, la probabilidad de que compre en A
es 2,0; en B es 3,0 y en C es 5,0. Se sabe que la probabilidad de que cualquier
reloj que se venda en las tiendas A, B y C tenga fallas es 3,0; 5,0 y 6,0,
respectivamente.
Si Teresa compra un reloj que no tiene fallas, ¿cuál es la probabilidad de que lo
haya comprado en la tienda A?',
  alternativas = '[{"letra":"A","texto":"2,0 · 7,0","es_correcta":false},{"letra":"B","texto":"2,0 · 3,0","es_correcta":false},{"letra":"C","texto":"2,0 · 3,0 + 2,0 3,0 · · 5,0 3,0 + 5,0 · 6,0","es_correcta":false},{"letra":"D","texto":"2,0 · 7,0 + 2,0 3,0 · · 7,0 5,0 + 5,0 · 4,0","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-51';

UPDATE public.preguntas
SET
  enunciado = 'De un grupo de 100 personas, 40 de ellas son fumadores. Un 20 % de los
fumadores no presenta una enfermedad respiratoria. Al seleccionar una persona al
azar del grupo total, la probabilidad de que presente una enfermedad respiratoria
es 0,35.
Al seleccionar una persona al azar del grupo total, ¿cuál es la probabilidad de que
no fume dado que no tiene una enfermedad respiratoria?',
  alternativas = '[{"letra":"A","texto":"57 65","es_correcta":true},{"letra":"B","texto":"60 45","es_correcta":false},{"letra":"C","texto":"57 60","es_correcta":false},{"letra":"D","texto":"65 45","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-52';

UPDATE public.preguntas
SET
  enunciado = 'Se puede determinar el valor numérico de 3 a + 2, si:
(1) se conoce el valor de 2 a.
(2) a > 0',
  alternativas = '[{"letra":"A","texto":"(1) por sí sola","es_correcta":true},{"letra":"B","texto":"(2) por sí sola","es_correcta":false},{"letra":"C","texto":"Ambas juntas, (1) y (2)","es_correcta":false},{"letra":"D","texto":"Cada una por sí sola, (1) ó (2)","es_correcta":false},{"letra":"E","texto":"Se requiere información adicional","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-53';

UPDATE public.preguntas
SET
  enunciado = 'Considera la igualdad p · 10 n = 0,3600 $3.000.
¿Cuál es el valor de n si p = 2,1?',
  alternativas = '[{"letra":"A","texto":"7","es_correcta":true},{"letra":"B","texto":"6","es_correcta":false},{"letra":"C","texto":"0","es_correcta":false},{"letra":"D","texto":"-1","es_correcta":false},{"letra":"E","texto":"-2","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-01';

UPDATE public.preguntas
SET
  enunciado = 'Se necesita un modelo que permita trabajar con los decimales que se requieran de
un número. Esto se consigue mediante la función T n la que entrega el número x
truncado en el n-ésimo decimal, tal como se ejemplifica en la siguiente tabla:
T0 (4,56891921) = 4
T1 (4,56891921) = 4,5
T4 (4,56891921) = 4,5689
T7 (4,56891921) = 4,5689192
Si T10() \pi  = 3,1415926535, ¿cuál de las siguientes expresiones es igual a 2?',
  alternativas = '[{"letra":"A","texto":"10 7 ·(T 7() \\pi  -T 6() \\pi)","es_correcta":false},{"letra":"B","texto":"10 ·(T 1(\\pi) -T 0(\\pi))","es_correcta":false},{"letra":"C","texto":"10 6 ·(T 6() \\pi  -T 5() \\pi)","es_correcta":true},{"letra":"D","texto":"10 5 ·(T 5() π -T 4() π)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-02';

UPDATE public.preguntas
SET
  enunciado = 'Considera los números irracionales P y Q y el número racional R.
¿Cuál de las siguientes expresiones representa siempre un número irracional?',
  alternativas = '[{"letra":"A","texto":"P + Q","es_correcta":false},{"letra":"B","texto":"R(P + Q)","es_correcta":false},{"letra":"C","texto":"P + Q","es_correcta":false},{"letra":"D","texto":"P + R","es_correcta":true},{"letra":"E","texto":"Q + P R","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-04';

UPDATE public.preguntas
SET
  enunciado = 'La media geométrica de 5 números es la raíz quinta del producto de los números.
¿Cuál es la media geométrica de los números a, 2 a, 4 a, 8 a y 16 a, con a > 0?
1',
  alternativas = '[{"letra":"A","texto":"5 2 10a 5","es_correcta":false},{"letra":"B","texto":"2· 5 a","es_correcta":false},{"letra":"C","texto":"a· 5 2 10 1","es_correcta":true},{"letra":"D","texto":"5 2 10a","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-06';

UPDATE public.preguntas
SET
  enunciado = 'Considera dos esferas A y B de volúmenes V A y V B, y de radios r A y Br,
respectivamente.
Los volúmenes y los radios de cada esfera están relacionados de la siguiente
manera:
r A = 3 4 3 \pi  V A y r B = 3 4 3 \pi  V B
¿Cuál de las siguientes afirmaciones es siempre verdadera?',
  alternativas = '[{"letra":"A","texto":"El diámetro de la esfera A es 3 \\pi  3 V A.","es_correcta":false},{"letra":"B","texto":"La suma de ambos radios es 3 4 3 \\pi (V A + V B).","es_correcta":false},{"letra":"C","texto":"El cociente entre los radios es r r A B = 3 V V A B. 2","es_correcta":true},{"letra":"D","texto":"El producto de ambos radios es ( (( 4 3 \\pi  V A · V B ) )) 3.","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-07';

UPDATE public.preguntas
SET
  enunciado = 'Considera el número real positivo p.
¿Cuál de las siguientes expresiones equivale a 24 p + 3 · 150 p?',
  alternativas = '[{"letra":"A","texto":"3· 174 p","es_correcta":false},{"letra":"B","texto":"522 p","es_correcta":false},{"letra":"C","texto":"1 374 p","es_correcta":false},{"letra":"D","texto":"17 · 6 p","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-08';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál es el valor de log 3 9 · log 8 2?',
  alternativas = '[{"letra":"A","texto":"6","es_correcta":false},{"letra":"B","texto":"2 3","es_correcta":true},{"letra":"C","texto":"log11 18","es_correcta":false},{"letra":"D","texto":"log24 18","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-09';

UPDATE public.preguntas
SET
  enunciado = 'p y b son números reales que cumplen la condición 0 < p < b.
¿Cuál de las siguientes expresiones es igual a log b 2 -p 2?',
  alternativas = '[{"letra":"A","texto":"log(b -p)","es_correcta":false},{"letra":"B","texto":"log b -log p","es_correcta":false},{"letra":"C","texto":"log ( (( ( b p ) )) )","es_correcta":false},{"letra":"D","texto":"log b 2 -2 log p 2","es_correcta":false},{"letra":"E","texto":"log(p + b) 2 + log(b -p)","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-11';

UPDATE public.preguntas
SET
  enunciado = 'El nivel de intensidad acústica medido en decibelios(dB) se puede calcular
mediante la expresión B dB = 10 · log I I 0, en la que I es la intensidad acústica en la
escala lineal medida en m W 2 e 0I es la intensidad acústica más baja que puede
percibir el oído humano cuyo valor es 10-12 m W 2.
Si la conversación entre dos personas tiene una intensidad acústica en la escala
lineal de 10-7 m W 2, ¿cuál es el nivel de intensidad acústica de esa conversación,
en dB?',
  alternativas = '[{"letra":"A","texto":"10· log 12 7","es_correcta":false},{"letra":"B","texto":"50","es_correcta":true},{"letra":"C","texto":"-50","es_correcta":false},{"letra":"D","texto":"-10 · log 12 7 ()","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-12';

UPDATE public.preguntas
SET
  enunciado = 'Si -3 < a < 3 y 1 < b < 8, ¿cuál es el conjunto que contiene a todos y únicamente
a los posibles valores de a b?',
  alternativas = '[{"letra":"A","texto":"] -,3 [3","es_correcta":true},{"letra":"B","texto":"] -2,11 [","es_correcta":false},{"letra":"C","texto":"]- ]] ,3 8 3 [ [[","es_correcta":false},{"letra":"D","texto":"] ]] ,3 8 3 [ [[","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-14';

UPDATE public.preguntas
SET
  enunciado = 'El ojo humano utiliza la pupila como un lente y las imágenes proyectadas se forman
en la retina. La altura de la imagen que se forma en la retina h 1, cumple la relación
h 1 = d 1 d · 0 h 0, tal que h 0 es la altura original del objeto observado, d 1 es la
distancia entre la pupila y la retina, y d 0 es la distancia entre el objeto y la pupila.
Una persona observa una botella de 25 cm de alto y un tarro de café de 10 cm de
alto, estos se encuentran a una distancia de 200 y 250 centímetros de la pupila de
la persona, respectivamente. La altura de la imagen de la botella formada en la
retina es h B, mientras que la altura de la imagen del tarro de café formada en la
retina es h T.
Si al mirar ambos objetos, la distancia entre la pupila y la retina se mantiene
constante, ¿cuál de las siguientes igualdades relaciona h B con h T?',
  alternativas = '[{"letra":"A","texto":"h B = 5 2 · h T","es_correcta":false},{"letra":"B","texto":"h B = 25 8 · h T","es_correcta":true},{"letra":"C","texto":"h B = 1 2 · h T","es_correcta":false},{"letra":"D","texto":"h B = 2 · h T","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-15';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál de las siguientes ecuaciones forma un sistema sin solución con la
ecuación y = 1 2 x + 5?',
  alternativas = '[{"letra":"A","texto":"y = 1 2 x + 5","es_correcta":false},{"letra":"B","texto":"y = 1 2 x + 8","es_correcta":true},{"letra":"C","texto":"y = 2 x + 5","es_correcta":false},{"letra":"D","texto":"y = -2 x + 8","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-19';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál debe ser el valor de la constante k para que la gráfica de la función
f(x) = kx + 4 forme con los semiejes positivos del sistema coordenado una
región cuya área sea igual a 12?',
  alternativas = '[{"letra":"A","texto":"-3 2","es_correcta":false},{"letra":"B","texto":"2 3","es_correcta":false},{"letra":"C","texto":"-4 3","es_correcta":false},{"letra":"D","texto":"-2 3","es_correcta":true},{"letra":"E","texto":"6","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-20';

UPDATE public.preguntas
SET
  enunciado = 'Dos automóviles, A y B, que están simultáneamente en el punto P tienen que
realizar un viaje en línea recta, el automóvil A lo hace con una rapidez constante
de 60 kilómetros hora y el automóvil B con una rapidez constante de 80 kilómetros hora, lo
que se representa en la figura adjunta.
Si ambos parten al mismo tiempo, ¿cuál de las siguientes funciones modela la
relación horas, tal de que la t distancia pertenece entre al intervalo A y B, [ ,0 en ∞ kilómetros, [? en función del tiempo t, en',
  alternativas = '[{"letra":"A","texto":"m() t = 10 t","es_correcta":false},{"letra":"B","texto":"g() t = 100 t","es_correcta":true},{"letra":"C","texto":"n() t = 100 2t","es_correcta":false},{"letra":"D","texto":"p() t = 1000 t","es_correcta":false},{"letra":"E","texto":"q() t = 140 t","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-21';

UPDATE public.preguntas
SET
  enunciado = 'Considera un triángulo cuya área es 39 2 cm y su altura es 7 cm mayor que la
medida de su base respectiva.
Si b representa la medida de la base, en cm, ¿cuál de las siguientes ecuaciones
permite determinar su valor?',
  alternativas = '[{"letra":"A","texto":"b2 -7 b + 78 = 0","es_correcta":false},{"letra":"B","texto":"b2 + 7 b + 78 = 0","es_correcta":false},{"letra":"C","texto":"b2 -7 b -78 = 0","es_correcta":false},{"letra":"D","texto":"b2 + 7 b -78 = 0","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-23';

UPDATE public.preguntas
SET
  enunciado = 'En un laboratorio, bajo ciertas condiciones, se estudia un cultivo de bacterias cuya
cantidad se puede modelar mediante la función f)t(= -t 2 + 2 t + 120, en la cual
f)t(es la cantidad de bacterias que existen transcurridas t horas del inicio del
cultivo.
¿En cuántas horas el cultivo deja de tener bacterias?',
  alternativas = '[{"letra":"A","texto":"6","es_correcta":false},{"letra":"B","texto":"10","es_correcta":false},{"letra":"C","texto":"12","es_correcta":true},{"letra":"D","texto":"120","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-24';

UPDATE public.preguntas
SET
  enunciado = 'En la siguiente tabla se presentan algunos puntos que pertenecen a la gráfica de
una función cuadrática.
x y
0 0
1 5
2 20
Si el punto (p, 80) es un punto de la gráfica de esta función, ¿cuál de los siguientes
valores podría corresponder a p?',
  alternativas = '[{"letra":"A","texto":"4","es_correcta":true},{"letra":"B","texto":"6","es_correcta":false},{"letra":"C","texto":"-5 + 2 89","es_correcta":false},{"letra":"D","texto":"32 000","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-25';

UPDATE public.preguntas
SET
  enunciado = '¿Qué valor o valores debe tomar k para que la ecuación x2 + kx + 9 = 0, en x,
tenga una única solución?',
  alternativas = '[{"letra":"A","texto":"6 o -6","es_correcta":true},{"letra":"B","texto":"3 o -3","es_correcta":false},{"letra":"C","texto":"Solo 36","es_correcta":false},{"letra":"D","texto":"Solo 6","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-26';

UPDATE public.preguntas
SET
  enunciado = 'Si con las k \ne  raíces 0, ¿cuál (o de soluciones) las siguientes de la expresiones ecuación es 2 x igual 2 + kx a -(x k 1 = + 0 1)(x son 2 +)1 x 1? y x 2,',
  alternativas = '[{"letra":"A","texto":"1","es_correcta":false},{"letra":"B","texto":"1 -k","es_correcta":true},{"letra":"C","texto":"1 + k","es_correcta":false},{"letra":"D","texto":"1 -k 2","es_correcta":false},{"letra":"E","texto":"k 2","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-27';

UPDATE public.preguntas
SET
  enunciado = 'En un experimento, se modela la temperatura T en grados Celsius de un objeto
mediante la función T() t = -4 t 2 + 24 t + 40, tal que t es el tiempo transcurrido
desde que se inició el experimento, en minutos.
¿A partir de los cuántos minutos la temperatura baja de 40 ° C?',
  alternativas = '[{"letra":"A","texto":"0","es_correcta":false},{"letra":"B","texto":"2","es_correcta":false},{"letra":"C","texto":"3","es_correcta":false},{"letra":"D","texto":"6","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-28';

UPDATE public.preguntas
SET
  enunciado = 'Considera la ecuación qx2 +(q -2) x -2 q -1 = 0, en x.
¿Para qué valor de q el producto de sus raíces es -4?',
  alternativas = '[{"letra":"A","texto":"-2 3","es_correcta":false},{"letra":"B","texto":"5 2","es_correcta":false},{"letra":"C","texto":"1 4","es_correcta":false},{"letra":"D","texto":"1 2","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-29';

UPDATE public.preguntas
SET
  enunciado = 'Considera la función f con dominio el conjunto de los números reales, definida por
f(x) = ax 2 + bx + c, tal que ,a b y c son números reales y a \ne  0.
Si f(p) < 0 y f(q) > 0, tal que p y q son números reales, ¿cuál de las siguientes
relaciones es siempre verdadera?',
  alternativas = '[{"letra":"A","texto":"b2 -4 ac = 0","es_correcta":false},{"letra":"B","texto":"b2 -4 ac > 0","es_correcta":true},{"letra":"C","texto":"a < 0","es_correcta":false},{"letra":"D","texto":"q > p","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-30';

UPDATE public.preguntas
SET
  enunciado = 'Considera la función cuadrática f cuyo dominio es el conjunto de los números
reales, definida por f(x) = bx 2 -4.
¿Cuál de los siguientes intervalos contiene a todos y únicamente los posibles
valores de b, para los cuales la distancia entre los puntos de intersección de la
parábola asociada a f con el eje X sea mayor que 4?',
  alternativas = '[{"letra":"A","texto":"] -∞, [1","es_correcta":false},{"letra":"B","texto":"] ,0 [1","es_correcta":true},{"letra":"C","texto":"] ]] ,0 1 4 [ [[","es_correcta":false},{"letra":"D","texto":"]∞ ]] -, 1 4 [ [[","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-31';

UPDATE public.preguntas
SET
  enunciado = 'El triángulo ABC de la figura adjunta es rectángulo en C, BC = 9 cm y
AB = 15 cm. R
B
P α Q
α
C A
Si los triángulos ABC y PQR son semejantes y PR = 3 cm, ¿cuánto mide la
hipotenusa del triángulo PQR?',
  alternativas = '[{"letra":"A","texto":"2,25 cm","es_correcta":false},{"letra":"B","texto":"3,75 cm","es_correcta":true},{"letra":"C","texto":"4 cm","es_correcta":false},{"letra":"D","texto":"5 cm","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-34';

UPDATE public.preguntas
SET
  enunciado = 'Una persona construye un tipo de caja en forma de prisma recto con base
rectangular. El área total de la caja es A 2 cm.
Esta persona quiere construir un nuevo tipo de caja, de tal forma que sus caras
sean semejantes a las caras de la caja original con razón de semejanza k.
¿Cuál de las siguientes expresiones representa el área de la caja nueva?',
  alternativas = '[{"letra":"A","texto":"k · A 2 cm","es_correcta":false},{"letra":"B","texto":"k · A 2 cm","es_correcta":false},{"letra":"C","texto":"(A + 6 k 2) 2 cm","es_correcta":false},{"letra":"D","texto":"k 2 · A 2 cm","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-36';

UPDATE public.preguntas
SET
  enunciado = 'Considera un triángulo ABC tal que las coordenadas del vértice A son(3, -4).
Al triángulo ABC se le aplica una homotecia con centro en el punto (1, -)1 y
razón -2 obteniéndose el triángulo PQR, tal que P es la imagen de A y Q es la
imagen de B.
¿Cuál de las siguientes afirmaciones es verdadera?',
  alternativas = '[{"letra":"A","texto":"Las coordenadas de P son(-,1 6).","es_correcta":false},{"letra":"B","texto":"El área del triángulo PQR es el doble del área del triángulo ABC.","es_correcta":false},{"letra":"C","texto":"El segmento AB es paralelo al segmento PQ.","es_correcta":true},{"letra":"D","texto":"El triángulo PQR está en el cuarto cuadrante.","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-38';

UPDATE public.preguntas
SET
  enunciado = 'Considera los vectores u y v =(p, q) en un plano cartesiano tal que
c u + v =(5, 3), con c un número real mayor que uno.
¿Cuáles son las coordenadas de u, en función de p, q y c?',
  alternativas = '[{"letra":"A","texto":"(5 -cp, 3 -cq)","es_correcta":false},{"letra":"B","texto":"( (( 5 c -,p 3 c -q ) ))","es_correcta":false},{"letra":"C","texto":"(5 c -,p 3 c -q)","es_correcta":false},{"letra":"D","texto":"( (( 5 c -,p 3 c -q ) ))","es_correcta":false},{"letra":"E","texto":"( (( 5 -c p, 3 -c q ) ))","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-40';

UPDATE public.preguntas
SET
  enunciado = 'Considera el triángulo ABC y la tabla con algunos valores aproximados de razones
trigonométricas de la figura adjunta.
C
70 ° aproximado Valor
sen 55 ° 0,81
tan 55 ° 1,42
55 ° sen 20 ° 0,34
A D 10 cm B
Para aproximar la medida del lado AB con los datos de la tabla, se realizan los
siguientes pasos, cometiendo un error:
Paso 1: se calcula la medida del segmento CD resolviendo la ecuación
1,42 = CD 10, obteniendo CD = 14 2, cm.
Paso 2: se calcula la medida del segmento CB resolviendo la ecuación
0,81 = 14 CB 2,, obteniendo aproximadamente 17, 53 cm.
Paso 3: se calcula la medida de BAC resolviendo la ecuación
BAC + 70 ° = 90 °, obteniendo BAC =20 °.
Paso 4: se calcula la medida del segmento AB resolviendo la ecuación
0,34 = 17 AB, 53, obteniendo aproximadamente 51, 55 cm.
¿En cuál de los pasos se cometió el error?',
  alternativas = '[{"letra":"A","texto":"En el paso 1","es_correcta":false},{"letra":"B","texto":"En el paso 2","es_correcta":false},{"letra":"C","texto":"En el paso 3","es_correcta":false},{"letra":"D","texto":"En el paso 4","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-42';

UPDATE public.preguntas
SET
  enunciado = 'Considera los datos g 1, g 2, g 3, g 4 y g 5 cuyo rango es cero.
¿Cuál es la desviación estándar de los datos g1 -2, g2 -2, g 3,
g4 + 1 y g5 + 3?',
  alternativas = '[{"letra":"A","texto":"18 5","es_correcta":false},{"letra":"B","texto":"8 5","es_correcta":false},{"letra":"C","texto":"3· 5 2","es_correcta":true},{"letra":"D","texto":"2· 5 2","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-44';

UPDATE public.preguntas
SET
  enunciado = 'Una baraja de naipes posee 4 tipos distintos de cartas (A, B, C, D) con la misma
cantidad de cartas de cada tipo.
Si en la baraja de m cartas en total se extrae al azar solo dos de ellas, una
después de la otra sin devolución, ¿cuál es la probabilidad de que estas sean del
tipo B?',
  alternativas = '[{"letra":"A","texto":"16 1","es_correcta":false},{"letra":"B","texto":"1 4 + ( ( ( (( ( m 4 m --1 1 ) ) ) )) )","es_correcta":false},{"letra":"C","texto":"1 2","es_correcta":false},{"letra":"D","texto":"1 4 · ( ( ( (( ( m 4 m --1 1 ) ) ) )) )","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-45';

UPDATE public.preguntas
SET
  enunciado = 'Se tienen dos urnas, A y B, las cuales contienen bolitas del mismo tipo. La urna A
contiene x bolitas en total, de las cuales m bolitas son azules, mientras que la
urna B, contiene y bolitas en total, de las cuales n son azules.
Si se extrae una bolita al azar de cada urna, ¿cuál de las siguientes expresiones
representa la probabilidad de que ninguna de las bolitas sea de color azul?',
  alternativas = '[{"letra":"A","texto":"(x -x m)(· y -y n)","es_correcta":true},{"letra":"B","texto":"1 -m x · n y","es_correcta":false},{"letra":"C","texto":"1 -1 m · n 1","es_correcta":false},{"letra":"D","texto":"1 -x m · 1 -y n","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-46';

UPDATE public.preguntas
SET
  enunciado = 'Paulina compró un candado para asegurar el casillero que le ofrecieron en su
colegio. El candado tiene tres casillas y en cada una de ellas se puede escoger
entre los dígitos de cero a nueve para formar una clave numérica.
¿Cuál de las siguientes expresiones representa la cantidad total de claves
numéricas, entre las que Paulina puede escoger?',
  alternativas = '[{"letra":"A","texto":"(() 10 10) 10","es_correcta":false},{"letra":"B","texto":"3 10","es_correcta":false},{"letra":"C","texto":"3 · 10","es_correcta":false},{"letra":"D","texto":"10 3","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-47';

UPDATE public.preguntas
SET
  enunciado = '48 En una empresa los productos que son devueltos por defectuosos se separan
en dos: los que tienen menos de una semana de uso y los que se devuelven
después de la semana de uso. Los dos tipos de productos se mandan a áreas
de reparación distintas.
La gerencia de la empresa quiere saber cuál es la probabilidad de que el producto
devuelto lo haya sido antes de la primera semana de uso y que este tenga
reparación.
Para ello se sabe que:
\cdot  La probabilidad de que el producto devuelto lo haya sido antes de la primera
semana de uso es N.
\cdot  La probabilidad de que el producto tenga reparación, dado que fue devuelto
antes de la primera semana de uso es M.
¿Cuál de los siguientes modelos tiene que usar la gerencia para calcular la
probabilidad que busca?',
  alternativas = '[{"letra":"A","texto":"M N","es_correcta":false},{"letra":"B","texto":"M· N","es_correcta":true},{"letra":"C","texto":"M N","es_correcta":false},{"letra":"D","texto":"M+ N","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-48';

UPDATE public.preguntas
SET
  enunciado = 'Considera los dígitos 0, 1, 2 y 4.
¿Cuántos números de tres cifras en total que sean múltiplo de 5 se pueden formar
con estos dígitos?',
  alternativas = '[{"letra":"A","texto":"4 · 3 · 2","es_correcta":false},{"letra":"B","texto":"3 · 4 · 4","es_correcta":false},{"letra":"C","texto":"4 · 4 · 1","es_correcta":false},{"letra":"D","texto":"3 · 4 · 1","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-49';

UPDATE public.preguntas
SET
  enunciado = 'Considera a, b y c números racionales, con a y c distintos de cero.
Se puede determinar que a b · c b = 1, si se sabe que:
(1) b es cero.
(2) a es el inverso multiplicativo de c.',
  alternativas = '[{"letra":"A","texto":"(1) por sí sola","es_correcta":false},{"letra":"B","texto":"(2) por sí sola","es_correcta":false},{"letra":"C","texto":"Ambas juntas, (1) y (2)","es_correcta":false},{"letra":"D","texto":"Cada una por sí sola, (1) ó (2)","es_correcta":true},{"letra":"E","texto":"Se requiere información adicional","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24inv-52';

UPDATE public.preguntas
SET
  enunciado = 'El nivel de colesterol para las personas se presenta en la tabla adjunta.
Categoría Nivel de colesterol total
Deseable Hasta 200 mg dL
Riesgo bajo Mayor que 200 mg dL hasta 240 mg dL
Riesgo alto Mayor que 240 mg dL
Rodrigo presenta un colesterol de 255 mg dL y su doctor le deja dos recetas:
La primera receta es para que tome un medicamento que reduce el nivel de
colesterol en 5,2 mg dL diarios, pero que solo debe tomar mientras presente un
riesgo alto.
La segunda receta indica un medicamento que reduce su nivel de colesterol en
8,0 mg dL diarios, pero que solo debe tomar mientras presente un riesgo bajo.
Si expresiones para Rodrigo que el nivel sigue numéricas de el colesterol tratamiento permite de determinar Rodrigo indicado llegue por la el duración a ser doctor, deseable? del ¿cuál tratamiento, de las siguientes en días,',
  alternativas = '[{"letra":"A","texto":"5,2(255 -240 5,2) + + 8,0 8,0(240 -200)","es_correcta":false},{"letra":"B","texto":"255 5,2 -+ 200 8,0","es_correcta":false},{"letra":"C","texto":"255 5,2 + 240 8,0","es_correcta":false},{"letra":"D","texto":"240 255 --240 200 · 5,2 8,0","es_correcta":false},{"letra":"E","texto":"255 5,2 -240 + 240 8,0 -200","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-01';

UPDATE public.preguntas
SET
  enunciado = 'Considera la igualdad P = n n + -1 1, con n un número entero.
¿Para cuántos valores distintos de n se cumple que P es un número entero?',
  alternativas = '[{"letra":"A","texto":"Solo para un valor.","es_correcta":false},{"letra":"B","texto":"Solo para dos valores.","es_correcta":false},{"letra":"C","texto":"Solo para cuatro valores.","es_correcta":true},{"letra":"D","texto":"Solo para cinco valores.","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-02';

UPDATE public.preguntas
SET
  enunciado = 'Considera un cuadrado A de lado p cm y un cuadrado B cuyo lado tiene medida
igual a la medida de la diagonal del cuadrado A.
¿Para cuál de los siguientes valores de p, en cm, la suma de las medidas de las
diagonales de los cuadrados A y B es un número racional?',
  alternativas = '[{"letra":"A","texto":"2","es_correcta":false},{"letra":"B","texto":"2 -2","es_correcta":true},{"letra":"C","texto":"2 + 2","es_correcta":false},{"letra":"D","texto":"2 -2","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-03';

UPDATE public.preguntas
SET
  enunciado = 'En el gráfico adjunto se presenta la composición elemental del cuerpo humano.
65 18% %
Oxígeno Carbono
4 3% 10% %
Hidrógeno
Nitrógeno
Otros elementos
Tal los recordar como organismos estos en el cuatro ser vivos humano, elementos son el los Carbono, es cuatro usual elementos Hidrógeno, usar el acrónimo más Oxígeno abundantes nemotécnico y Nitrógeno, en CHON. el resto y para de
¿Qué Oxígeno? porcentaje de los elementos CHON en el cuerpo humano corresponde a',
  alternativas = '[{"letra":"A","texto":"100 65 · 100 %","es_correcta":false},{"letra":"B","texto":"32 65 · 100 %","es_correcta":false},{"letra":"C","texto":"96 65 · 100 %","es_correcta":true},{"letra":"D","texto":"4 · 65 100 %","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-04';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál es el valor de 2 3 5 + 3 2 10?',
  alternativas = '[{"letra":"A","texto":"6 10 + 6 20","es_correcta":false},{"letra":"B","texto":"6 80","es_correcta":false},{"letra":"C","texto":"2 5 40","es_correcta":false},{"letra":"D","texto":"6 30 + 6 40","es_correcta":false},{"letra":"E","texto":"2 6 40","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-05';

UPDATE public.preguntas
SET
  enunciado = 'Considera los números reales a y b, ambos distintos de cero.
¿Cuál de las siguientes relaciones permite asegurar que(a -b) 2 = a -b?',
  alternativas = '[{"letra":"A","texto":"(a + b) 2 = a + b","es_correcta":false},{"letra":"B","texto":"a 2 -b 2 = a -b","es_correcta":false},{"letra":"C","texto":"a -b > 0","es_correcta":true},{"letra":"D","texto":"a -b < 0","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-06';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál es el valor de 6 4 · 3 5?',
  alternativas = '[{"letra":"A","texto":"3 10","es_correcta":true},{"letra":"B","texto":"9 20","es_correcta":false},{"letra":"C","texto":"9 10","es_correcta":false},{"letra":"D","texto":"18 20","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-07';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál de las siguientes expresiones es igual a 5 x · 2 x + y?',
  alternativas = '[{"letra":"A","texto":"10 x · 2 y","es_correcta":true},{"letra":"B","texto":"10 2 x · 2 y","es_correcta":false},{"letra":"C","texto":"10 2 x + y","es_correcta":false},{"letra":"D","texto":"10 x 2 + xy","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-08';

UPDATE public.preguntas
SET
  enunciado = 'Una queda sustancia la mitad de radiactiva la masa se inicial. desintegra de tal forma que después de una hora
En de observación. la tabla adjunta se registra la masa de sustancia en las primeras cuatro horas
Tiempo transcurrido (horas) Masa de sustancia (gramos)
1 5,2 · 10 2 · ( (( 1 2 ) )) 1
2 5,2 · 10 2 · ( (( 1 2 ) )) 2
3 5,2 · 10 2 · ( (( 1 2 ) )) 3
4 5,2 · 10 2 · ( (( 1 2 ) )) 4
¿Cuál coordenados? de los siguientes puntos está correctamente graficado en los ejes',
  alternativas = '[{"letra":"A","texto":"Masa de sustancia en gramos B) Masa de sustancia en gramos 54 2 5 2 2 1 Tiempo transcurrido en horas Tiempo transcurrido en horas","es_correcta":false},{"letra":"B","texto":"Opción B (ver figura)","es_correcta":false},{"letra":"C","texto":"Masa de sustancia en gramos D) Masa de sustancia en gramos 52 4 2,53 Tiempo 3 transcurrido en horas Tiempo 4 transcurrido en horas","es_correcta":false},{"letra":"D","texto":"Opción D (ver figura)","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-09';

UPDATE public.preguntas
SET
  enunciado = 'En la siguiente tabla se presentan los valores aproximados de log N para algunos
números N:
N log N N log N
1 0 6 0,778
2 0,301 7 0,845
3 0,477 8 0,903
4 0,602 9 0,954
5 0,699 10 1
Considerando los valores de la tabla, ¿cuál es el valor de log 35 000?',
  alternativas = '[{"letra":"A","texto":"0,699 · 0,845 · 3","es_correcta":false},{"letra":"B","texto":"0,699 · 0,845 · 1","es_correcta":false},{"letra":"C","texto":"0,699 + 0,845 + 3","es_correcta":true},{"letra":"D","texto":"0,699 + 0,845 + 1","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-12';

UPDATE public.preguntas
SET
  enunciado = 'Si p, b y c son números reales mayores que 1 tal que logp b = c, ¿cuál de las
siguientes expresiones es igual a log p ( (( 1 b ) )) + log 1 p b?',
  alternativas = '[{"letra":"A","texto":"-2 c","es_correcta":true},{"letra":"B","texto":"2 c","es_correcta":false},{"letra":"C","texto":"2 c","es_correcta":false},{"letra":"D","texto":"-c + 1 c","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-13';

UPDATE public.preguntas
SET
  enunciado = 'Bajo días. condiciones especiales, la población de cierto tipo de bacterias se triplica cada
10
En esas condiciones, si una colonia de este tipo tiene inicialmente
8 · 10 5 bacterias, ¿cuál será su población de bacterias al término de 50 días?',
  alternativas = '[{"letra":"A","texto":"8 · 30 5","es_correcta":true},{"letra":"B","texto":"8 · 10 5 · 3 50","es_correcta":false},{"letra":"C","texto":"15 · 8 · 10 5","es_correcta":false},{"letra":"D","texto":"150 · 8 · 10 5","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-14';

UPDATE public.preguntas
SET
  enunciado = 'Un banco garantiza una tasa de interés trimestral de 5,2 % para los depósitos a
plazo. depositar La es: función que modela C el = capital M(1 + N final)n que tendrá una persona luego de
en la que M corresponde al capital inicial, N es la tasa de interés expresada
como banco. decimal y n es la cantidad de trimestres que se mantiene el dinero en el
Si una persona hace un solo depósito inicial de$2 500 000 en ese banco, ¿cuál es
la expresión que representa el capital final que tendrá esta persona después de
2 años?',
  alternativas = '[{"letra":"A","texto":"$2 500 000 ·(1,25)8","es_correcta":false},{"letra":"B","texto":"$2 500 000 ·(1,025)8","es_correcta":true},{"letra":"C","texto":"D)$$2 2 500 500 $000.000· ·((,1 1,025 25 8 8 --)1)1","es_correcta":false},{"letra":"D","texto":"Opción D (ver figura)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-16';

UPDATE public.preguntas
SET
  enunciado = 'El descontar total sueldo imponible. líquido del total es de el haberes, monto total las cotizaciones que recibe una obligatorias persona y que voluntarias trabaja, del luego sueldo de
Considera la siguiente liquidación de sueldo de una persona:
LIQUIDACIÓN DE SUELDO
DATOS DEL(A) TRABAJADOR(A)
RUT: 1*.***.***-8
NOMBRE: ****a ****r *****s
Período de Remuneración: 31 días Mes: Enero Año: 2022
Haberes del Trabajador Valor
Sueldo Base$700.000
Horas Extras$50.000 SUELDO DESCUENTOS IMPONIBLE Valor
Aguinaldo$50.000 Cotización (10 Previsional %) AFP$80.000
Sueldo total imponible$800.000 Cotización (7 %) Salud$56.000
Bono Movilización Sueldo de total la empresa no Imponible$$$100 150 50 $000.000000 Cotización TOTAL PREVISIONALES (a DESCUENTOS %) Voluntaria X Y
Total de Haberes$950.000
DETALLE DE REMUNERACIÓN
SUELDO LIQUIDO A PAGAR $Z
¿Cuál del número es la “a expresión ” del porcentaje que representa de cotización el sueldo voluntaria, líquido de en esta pesos? persona en función',
  alternativas = '[{"letra":"A","texto":"Opción A (ver figura)","es_correcta":false},{"letra":"B","texto":"A) 950 950 $000.000· · ( (( ( (( 1 1 --17(100 17 100 + + a a ) ))))) )","es_correcta":false},{"letra":"C","texto":"800 000 · ( (( 1 -17 100 + a ) )) + 150 000","es_correcta":true},{"letra":"D","texto":"800 000 · ( (( 1 -(100 17 + a) ) )) + 150 000","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-17';

UPDATE public.preguntas
SET
  enunciado = 'Considera la figura adjunta formada por tres cuadrados, uno de lado a metros
y otros dos de área p 2 metros cuadrados, cada uno.
a metros
¿Cuál metros de cuadrados? las siguientes expresiones representa el área de la zona gris en',
  alternativas = '[{"letra":"A","texto":"(a -2 p)(a + 2 p)","es_correcta":false},{"letra":"B","texto":"(a -2 p)(a + 2 p)","es_correcta":true},{"letra":"C","texto":"2(a -p)2","es_correcta":false},{"letra":"D","texto":"(a -2 p)2","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-18';

UPDATE public.preguntas
SET
  enunciado = 'lineal Considera entre la la siguiente profundidad gráfica, en que metros, corresponde de un objeto a la función sumergido que modela y la presión la relación que el
t
agua ejerce sobre este.
Presión (Pa)
10
1
90 Profundidad (m)
¿Cuál de las siguientes funciones modela la presión, en Pa, que el agua ejerce
sobre el objeto, respecto de t, en metros?',
  alternativas = '[{"letra":"A","texto":"f)t(= 90 · t","es_correcta":false},{"letra":"B","texto":"g)t(= 10 · t + 1","es_correcta":false},{"letra":"C","texto":"h)t(= 1,0 · t","es_correcta":false},{"letra":"D","texto":"n)t(= 1,0 · t + 1","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-19';

UPDATE public.preguntas
SET
  enunciado = 'El compuesto azúcar formado de mesa, por cuyo carbono, nombre hidrógeno químico y oxígeno. es sacarosa, corresponde a un
masas gráfica En directamente un de experimento se sacarosa. relaciona proporcional hipotético la masa a se la de utiliza masa agua sacarosa de obtenida sacarosa para en el utilizada. obtener experimento agua En la de con siguiente manera varias
Agua (g)
171
150 500 Sacarosa g()
¿Cuál de las siguientes expresiones representa la masa en gramos de sacarosa
(S) necesarios para obtener cierta masa en gramos de agua(A)?',
  alternativas = '[{"letra":"A","texto":"S = 100 57 · A","es_correcta":false},{"letra":"B","texto":"S = 57 100 · A","es_correcta":false},{"letra":"C","texto":"S = 100 57 · A","es_correcta":true},{"letra":"D","texto":"S = 57 100 · A","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-21';

UPDATE public.preguntas
SET
  enunciado = 'En escalas el gráfico de temperaturas. adjunto se presentan ciertas temperaturas medidas en distintas
temperatura de registrada superficie Menor la en Tierra la de amonio, Temperatura Fahrenheit y mezcla Agua sal de hielo en de fusión bajo atmósfera Punto de (0o) presión del una de hielo Temperatura superficie promedio la (15oC) Tierra la en de promedio Temperatura humano cuerpo (37oC) del temperatura de registrada superficie Mayor la en Tierra la bajo atmósfera ebullición Punto del de presión agua una de
La ecuación de equivalencia entre una escala de temperatura y otra es siempre
una ecuación lineal, por ejemplo la ecuación ° F = 9 5 ° C + 32 es la ecuación de
equivalencia entre grados Celsius y grados Fahrenheit.
Si la ecuación de equivalencia de grados Newton y grados Delisle es
° D = a ° N + b, ¿cuáles son los signos de a y b?',
  alternativas = '[{"letra":"A","texto":"a > 0 y b > 0","es_correcta":false},{"letra":"B","texto":"a > 0 y b < 0","es_correcta":false},{"letra":"C","texto":"a < 0 y b > 0","es_correcta":true},{"letra":"D","texto":"a < 0 y b < 0","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-22';

UPDATE public.preguntas
SET
  enunciado = 'Considera la inecuación 4 5 x -6 m < -10 1 + 2 3 x, en x, tal que m es un número
real.
Si el conjunto solución de la inecuación es ] -∞, -[2, ¿cuál es el valor de m?',
  alternativas = '[{"letra":"A","texto":"-1","es_correcta":true},{"letra":"B","texto":"-11 5","es_correcta":false},{"letra":"C","texto":"1","es_correcta":false},{"letra":"D","texto":"-9 5","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-23';

UPDATE public.preguntas
SET
  enunciado = '¿Para px + qx qué -2 p -valores 3 q = 2 x de + 1 p, para y todo q, respectivamente, número real x? se cumple la igualdad',
  alternativas = '[{"letra":"A","texto":"5 y -3","es_correcta":false},{"letra":"B","texto":"7 y -5","es_correcta":true},{"letra":"C","texto":"7 5 y 5 3","es_correcta":false},{"letra":"D","texto":"1 y -1","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-26';

UPDATE public.preguntas
SET
  enunciado = 'Si m y n son las soluciones de la ecuación cuadrática 5 x 2 + x -5 = 0, ¿cuál es
el valor de ( (( ( m m + n n ) )) ) -1?',
  alternativas = '[{"letra":"A","texto":"5","es_correcta":true},{"letra":"B","texto":"1 5","es_correcta":false},{"letra":"C","texto":"-1 5","es_correcta":false},{"letra":"D","texto":"-1","es_correcta":false},{"letra":"E","texto":"-5","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-30';

UPDATE public.preguntas
SET
  enunciado = 'Considera el triángulo ABC, con AB = BC = 12 cm y sea x la medida, en cm,
de la altura trazada desde el vértice B, la cual excede en 3 cm a la medida de
AC.
¿Cuál de las siguientes ecuaciones permite calcular x?',
  alternativas = '[{"letra":"A","texto":"2 x 2 -6 x = 135","es_correcta":false},{"letra":"B","texto":"5 x 2 + 6 x = 567","es_correcta":false},{"letra":"C","texto":"2 x 2 + 6 x = 135","es_correcta":false},{"letra":"D","texto":"5 x 2 -6 x = 567","es_correcta":true},{"letra":"E","texto":"5 x 2 -6 x = 135","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-32';

UPDATE public.preguntas
SET
  enunciado = 'conjunto La parábola de los de números la figura reales, representa definida la gráfica por f() x de = la(x función + 1) -1 f., con dominio el
2
Y
1 X
Si traslación a esta parábola según el vector se le aplica(,0)1, una ¿cuál reflexión es la función con respecto que corresponde al eje Y, a luego la gráfica una
que se obtiene?',
  alternativas = '[{"letra":"A","texto":"g() x = x 2 + 1","es_correcta":false},{"letra":"B","texto":"h() x =(x -1)2","es_correcta":true},{"letra":"C","texto":"t() x = x 2 -1","es_correcta":false},{"letra":"D","texto":"s() x =(x -1) 2 + 1","es_correcta":false},{"letra":"E","texto":"r() x =(x + 1) 2 + 1","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-33';

UPDATE public.preguntas
SET
  enunciado = 'Un estanque de altura b cm que se encuentra lleno de agua, comienza a perder
agua de manera constante, sin llegar a vaciarse por completo.
La función p, con dominio [ [ [ ,0 -a b 2 [ [ [, que modela la altura del agua que va
quedando en el estanque, medida en cm, está dada por p)t(= a b t + b, tal que t
es perder el tiempo agua. transcurrido, medido en horas desde que el estanque comienza a
¿Cuál de las siguientes expresiones representa el tiempo t, en horas, que debe
transcurrir para que la altura del agua que queda sea 2 3 b cm?',
  alternativas = '[{"letra":"A","texto":"-2 3 b a 2","es_correcta":false},{"letra":"B","texto":"-b2 3 a","es_correcta":true},{"letra":"C","texto":"2 b 2 3 -a 3 b","es_correcta":false},{"letra":"D","texto":"4 3 b a 2","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-34';

UPDATE public.preguntas
SET
  enunciado = 'homotecia, En la figura obteniéndose adjunta se presenta el cuadrado el cuadrado APQR, donde ABCD P,(al -2, que 0) se es la le imagen aplica una de
B(3, 0).
Y
D C
P A
B X
Q R
¿Cuál de las siguientes afirmaciones es verdadera?',
  alternativas = '[{"letra":"A","texto":"La 180 homotecia ° con respecto aplicada al centro al cuadrado de homotecia. ABCD es equivalente a una rotación de","es_correcta":false},{"letra":"B","texto":"Si k es la razón de homotecia, entonces k pertenece al intervalo 0 < k < 1.","es_correcta":false},{"letra":"C","texto":"Si k es la razón de homotecia y se considera el punto D(0, y), entonces las coordenadas de su imagen R son(0, ky).","es_correcta":true},{"letra":"D","texto":"La razón de homotecia k es -3 2.","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-36';

UPDATE public.preguntas
SET
  enunciado = 'negativo. Considera los números reales a y b distintos de cero y c un número real
Si el vector (a, b) está en el segundo cuadrante del plano cartesiano, ¿cuál de
las siguientes afirmaciones es siempre verdadera?',
  alternativas = '[{"letra":"A","texto":"El vector (a + ,c b + c) está en el tercer cuadrante.","es_correcta":false},{"letra":"B","texto":"El vector c(a, b) está en el primer cuadrante.","es_correcta":false},{"letra":"C","texto":"El vector (a -,c b) está en el segundo cuadrante.","es_correcta":false},{"letra":"D","texto":"El vector (a, -cb) está en el tercer cuadrante.","es_correcta":false},{"letra":"E","texto":"El vector (,b a + c) está en el cuarto cuadrante.","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-38';

UPDATE public.preguntas
SET
  enunciado = 'Al punto C(-,1 7) se le aplica una traslación según el vector (-,2 -)3 y luego al
punto trasladado se le aplica una rotación en 90 ° con centro en el origen y en
sentido antihorario, obteniéndose un nuevo punto.
¿Cuáles son las coordenadas de este último punto obtenido?',
  alternativas = '[{"letra":"A","texto":"(3, 4)","es_correcta":false},{"letra":"B","texto":"(,4)3","es_correcta":false},{"letra":"C","texto":"(-,4)3","es_correcta":false},{"letra":"D","texto":"(-,4 -)3","es_correcta":true},{"letra":"E","texto":"(4, -)3","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-39';

UPDATE public.preguntas
SET
  enunciado = 'madriguera desplaza Una nutria constantemente en está el otro intentando lado en del la cruzar río dirección en un el punto río que desde indica B. Sin el la embargo, figura punto adjunta. A la hasta corriente llegar del río a su la
Y
4 A
Madriguera Corriente del río
B
-1 3 X
Si la corriente del río desplazará a la nutria según el vector v = ,r(0), con r > 0,
¿cuál el punto de los para siguientes llegar a vectores su madriguera? indica la dirección que debe tomar la nutria desde
A',
  alternativas = '[{"letra":"A","texto":"n =(-,4 -4)","es_correcta":false},{"letra":"B","texto":"m =(-,4 )r","es_correcta":false},{"letra":"C","texto":"q =(r, -4)","es_correcta":true},{"letra":"D","texto":"s =(,r )r","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-40';

UPDATE public.preguntas
SET
  enunciado = 'Considera los vectores v =(a, b) y u =(c, d), con a, b, c y d números reales.
Si w = u + v, ¿cuál de las siguientes relaciones permite deducir que el vector w
se encuentra en el primer cuadrante?',
  alternativas = '[{"letra":"A","texto":"a < c y b < d","es_correcta":false},{"letra":"B","texto":"a > c y b > d","es_correcta":false},{"letra":"C","texto":"ac > 0 y bd > 0","es_correcta":false},{"letra":"D","texto":"a > b > c > d > 0","es_correcta":true},{"letra":"E","texto":"a = b = c = d","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-41';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál es el área del triángulo de vértices A(,p 2 p), B(p -,2 2 p) y C(p -,2 p),
con p un número real negativo?',
  alternativas = '[{"letra":"A","texto":"(p -2 2) · 2 p","es_correcta":false},{"letra":"B","texto":"(p -2 2) · p","es_correcta":false},{"letra":"C","texto":"-p","es_correcta":true},{"letra":"D","texto":"-2 p","es_correcta":false},{"letra":"E","texto":"(p -2)2 ·","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-42';

UPDATE public.preguntas
SET
  enunciado = 'En sus la vértices figura adjunta O coincide se representa con el centro a un de triángulo una circunferencia rectángulo de con modo radio que 6 cm uno y de el
otro vértice B está sobre la circunferencia.
B
A 60 ° O
Se realiza el siguiente procedimiento para determinar la longitud de OA,
cometiéndose un error:
Paso 1: se plantea la ecuación cos 60 ° = OB AB.
Paso 2: se AB= reemplaza 3. en la ecuación y se obtiene 1 2 = AB 6, lo cual equivale a
Paso 3: se aplica el teorema de Pitágoras, obteniéndose 9 + OA 2 = 36.
Paso 4: se resuelve la ecuación para concluir que OA mide 27 cm.
¿En cuál de los pasos se cometió el error?',
  alternativas = '[{"letra":"A","texto":"En el Paso 1","es_correcta":true},{"letra":"B","texto":"En el Paso 2","es_correcta":false},{"letra":"C","texto":"En el Paso 3","es_correcta":false},{"letra":"D","texto":"En el Paso 4","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-43';

UPDATE public.preguntas
SET
  enunciado = 'En rindieron la tabla una adjunta prueba se de presenta historia en la dos cantidad horarios de distintos. estudiantes de dos cursos que
Horario 1 Horario 2
Cantidad de estudiantes del curso A x 2x
Cantidad de estudiantes del curso B 2y y
Promedio de estudiantes notas obtenidas de cada en horario la prueba por los p q
¿Cuál obtenido de en las la siguientes prueba considerando expresiones a todos representa los estudiantes? siempre el promedio general',
  alternativas = '[{"letra":"A","texto":"(x + 2 y 3)(p x + +(y 2) x + y) q","es_correcta":true},{"letra":"B","texto":"(x + 2 x 3)(p x + +(y 2) y + y) q","es_correcta":false},{"letra":"C","texto":"1 2 · ( (( ( x + p 2 y + 2 x q + y ) )) )","es_correcta":false},{"letra":"D","texto":"(x + 2 y 3)(q x + +(y 2) x + y) p","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-47';

UPDATE public.preguntas
SET
  enunciado = 'Considera probabilidad dos 6,0, sucesos mientras que independientes la probabilidad entre de que sí. ocurra El suceso simultáneamente A ocurre con con
el suceso B es 3,0.
¿Cuál es la probabilidad de que ocurra el suceso B?',
  alternativas = '[{"letra":"A","texto":"0,18","es_correcta":false},{"letra":"B","texto":"0,30","es_correcta":false},{"letra":"C","texto":"0,50","es_correcta":true},{"letra":"D","texto":"0,90","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-49';

UPDATE public.preguntas
SET
  enunciado = 'En una caja se tienen 17 bolitas, del mismo tipo, numeradas del 1 al 17.
Si se extraen, sin reposición, 4 bolitas al azar, ¿cuál es la probabilidad de
obtener 4 números impares?',
  alternativas = '[{"letra":"A","texto":"( (( 17 9 ) )) 4","es_correcta":false},{"letra":"B","texto":"( (( 1 9 ) )) 4","es_correcta":false},{"letra":"C","texto":"4 · 17 9","es_correcta":false},{"letra":"D","texto":"4 · 1 9","es_correcta":false},{"letra":"E","texto":"170 9","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-50';

UPDATE public.preguntas
SET
  enunciado = 'Considera la función f, cuyo dominio es el conjunto de los números reales,
definida por f(x) = ax 2 + 3 x + c, con a y c números reales distintos de cero.
Se puede determinar que la gráfica de f no interseca al eje X, si se sabe que:
(1) a = c
(2) a ∈ ] ]] 3 2, ∞ [ [[',
  alternativas = '[{"letra":"A","texto":"(1) por sí sola","es_correcta":false},{"letra":"B","texto":"(2) por sí sola","es_correcta":false},{"letra":"C","texto":"Ambas juntas, (1) y (2)","es_correcta":true},{"letra":"D","texto":"Cada una por sí sola, (1) ó (2)","es_correcta":false},{"letra":"E","texto":"Se requiere información adicional","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-52';

UPDATE public.preguntas
SET
  enunciado = 'Considera el siguiente cuadrilátero:
b2
D C
p
A B
b1
Se puede determinar que el área del cuadrilátero ABCD es(b 1 + 2 b 2) p, si se
sabe que:
(1) AB // DC
(2) b 1 + b 2 = 2 p',
  alternativas = '[{"letra":"A","texto":"(1) por sí sola","es_correcta":false},{"letra":"B","texto":"(2) por sí sola","es_correcta":false},{"letra":"C","texto":"Ambas juntas, (1) y (2)","es_correcta":false},{"letra":"D","texto":"Cada una por sí sola, (1) ó (2)","es_correcta":false},{"letra":"E","texto":"Se requiere información adicional","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-24reg-53';

UPDATE public.preguntas
SET
  enunciado = 'Considera la siguiente recta numérica:
¿Cuál de las siguientes desigualdades es verdadera?',
  alternativas = '[{"letra":"A","texto":"-0,75 < A B < -0,25","es_correcta":false},{"letra":"B","texto":"0 < A B < 0,25","es_correcta":false},{"letra":"C","texto":"0,25 < A B < ,0 6","es_correcta":true},{"letra":"D","texto":",0 6 < A B < ,1 6","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-01';

UPDATE public.preguntas
SET
  enunciado = 'Si a = ( (( 1 2 ) )), b = 4 101 y c = 8 2 300, ¿cuál de las siguientes relaciones es
verdadera?',
  alternativas = '[{"letra":"A","texto":"a < b \\le  c","es_correcta":false},{"letra":"B","texto":"a = b < c","es_correcta":true},{"letra":"C","texto":"c < a = b","es_correcta":false},{"letra":"D","texto":"a < c \\le  b","es_correcta":false},{"letra":"E","texto":"c < a < b","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-03';

UPDATE public.preguntas
SET
  enunciado = 'Considera los números enteros p y q distintos de cero.
¿Cuál de las siguientes condiciones asegura que 1 p + q 1 sea un número
racional?',
  alternativas = '[{"letra":"A","texto":"Que(p + q) sea múltiplo de p · q.","es_correcta":false},{"letra":"B","texto":"Que p + q sea un cuadrado perfecto.","es_correcta":false},{"letra":"C","texto":"Que p sea igual a -q.","es_correcta":true},{"letra":"D","texto":"Que p y q sean cuadrados perfectos.","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-04';

UPDATE public.preguntas
SET
  enunciado = 'Si p = 2 3, q = 3 2 y s = ( (( ( q p ) )) ), ¿cuál de las siguientes relaciones es
verdadera?',
  alternativas = '[{"letra":"A","texto":"p < q < s","es_correcta":false},{"letra":"B","texto":"p -s < s -q","es_correcta":false},{"letra":"C","texto":"q -p < s","es_correcta":false},{"letra":"D","texto":"p 2 -q 3 < s","es_correcta":true},{"letra":"E","texto":"1 p < q 1 < 1 s","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-05';

UPDATE public.preguntas
SET
  enunciado = 'Considera las ecuaciones x 8 = 2, 2r = 1 4 y log5 w = 1 2.
¿En cuál de las siguientes rectas se representa mejor la suma x + r + w?',
  alternativas = '[{"letra":"A","texto":"","es_correcta":false},{"letra":"B","texto":"","es_correcta":true},{"letra":"C","texto":"","es_correcta":false},{"letra":"D","texto":"","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-06';

UPDATE public.preguntas
SET
  enunciado = 'Considera que la esperanza de vida (EV) en los países, en años, se puede
relacionar con su producto interno bruto (PIB), en dólares, con la siguiente
relación:
EV = a · log(PIB) + b, en la que a y b son constantes positivas.
Si la esperanza de vida del país A es x años y su PIB es 10 veces el del país B,
¿cuál de las siguientes expresiones representa la esperanza de vida, en años,
en el país B según el modelo?',
  alternativas = '[{"letra":"A","texto":"10 x","es_correcta":false},{"letra":"B","texto":"x + a","es_correcta":false},{"letra":"C","texto":"x -a","es_correcta":true},{"letra":"D","texto":"(x + 1)a","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-07';

UPDATE public.preguntas
SET
  enunciado = 'Si p < q y p \ne  -q, ¿cuál de las siguientes expresiones es igual a
(p 2 -p q + 2)(q p -q)?',
  alternativas = '[{"letra":"A","texto":"p p 3 + -q q 3","es_correcta":false},{"letra":"B","texto":"p p 3 + + q q 3","es_correcta":false},{"letra":"C","texto":"(p -q) · p p + -q q","es_correcta":false},{"letra":"D","texto":"p 2 -q 2","es_correcta":false},{"letra":"E","texto":"q -p","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-08';

UPDATE public.preguntas
SET
  enunciado = 'Si p = log 2, ¿cuál de las siguientes expresiones es igual a log log 20 5?',
  alternativas = '[{"letra":"A","texto":"-2 p","es_correcta":false},{"letra":"B","texto":"1 p -+ p 1","es_correcta":true},{"letra":"C","texto":"1 4","es_correcta":false},{"letra":"D","texto":"0","es_correcta":false},{"letra":"E","texto":"p 1 2","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-10';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál es el valor de log 25 + log 2?',
  alternativas = '[{"letra":"A","texto":"1","es_correcta":true},{"letra":"B","texto":"log 50","es_correcta":false},{"letra":"C","texto":"log(25 + 2)","es_correcta":false},{"letra":"D","texto":"1 2 log 27","es_correcta":false},{"letra":"E","texto":"log 7","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-11';

UPDATE public.preguntas
SET
  enunciado = 'Una persona hizo un depósito a plazo renovable a 30 días, con una tasa de
interés del 3,0 %.
Esta persona renovó el depósito por otros 30 días y la tasa de interés aumentó
en un 100 % en este periodo, comparado con el periodo anterior.
Si su depósito inicial era de$k, ¿cuál de las siguientes expresiones representa
la ganancia, en pesos, generada en estos dos periodos?',
  alternativas = '[{"letra":"A","texto":"k · 1,009","es_correcta":false},{"letra":"B","texto":"k · 1,009 -k","es_correcta":false},{"letra":"C","texto":"k(1,003)(1,006)","es_correcta":false},{"letra":"D","texto":"k(1,003)(1,006) -k","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-13';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál de las siguientes expresiones es igual a 25 x 2 -y 2?',
  alternativas = '[{"letra":"A","texto":"(5 x -y)2","es_correcta":false},{"letra":"B","texto":"(25 x -y)(x + y)","es_correcta":false},{"letra":"C","texto":"25(x + y)(x -y)","es_correcta":false},{"letra":"D","texto":"(5 x + y)(5 x -y)","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-15';

UPDATE public.preguntas
SET
  enunciado = 'Si a y b son constantes, ¿cuál debe ser el valor de b para que se cumpla la
igualdad x 2 -5 x + 6 =(x + a) 2 + b?',
  alternativas = '[{"letra":"A","texto":"-1 4","es_correcta":true},{"letra":"B","texto":"-13 2","es_correcta":false},{"letra":"C","texto":"6","es_correcta":false},{"letra":"D","texto":"13 2","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-16';

UPDATE public.preguntas
SET
  enunciado = 'Considera que el peso corregido depende del peso ideal() y y del peso real() x de
una persona, de la siguiente forma:
Peso corregido = y +(x -y) · 0,25
¿Cuál de las siguientes expresiones permite calcular el peso corregido de cualquier
persona cuyo peso real excede en un 40 % su peso ideal?',
  alternativas = '[{"letra":"A","texto":"0,70 · x","es_correcta":false},{"letra":"B","texto":"0,90 · y","es_correcta":false},{"letra":"C","texto":"1,10 · y","es_correcta":true},{"letra":"D","texto":"1,30 · x","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-17';

UPDATE public.preguntas
SET
  enunciado = 'Una persona recorre en su vehículo una distancia de 700 km en
10 horas y media. El recorrido está dividido en tres tramos. El primero y el último
son de asfalto y tienen una longitud de 250 km y 245 km, respectivamente, y
cada uno de estos los recorre con una rapidez media de 90 km h.
¿Cuál de las siguientes expresiones representa la rapidez media del vehículo en
el segundo tramo, en km h?',
  alternativas = '[{"letra":"A","texto":"90 250 · 495 · 245 · 205","es_correcta":false},{"letra":"B","texto":"10 5, 205 -495 90","es_correcta":true},{"letra":"C","texto":"700 -205 495 · 90","es_correcta":false},{"letra":"D","texto":"10 5, · 700 205 -495 · 90","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-18';

UPDATE public.preguntas
SET
  enunciado = 'Un laboratorio farmacéutico testea un medicamento sobre dos grupos de
bacterias. tipo rango de [ -bacterias ,3 El 9 ], rango también es de [ -,1 en temperatura 10 grados [, mientras Celsius. de que proliferación, el otro tipo de en bacterias grados Celsius, prolifera de en un el
El laboratorista debe establecer la temperatura del horno de cultivo
bacteriológico de manera tal que ambos tipos de bacterias proliferen.
No temperatura obstante, de debe proliferación evitar que es un ] -tercer ,8 [8, tipo en grados de bacterias Celsius. prolifere, cuyo rango de
¿Cuál de las siguientes expresiones representa el rango de temperaturas, en
grados Celsius, a la que el laboratorista debe fijar el horno bacteriológico de
cultivo, para cumplir con las condiciones deseadas?',
  alternativas = '[{"letra":"A","texto":"] -8,10 [","es_correcta":false},{"letra":"B","texto":"[ -,1 [8","es_correcta":false},{"letra":"C","texto":"[ ,8 9 ]","es_correcta":true},{"letra":"D","texto":"[ 8,10 [","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-19';

UPDATE public.preguntas
SET
  enunciado = 'Considera los números reales p y b, tal que p es mayor o igual que -4 y
menor que 3, y b es mayor que -1 2 y menor que 3 2.
¿Cuál de los siguientes conjuntos representa únicamente a todos los valores
posibles de p · b?',
  alternativas = '[{"letra":"A","texto":"[ [[ ,2 9 2 [ [[","es_correcta":false},{"letra":"B","texto":"] ]] ,2 9 2 [ [[","es_correcta":false},{"letra":"C","texto":"]- ]] ,6 9 2 [ [[","es_correcta":true},{"letra":"D","texto":"[- [[ ,6 9 2 [ [[","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-20';

UPDATE public.preguntas
SET
  enunciado = 'Si x debe ser un número real positivo, ¿cuál es el conjunto solución de la
inecuación x + 3 < 7?',
  alternativas = '[{"letra":"A","texto":"] -∞, 4 [","es_correcta":false},{"letra":"B","texto":"] ,0 4 [","es_correcta":true},{"letra":"C","texto":"] 0,10 [","es_correcta":false},{"letra":"D","texto":"{ ,1 ,2 3 }","es_correcta":false},{"letra":"E","texto":"] ,4 ∞ [","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-21';

UPDATE public.preguntas
SET
  enunciado = 'En el siguiente gráfico se representa una función f de la forma f() x = 2 x + c,
cuyo dominio es el conjunto de los números reales.
¿Cuál de las siguientes expresiones representa a q en términos de a?',
  alternativas = '[{"letra":"A","texto":"2 a + 2","es_correcta":true},{"letra":"B","texto":"2 a + 3","es_correcta":false},{"letra":"C","texto":"2 a + 5","es_correcta":false},{"letra":"D","texto":"2 a + 6","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-22';

UPDATE public.preguntas
SET
  enunciado = 'Considera dos mezclas de agua y endulzante. La primera mezcla está formada por
un 90 % de agua y el resto endulzante, mientras que otra está formada por un
2 % de endulzante y el resto agua.
Una persona quiere generar una tercera mezcla combinando las dos anteriores, tal
que se generen 10 litros y que tenga un 7 % de endulzante y el resto agua.
¿Cuál de los siguientes sistemas de ecuaciones permite determinar la cantidad de
litros A de la primera mezcla y la cantidad de litros B de la segunda mezcla que
tendría la tercera mezcla?',
  alternativas = '[{"letra":"A","texto":"A + B = 10 9,0 A + 0,02 B = 0,07 · 10","es_correcta":false},{"letra":"B","texto":"1,0 A + 0,02 B = 0,07(A + B) A + B = 0,07 · 10","es_correcta":false},{"letra":"C","texto":"1,0 A + 0,02 B = 0,07 · 10 A + B = 10","es_correcta":true},{"letra":"D","texto":"9,0 A + 0,02 B = 10 A + B = 0,07(A + B)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-23';

UPDATE public.preguntas
SET
  enunciado = 'Considera las funciones f y g definidas por f() x = -2 x + 7 y g() x = x + 4,
ambas con dominio el conjunto de los números reales. En la figura adjunta se
representan las gráficas de f y g.
¿Cuál es el área del triángulo que se forma entre las gráficas de f, g y el
eje X, en unidades cuadradas?',
  alternativas = '[{"letra":"A","texto":"15 4","es_correcta":false},{"letra":"B","texto":"15 2","es_correcta":false},{"letra":"C","texto":"75 2","es_correcta":false},{"letra":"D","texto":"75 4","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-25';

UPDATE public.preguntas
SET
  enunciado = 'El tiempo nivel t, n en, en horas, centímetros, se modela que según alcanza la función el agua n() t = en at + un b. depósito, durante un
Inicialmente, el depósito contiene agua y al cabo de tres horas, el nivel que alcanza
el agua es de 273 cm.
Si el nivel inicial del agua es el cuádruple de lo que aumenta el nivel cada hora,
¿cuál es el nivel del agua al cabo de cinco horas?',
  alternativas = '[{"letra":"A","texto":"275 cm","es_correcta":false},{"letra":"B","texto":"351 cm","es_correcta":true},{"letra":"C","texto":"441 cm","es_correcta":false},{"letra":"D","texto":"455 cm","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-26';

UPDATE public.preguntas
SET
  enunciado = 'La densidad es una magnitud que mide la cantidad de masa que tiene un material
por unidad de volumen.
Esta magnitud se define como ρ = M V, tal que ρ es la densidad, M es la masa y
V es el volumen del material.
Considera un material que tiene forma cilíndrica con altura H, radio r y masa M.
Para determinar la densidad ρ del material se utiliza el modelo ρ = 4\pi  Hx M 2.
¿Cuál de las siguientes medidas representa la variable x en el modelo?',
  alternativas = '[{"letra":"A","texto":"El área de la base del cilindro","es_correcta":false},{"letra":"B","texto":"El radio de la base del cilindro","es_correcta":false},{"letra":"C","texto":"El diámetro de la base del cilindro","es_correcta":false},{"letra":"D","texto":"El perímetro de la base del cilindro","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-27';

UPDATE public.preguntas
SET
  enunciado = 'En la figura adjunta se representa la gráfica de la función cuadrática f, cuyo
dominio es el conjunto de los números reales.
Y
50
¿Cuál de las siguientes expresiones corresponde a f() x?',
  alternativas = '[{"letra":"A","texto":"(x + 5) 2 + 50","es_correcta":false},{"letra":"B","texto":"2 x 2 -20 x + 50","es_correcta":false},{"letra":"C","texto":"2 x 2 + 20 x + 50","es_correcta":true},{"letra":"D","texto":"(x -5) 2 + 50","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-29';

UPDATE public.preguntas
SET
  enunciado = 'Considera la ecuación x2 + bx -2 b = 0, con b un número real.
¿Cuál de los siguientes intervalos contiene únicamente a todos los posibles valores
de b que garantizan que la ecuación no tiene solución en el conjunto de los
números reales?',
  alternativas = '[{"letra":"A","texto":"[ -,8 0 ]","es_correcta":false},{"letra":"B","texto":"] -∞, -8 ] ∪ [ ,0 ∞ [","es_correcta":false},{"letra":"C","texto":"] -,8 [0","es_correcta":true},{"letra":"D","texto":"] -∞, -8 [ ∪ ] ,0 ∞ [","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-30';

UPDATE public.preguntas
SET
  enunciado = 'El volumen de agua de un pozo, en 3 m, después de t horas es V ()t y se modela
por la función V() t = -a 2 t 2 + v 0, con a > 0.
¿Cuál de las siguientes afirmaciones es siempre verdadera?',
  alternativas = '[{"letra":"A","texto":"El volumen inicial es 0 3 m.","es_correcta":false},{"letra":"B","texto":"El volumen del agua aumenta a medida que aumenta el tiempo.","es_correcta":false},{"letra":"C","texto":"El máximo volumen de agua del pozo es v 0 3 m.","es_correcta":true},{"letra":"D","texto":"El pozo queda sin agua en t = 2 v a 0.","es_correcta":false},{"letra":"E","texto":"El volumen de agua del pozo es(2 a + v 0) 3 m, cuando t = 2.","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-31';

UPDATE public.preguntas
SET
  enunciado = 'A la circunferencia de radio OA de la figura adjunta se le aplica una homotecia
con centro O y razón positiva, obteniéndose una circunferencia de radio OB.
Este radio mide 6 cm menos que el radio de la circunferencia anterior.
¿Cuál de las siguientes expresiones representa la razón de homotecia?',
  alternativas = '[{"letra":"A","texto":"OB OB + 6","es_correcta":true},{"letra":"B","texto":"OA OA + 6","es_correcta":false},{"letra":"C","texto":"OB OB -6","es_correcta":false},{"letra":"D","texto":"OB AB + 6","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-34';

UPDATE public.preguntas
SET
  enunciado = 'El área A, en centímetros cuadrados, de un hexágono regular de perímetro P cm
se puede calcular como A = P 2 · k.
¿Cuál es el valor de k?',
  alternativas = '[{"letra":"A","texto":"24 3","es_correcta":true},{"letra":"B","texto":"12 1","es_correcta":false},{"letra":"C","texto":"12 3","es_correcta":false},{"letra":"D","texto":"6 3","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-35';

UPDATE public.preguntas
SET
  enunciado = 'Al rotar el vector v =(x, y) en un ángulo de 60 ° en sentido antihorario,
con centro en el origen, se obtiene un nuevo vector w cuyas coordenadas están
dadas por ( (( ( x 2 -2 3 ,y 2 y + 2 3 x ) )) ).
Al rotar en 60 ° en sentido antihorario, con centro en el origen, el vector
a =(1, 0), se obtiene el vector b. Al rotar en 60 ° en sentido antihorario,
con centro en el origen, el vector b, se obtiene el vector c.
¿Cuáles son las coordenadas del vector c?',
  alternativas = '[{"letra":"A","texto":"( ( ( 1 4, 3 4 ) ) )","es_correcta":false},{"letra":"B","texto":"(1, 3)","es_correcta":false},{"letra":"C","texto":"(- (( ( 1 2, 5 4 3 ) )) )","es_correcta":false},{"letra":"D","texto":"(- (( ( 1 2, 2 3 ) )) )","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-36';

UPDATE public.preguntas
SET
  enunciado = 'Considera un perfil de aluminio de largo L milímetros, hecho con aluminio de
grosor constante T milímetros, tal que al realizarle un corte transversal se obtienen
las siguientes medidas:
Si se requiere conocer la cantidad de aluminio necesaria para confeccionar uno de
estos perfiles, ¿cuál de las siguientes expresiones representa esta cantidad,
en 3 mm?',
  alternativas = '[{"letra":"A","texto":"Opción A (ver figura)","es_correcta":true},{"letra":"B","texto":"A)((2 2 T T((A A + + B B)) + -4 4 T T 2 2)L)L","es_correcta":false},{"letra":"C","texto":"T L(2 A + B -T)","es_correcta":false},{"letra":"D","texto":"2 T L(A + B)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-37';

UPDATE public.preguntas
SET
  enunciado = 'En la figura adjunta se representa una escalera de 5 metros de largo que está
afirmada en una pared perpendicular al suelo.
3 metros
Si la base de la escalera se mueve n metros en el sentido de la flecha,
¿cuál de las siguientes expresiones representa la altura hasta donde queda
apoyada la escalera en la pared?',
  alternativas = '[{"letra":"A","texto":"25 -(3 + n)2 metros","es_correcta":true},{"letra":"B","texto":"25 +(3 + n)2 metros","es_correcta":false},{"letra":"C","texto":"25 + 3 2 + n 2 metros","es_correcta":false},{"letra":"D","texto":"25 -3 2 -n 2 metros","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-38';

UPDATE public.preguntas
SET
  enunciado = 'Considera un cuadrilátero en el que uno de los vértices es A(3, 8). A esta figura se
le aplica una traslación según el vector v =(4, -3) y luego, se le aplica una
rotación en 180 ° con centro el origen del plano cartesiano.
¿Cuáles son las coordenadas de la imagen de A, luego de las transformaciones?',
  alternativas = '[{"letra":"A","texto":"(-,7 -5)","es_correcta":true},{"letra":"B","texto":"(-,5 7)","es_correcta":false},{"letra":"C","texto":"(-,7 -11)","es_correcta":false},{"letra":"D","texto":"(7, 5)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-39';

UPDATE public.preguntas
SET
  enunciado = 'A punto una(figura ,3 3) y se es le paralela aplica al una eje reflexión Y. con respecto a la recta que contiene al
¿Cuál es la imagen para cada punto (x, y) de esta figura?',
  alternativas = '[{"letra":"A","texto":"(-x + ,6 y)","es_correcta":true},{"letra":"B","texto":"(-x + ,3 y)","es_correcta":false},{"letra":"C","texto":"(6 -2 ,x y)","es_correcta":false},{"letra":"D","texto":"(,x -y + 6)","es_correcta":false},{"letra":"E","texto":"(,x -y + 3)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-40';

UPDATE public.preguntas
SET
  enunciado = 'Una escalera de 3 m de largo está apoyada en un muro vertical, formando con
él un ángulo de 37 °.
Si la distancia entre el pie de la escalera y el muro es de x m, ¿cuál de las
siguientes igualdades es verdadera?',
  alternativas = '[{"letra":"A","texto":"cos 37 ° = x 3","es_correcta":false},{"letra":"B","texto":"sen 37 ° = x 3","es_correcta":true},{"letra":"C","texto":"tan 37 ° = x 3","es_correcta":false},{"letra":"D","texto":"tan 37 ° = x 3","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-41';

UPDATE public.preguntas
SET
  enunciado = 'En un conjunto de datos, se dice que un dato es atípico cuando es menor que
Q1 -3 2 R o mayor que Q3 + 3 2 R, tal que Q 1 es el primer cuartil de la
distribución, Q 3 es el tercer cuartil y R es el rango intercuartílico.
Considera un conjunto de datos con primer cuartil 20 y tercer cuartil 40.
Si los mayores datos de la distribución son 60, 65, 72 y 78, ¿cuántos de ellos
son datos atípicos?',
  alternativas = '[{"letra":"A","texto":"1","es_correcta":false},{"letra":"B","texto":"2","es_correcta":true},{"letra":"C","texto":"3","es_correcta":false},{"letra":"D","texto":"4","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-42';

UPDATE public.preguntas
SET
  enunciado = 'Se define el coeficiente de variación C V de un grupo de datos como σ, x
tal que σ es la desviación estándar y x es el promedio del grupo de datos.
¿Cuál es el coeficiente de variación del grupo de datos formado por los números
2, 3 y 7?',
  alternativas = '[{"letra":"A","texto":"14 4","es_correcta":false},{"letra":"B","texto":"14 4","es_correcta":false},{"letra":"C","texto":"4 · 14 3","es_correcta":true},{"letra":"D","texto":"14 12","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-45';

UPDATE public.preguntas
SET
  enunciado = 'Se quiere formar un comité de tres personas: un representante, un secretario y
un tesorero, desde un grupo de seis mujeres y ocho hombres.
¿Cuántos grupos distintos se pueden formar si el representante debe ser mujer y
el secretario debe ser un hombre?',
  alternativas = '[{"letra":"A","texto":"6 · 8 · 12","es_correcta":true},{"letra":"B","texto":"14 · 13 · 12","es_correcta":false},{"letra":"C","texto":"2(6 · 8 · 12)","es_correcta":false},{"letra":"D","texto":"2(14 · 13 · 12)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-46';

UPDATE public.preguntas
SET
  enunciado = 'Una persona debe programar un robot de manera que decida entre girar a la
izquierda o a la derecha, de forma aleatoria. La probabilidad de que el robot gire a
la izquierda es 1 4.
Si el robot se enfrenta a n decisiones, con n > 3, ¿cuál de las siguientes
expresiones permite determinar la probabilidad de que el robot gire siempre a la
derecha a excepción de la última decisión en la cual gire a la izquierda?',
  alternativas = '[{"letra":"A","texto":"1 4 · ( ( ( 3 4 ) ) ) n -1","es_correcta":true},{"letra":"B","texto":"16 3 ·(n -)1","es_correcta":false},{"letra":"C","texto":"( ( ( 16 3 ) ) ) n","es_correcta":false},{"letra":"D","texto":"3 4 · ( ( ( 1 4 ) ) ) n -1","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-49';

UPDATE public.preguntas
SET
  enunciado = 'En una caja hay en total M bolitas azules y N bolitas blancas y en otra caja hay
en total 3 bolitas azules y 5 bolitas blancas. Todas las bolitas de las cajas son del
mismo tipo.
Si se extrae al azar una bolita de cada caja, ¿cuál de las siguientes expresiones
representa la probabilidad de que ambas sean azules?',
  alternativas = '[{"letra":"A","texto":"M M + N + 3 + 8 · M M + N + 2 + 7","es_correcta":false},{"letra":"B","texto":"M M + N + 3 + 8 + M M + N + 2 + 7","es_correcta":false},{"letra":"C","texto":"M M + N + 8 3","es_correcta":false},{"letra":"D","texto":"M M + N · 8 3","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-50';

UPDATE public.preguntas
SET
  enunciado = 'Considera la función f, definida por f() x = ax 2 + bx + c, cuyo dominio es el
conjunto de los números reales.
Se pueden determinar los valores de a, b y c, si:
(1) se conocen las coordenadas del vértice de la gráfica de f.
(2) se sabe que f() 7 = f() 14 = 15.',
  alternativas = '[{"letra":"A","texto":"(1) por sí sola","es_correcta":false},{"letra":"B","texto":"(2) por sí sola","es_correcta":false},{"letra":"C","texto":"Ambas juntas, (1) y (2)","es_correcta":true},{"letra":"D","texto":"Cada una por sí sola, (1) ó (2)","es_correcta":false},{"letra":"E","texto":"Se requiere información adicional","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25inv-52';

UPDATE public.preguntas
SET
  enunciado = 'Si P, Q y R son tres números positivos, tal que R P = 0,92 y Q R = 1,125,
¿cuál es el orden creciente de los números?',
  alternativas = '[{"letra":"A","texto":"P < R < Q","es_correcta":false},{"letra":"B","texto":"Q < R < P","es_correcta":true},{"letra":"C","texto":"R < Q < P","es_correcta":false},{"letra":"D","texto":"P < Q < R","es_correcta":false},{"letra":"E","texto":"R < P < Q","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-01';

UPDATE public.preguntas
SET
  enunciado = 'Si m es un número entero mayor que 1 y x es un número real positivo,
¿cuál de las siguientes expresiones es igual a x · m x?',
  alternativas = '[{"letra":"A","texto":"m x 2","es_correcta":false},{"letra":"B","texto":"m + 1 x","es_correcta":false},{"letra":"C","texto":"m x m","es_correcta":false},{"letra":"D","texto":"m x m + 1","es_correcta":true},{"letra":"E","texto":"m x 3","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-02';

UPDATE public.preguntas
SET
  enunciado = 'Para calcular el área A de un triángulo cuyos lados miden a, b y c, se puede
utilizar la expresión A = S(S -a)(S -b)(S -c), tal que S = a + 2 b + c.
Para determinar el área de un triángulo en el que dos de sus lados miden L y el
otro mide 3 2 L, se realiza el siguiente procedimiento, en el cual se comete un
error.
Paso 1: se reemplaza S en la expresión para calcular A, obteniéndose
A = ( (( a + 2 b + c ) )) ( (( a + 2 b + c -a ) )) ( (( a + 2 b + c -b ) )) ( (( a + 2 b + c -c ) )).
Paso 2: se reemplazan las medidas de los lados del triángulo, obteniéndose
A = ( (( 7 4 L ) ()) (( 3 4 L ) ()) (( 3 4 L ) ()) (( 4 L ) )).
Paso 3: se expresa el radicando utilizando potencias, obteniéndose
A = 7 ( (( ( 3 16 2 L ) )) ) 2.
Paso 4: se aplica la propiedad de la raíz y de la potencia, obteniéndose
A = 21 16 2 L.
¿En cuál de los pasos se cometió el error?',
  alternativas = '[{"letra":"A","texto":"En el Paso 1","es_correcta":false},{"letra":"B","texto":"En el Paso 2","es_correcta":false},{"letra":"C","texto":"En el Paso 3","es_correcta":false},{"letra":"D","texto":"En el Paso 4","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-03';

UPDATE public.preguntas
SET
  enunciado = 'Si a y b son números racionales, tal que 0 < a < 1 < b, ¿cuál de las siguientes
expresiones representa siempre a un número mayor que 1?',
  alternativas = '[{"letra":"A","texto":"a b + + 2 2","es_correcta":false},{"letra":"B","texto":"a + 2 b","es_correcta":false},{"letra":"C","texto":"ab","es_correcta":false},{"letra":"D","texto":"a b + ,0 9","es_correcta":true},{"letra":"E","texto":"(b -a)2","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-04';

UPDATE public.preguntas
SET
  enunciado = 'En un laboratorio, una balanza digital registra de manera automática la masa de
un cultivo bacteriano. La masa del cultivo se cuadruplica cada 24 horas tal
como se representa en la siguiente tabla:
Días transcurridos Masa(kg)
1 4,6 · 10 -8
2 2,56 · 10 -7
3 1,024 · 10 -6
¿Cuánta masa registrará la balanza transcurridos cuatro días?',
  alternativas = '[{"letra":"A","texto":"4,096 · 10 -6 kg","es_correcta":true},{"letra":"B","texto":"8,192 · 10 -6 kg","es_correcta":false},{"letra":"C","texto":"2,048 · 10 -5 kg","es_correcta":false},{"letra":"D","texto":"4,096 · 10 -5 kg","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-05';

UPDATE public.preguntas
SET
  enunciado = 'Si P = 3 + a, Q = 3 + a y R = 3 + a, con a > 0, ¿cuál de las siguientes
relaciones es verdadera?',
  alternativas = '[{"letra":"A","texto":"Q < P < R","es_correcta":true},{"letra":"B","texto":"Q = P < R","es_correcta":false},{"letra":"C","texto":"Q < R < P","es_correcta":false},{"letra":"D","texto":"P < R < Q","es_correcta":false},{"letra":"E","texto":"R < P = Q","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-06';

UPDATE public.preguntas
SET
  enunciado = 'Si p = 3 x y b = 3 y, ¿cuál de las siguientes expresiones es igual a(x + y),
en términos de p y b?',
  alternativas = '[{"letra":"A","texto":"log3(p · b)","es_correcta":true},{"letra":"B","texto":"log3(p + b)","es_correcta":false},{"letra":"C","texto":"log 3 p · log 3 b","es_correcta":false},{"letra":"D","texto":"log(p · b)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-09';

UPDATE public.preguntas
SET
  enunciado = 'Fer recibió una herencia H de$5 $000.000que se entregará repartida en pagos
mensuales e iguales.
Para determinar el monto mensual P, en pesos, que se le entregará a Fer,
la institución encargada le otorga una tasa de interés c de un 5,0 % mensual en
un plazo de n meses, y utiliza el modelo:
P = 1 -(1 cH + c)n -,
tal que c está escrito en su forma decimal.
Si Fer ha decidido recibir la herencia en un plazo de 60 meses, ¿cuál de las
siguientes expresiones representa el monto, en pesos, que recibirá
mensualmente?',
  alternativas = '[{"letra":"A","texto":"250 1 -000 ()60 51 -000","es_correcta":false},{"letra":"B","texto":"1 2 -500(51,000)60 -","es_correcta":false},{"letra":"C","texto":"1 -250(1,05 000)60 -","es_correcta":false},{"letra":"D","texto":"1 -(25 1,005 000)60 -","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-14';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál de las siguientes expresiones es igual a(p -2) 3 -p(p + 1)2?',
  alternativas = '[{"letra":"A","texto":"p","es_correcta":false},{"letra":"B","texto":"-8 p 2 + 11 p -8","es_correcta":true},{"letra":"C","texto":"-4 p 2 + 3 p -8","es_correcta":false},{"letra":"D","texto":"2 p","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-15';

UPDATE public.preguntas
SET
  enunciado = '¿Cuál es el conjunto solución de la inecuación -3 x + 2 < 0?',
  alternativas = '[{"letra":"A","texto":"] ]] -2 3, ∞ [ [[","es_correcta":false},{"letra":"B","texto":"] ]] 2 3, ∞ [ [[","es_correcta":true},{"letra":"C","texto":"] ]] -∞, -2 3 [ [[","es_correcta":false},{"letra":"D","texto":"]∞ ]] -, 2 3 [ [[","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-18';

UPDATE public.preguntas
SET
  enunciado = 'La(px edad -3) años. actual de Raúl es(x -)1 años y la de su hermana Paulina es
Si S corresponde a la suma de las edades actuales de Raúl y Paulina, ¿cuál de
las siguientes expresiones representa la edad de Raúl hace 3 años?',
  alternativas = '[{"letra":"A","texto":"S p -+ 4 1 p","es_correcta":true},{"letra":"B","texto":"S p + + 4 1","es_correcta":false},{"letra":"C","texto":"p S + 1","es_correcta":false},{"letra":"D","texto":"S -p p + + 1 3","es_correcta":false},{"letra":"E","texto":"S -p 3 + p 1 + 1","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-19';

UPDATE public.preguntas
SET
  enunciado = 'La aceleración de gravedad g en un planeta, en s 2 m, se puede calcular
mediante la expresión g = G R · 2 M, tal que G es una constante, M es la masa
del planeta en kilogramos, R es su radio en metros y la aceleración de
gravedad de la Tierra es aproximadamente 10 s 2 m.
Considera que el radio de Marte mide aproximadamente la mitad del radio de la
Tierra, y que su masa equivale a 1,0 veces la masa de la Tierra.
¿Cuál es aproximadamente la aceleración de gravedad en Marte?',
  alternativas = '[{"letra":"A","texto":"0,25 s 2 m","es_correcta":false},{"letra":"B","texto":"5,0 s 2 m","es_correcta":false},{"letra":"C","texto":"2 s 2 m","es_correcta":false},{"letra":"D","texto":"4 s 2 m","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-20';

UPDATE public.preguntas
SET
  enunciado = 'Una persona contestó correctamente las 18 preguntas de una prueba que tiene
preguntas de 1, 2 y 3 puntos, obteniendo un total de 35 puntos. Solo seis de
las preguntas de la prueba valían 1 punto.
Si x corresponde al total de puntos obtenidos en las preguntas que valen
2 puntos e y corresponde al total de puntos obtenidos en las preguntas que
valen 3 puntos, ¿cuál de los siguientes sistemas de ecuaciones representa la
situación planteada?',
  alternativas = '[{"letra":"A","texto":"2 x x + + 3 y y = = 35 18 B) x 2 x + + y 3 y = = 29 12","es_correcta":false},{"letra":"B","texto":"Opción B (ver figura)","es_correcta":true},{"letra":"C","texto":"2 x x + + 3 y y = = 12 29 D) x 2 x + + 3 y y = = 18 35","es_correcta":false},{"letra":"D","texto":"Opción D (ver figura)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-24';

UPDATE public.preguntas
SET
  enunciado = 'Considera la función f, cuyo dominio es el conjunto de los números reales,
definida por f() x = x 2 -4 x + 5.
¿Cuál de las siguientes funciones tiene como gráfica la parábola asociada a f,
pero trasladada en 5 unidades hacia la derecha?',
  alternativas = '[{"letra":"A","texto":"g() x = x 2 + 6 x + 5","es_correcta":false},{"letra":"B","texto":"h() x = x 2 -4 x","es_correcta":false},{"letra":"C","texto":"p() x = x 2 + x + 5","es_correcta":false},{"letra":"D","texto":"q() x = x 2 -14 x + 50","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-26';

UPDATE public.preguntas
SET
  enunciado = 'Considera la función f, cuyo dominio es el conjunto de los números reales,
definida por f() x = ax 2 + bx + c, con a < 0, ¿cuál de las siguientes afirmaciones
es siempre verdadera?',
  alternativas = '[{"letra":"A","texto":"La ordenada del vértice de la parábola asociada a la función f es el máximo de esta.","es_correcta":true},{"letra":"B","texto":"La gráfica de la función f no interseca al eje X.","es_correcta":false},{"letra":"C","texto":"La gráfica de la función f interseca al eje Y por debajo del origen.","es_correcta":false},{"letra":"D","texto":"El recorrido de la función son todos los números reales negativos.","es_correcta":false},{"letra":"E","texto":"El eje de simetría de la parábola asociada a f es el eje Y. 2","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-28';

UPDATE public.preguntas
SET
  enunciado = 'Considera la función f, definida por f() x = x k + 2 x -1, cuyo dominio es el
conjunto de los números reales, con k un número real distinto de cero.
Si la segunda coordenada del vértice de la parábola asociada a f es
mayor que 1, ¿qué condición debe cumplir k?',
  alternativas = '[{"letra":"A","texto":"Debe ser mayor que 2.","es_correcta":false},{"letra":"B","texto":"Debe ser menor que 2 y mayor que 0.","es_correcta":false},{"letra":"C","texto":"Debe ser menor que 0 y mayor que -2.","es_correcta":false},{"letra":"D","texto":"Debe ser menor que -2.","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-30';

UPDATE public.preguntas
SET
  enunciado = 'Considera la función f, definida por f() t = t 3 -25 t 2 + 150 t + 3, con dominio el
conjunto de los números reales.
¿Cuál f() t = 3 de? las siguientes opciones representa todos los valores de t para los que',
  alternativas = '[{"letra":"A","texto":"0, 10 y 15","es_correcta":true},{"letra":"B","texto":"0, -10 y -15","es_correcta":false},{"letra":"C","texto":"3, -7 y -12","es_correcta":false},{"letra":"D","texto":"0","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-31';

UPDATE public.preguntas
SET
  enunciado = 'Al vector aplicar(,2 -una 3), se homotecia obtiene el con vector centro(-,4 en 6). el origen del sistema coordenado al
Si se aplica esta misma homotecia al vector (3, 4), entonces se obtiene n.
¿Cuál es el módulo de n?',
  alternativas = '[{"letra":"A","texto":"50 unidades","es_correcta":false},{"letra":"B","texto":"10 unidades","es_correcta":false},{"letra":"C","texto":"15 unidades","es_correcta":false},{"letra":"D","texto":"5,2 unidades","es_correcta":false},{"letra":"E","texto":"10 unidades","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-32';

UPDATE public.preguntas
SET
  enunciado = 'Para la construcción de las casas de una villa, se deben construir los cimientos
de cada una de ellas. Estos cimientos deben tener 80 cm de profundidad y
50 cm de ancho.
En el siguiente diagrama, la parte gris representa la forma de la excavación que
se realizará para confeccionar los cimientos de cada casa, mirado desde arriba.
El metro cúbico de hormigón que se utilizará para confeccionar el cimiento de
las casas tiene un valor de$95.000.
¿Cuál de las siguientes expresiones corresponde al precio total, en pesos, que
se debe pagar por los cimientos de x casas?',
  alternativas = '[{"letra":"A","texto":"95 000 · 5,0 · 8,0 · 24 · x","es_correcta":false},{"letra":"B","texto":"95 000 · 5,0 · 8,0 · 31 · x","es_correcta":true},{"letra":"C","texto":"95 000 · 5,0 · 8,0 · 34 · x","es_correcta":false},{"letra":"D","texto":"95 000 · 5,0 · 8,0 · 40 · x","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-34';

UPDATE public.preguntas
SET
  enunciado = 'Dos barcos ubicados en el mismo lugar comienzan a navegar al mismo tiempo.
El primero lo hace hacia el norte a una rapidez constante de v nudos y el
segundo lo hace hacia el este a una rapidez constante de w nudos.
Si un nudo equivale a una rapidez de 1,852 km h, ¿cuál de las siguientes
expresiones representa la distancia a la que se encuentran los barcos, en
kilómetros, después de dos horas?',
  alternativas = '[{"letra":"A","texto":"1,852 · v 2 + w 2","es_correcta":false},{"letra":"B","texto":"2 · 1,852 · v 2 + w 2","es_correcta":true},{"letra":"C","texto":"D) ,1 2 852 · 1,852 ·(v · 2(v + 2 w + 2 w) 2)","es_correcta":false},{"letra":"D","texto":"Opción D (ver figura)","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-37';

UPDATE public.preguntas
SET
  enunciado = 'En una comunidad se quieren cambiar los botes de basura cilíndricos por otros
con forma de cubo que son más fáciles de manipular por los camiones
recolectores de basura. Actualmente hay 30 botes de basura cilíndricos, como
el que se presenta en la figura adjunta.
Los botes de basura con forma de cubo tendrán una altura que es 2 3 de la altura
de los botes cilíndricos.
Si se quiere mantener la capacidad de contención total de basura de los
30 botes cilíndricos, ¿cuál de las siguientes expresiones permite calcular la
cantidad de botes con forma de cubo que se necesitan?',
  alternativas = '[{"letra":"A","texto":"45\\pi  4 h 2 r 2","es_correcta":false},{"letra":"B","texto":"\\pi  r 2 h 2 · 5,1","es_correcta":false},{"letra":"C","texto":"45\\pi  h 2 r 2","es_correcta":true},{"letra":"D","texto":"45 h \\pi  2 r 2","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-39';

UPDATE public.preguntas
SET
  enunciado = 'En una ciudad de 6000 personas, 200 miden más de 8,1 metros.
Si se escogen dos personas al azar, ¿cuál es la probabilidad de que ninguna de
ellas mida más de 8,1 metros?',
  alternativas = '[{"letra":"A","texto":"( (( 5800 1 ) )) 2","es_correcta":false},{"letra":"B","texto":"5800 6000 · 5799 5999","es_correcta":true},{"letra":"C","texto":"6$200.000· 6$200.000","es_correcta":false},{"letra":"D","texto":"5800 6000","es_correcta":false},{"letra":"E","texto":"2 · 5800 6000","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-47';

UPDATE public.preguntas
SET
  enunciado = 'Cada estudiante que asistió a una reunión saluda con un apretón de manos a
todos los demás estudiantes solo una vez.
Si se contabilizaron en total 105 apretones de manos y n es la cantidad total de
estudiantes que asistió a la reunión, ¿cuál de las siguientes relaciones es
verdadera?',
  alternativas = '[{"letra":"A","texto":"n(n 2 -2) = 105","es_correcta":false},{"letra":"B","texto":"n(n -1) = 105","es_correcta":false},{"letra":"C","texto":"n(n 2 -1) = 105","es_correcta":true},{"letra":"D","texto":"n 2 · n = 105","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-49';

UPDATE public.preguntas
SET
  enunciado = 'Considera una circunferencia, en ella se irán ubicando puntos equidistantes
entre sí, para luego calcular la cantidad de trazos que se necesitan para unir a
cualquier par de puntos.
En la siguiente imagen se dan dos ejemplos de la situación planteada.
Si se ubican n puntos en la circunferencia, ¿cuál de las siguientes expresiones
permite determinar la cantidad de trazos necesarios para unir a cualquier par de
puntos?',
  alternativas = '[{"letra":"A","texto":"( (( ( n 2 ) )) )","es_correcta":true},{"letra":"B","texto":"( (( ( n 3 ) )) ) + 2","es_correcta":false},{"letra":"C","texto":"3(n -2)","es_correcta":false},{"letra":"D","texto":"3 ·(n -2)!","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-50';

UPDATE public.preguntas
SET
  enunciado = 'Una persona desarrolla un test de 10 preguntas, el cual solo tiene preguntas de
verdadero o falso.
Si esta persona contestó todas las preguntas al azar y el test se aprueba al
obtener al menos 7 respuestas correctas, ¿cuál es la probabilidad de que la
persona apruebe el test?',
  alternativas = '[{"letra":"A","texto":"( (( 1 2 ) )) 7","es_correcta":false},{"letra":"B","texto":"( (( ( 10 7 ) )) ) · ( (( 1 2 ) )) 3 · ( (( 1 2 ) )) 7","es_correcta":false},{"letra":"C","texto":"( (( 1 2 ) )) 3 · ( (( 1 2 ) )) 7 + ( (( 1 2 ) )) 2 · ( (( 1 2 ) )) 8 + ( (( 1 2 ) )) · ( (( 1 2 ) )) 9 + ( (( 1 2 ) )) 10","es_correcta":false},{"letra":"D","texto":"( (( ( 10 7 ) )) ) · ( (( 1 2 ) )) 3 · ( (( 1 2 ) )) 7 + ( (( ( 10 8 ) )) ) · ( (( 1 2 ) )) 2 · ( (( 1 2 ) )) 8 + ( (( ( 10 9 ) )) ) · ( (( 1 2 ) )) · ( (( 1 2 ) )) 9 + ( (( 1 2 ) )) 10","es_correcta":true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-51';

UPDATE public.preguntas
SET
  enunciado = 'Se puede determinar el valor del número racional x y, si se sabe que:
(1) y es la cuarta parte de x.
(2) x + y = 5',
  alternativas = '[{"letra":"A","texto":"(1) por sí sola","es_correcta":true},{"letra":"B","texto":"(2) por sí sola","es_correcta":false},{"letra":"C","texto":"Ambas juntas, (1) y (2)","es_correcta":false},{"letra":"D","texto":"Cada una por sí sola, (1) ó (2)","es_correcta":false},{"letra":"E","texto":"Se requiere información adicional","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-52';

UPDATE public.preguntas
SET
  enunciado = 'Considera la función f, cuyo dominio es el conjunto de los números reales,
definida por f() x = ax 2 + bx + c y que f() 13 = p y f() 14 = q.
Se pueden determinar los valores de p y q, si se conoce el valor de:
(1) a y b
(2) f() 0',
  alternativas = '[{"letra":"A","texto":"(1) por sí sola","es_correcta":false},{"letra":"B","texto":"(2) por sí sola","es_correcta":false},{"letra":"C","texto":"Ambas juntas, (1) y (2)","es_correcta":true},{"letra":"D","texto":"Cada una por sí sola, (1) ó (2)","es_correcta":false},{"letra":"E","texto":"Se requiere información adicional","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-25reg-53';

UPDATE public.preguntas
SET
  enunciado = 'La densidad de un material se define como la razón entre su masa y su volumen.
En la tabla adjunta se presenta la densidad del hierro en dos estados.
Estado Densidad
Líquido 7,3 cm3 g
Sólido 7,9 cm3 g
Considera un molde con forma de prisma recto de base rectangular cuyas medidas
interiores son 5 cm de ancho, 15 cm de largo y 10 cm de alto. Dicho molde se llena
con hierro líquido, el cual se solidifica luego de algunas horas.
Si la masa del hierro no varía al pasar de un estado a otro, ¿cuál de las siguientes
expresiones representa el volumen del bloque de hierro solidificado?',
  alternativas = '[{"letra":"A","texto":"750 7,9 · 7,3 cm3","es_correcta":true},{"letra":"B","texto":"750 7,3 · 7,9 cm3","es_correcta":false},{"letra":"C","texto":"73,750 · 7,9 cm3","es_correcta":false},{"letra":"D","texto":"73,750 · 7,9 cm3","es_correcta":false}]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-26reg-17';

COMMIT;
