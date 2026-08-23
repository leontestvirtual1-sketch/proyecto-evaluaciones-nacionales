-- ============================================================
-- Sysget Saber — Migración 003: Flujo de Aprobación y Monetización
-- Permite registro controlado con verificación por email, aprobación
-- directa por link/panel del administrador y período de prueba (Trial 30 días).
-- ============================================================

-- 1. Agregar columnas de estado, plan y aprobación a perfiles
ALTER TABLE public.perfiles
  ADD COLUMN IF NOT EXISTS estado TEXT NOT NULL DEFAULT 'pendiente_aprobacion'
    CHECK (estado IN ('pendiente_aprobacion', 'activo', 'suspendido', 'rechazado')),
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'trial'
    CHECK (plan IN ('trial', 'free', 'pro', 'institucional')),
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  ADD COLUMN IF NOT EXISTS approval_token TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS aprobado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS fecha_aprobacion TIMESTAMPTZ;

-- 2. Asegurar que perfiles existentes o demo queden en estado activo
UPDATE public.perfiles
SET estado = 'activo', plan = 'institucional'
WHERE estado IS NULL OR estado = 'pendiente_aprobacion';

-- 3. Función RPC para aprobación directa de 1-clic con token de seguridad
CREATE OR REPLACE FUNCTION public.aprobar_usuario_por_token(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_nombre TEXT;
  v_email TEXT;
  v_establecimiento TEXT;
BEGIN
  -- Buscar usuario con el token proporcionado
  SELECT id, nombre, email, establecimiento
  INTO v_user_id, v_nombre, v_email, v_establecimiento
  FROM public.perfiles
  WHERE approval_token = p_token AND estado = 'pendiente_aprobacion';

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Token inválido o la cuenta ya fue procesada previamente.'
    );
  END IF;

  -- Actualizar estado a activo con 30 días de trial
  UPDATE public.perfiles
  SET
    estado = 'activo',
    plan = 'trial',
    trial_ends_at = NOW() + INTERVAL '30 days',
    fecha_aprobacion = NOW(),
    approval_token = NULL -- invalidar token una vez usado
  WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Usuario aprobado exitosamente con 30 días de prueba gratuita.',
    'userId', v_user_id,
    'nombre', v_nombre,
    'email', v_email,
    'establecimiento', v_establecimiento
  );
END;
$$;

-- 4. Función RPC para que el admin apruebe o cambie estado de un usuario
CREATE OR REPLACE FUNCTION public.admin_cambiar_estado_usuario(
  p_target_user_id UUID,
  p_nuevo_estado TEXT,
  p_nuevo_plan TEXT DEFAULT 'trial'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_admin_rol TEXT;
BEGIN
  -- Verificar que el invocador sea admin
  SELECT rol INTO v_admin_rol
  FROM public.perfiles
  WHERE id = auth.uid();

  IF v_admin_rol != 'admin' THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'No tienes permisos de administrador para realizar esta acción.'
    );
  END IF;

  -- Actualizar
  UPDATE public.perfiles
  SET
    estado = p_nuevo_estado,
    plan = p_nuevo_plan,
    aprobado_por = auth.uid(),
    fecha_aprobacion = CASE WHEN p_nuevo_estado = 'activo' THEN NOW() ELSE fecha_aprobacion END
  WHERE id = p_target_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Estado del usuario actualizado a ' || p_nuevo_estado
  );
END;
$$;

-- 5. Actualizar políticas RLS para que los administradores puedan ver todos los perfiles de todos los estados
DROP POLICY IF EXISTS "Admin puede gestionar todos los perfiles" ON public.perfiles;
CREATE POLICY "Admin puede gestionar todos los perfiles"
  ON public.perfiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND p.rol = 'admin'
    )
  );
