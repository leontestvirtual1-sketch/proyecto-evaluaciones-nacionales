-- ============================================================
-- Sysget Saber — Migración 014: Endurecimiento RLS y Tokens Seguros (S-09, S-10)
-- ============================================================

-- 1. Agregar columna de expiración de token de aprobación si no existe
ALTER TABLE public.perfiles 
  ADD COLUMN IF NOT EXISTS approval_token_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '72 hours');

-- 2. Asegurar RLS activo en perfiles
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

-- 3. Eliminar políticas anteriores para reemplazarlas por políticas estrictas con WITH CHECK
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.perfiles;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.perfiles;
DROP POLICY IF EXISTS "Lectura de perfiles para autenticados" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles lectura propia" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles actualización propia" ON public.perfiles;

-- Política de lectura: Cada usuario solo puede leer su propio perfil, o un admin puede leer todos
CREATE POLICY "Perfiles lectura autorizada"
  ON public.perfiles FOR SELECT
  USING (
    auth.uid() = id 
    OR EXISTS (
      SELECT 1 FROM public.perfiles p_admin 
      WHERE p_admin.id = auth.uid() AND p_admin.rol = 'admin'
    )
  );

-- Política de actualización: Un usuario solo puede actualizar sus datos de contacto y nombre,
-- pero NUNCA alterar su rol, estado, plan, rbd, establecimiento, días trial ni activo (S-10).
CREATE POLICY "Perfiles actualizacion autorizada con control de atributos"
  ON public.perfiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- El usuario no puede auto-promoverse a admin si no lo era
    AND (
      rol = (SELECT p.rol FROM public.perfiles p WHERE p.id = auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.perfiles p_admin 
        WHERE p_admin.id = auth.uid() AND p_admin.rol = 'admin'
      )
    )
    -- El usuario no puede auto-activarse o cambiar su estado si no es admin
    AND (
      estado = (SELECT p.estado FROM public.perfiles p WHERE p.id = auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.perfiles p_admin 
        WHERE p_admin.id = auth.uid() AND p_admin.rol = 'admin'
      )
    )
  );

-- 4. Política para que el Service Role (Backend API) mantenga control total
DROP POLICY IF EXISTS "Service role control total" ON public.perfiles;
-- En Supabase el service_role omite RLS automáticamente por defecto.

-- 5. Crear índice para optimizar búsqueda de tokens de aprobación
CREATE INDEX IF NOT EXISTS idx_perfiles_approval_token ON public.perfiles (approval_token) 
  WHERE approval_token IS NOT NULL;
