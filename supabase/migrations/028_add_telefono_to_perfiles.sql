-- ============================================================
-- Migración 028 — Sysget Saber
-- Agrega columna 'telefono' a la tabla public.perfiles
-- para registro de teléfono celular de contacto del docente.
-- ============================================================

ALTER TABLE public.perfiles
  ADD COLUMN IF NOT EXISTS telefono TEXT;

COMMENT ON COLUMN public.perfiles.telefono IS
  'Teléfono celular de contacto del docente (formato +56 9 XXXX XXXX). '
  'Usado para verificación de identidad y comunicación directa.';
