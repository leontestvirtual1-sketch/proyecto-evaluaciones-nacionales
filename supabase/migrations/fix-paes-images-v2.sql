-- 🎓 SQL DE REPARACIÓN INTEGRAL V2 - PAES MATEMÁTICA 1 2023 (FORMA 113)
-- Ejecutar en el Editor SQL de Supabase (Supabase Dashboard -> SQL Editor) para reparar las imágenes desalineadas o faltantes.
-- Este archivo es de entrega final e idempotente.

BEGIN;

-- 1. Pregunta 17 (Los cuadrados congruentes - corrige mapeo de cajas erróneo)
UPDATE public.preguntas
SET 
  imagen_url = 'https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/p17_img_1.png',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-17';

-- 2. Pregunta 21 (Los gráficos de proporcionalidad directa - agrega gráfico faltante)
UPDATE public.preguntas
SET 
  imagen_url = 'https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/preg_21.png',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-21';

-- 3. Pregunta 23 (El volumen del paralelepípedo - agrega diagrama 3D faltante)
UPDATE public.preguntas
SET 
  imagen_url = 'https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/preg_23.png',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-23';

-- 4. Pregunta 26 (El estiramiento del resorte - Ley de Hooke - agrega diagrama de resortes faltante)
UPDATE public.preguntas
SET 
  imagen_url = 'https://khtdzgfqjggycrcbrytw.supabase.co/storage/v1/object/public/evaluaciones-media/paes_mat1_2023_forma113/preg_26.png',
  updated_at = NOW()
WHERE id = 'preg-paes-m1-23-26';

COMMIT;

-- 🔍 Consulta de verificación para auditar la reparación:
-- SELECT id, enunciado, imagen_url FROM public.preguntas WHERE id IN ('preg-paes-m1-23-17', 'preg-paes-m1-23-21', 'preg-paes-m1-23-23', 'preg-paes-m1-23-26');
