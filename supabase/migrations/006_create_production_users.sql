-- ============================================================
-- Sysget Saber - Migracion 006 v5 (FINAL)
-- PRERREQUISITO: 
--   1) Ejecutar 007_ampliar_perfiles.sql
--   2) Crear usuarios en Auth > Users de la UI de Supabase
--   3) Sustituir los dos UUID con los reales que dio Supabase
-- ============================================================

-- INSTRUCCION:
-- Ve a Authentication > Users en el dashboard de Supabase
-- Copia el UUID de cada usuario creado y reemplaza abajo:

-- Limpieza por email (seguro, sin UUIDs)
DELETE FROM public.perfiles
WHERE email IN (
  'leontestvirtual1@gmail.com',
  'leontesvirtual1@gmail.com',
  'luis.leon@premil.cl',
  'luis.leon@promil.cl'
);

-- Obtener los UUIDs reales desde auth.users
DO 
DECLARE
  v_admin_id   UUID;
  v_docente_id UUID;
  v_admin_email TEXT;
BEGIN
  SELECT id, email INTO v_admin_id, v_admin_email FROM auth.users WHERE email IN ('leontestvirtual1@gmail.com', 'leontesvirtual1@gmail.com') LIMIT 1;
  SELECT id INTO v_docente_id FROM auth.users WHERE email = 'luis.leon@premil.cl'       LIMIT 1;

  IF v_admin_id IS NULL THEN
    RAISE EXCEPTION 'No se encontro el usuario admin (leontestvirtual1@gmail.com o leontesvirtual1@gmail.com). Crealo primero en Authentication > Users.';
  END IF;
  IF v_docente_id IS NULL THEN
    RAISE EXCEPTION 'No se encontro el usuario luis.leon@premil.cl. Crealo primero en Authentication > Users.';
  END IF;

  -- Perfil Super Admin
  INSERT INTO public.perfiles (
    id, rut, nombre, apellido, email, rol,
    establecimiento, cargo, estado, plan, activo
  ) VALUES (
    v_admin_id,
    '10.703.767-5', 'Luis Andres', 'Leon Gonzalez',
    v_admin_email, 'admin',
    'Sysget Saber', 'Super Administrador',
    'activo', 'premium', true
  );

  -- Perfil Docente Maria Teresa
  INSERT INTO public.perfiles (
    id, rut, nombre, apellido, email, rol,
    establecimiento, rbd, asignatura_id, asignatura_nombre,
    cargo, estado, plan, activo
  ) VALUES (
    v_docente_id,
    '18.359.422-2', 'Maria Teresa', 'Gonzalez',
    'luis.leon@premil.cl', 'profesor',
    'Escuela Premilitar Heroes de la Concepcion',
    '31030', 'asig-2', 'Lenguaje y Comunicacion',
    'Docente de Lenguaje y Comunicacion',
    'activo', 'trial', true
  );

  RAISE NOTICE 'Perfiles creados exitosamente. Admin ID: %, Docente ID: %', v_admin_id, v_docente_id;
END ;

-- Verificacion final
SELECT
  u.email,
  p.nombre || ' ' || p.apellido AS nombre_completo,
  p.rol, p.cargo, p.estado, p.plan,
  u.email_confirmed_at IS NOT NULL AS email_confirmado
FROM auth.users u
JOIN public.perfiles p ON p.id = u.id
WHERE u.email IN ('leontestvirtual1@gmail.com', 'leontesvirtual1@gmail.com', 'luis.leon@premil.cl')
ORDER BY p.rol DESC;
