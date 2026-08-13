-- ============================================================
-- Sysget Saber — Datos Iniciales y Semilla de Prueba (Seed)
-- Establecimiento: Escuela Premilitar Heroes De La Concepción
-- ============================================================

-- 1. USUARIOS DEMO EN AUTH (Extensión pgcrypto requerida)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Profesor Demo (maria@demo.cl / Demo1234!)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'authenticated',
  'authenticated',
  'maria@demo.cl',
  crypt('Demo1234!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"nombre":"María","apellido":"González","rol":"profesor","establecimiento":"Escuela Premilitar Heroes De La Concepción"}',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Alumno Demo (pedro@demo.cl / Demo1234!)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'authenticated',
  'authenticated',
  'pedro@demo.cl',
  crypt('Demo1234!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"nombre":"Pedro","apellido":"Soto","rol":"alumno","establecimiento":"Escuela Premilitar Heroes De La Concepción"}',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2. PERFILES PÚBLICOS
INSERT INTO public.perfiles (id, rut, nombre, apellido, email, rol, establecimiento, activo)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '12.345.678-9', 'María', 'González', 'maria@demo.cl', 'profesor', 'Escuela Premilitar Heroes De La Concepción', true),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '22.876.543-0', 'Pedro', 'Soto', 'pedro@demo.cl', 'alumno', 'Escuela Premilitar Heroes De La Concepción', true)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  apellido = EXCLUDED.apellido,
  rol = EXCLUDED.rol,
  establecimiento = EXCLUDED.establecimiento;

-- 3. CURSOS DEL ESTABLECIMIENTO
INSERT INTO public.cursos (id, nombre, nivel, anio, codigo_invitacion, establecimiento, activo)
VALUES
  ('c0000000-0000-0000-0000-000000000001', '8° Básico A', '8° básico', 2026, '8BAS-A-2026', 'Escuela Premilitar Heroes De La Concepción', true),
  ('c0000000-0000-0000-0000-000000000002', '8° Básico B', '8° básico', 2026, '8BAS-B-2026', 'Escuela Premilitar Heroes De La Concepción', true),
  ('c0000000-0000-0000-0000-000000000003', '2° Medio A', '2° medio', 2026, '2MED-A-2026', 'Escuela Premilitar Heroes De La Concepción', true)
ON CONFLICT (id) DO NOTHING;

-- 4. MATRÍCULAS
INSERT INTO public.matriculas (alumno_id, curso_id)
VALUES
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c0000000-0000-0000-0000-000000000001')
ON CONFLICT (alumno_id, curso_id) DO NOTHING;

-- 5. BANCO DE PREGUNTAS SIMCE
INSERT INTO public.preguntas (
  id,
  asignatura_id,
  eje_tematico_id,
  habilidad_id,
  tipo,
  nivel,
  dificultad,
  enunciado,
  alternativas,
  respuesta_correcta,
  puntaje,
  fuente,
  establecimiento,
  creador_id
) VALUES
  (
    'd0000000-0000-0000-0000-000000000001',
    'asig-1',
    'eje-mat-1',
    'hab-mat-2',
    'seleccion_multiple',
    '8° básico',
    'media',
    'Un curso compró 2 cajas de plumones. Cada caja contenía 10 plumones. Repartieron esos plumones en partes iguales entre 4 grupos de trabajo. ¿Cuántos plumones recibió cada grupo?',
    '[{"letra":"A","texto":"3 plumones","es_correcta":false},{"letra":"B","texto":"5 plumones","es_correcta":true},{"letra":"C","texto":"8 plumones","es_correcta":false},{"letra":"D","texto":"16 plumones","es_correcta":false}]'::jsonb,
    'B',
    1,
    'Liberada Oficial SIMCE',
    'Escuela Premilitar Heroes De La Concepción',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  ),
  (
    'd0000000-0000-0000-0000-000000000002',
    'asig-1',
    'eje-mat-2',
    'hab-mat-3',
    'seleccion_multiple',
    '8° básico',
    'alta',
    'Si 3x - 5 = 16, ¿cuál es el valor de 2x + 1?',
    '[{"letra":"A","texto":"7","es_correcta":false},{"letra":"B","texto":"14","es_correcta":false},{"letra":"C","texto":"15","es_correcta":true},{"letra":"D","texto":"21","es_correcta":false}]'::jsonb,
    'C',
    1,
    'Elaboración Docente',
    'Escuela Premilitar Heroes De La Concepción',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  ),
  (
    'd0000000-0000-0000-0000-000000000003',
    'asig-1',
    'eje-mat-3',
    'hab-mat-1',
    'seleccion_multiple',
    '8° básico',
    'baja',
    '¿Cuál es el área de un triángulo cuya base mide 8 cm y su altura es de 5 cm?',
    '[{"letra":"A","texto":"13 cm²","es_correcta":false},{"letra":"B","texto":"20 cm²","es_correcta":true},{"letra":"C","texto":"40 cm²","es_correcta":false},{"letra":"D","texto":"26 cm²","es_correcta":false}]'::jsonb,
    'B',
    1,
    'Liberada Oficial SIMCE',
    'Escuela Premilitar Heroes De La Concepción',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  ),
  (
    'd0000000-0000-0000-0000-000000000004',
    'asig-2',
    'eje-lec-1',
    'hab-lec-2',
    'seleccion_multiple',
    '8° básico',
    'media',
    'En el texto leído, ¿con qué propósito el autor menciona el viaje a la cordillera en el segundo párrafo?',
    '[{"letra":"A","texto":"Para contrastar el clima de la ciudad con el entorno natural","es_correcta":true},{"letra":"B","texto":"Para criticar las decisiones tomadas por los exploradores","es_correcta":false},{"letra":"C","texto":"Para detallar los costos económicos de la expedición","es_correcta":false},{"letra":"D","texto":"Para convencer al lector de no visitar la zona","es_correcta":false}]'::jsonb,
    'A',
    1,
    'Ensayo Nacional SIMCE',
    'Escuela Premilitar Heroes De La Concepción',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  )
ON CONFLICT (id) DO NOTHING;

-- 6. PRUEBAS DEMO (EVALUACIONES ACTIVAS)
INSERT INTO public.pruebas (
  id,
  titulo,
  descripcion,
  asignatura_id,
  nivel,
  profesor_id,
  curso_id,
  estado,
  tiempo_limite,
  codigo_acceso,
  pregunta_ids,
  establecimiento
) VALUES
  (
    'e0000000-0000-0000-0000-000000000001',
    'Ensayo Diagnóstico SIMCE Matemática 8° Básico',
    'Evaluación diagnóstica con foco en Números, Álgebra y Geometría según estándares del Mineduc.',
    'asig-1',
    '8° básico',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'c0000000-0000-0000-0000-000000000001',
    'activa',
    60,
    'SIMCE-MAT-8A',
    '["d0000000-0000-0000-0000-000000000001", "d0000000-0000-0000-0000-000000000002", "d0000000-0000-0000-0000-000000000003"]'::jsonb,
    'Escuela Premilitar Heroes De La Concepción'
  ),
  (
    'e0000000-0000-0000-0000-000000000002',
    'Control de Lectura y Comprensión N° 1',
    'Evaluación de estrategias de inferencia e interpretación de textos informativos.',
    'asig-2',
    '8° básico',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'c0000000-0000-0000-0000-000000000001',
    'activa',
    45,
    'SIMCE-LEC-8A',
    '["d0000000-0000-0000-0000-000000000004"]'::jsonb,
    'Escuela Premilitar Heroes De La Concepción'
  )
ON CONFLICT (id) DO NOTHING;

-- 7. RENDICIÓN DE MUESTRA
INSERT INTO public.rendiciones (
  id,
  prueba_id,
  alumno_id,
  respuestas,
  puntaje_total,
  puntaje_maximo,
  porcentaje_logro,
  estado,
  inicio_at,
  fin_at
) VALUES
  (
    'f0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    '{"d0000000-0000-0000-0000-000000000001":"B","d0000000-0000-0000-0000-000000000002":"C","d0000000-0000-0000-0000-000000000003":"B"}'::jsonb,
    3,
    3,
    100.00,
    'completada',
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '30 minutes'
  )
ON CONFLICT (prueba_id, alumno_id) DO NOTHING;
