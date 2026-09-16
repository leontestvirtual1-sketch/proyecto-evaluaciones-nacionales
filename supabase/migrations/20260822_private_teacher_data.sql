-- ==============================================================================
-- MIGRACIÓN NEUTRALIZADA — NO-OP
-- Archivo: supabase/migrations/20260822_private_teacher_data.sql
-- ==============================================================================
-- ⚠️  ESTA MIGRACIÓN ES UN NO-OP INTENCIONAL.
--
-- Todo su contenido fue consolidado en:
--   supabase/migrations/042_consolidate_rls_and_teacher_isolation.sql
-- y las correcciones de políticas en:
--   supabase/migrations/043_fix_rls_rendiciones_and_preguntas_rbd.sql
--
-- Motivo de neutralización (Auditoría Tercera — Hallazgo 3):
--   El nombre "20260822_..." ordena lexicográficamente DESPUÉS de "042_...",
--   por lo que en cualquier pipeline de migración (supabase db push, CI/CD)
--   esta migración se ejecutaría DESPUÉS de 042, fallando con "policy already
--   exists" y dejando el historial de migraciones en estado roto/confuso.
--
-- Solución: este archivo queda vacío (BEGIN/COMMIT sin operaciones) para que
--   el pipeline lo marque como aplicado sin efecto ni error.
-- ==============================================================================

BEGIN;
-- no-op intencional
COMMIT;
