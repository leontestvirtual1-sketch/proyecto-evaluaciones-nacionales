-- ==============================================================================
-- Migración 053: Estandarización de puntaje en SIMCE Matemática 6° Básico Ensayo 3
-- Tabla de especificaciones oficial MINEDUC: 35 ítems a 2 puntos cada uno = 70 puntos totales
-- ==============================================================================

-- 1. Actualizar puntaje de cada pregunta a 2 puntos
UPDATE public.preguntas
SET puntaje = 2,
    updated_at = NOW()
WHERE id LIKE 'preg-mat6b-e3-%';

-- 2. Asegurar total_preguntas = 35 en evaluaciones
UPDATE public.evaluaciones
SET total_preguntas = 35,
    updated_at = NOW()
WHERE id IN ('eval-simce-mat-6b-e3', 'eval-simce-mat-6b-ensayo3');
