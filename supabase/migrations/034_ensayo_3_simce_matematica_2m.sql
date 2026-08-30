-- ==============================================================================
-- Migración 034: Ensayo 3 SIMCE Matemática II° Medio (Catálogo Global Sin Asignar)
-- Nivel: 2° Medio | Asignatura: asig-1 | es_catalogo = TRUE | profesor_id = NULL
-- ==============================================================================
BEGIN;

-- 1. Registrar o actualizar la evaluación en public.evaluaciones
INSERT INTO public.evaluaciones (
  id, titulo, descripcion, asignatura_id, nivel, tiempo_limite, estado, 
  es_catalogo, precio_clp, descripcion_catalogo, profesor_id, total_preguntas, created_at, updated_at
) VALUES (
  'eval-simce-mat-2m-e3',
  'Ensayo 3 SIMCE Matemática 2° Medio',
  'Evaluación oficial SIMCE de Matemática para 2° Medio. Mide Números y Operaciones, Álgebra y Funciones, Geometría, Medición y Probabilidad y Estadística.',
  'asig-1',
  '2° Medio',
  90,
  'activa',
  TRUE,
  0,
  'Evaluación integral estándar SIMCE de Matemática 2° Medio con 35 ítems de selección múltiple, alineación curricular MINEDUC y distribución psicométrica equilibrada.',
  NULL,
  35,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  descripcion = EXCLUDED.descripcion,
  asignatura_id = EXCLUDED.asignatura_id,
  nivel = EXCLUDED.nivel,
  tiempo_limite = EXCLUDED.tiempo_limite,
  estado = EXCLUDED.estado,
  es_catalogo = TRUE,
  total_preguntas = EXCLUDED.total_preguntas,
  updated_at = NOW();

-- 2. Insertar las 35 preguntas de Matemática 2° Medio
DO $insert_mat2m$
DECLARE
  v_admin_id UUID;
BEGIN
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'leontestvirtual1@gmail.com' LIMIT 1;
  IF v_admin_id IS NULL THEN
    SELECT id INTO v_admin_id FROM auth.users LIMIT 1;
  END IF;

  INSERT INTO public.preguntas (
    id, propietario_id, asignatura_id, eje_tematico_id, habilidad_id,
    tipo, nivel, dificultad, imagen_url,
    enunciado, alternativas, respuesta_correcta, puntaje, fuente,
    created_at, updated_at
  ) VALUES
    ('preg-mat2m-e3-01', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-2', 'seleccion_multiple', '2° Medio', 'baja', NULL, '¿Cuál de las siguientes expresiones es equivalente a $\sqrt[3]{a + b}$?', '[{"letra": "A", "texto": "(a + b)^(1/3)", "es_correcta": true}, {"letra": "B", "texto": "(a + b)^3", "es_correcta": false}, {"letra": "C", "texto": "a^(1/3) + b^(1/3)", "es_correcta": false}, {"letra": "D", "texto": "(1/3)(a + b)", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-02', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-2', 'seleccion_multiple', '2° Medio', 'baja', NULL, 'La expresión $\sqrt[3]{64} = 4$ se puede representar en forma de logaritmo como:', '[{"letra": "A", "texto": "log_64(4) = 1/3", "es_correcta": true}, {"letra": "B", "texto": "log_64(3) = 4", "es_correcta": false}, {"letra": "C", "texto": "log_4(8) = 1/3", "es_correcta": false}, {"letra": "D", "texto": "log_4(1/3) = 64", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-03', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-1', 'seleccion_multiple', '2° Medio', 'media', '/preguntas/simce_mat_2m_e3/p03_tabla_esports.png', 'En una competencia de eSports, el sistema clasifica a los jugadores calculando su «Eficiencia de Combate». Esta eficiencia se obtiene dividiendo el daño total causado por la cantidad de rondas jugadas.

Considera que ambos datos son siempre números enteros positivos.

¿Qué conjunto numérico es el adecuado para expresar **todos los posibles resultados** de la «Eficiencia de Combate»?', '[{"letra": "A", "texto": "Números naturales (ℕ).", "es_correcta": false}, {"letra": "B", "texto": "Números racionales (ℚ).", "es_correcta": true}, {"letra": "C", "texto": "Números irracionales (𝕀).", "es_correcta": false}, {"letra": "D", "texto": "Números enteros (ℤ).", "es_correcta": false}]'::jsonb, 'B', 2, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-04', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-2', 'seleccion_multiple', '2° Medio', 'media', NULL, '¿Cuál de las siguientes raíces es equivalente a $\sqrt{3} \cdot \sqrt[3]{3}$?', '[{"letra": "A", "texto": "⁵√3", "es_correcta": false}, {"letra": "B", "texto": "⁵√3²", "es_correcta": false}, {"letra": "C", "texto": "⁶√3⁵", "es_correcta": true}, {"letra": "D", "texto": "⁶√3⁶", "es_correcta": false}]'::jsonb, 'C', 2, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-05', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-2', 'seleccion_multiple', '2° Medio', 'baja', NULL, '¿Cuál es el valor de $\log_{10}(1000) - \log_2(16)$?', '[{"letra": "A", "texto": "-1", "es_correcta": true}, {"letra": "B", "texto": "1", "es_correcta": false}, {"letra": "C", "texto": "0", "es_correcta": false}, {"letra": "D", "texto": "2", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-06', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-1', 'seleccion_multiple', '2° Medio', 'media', NULL, 'Si $\log(2) \approx 0{,}301$ y $\log(3) \approx 0{,}477$, ¿cuál es el valor aproximado de $\log(18)$?', '[{"letra": "A", "texto": "1,255", "es_correcta": true}, {"letra": "B", "texto": "0,778", "es_correcta": false}, {"letra": "C", "texto": "1,079", "es_correcta": false}, {"letra": "D", "texto": "1,556", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-07', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-3', 'seleccion_multiple', '2° Medio', 'media', NULL, '¿Cuál de las siguientes afirmaciones es **verdadera** respecto a los números reales?', '[{"letra": "A", "texto": "La suma de dos números irracionales siempre es un número irracional.", "es_correcta": false}, {"letra": "B", "texto": "El producto de un número racional no nulo por uno irracional siempre es irracional.", "es_correcta": true}, {"letra": "C", "texto": "Todo número decimal infinito es un número irracional.", "es_correcta": false}, {"letra": "D", "texto": "Entre dos números racionales distintos solo existe una cantidad finita de números reales.", "es_correcta": false}]'::jsonb, 'B', 2, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-08', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-2', 'seleccion_multiple', '2° Medio', 'baja', NULL, '¿Cuál de las siguientes igualdades es correcta para todo número real positivo $x$?', '[{"letra": "A", "texto": "√(x + 9) = √x + 3", "es_correcta": false}, {"letra": "B", "texto": "√(9x) = 3√x", "es_correcta": true}, {"letra": "C", "texto": "(√x + 3)² = x + 9", "es_correcta": false}, {"letra": "D", "texto": "√(x² + y²) = x + y", "es_correcta": false}]'::jsonb, 'B', 1, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-09', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-2', 'seleccion_multiple', '2° Medio', 'baja', NULL, 'Al racionalizar la expresión $\frac{6}{\sqrt{3}}$, se obtiene:', '[{"letra": "A", "texto": "2√3", "es_correcta": true}, {"letra": "B", "texto": "3√3", "es_correcta": false}, {"letra": "C", "texto": "6√3", "es_correcta": false}, {"letra": "D", "texto": "2", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-10', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-1', 'seleccion_multiple', '2° Medio', 'baja', NULL, 'Sabiendo que 1 pulgada equivale a $2{,}54\text{ cm}$, ¿cuántos centímetros equivalen a $12$ pulgadas?', '[{"letra": "A", "texto": "30,48 cm", "es_correcta": true}, {"letra": "B", "texto": "25,40 cm", "es_correcta": false}, {"letra": "C", "texto": "32,54 cm", "es_correcta": false}, {"letra": "D", "texto": "28,60 cm", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-11', v_admin_id, 'asig-1', 'eje-mat-2', 'hab-mat-1', 'seleccion_multiple', '2° Medio', 'media', NULL, '¿Cuál es el conjunto solución de la ecuación cuadrática $x^2 - 5x + 6 = 0$?', '[{"letra": "A", "texto": "{2, 3}", "es_correcta": true}, {"letra": "B", "texto": "{-2, -3}", "es_correcta": false}, {"letra": "C", "texto": "{1, 6}", "es_correcta": false}, {"letra": "D", "texto": "{-1, -6}", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-12', v_admin_id, 'asig-1', 'eje-mat-2', 'hab-mat-3', 'seleccion_multiple', '2° Medio', 'media', NULL, '¿Cuál es el discriminante ($\Delta$) de la ecuación $2x^2 - 4x + 5 = 0$ y qué indica sobre sus soluciones?', '[{"letra": "A", "texto": "Δ = -24, no tiene soluciones reales.", "es_correcta": true}, {"letra": "B", "texto": "Δ = 56, tiene dos soluciones reales distintas.", "es_correcta": false}, {"letra": "C", "texto": "Δ = 0, tiene una única solución real.", "es_correcta": false}, {"letra": "D", "texto": "Δ = -4, no tiene soluciones reales.", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-13', v_admin_id, 'asig-1', 'eje-mat-2', 'hab-mat-4', 'seleccion_multiple', '2° Medio', 'media', NULL, 'La trayectoria de un proyectil está dada por la función cuadrática $h(t) = -5t^2 + 20t$, donde $h$ es la altura en metros y $t$ el tiempo en segundos. ¿Cuál es la altura máxima alcanzada por el proyectil?', '[{"letra": "A", "texto": "20 m", "es_correcta": true}, {"letra": "B", "texto": "15 m", "es_correcta": false}, {"letra": "C", "texto": "25 m", "es_correcta": false}, {"letra": "D", "texto": "10 m", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-14', v_admin_id, 'asig-1', 'eje-mat-2', 'hab-mat-2', 'seleccion_multiple', '2° Medio', 'baja', NULL, '¿En qué puntos interseca al eje $X$ la parábola asociada a la función $f(x) = x^2 - 4$?', '[{"letra": "A", "texto": "(2, 0) y (-2, 0)", "es_correcta": true}, {"letra": "B", "texto": "(0, 4) y (0, -4)", "es_correcta": false}, {"letra": "C", "texto": "(4, 0) y (-4, 0)", "es_correcta": false}, {"letra": "D", "texto": "(0, -4)", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-15', v_admin_id, 'asig-1', 'eje-mat-2', 'hab-mat-2', 'seleccion_multiple', '2° Medio', 'baja', NULL, 'Si $f(x) = 2x^2 - 3x + 1$, ¿cuál es el valor de $f(-2)$?', '[{"letra": "A", "texto": "15", "es_correcta": true}, {"letra": "B", "texto": "3", "es_correcta": false}, {"letra": "C", "texto": "-1", "es_correcta": false}, {"letra": "D", "texto": "7", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-16', v_admin_id, 'asig-1', 'eje-mat-2', 'hab-mat-2', 'seleccion_multiple', '2° Medio', 'baja', NULL, 'Dada la expresión algebraica $4x^2 - 9y^2$, ¿cuál es su factorización completa?', '[{"letra": "A", "texto": "(2x - 3y)(2x + 3y)", "es_correcta": true}, {"letra": "B", "texto": "(2x - 3y)²", "es_correcta": false}, {"letra": "C", "texto": "(4x - 9y)(x + y)", "es_correcta": false}, {"letra": "D", "texto": "2(x - 3y)(x + 3y)", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-17', v_admin_id, 'asig-1', 'eje-mat-2', 'hab-mat-1', 'seleccion_multiple', '2° Medio', 'baja', NULL, '¿Cuál es la solución del sistema de ecuaciones lineales?
$$\begin{cases} x + y = 10 \\ x - y = 4 \end{cases}$$', '[{"letra": "A", "texto": "x = 7, y = 3", "es_correcta": true}, {"letra": "B", "texto": "x = 6, y = 4", "es_correcta": false}, {"letra": "C", "texto": "x = 8, y = 2", "es_correcta": false}, {"letra": "D", "texto": "x = 5, y = 5", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-18', v_admin_id, 'asig-1', 'eje-mat-2', 'hab-mat-4', 'seleccion_multiple', '2° Medio', 'media', NULL, 'Un comerciante vende lápices a $\$300$ y cuadernos a $\$1{.}200$. Si vendió un total de $50$ artículos y recaudó $\$33{.}000$, ¿cuántos cuadernos vendió?', '[{"letra": "A", "texto": "20 cuadernos", "es_correcta": true}, {"letra": "B", "texto": "30 cuadernos", "es_correcta": false}, {"letra": "C", "texto": "25 cuadernos", "es_correcta": false}, {"letra": "D", "texto": "15 cuadernos", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-19', v_admin_id, 'asig-1', 'eje-mat-2', 'hab-mat-3', 'seleccion_multiple', '2° Medio', 'media', '/preguntas/simce_mat_2m_e3/p19_plano_rectas.png', 'Observa las rectas que se intersecan en el plano cartesiano de la figura. ¿Cuál de los siguientes sistemas de ecuaciones está representado por estas rectas?', '[{"letra": "A", "texto": "x + y = 4  y  2x - y = 2", "es_correcta": true}, {"letra": "B", "texto": "x - y = 4  y  x + y = 2", "es_correcta": false}, {"letra": "C", "texto": "2x + y = 6  y  x - 2y = 0", "es_correcta": false}, {"letra": "D", "texto": "x + 2y = 8  y  x - y = 1", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-20', v_admin_id, 'asig-1', 'eje-mat-2', 'hab-mat-1', 'seleccion_multiple', '2° Medio', 'media', '/preguntas/simce_mat_2m_e3/p20_sistema_ecuaciones.png', 'Considera el siguiente sistema de ecuaciones lineales:
$$\begin{cases} 2x + 3y = 12 \\ 4x - y = 10 \end{cases}$$
¿Cuál es el valor de $x$ e $y$ que satisface el sistema anterior?', '[{"letra": "A", "texto": "x = 3, y = 2", "es_correcta": true}, {"letra": "B", "texto": "x = 2, y = 3", "es_correcta": false}, {"letra": "C", "texto": "x = 4, y = 1", "es_correcta": false}, {"letra": "D", "texto": "x = 1, y = 4", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-21', v_admin_id, 'asig-1', 'eje-mat-2', 'hab-mat-2', 'seleccion_multiple', '2° Medio', 'baja', NULL, '¿Cuál es la pendiente ($m$) y el coeficiente de posición ($n$) de la recta de ecuación $3x - 2y + 6 = 0$?', '[{"letra": "A", "texto": "m = 3/2, n = 3", "es_correcta": true}, {"letra": "B", "texto": "m = -3/2, n = -3", "es_correcta": false}, {"letra": "C", "texto": "m = 3, n = 6", "es_correcta": false}, {"letra": "D", "texto": "m = 2/3, n = -3", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-22', v_admin_id, 'asig-1', 'eje-mat-2', 'hab-mat-3', 'seleccion_multiple', '2° Medio', 'media', '/preguntas/simce_mat_2m_e3/p22_recta_plano.png', 'Observa la recta representada en el plano cartesiano de la figura. ¿Cuál de las siguientes ecuaciones representa a esta recta?', '[{"letra": "A", "texto": "y = -2x + 4", "es_correcta": true}, {"letra": "B", "texto": "y = 2x + 4", "es_correcta": false}, {"letra": "C", "texto": "y = -1/2 x + 2", "es_correcta": false}, {"letra": "D", "texto": "y = 2x - 4", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-23', v_admin_id, 'asig-1', 'eje-mat-3', 'hab-mat-3', 'seleccion_multiple', '2° Medio', 'media', NULL, '¿Cuál de los siguientes pares de rectas son **perpendiculares** entre sí?', '[{"letra": "A", "texto": "L₁: y = 2x + 1  y  L₂: y = -1/2 x + 5", "es_correcta": true}, {"letra": "B", "texto": "L₁: y = 3x - 2  y  L₂: y = 3x + 4", "es_correcta": false}, {"letra": "C", "texto": "L₁: y = -4x + 1  y  L₂: y = 4x - 1", "es_correcta": false}, {"letra": "D", "texto": "L₁: y = 1/3 x  y  L₂: y = 3x", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-24', v_admin_id, 'asig-1', 'eje-mat-3', 'hab-mat-2', 'seleccion_multiple', '2° Medio', 'baja', NULL, 'A un vector $\vec{u} = (3, -2)$ se le aplica una homotecia con centro en el origen y razón $k = -2$. ¿Cuáles son las coordenadas del vector resultante $\vec{u}''$?', '[{"letra": "A", "texto": "(-6, 4)", "es_correcta": true}, {"letra": "B", "texto": "(6, -4)", "es_correcta": false}, {"letra": "C", "texto": "(-1, 0)", "es_correcta": false}, {"letra": "D", "texto": "(-6, -4)", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-25', v_admin_id, 'asig-1', 'eje-mat-3', 'hab-mat-1', 'seleccion_multiple', '2° Medio', 'media', NULL, 'Si a una figura de área $12\text{ cm}^2$ se le aplica una homotecia con razón $k = 3$, ¿cuál es el área de la figura resultante?', '[{"letra": "A", "texto": "108 cm²", "es_correcta": true}, {"letra": "B", "texto": "36 cm²", "es_correcta": false}, {"letra": "C", "texto": "72 cm²", "es_correcta": false}, {"letra": "D", "texto": "144 cm²", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-26', v_admin_id, 'asig-1', 'eje-mat-4', 'hab-mat-1', 'seleccion_multiple', '2° Medio', 'media', NULL, '¿Cuál es el volumen de un cono recto de radio basal $r = 3\text{ cm}$ y altura $h = 10\text{ cm}$? (Usa $\pi$ como constante)', '[{"letra": "A", "texto": "30π cm³", "es_correcta": true}, {"letra": "B", "texto": "90π cm³", "es_correcta": false}, {"letra": "C", "texto": "45π cm³", "es_correcta": false}, {"letra": "D", "texto": "15π cm³", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-27', v_admin_id, 'asig-1', 'eje-mat-4', 'hab-mat-1', 'seleccion_multiple', '2° Medio', 'media', '/preguntas/simce_mat_2m_e3/p27_circulo_sector.png', 'Observa la circunferencia de centro $O$ y radio $r = 5\text{ cm}$. Si el ángulo central del sector circular sombreado mide $72^\circ$, ¿cuál es el área del sector circular gris?', '[{"letra": "A", "texto": "5π cm²", "es_correcta": true}, {"letra": "B", "texto": "10π cm²", "es_correcta": false}, {"letra": "C", "texto": "2,5π cm²", "es_correcta": false}, {"letra": "D", "texto": "25π cm²", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-28', v_admin_id, 'asig-1', 'eje-mat-4', 'hab-mat-1', 'seleccion_multiple', '2° Medio', 'alta', '/preguntas/simce_mat_2m_e3/p28_figura_geometria.png', 'Una esfera metálica de radio $r = 6\text{ cm}$ se funde completamente para fabricar cilindros pequeños de radio $r = 2\text{ cm}$ y altura $h = 3\text{ cm}$. ¿Cuántos cilindros completos se pueden fabricar?', '[{"letra": "A", "texto": "24 cilindros", "es_correcta": true}, {"letra": "B", "texto": "18 cilindros", "es_correcta": false}, {"letra": "C", "texto": "36 cilindros", "es_correcta": false}, {"letra": "D", "texto": "12 cilindros", "es_correcta": false}]'::jsonb, 'A', 3, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-29', v_admin_id, 'asig-1', 'eje-mat-3', 'hab-mat-3', 'seleccion_multiple', '2° Medio', 'media', '/preguntas/simce_mat_2m_e3/p29_triangulo_trig.png', 'Observa las medidas en el triángulo rectángulo de la figura. ¿Cuál de las siguientes razones trigonométricas permite calcular correctamente el valor de la altura $h$?', '[{"letra": "A", "texto": "h = 50 · sin(30°)", "es_correcta": true}, {"letra": "B", "texto": "h = 50 / cos(30°)", "es_correcta": false}, {"letra": "C", "texto": "h = 50 · tan(30°)", "es_correcta": false}, {"letra": "D", "texto": "h = 50 · cos(30°)", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-30', v_admin_id, 'asig-1', 'eje-mat-3', 'hab-mat-2', 'seleccion_multiple', '2° Medio', 'media', NULL, 'En un triángulo rectángulo, si el $\cos(\alpha) = \frac{4}{5}$, ¿cuál es el valor de $\tan(\alpha)$?', '[{"letra": "A", "texto": "3/4", "es_correcta": true}, {"letra": "B", "texto": "3/5", "es_correcta": false}, {"letra": "C", "texto": "4/3", "es_correcta": false}, {"letra": "D", "texto": "5/4", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-31', v_admin_id, 'asig-1', 'eje-mat-5', 'hab-mat-4', 'seleccion_multiple', '2° Medio', 'media', '/preguntas/simce_mat_2m_e3/p31_tablero_galton.png', 'En una aplicación educativa sobre estadística, se muestra un tablero de obstáculos simplificado. Se suelta una bola desde la parte superior y, al chocar con cada obstáculo (puntos negros), la bola solo puede rebotar hacia la izquierda o hacia la derecha, con igual probabilidad.

Si se simula el lanzamiento de $2{.}000$ bolas, ¿cuál es la mejor estimación de la cantidad de bolas que caerán en el Contenedor B?', '[{"letra": "A", "texto": "250 bolas", "es_correcta": false}, {"letra": "B", "texto": "500 bolas", "es_correcta": false}, {"letra": "C", "texto": "1 000 bolas", "es_correcta": true}, {"letra": "D", "texto": "1 500 bolas", "es_correcta": false}]'::jsonb, 'C', 2, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-32', v_admin_id, 'asig-1', 'eje-mat-5', 'hab-mat-1', 'seleccion_multiple', '2° Medio', 'media', '/preguntas/simce_mat_2m_e3/p32_diagrama_videojuegos.png', 'En un grupo de 10 personas que juegan videojuegos, se registró qué tipo de videojuego prefieren y si suelen jugar solas o con amistades. En el diagrama, cada círculo representa a una persona y la letra indica su tipo de videojuego preferido (D: deportes, C: combate).

¿Cuál tabla de doble entrada representa estos datos correctamente?', '[{"letra": "A", "texto": "Deportes: 3 Solas, 3 Amistades | Combate: 2 Solas, 2 Amistades (Total: 10)", "es_correcta": true}, {"letra": "B", "texto": "Deportes: 4 Solas, 2 Amistades | Combate: 1 Sola, 3 Amistades (Total: 10)", "es_correcta": false}, {"letra": "C", "texto": "Deportes: 2 Solas, 4 Amistades | Combate: 3 Solas, 1 Amistad (Total: 10)", "es_correcta": false}, {"letra": "D", "texto": "Deportes: 5 Solas, 1 Amistad | Combate: 2 Solas, 2 Amistades (Total: 10)", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-33', v_admin_id, 'asig-1', 'eje-mat-5', 'hab-mat-1', 'seleccion_multiple', '2° Medio', 'media', NULL, 'En un sistema de seguridad doméstico se instalan dos sensores de movimiento, el sensor A y el sensor B, que funcionan de manera independiente. La probabilidad de activación ante intruso es $P(A) = 0{,}9$ y $P(B) = 0{,}8$.

El sistema dispara la alerta si al menos uno de los sensores se activa. Si entra un intruso, ¿cuál es la probabilidad de que se dispare la alerta general?', '[{"letra": "A", "texto": "0,10", "es_correcta": false}, {"letra": "B", "texto": "0,72", "es_correcta": false}, {"letra": "C", "texto": "0,98", "es_correcta": true}, {"letra": "D", "texto": "1,70", "es_correcta": false}]'::jsonb, 'C', 2, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-34', v_admin_id, 'asig-1', 'eje-mat-5', 'hab-mat-3', 'seleccion_multiple', '2° Medio', 'alta', '/preguntas/simce_mat_2m_e3/p34_tabla_sorteos.png', 'Un grupo de amigos quiere ganar entradas para un concierto y deben decidir en qué sorteo participar donde tengan la mayor cantidad esperada de ganadores dentro de su grupo.

La siguiente tabla muestra las condiciones de dos cuentas:

| Cuenta | Probabilidad individual | Cantidad de participantes del grupo |
| :--- | :---: | :---: |
| **@FanáticoReal** | $0{,}30$ | $20$ personas |
| **@MúsicaTotal** | $0{,}10$ | $80$ personas |

Considerando la frecuencia esperada de los resultados, ¿qué argumento es correcto respecto a la opción que conviene elegir?', '[{"letra": "A", "texto": "La de @FanáticoReal, porque la probabilidad 0,3 es mucho más alta que la probabilidad 0,1.", "es_correcta": false}, {"letra": "B", "texto": "Cualquiera de las dos, porque al ser un sorteo aleatorio no se pueden usar los números para saber qué pasará realmente.", "es_correcta": false}, {"letra": "C", "texto": "La de @MúsicaTotal, porque se espera que el grupo obtenga alrededor de 8 entradas (80 * 0,1), superando las 6 (20 * 0,3) que se esperan de @FanáticoReal.", "es_correcta": true}, {"letra": "D", "texto": "La de @MúsicaTotal, porque al sortear 4 veces más participantes, asegura matemáticamente que el grupo ganará el cuádruple de premios.", "es_correcta": false}]'::jsonb, 'C', 3, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW()),
    ('preg-mat2m-e3-35', v_admin_id, 'asig-1', 'eje-mat-5', 'hab-mat-1', 'seleccion_multiple', '2° Medio', 'baja', NULL, '¿De cuántas maneras distintas se pueden sentar $5$ personas en una fila de $5$ asientos?', '[{"letra": "A", "texto": "120 maneras", "es_correcta": true}, {"letra": "B", "texto": "24 maneras", "es_correcta": false}, {"letra": "C", "texto": "25 maneras", "es_correcta": false}, {"letra": "D", "texto": "60 maneras", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 3 SIMCE Matemática 2° Medio', NOW(), NOW())
  ON CONFLICT (id) DO UPDATE SET
    asignatura_id = EXCLUDED.asignatura_id,
    eje_tematico_id = EXCLUDED.eje_tematico_id,
    habilidad_id = EXCLUDED.habilidad_id,
    tipo = EXCLUDED.tipo,
    nivel = EXCLUDED.nivel,
    dificultad = EXCLUDED.dificultad,
    imagen_url = EXCLUDED.imagen_url,
    enunciado = EXCLUDED.enunciado,
    alternativas = EXCLUDED.alternativas,
    respuesta_correcta = EXCLUDED.respuesta_correcta,
    puntaje = EXCLUDED.puntaje,
    fuente = EXCLUDED.fuente,
    updated_at = NOW();
END $insert_mat2m$;

COMMIT;