--
-- Migración 070: Restauración oficial de la alternativa E y enunciados truncados
-- para las 17 preguntas PAES cuya clave oficial es E
--
BEGIN;

UPDATE public.preguntas
SET alternativas = '[{"letra":"A","texto":"El proceso eleccionario constituyó la base de las relaciones \nsociales.","es_correcta":false},{"letra":"B","texto":"La conquista de la Independencia fue motivo de orgullo nacional.","es_correcta":false},{"letra":"C","texto":"La clase media fue el nexo entre la oligarquía y los sectores \npopulares.","es_correcta":false},{"letra":"D","texto":"Las diferencias entre socialistas y conservadores originaron la crisis \npolítica.","es_correcta":false},{"letra":"E","texto":"La falta de vínculo entre diferentes sectores de la población fue la causa de la crisis social.","es_correcta":true}]'::jsonb,
    respuesta_correcta = 'E', enunciado = '**28. Lee el siguiente texto: 
 
 
«Es un cuadro espeluznante que nos ofrecen los suburbios de esta 
orgullosa capital en cuyo centro […], se alzan deslumbrantes palacios 
habitados por mujeres soberbias […] sin acordarse de que, a pocos 
pasos de sus palacios, sus iguales perecen de hambre». (Luis Emilio 
Recabarren, político socialista).  
 
«Existe un aislamiento excesivo de parte de la clase alta con relación a la 
clase trabajadora: el único contacto y trato que se puede observar entre 
ambas es el que se produce en las campañas electorales». (Juan 
Enrique Concha Subercaseaux, político conservador). 
 
 Baeza, A., Estefane, A., Ossa, J., Fernández, J., García-Huidobro, C., Ocaranza, N. y 
Moscoso, P. (2008). XX: Historias del siglo veinte chileno. Ediciones B. 
 
 
Las citas anteriores tuvieron lugar en el marco de las conmemoraciones 
del Centenario de la Independencia de Chile y reflejan la discusión que 
tuvo lugar durante dichas celebraciones. ¿Cuál de las siguientes 
opciones sintetiza el carácter predominante de la discusión manifestada 
en las citas?**'
WHERE id = 'preg-paes-his-24reg-28';

UPDATE public.preguntas
SET alternativas = '[{"letra":"A","texto":"el aumento de la influencia global de la Unión Soviética, con lo cual se \nbuscó compensar a dicho Estado por las numerosas bajas sufridas en \nla guerra.","es_correcta":false},{"letra":"B","texto":"la desaparición de Alemania como Estado independiente y su \ntransformación en zonas de ocupación administradas por los aliados \ntriunfantes.","es_correcta":false},{"letra":"C","texto":"el logro de la paridad nuclear entre las principales potencias, con lo \ncual se eliminó la superioridad manifiesta de una parte sobre otra.","es_correcta":false},{"letra":"D","texto":"la creación de la OTAN, concebida como una alianza militar entre \nEstados europeos socialistas y capitalistas.","es_correcta":false},{"letra":"E","texto":"la conformación de la Organización de las Naciones Unidas, creada con el propósito de ser un espacio de diálogo y colaboración entre los Estados.","es_correcta":true}]'::jsonb,
    respuesta_correcta = 'E', enunciado = '**46. A partir de 1945, finalizada la Segunda Guerra Mundial, se generaron 
profundos cambios en las relaciones internacionales, expresados en el 
establecimiento de instancias destinadas a evitar la repetición de este 
tipo de conflictos. Un factor que manifiesta explícita e intencionadamente 
ese propósito fue**'
WHERE id = 'preg-paes-his-25reg-46';

UPDATE public.preguntas
SET alternativas = '[{"letra":"A","texto":"15 N","es_correcta":false},{"letra":"B","texto":"60 N","es_correcta":false},{"letra":"C","texto":"150 N","es_correcta":false},{"letra":"D","texto":"585 N","es_correcta":false},{"letra":"E","texto":"615 N","es_correcta":true}]'::jsonb,
    respuesta_correcta = 'E', enunciado = '**8. Una persona de 60 kg desciende en ascensor, el cual frena con una aceleración de magnitud 0,25 m/s². Considerando que en ese momento la persona está sobre una pesa y que la magnitud de la aceleración de gravedad es igual a 10 m/s², ¿cuál es la medida que indicará la pesa mientras frena el ascensor?**'
WHERE id = 'preg-paes-fis-25inv-08';

UPDATE public.preguntas
SET alternativas = '[{"letra":"A","texto":"B) C) D) E) C2H4O2 C3H6O3 C4H8O4 C5H10O5 C6H12O6","es_correcta":false},{"letra":"B","texto":"Opción B (ver figura)","es_correcta":false},{"letra":"C","texto":"Opción C (ver figura)","es_correcta":false},{"letra":"D","texto":"Opción D (ver figura)","es_correcta":false},{"letra":"E","texto":"C6H12O6","es_correcta":true}]'::jsonb,
    respuesta_correcta = 'E', enunciado = 'El hidrógeno compuesto análisis elemental y es oxígeno aproximadamente de con un compuesto una 180 fórmula g/mol, orgánico mínima entonces indica CH2O. su solo fórmula la Si presencia la molecular masa de molar carbono, es del'
WHERE id = 'preg-paes-fis-25inv-48';

UPDATE public.preguntas
SET alternativas = '[{"letra":"A","texto":"B) C) D) E) 10 40 45 1 5 mL mL mL mL mL","es_correcta":false},{"letra":"B","texto":"Opción B (ver figura)","es_correcta":false},{"letra":"C","texto":"Opción C (ver figura)","es_correcta":false},{"letra":"D","texto":"Opción D (ver figura)","es_correcta":false},{"letra":"E","texto":"45 mL","es_correcta":true}]'::jsonb,
    respuesta_correcta = 'E', enunciado = 'La ebullición figura muestra durante un una determinado solución, de tiempo. concentración 1 mol/L, que es calentada hasta
50 1 mol/L mL Calefactor
Si que la se concentración evaporó? final de la solución es 10 mol/L, ¿cuál es el volumen de solvente'
WHERE id = 'preg-paes-fis-25inv-50';

UPDATE public.preguntas
SET alternativas = '[{"letra":"A","texto":"B) C) D) E) 900 108 1660 254 720 g g g g g de de de de de 3, 2, 1, 5, 4, se se se se el disuelve obtiene obtiene obtiene soluto presente una una una todo solución solución solución el soluto no se diluida. que con presente. disuelve soluto no puede completamente. no disuelto. disolver más soluto.","es_correcta":false},{"letra":"B","texto":"Opción B (ver figura)","es_correcta":false},{"letra":"C","texto":"Opción C (ver figura)","es_correcta":false},{"letra":"D","texto":"Opción D (ver figura)","es_correcta":false},{"letra":"E","texto":"720 g de 5, se obtiene una solución que no puede disolver más soluto.","es_correcta":true}]'::jsonb,
    respuesta_correcta = 'E', enunciado = 'En algunos la siguiente solutos disueltos tabla se en representa 1 L de agua la a comparación 25 °C: de las masas máximas de
Soluto Masa (g)
1 207,0
2 9,9
3 316,0
4 1000,0
5 360,0
agua De acuerdo a la información anterior es correcto deducir que al disolver en 2 L de'
WHERE id = 'preg-paes-fis-25inv-52';

UPDATE public.preguntas
SET alternativas = '[{"letra":"A","texto":"B) C) D) E) 105,120,13,0 2,0 5,0 °C °C °C °C °C","es_correcta":false},{"letra":"B","texto":"Opción B (ver figura)","es_correcta":false},{"letra":"C","texto":"Opción C (ver figura)","es_correcta":false},{"letra":"D","texto":"Opción D (ver figura)","es_correcta":false},{"letra":"E","texto":"13,0 °C","es_correcta":true}]'::jsonb,
    respuesta_correcta = 'E', enunciado = 'Cuando 3 temperatura 4000 °C. calorías? Si un el objeto mismo es 15 transfiere objeto °C, ¿qué se 6000 vuelve temperatura calorías a poner al aire, alcanza en disminuye contacto después su con temperatura el de aire, transferir y en su'
WHERE id = 'preg-paes-fis-25inv-73';

UPDATE public.preguntas
SET alternativas = '[{"letra":"A","texto":"Opción A (ver figura)","es_correcta":false},{"letra":"B","texto":"Opción B (ver figura)","es_correcta":false},{"letra":"C","texto":"Opción C (ver figura)","es_correcta":false},{"letra":"D","texto":"E) A) B) C) los la las la la pared cuerda pared manos pies del ejerce ejerce ejerce del joven joven sobre sobre sobre ejercen ejercen los la la cuerda pies pared sobre sobre del en en la joven pared la el el cuerda extremo punto en en Q. P. Q. en P. el extremo R.","es_correcta":false},{"letra":"E","texto":"las manos del joven ejercen sobre la cuerda en el extremo R.","es_correcta":true}]'::jsonb,
    respuesta_correcta = 'E', enunciado = 'Un vertical cuerda joven está (punto se fija mantiene Q), a la sostenido pared en en reposo con el extremo sus con manos superior sus a pies la P, cuerda apoyados como PR ilustra en en el la una extremo figura. pared R. casi La
P
R
Q
Si es la la cuerda fuerza que ejerce una fuerza en las manos del joven, la fuerza de reacción a,'
WHERE id = 'preg-paes-fis-25reg-66';

UPDATE public.preguntas
SET alternativas = '[{"letra":"A","texto":"Opción A (ver figura)","es_correcta":false},{"letra":"B","texto":"Opción B (ver figura)","es_correcta":false},{"letra":"C","texto":"D) E) A) B) el ambas la la ambas solución solución volumen soluciones soluciones X Y de es tiene ambas más poseen tienen más concentrada soluciones soluto la igual misma que concentración. es que la masa. el solución la mismo. solución Y. X.","es_correcta":false},{"letra":"D","texto":"Opción D (ver figura)","es_correcta":false},{"letra":"E","texto":"la solución Y es más concentrada que la solución X.","es_correcta":true}]'::jsonb,
    respuesta_correcta = 'E', enunciado = 'Se Por volumen descrito, prepara otra parte, se de una puede agua se solución necesario prepara deducir X que una masando para solución completar 100 Y, g masando 1 de L KOH de solución. y 100 agregándolos g de Entonces, KOH y a agregando 1 a L partir de agua. de lo el'
WHERE id = 'preg-paes-qui-23reg-17';

UPDATE public.preguntas
SET alternativas = '[{"letra":"A","texto":"Opción A (ver figura)","es_correcta":false},{"letra":"B","texto":"Opción B (ver figura)","es_correcta":false},{"letra":"C","texto":"Opción C (ver figura)","es_correcta":false},{"letra":"D","texto":"E) A) B) C) T J Q X R","es_correcta":false},{"letra":"E","texto":"Q","es_correcta":true}]'::jsonb,
    respuesta_correcta = 'E', enunciado = 'En elementos, la siguiente a 1 atm, tabla ubicados se muestran en un los mismo puntos grupo de fusión en el y sistema de ebullición periódico. de distintos
Elemento Punto (ºC) de Fusión Punto de (ºC) Ebullición
Q 253
R 180 1347
J 98 883
T 64 774
X 39 688
Considerando corresponde a un los gas valores a 25 °C de y 1 la atm? tabla anterior, ¿cuál de los elementos'
WHERE id = 'preg-paes-qui-23reg-56';

UPDATE public.preguntas
SET alternativas = '[{"letra":"A","texto":"Opción A (ver figura)","es_correcta":false},{"letra":"B","texto":"Opción B (ver figura)","es_correcta":false},{"letra":"C","texto":"Opción C (ver figura)","es_correcta":false},{"letra":"D","texto":"E) A) B) C) Benceno Cetona Amida Amina Amina secundaria terciaria","es_correcta":false},{"letra":"E","texto":"Amida","es_correcta":true}]'::jsonb,
    respuesta_correcta = 'E', enunciado = 'La siguiente estructura corresponde a un anestésico local.
O
NH N
Al respecto, ¿cuál es la función orgánica prioritaria, según la IUPAC?'
WHERE id = 'preg-paes-qui-23reg-63';

UPDATE public.preguntas
SET alternativas = '[{"letra":"A","texto":"B) C) D) E) 10 25 48 50 58 % % % % %","es_correcta":false},{"letra":"B","texto":"Opción B (ver figura)","es_correcta":false},{"letra":"C","texto":"Opción C (ver figura)","es_correcta":false},{"letra":"D","texto":"Opción D (ver figura)","es_correcta":false},{"letra":"E","texto":"58 %","es_correcta":true}]'::jsonb,
    respuesta_correcta = 'E', enunciado = 'corresponde Se tienen 100 a SO2. g de ¿Cuál una mezcla es el porcentaje gaseosa total de SO2 de oxígeno y SO3 en en la la mezcla? cual el 20 %'
WHERE id = 'preg-paes-qui-23reg-72';

UPDATE public.preguntas
SET alternativas = '[{"letra":"A","texto":"B) C) D) E) en en en la la concentración concentración 1 los los mL 100 10 de mL mL la de solución de la final X, solución solución es de 100 final la final, veces solución inicial, hay hay 0,1 menor hay mol de 0,2 2 NaOH, mol de que mol NaOH. de la de es concentración NaOH. NaOH. 0,2 mol/L. inicial.","es_correcta":false},{"letra":"B","texto":"Opción B (ver figura)","es_correcta":false},{"letra":"C","texto":"Opción C (ver figura)","es_correcta":false},{"letra":"D","texto":"Opción D (ver figura)","es_correcta":false},{"letra":"E","texto":"la concentración final de la solución de NaOH, es 0,2 mol/L.","es_correcta":true}]'::jsonb,
    respuesta_correcta = 'E', enunciado = 'En un laboratorio se realiza el siguiente proceso:
1 2 L mol/L NaOH X NaOH mol/L
Al respecto, es correcto afirmar que'
WHERE id = 'preg-paes-qui-24inv-75';

UPDATE public.preguntas
SET alternativas = '[{"letra":"A","texto":"C2H4O2","es_correcta":false},{"letra":"B","texto":"C3H6O3","es_correcta":false},{"letra":"C","texto":"C4H8O4","es_correcta":false},{"letra":"D","texto":"C5H10O5","es_correcta":false},{"letra":"E","texto":"C6H12O6","es_correcta":true}]'::jsonb,
    respuesta_correcta = 'E', enunciado = '**12. El análisis elemental de un compuesto orgánico indica solo la presencia de carbono, hidrógeno y oxígeno con una fórmula mínima CH2O. Si la masa molar del compuesto es aproximadamente 180 g/mol, entonces su fórmula molecular es**'
WHERE id = 'preg-paes-qui-25inv-12';

UPDATE public.preguntas
SET alternativas = '[{"letra":"A","texto":"B) C) D) E) 10 40 45 1 5 mL mL mL mL mL","es_correcta":false},{"letra":"B","texto":"Opción B (ver figura)","es_correcta":false},{"letra":"C","texto":"Opción C (ver figura)","es_correcta":false},{"letra":"D","texto":"Opción D (ver figura)","es_correcta":false},{"letra":"E","texto":"45 mL","es_correcta":true}]'::jsonb,
    respuesta_correcta = 'E', enunciado = 'La ebullición figura muestra durante un una determinado solución, de tiempo. concentración 1 mol/L, que es calentada hasta
50 1 mol/L mL Calefactor
Si que la se concentración evaporó? final de la solución es 10 mol/L, ¿cuál es el volumen de solvente'
WHERE id = 'preg-paes-qui-25inv-14';

UPDATE public.preguntas
SET alternativas = '[{"letra":"A","texto":"B) C) D) E) 900 108 1660 254 720 g g g g g de de de de de 3, 2, 1, 5, 4, se se se se el disuelve obtiene obtiene obtiene soluto presente una una una todo solución solución solución el soluto no se diluida. que con presente. disuelve soluto no puede completamente. no disuelto. disolver más soluto.","es_correcta":false},{"letra":"B","texto":"Opción B (ver figura)","es_correcta":false},{"letra":"C","texto":"Opción C (ver figura)","es_correcta":false},{"letra":"D","texto":"Opción D (ver figura)","es_correcta":false},{"letra":"E","texto":"720 g de 5, se obtiene una solución que no puede disolver más soluto.","es_correcta":true}]'::jsonb,
    respuesta_correcta = 'E', enunciado = 'En algunos la siguiente solutos disueltos tabla se en representa 1 L de agua la a comparación 25 °C: de las masas máximas de
Soluto Masa (g)
1 207,0
2 9,9
3 316,0
4 1000,0
5 360,0
agua De acuerdo a la información anterior es correcto deducir que al disolver en 2 L de'
WHERE id = 'preg-paes-qui-25inv-16';

UPDATE public.preguntas
SET alternativas = '[{"letra":"A","texto":"B) C) D) E) 150 585 615 15 60 N N N N N","es_correcta":false},{"letra":"B","texto":"Opción B (ver figura)","es_correcta":false},{"letra":"C","texto":"Opción C (ver figura)","es_correcta":false},{"letra":"D","texto":"Opción D (ver figura)","es_correcta":false},{"letra":"E","texto":"615 N","es_correcta":true}]'::jsonb,
    respuesta_correcta = 'E', enunciado = 'Una magnitud persona 0,25 de s 60 m 2. Considerando kg desciende en que ascensor, en ese momento el cual frena la persona con una está aceleración sobre una de
pesa medida y que que la indicará magnitud la pesa de la mientras aceleración frena de el gravedad ascensor? es igual a 10 s 2 m, ¿cuál es la'
WHERE id = 'preg-paes-qui-25inv-26';

COMMIT;
