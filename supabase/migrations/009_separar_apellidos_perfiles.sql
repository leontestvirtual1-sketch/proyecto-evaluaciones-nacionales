-- ============================================================
-- Sysget Saber — Migración 009: Separar Nombres y Apellidos en Perfiles
-- Permite almacenar de forma explícita apellido_paterno y apellido_materno
-- manteniendo retrocompatibilidad completa con el campo apellido
-- ============================================================

ALTER TABLE public.perfiles
  ADD COLUMN IF NOT EXISTS apellido_paterno TEXT,
  ADD COLUMN IF NOT EXISTS apellido_materno TEXT;

-- Actualizar registros existentes para descomponer apellido si procede
UPDATE public.perfiles
SET 
  apellido_paterno = split_part(apellido, ' ', 1),
  apellido_materno = substring(apellido from position(' ' in apellido) + 1)
WHERE apellido_paterno IS NULL AND position(' ' in apellido) > 0;
