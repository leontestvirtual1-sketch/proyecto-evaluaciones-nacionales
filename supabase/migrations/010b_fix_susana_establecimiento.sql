-- ============================================================
-- Fix urgente: Completar perfil de Susana Angélica
-- Asignar establecimiento y RBD para que aparezca en el Sidebar
-- ============================================================

UPDATE public.perfiles
SET
  nombre             = 'Susana Angélica',
  apellido           = 'Pizarro Valenzuela',
  apellido_paterno   = 'Pizarro',
  apellido_materno   = 'Valenzuela',
  establecimiento    = 'Colegio Mi Casa',
  rbd                = '99999',
  asignatura_id      = 'asig-1',
  asignatura_nombre  = 'Matemática',
  cargo              = 'Docente de Matemática',
  estado             = 'activo',
  activo             = true,
  plan               = 'trial'
WHERE email = 'nentitasusana@hotmail.com';

-- Verificar resultado
SELECT id, nombre, apellido, email, rol, establecimiento, rbd, estado
FROM public.perfiles
WHERE email = 'nentitasusana@hotmail.com';
