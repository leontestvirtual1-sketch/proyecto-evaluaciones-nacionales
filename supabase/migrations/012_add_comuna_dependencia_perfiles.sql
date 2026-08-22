-- ============================================================
-- Sysget Saber — Migración 012: Asegurar columnas comuna y dependencia en perfiles
-- y actualizar establecimientos existentes
-- ============================================================

-- 1. Agregar columnas comuna y dependencia a public.perfiles
ALTER TABLE public.perfiles
  ADD COLUMN IF NOT EXISTS comuna TEXT,
  ADD COLUMN IF NOT EXISTS dependencia TEXT;

-- 2. Asegurar columnas en public.establecimientos
ALTER TABLE public.establecimientos
  ADD COLUMN IF NOT EXISTS comuna TEXT,
  ADD COLUMN IF NOT EXISTS dependencia TEXT;

-- 3. Actualizar establecimientos que pudieran haber quedado con NULL en comuna o dependencia
UPDATE public.establecimientos
SET
  comuna = COALESCE(NULLIF(comuna, ''), 'Región Metropolitana'),
  dependencia = COALESCE(NULLIF(dependencia, ''), 'Particular Subvencionado')
WHERE comuna IS NULL OR dependencia IS NULL OR comuna = '' OR dependencia = '';

-- 4. Sincronizar perfiles existentes con los datos del establecimiento correspondiente
UPDATE public.perfiles p
SET
  comuna = e.comuna,
  dependencia = e.dependencia
FROM public.establecimientos e
WHERE p.rbd = e.rbd AND (p.comuna IS NULL OR p.dependencia IS NULL);

-- 5. Verificación de la migración
SELECT rbd, nombre, comuna, dependencia FROM public.establecimientos;
SELECT rut, nombre, apellido, establecimiento, rbd, comuna, dependencia FROM public.perfiles LIMIT 10;
