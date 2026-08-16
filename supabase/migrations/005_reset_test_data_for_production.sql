-- ============================================================
-- Sysget Saber — Script de Limpieza para Pase a Producción Real
-- Permite borrar datos de prueba manteniendo intacta tu cuenta Super-Admin
-- Ejecutar en Supabase SQL Editor cuando quieras iniciar en limpio.
-- ============================================================

BEGIN;

-- 1. Eliminar respuestas y rendiciones de prueba
DELETE FROM public.rendiciones;

-- 2. Eliminar evaluaciones creadas durante la fase de prueba (opcional)
-- DELETE FROM public.pruebas WHERE profesor_id != 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99';

-- 3. Eliminar alumnos de prueba
DELETE FROM public.alumnos WHERE email LIKE '%@demo.cl' OR email LIKE '%@escuelademo.cl';

-- 4. Eliminar usuarios temporales de prueba dejando intacto al Super Admin
DELETE FROM public.perfiles
WHERE email NOT IN ('leontesvirtual1@gmail.com', 'luis_leon_g@hotmail.com');

-- 5. Eliminar usuarios de Auth de prueba
DELETE FROM auth.users
WHERE email NOT IN ('leontesvirtual1@gmail.com', 'luis_leon_g@hotmail.com');

COMMIT;

-- Confirmación
SELECT 'Base de datos de producción limpia. Super Admin conservado exitosamente.' AS resultado;
