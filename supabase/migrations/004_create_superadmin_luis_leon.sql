-- ============================================================
-- Sysget Saber — Creación de Cuenta Super-Admin Permanente
-- Titular: Luis Andrés León González (RUT: 10.703.767-5)
-- Email:   luis_leon_g@hotmail.com
-- Rol:     Super Administrador / Fundador
-- ============================================================
-- INSTRUCCIONES: Ejecutar en el SQL Editor de Supabase Cloud
-- Ir a: Authentication > Users y verificar que aparece el correo
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- PASO 1: Eliminar si ya existe (para evitar conflictos)
-- ============================================================
DO $$
DECLARE
  v_uid UUID;
BEGIN
  SELECT id INTO v_uid FROM auth.users WHERE email = 'luis_leon_g@hotmail.com';
  IF v_uid IS NOT NULL THEN
    DELETE FROM public.perfiles WHERE id = v_uid;
    DELETE FROM auth.users WHERE id = v_uid;
  END IF;
END$$;

-- ============================================================
-- PASO 2: Crear usuario en Supabase Auth con contraseña
-- ============================================================
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'luis_leon_g@hotmail.com',
  crypt('REEMPLAZAR_CON_PASSWORD_SEGURO', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"],"role":"admin"}',
  '{"nombre":"Luis Andrés","apellido":"León González","rut":"10.703.767-5","rol":"admin","establecimiento":"Sysget Saber Central"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- ============================================================
-- PASO 3: Crear perfil en public.perfiles
-- Nota: Si falta alguna columna (cargo/estado/plan) se ignora
-- ============================================================
DO $$
DECLARE
  v_uid UUID;
  v_has_cargo BOOLEAN;
  v_has_estado BOOLEAN;
  v_has_plan BOOLEAN;
BEGIN
  -- Obtener el UUID recién creado
  SELECT id INTO v_uid FROM auth.users WHERE email = 'luis_leon_g@hotmail.com';

  -- Detectar si las columnas extendidas existen
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'perfiles' AND column_name = 'cargo'
  ) INTO v_has_cargo;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'perfiles' AND column_name = 'estado'
  ) INTO v_has_estado;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'perfiles' AND column_name = 'plan'
  ) INTO v_has_plan;

  -- Insertar perfil base (siempre disponible)
  INSERT INTO public.perfiles (id, rut, nombre, apellido, email, rol, establecimiento, activo, created_at, updated_at)
  VALUES (
    v_uid,
    '10.703.767-5',
    'Luis Andrés',
    'León González',
    'luis_leon_g@hotmail.com',
    'admin',
    'Sysget Saber Central',
    TRUE,
    NOW(),
    NOW()
  );

  -- Agregar cargo si la columna existe (migración 003)
  IF v_has_cargo THEN
    UPDATE public.perfiles SET cargo = 'Super Administrador / Fundador' WHERE id = v_uid;
  END IF;

  -- Agregar estado si la columna existe (migración 003)
  IF v_has_estado THEN
    UPDATE public.perfiles SET estado = 'activo' WHERE id = v_uid;
  END IF;

  -- Agregar plan si la columna existe (migración 003)
  IF v_has_plan THEN
    UPDATE public.perfiles SET plan = 'institucional' WHERE id = v_uid;
  END IF;

  RAISE NOTICE 'Super Admin creado exitosamente con ID: %', v_uid;
END$$;

-- ============================================================
-- VERIFICACIÓN: Ejecutar esto para confirmar que quedó bien
-- ============================================================
SELECT
  u.id,
  u.email,
  u.email_confirmed_at,
  p.nombre,
  p.apellido,
  p.rut,
  p.rol,
  p.activo
FROM auth.users u
JOIN public.perfiles p ON p.id = u.id
WHERE u.email = 'luis_leon_g@hotmail.com';
