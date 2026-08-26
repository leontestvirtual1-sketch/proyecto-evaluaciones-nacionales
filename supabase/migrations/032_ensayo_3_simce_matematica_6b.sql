-- ==============================================================================
-- Migración 032: Ensayo 3 SIMCE Matemática 6° Básico (Catálogo Global & Preguntas)
-- Fecha: 2026-08-25
-- ==============================================================================

BEGIN;

-- 0. Asegurar que las columnas para evaluaciones maestras del catálogo permitan NULL
ALTER TABLE public.evaluaciones
  ALTER COLUMN profesor_id DROP NOT NULL,
  ALTER COLUMN curso_id DROP NOT NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'evaluaciones' AND column_name = 'establecimiento'
  ) THEN
    ALTER TABLE public.evaluaciones ALTER COLUMN establecimiento DROP NOT NULL;
  END IF;
END $$;

-- 1. Registrar Evaluación en public.evaluaciones (Catálogo)
INSERT INTO public.evaluaciones (
  id,
  titulo,
  descripcion,
  asignatura_id,
  nivel,
  tiempo_limite,
  estado,
  es_catalogo,
  precio_clp,
  descripcion_catalogo,
  profesor_id,
  total_preguntas,
  created_at,
  updated_at
) VALUES (
  'eval-simce-mat-6b-e3',
  'Ensayo 3 SIMCE Matemática 6° Básico',
  'Evaluación oficial de Matemática para 6° Básico que mide Números y Operaciones, Patrones y Álgebra, Geometría, Medición y Datos y Probabilidades.',
  'asig-1',
  '6° Básico',
  90,
  'activa',
  TRUE,
  0,
  'Evaluación integral estándar SIMCE de Matemática 6° Básico con 35 ítems de selección múltiple, tabla de especificaciones MINEDUC y distribución psicométrica equilibrada.',
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
  es_catalogo = EXCLUDED.es_catalogo,
  descripcion_catalogo = EXCLUDED.descripcion_catalogo,
  total_preguntas = EXCLUDED.total_preguntas,
  updated_at = NOW();

-- 2. Insertar Preguntas en public.preguntas
DO $$
DECLARE
  v_admin_id UUID;
BEGIN
  SELECT id INTO v_admin_id
  FROM auth.users
  WHERE email = 'leontestvirtual1@gmail.com'
  LIMIT 1;

  IF v_admin_id IS NULL THEN
    RAISE EXCEPTION 'Super admin leontestvirtual1@gmail.com no encontrado en auth.users';
  END IF;

  INSERT INTO public.preguntas (
    id, propietario_id, asignatura_id, eje_tematico_id, habilidad_id,
    tipo, nivel, dificultad, imagen_url,
    enunciado, alternativas, respuesta_correcta, puntaje, fuente,
    created_at, updated_at
  ) VALUES
    ('preg-mat6b-e3-01', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-2',
     'seleccion_multiple', '6° Básico', 'baja', NULL,
     '¿Qué valor representa el dígito **3** en el número **5 237 491**?', '[{"letra": "A", "texto": "3", "es_correcta": false}, {"letra": "B", "texto": "30", "es_correcta": false}, {"letra": "C", "texto": "30 000", "es_correcta": true}, {"letra": "D", "texto": "3 000 000", "es_correcta": false}]'::jsonb,
     'C', 1, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-02', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-2',
     'seleccion_multiple', '6° Básico', 'baja', NULL,
     '¿Qué valor representa el dígito **6** en el número **5 726 378**?', '[{"letra": "A", "texto": "6", "es_correcta": false}, {"letra": "B", "texto": "6 000", "es_correcta": true}, {"letra": "C", "texto": "60 000", "es_correcta": false}, {"letra": "D", "texto": "600 000", "es_correcta": false}]'::jsonb,
     'B', 1, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-03', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-3',
     'seleccion_multiple', '6° Básico', 'baja', NULL,
     'Observa la cantidad de habitantes de algunas ciudades de Chile:

| Ciudad | Cantidad de habitantes |
| :--- | :---: |
| Calama | 147 886 |
| Talca | 201 797 |
| Osorno | 145 475 |
| Puerto Montt | 218 858 |

¿Cuál de estas ciudades es la que tiene mayor cantidad de habitantes?', '[{"letra": "A", "texto": "Calama", "es_correcta": false}, {"letra": "B", "texto": "Talca", "es_correcta": false}, {"letra": "C", "texto": "Osorno", "es_correcta": false}, {"letra": "D", "texto": "Puerto Montt", "es_correcta": true}]'::jsonb,
     'D', 1, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-04', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-1',
     'seleccion_multiple', '6° Básico', 'media', NULL,
     '¿Cuál es el resultado de la siguiente operación combinada?

$$3 \cdot 8 - 6 : 2$$', '[{"letra": "A", "texto": "3", "es_correcta": false}, {"letra": "B", "texto": "9", "es_correcta": false}, {"letra": "C", "texto": "15", "es_correcta": false}, {"letra": "D", "texto": "21", "es_correcta": true}]'::jsonb,
     'D', 2, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-05', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-2',
     'seleccion_multiple', '6° Básico', 'media', '/preguntas/simce_mat_6b_e3/p05_recta_numerica.png',
     'Observa la recta numérica:

¿Cuál es el número mixto que se encuentra en el punto **P** de la recta numérica?', '[{"letra": "A", "texto": "1 3/5", "es_correcta": true}, {"letra": "B", "texto": "1 4/5", "es_correcta": false}, {"letra": "C", "texto": "1 3/6", "es_correcta": false}, {"letra": "D", "texto": "1 4/6", "es_correcta": false}]'::jsonb,
     'A', 2, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-06', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-1',
     'seleccion_multiple', '6° Básico', 'media', NULL,
     'María y Pedro están compartiendo una pizza. María ha comido $\frac{5}{6}$ de la pizza y Pedro ha comido $\frac{1}{3}$. ¿Cuánto más ha comido María que Pedro?', '[{"letra": "A", "texto": "1/6", "es_correcta": false}, {"letra": "B", "texto": "4/3", "es_correcta": false}, {"letra": "C", "texto": "2/6", "es_correcta": false}, {"letra": "D", "texto": "1/2", "es_correcta": true}]'::jsonb,
     'D', 2, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-07', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-1',
     'seleccion_multiple', '6° Básico', 'baja', NULL,
     'En una panadería, se usaron **2,75 kg** de harina el día lunes y **1,85 kg** de harina el día martes. ¿Cuántos kilogramos más de harina se usaron el día lunes?', '[{"letra": "A", "texto": "0,90 kg", "es_correcta": true}, {"letra": "B", "texto": "0,95 kg", "es_correcta": false}, {"letra": "C", "texto": "1,10 kg", "es_correcta": false}, {"letra": "D", "texto": "4,60 kg", "es_correcta": false}]'::jsonb,
     'A', 1, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-08', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-1',
     'seleccion_multiple', '6° Básico', 'media', NULL,
     'En el 6° B de la escuela Los Alerces, se hizo una encuesta para decidir el color de las camisetas del equipo. Si de un total de **50** estudiantes, **30** prefirieron rojo y el resto azul, ¿cuál es la razón entre los que prefirieron azul y el total?', '[{"letra": "A", "texto": "1 : 2", "es_correcta": false}, {"letra": "B", "texto": "2 : 5", "es_correcta": true}, {"letra": "C", "texto": "3 : 5", "es_correcta": false}, {"letra": "D", "texto": "4 : 5", "es_correcta": false}]'::jsonb,
     'B', 2, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-09', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-2',
     'seleccion_multiple', '6° Básico', 'baja', NULL,
     '¿Qué número mixto es equivalente a la fracción impropia $\frac{7}{3}$?', '[{"letra": "A", "texto": "2 1/3", "es_correcta": true}, {"letra": "B", "texto": "3 1/7", "es_correcta": false}, {"letra": "C", "texto": "1 4/3", "es_correcta": false}, {"letra": "D", "texto": "2 2/3", "es_correcta": false}]'::jsonb,
     'A', 1, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-10', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-2',
     'seleccion_multiple', '6° Básico', 'baja', '/preguntas/simce_mat_6b_e3/p10_circulo_porcentajes.png',
     'El siguiente círculo está dividido en **10** partes iguales:

¿Qué porcentaje de la superficie total representa el sector ennegrecido?', '[{"letra": "A", "texto": "10%", "es_correcta": false}, {"letra": "B", "texto": "20%", "es_correcta": false}, {"letra": "C", "texto": "40%", "es_correcta": true}, {"letra": "D", "texto": "50%", "es_correcta": false}]'::jsonb,
     'C', 1, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-11', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-2',
     'seleccion_multiple', '6° Básico', 'baja', NULL,
     'Observa la siguiente descomposición aditiva:

$$3\text{ UMi} + 4\text{ CM} + 5\text{ DM} + 6\text{ UM} + 7\text{ C} + 8\text{ D} + 9\text{ U}$$

¿Cuál es el número correspondiente?', '[{"letra": "A", "texto": "345 689", "es_correcta": false}, {"letra": "B", "texto": "3 456 789", "es_correcta": true}, {"letra": "C", "texto": "34 567 890", "es_correcta": false}, {"letra": "D", "texto": "3 004 567 809", "es_correcta": false}]'::jsonb,
     'B', 1, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-12', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-1',
     'seleccion_multiple', '6° Básico', 'media', NULL,
     '¿Cuál es el resultado de la siguiente suma de fracciones?

$$\frac{3}{4} + \frac{2}{3}$$', '[{"letra": "A", "texto": "5/7", "es_correcta": false}, {"letra": "B", "texto": "5/12", "es_correcta": false}, {"letra": "C", "texto": "6/12", "es_correcta": false}, {"letra": "D", "texto": "17/12", "es_correcta": true}]'::jsonb,
     'D', 2, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-13', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-1',
     'seleccion_multiple', '6° Básico', 'media', NULL,
     '¿Cuál es el resultado de la expresión?

$$52 - 12 : 4 + 6 \cdot 3$$', '[{"letra": "A", "texto": "12", "es_correcta": false}, {"letra": "B", "texto": "31", "es_correcta": false}, {"letra": "C", "texto": "48", "es_correcta": false}, {"letra": "D", "texto": "67", "es_correcta": true}]'::jsonb,
     'D', 2, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-14', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-1',
     'seleccion_multiple', '6° Básico', 'baja', NULL,
     '¿Cuál es el resultado de la multiplicación?

$$0,6 \cdot 100$$', '[{"letra": "A", "texto": "0,06", "es_correcta": false}, {"letra": "B", "texto": "0,600", "es_correcta": false}, {"letra": "C", "texto": "60", "es_correcta": true}, {"letra": "D", "texto": "600", "es_correcta": false}]'::jsonb,
     'C', 1, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-15', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-1',
     'seleccion_multiple', '6° Básico', 'media', NULL,
     'Fernanda necesita comprar algunos materiales para el colegio. Si compra un pack de cartulinas por **$1 200**, dos lápices de **$450** cada uno y una tijera de **$600**, ¿cuál de las siguientes expresiones representa el vuelto o cambio que recibe al pagar con un billete de **$5 000**?', '[{"letra": "A", "texto": "5 000 − 1 200 + 450 + 600", "es_correcta": false}, {"letra": "B", "texto": "5 000 − (1 200 + 450 + 600)", "es_correcta": false}, {"letra": "C", "texto": "5 000 − 1 200 + 450 · 2 + 600", "es_correcta": false}, {"letra": "D", "texto": "5 000 − (1 200 + 450 · 2 + 600)", "es_correcta": true}]'::jsonb,
     'D', 2, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-16', v_admin_id, 'asig-1', 'eje-mat-1', 'hab-mat-2',
     'seleccion_multiple', '6° Básico', 'baja', NULL,
     '¿Cuál de los siguientes números es **compuesto**?', '[{"letra": "A", "texto": "7", "es_correcta": false}, {"letra": "B", "texto": "11", "es_correcta": false}, {"letra": "C", "texto": "21", "es_correcta": true}, {"letra": "D", "texto": "23", "es_correcta": false}]'::jsonb,
     'C', 1, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-17', v_admin_id, 'asig-1', 'eje-mat-2', 'hab-mat-4',
     'seleccion_multiple', '6° Básico', 'media', '/preguntas/simce_mat_6b_e3/p17_secuencia_figuras.png',
     'La siguiente secuencia de figuras fue construida siguiendo una regla de formación:

¿Cuántos círculos habrá en la **figura 5**?', '[{"letra": "A", "texto": "8 círculos", "es_correcta": false}, {"letra": "B", "texto": "10 círculos", "es_correcta": true}, {"letra": "C", "texto": "16 círculos", "es_correcta": false}, {"letra": "D", "texto": "30 círculos", "es_correcta": false}]'::jsonb,
     'B', 2, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-18', v_admin_id, 'asig-1', 'eje-mat-2', 'hab-mat-1',
     'seleccion_multiple', '6° Básico', 'media', '/preguntas/simce_mat_6b_e3/p18_balanza_equilibrio.png',
     'Observa la siguiente balanza en equilibrio:

¿Cuál es el valor de $x$ en el platillo?', '[{"letra": "A", "texto": "6", "es_correcta": false}, {"letra": "B", "texto": "10", "es_correcta": false}, {"letra": "C", "texto": "11", "es_correcta": true}, {"letra": "D", "texto": "16", "es_correcta": false}]'::jsonb,
     'C', 2, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-19', v_admin_id, 'asig-1', 'eje-mat-2', 'hab-mat-1',
     'seleccion_multiple', '6° Básico', 'media', NULL,
     'Si el doble de un número es **34**, ¿cuál es el consecutivo de ese número?', '[{"letra": "A", "texto": "18", "es_correcta": true}, {"letra": "B", "texto": "35", "es_correcta": false}, {"letra": "C", "texto": "68", "es_correcta": false}, {"letra": "D", "texto": "69", "es_correcta": false}]'::jsonb,
     'A', 2, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-20', v_admin_id, 'asig-1', 'eje-mat-2', 'hab-mat-1',
     'seleccion_multiple', '6° Básico', 'media', NULL,
     'Considera la ecuación:

$$x + 4 = 10$$

¿Cuál es el resultado de la expresión $x + 2$?', '[{"letra": "A", "texto": "6", "es_correcta": false}, {"letra": "B", "texto": "8", "es_correcta": true}, {"letra": "C", "texto": "14", "es_correcta": false}, {"letra": "D", "texto": "16", "es_correcta": false}]'::jsonb,
     'B', 2, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-21', v_admin_id, 'asig-1', 'eje-mat-2', 'hab-mat-1',
     'seleccion_multiple', '6° Básico', 'media', NULL,
     'Dada la ecuación algebraica:

$$3x + 6 = 21$$

¿Cuál es el valor de $x$?', '[{"letra": "A", "texto": "5", "es_correcta": true}, {"letra": "B", "texto": "9", "es_correcta": false}, {"letra": "C", "texto": "45", "es_correcta": false}, {"letra": "D", "texto": "81", "es_correcta": false}]'::jsonb,
     'A', 2, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-22', v_admin_id, 'asig-1', 'eje-mat-2', 'hab-mat-1',
     'seleccion_multiple', '6° Básico', 'media', NULL,
     'En un terreno rectangular, la diferencia entre el doble del largo y la medida del ancho es exactamente **15 metros**. Si el ancho mide **5 metros**, ¿cuántos metros de largo tiene el terreno?', '[{"letra": "A", "texto": "5", "es_correcta": false}, {"letra": "B", "texto": "10", "es_correcta": true}, {"letra": "C", "texto": "20", "es_correcta": false}, {"letra": "D", "texto": "40", "es_correcta": false}]'::jsonb,
     'B', 2, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-23', v_admin_id, 'asig-1', 'eje-mat-2', 'hab-mat-4',
     'seleccion_multiple', '6° Básico', 'media', NULL,
     'Una tienda de libros obtiene una ganancia de **$3 500** por cada libro vendido. Si $y$ representa la cantidad de libros vendidos, ¿cuál de las siguientes expresiones representa la condición de que la ganancia sea, al menos, de **$70 000**?', '[{"letra": "A", "texto": "3 500 ≥ 70 000y", "es_correcta": false}, {"letra": "B", "texto": "3 500y ≥ 70 000", "es_correcta": true}, {"letra": "C", "texto": "3 500 + y ≥ 70 000", "es_correcta": false}, {"letra": "D", "texto": "70 000 + y ≥ 3 500", "es_correcta": false}]'::jsonb,
     'B', 2, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-24', v_admin_id, 'asig-1', 'eje-mat-3', 'hab-mat-1',
     'seleccion_multiple', '6° Básico', 'media', '/preguntas/simce_mat_6b_e3/p24_triangulo_cuadricula.png',
     'Observa el triángulo dibujado en la cuadrícula formada por cuadrados de $1\text{ cm}^2$:

¿Cuál es el área del triángulo?', '[{"letra": "A", "texto": "11 cm²", "es_correcta": false}, {"letra": "B", "texto": "12 cm²", "es_correcta": true}, {"letra": "C", "texto": "13 cm²", "es_correcta": false}, {"letra": "D", "texto": "16 cm²", "es_correcta": false}]'::jsonb,
     'B', 2, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-25', v_admin_id, 'asig-1', 'eje-mat-3', 'hab-mat-2',
     'seleccion_multiple', '6° Básico', 'baja', '/preguntas/simce_mat_6b_e3/p25_plano_cartesiano.png',
     'Observa el rectángulo ABCD en el siguiente plano cartesiano:

¿En qué coordenadas se encuentra ubicado el **vértice C**?', '[{"letra": "A", "texto": "(2, 3)", "es_correcta": false}, {"letra": "B", "texto": "(3, 2)", "es_correcta": false}, {"letra": "C", "texto": "(3, 6)", "es_correcta": false}, {"letra": "D", "texto": "(6, 3)", "es_correcta": true}]'::jsonb,
     'D', 1, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-26', v_admin_id, 'asig-1', 'eje-mat-3', 'hab-mat-1',
     'seleccion_multiple', '6° Básico', 'media', NULL,
     '¿En qué cubo las caras sombreadas de color gris son **paralelas**?

| Opción A | Opción B |
| :---: | :---: |
| ![Cubo A](/preguntas/simce_mat_6b_e3/p26_cubo_a.png) | ![Cubo B](/preguntas/simce_mat_6b_e3/p26_cubo_b.png) |
| **Opción C** | **Opción D** |
| ![Cubo C](/preguntas/simce_mat_6b_e3/p26_cubo_c.png) | ![Cubo D](/preguntas/simce_mat_6b_e3/p26_cubo_d.png) |', '[{"letra": "A", "texto": "Cubo A", "es_correcta": false}, {"letra": "B", "texto": "Cubo B", "es_correcta": true}, {"letra": "C", "texto": "Cubo C", "es_correcta": false}, {"letra": "D", "texto": "Cubo D", "es_correcta": false}]'::jsonb,
     'B', 2, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-27', v_admin_id, 'asig-1', 'eje-mat-3', 'hab-mat-1',
     'seleccion_multiple', '6° Básico', 'baja', NULL,
     '¿En cuál de las siguientes cuadrículas hay un **triángulo rectángulo**?

| Opción A | Opción B |
| :---: | :---: |
| ![Grid A](/preguntas/simce_mat_6b_e3/p27_grid_a.png) | ![Grid B](/preguntas/simce_mat_6b_e3/p27_grid_b.png) |
| **Opción C** | **Opción D** |
| ![Grid C](/preguntas/simce_mat_6b_e3/p27_grid_c.png) | ![Grid D](/preguntas/simce_mat_6b_e3/p27_grid_d.png) |', '[{"letra": "A", "texto": "Cuadrícula A", "es_correcta": true}, {"letra": "B", "texto": "Cuadrícula B", "es_correcta": false}, {"letra": "C", "texto": "Cuadrícula C", "es_correcta": false}, {"letra": "D", "texto": "Cuadrícula D", "es_correcta": false}]'::jsonb,
     'A', 1, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-28', v_admin_id, 'asig-1', 'eje-mat-3', 'hab-mat-2',
     'seleccion_multiple', '6° Básico', 'media', NULL,
     '¿En cuál de las siguientes imágenes la **Figura 1** es **congruente** con la **Figura 2**?

| Opción A | Opción B |
| :---: | :---: |
| ![Congruencia A](/preguntas/simce_mat_6b_e3/p28_cong_a.png) | ![Congruencia B](/preguntas/simce_mat_6b_e3/p28_cong_b.png) |
| **Opción C** | **Opción D** |
| ![Congruencia C](/preguntas/simce_mat_6b_e3/p28_cong_c.png) | ![Congruencia D](/preguntas/simce_mat_6b_e3/p28_cong_d.png) |', '[{"letra": "A", "texto": "Imagen A", "es_correcta": false}, {"letra": "B", "texto": "Imagen B", "es_correcta": true}, {"letra": "C", "texto": "Imagen C", "es_correcta": false}, {"letra": "D", "texto": "Imagen D", "es_correcta": false}]'::jsonb,
     'B', 2, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-29', v_admin_id, 'asig-1', 'eje-mat-3', 'hab-mat-3',
     'seleccion_multiple', '6° Básico', 'alta', NULL,
     '¿Cuál de las siguientes afirmaciones sobre la congruencia de triángulos es **siempre verdadera**?', '[{"letra": "A", "texto": "Dos triángulos son congruentes si tienen la misma área.", "es_correcta": false}, {"letra": "B", "texto": "Dos triángulos son congruentes si tienen dos ángulos iguales.", "es_correcta": false}, {"letra": "C", "texto": "Dos triángulos equiláteros son congruentes si tienen el mismo perímetro.", "es_correcta": true}, {"letra": "D", "texto": "Dos triángulos son congruentes si sus tres ángulos interiores son respectivamente iguales.", "es_correcta": false}]'::jsonb,
     'C', 3, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-30', v_admin_id, 'asig-1', 'eje-mat-4', 'hab-mat-1',
     'seleccion_multiple', '6° Básico', 'baja', NULL,
     'Un atleta trota diariamente **3,5 km**. ¿Cuántos metros trota diariamente?', '[{"letra": "A", "texto": "35 m", "es_correcta": false}, {"letra": "B", "texto": "350 m", "es_correcta": false}, {"letra": "C", "texto": "3 500 m", "es_correcta": true}, {"letra": "D", "texto": "35 000 m", "es_correcta": false}]'::jsonb,
     'C', 1, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-31', v_admin_id, 'asig-1', 'eje-mat-4', 'hab-mat-1',
     'seleccion_multiple', '6° Básico', 'media', '/preguntas/simce_mat_6b_e3/p31_area_rectangulo.png',
     'El siguiente polígono es un rectángulo:

¿Cuánto mide el área de la parte sombreada?', '[{"letra": "A", "texto": "21 cm²", "es_correcta": false}, {"letra": "B", "texto": "42 cm²", "es_correcta": false}, {"letra": "C", "texto": "54 cm²", "es_correcta": true}, {"letra": "D", "texto": "108 cm²", "es_correcta": false}]'::jsonb,
     'C', 2, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-32', v_admin_id, 'asig-1', 'eje-mat-5', 'hab-mat-1',
     'seleccion_multiple', '6° Básico', 'media', NULL,
     'Juan lanzó una moneda al aire 100 veces y obtuvo los siguientes resultados:

- **45 veces** salió cara.
- **55 veces** salió sello.

Si Juan repite el experimento y lanza la moneda otras 100 veces, ¿cuál es la tendencia más probable para los resultados?', '[{"letra": "A", "texto": "Saldrán más veces cara que sello.", "es_correcta": false}, {"letra": "B", "texto": "Saldrán más veces sello que cara.", "es_correcta": false}, {"letra": "C", "texto": "Saldrán exactamente 50 veces cara y 50 veces sello.", "es_correcta": false}, {"letra": "D", "texto": "Saldrán aproximadamente 50 veces cara y 50 veces sello.", "es_correcta": true}]'::jsonb,
     'D', 2, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-33', v_admin_id, 'asig-1', 'eje-mat-5', 'hab-mat-2',
     'seleccion_multiple', '6° Básico', 'baja', '/preguntas/simce_mat_6b_e3/p33_tallo_hojas.jpeg',
     'El siguiente diagrama de tallo y hojas muestra la cantidad de páginas leídas de un libro por un grupo de personas durante una semana:

¿Qué cantidad de páginas fue la máxima leída?', '[{"letra": "A", "texto": "14", "es_correcta": false}, {"letra": "B", "texto": "55", "es_correcta": false}, {"letra": "C", "texto": "65", "es_correcta": true}, {"letra": "D", "texto": "525", "es_correcta": false}]'::jsonb,
     'C', 1, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-34', v_admin_id, 'asig-1', 'eje-mat-5', 'hab-mat-3',
     'seleccion_multiple', '6° Básico', 'alta', NULL,
     'El promedio de las **4 calificaciones** de Diego en Matemática es exactamente **5,8**. Con esta información, ¿cuál de las siguientes afirmaciones es **siempre verdadera**?', '[{"letra": "A", "texto": "Diego obtuvo al menos una calificación igual a 5,8.", "es_correcta": false}, {"letra": "B", "texto": "La calificación más alta de Diego es mayor que 5,8.", "es_correcta": false}, {"letra": "C", "texto": "La suma de las 4 calificaciones de Diego es igual a 23,2.", "es_correcta": true}, {"letra": "D", "texto": "El valor 5,8 se encuentra en el centro de las notas ordenadas de menor a mayor.", "es_correcta": false}]'::jsonb,
     'C', 3, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW()),
    ('preg-mat6b-e3-35', v_admin_id, 'asig-1', 'eje-mat-5', 'hab-mat-2',
     'seleccion_multiple', '6° Básico', 'baja', '/preguntas/simce_mat_6b_e3/p35_ruleta.png',
     'Observa la siguiente ruleta:

Si se hace girar la flecha, ¿dónde es más probable que esta se detenga?', '[{"letra": "A", "texto": "H", "es_correcta": false}, {"letra": "B", "texto": "M", "es_correcta": true}, {"letra": "C", "texto": "R", "es_correcta": false}, {"letra": "D", "texto": "T", "es_correcta": false}]'::jsonb,
     'B', 1, 'Ensayo 3 SIMCE Matemática 6° Básico',
     NOW(), NOW())
  ON CONFLICT (id) DO UPDATE SET
    asignatura_id     = EXCLUDED.asignatura_id,
    eje_tematico_id   = EXCLUDED.eje_tematico_id,
    habilidad_id      = EXCLUDED.habilidad_id,
    tipo              = EXCLUDED.tipo,
    nivel             = EXCLUDED.nivel,
    dificultad        = EXCLUDED.dificultad,
    imagen_url        = EXCLUDED.imagen_url,
    enunciado         = EXCLUDED.enunciado,
    alternativas      = EXCLUDED.alternativas,
    respuesta_correcta = EXCLUDED.respuesta_correcta,
    puntaje           = EXCLUDED.puntaje,
    fuente            = EXCLUDED.fuente,
    updated_at        = NOW();

END $$;

COMMIT;