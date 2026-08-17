-- ============================================================
-- Sysget Saber - Creacion de Usuarios Oficiales de Produccion
-- Migracion 006 v2: Usa DELETE + INSERT para evitar conflicto
-- en auth.users (ON CONFLICT (email) no funciona en Supabase)
--
-- INSTRUCCIONES:
--   1. Ir a: https://supabase.com/dashboard/project/khtdzgfqjggycrcbrytw/sql/new
--   2. Pegar este script completo y ejecutar (Run)
--   3. Verificar en Authentication > Users ambos correos
--
-- CONTRASENAS de produccion:
--   leontesvirtual1@gmail.com  =>  Saber_2026!
--   luis.leon@premil.cl        =>  Premil_2026!
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------
-- LIMPIEZA PREVIA (evita conflictos de clave duplicada)
-- -----------------------------------------------------------
DELETE FROM public.perfiles
WHERE id IN (
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99',
  '98e7e5c9-e55d-4b47-bd5d-c6aabd463d18'
);

DELETE FROM auth.users
WHERE email IN (
  'leontesvirtual1@gmail.com',
  'luis.leon@premil.cl'
);

-- -----------------------------------------------------------
-- 1. SUPER ADMINISTRADOR - Luis Andres Leon Gonzalez
--    Email: leontesvirtual1@gmail.com
--    Contrasena: Saber_2026!
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
  establecimiento, cargo, estado, plan, created_at, updated_at
) VALUES (
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99',
  '17.123.456-7', 'Luis Andres', 'Leon Gonzalez',
  'leontesvirtual1@gmail.com', 'admin',
  'Sysget Saber', 'Super Administrador',
  'activo', 'premium', NOW(), NOW()
);

-- -----------------------------------------------------------
-- 2. DOCENTE OFICIAL - Maria Teresa Gonzalez
--    Email: luis.leon@premil.cl
--    Establecimiento: Escuela Premilitar Heroes de la Concepcion
--    Contrasena: Premil_2026!
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
  cargo, estado, plan, created_at, updated_at
) VALUES (
  '98e7e5c9-e55d-4b47-bd5d-c6aabd463d18',
  '18.359.422-2', 'Maria Teresa', 'Gonzalez',
  'luis.leon@premil.cl', 'profesor',
  'Escuela Premilitar Heroes de la Concepcion',
  '31030', 'asig-2', 'Lenguaje y Comunicacion',
  'Docente de Lenguaje y Comunicacion',
  'activo', 'trial', NOW(), NOW()
);

-- -----------------------------------------------------------
-- Verificacion final
-- -----------------------------------------------------------
SELECT
  u.email,
  p.nombre || ' ' || p.apellido AS nombre_completo,
  p.rol, p.estado,
  u.email_confirmed_at IS NOT NULL AS email_confirmado
FROM auth.users u
LEFT JOIN public.perfiles p ON p.id = u.id
WHERE u.email IN ('leontesvirtual1@gmail.com', 'luis.leon@premil.cl')
ORDER BY p.rol DESC;
