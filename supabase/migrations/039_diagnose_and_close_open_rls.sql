-- ==============================================================================
-- Migración 039: Diagnóstico y Verificación de Políticas RLS Activas
-- Fecha: 2026-09-16
-- 
-- PROPÓSITO:
--   1. Diagnosticar el estado real de las políticas RLS en producción.
--   2. Asegurar que no existan políticas USING (TRUE) en cursos/evaluaciones/rendiciones.
--   3. Idempotente: se puede ejecutar múltiples veces sin efecto secundario.
--
-- INSTRUCCIONES:
--   a) Ejecutar el BLOQUE DE DIAGNÓSTICO en Supabase SQL Editor primero.
--   b) Si aparecen políticas abiertas (qual = 'true'), ejecutar BLOQUE DE CONTENCIÓN.
--   c) Confirmar aislamiento: usuario Premilitar no ve datos de Mi Casa y viceversa.
-- ==============================================================================

-- ============================================================
-- BLOQUE 1: DIAGNÓSTICO (solo lectura, siempre seguro ejecutar)
-- ============================================================

-- Ver todas las políticas RLS de las tablas críticas:
SELECT tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('cursos','evaluaciones','rendiciones','preguntas','perfiles')
  AND schemaname = 'public'
ORDER BY tablename, cmd, policyname;

-- Verificar que las funciones de aislamiento existen:
SELECT proname, prosecdef, provolatile
FROM pg_proc
WHERE proname IN ('current_user_rbd','is_admin_of_rbd','is_admin')
  AND pronamespace = 'public'::regnamespace;

-- Ver columnas clave en perfiles:
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'perfiles'
  AND column_name IN ('es_super_admin','es_demo','rbd','rol');

-- Diagnóstico de rendiciones perdidas (columna real puede ser prueba_id o evaluacion_id):
SELECT COUNT(*) AS rendiciones_sin_prueba_valida
FROM public.rendiciones r
WHERE NOT EXISTS (SELECT 1 FROM public.evaluaciones e WHERE e.id = r.prueba_id);

-- Evaluaciones sin curso:
SELECT COUNT(*) AS evaluaciones_sin_curso FROM public.evaluaciones WHERE curso_id IS NULL;

-- ============================================================
-- BLOQUE 2: CONTENCIÓN Y CIERRE ATÓMICO (CONSOLIDADO EN MIGRACIÓN 042)
-- NOTA DE AUDITORÍA: El bloque de contención fue unificado en la migración
-- 042_consolidate_rls_and_teacher_isolation.sql para garantizar atomicidad:
-- dropear políticas abiertas Y crear inmediatamente las políticas sustitutas
-- dentro del mismo BEGIN/COMMIT sin ventanas de bloqueo.
-- ============================================================
-- Para aplicar contención y aislamiento definitivo, ejecutar el archivo:
-- supabase/migrations/042_consolidate_rls_and_teacher_isolation.sql

