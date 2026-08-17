-- ============================================================
-- Sysget Saber - Migracion 006 v4: Usuarios Oficiales
--
-- PREREQUISITO: Ejecutar 007_ampliar_perfiles.sql PRIMERO
-- CONTRASENAS: leontesvirtual1@gmail.com => Saber_2026!
--              luis.leon@premil.cl       => Premil_2026!
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------
-- LIMPIEZA PREVIA: borra por ID Y por email (cubre typos previos)
-- -----------------------------------------------------------
DELETE FROM public.perfiles
WHERE id IN (
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99',
  '98e7e5c9-e55d-4b47-bd5d-c6aabd463d18'
)
OR email IN (
  'leontesvirtual1@gmail.com',
  'luis.leon@premil.cl',
  'luis.leon@promil.cl'
);

DELETE FROM auth.users
WHERE id IN (
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99',
  '98e7e5c9-e55d-4b47-bd5d-c6aabd463d18'
)
OR email IN (
  'leontesvirtual1@gmail.com',
  'luis.leon@premil.cl',
  'luis.leon@promil.cl'
);

-- -----------------------------------------------------------
-- 1. SUPER ADMINISTRADOR
--    Email: leontesvirtual1@gmail.com / Saber_2026!
-- -----------------------------------------------------------
INSERT INTO auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, recovery_token,
  email_change_token_new, email_change
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99',
  'authenticated', 'authenticated',
  'leontesvirtual1@gmail.com',
  crypt('Saber_2026!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"nombre":"Luis Andres","apellido":"Leon Gonzalez","rol":"admin"}',
  NOW(), NOW(), '', '', '', ''
);

INSERT INTO public.perfiles (
  id, rut, nombre, apellido, email, rol,
  establecimiento, cargo, estado, plan, activo
) VALUES (
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99',
  '17.123.456-7', 'Luis Andres', 'Leon Gonzalez',
  'leontesvirtual1@gmail.com', 'admin',
  'Sysget Saber', 'Super Administrador',
  'activo', 'premium', true
);

-- -----------------------------------------------------------
-- 2. DOCENTE OFICIAL - Maria Teresa Gonzalez
--    Email: luis.leon@premil.cl / Premil_2026!
-- -----------------------------------------------------------
INSERT INTO auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, recovery_token,
  email_change_token_new, email_change
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '98e7e5c9-e55d-4b47-bd5d-c6aabd463d18',
  'authenticated', 'authenticated',
  'luis.leon@premil.cl',
  crypt('Premil_2026!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"nombre":"Maria Teresa","apellido":"Gonzalez","rol":"profesor","rbd":"31030"}',
  NOW(), NOW(), '', '', '', ''
);

INSERT INTO public.perfiles (
  id, rut, nombre, apellido, email, rol,
  establecimiento, rbd, asignatura_id, asignatura_nombre,
  cargo, estado, plan, activo
) VALUES (
  '98e7e5c9-e55d-4b47-bd5d-c6aabd463d18',
  '18.359.422-2', 'Maria Teresa', 'Gonzalez',
  'luis.leon@premil.cl', 'profesor',
  'Escuela Premilitar Heroes de la Concepcion',
  '31030', 'asig-2', 'Lenguaje y Comunicacion',
  'Docente de Lenguaje y Comunicacion',
  'activo', 'trial', true
);

-- -----------------------------------------------------------
-- Verificacion final
-- -----------------------------------------------------------
SELECT
  u.email,
  p.nombre || ' ' || p.apellido AS nombre_completo,
  p.rol, p.cargo, p.estado, p.plan,
  u.email_confirmed_at IS NOT NULL AS email_confirmado
FROM auth.users u
LEFT JOIN public.perfiles p ON p.id = u.id
WHERE u.email IN ('leontesvirtual1@gmail.com', 'luis.leon@premil.cl')
ORDER BY p.rol DESC;
