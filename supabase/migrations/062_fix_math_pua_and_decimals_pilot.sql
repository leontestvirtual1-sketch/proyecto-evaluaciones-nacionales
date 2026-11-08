-- ==============================================================================
-- Migración 062: Corrección de Contenido Matemático PAES M1 & M2 (Lote Piloto)
-- Proyecto: Sysget Saber (7 de noviembre de 2026)
-- Basado en: Plan de Corrección de Contenido Matemático
--
-- REGLAS DE SEGURIDAD E INTEGRIDAD:
-- 1. Inmutabilidad estricta de respuestas correctas, puntajes y claves oficiales.
-- 2. Cada corrección está cotejada contra el PDF oficial liberado por DEMRE.
-- 3. Scripts completamente idempotentes (UPDATE WHERE id = '...').
-- ==============================================================================

BEGIN;

-- ══════════════════════════════════════════════════════════════════════════════
-- 1. PILOTO M1: PAES Matemática 1 (M1) 2023 Regular (Forma 113)
-- Fuente: evaluaciones_fuente/paes_m1/paes-oficial-matematica1-p2023.pdf
-- ══════════════════════════════════════════════════════════════════════════════

-- Pregunta Oficial N° 2 (Página 3 PDF):
-- Caso de decimales descompuestos verticalmente (,0 75 y ,1 25) y alternativas con decimales limpios.
UPDATE public.preguntas
SET
  enunciado = 'Considera el número p distinto de cero que es multiplicado dos veces por 1,25 y luego, dos veces por 0,75, tal como se representa a continuación:

$$p \cdot 1{,}25 \cdot 1{,}25 \cdot 0{,}75 \cdot 0{,}75$$

¿Qué pueden representar dichas multiplicaciones, respecto del número original p?',
  alternativas = jsonb_build_array(
    jsonb_build_object('letra', 'A', 'texto', 'Que hubo dos aumentos del 25 % y luego, dos disminuciones del 25 %.', 'es_correcta', true),
    jsonb_build_object('letra', 'B', 'texto', 'Que no hubo aumento de p ni disminución de p.', 'es_correcta', false),
    jsonb_build_object('letra', 'C', 'texto', 'Que hubo dos aumentos de 0,25 y luego, dos disminuciones de 0,75.', 'es_correcta', false),
    jsonb_build_object('letra', 'D', 'texto', 'Que hubo dos aumentos del 25 % y luego, dos disminuciones del 75 %.', 'es_correcta', false)
  ),
  respuesta_correcta = 'A',
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-02';

-- Pregunta Oficial N° 3 (Página 4 PDF):
-- Limpieza de PUA U+F02B (+) en la expresión x + y / p + q = f (Clave oficial C)
UPDATE public.preguntas
SET
  enunciado = 'En la figura adjunta se cumple que la suma de los valores de los casilleros contiguos de una fila es igual al valor inmediatamente superior a ellos (por ejemplo $p + q = f$).

| 25 |   |
|----|---|
| f  |   |
| p  | q | 4 |

Si la suma de los tres valores de la última fila es 17, ¿cuál es el valor de $p + f$?',
  respuesta_correcta = 'C',
  updated_at = NOW()
WHERE id = 'preg-paes-mat1-23reg-03';

-- ══════════════════════════════════════════════════════════════════════════════
-- 2. PILOTO M2: PAES Matemática 2 (M2) 2023 Regular (Forma 113 / 193)
-- Fuente: evaluaciones_fuente/paes_m2/paes-oficial-matematica2-p2023.pdf
-- ══════════════════════════════════════════════════════════════════════════════

-- Pregunta Oficial N° 5 (Página 7 PDF):
-- Reconstrucción de fracción (p/2) y alternativas fraccionarias con KaTeX
UPDATE public.preguntas
SET
  enunciado = 'En una tienda un artículo que costaba $p se rebajó en un 2 % de su precio, en otra tienda el mismo artículo que costaba $\left(\frac{p}{2}\right)$ se aumentó en 1 % de su precio.

¿Cuál es la diferencia del precio entre ambas tiendas después de realizar la rebaja y el aumento correspondiente?',
  alternativas = jsonb_build_array(
    jsonb_build_object('letra', 'A', 'texto', '$\frac{3}{200}p$', 'es_correcta', false),
    jsonb_build_object('letra', 'B', 'texto', '$\frac{2}{10}p$', 'es_correcta', false),
    jsonb_build_object('letra', 'C', 'texto', '$\frac{47}{100}p$', 'es_correcta', false),
    jsonb_build_object('letra', 'D', 'texto', '$\frac{199}{400}p$', 'es_correcta', false),
    jsonb_build_object('letra', 'E', 'texto', '$\frac{95}{200}p$', 'es_correcta', true)
  ),
  respuesta_correcta = 'E',
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-05';

-- Pregunta Oficial N° 38 (Página 35 PDF):
-- Normalización de origen del plano cartesiano (0, 0)
UPDATE public.preguntas
SET
  enunciado = 'En la figura adjunta el rectángulo Q es la imagen homotética del rectángulo R y el punto (0, 0) es el centro de homotecia.

¿Cuál es la razón de homotecia?',
  respuesta_correcta = 'B',
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-38';

-- Pregunta Oficial N° 41 (Página 37 PDF):
-- Normalización de coordenadas (x, y) y origen (0, 0)
UPDATE public.preguntas
SET
  enunciado = '¿Para qué puntos $(x, y)$ en el plano cartesiano se cumple $3x + 3y = x + y$?',
  alternativas = jsonb_build_array(
    jsonb_build_object('letra', 'A', 'texto', 'Para los puntos de la forma $(x, 0)$.', 'es_correcta', true),
    jsonb_build_object('letra', 'B', 'texto', 'Para los puntos de la forma $(x, y)$.', 'es_correcta', false),
    jsonb_build_object('letra', 'C', 'texto', 'Solo para el punto $(0, 0)$.', 'es_correcta', false),
    jsonb_build_object('letra', 'D', 'texto', 'Para ningún punto.', 'es_correcta', false)
  ),
  respuesta_correcta = 'A',
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-41';

-- Pregunta Oficial N° 42 (Página 38 PDF):
-- Normalización de punto (x, y) y vector (p, q)
UPDATE public.preguntas
SET
  enunciado = 'Al trasladar el punto $(x, y)$ según el vector $(p, q)$, se obtiene un punto en el segundo cuadrante.

¿Cuál de las siguientes relaciones es verdadera?',
  alternativas = jsonb_build_array(
    jsonb_build_object('letra', 'A', 'texto', '$x > -p$  e  $y < -q$', 'es_correcta', false),
    jsonb_build_object('letra', 'B', 'texto', '$x < -p$  e  $y > q$', 'es_correcta', false),
    jsonb_build_object('letra', 'C', 'texto', '$x < p$  e  $y > q$', 'es_correcta', false),
    jsonb_build_object('letra', 'D', 'texto', '$x < -p$  e  $y < -q$', 'es_correcta', false),
    jsonb_build_object('letra', 'E', 'texto', '$x < -p$  e  $y > -q$', 'es_correcta', true)
  ),
  respuesta_correcta = 'E',
  updated_at = NOW()
WHERE id = 'preg-paes-mat2-23reg-42';

COMMIT;

