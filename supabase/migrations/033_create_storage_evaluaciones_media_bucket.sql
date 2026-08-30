-- ==============================================================================
-- Migración 033: Creación de Bucket de Supabase Storage para Imágenes de Evaluaciones
-- Bucket: evaluaciones-media (Público)
-- ==============================================================================

-- 1. Crear el bucket en storage.buckets si no existe
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'evaluaciones-media',
  'evaluaciones-media',
  true,
  10485760, -- 10MB límite por archivo
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];

-- 2. Políticas RLS para storage.objects
-- Permitir lectura pública (SELECT) para visualización en cuadernillos, pruebas online y catálogo
DROP POLICY IF EXISTS "Lectura pública de imágenes de evaluaciones" ON storage.objects;
CREATE POLICY "Lectura pública de imágenes de evaluaciones"
ON storage.objects FOR SELECT
USING (bucket_id = 'evaluaciones-media');

-- Permitir subida (INSERT) a usuarios autenticados (profesores, UTP, admins) y service_role
DROP POLICY IF EXISTS "Subida de imágenes de evaluaciones para usuarios autenticados" ON storage.objects;
CREATE POLICY "Subida de imágenes de evaluaciones para usuarios autenticados"
ON storage.objects FOR INSERT
TO authenticated, service_role
WITH CHECK (bucket_id = 'evaluaciones-media');

-- Permitir actualización (UPDATE) a usuarios autenticados y service_role
DROP POLICY IF EXISTS "Actualización de imágenes de evaluaciones para usuarios autenticados" ON storage.objects;
CREATE POLICY "Actualización de imágenes de evaluaciones para usuarios autenticados"
ON storage.objects FOR UPDATE
TO authenticated, service_role
USING (bucket_id = 'evaluaciones-media');

-- Permitir eliminación (DELETE) a usuarios autenticados y service_role
DROP POLICY IF EXISTS "Eliminación de imágenes de evaluaciones para administradores" ON storage.objects;
CREATE POLICY "Eliminación de imágenes de evaluaciones para administradores"
ON storage.objects FOR DELETE
TO authenticated, service_role
USING (bucket_id = 'evaluaciones-media');

-- 3. Función auxiliar para normalizar rutas de imágenes a Storage URL
-- Si una imagen comienza con /preguntas/, se puede servir directamente desde el bucket
-- o mantenerse compatible con el frontend mediante el CDN de Supabase.
COMMENT ON TABLE storage.buckets IS 'Buckets de almacenamiento de activos multimedia de Sysget Saber';
