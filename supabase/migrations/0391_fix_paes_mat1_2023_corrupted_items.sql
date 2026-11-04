-- ====================================================================
-- MIGRATION 039: Corrección de Ítems Corruptos y Fórmulas PAES M1 2023 (Forma 113)
-- Fuente canónica: PAUTA_DOCENTE_PAES_MATEMATICA1_2023_FORMA113.md (DEMRE Oficial)
-- Documento fuente: evaluaciones_fuente/paes/paes-oficial-matematica1-p2023.pdf
-- ====================================================================

-- Pregunta 14: Corrección de tabla de pasos y bases fraccionarias
UPDATE public.preguntas
SET
  enunciado = 'Un estudiante realiza el siguiente procedimiento para determinar el resultado de la expresión $\left(\frac{2}{3}\right)^{-2} \cdot \left(\frac{3}{2}\right)^2$, cometiendo un error en el desarrollo.

$$\left(\frac{2}{3}\right)^{-2} \cdot \left(\frac{3}{2}\right)^2$$

| Paso | Desarrollo |
|---|---|
| **Paso 1** | $\left(\frac{3}{2}\right)^2 \cdot \left(\frac{3}{2}\right)^2$ |
| **Paso 2** | $\left(\frac{3}{2} \cdot \frac{3}{2}\right)^4$ |
| **Paso 3** | $\left(\frac{9}{4}\right)^4$ |
| **Paso 4** | $\frac{6561}{256}$ |

¿En cuál de los pasos se cometió el error?',
  alternativas = '[{"letra":"A","texto":"En el Paso 1","es_correcta":false},{"letra":"B","texto":"En el Paso 2","es_correcta":true},{"letra":"C","texto":"En el Paso 3","es_correcta":false},{"letra":"D","texto":"En el Paso 4","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'B',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-14';

-- Pregunta 15: Corrección de tabla de unidades y potencias de 2
UPDATE public.preguntas
SET
  enunciado = 'En la tabla adjunta se presentan las equivalencias de las medidas de almacenamiento de información de una computadora, cuya unidad básica es el bit.

| Medida | Simbología | Equivalencia |
|---|---|---|
| Byte | B | 8 bits |
| Kilobyte | KB | 1024 B |
| Megabyte | MB | 1024 KB |
| Gigabyte | GB | 1024 MB |
| Terabyte | TB | 1024 GB |
| Petabyte | PB | 1024 TB |
| Exabyte | EB | 1024 PB |
| Zettabyte | ZB | 1024 EB |
| Yottabyte | YB | 1024 ZB |

¿Cuántos Gigabytes equivalen a un Zettabyte?',
  alternativas = '[{"letra":"A","texto":"$2^{10}$","es_correcta":false},{"letra":"B","texto":"$2^{12}$","es_correcta":false},{"letra":"C","texto":"$2^{40}$","es_correcta":true},{"letra":"D","texto":"$2^{50}$","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'C',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-15';

-- Pregunta 16: Corrección de fórmula LaTeX y alternativas de fracciones
UPDATE public.preguntas
SET
  enunciado = '¿Cuál es el valor de $\frac{(-3)^{-1} \cdot 2^3}{6^2}$?',
  alternativas = '[{"letra":"A","texto":"$-\\frac{2}{27}$","es_correcta":true},{"letra":"B","texto":"$-1$","es_correcta":false},{"letra":"C","texto":"$\\frac{2}{3}$","es_correcta":false},{"letra":"D","texto":"$\\frac{3}{2}$","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'A',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-16';

-- Pregunta 18: Incorporación de la tabla de precios del almacén en el enunciado
UPDATE public.preguntas
SET
  enunciado = 'En la tabla adjunta se presenta el precio original y el precio oferta de tres productos que están con un descuento en un almacén.

| Producto | Precio original | Precio oferta |
|---|---|---|
| Leche (1 L) | $1.000 | $800 |
| Té (100 unidades) | $2.000 | $1.800 |
| Azúcar (1 kg) | $1.000 | $850 |

¿Cuál de las siguientes afirmaciones es verdadera respecto al porcentaje de descuento de los productos?',
  alternativas = '[{"letra":"A","texto":"Al comprar los tres productos, el descuento es un 45 % del total original.","es_correcta":false},{"letra":"B","texto":"El porcentaje de descuento en el té es mayor que el porcentaje de descuento en el azúcar.","es_correcta":false},{"letra":"C","texto":"El porcentaje de descuento de cada producto es la diferencia entre el valor original y el precio oferta, y todo multiplicado por 100.","es_correcta":false},{"letra":"D","texto":"La leche tiene el doble de porcentaje de descuento que el té.","es_correcta":true}]'::jsonb,
  respuesta_correcta = 'D',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-18';

-- Pregunta 19: Corrección de alternativas matemáticas y remoción de bleed de texto
UPDATE public.preguntas
SET
  enunciado = 'Cierto tipo de bacteria se cuadruplica cada una hora.

Si en un instante hay 320 de estas bacterias en un lugar, ¿cuál de las siguientes expresiones permite determinar la cantidad de bacterias que habrá $n$ horas después de ese instante?',
  alternativas = '[{"letra":"A","texto":"$320 \\cdot 4n$","es_correcta":false},{"letra":"B","texto":"$320 \\cdot 4^n$","es_correcta":true},{"letra":"C","texto":"$(320 \\cdot 4)^n$","es_correcta":false},{"letra":"D","texto":"$320^n \\cdot 4$","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'B',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-19';

-- Pregunta 20: Corrección de expresión algebraica y potencias
UPDATE public.preguntas
SET
  enunciado = 'El largo de un rectángulo mide el triple de su ancho.

Si su ancho mide $3^k\text{ mm}$, con $k$ un número entero positivo, ¿cuál de las siguientes expresiones representa el área del rectángulo, en $\text{mm}^2$?',
  alternativas = '[{"letra":"A","texto":"$9^{k^2 + k}$","es_correcta":false},{"letra":"B","texto":"$9^{2k + 1}$","es_correcta":false},{"letra":"C","texto":"$3^{2k + 1}$","es_correcta":true},{"letra":"D","texto":"$3^{k^2 + k}$","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'C',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-20';

-- Pregunta 28: Incorporación de la tabla de límites de velocidad y alternativas limpias
UPDATE public.preguntas
SET
  enunciado = 'En la siguiente tabla se presenta la velocidad ($V$) permitida al conducir en las calles y caminos de Chile:

| Tipo de zona | Límite de velocidad |
|---|---|
| Zonas urbanas | $V \le 50\text{ km/h}$ |
| Zonas de escuela (en horario de entrada y salida de estudiantes) | $V \le 30\text{ km/h}$ |
| Zonas rurales: caminos con una pista de circulación por sentido | $V \le 100\text{ km/h}$ |
| Zonas rurales: caminos con dos o más pistas de circulación por sentido | $V \le 120\text{ km/h}$ |

¿Cuál de las siguientes afirmaciones es verdadera?',
  alternativas = '[{"letra":"A","texto":"Si un automovilista excede en $10\\text{ km/h}$ la velocidad máxima permitida cuando condujo en una zona de escuela, entonces iba a una velocidad de $20\\text{ km/h}$.","es_correcta":false},{"letra":"B","texto":"Un automovilista tiene permitido conducir a una velocidad de $110\\text{ km/h}$ en zonas rurales con camino de una pista de circulación por sentido.","es_correcta":false},{"letra":"C","texto":"Si un automovilista en zona urbana decide aumentar su velocidad $20\\text{ km/h}$, alcanzando la velocidad máxima permitida, entonces iba a $70\\text{ km/h}$.","es_correcta":false},{"letra":"D","texto":"Un automovilista tiene permitido conducir a una velocidad de $100\\text{ km/h}$ en zonas rurales.","es_correcta":true}]'::jsonb,
  respuesta_correcta = 'D',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-28';

-- Pregunta 39: Corrección de alternativas con segmentos y raíces
UPDATE public.preguntas
SET
  enunciado = '¿En cuál de las siguientes figuras la medida del segmento $PQ$ es la que se indica, de acuerdo a las condiciones dadas en cada una de ellas?',
  alternativas = '[{"letra":"A","texto":"Triángulo $ABP$ equilátero de lado $1\\text{ cm}$, tal que $Q$ está en el segmento $AB$. ($PQ = \\sqrt{3}\\text{ cm}$)","es_correcta":false},{"letra":"B","texto":"Cuadrado $APBQ$ de lado $1{,}5\\text{ cm}$ ($PQ = 3\\text{ cm}$)","es_correcta":false},{"letra":"C","texto":"Rectángulo $APBQ$ de lados $2\\text{ cm}$ y $3\\text{ cm}$ ($PQ = 5\\text{ cm}$)","es_correcta":false},{"letra":"D","texto":"Cuadrado $APBQ$ de lado $1\\text{ cm}$ ($PQ = \\sqrt{2}\\text{ cm}$)","es_correcta":true}]'::jsonb,
  respuesta_correcta = 'D',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-39';

-- Pregunta 56: Sanitización de bleed en alternativa D
UPDATE public.preguntas
SET
  enunciado = 'Con la información recolectada en un estudio sobre el consumo de legumbres de un país se construyó un gráfico en el que se presenta el porcentaje de la población que consumió legumbres al menos una vez por semana, durante los años 2018, 2019 y 2020 (47% en 2018, 72% en 2019 y 90% en 2020).

¿Cuál de las siguientes afirmaciones se puede deducir de los datos del gráfico?',
  alternativas = '[{"letra":"A","texto":"El gráfico es incorrecto, porque los porcentajes de consumo en las barras no suman 100%.","es_correcta":false},{"letra":"B","texto":"La comida favorita de este país son las legumbres puesto que en el año 2020 el 90% de la población la consumía al menos una vez por semana.","es_correcta":false},{"letra":"C","texto":"En el año 2021 más del 90% de la población consumirá legumbres al menos una vez por semana.","es_correcta":false},{"letra":"D","texto":"El gráfico presenta que la población de este país ha aumentado en forma sostenida el consumo de legumbres durante los años en estudio.","es_correcta":true}]'::jsonb,
  respuesta_correcta = 'D',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-56';

-- Pregunta 62: Corrección de tabla de puntajes y percentil 40
UPDATE public.preguntas
SET
  enunciado = 'En la siguiente tabla se presenta la distribución del puntaje obtenido en una prueba de matemática por todo el estudiantado de primero medio de un colegio.

| Puntaje | Frecuencia | Frecuencia acumulada |
|---|---|---|
| 10 | 30 | 30 |
| 20 | 45 | 75 |
| 30 | 30 | 105 |
| 40 | 45 | 150 |
| 50 | 50 | 200 |

Si se realiza una prueba recuperativa para los estudiantes que estuvieron bajo el percentil 40 de los puntajes obtenidos, ¿cuántos estudiantes podrán optar a la prueba recuperativa?',
  alternativas = '[{"letra":"A","texto":"39","es_correcta":false},{"letra":"B","texto":"75","es_correcta":true},{"letra":"C","texto":"79","es_correcta":false},{"letra":"D","texto":"80","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'B',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-62';

-- Pregunta 63: Formateo de fracciones y tabla de sabores de helado
UPDATE public.preguntas
SET
  enunciado = 'Se consultó a un grupo de 50 personas acerca de su sabor favorito de cierto tipo de helado. En la tabla adjunta se registran los resultados obtenidos.

| Sabor | Frecuencia |
|---|---|
| vainilla | 9 |
| chocolate | 15 |
| frutilla | 6 |
| manjar | 20 |

Si se elige a una de estas personas al azar, ¿cuál es la probabilidad de que su sabor favorito sea de vainilla o de frutilla?',
  alternativas = '[{"letra":"A","texto":"$\\frac{3}{10}$","es_correcta":true},{"letra":"B","texto":"$\\frac{9}{50} \\cdot \\frac{6}{50}$","es_correcta":false},{"letra":"C","texto":"$\\frac{1}{54}$","es_correcta":false},{"letra":"D","texto":"$\\frac{1}{15}$","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'A',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-63';

-- Pregunta 65: Corrección de alternativas con fracciones en probabilidades
UPDATE public.preguntas
SET
  enunciado = 'Si se lanzan tres monedas, ¿cuál es la probabilidad de obtener al menos un sello?',
  alternativas = '[{"letra":"A","texto":"$\\frac{1}{3}$","es_correcta":false},{"letra":"B","texto":"$\\frac{7}{8}$","es_correcta":true},{"letra":"C","texto":"$\\frac{1}{8}$","es_correcta":false},{"letra":"D","texto":"$\\frac{1}{2}$","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'B',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-65';
