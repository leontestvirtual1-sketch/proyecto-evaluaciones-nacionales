-- ==============================================================================
-- Migración 051 (BORRADOR — NO APLICADA): reconstruir Ensayo 3 SIMCE Matemática 2° Medio
-- desde el solucionario oficial Umáximo (34 preguntas reales).
-- Generada a partir de mat2m_e3_preguntas_reales_34.json.
-- ANTES DE APLICAR: seguir la Fase 0 y la Fase 2 de PLAN_ACCION_ANTIGRAVITY.md
--   (respaldo, verificar rendiciones/copias asignadas, abrir cada figura PNG).
-- Solo hace UPDATE de las filas preg-mat2m-e3-01..34 que ya existen; no inserta.
-- La fila preg-mat2m-e3-35 NO existe en la fuente: se trata aparte (ver Fase 2, paso 2.4).
-- No toca imagen_url de las preguntas con figura (19,22,27,28,29,31,32); pone NULL en las demás.
-- ==============================================================================
BEGIN;

UPDATE public.evaluaciones
SET descripcion = 'Ensayo 3 SIMCE Matemática 2° Medio (Umáximo). 34 preguntas de selección múltiple: Números y Operaciones, Álgebra, Geometría, Medición y Probabilidad y Estadística.',
    descripcion_catalogo = 'Ensayo de práctica SIMCE Matemática 2° Medio con 34 ítems de selección múltiple.',
    total_preguntas = 34,
    updated_at = NOW()
WHERE id = 'eval-simce-mat-2m-e3';

UPDATE public.preguntas SET
    enunciado = $q$¿Cuál de las siguientes expresiones es equivalente a $\sqrt[3]{a+b}$?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$(a+b)^{\\frac{1}{3}}$", "es_correcta": true}, {"letra": "B", "texto": "$(a+b)^{3}$", "es_correcta": false}, {"letra": "C", "texto": "$a^{\\frac{1}{3}}+b^{\\frac{1}{3}}$", "es_correcta": false}, {"letra": "D", "texto": "$\\frac{1}{3}(a+b)$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'A',
    eje_tematico_id = 'eje-mat-1',
    habilidad_id = 'hab-mat-2',
    dificultad = 'baja',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-01';

-- P02: En el PDF la alternativa B está incompleta ('log64 = 4'); se completó como log_64(3)=4 (distractor). Confirmar contra la página 1 del PDF.
UPDATE public.preguntas SET
    enunciado = $q$La expresión $\sqrt[3]{64}=4$ se puede representar en logaritmo como:$q$,
    alternativas = $q$[{"letra": "A", "texto": "$\\log_{64}(4)=\\frac{1}{3}$", "es_correcta": true}, {"letra": "B", "texto": "$\\log_{64}(3)=4$", "es_correcta": false}, {"letra": "C", "texto": "$\\log_{4}(8)=\\frac{1}{3}$", "es_correcta": false}, {"letra": "D", "texto": "$\\log_{4}\\left(\\frac{1}{3}\\right)=64$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'A',
    eje_tematico_id = 'eje-mat-1',
    habilidad_id = 'hab-mat-2',
    dificultad = 'baja',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-02';

UPDATE public.preguntas SET
    enunciado = $q$En una competencia de eSports, el sistema clasifica a los jugadores calculando su «Eficiencia de Combate». Esta eficiencia se obtiene dividiendo el **daño total causado** por la **cantidad de rondas jugadas**.

Considera que ambos datos son siempre números enteros positivos y observa el siguiente ejemplo de un jugador:

| Daño total | Rondas | Eficiencia de combate |
| :---: | :---: | :---: |
| 20 | 6 | 3,333... |

¿Qué conjunto numérico es el adecuado para expresar **todos** los posibles resultados de la «Eficiencia de Combate»?$q$,
    alternativas = $q$[{"letra": "A", "texto": "Números naturales ($\\mathbb{N}$).", "es_correcta": false}, {"letra": "B", "texto": "Números racionales ($\\mathbb{Q}$).", "es_correcta": true}, {"letra": "C", "texto": "Números irracionales ($\\mathbb{I}$).", "es_correcta": false}, {"letra": "D", "texto": "Números enteros ($\\mathbb{Z}$).", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'B',
    eje_tematico_id = 'eje-mat-1',
    habilidad_id = 'hab-mat-1',
    dificultad = 'media',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-03';

UPDATE public.preguntas SET
    enunciado = $q$¿Cuál de las siguientes raíces es equivalente a $\sqrt{3}\cdot\sqrt[3]{3}$?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$\\sqrt[5]{3}$", "es_correcta": false}, {"letra": "B", "texto": "$\\sqrt[5]{3^{2}}$", "es_correcta": false}, {"letra": "C", "texto": "$\\sqrt[6]{3}$", "es_correcta": false}, {"letra": "D", "texto": "$\\sqrt[6]{3^{5}}$", "es_correcta": true}]$q$::jsonb,
    respuesta_correcta = 'D',
    eje_tematico_id = 'eje-mat-1',
    habilidad_id = 'hab-mat-2',
    dificultad = 'media',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-04';

UPDATE public.preguntas SET
    enunciado = $q$¿Cuál es el valor de $(4)^{-2}$?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$-16$", "es_correcta": false}, {"letra": "B", "texto": "$-8$", "es_correcta": false}, {"letra": "C", "texto": "$\\frac{1}{16}$", "es_correcta": true}, {"letra": "D", "texto": "$\\frac{1}{8}$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'C',
    eje_tematico_id = 'eje-mat-1',
    habilidad_id = 'hab-mat-2',
    dificultad = 'baja',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-05';

UPDATE public.preguntas SET
    enunciado = $q$Una población de 40 conejos fue liberada en el ambiente silvestre. Se espera que esta población aumente cada mes en un 50% respecto de la que había el mes anterior. ¿Cuál de las siguientes expresiones representa la población de conejos que se espera tener luego de 3 meses?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$40\\cdot 1{,}5^{3}$", "es_correcta": true}, {"letra": "B", "texto": "$(40\\cdot 1{,}5)^{3}$", "es_correcta": false}, {"letra": "C", "texto": "$40\\cdot 1{,}5\\cdot 3$", "es_correcta": false}, {"letra": "D", "texto": "$40+1{,}5\\cdot 3$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'A',
    eje_tematico_id = 'eje-mat-1',
    habilidad_id = 'hab-mat-4',
    dificultad = 'media',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-06';

-- P07: Confirmar la alternativa D ('4') contra la página 3 del PDF; la extracción de texto la muestra así.
UPDATE public.preguntas SET
    enunciado = $q$¿Qué número es equivalente a $-\left(\frac{2}{3}\right)^{-2}$?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$-\\frac{9}{4}$", "es_correcta": true}, {"letra": "B", "texto": "$-\\frac{4}{9}$", "es_correcta": false}, {"letra": "C", "texto": "$\\frac{4}{9}$", "es_correcta": false}, {"letra": "D", "texto": "$4$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'A',
    eje_tematico_id = 'eje-mat-1',
    habilidad_id = 'hab-mat-2',
    dificultad = 'media',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-07';

-- P08: La alternativa C se lee ambigua en la extracción de texto; verificar visualmente en la página 4 del PDF.
UPDATE public.preguntas SET
    enunciado = $q$¿Cuál de las siguientes igualdades es correcta?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$\\sqrt[4]{5^{2}}=\\sqrt{5}$", "es_correcta": true}, {"letra": "B", "texto": "$5\\sqrt{2}=\\sqrt{10}$", "es_correcta": false}, {"letra": "C", "texto": "$\\sqrt[4]{\\sqrt{5}}=\\sqrt[6]{5}$", "es_correcta": false}, {"letra": "D", "texto": "$\\sqrt{5}+\\sqrt{2}=\\sqrt{7}$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'A',
    eje_tematico_id = 'eje-mat-1',
    habilidad_id = 'hab-mat-2',
    dificultad = 'media',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-08';

UPDATE public.preguntas SET
    enunciado = $q$Considera la siguiente igualdad.

$$\log_{2}32=x$$

¿Cuál es el valor de $x$?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$4$", "es_correcta": false}, {"letra": "B", "texto": "$5$", "es_correcta": true}, {"letra": "C", "texto": "$16$", "es_correcta": false}, {"letra": "D", "texto": "$64$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'B',
    eje_tematico_id = 'eje-mat-1',
    habilidad_id = 'hab-mat-2',
    dificultad = 'baja',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-09';

UPDATE public.preguntas SET
    enunciado = $q$Sabiendo que 1 pulgada equivale a 2,54 centímetros, ¿a cuántos centímetros equivale media pulgada?$q$,
    alternativas = $q$[{"letra": "A", "texto": "0,5 cm", "es_correcta": false}, {"letra": "B", "texto": "1,27 cm", "es_correcta": true}, {"letra": "C", "texto": "2,04 cm", "es_correcta": false}, {"letra": "D", "texto": "5,08 cm", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'B',
    eje_tematico_id = 'eje-mat-1',
    habilidad_id = 'hab-mat-4',
    dificultad = 'baja',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-10';

UPDATE public.preguntas SET
    enunciado = $q$¿Cuál es el valor de $\sqrt{8}\left(\sqrt{32}-\sqrt{2}\right)$?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$\\sqrt{240}$", "es_correcta": false}, {"letra": "B", "texto": "$60$", "es_correcta": false}, {"letra": "C", "texto": "$8\\sqrt{2}$", "es_correcta": false}, {"letra": "D", "texto": "$12$", "es_correcta": true}]$q$::jsonb,
    respuesta_correcta = 'D',
    eje_tematico_id = 'eje-mat-1',
    habilidad_id = 'hab-mat-2',
    dificultad = 'media',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-11';

UPDATE public.preguntas SET
    enunciado = $q$¿Cuál es el resultado de $\sqrt{100}-\sqrt{64}+\sqrt{36}$?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$0$", "es_correcta": false}, {"letra": "B", "texto": "$8$", "es_correcta": true}, {"letra": "C", "texto": "$12$", "es_correcta": false}, {"letra": "D", "texto": "$36$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'B',
    eje_tematico_id = 'eje-mat-1',
    habilidad_id = 'hab-mat-2',
    dificultad = 'baja',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-12';

UPDATE public.preguntas SET
    enunciado = $q$¿Cuál de los siguientes números es equivalente a $\sqrt{20}$?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$2\\sqrt{5}$", "es_correcta": true}, {"letra": "B", "texto": "$5\\sqrt{2}$", "es_correcta": false}, {"letra": "C", "texto": "$10$", "es_correcta": false}, {"letra": "D", "texto": "$40$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'A',
    eje_tematico_id = 'eje-mat-1',
    habilidad_id = 'hab-mat-2',
    dificultad = 'baja',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-13';

UPDATE public.preguntas SET
    enunciado = $q$Considera la siguiente igualdad:

$$c^{d}=e$$

¿Cuál de las siguientes alternativas es correcta?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$\\log_{c}d=e$", "es_correcta": false}, {"letra": "B", "texto": "$\\log_{c}e=d$", "es_correcta": true}, {"letra": "C", "texto": "$\\log_{d}c=e$", "es_correcta": false}, {"letra": "D", "texto": "$\\log_{d}e=c$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'B',
    eje_tematico_id = 'eje-mat-1',
    habilidad_id = 'hab-mat-2',
    dificultad = 'media',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-14';

UPDATE public.preguntas SET
    enunciado = $q$Considera el siguiente desarrollo del cuadrado de un binomio.

$$(2a+\underline{\quad\quad})^{2}=4a^{2}+16a+16$$

¿Qué expresión debe ir en el espacio en blanco de la igualdad?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$4$", "es_correcta": true}, {"letra": "B", "texto": "$4a$", "es_correcta": false}, {"letra": "C", "texto": "$8$", "es_correcta": false}, {"letra": "D", "texto": "$8a$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'A',
    eje_tematico_id = 'eje-mat-2',
    habilidad_id = 'hab-mat-2',
    dificultad = 'media',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-15';

UPDATE public.preguntas SET
    enunciado = $q$Dada la siguiente expresión algebraica: $4a^{2}-81b^{2}$. ¿Cuál es su factorización?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$(2a+9b)(2a-9b)$", "es_correcta": true}, {"letra": "B", "texto": "$(2a-9b)(2a-9b)$", "es_correcta": false}, {"letra": "C", "texto": "$(4a-81b)(4a-81b)$", "es_correcta": false}, {"letra": "D", "texto": "$(4a+81b)(4a-81b)$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'A',
    eje_tematico_id = 'eje-mat-2',
    habilidad_id = 'hab-mat-2',
    dificultad = 'media',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-16';

UPDATE public.preguntas SET
    enunciado = $q$¿Cuál de las siguientes expresiones es igual a $(3p-5)^{2}$?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$6p-10$", "es_correcta": false}, {"letra": "B", "texto": "$9p^{2}-25$", "es_correcta": false}, {"letra": "C", "texto": "$9p^{2}-30p+25$", "es_correcta": true}, {"letra": "D", "texto": "$6p^{2}-15p+10$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'C',
    eje_tematico_id = 'eje-mat-2',
    habilidad_id = 'hab-mat-2',
    dificultad = 'media',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-17';

UPDATE public.preguntas SET
    enunciado = $q$La suma de dos números es 30 y el doble del menor es igual al mayor. Si $x$ es el número menor e $y$ es el número mayor, ¿cuál de los siguientes sistemas de ecuaciones permite determinar cuáles son los números?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$\\begin{cases} x+y=30 \\\\ 2x=y \\end{cases}$", "es_correcta": true}, {"letra": "B", "texto": "$\\begin{cases} x+y=30 \\\\ x=3y \\end{cases}$", "es_correcta": false}, {"letra": "C", "texto": "$\\begin{cases} x-y=30 \\\\ 2x=y \\end{cases}$", "es_correcta": false}, {"letra": "D", "texto": "$\\begin{cases} x-y=20 \\\\ x=2y \\end{cases}$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'A',
    eje_tematico_id = 'eje-mat-2',
    habilidad_id = 'hab-mat-4',
    dificultad = 'media',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-18';

-- P19: Figura: rectas por (0,2)-(2,0) y (0,-4)-(4,0); se cortan en (3,-1). Verificar que el PNG existente sea esta figura.
UPDATE public.preguntas SET
    enunciado = $q$Observa las rectas que se intersecan en el siguiente plano cartesiano.

¿Cuál de los siguientes sistemas de ecuaciones está representado por estas rectas?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$\\begin{cases} x+y=2 \\\\ x+y=4 \\end{cases}$", "es_correcta": false}, {"letra": "B", "texto": "$\\begin{cases} x+y=2 \\\\ x-y=4 \\end{cases}$", "es_correcta": true}, {"letra": "C", "texto": "$\\begin{cases} x+y=4 \\\\ x+y=0 \\end{cases}$", "es_correcta": false}, {"letra": "D", "texto": "$\\begin{cases} x+y=4 \\\\ x-y=2 \\end{cases}$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'B',
    eje_tematico_id = 'eje-mat-2',
    habilidad_id = 'hab-mat-3',
    dificultad = 'media',
    puntaje = 1,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-19';

UPDATE public.preguntas SET
    enunciado = $q$Considera el siguiente sistema de ecuaciones lineales:

$$5x+3y=55$$
$$2x+3y=31$$

¿Cuál es el valor de $x$ e $y$ que satisface el sistema anterior?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$x=32,\\ y=-35$", "es_correcta": false}, {"letra": "B", "texto": "$x=11,\\ y=3$", "es_correcta": false}, {"letra": "C", "texto": "$x=8,\\ y=5$", "es_correcta": true}, {"letra": "D", "texto": "$x=5,\\ y=10$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'C',
    eje_tematico_id = 'eje-mat-2',
    habilidad_id = 'hab-mat-1',
    dificultad = 'media',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-20';

UPDATE public.preguntas SET
    enunciado = $q$Observa la tabla de valores correspondiente a la función $f(x,y)=2x+y=6$.

| x | y |
| :---: | :---: |
| 0 | 6 |
| 2 | 2 |
| ? | 0 |

¿Cuál es el valor faltante en la columna $x$?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$0$", "es_correcta": false}, {"letra": "B", "texto": "$2$", "es_correcta": false}, {"letra": "C", "texto": "$3$", "es_correcta": true}, {"letra": "D", "texto": "$4$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'C',
    eje_tematico_id = 'eje-mat-2',
    habilidad_id = 'hab-mat-1',
    dificultad = 'baja',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-21';

-- P22: Figura: recta que corta el eje X en 2 y el eje Y en -3.
UPDATE public.preguntas SET
    enunciado = $q$Observa la siguiente recta representada en el plano cartesiano:

¿Cuál de las siguientes ecuaciones representa a esta recta?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$y=\\frac{2}{3}x+2$", "es_correcta": false}, {"letra": "B", "texto": "$y=-\\frac{2}{3}x-3$", "es_correcta": false}, {"letra": "C", "texto": "$y=-\\frac{3}{2}x+2$", "es_correcta": false}, {"letra": "D", "texto": "$y=\\frac{3}{2}x-3$", "es_correcta": true}]$q$::jsonb,
    respuesta_correcta = 'D',
    eje_tematico_id = 'eje-mat-2',
    habilidad_id = 'hab-mat-3',
    dificultad = 'media',
    puntaje = 1,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-22';

UPDATE public.preguntas SET
    enunciado = $q$Al aplicar una homotecia con centro en el origen del sistema de coordenadas al vector $(3,2)$, se obtiene el vector $(-6,-4)$. Si se aplica esta misma homotecia al vector $(8,-6)$, entonces se obtiene el vector $\vec{p}$. ¿Cuáles son las coordenadas del vector $\vec{p}$?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$(17,0)$", "es_correcta": false}, {"letra": "B", "texto": "$(-1,-12)$", "es_correcta": false}, {"letra": "C", "texto": "$(-4,3)$", "es_correcta": false}, {"letra": "D", "texto": "$(-16,12)$", "es_correcta": true}]$q$::jsonb,
    respuesta_correcta = 'D',
    eje_tematico_id = 'eje-mat-3',
    habilidad_id = 'hab-mat-1',
    dificultad = 'media',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-23';

UPDATE public.preguntas SET
    enunciado = $q$A un vector $\vec{v}$ se le aplica una homotecia con centro en el origen y razón $k_1$, resultando el vector $\vec{u}$, y al vector $\vec{u}$ se le aplica una homotecia con centro en el origen y razón $k_2$, resultando el vector $\vec{w}$. ¿Qué expresión es igual a la razón de homotecia, con centro en el origen, que transforma el vector $\vec{v}$ en el vector $\vec{w}$?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$k_1\\cdot k_2$", "es_correcta": true}, {"letra": "B", "texto": "$k_1 : k_2$", "es_correcta": false}, {"letra": "C", "texto": "$k_2 : k_1$", "es_correcta": false}, {"letra": "D", "texto": "$k_1+k_2$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'A',
    eje_tematico_id = 'eje-mat-3',
    habilidad_id = 'hab-mat-3',
    dificultad = 'media',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-24';

UPDATE public.preguntas SET
    enunciado = $q$La maqueta de un edificio se diseña con escala $1:200$. En esa maqueta, la altura del edificio es de 40 cm, ¿cuál es la altura real del edificio?$q$,
    alternativas = $q$[{"letra": "A", "texto": "5 metros", "es_correcta": false}, {"letra": "B", "texto": "16 metros", "es_correcta": false}, {"letra": "C", "texto": "80 metros", "es_correcta": true}, {"letra": "D", "texto": "160 metros", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'C',
    eje_tematico_id = 'eje-mat-3',
    habilidad_id = 'hab-mat-1',
    dificultad = 'media',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-25';

-- P26: ERROR EN LA FUENTE: con escalas 1:60 y 1:30 la respuesta matemática es x = 2L, y ninguna alternativa lo es. La clave del solucionario (L·64/43) no se deduce del enunciado. Las letras A-D se asignaron en orden de lectura (las cajas del PDF no traen letra). Decisión pendiente del docente: anular la pregunta, o corregir enunciado/alternativas.
UPDATE public.preguntas SET
    enunciado = $q$Pablo es aficionado al coleccionismo de autos en miniatura. Actualmente tiene un modelo de un automóvil deportivo en escala $1:60$ cuya longitud es de $L$ centímetros.

Pablo desea adquirir una versión más grande del mismo automóvil deportivo, pero esta vez fabricado en escala $1:30$. Para asegurarse de que cabrá en su repisa, necesita calcular su nueva medida antes de comprarlo.

¿Qué expresión permite modelar correctamente la longitud $x$, en centímetros, que tendrá el nuevo auto en escala $1:30$?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$x=L+21$", "es_correcta": false}, {"letra": "B", "texto": "$x=L\\cdot\\frac{43}{64}$", "es_correcta": false}, {"letra": "C", "texto": "$x=L\\cdot(64\\cdot 43)$", "es_correcta": false}, {"letra": "D", "texto": "$x=L\\cdot\\frac{64}{43}$", "es_correcta": true}]$q$::jsonb,
    respuesta_correcta = 'D',
    eje_tematico_id = 'eje-mat-3',
    habilidad_id = 'hab-mat-4',
    dificultad = 'alta',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-26';

-- P27: Figura: sector gris de 60 grados, radio 5 cm.
UPDATE public.preguntas SET
    enunciado = $q$Observa la circunferencia de centro O y radio 5 cm.

¿Cuál es el área del sector circular gris?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$\\frac{10}{6}\\pi\\ \\text{cm}^2$", "es_correcta": false}, {"letra": "B", "texto": "$\\frac{25}{6}\\pi\\ \\text{cm}^2$", "es_correcta": true}, {"letra": "C", "texto": "$\\frac{25}{3}\\pi\\ \\text{cm}^2$", "es_correcta": false}, {"letra": "D", "texto": "$\\frac{25}{60}\\pi\\ \\text{cm}^2$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'B',
    eje_tematico_id = 'eje-mat-4',
    habilidad_id = 'hab-mat-1',
    dificultad = 'media',
    puntaje = 1,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-27';

-- P28: Figura: generatriz 15 cm y circunferencia base con radio 2 cm. La figura dibuja el sector como 90 grados, lo que no cierra con la base (arco 7,5 pi vs perimetro 4 pi); la clave 34 pi usa A = pi r (r+g) con r=2, g=15. Inconsistencia menor de la fuente.
UPDATE public.preguntas SET
    enunciado = $q$Observa la siguiente red de cono:

¿Cuál es el área de su superficie?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$20\\pi\\ \\text{cm}^2$", "es_correcta": false}, {"letra": "B", "texto": "$30\\pi\\ \\text{cm}^2$", "es_correcta": false}, {"letra": "C", "texto": "$34\\pi\\ \\text{cm}^2$", "es_correcta": true}, {"letra": "D", "texto": "$68\\pi\\ \\text{cm}^2$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'C',
    eje_tematico_id = 'eje-mat-4',
    habilidad_id = 'hab-mat-1',
    dificultad = 'alta',
    puntaje = 1,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-28';

-- P29: Figura: triangulo rectangulo de cateto vertical 15; base 10 + 18; altura h sobre el punto que divide 10 y 18. Verificar que el PNG existente sea ESTE triangulo.
UPDATE public.preguntas SET
    enunciado = $q$Observa las medidas en la siguiente figura.

¿Cuál de las siguientes igualdades permite calcular correctamente el valor de $h$?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$\\frac{h}{15}=\\frac{10}{28}$", "es_correcta": false}, {"letra": "B", "texto": "$\\frac{h}{15}=\\frac{10}{18}$", "es_correcta": false}, {"letra": "C", "texto": "$\\frac{h}{15}=\\frac{18}{10}$", "es_correcta": false}, {"letra": "D", "texto": "$\\frac{h}{15}=\\frac{18}{28}$", "es_correcta": true}]$q$::jsonb,
    respuesta_correcta = 'D',
    eje_tematico_id = 'eje-mat-3',
    habilidad_id = 'hab-mat-3',
    dificultad = 'media',
    puntaje = 1,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-29';

UPDATE public.preguntas SET
    enunciado = $q$Dos streamers de videojuegos quieren analizar el nivel de participación en sus chats en su última transmisión. La siguiente tabla muestra los datos registrados:

| Canal | Total de espectadores | Espectadores que comentaron |
| :--- | :---: | :---: |
| Pax gameplays | 800 | 100 |
| Ninja gamer | 300 | 150 |

¿Qué expresión representa la frecuencia relativa de los espectadores que comentaron en relación al total de espectadores **del canal “Pax gameplays”**?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$\\frac{100}{900}$", "es_correcta": false}, {"letra": "B", "texto": "$\\frac{100}{250}$", "es_correcta": false}, {"letra": "C", "texto": "$\\frac{100}{800}$", "es_correcta": true}, {"letra": "D", "texto": "$\\frac{250}{1100}$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'C',
    eje_tematico_id = 'eje-mat-5',
    habilidad_id = 'hab-mat-1',
    dificultad = 'media',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-30';

UPDATE public.preguntas SET
    enunciado = $q$En una aplicación educativa sobre estadística, se muestra un tablero de obstáculos simplificado. Se suelta una bola desde la parte superior y, al chocar con cada obstáculo (puntos negros), la bola solo puede rebotar hacia la izquierda o hacia la derecha, con igual probabilidad.

Si se simula el lanzamiento de $2\,000$ bolas, ¿cuál es la mejor estimación de la cantidad de bolas que caerán en el **Contenedor B**?$q$,
    alternativas = $q$[{"letra": "A", "texto": "250 bolas", "es_correcta": false}, {"letra": "B", "texto": "500 bolas", "es_correcta": false}, {"letra": "C", "texto": "1 000 bolas", "es_correcta": true}, {"letra": "D", "texto": "1 500 bolas", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'C',
    eje_tematico_id = 'eje-mat-5',
    habilidad_id = 'hab-mat-4',
    dificultad = 'media',
    puntaje = 1,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-31';

-- P32: Diagrama: En solitario D,D,C,D,C,D (D=4, C=2). En equipo C,C,C,D (D=1, C=3). Las alternativas son tablas; si el renderer no muestra bien tablas dentro de alternativas, usar el formato 'En solitario: Deportes 4, Combate 2 | En equipo: Deportes 1, Combate 3'.
UPDATE public.preguntas SET
    enunciado = $q$En un grupo de 10 personas que juegan videojuegos, se registró qué tipo de videojuego prefieren y si suelen jugar solas o con amistades. En el diagrama, cada círculo representa a una persona y la letra indica su tipo de videojuego preferido; D: juego de deportes y C: juego de combate.

¿Cuál tabla de doble entrada representa estos datos correctamente?$q$,
    alternativas = $q$[{"letra": "A", "texto": "| Con quién juega | Deportes | Combate |\n| :--- | :---: | :---: |\n| En solitario | 5 | 5 |\n| En equipo | 5 | 5 |", "es_correcta": false}, {"letra": "B", "texto": "| Con quién juega | Deportes | Combate |\n| :--- | :---: | :---: |\n| En solitario | 1 | 3 |\n| En equipo | 4 | 2 |", "es_correcta": false}, {"letra": "C", "texto": "| Con quién juega | Deportes | Combate |\n| :--- | :---: | :---: |\n| En solitario | 2 | 4 |\n| En equipo | 3 | 1 |", "es_correcta": false}, {"letra": "D", "texto": "| Con quién juega | Deportes | Combate |\n| :--- | :---: | :---: |\n| En solitario | 4 | 2 |\n| En equipo | 1 | 3 |", "es_correcta": true}]$q$::jsonb,
    respuesta_correcta = 'D',
    eje_tematico_id = 'eje-mat-5',
    habilidad_id = 'hab-mat-1',
    dificultad = 'media',
    puntaje = 1,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-32';

UPDATE public.preguntas SET
    enunciado = $q$En un sistema de seguridad doméstico se instalan dos sensores de movimiento, el sensor A y el sensor B, que funcionan de manera independiente. La probabilidad de que cada sensor se active ante la presencia de un intruso se muestra en la siguiente tabla.

| Sensor | Probabilidad de activación |
| :---: | :---: |
| A | 0,9 |
| B | 0,8 |

El sistema dispara la alerta general si **al menos uno** de los sensores se activa.

Si entra un intruso, ¿cuál es la probabilidad de que se dispare la alerta general?$q$,
    alternativas = $q$[{"letra": "A", "texto": "$0{,}10$", "es_correcta": false}, {"letra": "B", "texto": "$0{,}72$", "es_correcta": false}, {"letra": "C", "texto": "$0{,}98$", "es_correcta": true}, {"letra": "D", "texto": "$1{,}70$", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'C',
    eje_tematico_id = 'eje-mat-5',
    habilidad_id = 'hab-mat-1',
    dificultad = 'media',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-33';

UPDATE public.preguntas SET
    enunciado = $q$Un grupo de amigos quiere ganar entradas para un concierto y deben decidir en qué sorteo de Instagram participar. Solo pueden elegir una opción y su objetivo es participar donde tengan la **mayor cantidad esperada de ganadores** dentro de su grupo.

La siguiente tabla muestra las condiciones de dos cuentas que realizan sorteos.

| Cuenta de red social | Entradas que sortea | Probabilidad de ganar por entrada |
| :--- | :---: | :---: |
| @MúsicaTotal | 80 | $\frac{1}{10}$ |
| @FanáticoReal | 20 | 0,3 |

Considerando la **frecuencia esperada** de los resultados, ¿qué argumento es correcto respecto al proveedor que conviene elegir?$q$,
    alternativas = $q$[{"letra": "A", "texto": "La de @FanáticoReal, porque la probabilidad 0,3 es mucho más alta que la probabilidad $\\frac{1}{10}$.", "es_correcta": false}, {"letra": "B", "texto": "Cualquiera de las dos, porque al ser un sorteo aleatorio no se pueden usar los números para saber qué pasará realmente.", "es_correcta": false}, {"letra": "C", "texto": "La de @MúsicaTotal, porque se espera que el grupo obtenga alrededor de 8 entradas, superando las 6 que se esperan de @FanáticoReal.", "es_correcta": true}, {"letra": "D", "texto": "La de @MúsicaTotal, porque al sortear 4 veces más entradas, asegura matemáticamente que el grupo ganará el cuádruple de premios.", "es_correcta": false}]$q$::jsonb,
    respuesta_correcta = 'C',
    eje_tematico_id = 'eje-mat-5',
    habilidad_id = 'hab-mat-3',
    dificultad = 'alta',
    puntaje = 1,
    imagen_url = NULL,
    updated_at = NOW()
WHERE id = 'preg-mat2m-e3-34';

-- Verificación (debe devolver 34 filas, 1 alternativa correcta por fila y clave coherente):
-- SELECT id, respuesta_correcta,
--        (SELECT count(*) FROM jsonb_array_elements(alternativas) a WHERE (a->>'es_correcta')::boolean) AS n_correctas
-- FROM public.preguntas WHERE id LIKE 'preg-mat2m-e3-%' AND id <> 'preg-mat2m-e3-35' ORDER BY id;

COMMIT;
