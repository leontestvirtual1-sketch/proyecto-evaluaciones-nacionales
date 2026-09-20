-- ==============================================================================
-- Migración 055: Bloqueo estructural de publicación e integridad de evaluaciones
-- Agrega columnas verificada_at y verificada_por para asegurar que ninguna evaluación
-- sea publicada en catálogo sin haber superado el Quality Gate de Integridad (Fase 5.4).
-- ==============================================================================

-- 1. Agregar columnas de verificación
ALTER TABLE public.evaluaciones
ADD COLUMN IF NOT EXISTS verificada_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS verificada_por UUID;

-- 2. Marcar verificada_at para las evaluaciones auditadas y aprobadas en verify:content
UPDATE public.evaluaciones
SET verificada_at = NOW(),
    updated_at = NOW()
WHERE id IN ('eval-simce-mat-2m-e3', 'eval-paes-lect-2026-f103');
