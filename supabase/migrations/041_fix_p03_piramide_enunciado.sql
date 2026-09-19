-- ====================================================================
-- MIGRATION 041: Correccion del enunciado Pregunta 3 (Piramide de sumas)
-- El PDF tenia un diagrama de piramide cuyo texto fue extraido como letras
-- sueltas (f, q, p en lineas separadas). Se corrige con texto limpio +
-- referencia a figura_p03_piramide.png + fraccion LaTeX.
-- ====================================================================

UPDATE public.preguntas SET
  enunciado = 'En la figura adjunta se cumple que la suma de los valores de los casilleros contiguos de una fila es igual al valor inmediatamente superior a ellos (por ejemplo,  + q = f$).

![Piramide de sumas](/preguntas/paes_mat1_2023_forma113/figura_p03_piramide.png)

Si la suma de los tres valores de la ultima fila es 17, cual es el valor de $\frac{f}{p}True',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-03';
