--
-- Migración 071: Formateo de tablas Markdown y corrección de alternativas y decimales partidos
-- en Ciencias (Física y Química) 2024 Regular y 2026 Invierno
--
BEGIN;

UPDATE public.preguntas
SET enunciado = '**46. Un grupo de investigación realizó un estudio en una muestra de personas que se encontraban en estado de reposo y a nivel del mar, en donde se determinaron los niveles de hemoglobina carboxilada después de exposiciones a determinadas concentraciones de CO ambientales durante diferentes períodos de tiempo. Los resultados obtenidos se presentan en la siguiente tabla:**

| CO en el ambiente (mg/m³) | Porcentaje promedio de carboxihemoglobina al cabo de 1 hora (%) | Porcentaje promedio de carboxihemoglobina al cabo de 8 horas (%) |
| :---: | :---: | :---: |
| 12 | 0,4 | 1,4 |
| 23 | 0,8 | 2,8 |
| 35 | 1,3 | 4,1 |
| 58 | 2,5 | 7,5 |
| 115 | 3,5 | 11,3 |

**En relación con lo anterior, ¿cuál de las siguientes conclusiones es correcta?**',
    alternativas = '[{"letra":"A","texto":"A medida que aumenta el porcentaje de hemoglobina carboxilada, aumentan los signos y síntomas de las personas expuestas al CO ambiental.","es_correcta":false},{"letra":"B","texto":"A medida que aumenta la concentración de CO ambiental, aumenta el porcentaje de hemoglobina carboxilada en los dos tiempos estudiados.","es_correcta":true},{"letra":"C","texto":"A medida que aumenta el tiempo de exposición de las personas al CO ambiental, la unión de este gas a la hemoglobina se hace irreversible.","es_correcta":false},{"letra":"D","texto":"A medida que aumenta la concentración de O2 a nivel del mar, el porcentaje de hemoglobina carboxilada en las personas disminuye en los dos tiempos estudiados.","es_correcta":false}]'::jsonb,
    respuesta_correcta = 'B'
WHERE id = 'preg-paes-fis-26inv-46';

UPDATE public.preguntas
SET enunciado = '**10. Un grupo de investigación realizó un estudio en una muestra de personas que se encontraban en estado de reposo y a nivel del mar, en donde se determinaron los niveles de hemoglobina carboxilada después de exposiciones a determinadas concentraciones de CO ambientales durante diferentes períodos de tiempo. Los resultados obtenidos se presentan en la siguiente tabla:**

| CO en el ambiente (mg/m³) | Porcentaje promedio de carboxihemoglobina al cabo de 1 hora (%) | Porcentaje promedio de carboxihemoglobina al cabo de 8 horas (%) |
| :---: | :---: | :---: |
| 12 | 0,4 | 1,4 |
| 23 | 0,8 | 2,8 |
| 35 | 1,3 | 4,1 |
| 58 | 2,5 | 7,5 |
| 115 | 3,5 | 11,3 |

**En relación con lo anterior, ¿cuál de las siguientes conclusiones es correcta?**',
    alternativas = '[{"letra":"A","texto":"A medida que aumenta el porcentaje de hemoglobina carboxilada, aumentan los signos y síntomas de las personas expuestas al CO ambiental.","es_correcta":false},{"letra":"B","texto":"A medida que aumenta la concentración de CO ambiental, aumenta el porcentaje de hemoglobina carboxilada en los dos tiempos estudiados.","es_correcta":true},{"letra":"C","texto":"A medida que aumenta el tiempo de exposición de las personas al CO ambiental, la unión de este gas a la hemoglobina se hace irreversible.","es_correcta":false},{"letra":"D","texto":"A medida que aumenta la concentración de O2 a nivel del mar, el porcentaje de hemoglobina carboxilada en las personas disminuye en los dos tiempos estudiados.","es_correcta":false}]'::jsonb,
    respuesta_correcta = 'B'
WHERE id = 'preg-paes-qui-26inv-10';

UPDATE public.preguntas
SET enunciado = '**65. Un grupo de ingenieras pretende diseñar nuevos cascos de fútbol americano. Para estudiar el impacto que podría recibir tal casco, deciden modelar su amortiguación interna a través de dos sistemas, 1 y 2, compuestos de resortes. El objetivo es estudiar la compresión efectiva de tales sistemas en función de la magnitud de la fuerza aplicada. El grupo obtiene los resultados que se aprecian en la siguiente tabla:**

| Magnitud de la fuerza aplicada (N) | Compresión en el sistema 1 (cm) | Compresión en el sistema 2 (cm) |
| :---: | :---: | :---: |
| 50 | 1,7 | 0,4 |
| 60 | 2,1 | 0,5 |
| 70 | 2,4 | 0,6 |
| 80 | 2,6 | 0,7 |

**¿Qué puede inferir el grupo a partir de estos resultados?**',
    alternativas = '[{"letra":"A","texto":"El sistema 1 es más flexible que el sistema 2.","es_correcta":true},{"letra":"B","texto":"El sistema 1 es más inseguro que el sistema 2.","es_correcta":false},{"letra":"C","texto":"El sistema 1 es más compacto que el sistema 2.","es_correcta":false},{"letra":"D","texto":"El sistema 1 soporta más fuerza que el sistema 2.","es_correcta":false}]'::jsonb,
    respuesta_correcta = 'A'
WHERE id = 'preg-paes-fis-26inv-65';

UPDATE public.preguntas
SET enunciado = '**77. La concentración de sacarosa presente en una solución puede determinarse al medir el cambio de dirección que experimenta un rayo láser al pasar a través de ella. Al hacer incidir el rayo sobre soluciones con diferentes cantidades de sacarosa se observan distintos desplazamientos de este, que pueden ser proyectados sobre una pizarra, tal como se muestra en la figura. En la tabla se presentan los valores de desplazamiento, relativos al agua destilada, en función de la concentración de sacarosa:**

| Concentración sacarosa (% m/v) | Desplazamiento (cm) |
| :---: | :---: |
| 0,0 | 0,0 |
| 10,0 | 4,0 |
| 20,0 | 8,0 |
| 30,0 | 12,0 |
| 40,0 | 16,0 |

**Utilizando el diseño experimental descrito anteriormente, se analiza la concentración de sacarosa, en solución acuosa, presente en dos muestras (1 y 2) desconocidas, registrando desplazamientos de 6,0 y 14,0 cm, respectivamente. A partir de esta información, ¿cuál es la concentración de sacarosa presente en cada muestra desconocida?**',
    alternativas = '[{"letra":"A","texto":"Concentración muestra 1: 6,0 % m/v | Concentración muestra 2: 14,0 % m/v","es_correcta":false},{"letra":"B","texto":"Concentración muestra 1: 15,0 % m/v | Concentración muestra 2: 35,0 % m/v","es_correcta":true},{"letra":"C","texto":"Concentración muestra 1: 12,0 % m/v | Concentración muestra 2: 28,0 % m/v","es_correcta":false},{"letra":"D","texto":"Concentración muestra 1: 33,3 % m/v | Concentración muestra 2: 66,6 % m/v","es_correcta":false}]'::jsonb,
    respuesta_correcta = 'B'
WHERE id = 'preg-paes-qui-24reg-77';

COMMIT;
