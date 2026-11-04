-- =====================================================================
-- Migración 016: Actualizar Email de María Teresa González y Activar
-- Visibilidad Global del Banco de Preguntas para el Administrador
-- =====================================================================

-- ─────────────────────────────────────────────────────────────────────
-- 1. ACTUALIZAR EMAIL DE MARÍA TERESA GONZÁLEZ (Conserva contraseña y UUID)
-- ─────────────────────────────────────────────────────────────────────
UPDATE auth.users
SET email = 'mariateresa.gonzalez@premil.cl',
    raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{email}', '"mariateresa.gonzalez@premil.cl"'),
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    updated_at = NOW()
WHERE email = 'luis.leon@premil.cl';

UPDATE public.perfiles
SET email = 'mariateresa.gonzalez@premil.cl',
    nombre = 'María Teresa',
    apellido = 'González'
WHERE email = 'luis.leon@premil.cl';


-- ─────────────────────────────────────────────────────────────────────
-- 2. POLÍTICAS RLS: VISIBILIDAD GLOBAL PARA ADMINISTRADOR EN PREGUNTAS
-- Docente: Solo ve sus preguntas propias.
-- Administrador: Ve y administra TODO el catálogo de preguntas del sistema.
-- ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.preguntas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Preguntas privadas del propietario" ON public.preguntas;
DROP POLICY IF EXISTS "Preguntas visibles por propietario o admin" ON public.preguntas;

CREATE POLICY "Preguntas visibles por propietario o admin"
  ON public.preguntas FOR SELECT
  USING (
    propietario_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND p.rol = 'admin'
    )
  );

-- Admin o Propietario pueden gestionar
DROP POLICY IF EXISTS "Creacion de preguntas propias" ON public.preguntas;
CREATE POLICY "Creacion de preguntas propias"
  ON public.preguntas FOR INSERT
  WITH CHECK (
    propietario_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND p.rol = 'admin'
    )
  );

DROP POLICY IF EXISTS "Edicion de preguntas propias" ON public.preguntas;
CREATE POLICY "Edicion de preguntas propias"
  ON public.preguntas FOR UPDATE
  USING (
    propietario_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND p.rol = 'admin'
    )
  );

DROP POLICY IF EXISTS "Eliminacion de preguntas propias" ON public.preguntas;
CREATE POLICY "Eliminacion de preguntas propias"
  ON public.preguntas FOR DELETE
  USING (
    propietario_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND p.rol = 'admin'
    )
  );
