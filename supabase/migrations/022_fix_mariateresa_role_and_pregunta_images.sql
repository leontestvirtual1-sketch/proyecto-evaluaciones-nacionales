-- ==============================================================================
-- Migración 022: Garantizar Rol de Profesor y Metadatos para María Teresa González
-- y Asegurar URLs de Imágenes para Preguntas SIMCE Lenguaje 2° Medio
-- ==============================================================================

-- 1. Garantizar perfil de profesor para María Teresa González
UPDATE public.perfiles
SET
  rol = 'profesor',
  rbd = '31030',
  establecimiento = 'Escuela Premilitar Héroes de la Concepción',
  asignatura_id = 'asig-2',
  asignatura_nombre = 'Lenguaje y Comunicación',
  cargo = 'Docente de Lenguaje y Comunicación',
  estado = 'activo',
  updated_at = NOW()
WHERE email IN ('mariateresa.gonzalez@premil.cl', 'luis.leon@premil.cl');

-- 2. Asegurar imagen_url para la pregunta 20 de SIMCE Lenguaje 2° Medio (Figura Botánica Tejocote)
UPDATE public.preguntas
SET
  imagen_url = '/preguntas/simce_len_2m/image1.jpeg',
  updated_at = NOW()
WHERE id = 'preg-len2m-20' AND (imagen_url IS NULL OR imagen_url = '');

-- 3. Asegurar imagen_url para las demás preguntas oficiales si están vacías
UPDATE public.preguntas
SET
  imagen_url = '/preguntas/simce_len_2m_jun/image1.png',
  updated_at = NOW()
WHERE id = 'preg-len2m-jun-23' AND (imagen_url IS NULL OR imagen_url = '');
