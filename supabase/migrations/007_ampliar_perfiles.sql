-- ============================================================
-- Sysget Saber - Migracion 007: Ampliar tabla perfiles
-- EJECUTAR PRIMERO que el 006
-- ============================================================

ALTER TABLE public.perfiles
  ADD COLUMN IF NOT EXISTS rbd               TEXT,
  ADD COLUMN IF NOT EXISTS asignatura_id     TEXT,
  ADD COLUMN IF NOT EXISTS asignatura_nombre TEXT,
  ADD COLUMN IF NOT EXISTS cargo             TEXT,
  ADD COLUMN IF NOT EXISTS logo_url          TEXT;

ALTER TABLE public.perfiles
  ADD COLUMN IF NOT EXISTS estado TEXT NOT NULL DEFAULT 'activo'
    CHECK (estado IN ('activo','pendiente_aprobacion','suspendido','rechazado')),
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'trial'
    CHECK (plan IN ('free','trial','premium')),
  ADD COLUMN IF NOT EXISTS dias_restantes_trial INTEGER DEFAULT 30,
  ADD COLUMN IF NOT EXISTS fecha_registro    TEXT,
  ADD COLUMN IF NOT EXISTS approval_token    TEXT;

SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'perfiles'
ORDER BY ordinal_position;
