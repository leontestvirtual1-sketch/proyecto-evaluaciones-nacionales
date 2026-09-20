-- ==============================================================================
-- Migración 051: Contención inmediata - Ocultar evaluaciones no verificadas del catálogo
-- Desactiva visibilidad pública en el catálogo para:
-- 1. eval-simce-mat-2m-e3 (Ensayo 3 SIMCE Matemática 2° Medio)
-- 2. eval-simce-len-2m-e6 (Ensayo 6 SIMCE Lengua y Literatura 2° Medio)
--
-- Directiva 1 & 2 / Plan de Acción Fase 1.1
-- ==============================================================================
BEGIN;

UPDATE public.evaluaciones
SET es_catalogo = false,
    estado = 'borrador',
    updated_at = NOW()
WHERE id IN ('eval-simce-mat-2m-e3', 'eval-simce-len-2m-e6');

COMMIT;
