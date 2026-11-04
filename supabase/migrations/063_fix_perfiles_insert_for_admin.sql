-- Migración 063: Fix políticas INSERT/UPDATE/DELETE en public.perfiles para admins
-- El error "new row violates row-level security policy for table 'perfiles'"
-- ocurre porque la migración 061 eliminó políticas legacy sin crear nuevas para INSERT.

BEGIN;

-- =========================================================
-- 1. Eliminar políticas INSERT/UPDATE/DELETE legacy si existen
-- =========================================================
DROP POLICY IF EXISTS "Perfiles insercion segura" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles actualizacion segura" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles actualizacion autorizada con control de atributos" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles eliminacion por admin" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles insercion por admin o autoregistro" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles actualizacion por admin o propietario" ON public.perfiles;

-- =========================================================
-- 2. INSERT: Super admin o admin puede insertar cualquier perfil;
--    un usuario autenticado puede auto-registrarse (auth.uid() = id)
-- =========================================================
CREATE POLICY "Perfiles insercion por admin o autoregistro"
  ON public.perfiles
  FOR INSERT
  WITH CHECK (
    -- Auto-registro: el usuario inserta su propio perfil
    auth.uid() = id
    OR
    -- Admin / Super admin puede insertar cualquier perfil
    EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid()
        AND (p.es_super_admin = TRUE OR p.rol IN ('admin', 'superadmin'))
    )
  );

-- =========================================================
-- 3. UPDATE: Propio perfil o admin
-- =========================================================
CREATE POLICY "Perfiles actualizacion por admin o propietario"
  ON public.perfiles
  FOR UPDATE
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid()
        AND (p.es_super_admin = TRUE OR p.rol IN ('admin', 'superadmin'))
    )
  )
  WITH CHECK (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid()
        AND (p.es_super_admin = TRUE OR p.rol IN ('admin', 'superadmin'))
    )
  );

-- =========================================================
-- 4. DELETE: Solo admin o super admin
-- =========================================================
CREATE POLICY "Perfiles eliminacion por admin"
  ON public.perfiles
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid()
        AND (p.es_super_admin = TRUE OR p.rol IN ('admin', 'superadmin'))
    )
  );

COMMIT;

