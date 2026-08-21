-- ============================================================
-- Sysget Saber — Migración 010: Crear Perfil de Producción
-- Susana Angélica Pizarro Valenzuela — Colegio Mi Casa
--
-- PRERREQUISITO OBLIGATORIO:
--   1) Crear el usuario en Supabase: Authentication > Users > Add User
--      Email: nentitasusana@hotmail.com
--      Password: (la que definas como admin)
--      Email Confirm: marcar como confirmado manualmente
--   2) Copiar el UUID que Supabase asignó al usuario creado
--   3) Reemplazar 'REEMPLAZAR_CON_UUID_REAL' por ese UUID abajo
-- ============================================================

-- Eliminar perfil anterior si existiera (seguro por email)
DELETE FROM public.perfiles
WHERE email = 'nentitasusana@hotmail.com';

-- Insertar perfil de Susana con UUID real de auth.users
DO $$
DECLARE
  v_susana_id UUID;
BEGIN
  -- Obtener el UUID real que Supabase asignó al crear el usuario en Auth > Users
  SELECT id INTO v_susana_id
  FROM auth.users
  WHERE email = 'nentitasusana@hotmail.com'
  LIMIT 1;

  IF v_susana_id IS NULL THEN
    RAISE EXCEPTION '❌ No se encontró el usuario nentitasusana@hotmail.com en auth.users. Créalo primero en Authentication > Users del dashboard de Supabase, luego ejecuta esta migración.';
  END IF;

  -- Insertar perfil completo de producción
  INSERT INTO public.perfiles (
    id,
    rut,
    nombre,
    apellido,
    apellido_paterno,
    apellido_materno,
    email,
    rol,
    establecimiento,
    rbd,
    asignatura_id,
    asignatura_nombre,
    cargo,
    estado,
    plan,
    activo
  ) VALUES (
    v_susana_id,
    -- RUT: actualizar con el RUT real de Susana cuando esté disponible
    '00.000.000-0',
    'Susana Angélica',
    'Pizarro Valenzuela',
    'Pizarro',
    'Valenzuela',
    'nentitasusana@hotmail.com',
    'profesor',
    'Colegio Mi Casa',
    '1234',
    'asig-1',
    'Matemática',
    'Docente de Matemática',
    'activo',
    'trial',
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    nombre             = EXCLUDED.nombre,
    apellido           = EXCLUDED.apellido,
    apellido_paterno   = EXCLUDED.apellido_paterno,
    apellido_materno   = EXCLUDED.apellido_materno,
    establecimiento    = EXCLUDED.establecimiento,
    rbd                = EXCLUDED.rbd,
    asignatura_nombre  = EXCLUDED.asignatura_nombre,
    estado             = EXCLUDED.estado,
    activo             = EXCLUDED.activo;

  RAISE NOTICE '✅ Perfil de Susana Angélica Pizarro Valenzuela creado exitosamente. UUID: %', v_susana_id;
END;
$$;

-- Verificación final: confirmar que el perfil quedó creado
SELECT
  u.email,
  p.nombre || ' ' || p.apellido AS nombre_completo,
  p.rol,
  p.establecimiento,
  p.rbd,
  p.estado,
  p.plan,
  u.email_confirmed_at IS NOT NULL AS email_confirmado
FROM auth.users u
JOIN public.perfiles p ON p.id = u.id
WHERE u.email = 'nentitasusana@hotmail.com';
