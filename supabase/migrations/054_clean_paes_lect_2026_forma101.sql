-- ==============================================================================
-- Migración 054: Saneamiento y Normalización PAES Competencia Lectora 2026 (Forma 101 Invierno)
-- - Corrección de rótulo a Forma 101 Invierno Oficial DEMRE
-- - Depuración de alternativas con textos de lectura pegados (Q08, Q17, Q26, Q37, Q47, Q55)
-- - Eliminación de pies de página FORMA 101 en todas las preguntas
-- - Formateo de lecturas compartidas según skill eval-markdown-formatter
-- - Asignación de 5 preguntas piloto (puntaje 0) y 60 puntuables (puntaje 1)
-- ==============================================================================

BEGIN;

-- 1. Actualización de cabecera en public.evaluaciones
UPDATE public.evaluaciones
SET
  titulo = 'PAES Oficial Competencia Lectora — Proceso 2026 (Forma 101 — Invierno)',
  descripcion = 'Evaluación oficial DEMRE de Competencia Lectora aplicada en el Proceso de Admisión 2026 (Forma 101 — Invierno). Incluye 65 preguntas de selección múltiple (60 válidas y 5 piloto de calibración) sobre textos literarios, expositivos y argumentativos, evaluando Localizar, Interpretar y Evaluar información.',
  descripcion_catalogo = 'Prueba oficial DEMRE PAES Competencia Lectora 2026 (Forma 101 — Invierno) completa con 65 ítems, escala oficial DEMRE de 100 a 1000 puntos y pauta docente con justificación curricular.',
  total_preguntas = 65,
  updated_at = NOW()
WHERE id = 'eval-paes-lect-2026-f103';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 1: preguntas 1 a 8 
 
Fragmento del informe Envejecimiento en Chile, publicado por el Instituto Nacional de 
Estadísticas (INE) el año 2022. 
 
 
Antecedentes conceptuales sobre el envejecimiento demográfico 
 
La transición demográfica y el envejecimiento de la población 
 
Generalmente, el envejecimiento demográfico es visto como una consecuencia inevitable 
de la transición hacia una población que presenta bajas tasas de crecimiento demográfico, 
lo cual es configurado tras un proceso resultante desde una situación de altos niveles de 
fecundidad y de mortalidad, a otra situación de bajos niveles de fecundidad y mortalidad 
(CEPAL1, 2008; Goldstein, 2009). Es esta transformación lo que generalmente se denomina 
como el proceso de transición demográfica, el cual fue utilizado inicialmente como marco 
teórico para explicar las transformaciones demográficas desde las sociedades                    
pre-industriales a las sociedades modernas desarrolladas en Europa, pero que a lo largo 
de las décadas se ha convertido en un importante paradigma para explicar las 
transformaciones demográficas en las distintas regiones del mundo, así como los cambios 
evidenciados en la estructura de la población y las implicancias para el desarrollo 
económico y social desde una perspectiva demográfica (Villa y Rivadeneira, 2000; Miró, 
2003; CEPAL, 2008; Cotlear, 2011). 
 
La teoría de la transición demográfica da cuenta de las transformaciones acontecidas en la 
estructura de la población resultante de la interacción de los distintos componentes de la 
dinámica demográfica, principalmente los relativos a la fecundidad y la mortalidad. Como 
señala Miró (2003), según el grado de avance observado en la disminución de la mortalidad 
y la fecundidad es posible evidenciar cuatro etapas de la transición demográfica: incipiente, 
moderada, plena y avanzada. Mientras en las etapas incipiente y moderada la mortalidad 
ha bajado lentamente, la fecundidad aún no ha comenzado a declinar o lo hace lentamente; 
en la etapa avanzada los valores tanto de la fecundidad como la mortalidad tienden a 
equilibrarse presentando importantes descensos que son sostenidos en el tiempo. En los 
años posteriores, debido a los importantes cambios observados en las estructuras por 
edades de la mayoría de los países que conforman la región latinoamericana y el 
consecuente avance del envejecimiento de la población, se han planteado nuevos 
indicadores y etapas para la definición del proceso de transición demográfica. Estos están 
basados en las tasas de fecundidad y la esperanza de vida de la población, indicadores 
que se ven menos afectados por la estructura por edades de la población, y al mismo 
tiempo, muestran con mayor precisión los desafíos demográficos que enfrentan los países 
en cada una de las etapas de la transición demográfica. Bajo esta premisa, las cuatro 
etapas de la transición demográfica se definen como moderada, plena, avanzada y muy 
avanzada (CEPAL, 2008).  
 
 
                                                 
1 Comisión Económica para América Latina y el Caribe. 

 
La transición demográfica en América Latina está marcada por la heterogeneidad y los 
distintos niveles de avance entre los países que conforman la región. Sin embargo, una 
marcada característica de este proceso es la rapidez que dicha transformación ha tenido 
en comparación con otras regiones (CEPAL, 2008). A mediados del siglo XX, las mejoras 
en las condiciones de vida, higiene, salubridad y principalmente los adelantos de la ciencia 
y la medicina produjeron descensos importantes en la mortalidad, principalmente en la de 
los más jóvenes y la mortalidad infantil, lo que da inicio al proceso de transición demográfica 
en su etapa incipiente (Chackiel, 2004). En situaciones de altas tasas de fecundidad, el 
descenso de la mortalidad de los más jóvenes implica un acelerado crecimiento de la 
población. Dichos elementos dan como resultado una estructura poblacionalmente más 
joven, en cuanto la mortalidad de las personas mayores continúa siendo elevada, con una 
esperanza de vida de la población que no supera los 60 años. Bajo la clasificación 
actualizada de las etapas de la transición demográfica (CEPAL, 2008) esta etapa ya habría 
sido superada por todos los países de la región latinoamericana.  
 
A medida que los avances en la medicina y las condiciones de vida siguen desarrollándose, 
la mortalidad continúa reduciéndose paulatinamente, lo que contribuye a un leve aumento 
de la esperanza de vida de la población, que comienza a superar los 60 años. A la par de 
esto, distintas transformaciones sociales, culturales y económicas comienzan a reducir las 
tasas globales de fecundidad de la población. Los planes de control de la natalidad de la 
población, la promoción y aumento de mecanismos anticonceptivos, la mayor inserción de 
la mujer en el mercado laboral, así como los cambios culturales asociados a la nupcialidad, 
la conformación de familias y la crianza, son algunos de los factores que han contribuido a 
la reducción paulatina de los niveles de fecundidad, los que, sin embargo, se mantienen por 
sobre los niveles de reemplazo generacional, dando cuenta así de una etapa moderada 
de la transición demográfica. 
 
En cuanto la fecundidad y la mortalidad infantil continúan descendiendo paulatinamente, la 
estructura etaria de la población comienza a envejecer lentamente, entrando a una etapa 
plena de la transición demográfica. La mortalidad de las personas mayores, si bien 
mantiene una leve tendencia hacia la baja, da cuenta de una esperanza de vida que se 
mantiene en torno a los 70 años, aunque el grueso de la población se concentra en edades 
jóvenes, ampliando así el tamaño de la población económicamente activa. Esta situación 
ha sido denominada como el “bono demográfico”, en cuanto existen bajos niveles de 
dependencia demográfica, tanto a nivel de menores de 15 años, como de mayores de 60 
años, lo que configura una situación especialmente favorable para el desarrollo económico 
de las sociedades (Chackiel, 2000; Cotlear, 2011). 
 
 
 

 
A medida que las tasas globales de fecundidad continúan reduciéndose, incluso por debajo 
de los niveles de reemplazo generacional, la reducción de los niveles de mortalidad 
comienza a hacerse extensiva a todos los grupos de edades, lo cual es acompañado por 
una esperanza de vida que comienza a superar los 75 años, dando paso a la etapa 
avanzada de la transición demográfica. Así, la esperanza de vida aumenta 
considerablemente, lo que determina una mayor cantidad de población que tiende a vivir 
más años y que tiende a tener menos hijos. De esta forma, los bajos niveles de fecundidad 
y de mortalidad causan importantes cambios en la estructura etaria de la población, en 
cuanto las cohortes2 dominantes comienzan a tener cada vez una mayor cantidad de años, 
y la proporción de población en edades mayores sobre el total de la población comienza a 
aumentar, impulsando así el proceso de envejecimiento poblacional (CEPAL, 2008; 
Goldstein, 2009; Naciones Unidas, 2012).  
 
Finalmente, en una etapa muy avanzada de la transición demográfica es posible ubicar 
aquellos países que bajaron muy tempranamente sus niveles de fecundidad, mostrando 
tasas globales de fecundidad muy por debajo del nivel de reemplazo, cercanos a los 1,5 
hijos por mujer y con una esperanza de vida que se aproxima a los 80 años, lo que al mismo 
tiempo influye en que el crecimiento demográfico de la población baje considerablemente y 
sea cercano al 0 %. De esta forma, la disminución de las tasas de fecundidad y de 
mortalidad, así como el consecuente aumento de la supervivencia de los adultos hasta 
edades más avanzadas, son consideradas como las principales causas del envejecimiento 
de la población (Goldstein, 2009; Naciones Unidas, 2012). 
 
 
Rojas, H., Rodríguez, L. y Rodríguez, J. (2022). Envejecimiento en Chile: evolución, características de las 
personas mayores y desafíos demográficos para la población. Instituto Nacional de Estadísticas. 
https://www.ine.gob.cl/docs/default-source/documentos-de-trabajo/envejecimiento-en-chile-evolucion-y-
caracteristicas-de-las-personas-mayores.pdf?sfvrsn=fa394551_2 
 
 
                                                 
2 Grupos.

---

**1. Con respecto al análisis demográfico, ¿cuál es la relación establecida entre el primer y segundo párrafo?**',
  alternativas = '[{"letra":"A","texto":"El primero presenta el problema del envejecimiento de la población; el segundo muestra formas de medir su alcance.","es_correcta":false},{"letra":"B","texto":"El primero explica las tasas de crecimiento poblacional de Europa; el segundo las compara con las de América Latina.","es_correcta":false},{"letra":"C","texto":"El primero define la transición demográfica; el segundo plantea los indicadores que permiten observarla en un territorio.","es_correcta":true},{"letra":"D","texto":"El primero categoriza los factores de medición demográfica; el segundo explica las razones por las que estos han sido reemplazados.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'C',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-01';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 1 (Continuación):

**2. A diferencia de Miró, ¿qué indicador considera la CEPAL al definir las etapas de transición demográfica?**',
  alternativas = '[{"letra":"A","texto":"La estructura por edades.","es_correcta":false},{"letra":"B","texto":"La tasa de fecundidad.","es_correcta":false},{"letra":"C","texto":"La tasa de mortalidad.","es_correcta":false},{"letra":"D","texto":"La esperanza de vida.","es_correcta":true}]'::jsonb,
  respuesta_correcta = 'D',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-02';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 1 (Continuación):

**3. ¿Cuál es una de las características de la etapa incipiente de la transición demográfica?**',
  alternativas = '[{"letra":"A","texto":"Alta mortalidad infantil.","es_correcta":false},{"letra":"B","texto":"Aumento de la esperanza de vida.","es_correcta":false},{"letra":"C","texto":"Acelerado crecimiento de la población.","es_correcta":true},{"letra":"D","texto":"Bajo índice de fecundidad.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'C',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-03';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 1 (Continuación):

**4. A partir de la lectura, ¿qué implica el “bono demográfico” para una sociedad?**',
  alternativas = '[{"letra":"A","texto":"Que aumenta su población en edad laboral.","es_correcta":true},{"letra":"B","texto":"Que entrega incentivos para aumentar la natalidad.","es_correcta":false},{"letra":"C","texto":"Que impulsa el incremento de la esperanza de vida.","es_correcta":false},{"letra":"D","texto":"Que intenta frenar el envejecimiento de la población.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'A',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-04';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 1 (Continuación):

**5. Según la lectura, ¿en cuál de las etapas de transición demográfica la economía se ve beneficiada por el tamaño de la población económicamente activa?**',
  alternativas = '[{"letra":"A","texto":"En la etapa plena.","es_correcta":true},{"letra":"B","texto":"En la etapa incipiente.","es_correcta":false},{"letra":"C","texto":"En la etapa avanzada.","es_correcta":false},{"letra":"D","texto":"En la etapa moderada.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'A',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-05';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 1 (Continuación):

**6. De acuerdo con la lectura, ¿en qué etapa de transición demográfica la esperanza de vida comienza a superar los 75 años?**',
  alternativas = '[{"letra":"A","texto":"En la etapa muy avanzada.","es_correcta":false},{"letra":"B","texto":"En la etapa moderada.","es_correcta":false},{"letra":"C","texto":"En la etapa avanzada.","es_correcta":true},{"letra":"D","texto":"En la etapa plena.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'C',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-06';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 1 (Continuación):

**7. ¿Cuál es una característica de la etapa avanzada de la transición demográfica?**',
  alternativas = '[{"letra":"A","texto":"El aumento de las tasas de fecundidad.","es_correcta":false},{"letra":"B","texto":"El estancamiento de la estructura etaria.","es_correcta":false},{"letra":"C","texto":"El incremento del reemplazo generacional.","es_correcta":false},{"letra":"D","texto":"El envejecimiento de las cohortes dominantes.","es_correcta":true}]'::jsonb,
  respuesta_correcta = 'D',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-07';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 1 (Continuación):

**8. ¿De qué manera se organiza la información respecto de las etapas de transición demográfica?**',
  alternativas = '[{"letra":"A","texto":"Se expone una discusión teórica acerca de las etapas propuestas por la CEPAL y luego se ejemplifican estas etapas con la situación demográfica de América Latina.","es_correcta":false},{"letra":"B","texto":"Se explican los criterios que definen las etapas propuestas por la CEPAL y luego se detallan las características demográficas de dichas etapas.","es_correcta":true},{"letra":"C","texto":"Se contrastan distintas definiciones de las etapas de transición demográfica y luego se presenta el informe elaborado por la CEPAL.","es_correcta":false},{"letra":"D","texto":"Se presenta la evolución en la concepción de las etapas demográficas y luego se establece la visión actual propuesta por la CEPAL.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'B',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-08';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 2: preguntas 9 a 17 
 
Artículo periodístico escrito por José Manuel Sánchez, publicado en el diario El Español el 
año 2021. 
 
 
¿Memoria corta? 
 
El historiador de la ciencia y académico pone en valor la importancia de conocer los grandes 
nombres de la investigación. 
 
JOSÉ MANUEL SÁNCHEZ 
3 de mayo, 2021 
 
 
En una entrevista reciente, Claudio Magris (El País, 18 de abril de 2021), el autor de El 
Danubio, recordaba la anécdota –en realidad, mucho más– de que cuando hace quince 
años enseñaba en un college3 de Estados Unidos, “solo cinco o seis estudiantes en una 
clase de 36 sabían quién fue Stalin”. Y añadía que ese tipo de ignorancia, desconocer 
sucesos o personajes que marcaron épocas del pasado, se estaba acentuando. Que le 
impresionaba esa “memoria corta”. 
 
Aunque no se trate de Stalin y pertenezca a una dimensión más específica, yo tengo en mi 
frágil memoria otra situación parecida. No la puedo datar con seguridad, pero 
probablemente también tuvo lugar en el mismo entorno temporal que el de Magris. Fue 
en uno de los cursos anuales de Historia de la Ciencia que desarrollaba en la Facultad de 
Ciencias de la Universidad Autónoma de Madrid, en el que se matriculaban estudiantes de 
cualquier facultad. Yo tenía la costumbre de preguntar al principio del curso cuál era la 
procedencia académica de los alumnos. Resultó que los había de diferentes áreas, no solo 
de ciencias, pero predominaban los que estudiaban Física o Matemáticas. 
 
En un momento del curso, estaba explicando algo que involucraba al francés Henri Poincaré 
(1854-1912), una de las figuras cumbres de la matemática de finales del siglo XIX y primera 
década del XX; se ha dicho que el XIX comenzó bajo la sombra de un gigante, Carl Friedrich 
Gauss, y terminó con el dominio de un genio de magnitud similar, Poincaré. En opinión de 
Jean Dieudonné, un matemático notable él mismo, “ambos eran matemáticos universales 
en el sentido supremo, y ambos realizaron contribuciones importantes a la astronomía y 
la física matemática. Si los descubrimientos de Poincaré en la teoría de números no son 
iguales a los de Gauss, sus logros en la teoría de funciones son al menos del mismo nivel. 
Poincaré es la figura más importante en la teoría de las ecuaciones diferenciales y es el 
matemático que, después de Newton, efectuó el trabajo más destacado en mecánica 
celeste”. 
 
 
                                                 
3 Institución de educación superior que proporciona enseñanza especialmente enfocada en un área.  

 
Como digo, Poincaré apareció en mi curso, y yo, consciente de que su nombre seguramente 
sería desconocido por los alumnos que procedían de Filosofía, Derecho, Economía o 
Psicología, acaso también de los de Física, a pesar de las notables aportaciones de aquel 
a la mecánica celeste o a la relatividad especial, dije algo así como: “A vosotros su nombre 
no os dirá nada, pero sí a los que estáis estudiando Matemáticas”. Entonces miré las caras 
de estos y, ¡ay!, comprendí que el nombre de Poincaré les resultaba totalmente ajeno. 
Y esto sucedía en Matemáticas, la disciplina en la que posiblemente perduren más, tengan 
más presencia, sean de más permanente actualidad grandes nombres del pasado que 
forjaron problemas, ramas de la matemática, conjeturas que no han perdido 
contemporaneidad; los Euclides, Fermat, Goldbach, Gauss, Riemann, Lie, Hilbert… o 
Poincaré. 
 
Por el contrario, muchos de los grandes nombres del pasado en física o en biología 
forman parte de su historia, de la cultura que las nutre y enriquece, pero en general sus 
logros han sido mejorados sustancialmente, en ocasiones hasta el punto de ser 
irreconocibles: Newton dejó paso a Einstein, Ptolomeo a Copérnico y este a Hubble, Mendel 
a Watson y Crick… En un viejo libro mío, Diccionario de la ciencia, conté una de esas 
historias, verídica en mi caso, que me gusta narrar. La de un amigo, uno de los mejores 
poetas españoles de su generación, que cuando le dije que estaba preparando una edición 
de escritos de Maxwell me comentó: “¿Maxwell, quién fue Maxwell?”. Y yo, sorprendido, le 
contesté: “Es como si me estuvieses hablando de Homero, y yo te dijese: ¿Homero, quién 
fue Homero?”. 
 
Desde entonces he constatado que hay muchas personas –algunas auténticos “faros 
culturales”–, acaso la mayoría de entre aquellas que no han recibido una formación 
científica, que no saben quién fue James Clerk Maxwell (1831-1879), al que yo considero, 
junto a Michael Faraday, tras Newton y Einstein, el tercero en una hipotética y siempre 
personal escala de grandes de la física. Sus logros, la teoría del electromagnetismo, en 
la que consiguió unificar en un mismo sistema electricidad, magnetismo y luz (óptica), 
transformaron el mundo. 
 
A lo largo de la historia van cambiando las modas, los conocimientos, los valores, las 
maneras de relacionarse… Es natural, mucho más en un mundo como el actual 
condicionado por las posibilidades tecnológicas. Y eso, inevitablemente, produce un 
cierto distanciamiento entre las viejas y nuevas generaciones. En cierta ocasión, el eminente 
historiador y crítico de arte, magnífico escritor, tristemente ya desaparecido, Francisco Calvo 
Serraller, me comentó algo que muchos profesores de cierta edad habrán advertido: “Lo 
peor es cuando haces un chiste y no se dan cuenta de que lo es”. Es cierto e inevitable. 
 
 

 
Para comunicarse hace falta una cierta cultura común, que sirva de eslabón entre 
generaciones y que permita conservar lo mejor del pasado. Si se ignora quién fue Stalin, 
que condicionó –masacró y aterrorizó– la vida de millones de personas, no sabremos que 
la crueldad y el terror pueden aparecer entre nosotros. Si ni siquiera quienes pertenecen, o 
pretenden pertenecer, a disciplinas científicas pueden reconocer los nombres de lo más 
granado del pasado y se contentan con recurrir a un buscador de Internet, seremos como 
embarcaciones a la deriva en un océano dominado por instrumentos sin alma ni propósito. 
 
 
Sánchez, J. (3 de mayo de 2021). ¿Memoria corta? El Español. https://www.elespanol.com/el-
cultural/ciencia/20210503/memoria-corta/578443567_0.html

---

**9. Una estudiante afirma que el artículo ofrece la idea de que el conocimiento es una construcción colectiva. ¿Qué cita del artículo permite justificar esta apreciación?**',
  alternativas = '[{"letra":"A","texto":"«Poincaré es la figura más importante en la teoría de las ecuaciones diferenciales y es el matemático que, después de Newton, efectuó el trabajo más destacado en mecánica celeste».","es_correcta":false},{"letra":"B","texto":"«En opinión de Jean Dieudonné, un matemático notable él mismo, “ambos eran matemáticos universales en el sentido supremo, y ambos realizaron contribuciones importantes a la astronomía y física matemática…”».","es_correcta":false},{"letra":"C","texto":"«pero en general sus logros han sido mejorados sustancialmente, en ocasiones hasta el punto de ser irreconocibles: Newton dejó paso a Einstein, Ptolomeo a Copérnico y este a Hubble, Mendel a Watson y Crick…».","es_correcta":true},{"letra":"D","texto":"«Desde entonces he constatado que hay muchas personas –algunos auténticos “faros culturales”–, acaso la mayoría de entre aquellas que no han recibido una formación científica, que no saben quién fue James Clerk Maxwell…».","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'C',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-09';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 2 (Continuación):

**10. ¿Cuál es la actitud del emisor en relación con el problema de la “memoria corta”?**',
  alternativas = '[{"letra":"A","texto":"Crítica, pues considera que los intelectuales incumplen el rol de modelos culturales para la sociedad actual.","es_correcta":false},{"letra":"B","texto":"Controversial, pues cree que hay áreas disciplinares menospreciadas en el contexto del desarrollo científico.","es_correcta":false},{"letra":"C","texto":"Cuestionadora, pues cree que la educación carece de una perspectiva integradora de los acontecimientos pasados.","es_correcta":true},{"letra":"D","texto":"Pesimista, pues considera que el sistema educativo tiene limitaciones para abordar los referentes históricos centrales.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'C',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-10';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 2 (Continuación):

**11. Considerando la información del artículo, ¿a quién le podría resultar útil su lectura?**',
  alternativas = '[{"letra":"A","texto":"A una persona que busca mejorar la enseñanza de la ciencia en el sistema educativo.","es_correcta":false},{"letra":"B","texto":"A una persona que busca conocer los aportes de los principales exponentes de las ciencias.","es_correcta":false},{"letra":"C","texto":"A una persona que busca comprender los hitos más relevantes de la matemática.","es_correcta":false},{"letra":"D","texto":"A una persona que busca justificar la importancia del conocimiento histórico de una disciplina.","es_correcta":true}]'::jsonb,
  respuesta_correcta = 'D',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-11';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 2 (Continuación):

**12. ¿Para qué se menciona la anécdota de Magris en el primer párrafo?**',
  alternativas = '[{"letra":"A","texto":"Para cuestionar la escasa profundización del discurso educativo.","es_correcta":false},{"letra":"B","texto":"Para criticar el desinterés intelectual de las nuevas generaciones.","es_correcta":false},{"letra":"C","texto":"Para ejemplificar los vacíos académicos del sistema educativo actual.","es_correcta":false},{"letra":"D","texto":"Para ilustrar el desconocimiento juvenil de acontecimientos históricos.","es_correcta":true}]'::jsonb,
  respuesta_correcta = 'D',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-12';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 2 (Continuación):

**13. Según la opinión de Dieudonné, ¿en qué área del conocimiento científico Gauss supera a Poincaré?**',
  alternativas = '[{"letra":"A","texto":"En las ecuaciones diferenciales.","es_correcta":false},{"letra":"B","texto":"En la teoría de las funciones.","es_correcta":false},{"letra":"C","texto":"En la teoría de los números.","es_correcta":true},{"letra":"D","texto":"En la mecánica celeste.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'C',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-13';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 2 (Continuación):

**14. ¿Con qué finalidad el emisor cuenta la anécdota sobre Poincaré, ocurrida en una de sus clases?**',
  alternativas = '[{"letra":"A","texto":"Para criticar el escaso interés de las nuevas generaciones por conocer a quienes marcaron un precedente en sus áreas de estudio.","es_correcta":false},{"letra":"B","texto":"Para evidenciar las razones por las que es necesario que las nuevas generaciones conozcan a quienes transformaron el mundo.","es_correcta":false},{"letra":"C","texto":"Para argumentar que la educación debe reconocer los logros de algunas figuras que han sido olvidadas por las nuevas generaciones.","es_correcta":false},{"letra":"D","texto":"Para demostrar que existen figuras fundamentales en el desarrollo de las ciencias que resultan desconocidas para las nuevas generaciones.","es_correcta":true}]'::jsonb,
  respuesta_correcta = 'D',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-14';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 2 (Continuación):

**15. En el cuarto párrafo, ¿por qué el emisor señala la importancia de reconocer el aporte de matemáticos relevantes?**',
  alternativas = '[{"letra":"A","texto":"Porque sus trabajos permiten la aplicación de enfoques multidisciplinarios.","es_correcta":false},{"letra":"B","texto":"Porque sus contribuciones son útiles para abordar problemáticas vigentes.","es_correcta":true},{"letra":"C","texto":"Porque sus teorías enriquecen el razonamiento lógico de los estudiantes.","es_correcta":false},{"letra":"D","texto":"Porque sus modelos contribuyen al desarrollo de otras áreas científicas.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'B',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-15';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 2 (Continuación):

**16. Según la lectura, ¿quién mejoró los logros de Copérnico?**',
  alternativas = '[{"letra":"A","texto":"Ptolomeo.","es_correcta":false},{"letra":"B","texto":"Watson.","es_correcta":false},{"letra":"C","texto":"Mendel.","es_correcta":false},{"letra":"D","texto":"Hubble.","es_correcta":true}]'::jsonb,
  respuesta_correcta = 'D',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-16';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 2 (Continuación):

**17. Según el emisor, ¿en qué se diferencian los logros de la matemática de los logros de la biología?**',
  alternativas = '[{"letra":"A","texto":"En que los logros de la matemática son aplicables a otras disciplinas, mientras que los de la biología están restringidos a su área.","es_correcta":false},{"letra":"B","texto":"En que los logros de la matemática siguen siendo empleados a pesar del paso de los años, mientras que los de la biología se transforman con el tiempo.","es_correcta":true},{"letra":"C","texto":"En que los logros de la matemática son valorados por quienes pertenecen a dicha área, mientras que los de la biología son reconocidos universalmente.","es_correcta":false},{"letra":"D","texto":"En que los logros de la matemática permiten comprender contextos abstractos, mientras que los de la biología explican contextos concretos.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'B',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-17';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 3: preguntas 18 a 26 
 
Fragmento de la presentación del libro El orden del tiempo escrito por Carlo Rovelli, 
publicado originalmente el año 2017.  
 
 
Quizá el mayor misterio sea el tiempo 
 
Hasta las palabras que ahora pronunciamos 
el tiempo en su furia 
se las ha llevado ya 
y nada retorna.  
(Odas, Horacio) 
 
El tiempo es familiar e íntimo. Su furia nos lleva. Su apresurada sucesión de segundos, 
horas, años, nos lanza hacia la vida, luego nos arrastra hacia la nada... Lo habitamos como 
los peces habitan el agua. Nuestro ser es ser en el tiempo. Su arrullo nos alimenta, nos abre 
al mundo, nos turba, nos asusta, nos mece. […]  
 
Pero las cosas son más complejas. La realidad suele ser distinta de lo que parece: la Tierra 
parece plana, y sin embargo es una esfera; el Sol parece girar a nuestro alrededor en el 
cielo, y en cambio somos nosotros quienes giramos en torno a él. Tampoco la estructura del 
tiempo es la que parece: es diversa de ese uniforme fluir universal. Lo descubrí con estupor 
en los libros de física, en la universidad. El tiempo funciona de manera distinta de como se 
nos presenta. 
 
En aquellos mismos libros descubrí también que todavía ignoramos cómo funciona de 
verdad el tiempo. Probablemente, su naturaleza sigue siendo el mayor de los misterios. 
Extraños hilos lo ligan a otros grandes misterios aún por resolver: la naturaleza de la mente, 
el origen del universo, el destino de los agujeros negros, el funcionamiento de la vida... Hay 
algo esencial que sigue remitiendo a la naturaleza del tiempo. 
 
La capacidad de asombro es la fuente de nuestro deseo de saber (Aristóteles, Metafísica) y 
descubrir que el tiempo no es como pensábamos plantea mil preguntas. La naturaleza del 
tiempo ha sido el centro de mi trabajo de investigación en física teórica durante toda mi vida. 
En las páginas que siguen explico lo que hemos aprendido del tiempo, las vías que estamos 
siguiendo para intentar comprenderlo mejor, lo que todavía no entendemos y lo que 
personalmente me parece intuir. 
 
¿Por qué recordamos el pasado y no el futuro? ¿Somos nosotros quienes existimos en el 
tiempo, o el tiempo el que existe en nosotros? ¿Qué significa realmente que el tiempo 
“transcurre”? ¿Qué vincula el tiempo a nuestra naturaleza como sujetos? 
 
¿Qué escucho cuando escucho el discurrir del tiempo? 
 
 

 
Este libro está dividido en tres partes distintas. En la primera resumo lo que la física moderna 
ha llegado a comprender del tiempo. Es como tener en las manos un copo de nieve: mientras 
lo estudiamos se nos derrite entre los dedos hasta desaparecer. Normalmente concebimos 
el tiempo como algo sencillo, fundamental, que discurre de manera uniforme, indiferente a 
todo, desde el pasado hacia el futuro, medido por los relojes. En el curso del tiempo se 
suceden en orden los acontecimientos del universo: pasados, presentes, futuros. El pasado 
es fijo; el futuro, abierto... Bueno, pues todo esto se ha revelado falso. 
 
Los aspectos característicos del tiempo, uno tras otro, han resultado ser aproximaciones, 
errores debidos a la perspectiva, como la forma plana de la Tierra o la rotación del Sol. El 
incremento de nuestro saber se ha traducido en una lenta disgregación del concepto de 
tiempo. Lo que llamamos “tiempo” es una compleja colección de estructuras, de estratos. Al 
estudiarlo cada vez con mayor profundidad, el tiempo ha ido perdiendo esos estratos, esos 
fragmentos, uno tras otro. La primera parte del libro es el relato de esa disgregación del 
tiempo. 
 
La segunda parte describe lo que queda al final. Un paisaje vacío y azotado por el viento 
que parece haber perdido casi cualquier rastro de temporalidad. Un mundo extraño, ajeno; 
pero que es el nuestro. Es como llegar a lo alto de una montaña, donde solo hay nieve, roca 
y cielo. O como debió de ser para Armstrong y Aldrin aventurarse en la arena inmóvil de la 
Luna. Un mundo esencial que resplandece con una belleza árida, límpida e inquietante. La 
física en la que yo trabajo, la gravedad cuántica, es el esfuerzo por comprender y dar sentido 
coherente a este paisaje extremo y hermosísimo: el mundo sin tiempo. 
 
La tercera parte del libro es la más difícil, pero también la más viva y la más próxima a 
nosotros. En el mundo sin tiempo debe de haber algo que en cualquier caso dé origen al 
tiempo que conocemos, con su orden, su pasado distinto del futuro y su tranquilo fluir. De 
algún modo, nuestro tiempo tiene que emerger a nuestro alrededor, a nuestra escala, para 
nosotros. 
 
Este es el viaje de vuelta, hacia el tiempo perdido en la primera parte del libro al seguir la 
gramática elemental del mundo. Como en una novela policíaca, aquí iremos en busca del 
culpable que ha engendrado el tiempo. Encontraremos una a una las piezas de las que se 
compone el tiempo con el que estamos familiarizados, no como estructuras elementales de 
la realidad, sino como aproximaciones útiles para esas criaturas torpes que somos nosotros 
los mortales, aspectos de nuestra perspectiva, y puede que también aspectos                    
–determinantes– de lo que somos.  
 
Ahí el libro se convierte en un magma candente de ideas, a veces luminosas, a veces 
confusas; si el lector me sigue, lo llevaré a donde yo creo que llega nuestro saber actual 
sobre el tiempo, hasta el gran océano nocturno y estrellado de lo que todavía ignoramos. 
 
 
Rovelli, C. (2021). El orden del tiempo. Anagrama.

---

**18. ¿Qué descubrió el emisor en los libros de física?**',
  alternativas = '[{"letra":"A","texto":"Que la naturaleza del tiempo es un uniforme fluir universal.","es_correcta":false},{"letra":"B","texto":"Que la actividad de la Tierra es diferente de como se percibe.","es_correcta":false},{"letra":"C","texto":"Que el tiempo funciona de manera distinta a como se enseña.","es_correcta":true},{"letra":"D","texto":"Que el universo encierra misterios que aún deben ser resueltos.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'C',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-18';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 3 (Continuación):

**19. ¿Qué función tienen las siguientes preguntas que aparecen en la lectura? «¿Por qué recordamos el pasado y no el futuro? ¿Somos nosotros quienes existimos en el tiempo, o el tiempo el que existe en nosotros? ¿Qué significa realmente que el tiempo “transcurre”? ¿Qué vincula el tiempo a nuestra naturaleza como sujetos?».**',
  alternativas = '[{"letra":"A","texto":"Presentar cuestionamientos sobre el tiempo que se invalidan en la lectura.","es_correcta":false},{"letra":"B","texto":"Introducir la problematización sobre el tiempo que se propone en la lectura.","es_correcta":true},{"letra":"C","texto":"Invalidar críticas a la noción de tiempo que se confirma en la lectura.","es_correcta":false},{"letra":"D","texto":"Plantear incógnitas sobre el tiempo que se responden en la lectura.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'B',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-19';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 3 (Continuación):

**20. ¿Con qué intención el emisor incluye las siguientes comparaciones “lo habitamos como los peces habitan el agua” y “es como tener en las manos un copo de nieve”?**',
  alternativas = '[{"letra":"A","texto":"Para motivar al lector a explorar contenidos complejos por medio de la observación de fenómenos naturales.","es_correcta":false},{"letra":"B","texto":"Para atraer al lector hacia un tema lejano por medio de la alusión a experiencias familiares.","es_correcta":false},{"letra":"C","texto":"Para involucrar al lector en la práctica científica a través del análisis de ejemplos cotidianos.","es_correcta":false},{"letra":"D","texto":"Para ayudar al lector a entender una idea abstracta a través de la representación de imágenes concretas.","es_correcta":true}]'::jsonb,
  respuesta_correcta = 'D',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-20';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 3 (Continuación):

**21. ¿Cuál es uno de los propósitos de la física en el que trabaja el emisor?**',
  alternativas = '[{"letra":"A","texto":"Ordenar linealmente un mundo atemporal.","es_correcta":false},{"letra":"B","texto":"Caracterizar el avance uniforme del tiempo.","es_correcta":false},{"letra":"C","texto":"Alcanzar la comprensión del mundo sin tiempo.","es_correcta":true},{"letra":"D","texto":"Descifrar las causas de la disgregación del tiempo.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'C',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-21';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 3 (Continuación):

**22. ¿Para qué se menciona la aventura de Armstrong y Aldrin en la Luna?**',
  alternativas = '[{"letra":"A","texto":"Para asemejarla con la experiencia de estar en un mundo sin tiempo.","es_correcta":true},{"letra":"B","texto":"Para relacionarla con los recientes aportes de la gravedad cuántica.","es_correcta":false},{"letra":"C","texto":"Para destacar lo difícil de comprender la realidad para los científicos.","es_correcta":false},{"letra":"D","texto":"Para ejemplificar lo inhóspito de los paisajes sin rastro temporal.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'A',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-22';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 3 (Continuación):

**23. Según la lectura, ¿con qué se encontrará el lector en la tercera parte del libro?**',
  alternativas = '[{"letra":"A","texto":"Con una explicación sobre la disgregación del tiempo.","es_correcta":false},{"letra":"B","texto":"Con una selección de errores sobre el tiempo.","es_correcta":false},{"letra":"C","texto":"Con una concepción actualizada del tiempo.","es_correcta":true},{"letra":"D","texto":"Con una descripción del mundo sin tiempo.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'C',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-23';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 3 (Continuación):

**24. De acuerdo con el sentido global de la lectura, ¿qué característica se puede inferir del tiempo?**',
  alternativas = '[{"letra":"A","texto":"Su variabilidad, que restringe el análisis de su funcionamiento.","es_correcta":false},{"letra":"B","texto":"Su ambigüedad, que imposibilita ordenar los acontecimientos.","es_correcta":false},{"letra":"C","texto":"Su complejidad, que impide comprenderlo con exactitud.","es_correcta":true},{"letra":"D","texto":"Su inestabilidad, que dificulta establecer su origen.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'C',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-24';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 3 (Continuación):

**25. ¿Qué actitud asume el emisor con respecto al estudio del tiempo?**',
  alternativas = '[{"letra":"A","texto":"Controversial, ya que lo define desde diferentes perspectivas.","es_correcta":false},{"letra":"B","texto":"Reflexiva, ya que lo aborda desde la curiosidad científica.","es_correcta":true},{"letra":"C","texto":"Analítica, ya que lo examina considerando su estructura.","es_correcta":false},{"letra":"D","texto":"Didáctica, ya que lo simplifica a pesar de su dificultad.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'B',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-25';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 3 (Continuación):

**26. ¿Con qué propósito el emisor menciona el contenido de las partes del libro?**',
  alternativas = '[{"letra":"A","texto":"Para anticipar al lector la manera en que se irá modificando la noción del tiempo a lo largo del libro.","es_correcta":true},{"letra":"B","texto":"Para guiar al lector en la secuencia histórica con que se han realizado los hallazgos sobre el tiempo.","es_correcta":false},{"letra":"C","texto":"Para mostrar al lector las distintas formas en que se pueden organizar las concepciones del tiempo.","es_correcta":false},{"letra":"D","texto":"Para informar al lector de las distintas investigaciones sobre el tiempo que se abordarán en el libro.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'A',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-26';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 4: preguntas 27 a 37 
 
Cuento de Pía Barros incluido en la antología Mujeres de palabras, publicado el año 2009.  
 
 
Diva 
 
Nada volvió a ser lo mismo después de su fugaz paso por nuestras tierras. 
 
Algunos recuerdan que solo el doctor Welzer fue a recibirla a la estación de trenes, 
arrepintiéndose ellos de no haber también estado allí. Y desde que pisó el andén, todo 
comenzó a ser diferente. Kurt, que entonces era el niño que acarreaba las maletas de 
fortuitos visitantes, dice que la vio pasar tan cerca de él, que la punta de su falda le rozó el 
rostro. 
 
Estaba sentado, más bien acurrucado, acota, y ante sus ojos, estaban los zapatos negros, 
de gamuza, con piel ribeteándole los tobillos. La falda roja se movía apenas, lo suficiente 
como para acercarse a su rostro, acurrucado como estaba en la espera utópica de algún 
turista. Él jura que le habló en una lengua extraña y que sintió por primera vez lo que años 
más tarde, cuando fuese un hombre, sentiría por esas mujeres inalcanzables; ese vacío en 
la boca del estómago, ese crepitar en los oídos, ese acalambrarse de muslos, unido a una 
intensa punzada en el pecho. 
 
Kurt se puso de pie como pudo y la siguió a corta distancia. El vigilante se le unió, cerrando 
los ojos, y respirando ese olor a lugares exóticos que emanaba de su pelo. 
 
Antes de que hubieran llegado a las puertas del hotel, una hilera de jóvenes, viejos, casados 
y solteros, la escoltaban. Cada ojo que topaba con su figura no podía contener el cuerpo 
que la seguía silencioso, fuera de toda voluntad. En las cinco cuadras que duró el trayecto, 
se detuvieron los escasos autos, las bicicletas, y enmudecieron los relojes, los vendedores 
de frutas y los balcones.  
 
Desde las gradas del hotel, ella se volvió con esos ojos lejanos y les sonrió triste, 
murmurando palabras sonoras y suaves que nadie comprendió. Luego, hizo adiós con un 
gesto leve de su mano y se adentró en la recepción, acompañada por un devotísimo doctor 
Welzer, que no se extrañó de que la recepcionista le extendiera, en un impulso irresistible, 
las llaves de la habitación nupcial. La misma muchacha dice que tenía un halo a sagrado, 
aunque no se puede confiar mucho en su información, porque padeció siempre 
alucinaciones místicas y murió en un asilo para dementes años más tarde, por lo que las 
crónicas consignan sus declaraciones, aunque con algunas notas al margen. 
 
 

 
La voz de su llegada se corrió más rápido que el anuncio de la primera guerra, por lo que a 
su lectura se acercaban decenas de curiosos, empujando por lograr una buena ubicación, 
seis horas antes de que la lectura empezara. Llegaron en largas filas silenciosas, sacaron 
su ticket de entrada en riguroso orden y ni siquiera hubo peleas. Parecía, según dicen los 
que recuerdan, que todos querían compartirla. Las mujeres asistieron por una curiosidad 
punzante, dispuestas a encontrarla fea, mal vestida o por lo menos, decir que no era para 
tanto. Pero al ver sus ojos tristes, sus botas oscuras, la falda roja y el pelo derramado sobre 
la espalda, enmudecieron de gozo y de tristeza por no ser ella. 
 
Cuando comenzó a recitar en una lengua distinta, a otra distancia y otro continente de 
nuestras tierras, los ojos se llenaron de aguas y las bocas sostuvieron en las comisuras una 
nostalgia brava por lo desconocido. Cada sonido nos fue impregnando y aunque no 
entendimos palabra, no pensamos que fuese necesario, porque el mensaje estaba en 
nuestra piel y cada vibración de su voz enronquecida nos iba tatuando una memoria en la 
que las palabras eran santuarios que se alejaban de lo esencial. 
 
Cuando terminó, ni un sonido ajeno vibraba en la sala. La expectación dio paso a una 
ovación conmovida y cerrada que colmó sus ojos de lágrimas, en lo que los periodistas del 
único matutino llamarían “de plenitud y agradecimiento”. 
 
Yo fui la más pequeña de ese auditorio y la que continúa viva, atesorando un programa de 
esa época, humilde, ribeteado de viñetas, con su nombre escrito. 
 
Recuerdo que esa noche, todos los hombres durmieron a la intemperie en las puertas de su 
hotel, mientras la nieve caía a raudales silenciosos. Las mujeres abarrotamos los pasillos 
esperando que nos contagiara algo de su aliento. 
 
Por la mañana abandonó el hotel, con su cuaderno de poemas y el mutismo escoltante del 
doctor Welzer y de todo el pueblo. 
 
Con un pie en la escalerilla del tren, nos hizo adiós con la mano y los ojos derramaron una 
lágrima que nos hizo llorar a todos como niños hasta largas horas después de que la silueta 
del tren se hubiera perdido en la lejanía. 
 
Desde entonces, han pasado cincuenta años y otra guerra que se mantuvo a discreta y 
amenazadora distancia. No nos importa. 
 
Porque desde que ella se deslizó por Roshkastashe, todo fue distinto. 
 
 

 
Las madres educan a sus niños en el recuerdo. El escultor le erigió la más bella estatua, 
orgullo de la ciudad, donde se la ve caminar contra el viento con su pequeño cuaderno, su 
falda de bronce donde aún se pone Kurt, el anciano, para que le acaricie el rostro, las tardes 
en que la nostalgia le tuerce los pasos. 
 
El gobierno del país no nos deja cambiarle el nombre a la ciudad, alegando problemas de 
mapas y algo de un muro que se edificó y que derribaron dividiendo el continente sin que 
nos diéramos cuenta. Seguimos año a año enviando cartas que no sabemos si llegan, para 
cambiarlo por el de Etelvina González, aunque nos cueste pronunciarlo y aunque haya que 
reescribir todos los mapas del mundo. No nos daremos por vencidos. 
 
El país sabe que somos la ciudad de su memoria, y por aquí ni siquiera pasó la guerra, los 
bombardeos se cuidaron mucho de tocarnos, quedándose lejos, porque sabían que éramos 
los guardianes de su recuerdo. 
 
El único museo de nuestro pueblo está dedicado a ella. Las sábanas que usó para dormir 
se conservan en vitrinas custodiadas, no vaya a ser que un enamorado fogoso las robe para 
la herejía de dormir sobre ellas. Algunos donaron ropas que usaron el día de su recital, por 
si tenían un poco de su mirada. Hubo hasta algunos que quisieron grabar sus suspiros 
elocuentes al recordarla. Se construyó meticulosamente un cuadernito forrado en género 
con sus iniciales. Las llaves de la suite nupcial, la toalla, los cortinajes, son parte del 
inapreciable tesoro, patrimonio que yo cuido fervorosamente. 
 
Alguna vez vino alguien de sus tierras que hablaba nuestro idioma y nos dijo que era una 
poeta fracasada, que allá ni conocían su nombre y que, de seguro, sería ahora una vieja 
hablando de su único viaje a Europa. 
 
Pero no podemos creer eso, es burdo, cruel y no tiene un atisbo de verdad. Valporaiso, creo 
que se llamaba su país. No importa. Ella vino a traernos el sentido, y amamantamos los 
hijos custodiando su memoria. Somos su pueblo, porque desde el día de su paso fugaz por 
nuestras tierras, jamás volvimos a ser los mismos. 
 
Y lo agradecemos. 
 
 
Barros, P. (2009). Diva. En Mujeres de palabras (pp. 233-235). MINEDUC.

---

**27. ¿Qué actitud tiene la narradora con respecto a la diva?**',
  alternativas = '[{"letra":"A","texto":"De asombro, ya que otorga un poder sobrenatural a la presencia de la diva.","es_correcta":false},{"letra":"B","texto":"De respeto, ya que la diva compartió con el pueblo una nueva lengua.","es_correcta":false},{"letra":"C","texto":"De agradecimiento, ya que la diva hizo de su pueblo un lugar especial.","es_correcta":true},{"letra":"D","texto":"De curiosidad, ya que desea develar el misterio que envuelve a la diva.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'C',
  puntaje = 1,
  eje_tematico_id = 'eje-len-1',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-27';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 4 (Continuación):

**28. Una lectora afirma que el cuento transmite un estereotipo sobre la competitividad en el género femenino, ¿en cuál de las siguientes situaciones se fundamenta esta opinión?**',
  alternativas = '[{"letra":"A","texto":"En la actitud de la recepcionista al atender a la diva en el hotel.","es_correcta":false},{"letra":"B","texto":"En la motivación de las mujeres para asistir al recital de la diva.","es_correcta":true},{"letra":"C","texto":"En el afán de la narradora por destacar su diferencia de edad con la diva.","es_correcta":false},{"letra":"D","texto":"En el hecho de que algunas opinan que la diva es una vieja poeta fracasada.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'B',
  puntaje = 1,
  eje_tematico_id = 'eje-len-1',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-28';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 4 (Continuación):

**29. Al final del cuento, la narradora defiende la veracidad de su testimonio ante alguien que cuestiona la imagen de Etelvina como una diva. ¿Cómo se construye lo verdadero en este cuento?**',
  alternativas = '[{"letra":"A","texto":"A través de la transmisión del recuerdo colectivo sobre la diva.","es_correcta":true},{"letra":"B","texto":"A través de la alusión a localidades reales donde vivió la diva.","es_correcta":false},{"letra":"C","texto":"A través del reconocimiento que da la autoridad a la diva.","es_correcta":false},{"letra":"D","texto":"A través del debate generado sobre el mérito de la diva.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'A',
  puntaje = 1,
  eje_tematico_id = 'eje-len-1',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-29';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 4 (Continuación):

**30. En el cuento, ¿cuál de las siguientes características de la diva se asocia a su origen extranjero?**',
  alternativas = '[{"letra":"A","texto":"Los zapatos negros.","es_correcta":false},{"letra":"B","texto":"El olor de su pelo.","es_correcta":true},{"letra":"C","texto":"Sus ojos lejanos.","es_correcta":false},{"letra":"D","texto":"Su falda roja.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'B',
  puntaje = 1,
  eje_tematico_id = 'eje-len-1',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-30';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 4 (Continuación):

**31. Considerando el siguiente fragmento, ¿cuál es el efecto que tuvo en las personas la llegada de la diva? «En las cinco cuadras que duró el trayecto, se detuvieron los escasos autos, las bicicletas, y enmudecieron los relojes, los vendedores de frutas y balcones».**',
  alternativas = '[{"letra":"A","texto":"Serenidad ante su presencia.","es_correcta":false},{"letra":"B","texto":"Necesidad de hablar de ella.","es_correcta":false},{"letra":"C","texto":"Fascinación al mirarla.","es_correcta":true},{"letra":"D","texto":"Inquietud por su recorrido.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'C',
  puntaje = 1,
  eje_tematico_id = 'eje-len-1',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-31';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 4 (Continuación):

**32. ¿Por qué al testimonio que entrega la recepcionista del hotel se le hacen “notas al margen”?**',
  alternativas = '[{"letra":"A","texto":"Porque su relato estaba influido por su juicio alterado.","es_correcta":true},{"letra":"B","texto":"Porque su recuerdo se había distorsionado con el tiempo.","es_correcta":false},{"letra":"C","texto":"Porque sus impulsos la hacían actuar irresponsablemente.","es_correcta":false},{"letra":"D","texto":"Porque sus declaraciones fueron modificadas en las crónicas.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'A',
  puntaje = 1,
  eje_tematico_id = 'eje-len-1',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-32';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 4 (Continuación):

**33. En el cuento, ¿qué testimonio es poco confiable para reconstruir la visita de la diva?**',
  alternativas = '[{"letra":"A","texto":"El de Kurt.","es_correcta":false},{"letra":"B","texto":"El de Welzer.","es_correcta":false},{"letra":"C","texto":"El del vigilante.","es_correcta":false},{"letra":"D","texto":"El de la recepcionista.","es_correcta":true}]'::jsonb,
  respuesta_correcta = 'D',
  puntaje = 1,
  eje_tematico_id = 'eje-len-1',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-33';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 4 (Continuación):

**34. ¿Con qué finalidad se menciona la “primera guerra” en el cuento?**',
  alternativas = '[{"letra":"A","texto":"Para exponer la motivación de la diva para viajar a Europa.","es_correcta":false},{"letra":"B","texto":"Para fundamentar la necesidad de un evento alegre en el pueblo.","es_correcta":false},{"letra":"C","texto":"Para explicar que el pueblo se ha mantenido igual durante décadas.","es_correcta":false},{"letra":"D","texto":"Para evidenciar el impacto que tuvo la noticia de la llegada de la diva.","es_correcta":true}]'::jsonb,
  respuesta_correcta = 'D',
  puntaje = 1,
  eje_tematico_id = 'eje-len-1',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-34';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 4 (Continuación):

**35. Un lector considera que la pasión del pueblo por la diva llega hasta lo irracional. ¿Qué hecho del cuento permite fundamentar esta interpretación?**',
  alternativas = '[{"letra":"A","texto":"El anhelo de que la ciudad llevara el nombre de la diva.","es_correcta":false},{"letra":"B","texto":"El cuidado de los objetos de la suite ocupada por la diva.","es_correcta":false},{"letra":"C","texto":"La preservación de una estatua hecha en honor a la diva.","es_correcta":false},{"letra":"D","texto":"La donación de ropa que podría conservar la mirada de la diva.","es_correcta":true}]'::jsonb,
  respuesta_correcta = 'D',
  puntaje = 1,
  eje_tematico_id = 'eje-len-1',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-35';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 4 (Continuación):

**36. ¿Cómo es la reacción del gobierno frente a la solicitud del pueblo?**',
  alternativas = '[{"letra":"A","texto":"Displicente, ya que es indiferente hacia el deseo del pueblo.","es_correcta":true},{"letra":"B","texto":"Violenta, ya que impone su voluntad ante la del pueblo.","es_correcta":false},{"letra":"C","texto":"Negligente, ya que descuida los derechos del pueblo.","es_correcta":false},{"letra":"D","texto":"Indulgente, ya que perdona las acciones del pueblo.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'A',
  puntaje = 1,
  eje_tematico_id = 'eje-len-1',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-36';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 4 (Continuación):

**37. ¿Qué tesoro del museo cuida la narradora?**',
  alternativas = '[{"letra":"A","texto":"Los mapas de las ciudades que recorrió la diva.","es_correcta":false},{"letra":"B","texto":"Los objetos cotidianos usados por la diva.","es_correcta":true},{"letra":"C","texto":"La estatua de la figura de la diva.","es_correcta":false},{"letra":"D","texto":"El cuaderno de poemas que utilizó la diva.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'B',
  puntaje = 1,
  eje_tematico_id = 'eje-len-1',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-37';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 5: preguntas 38 a 47 
 
Fragmento del informe Estadísticas Culturales, publicado por el Instituto Nacional de 
Estadísticas (INE) el año 2020. 
 
 
Fenómeno cultural: problemáticas, definiciones y otros aspectos sobre 
la medición de las culturas 
 
Definir los parámetros de “lo cultural” ha sido el gran desafío para la construcción de 
indicadores que permitan medir de manera multidimensional el impacto de la cultura en el 
desarrollo. Es por ello que, ante una compleja labor en constante evaluación y 
reconstrucción, se ha adoptado la definición de Unesco: 
 
La cultura debe ser considerada el conjunto de los rasgos distintivos espirituales y 
materiales, intelectuales y afectivos que caracterizan a una sociedad o a un grupo 
social, y que abarca, además de las artes y las letras, los modos de vida, las maneras 
de vivir juntos, los sistemas de valores, las tradiciones y las creencias (Unesco, 2009, 
p. 9). 
 
De esta definición se desprende que el sector de la cultura, las artes y el patrimonio es 
amplio, diverso y complejo en sus límites. Aquello, lo vuelve difícil de categorizar, puesto 
que comprende aspectos variados que pueden ir desde una práctica individual, a un 
espectáculo o una acción colectiva, hasta bienes materiales e inmateriales. 
 
Desde ahí se puede comprender el sector cultural, artístico y patrimonial como un verdadero 
ecosistema, en el que participan actores de distinta naturaleza –creadores y creadoras, 
cultoras y cultores, agrupaciones artísticas y patrimoniales, agentes culturales públicos y 
privados; entidades intermediarias, comunidades y públicos, espacios, prácticas, 
ciudadanía, visitantes–, cuya “interacción se sustenta en prácticas y hábitos culturales y se 
expresa en la generación y circulación de creaciones artísticas, experiencias creativas y 
conocimientos, además de la integración de contenidos simbólicos y herencias culturales 
que fortalecen la cohesión” (Ministerio de las Culturas, las Artes y el Patrimonio, 2021, p. 
24). 
 
LOS AGENTES CULTURALES, ARTÍSTICOS Y PATRIMONIALES 
 
Como se señaló, en el sector cultural, artístico y patrimonial intervienen distintos actores o 
agentes culturales, entendidos como toda persona (natural o jurídica) o grupo que realiza 
labores relacionadas con la cultura, las artes y el patrimonio, siendo, entonces, quienes 
posibilitan el desarrollo de la actividad cultural, artística o patrimonial, en los distintos 
dominios culturales. 
 
 

 
Desde la mirada económica se busca representar a los agentes culturales con una visión 
más centrada en el valor agregado, la producción de conocimiento/valor simbólico y el 
impacto de esta área en la economía de un país (aporte al PIB4), para lo cual es necesario 
detallar y explicitar quiénes son, qué producen y en qué etapa de la cadena productiva se 
encuentran.  
 
Sin embargo, esta puede ser una idea muy acotada de lo que significa un agente cultural, 
ya que su accionar puede también desarrollarse fuera del marco de la economía, en muchos 
casos enfocado en el desarrollo sociocultural de las personas y las comunidades. Esto es 
relevante dado que el mercado laboral en cultura se caracteriza por sus altas tasas de 
informalidad, como lo indican distintos estudios, por lo que esta dimensión resulta compleja 
de medir e identificar. 
 
Como se puede observar, el concepto de “agente cultural” es amplio e inclusivo, con la 
finalidad de abarcar la totalidad de actores que puedan ser denominados como culturales, 
artísticos y patrimoniales, a todos quienes hacen posible el ciclo cultural, ya sean personas 
naturales o jurídicas, o que sus actividades se realicen en la formalidad o en la informalidad. 
Y, desde esa perspectiva, resulta evidente que la relevancia de los agentes excede el rol 
operativo que juegan en las fases del ciclo cultural, ya que tienen un impacto social y 
económico en la comunidad y el territorio donde operan. 
 
Desde un punto de vista operacional, se definirán las siguientes categorías para situar el 
actuar de quienes intervienen como agentes culturales en sus contextos económicos y 
sociales: 
 
• Hecho cultural: responde a la pregunta “¿cuál?”, referida a la acción, evento, práctica, 
expresión o manifestación que se realiza en el campo de la cultura. 
• Objeto cultural: responde a la pregunta “¿qué?” del hecho cultural, correspondiendo a los 
bienes y/o servicios que el agente cultural crea, produce, interpreta, difunde, media, 
comercializa, promueve, restaura, etc.  
• Operación: responde a la pregunta “¿para qué?” del hecho cultural, correspondiendo a las 
posibles acciones sobre el objeto cultural para ofertar, usar, acumular, transmitir, difundir, 
etc. 
 
Además, ellos pueden cumplir distintas funciones (Martinell, 2000), tres de las cuales 
destacamos:  
 
 
                                                 
4 Producto Interno Bruto.  

 
• Los agentes culturales son una plataforma para fomentar la autoorganización de servicios, 
así como también para la organización de la iniciativa privada y mercantil, a partir del 
establecimiento de organizaciones propias.  
• Los agentes culturales ejercen una función prospectiva al descubrir y evidenciar nuevas 
necesidades o problemáticas de la sociedad y despertar una preocupación en los 
estamentos oficiales por estos temas. 
• Los agentes culturales son actores imprescindibles para dinamizar y garantizar el derecho 
a participar en la vida cultural en democracia. 
 
Estos actores se pueden categorizar a grandes rasgos en: Agentes públicos (servicios del 
Estado, gobiernos regionales, gobiernos comunales), Agentes privados (empresas, 
asociaciones privadas, profesionales, artistas, cultores y cultoras e industrias culturales) y 
Agentes del tercer sector (fundaciones, asociaciones, ONG5, organizaciones comunitarias 
y agrupaciones varias) (INE, 2019). 
 
La existencia de una variada red de agentes culturales está relacionada directamente con 
el desarrollo social, cultural y económico de una comunidad, por lo que tendrá una 
configuración distinta dependiendo de las características del lugar donde estos agentes 
operan. Estos, a su vez, pueden ir modificando su comportamiento y condición, lo que 
implica que “los agentes son una variable dinámica del territorio que va cambiando y 
evolucionando a lo largo del tiempo de acuerdo con las condiciones de desarrollo y su 
distribución territorial” (Martinell, 2000, p. 1). 
 
Ahora bien, para que los agentes culturales puedan desarrollar toda su potencialidad, 
necesitan reconocerse mutuamente, entender su complementariedad y planificar su acción; 
requieren organizarse para poder constituirse como interlocutores ante quienes toman las 
decisiones (Martinell, 2000). Y para que esto ocurra, la información resulta de primera 
necesidad. 
  
Así, identificar a los agentes culturales, artísticos y patrimoniales permite dimensionar lo que 
ocurre en el sector: quién interviene y cómo, qué crean o producen, en qué espacio, cómo 
se organizan, su aporte al territorio, y otras interrogantes de interés para los propios actores 
en juego, la ciudadanía y el Estado. De esta manera, a partir de la información se podrán 
elaborar políticas sociales y medir el impacto económico y social del sector cultural. 
 
 
Instituto Nacional de Estadísticas (INE). (2020). Estadísticas culturales, informe anual 2020. 
https://www.ine.gob.cl/docs/default-source/cultura/publicaciones-y-
anuarios/publicaciones/estad%C3%ADsticas-culturales-informe-anual-2020.pdf?sfvrsn=474b6e96_2 
 
 
 
                                                 
5 Organización No Gubernamental.

---

**38. ¿Qué problema intenta resolver la definición de cultura de la Unesco?**',
  alternativas = '[{"letra":"A","texto":"El sesgo que genera un concepto restringido de cultura.","es_correcta":false},{"letra":"B","texto":"La complejidad que evidencia la aplicación del concepto “cultura”.","es_correcta":true},{"letra":"C","texto":"La falta de investigaciones centradas en el concepto de cultura.","es_correcta":false},{"letra":"D","texto":"El fracaso de las políticas públicas en torno al concepto “cultura”.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'B',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-38';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 5 (Continuación):

**39. ¿Para qué se compara el sector cultural con un ecosistema?**',
  alternativas = '[{"letra":"A","texto":"Para describir la necesidad de proteger a sus agentes más vulnerables.","es_correcta":false},{"letra":"B","texto":"Para exponer la ventaja de desarrollar todas sus áreas equitativamente.","es_correcta":false},{"letra":"C","texto":"Para explicar la dificultad de delimitar sus áreas constitutivas.","es_correcta":false},{"letra":"D","texto":"Para mostrar la interacción entre sus diversos componentes.","es_correcta":true}]'::jsonb,
  respuesta_correcta = 'D',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-39';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 5 (Continuación):

**40. ¿Cuál es la relación entre el segundo y el tercer párrafo de la sección “LOS AGENTES CULTURALES, ARTÍSTICOS Y PATRIMONIALES”?**',
  alternativas = '[{"letra":"A","texto":"El segundo plantea la visión económica sobre los agentes culturales y el tercero expresa las limitaciones de esta visión.","es_correcta":true},{"letra":"B","texto":"El segundo explica el impacto del valor simbólico en la economía y el tercero describe la invisibilización de este impacto.","es_correcta":false},{"letra":"C","texto":"El segundo plantea el aporte económico de la cultura al mercado laboral y el tercero revela una falta de consideración de este aporte.","es_correcta":false},{"letra":"D","texto":"El segundo explica los incentivos económicos que reciben los agentes culturales y el tercero detalla los perjuicios de estos incentivos.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'A',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-40';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 5 (Continuación):

**41. Según la lectura, ¿qué característica tiene el mercado laboral en cultura?**',
  alternativas = '[{"letra":"A","texto":"Es acotado.","es_correcta":false},{"letra":"B","texto":"Es informal.","es_correcta":true},{"letra":"C","texto":"Es inclusivo.","es_correcta":false},{"letra":"D","texto":"Es productivo.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'B',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-41';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 5 (Continuación):

**42. Respecto del actuar del agente cultural, ¿a qué se refiere la categoría “objeto cultural”?**',
  alternativas = '[{"letra":"A","texto":"Al servicio que genera.","es_correcta":true},{"letra":"B","texto":"A la finalidad que persigue.","es_correcta":false},{"letra":"C","texto":"Al contexto en el que actúa.","es_correcta":false},{"letra":"D","texto":"A la necesidad que satisface.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'A',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-42';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 5 (Continuación):

**43. Una de las municipalidades de la Región del Maule ha decidido organizar un festival de artesanía para la exhibición y promoción de los trabajos de diversos artesanos locales. Desde el punto de vista operacional mencionado en la lectura, ¿a qué acción se asocia esta iniciativa?**',
  alternativas = '[{"letra":"A","texto":"A las expresiones artísticas que se desarrollan en el campo de la cultura.","es_correcta":false},{"letra":"B","texto":"A las actividades que se realizan para la difusión del objeto cultural.","es_correcta":true},{"letra":"C","texto":"A la comercialización de los bienes en el campo de la cultura.","es_correcta":false},{"letra":"D","texto":"Al ofrecimiento de servicios a partir del objeto cultural.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'B',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-43';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 5 (Continuación):

**44. ¿Cuál es una de las funciones prospectivas de los agentes culturales?**',
  alternativas = '[{"letra":"A","texto":"Crear las plataformas para la autoorganización de los servicios culturales.","es_correcta":false},{"letra":"B","texto":"Revelar las necesidades culturales de la sociedad a estamentos oficiales.","es_correcta":true},{"letra":"C","texto":"Fomentar la participación en las actividades culturales en democracia.","es_correcta":false},{"letra":"D","texto":"Promover la iniciativa cultural a través de organizaciones propias.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'B',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-44';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 5 (Continuación):

**45. Según la lectura, ¿cuál de los siguientes es un agente cultural privado?**',
  alternativas = '[{"letra":"A","texto":"Cultores.","es_correcta":true},{"letra":"B","texto":"Fundaciones.","es_correcta":false},{"letra":"C","texto":"Gobiernos comunales.","es_correcta":false},{"letra":"D","texto":"Organizaciones comunitarias.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'A',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-45';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 5 (Continuación):

**46. Respecto a los agentes culturales, ¿qué pregunta se responde a partir de una síntesis de la información del penúltimo párrafo?**',
  alternativas = '[{"letra":"A","texto":"¿Quiénes son los interlocutores de los agentes culturales?","es_correcta":false},{"letra":"B","texto":"¿Cómo se pueden informar los distintos agentes culturales?","es_correcta":false},{"letra":"C","texto":"¿Cómo se organizan entre sí los diferentes agentes culturales?","es_correcta":false},{"letra":"D","texto":"¿Qué es relevante para el desarrollo de los agentes culturales?","es_correcta":true}]'::jsonb,
  respuesta_correcta = 'D',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-46';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 5 (Continuación):

**47. En el contexto de una postulación a un fondo, se le solicita a una agrupación musical explicar la “Operación” que aborda. ¿Cuál de las opciones corresponde a la información requerida?**',
  alternativas = '[{"letra":"A","texto":"Realizar conciertos en parques públicos.","es_correcta":false},{"letra":"B","texto":"Crear un álbum de música folclórica infantil.","es_correcta":false},{"letra":"C","texto":"Acercar el folclor musical chileno a los niños.","es_correcta":true},{"letra":"D","texto":"Sortear entradas al concierto en redes sociales.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'C',
  puntaje = 1,
  eje_tematico_id = 'eje-len-2',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-47';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 6: preguntas 48 a 55 
 
Fragmento del ensayo escrito por Rosario Castellanos, publicado por primera vez el año 
1959. 
 
 
El escritor y su público 
 
¿Qué es un escritor? La pregunta puede contestarse con una respuesta obvia: un escritor 
es una persona que escribe. 
 
Una persona que escribe; hela aquí, ante la página en blanco, uno de los abismos a los que 
en ocasiones nos enfrenta el azar. ¿Escribe? No. Mordisquea la punta del lápiz, se mesa 
los cabellos6, da vueltas por la habitación como una fiera enjaulada. Vacilaciones, plazos, 
arrepentimientos. Y, con la decisión de quien se lanza al agua, surge la primera letra. La 
mano, tan dócil en otros quehaceres, se crispa: el brazo se acalambra; las ideas zumban 
con la insolencia de la mosca, escapan a los papirotazos7. 
 
De un modo o de otro la hoja de papel se llena. ¿Qué ha pasado? Que el suceso que se 
quería narrar (un suceso vivo, fluyente, cálido) aparece opaco, desabrido, hosco. Alguien 
ha traicionado a nuestro protagonista y en cada sílaba se advierte el jadeo del esfuerzo, la 
desobediencia de los músculos, los sobresaltos de la mente. No le queda más alternativa 
que cerrar, avergonzado, el cuaderno y jurarse no volver a abrirlo más que para la redacción 
de formularias esquelas de negocios o la consignación de alguna cifra, de algún dato 
importante. 
 
Rectifiquemos entonces. El escritor no es cualquier persona que escribe sino la persona 
que tiene facilidad para escribir. Alguien que hace un ensalmo, que dice un conjuro y de 
inmediato suscita la ocurrencia feliz, el razonamiento convincente, la comparación certera. 
Su actividad tiene la apariencia de un juego, de un acontecimiento que se desarrolla fuera 
de los ámbitos de este mundo en que la pesadez es una condición y la gravedad, una ley. 
 
Aptitud tan gratuita bien puede ser desperdiciada en festejar la ocasión vana, en conmover 
el sentimiento frívolo, en cosechar el aplauso barato. 
 
La mayoría se confunde y acepta como escritor a quien detenta este virtuosismo de 
recetario, pero nosotros procuraremos no caer en el error. Para el escritor auténtico, escribir 
es una disposición de la naturaleza a la que se añade un hábito de la voluntad. Y este hábito 
es una conquista del trabajo arduo, un resultado de la paciencia lúcida. Detrás de cada 
página tersa, de cada texto ordenado, deleitoso, nítido, se ocultan las infinitas tachaduras, 
los borrones inconformes, los cestos llenos de papeles desechados. El aprendizaje 
consume tiempo, exige sacrificios y muy frecuentemente rinde fracasos. 
 
 
                                                 
6 Se arranca los cabellos.  
7 Golpes dados con las manos. 

 
Porque ¡cuántas veces la aplicación, el esmero, no obtienen más resultado que la obra 
mediocre o, lo que es peor, ninguna obra! El idioma de que el escritor se sirve, como todo 
ser viviente, tiene sus caprichos, sus reticencias impredecibles, sus bruscos abandonos. No 
es una cosa que se nos haya enajenado en propiedad y por la que pagamos un precio; es 
una persona que se nos entrega en amor. Cada acto de donación amorosa es único y no 
crea derechos en quien lo recibe. Así ni el mañana es seguro ni el ayer es impositivo. Por 
eso el escritor está, en relación con su obra, como se dice en el verso de López Velarde: al 
día y de milagro. 
 
¿De qué modo emplear ese milagro? O más claramente: ¿cómo escribir? ¿Acerca de qué 
escribir? ¿Para quién escribir? 
 
La respuesta, por desgracia, no es una. Hay quienes opinan que lo importante de la escritura 
es el estilo, el pulimento, la posesión segura de la técnica, el dominio de los recursos. El 
tema ya es cuestión secundaria y el lector es un iniciado en los secretos del oficio, alguien 
que comprende el signo, casi imperceptible, que el autor le envía y que lo acoge con una, 
casi imperceptible también, sonrisa de agrado. 
 
Quedamos en que al arte purista le preocupa el “cómo” y no le importa mucho ni el “qué” ni 
el “para quién” de su trabajo. Es un hombre estético, a diferencia del escritor comprometido, 
en quien predominan las tendencias morales y prácticas. 
 
El escritor comprometido mira el mundo que lo circunda y declara, como era de esperarse, 
que ese mundo está mal hecho; inmediatamente pone manos a la obra para mejorarlo. 
Enarbola una teoría cualquiera y se convierte en su propagandista. Un libro es un utensilio, 
una especie de ladrillo que se usa indistintamente para levantar una casa o para ser arrojado 
como un proyectil contra la cabeza de alguien o de algo. 
 
La literatura comprometida está hecha de pruebas, de alegatos, de refutaciones. Leerla 
puede no causarnos placer pero nos inclina a asentir o a rechazar. Está cargada […] de 
elementos dinámicos que inducen a la acción. Se dirige no a la capilla cerrada ni al cenáculo 
de escogidos, sino a la masa entre la que quiere hacer prosélitos8. 
 
¿Quién de los dos –el arte purista o el escritor comprometido– está en lo justo? En nuestra 
opinión, ninguno. Al escoger un aspecto de la creación y descuidar los otros, ambos mutilan 
sus capacidades, cercenan la realidad expresada y excluyen virtuales interlocutores. Y en 
el escritor auténtico la plenitud debe ser, si no un logro, por lo menos una constante 
aspiración. 
 
 
                                                 
8 Adherentes a una causa, ideología, colectividad, partido político, etc. 

 
Pone en peligro esta aspiración el que se enajena al adherirse a un dogma, afiliarse a un 
partido o sustentar un “ismo”. Subordinarse así es indispensable en los momentos primeros 
de la evolución literaria, pues sirve como punto de partida o de apoyo, como base de 
operaciones. Pero su función se desnaturaliza cuando la subordinación degenera en límite 
infranqueable, móvil único y último argumento. Desde ese instante el escritor resulta incapaz 
de considerar como válidos intereses ajenos a los propios ni de admitir otras perspectivas, 
aunque sean más amplias o más correctas que las suyas. 
 
Renuncia también a la plenitud el que cede a la inercia. Es un error muy aceptado suponer 
que el artista se circunscribe a la zona “sentimental, sensible y sensitiva”. Las emociones   
–se afirma– lo ponen en contacto con lo trascendente y en un chispazo de intuición le son 
revelados los misterios. Su instinto atina donde la razón tropieza. El rigor esteriliza lo que 
toca y es en el ocio donde madura la obra, en la improvisación donde se manifiesta. 
 
Postura tal no puede conseguir más que incoherencias. Atisbos geniales, quizá, pero nunca 
un esqueleto sustentador de propósitos fijos, de ideas esclarecedoras, de referencias 
identificables. El autor malogra sus facultades, ya no creadoras sino meramente psíquicas. 
A nadie beneficia la parálisis del juicio crítico, la falta de estímulos para el pensamiento. Y 
menos que a nadie, al escritor. 
 
Porque, a fin de cuentas, la literatura es también una actividad intelectual y por lo tanto opera 
con un instrumento muy delicado, muy preciso, al que cualquier conmoción desajusta y 
cualquier presión disloca: la inteligencia. 
 
Entendemos aquí, por inteligencia, una instancia superior que orienta, rige y discierne los 
actos que propiamente pueden llamarse espirituales; que los califica dándoles el rango que 
les corresponde y que hace todo lo contrario de estorbarlos, castrarlos o torcerlos. 
 
¿Por qué la inteligencia había de menoscabar la imaginación, que es uno de sus agentes? 
¿Por qué había de enfriar la pasión, que es una de sus condiciones? 
 
La inteligencia también es apetito; convive, compadece, recrea. Tanto inventa con libertad 
como observa con exactitud. Nunca es pasiva. Y solo cuando su acicate9 nos falta es cuando 
nos conformamos con el lugar común, con la frase hecha, con el dictamen de segunda 
mano. 
 
 
                                                 
9 Estímulo. 

 
La inteligencia, según el afortunado hallazgo de José Gorostiza, es “soledad en llamas”. 
Soledad, no aislamiento, ni cerrazón del egoísmo, de la ignorancia, del desdén; sino 
disponibilidad para el acogimiento de lo esencial. En sus ámbitos, el intelecto entra en 
comunicación con todo y con todos; fuera de ellos se corrompe. La inteligencia está perdida, 
dice Simone Weil, desde el momento en que se expresa con la palabra nosotros. Su ejercicio 
es una responsabilidad estrictamente privada. 
 
En el escritor la soledad es estilo, modo peculiar de ver y expresarse. Una adquisición rara. 
Porque el escritor es un hombre de carne y hueso que nace y se desarrolla y cumple su 
vocación en circunstancias muy concretas. 
 
 
Castellanos, R. (2017). Juicios Sumarios. Fondo de Cultura Económica.

---

**48. Respecto de la acción de escribir, ¿cuál es el propósito de la emisora?**',
  alternativas = '[{"letra":"A","texto":"Justificar el rol del escritor en la sociedad.","es_correcta":false},{"letra":"B","texto":"Reflexionar sobre el oficio del escritor.","es_correcta":true},{"letra":"C","texto":"Proponer un método para la escritura.","es_correcta":false},{"letra":"D","texto":"Analizar el proceso de escritura.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'B',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-48';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 6 (Continuación):

**49. ¿Qué recurso utiliza la emisora para involucrar al lector en la temática que aborda?**',
  alternativas = '[{"letra":"A","texto":"Utiliza ejemplos de la vida cotidiana.","es_correcta":false},{"letra":"B","texto":"Menciona a algunos escritores de renombre.","es_correcta":false},{"letra":"C","texto":"Formula preguntas para articular la lectura.","es_correcta":true},{"letra":"D","texto":"Explica con precisión los conceptos que incorpora.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'C',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-49';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 6 (Continuación):

**50. ¿Qué postura asume la emisora ante la labor del escritor comprometido?**',
  alternativas = '[{"letra":"A","texto":"De cuestionamiento, pues advierte los riesgos de escribir desde una ideología.","es_correcta":true},{"letra":"B","texto":"De desconfianza, pues sospecha de los intereses plasmados en las obras.","es_correcta":false},{"letra":"C","texto":"De rechazo, pues critica su despreocupación por las tendencias literarias.","es_correcta":false},{"letra":"D","texto":"De cautela, pues duda de su capacidad de transformar la realidad.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'A',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-50';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 6 (Continuación):

**51. En la lectura, ¿qué efecto busca lograr en el lector la incorporación de expresiones como “rectifiquemos”, “procuraremos”, “quedamos” y “entendemos”?**',
  alternativas = '[{"letra":"A","texto":"Que se incline por una postura sobre los escritores.","es_correcta":false},{"letra":"B","texto":"Que se involucre en la reflexión acerca de los escritores.","es_correcta":true},{"letra":"C","texto":"Que se incluya en la tarea de definir la labor de los escritores.","es_correcta":false},{"letra":"D","texto":"Que se interese por profundizar en el estudio de los escritores.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'B',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-51';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 6 (Continuación):

**52. A partir del contenido del tercer párrafo, ¿en qué consiste la “traición” que sufre el escritor?**',
  alternativas = '[{"letra":"A","texto":"En que quien escribe tiene una idea artística, pero le cuesta materializarla.","es_correcta":true},{"letra":"B","texto":"En que quien escribe imagina un proyecto creativo, pero elabora un texto utilitario.","es_correcta":false},{"letra":"C","texto":"En que quien escribe crea un personaje literario, pero está disconforme con el resultado.","es_correcta":false},{"letra":"D","texto":"En que quien escribe elabora un plan de escritura, pero su cuerpo le impide concretarlo.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'A',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-52';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 6 (Continuación):

**53. En el cuarto párrafo, ¿qué característica le atribuye la emisora al escritor?**',
  alternativas = '[{"letra":"A","texto":"Destreza, pues posee habilidad para crear mundos propios.","es_correcta":true},{"letra":"B","texto":"Rigor, pues trabaja con esfuerzo para que la escritura surja.","es_correcta":false},{"letra":"C","texto":"Lucidez, pues descifra acontecimientos poco convencionales.","es_correcta":false},{"letra":"D","texto":"Persistencia, pues continúa escribiendo sin obtener resultados.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'A',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-53';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 6 (Continuación):

**54. En relación con su obra, ¿por qué se dice que un escritor está “al día y de milagro”?**',
  alternativas = '[{"letra":"A","texto":"Porque el destino de un escritor puede mejorar repentinamente.","es_correcta":false},{"letra":"B","texto":"Porque el talento de un escritor carece de una causa perceptible.","es_correcta":false},{"letra":"C","texto":"Porque el lenguaje de un escritor debe sobrevivir al paso del tiempo.","es_correcta":false},{"letra":"D","texto":"Porque el virtuosismo de un escritor puede desaparecer inesperadamente.","es_correcta":true}]'::jsonb,
  respuesta_correcta = 'D',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-54';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 6 (Continuación):

**55. Según la emisora, ¿cuál debe ser la aspiración de un escritor auténtico?**',
  alternativas = '[{"letra":"A","texto":"La justicia.","es_correcta":false},{"letra":"B","texto":"La estética.","es_correcta":false},{"letra":"C","texto":"La plenitud.","es_correcta":true},{"letra":"D","texto":"La trascendencia.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'C',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-55';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 7: preguntas 56 a 65 
 
Artículo informativo escrito por Lucía Galotti, publicado en el sitio web Formación IB el año 
2020. 
 
 
¿Cuál es el papel que ocupan la ciencia y la tecnología en la sociedad y 
la cultura contemporánea? 
 
¿Cuál es la relación entre las ciencias y las tecnologías? ¿Qué se entiende por innovación? 
¿Pueden considerarse las ciencias y las tecnologías como pilares del desarrollo local y 
regional? ¿Qué vínculo tiene la escuela con el desarrollo tecnológico? ¿Cuál es el impacto 
de los cambios tecnológicos en esta sociedad desigual? 
 
Los dos últimos siglos son y han sido testigos de monumentales revoluciones tecnológicas 
y de los cambios sociales, políticos y económicos que las acompañaron. Tampoco somos 
ajenos a su incidencia en la concentración y equilibrio de poder en el mundo. El actual siglo 
XXI, donde el conocimiento y la información son una pieza central del motor de la sociedad, 
es heredero de la historia de épocas pasadas. 
 
La investigación científica y sus aplicaciones tecnológicas no se encuentran aisladas de la 
sociedad en la que se insertan, lo que genera amplias discusiones sobre el rol social de la 
ciencia. Ya en el siglo XVII, con Galileo, Kepler o Newton, se puso en marcha la revolución 
científica moderna y paralelamente uno de los movimientos de innovación tecnológicos más 
significativos en cuanto a su impacto transformador de la sociedad: la Revolución Industrial. 
 
Pero el siglo XX pasado no se quedó atrás, tanto la electricidad, como el motor a explosión, 
las telecomunicaciones y más próximamente la informática, dieron forma a cambios aún 
más profundos y acelerados. Ni hablar de la velocidad de las transformaciones acaecidas 
en este siglo XXI, en el que aparecen nuevas tecnologías que modifican la forma de 
comunicarnos, de movernos en el mundo, de abordar el tratamiento de enfermedades, o 
nuevos materiales, solo por mencionar algunos de los más relevantes. 
 
¿En qué momento se dio este punto de inflexión en la historia de la humanidad? ¿Cuándo 
y cómo el conocimiento y sus aplicaciones pasaron a ser rentables y se constituyeron en 
factores del poder económico y político? 
 
Hasta la Revolución Industrial, la ciencia y la técnica iban por carriles distintos. Los 
científicos se proponían avanzar en el conocimiento del mundo y la técnica era artesanal, 
un saber empírico nacido desde la práctica, que se transmitía de maestro a aprendiz, sin 
preguntarse por los fundamentos teóricos. ¿Había innovaciones? Sí, pero de manera 
pragmática, para resolver algún problema técnico. Fue de esta forma como nacieron la 
rueda hidráulica, el molino de viento y hasta la máquina a vapor. Esto se revirtió a partir de  
 
 

 
la Revolución Industrial. Los científicos comenzaron a involucrarse en la aplicación de sus 
conocimientos a la industria y los empresarios se interesaron en ella para obtener mayores 
ganancias. La ciencia y la tecnología en la actualidad movilizan grandes inversiones, tanto 
estatales como privadas. Asimismo, se han desvanecido los límites tajantes entre ciencia 
pura, ciencia aplicada y tecnología. Generalmente, hay equipos de investigación en los que 
se comparten los conocimientos. Por ejemplo, entre las personas que trabajan en los 
equipos de investigación y desarrollo, muchas veces es difícil diferenciar por su función, a 
científicos, ingenieros o técnicos. 
 
En los tiempos actuales, los avances científicos y tecnológicos son vertiginosos, lo cual 
influye en la economía de los pueblos y por supuesto, en la economía mundial. También 
incide en la calidad de vida. Pero hay que ser cautelosos. ¿Quiénes tienen acceso? ¿Qué 
efectos provocan en el ambiente? ¿Y en la salud? La carrera tecnológica no debería 
mantener al margen el incremento sostenido del bienestar de todas las personas de manera 
de lograr un desarrollo incluyente y sostenible. 
 
Al mismo tiempo, el grado de acceso al conocimiento traza una línea entre los países. Los 
que tienen mayor desarrollo acceden al bienestar y al ejercicio pleno de sus derechos. El 
resto, que no logra incorporar el conocimiento para innovar y crecer, se expone a un 
deficiente crecimiento económico y a la pobreza. ¿Qué ocurre en América Latina? Creo que 
estamos a mitad de camino, ya que no logramos despegar del todo en lo que se refiere a 
desarrollo científico y tecnológico. Este es el desafío que tienen países como Argentina, 
para superar el tipo de producción basada en la agricultura y la ganadería e incluir en su 
matriz productiva otros sectores como la agroindustria, la industria e innovación en los 
alimentos, en medicamentos, equipamientos médicos, nuevas formas de energía o 
biotecnología aplicada.  
 
¿Pero qué significa innovar? ¿Inventar algo nuevo? Es más que eso, ya que va desde un 
conocimiento hasta un producto, un proceso nuevo, una forma distinta y más eficiente de 
hacer algo, o un nuevo servicio, que llega efectivamente al mercado. Si un nuevo hallazgo 
no se logra vender, no hay innovación. No necesariamente se necesita una proeza 
tecnológica. Sí es necesario ser creativo, pensar diferente. El diseño de un producto, los 
materiales que se utilizan, mejorar la calidad y reducir costos, nuevas formas de venta, por 
ejemplo la venta a través de la web, son formas de innovación. ¿En Argentina, la educación 
promueve la creatividad, el pensar diferente, o por el contrario favorece la repetición, 
conocer lo que ya está dado? ¿Cuáles son los desafíos que debemos enfrentar para educar 
pensando en el futuro, en los tiempos que vivirán nuestros niños y jóvenes? Es algo que 
hay que poner en el centro de la discusión cuando se debate qué tipo de educación científica 
debería promoverse. 
 
 

 
¿Cómo suscitar desarrollos tecnológicos innovadores en Argentina? ¿De qué manera se 
puede fomentar la innovación tecnológica? 
 
Como ya se dijo, habría que hacerlo tanto al nivel de las producciones más sencillas como 
en aquellas con un mayor impacto económico y social, en el marco de nuestras 
posibilidades, teniendo en cuenta nuestra realidad. Muchas veces es inútil copiar 
tajantemente otros modelos. Sí estudiarlos y analizarlos, pero para pensar algo que se 
ajuste a nuestra peculiaridad. Para ello, es menester favorecer la incorporación de 
conocimiento en el proceso productivo. Lograrlo requiere de una sociedad en que se 
incrementen gradualmente los conocimientos de la población. 
 
Tanto para generar riqueza como para la reducción de los desequilibrios sociales y la 
democratización de la sociedad, es imprescindible que quienes producen bienes y servicios 
tengan conocimientos sofisticados, elevados, que les posibiliten innovar y descubrir nuevos 
problemas y soluciones. Una sociedad con altos porcentajes y número creciente de 
personas con acceso a una educación de calidad, más cerca de las mejores prácticas 
internacionales, capaces de romper con lo que está dado, plantearse desafíos y formas 
creativas de resolverlos, es una sociedad más libre, más rica y más equilibrada. 
 
Como país debemos poner este tema sobre el tapete. Lo urgente no nos permite ver lo 
importante. Establecer redes entre las universidades, las empresas y el Estado, pensar en 
cuáles son las inversiones que hay que realizar de manera prioritaria y en qué áreas de la 
producción, en función de la realidad y las características de nuestro país, sin imitar otros 
modelos, pero aprendiendo de ellos. 
 
 
Galotti, L. (2020). ¿Cuál es el papel que ocupan la ciencia y la tecnología en la sociedad y la cultura 
contemporánea? Formación IB. http://formacionib.org/noticias/?Cual-es-el-papel-que-ocupan-la-ciencia-y-la-
tecnologia-en-la-sociedad-y-la

---

**56. Según la lectura, ¿qué elementos movilizan la sociedad del siglo XXI?**',
  alternativas = '[{"letra":"A","texto":"La información y el conocimiento.","es_correcta":true},{"letra":"B","texto":"La concentración y el equilibrio de poder.","es_correcta":false},{"letra":"C","texto":"Las transformaciones políticas y económicas.","es_correcta":false},{"letra":"D","texto":"Las revoluciones tecnológicas y los cambios sociales.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'A',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-56';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 7 (Continuación):

**57. ¿Cuál es uno de los ejemplos de avances del siglo XX mencionados en la lectura?**',
  alternativas = '[{"letra":"A","texto":"La informática.","es_correcta":true},{"letra":"B","texto":"La máquina a vapor.","es_correcta":false},{"letra":"C","texto":"La biotecnología aplicada.","es_correcta":false},{"letra":"D","texto":"El tratamiento de enfermedades.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'A',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-57';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 7 (Continuación):

**58. ¿A qué se refiere el “punto de inflexión” que menciona la emisora en el quinto párrafo?**',
  alternativas = '[{"letra":"A","texto":"Al impacto transformador de la ciencia en la sociedad.","es_correcta":false},{"letra":"B","texto":"Al desarrollo de la revolución científica en la época moderna.","es_correcta":false},{"letra":"C","texto":"A la velocidad de adaptación de la sociedad a los avances tecnológicos.","es_correcta":false},{"letra":"D","texto":"A la transformación en diferentes ámbitos de la vida producto de la tecnología.","es_correcta":true}]'::jsonb,
  respuesta_correcta = 'D',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-58';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 7 (Continuación):

**59. A partir de la lectura, ¿cuál es un aspecto común en invenciones como la rueda hidráulica, el molino de viento y la máquina de vapor?**',
  alternativas = '[{"letra":"A","texto":"Se situaron como ejemplos del avance del conocimiento, sin importar su técnica.","es_correcta":false},{"letra":"B","texto":"Emergieron como artefactos de uso prolongado en el tiempo, sin que se requiriera reemplazar su técnica.","es_correcta":false},{"letra":"C","texto":"Se instalaron como grandes innovaciones de su época, sin revelar la técnica utilizada en su desarrollo.","es_correcta":false},{"letra":"D","texto":"Surgieron como soluciones prácticas a problemas técnicos, sin estar respaldadas por fundamentos teóricos.","es_correcta":true}]'::jsonb,
  respuesta_correcta = 'D',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-59';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 7 (Continuación):

**60. ¿Qué opción representa el sentido del siguiente párrafo de la lectura? «En los tiempos actuales, los avances científicos y tecnológicos son vertiginosos, lo cual influye en la economía de los pueblos y por supuesto, en la economía mundial. También incide en la calidad de vida. Pero hay que ser cautelosos. ¿Quiénes tienen acceso? ¿Qué efectos provocan en el ambiente? ¿Y en la salud? La carrera tecnológica no debería mantener al margen el incremento sostenido del bienestar de todas las personas de manera de lograr un desarrollo incluyente y sostenible».**',
  alternativas = '[{"letra":"A","texto":"El deber de impulsar la economía de los pueblos para favorecer los avances científicos y tecnológicos.","es_correcta":false},{"letra":"B","texto":"La importancia de potenciar los avances científicos para influir de manera positiva en la economía mundial.","es_correcta":false},{"letra":"C","texto":"La necesidad de regular el desarrollo tecnológico para garantizar el bienestar de las personas.","es_correcta":true},{"letra":"D","texto":"El compromiso de cuidar el medio ambiente para mejorar la calidad de vida de las personas.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'C',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-60';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 7 (Continuación):

**61. A partir de la lectura, ¿qué elemento favorecería el avance científico y tecnológico de América Latina?**',
  alternativas = '[{"letra":"A","texto":"La competencia con los países desarrollados.","es_correcta":false},{"letra":"B","texto":"La diversificación de los sectores productivos.","es_correcta":true},{"letra":"C","texto":"La difusión de los logros de la carrera tecnológica.","es_correcta":false},{"letra":"D","texto":"La eliminación de la brecha económica con otros países.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'B',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-61';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 7 (Continuación):

**62. Según lo propuesto por la emisora, ¿qué caracteriza una educación innovadora?**',
  alternativas = '[{"letra":"A","texto":"Su carácter reflexivo y creativo, porque favorece el surgimiento de perspectivas diferentes.","es_correcta":true},{"letra":"B","texto":"Su carácter riguroso y eficiente, porque implementa modelos exitosos en los procesos productivos.","es_correcta":false},{"letra":"C","texto":"Su carácter estratégico y vanguardista, porque se centra en el impacto económico y social de los avances tecnológicos.","es_correcta":false},{"letra":"D","texto":"Su carácter inclusivo y mediador, porque establece un consenso en las maneras de entender la educación tecnológica.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'A',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-62';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 7 (Continuación):

**63. En el contexto del último párrafo, ¿qué idea se desprende de la siguiente expresión: “Lo urgente no nos permite ver lo importante”?**',
  alternativas = '[{"letra":"A","texto":"A pesar de la relevancia del desarrollo científico tecnológico, las necesidades de las personas deben ser prioritarias.","es_correcta":false},{"letra":"B","texto":"Aunque el país debe velar por el desarrollo económico, este desarrollo tecnológico ha sido postergado.","es_correcta":false},{"letra":"C","texto":"Si bien el país tiene necesidades inmediatas, el desarrollo científico tecnológico también debe considerarse fundamental.","es_correcta":true},{"letra":"D","texto":"Pese a que la ciencia y la tecnología son primordiales en la historia de la sociedad, han sido restringidas a ámbitos especializados.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'C',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-3',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-63';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 7 (Continuación):

**64. ¿Con cuál de las preguntas del primer párrafo se relaciona el siguiente segmento del artículo? «La carrera tecnológica no debería mantener al margen el incremento sostenido del bienestar de todas las personas de manera de lograr un desarrollo incluyente y sostenible».**',
  alternativas = '[{"letra":"A","texto":"¿Pueden considerarse las ciencias y las tecnologías como pilares del desarrollo local y regional?","es_correcta":false},{"letra":"B","texto":"¿Cuál es la relación entre las ciencias y las tecnologías?","es_correcta":false},{"letra":"C","texto":"¿Cuál es el impacto de los cambios tecnológicos en esta sociedad desigual?","es_correcta":true},{"letra":"D","texto":"¿Qué vínculo tiene la escuela con el desarrollo tecnológico?","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'C',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-1',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-64';

UPDATE public.preguntas
SET
  enunciado = 'Lectura 7 (Continuación):

**65. ¿Qué función cumplen las preguntas expuestas a lo largo de la lectura?**',
  alternativas = '[{"letra":"A","texto":"Introducen las causas del escaso desarrollo de la ciencia y la tecnología.","es_correcta":false},{"letra":"B","texto":"Organizan el razonamiento de los temas relacionados con la ciencia y la tecnología.","es_correcta":true},{"letra":"C","texto":"Confrontan las distintas posiciones sobre la importancia de la ciencia y la tecnología.","es_correcta":false},{"letra":"D","texto":"Ordenan de manera temporal la información sobre los avances de la ciencia y la tecnología.","es_correcta":false}]'::jsonb,
  respuesta_correcta = 'B',
  puntaje = 1,
  eje_tematico_id = 'eje-len-3',
  habilidad_id = 'hab-len-2',
  fuente = 'DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)',
  updated_at = NOW()
WHERE id = 'preg-paes-lec-26-65';

COMMIT;
