-- ==============================================================================
-- Migración 018: Superadmin Único (leontestvirtual1@gmail.com), Cursos Dinámicos
-- Colegio Mi Casa (4° Básico, 8° Básico, 2° Medio) y Banco SIMCE Matemática
-- ==============================================================================

-- 1. Migración y Unificación de Superadmin a leontestvirtual1@gmail.com
DO $$
DECLARE
  v_admin_id UUID;
  v_susana_id UUID;
  v_mteresa_id UUID;
BEGIN
  -- Actualizar email si existía leontesvirtual1@gmail.com en auth.users
  UPDATE auth.users
  SET email = 'leontestvirtual1@gmail.com'
  WHERE email = 'leontesvirtual1@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'leontestvirtual1@gmail.com');

  -- Obtener UUID del admin
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'leontestvirtual1@gmail.com' LIMIT 1;
  SELECT id INTO v_susana_id FROM auth.users WHERE email = 'nentitasusana@hotmail.com' LIMIT 1;
  SELECT id INTO v_mteresa_id FROM auth.users WHERE email IN ('mariateresa.gonzalez@premil.cl', 'luis.leon@premil.cl') LIMIT 1;

  -- Eliminar perfil huérfano con leontesvirtual1 si existe
  DELETE FROM public.perfiles WHERE email = 'leontesvirtual1@gmail.com';

  -- Upsert perfil de Super Administrador Oficial
  IF v_admin_id IS NOT NULL THEN
    INSERT INTO public.perfiles (
      id, rut, nombre, apellido, apellido_paterno, apellido_materno,
      email, rol, establecimiento, cargo, estado, plan, dias_restantes_trial, created_at, updated_at
    )
    VALUES (
      v_admin_id, '10.703.767-5', 'Luis Andrés', 'León González', 'León', 'González',
      'leontestvirtual1@gmail.com', 'admin', 'Sysget Saber', 'Super Administrador / Fundador',
      'activo', 'institucional', 30, NOW(), NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = 'leontestvirtual1@gmail.com',
      rol = 'admin',
      estado = 'activo',
      plan = 'institucional',
      updated_at = NOW();
  END IF;

  -- 2. Upsert Establecimientos Oficiales
  INSERT INTO public.establecimientos (rbd, nombre, comuna, dependencia, logo_url, lema)
  VALUES
    ('31030', 'Escuela Premilitar Héroes de la Concepción', 'La Granja, Región Metropolitana', 'Particular Subvencionado', '/logos/escuela-premilitar.png', 'Ad Altiora, Et Meliora, Semper'),
    ('1234', 'Colegio Mi Casa', 'Región Metropolitana', 'Particular Subvencionado', '', 'Formando el Futuro')
  ON CONFLICT (rbd) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    comuna = EXCLUDED.comuna,
    dependencia = EXCLUDED.dependencia,
    lema = EXCLUDED.lema;

  -- 3. Upsert Docente Susana Angélica Pizarro Valenzuela
  IF v_susana_id IS NOT NULL THEN
    INSERT INTO public.perfiles (
      id, rut, nombre, apellido, apellido_paterno, apellido_materno,
      email, rol, establecimiento, rbd, asignatura_id, asignatura_nombre,
      cargo, estado, plan, dias_restantes_trial, created_at, updated_at
    )
    VALUES (
      v_susana_id, '14.149.793-6', 'Susana Angélica', 'Pizarro Valenzuela', 'Pizarro', 'Valenzuela',
      'nentitasusana@hotmail.com', 'profesor', 'Colegio Mi Casa', '1234',
      'asig-1', 'Matemática', 'Docente de Matemática',
      'activo', 'trial', 30, NOW(), NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      establecimiento = 'Colegio Mi Casa',
      rbd = '1234',
      asignatura_id = 'asig-1',
      asignatura_nombre = 'Matemática',
      estado = 'activo',
      updated_at = NOW();
  END IF;

  -- 4. Upsert Cursos de Producción (Escuela Premilitar: 1 curso; Colegio Mi Casa: 3 cursos)
  INSERT INTO public.cursos (id, nombre, nivel, anio, codigo_invitacion, total_alumnos, establecimiento, rbd, profesor_jefe_id, activo)
  VALUES
    ('curso-prem-2m', '2° Medio A', '2° Medio', 2026, 'PREM2M26', 0, 'Escuela Premilitar Héroes de la Concepción', '31030', v_mteresa_id, true),
    ('curso-mc-4b', '4° Básico A', '4° Básico', 2026, 'MC4B2026', 0, 'Colegio Mi Casa', '1234', v_susana_id, true),
    ('curso-mc-8b', '8° Básico A', '8° Básico', 2026, 'MC8B2026', 0, 'Colegio Mi Casa', '1234', v_susana_id, true),
    ('curso-mc-2m', '2° Medio A', '2° Medio', 2026, 'MC2M2026', 0, 'Colegio Mi Casa', '1234', v_susana_id, true)
  ON CONFLICT (id) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    nivel = EXCLUDED.nivel,
    rbd = EXCLUDED.rbd,
    establecimiento = EXCLUDED.establecimiento,
    profesor_jefe_id = EXCLUDED.profesor_jefe_id,
    activo = true;

END $$;

-- 5. Preguntas Oficiales SIMCE Matemática para 4° Básico, 8° Básico y 2° Medio
INSERT INTO public.preguntas (
  id, propietario_id, asignatura_id, eje_tematico_id, habilidad_id,
  tipo, nivel, dificultad, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
)
VALUES
  -- 4° BÁSICO MATEMÁTICA
  (
    'preg-mat-4b-01',
    (SELECT id FROM auth.users WHERE email = 'nentitasusana@hotmail.com' LIMIT 1),
    'asig-1', 'eje-mat-1', 'hab-mat-1',
    'seleccion_multiple', '4° Básico', 'facil',
    'En un huerto escolar se cosecharon 348 manzanas el lunes y 275 manzanas el martes. ¿Cuántas manzanas se cosecharon en total?',
    '[{"letra":"A","texto":"513 manzanas","es_correcta":false},{"letra":"B","texto":"623 manzanas","es_correcta":true},{"letra":"C","texto":"613 manzanas","es_correcta":false},{"letra":"D","texto":"723 manzanas","es_correcta":false}]'::jsonb,
    'B', 1, 'SIMCE Oficial Matemática 4° Básico', NOW(), NOW()
  ),
  (
    'preg-mat-4b-02',
    (SELECT id FROM auth.users WHERE email = 'nentitasusana@hotmail.com' LIMIT 1),
    'asig-1', 'eje-mat-1', 'hab-mat-2',
    'seleccion_multiple', '4° Básico', 'media',
    'Un profesor tiene 36 lápices y los reparte en partes iguales entre 4 estudiantes. ¿Cuántos lápices recibe cada estudiante?',
    '[{"letra":"A","texto":"7 lápices","es_correcta":false},{"letra":"B","texto":"8 lápices","es_correcta":false},{"letra":"C","texto":"9 lápices","es_correcta":true},{"letra":"D","texto":"12 lápices","es_correcta":false}]'::jsonb,
    'C', 1, 'SIMCE Oficial Matemática 4° Básico', NOW(), NOW()
  ),
  (
    'preg-mat-4b-03',
    (SELECT id FROM auth.users WHERE email = 'nentitasusana@hotmail.com' LIMIT 1),
    'asig-1', 'eje-mat-2', 'hab-mat-2',
    'seleccion_multiple', '4° Básico', 'media',
    'Observa la siguiente secuencia numérica: 12, 18, 24, 30, ___. ¿Cuál es el número que sigue?',
    '[{"letra":"A","texto":"34","es_correcta":false},{"letra":"B","texto":"36","es_correcta":true},{"letra":"C","texto":"38","es_correcta":false},{"letra":"D","texto":"40","es_correcta":false}]'::jsonb,
    'B', 1, 'SIMCE Oficial Matemática 4° Básico', NOW(), NOW()
  ),
  (
    'preg-mat-4b-04',
    (SELECT id FROM auth.users WHERE email = 'nentitasusana@hotmail.com' LIMIT 1),
    'asig-1', 'eje-mat-3', 'hab-mat-1',
    'seleccion_multiple', '4° Básico', 'facil',
    '¿Cuál de las siguientes figuras geométricas tiene exactamente 4 lados de igual longitud y 4 ángulos rectos?',
    '[{"letra":"A","texto":"Rectángulo","es_correcta":false},{"letra":"B","texto":"Rombo","es_correcta":false},{"letra":"C","texto":"Cuadrado","es_correcta":true},{"letra":"D","texto":"Trapecio","es_correcta":false}]'::jsonb,
    'C', 1, 'SIMCE Oficial Matemática 4° Básico', NOW(), NOW()
  ),
  (
    'preg-mat-4b-05',
    (SELECT id FROM auth.users WHERE email = 'nentitasusana@hotmail.com' LIMIT 1),
    'asig-1', 'eje-mat-4', 'hab-mat-3',
    'seleccion_multiple', '4° Básico', 'alta',
    'En un gráfico de barras, la barra de "Perros" llega a 15 y la de "Gatos" llega a 9. ¿Cuántos estudiantes más prefieren perros que gatos?',
    '[{"letra":"A","texto":"4 estudiantes","es_correcta":false},{"letra":"B","texto":"6 estudiantes","es_correcta":true},{"letra":"C","texto":"8 estudiantes","es_correcta":false},{"letra":"D","texto":"24 estudiantes","es_correcta":false}]'::jsonb,
    'B', 1, 'SIMCE Oficial Matemática 4° Básico', NOW(), NOW()
  ),

  -- 8° BÁSICO MATEMÁTICA
  (
    'preg-mat-8b-01',
    (SELECT id FROM auth.users WHERE email = 'nentitasusana@hotmail.com' LIMIT 1),
    'asig-1', 'eje-mat-1', 'hab-mat-2',
    'seleccion_multiple', '8° Básico', 'media',
    'Un curso compró 2 cajas de plumones. Cada caja contenía 10 plumones. Repartieron esos plumones en partes iguales entre 4 grupos de trabajo. ¿Cuántos plumones recibió cada grupo?',
    '[{"letra":"A","texto":"3 plumones","es_correcta":false},{"letra":"B","texto":"5 plumones","es_correcta":true},{"letra":"C","texto":"8 plumones","es_correcta":false},{"letra":"D","texto":"16 plumones","es_correcta":false}]'::jsonb,
    'B', 1, 'SIMCE Oficial Matemática 8° Básico', NOW(), NOW()
  ),
  (
    'preg-mat-8b-02',
    (SELECT id FROM auth.users WHERE email = 'nentitasusana@hotmail.com' LIMIT 1),
    'asig-1', 'eje-mat-2', 'hab-mat-3',
    'seleccion_multiple', '8° Básico', 'alta',
    'Si 3x - 7 = 14, ¿cuál es el valor de x?',
    '[{"letra":"A","texto":"5","es_correcta":false},{"letra":"B","texto":"7","es_correcta":true},{"letra":"C","texto":"9","es_correcta":false},{"letra":"D","texto":"21","es_correcta":false}]'::jsonb,
    'B', 1, 'SIMCE Oficial Matemática 8° Básico', NOW(), NOW()
  ),

  -- 2° MEDIO MATEMÁTICA
  (
    'preg-mat-2m-01',
    (SELECT id FROM auth.users WHERE email = 'nentitasusana@hotmail.com' LIMIT 1),
    'asig-1', 'eje-mat-2', 'hab-mat-3',
    'seleccion_multiple', '2° Medio', 'alta',
    '¿Cuáles son las soluciones de la ecuación cuadrática x² - 5x + 6 = 0?',
    '[{"letra":"A","texto":"x = -2, x = -3","es_correcta":false},{"letra":"B","texto":"x = 2, x = 3","es_correcta":true},{"letra":"C","texto":"x = 1, x = 6","es_correcta":false},{"letra":"D","texto":"x = -1, x = -6","es_correcta":false}]'::jsonb,
    'B', 1, 'SIMCE Oficial Matemática 2° Medio', NOW(), NOW()
  ),
  (
    'preg-mat-2m-02',
    (SELECT id FROM auth.users WHERE email = 'nentitasusana@hotmail.com' LIMIT 1),
    'asig-1', 'eje-mat-1', 'hab-mat-2',
    'seleccion_multiple', '2° Medio', 'media',
    'Al simplificar la expresión √(75) + √(12), se obtiene:',
    '[{"letra":"A","texto":"7√3","es_correcta":true},{"letra":"B","texto":"5√3","es_correcta":false},{"letra":"C","texto":"√87","es_correcta":false},{"letra":"D","texto":"10√3","es_correcta":false}]'::jsonb,
    'A', 1, 'SIMCE Oficial Matemática 2° Medio', NOW(), NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  nivel = EXCLUDED.nivel,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  fuente = EXCLUDED.fuente,
  updated_at = NOW();
