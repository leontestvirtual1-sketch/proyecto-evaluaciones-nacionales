-- ============================================================
-- Sysget Saber — Migración 011: Tabla de Establecimientos y Normalización de RBD
-- ============================================================

-- 1. Crear tabla oficial de establecimientos
CREATE TABLE IF NOT EXISTS public.establecimientos (
  rbd         TEXT PRIMARY KEY,
  nombre      TEXT NOT NULL,
  comuna      TEXT,
  dependencia TEXT,
  logo_url    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS en establecimientos
ALTER TABLE public.establecimientos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura pública de establecimientos" ON public.establecimientos;
CREATE POLICY "Lectura pública de establecimientos"
  ON public.establecimientos FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Admin puede gestionar establecimientos" ON public.establecimientos;
CREATE POLICY "Admin puede gestionar establecimientos"
  ON public.establecimientos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND p.rol = 'admin'
    )
  );

-- 2. Poblar establecimientos iniciales oficiales
INSERT INTO public.establecimientos (rbd, nombre, comuna, dependencia) VALUES
  ('31030', 'Escuela Premilitar Héroes de la Concepción', 'Renca', 'Particular Subvencionado'),
  ('99999', 'Colegio Mi Casa', 'Santiago', 'Particular Subvencionado'),
  ('10101', 'Liceo Bicentenario Los Andes', 'Los Andes', 'Municipal')
ON CONFLICT (rbd) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  comuna = COALESCE(EXCLUDED.comuna, establecimientos.comuna),
  dependencia = COALESCE(EXCLUDED.dependencia, establecimientos.dependencia);

-- 3. Poblar cualquier establecimiento existente que ya esté en perfiles
INSERT INTO public.establecimientos (rbd, nombre)
SELECT DISTINCT rbd, COALESCE(NULLIF(establecimiento, ''), 'Establecimiento ' || rbd)
FROM public.perfiles
WHERE rbd IS NOT NULL AND rbd != ''
ON CONFLICT (rbd) DO NOTHING;

-- 4. Asegurar columna rbd en perfiles y cursos si hiciera falta
ALTER TABLE public.perfiles ADD COLUMN IF NOT EXISTS rbd TEXT;
ALTER TABLE public.cursos ADD COLUMN IF NOT EXISTS rbd TEXT;

-- 5. Normalizar datos existentes en perfiles
UPDATE public.perfiles
SET rbd = '31030'
WHERE email = 'luis.leon@premil.cl' AND (rbd IS NULL OR rbd = '');

UPDATE public.perfiles
SET rbd = '99999'
WHERE email = 'nentitasusana@hotmail.com' AND (rbd IS NULL OR rbd = '');

-- 6. Crear índice de unicidad para RUT (evitar duplicados reales)
CREATE UNIQUE INDEX IF NOT EXISTS idx_perfiles_rut_unique
ON public.perfiles (rut)
WHERE rut IS NOT NULL AND rut != '' AND rut != '00.000.000-0' AND rut != '12.345.678-9';

-- 7. Crear índice relacional en rbd
CREATE INDEX IF NOT EXISTS idx_perfiles_rbd ON public.perfiles(rbd);
CREATE INDEX IF NOT EXISTS idx_cursos_rbd ON public.cursos(rbd);

-- 8. Actualizar políticas RLS para comparar por RBD de forma robusta
DROP POLICY IF EXISTS "Profesores ven todos los perfiles del establecimiento" ON public.perfiles;
CREATE POLICY "Profesores ven todos los perfiles del establecimiento"
  ON public.perfiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.perfiles p
    WHERE p.id = auth.uid() AND p.rol IN ('profesor', 'admin')
      AND (
        (p.rbd IS NOT NULL AND p.rbd = perfiles.rbd) OR
        (p.establecimiento = perfiles.establecimiento)
      )
  ));

DROP POLICY IF EXISTS "Profesores leen cursos de su establecimiento" ON public.cursos;
CREATE POLICY "Profesores leen cursos de su establecimiento"
  ON public.cursos FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.perfiles p
    WHERE p.id = auth.uid() AND p.rol IN ('profesor', 'admin')
      AND (
        (p.rbd IS NOT NULL AND p.rbd = cursos.rbd) OR
        (p.establecimiento = cursos.establecimiento)
      )
  ));

-- 9. Verificación de la migración
SELECT rbd, nombre, comuna, dependencia FROM public.establecimientos;
