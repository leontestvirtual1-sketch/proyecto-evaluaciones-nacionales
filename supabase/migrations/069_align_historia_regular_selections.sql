--
-- Migración 069: Alineación de Historia Regular 2025 y 2026 con la Selección Oficial DEMRE de 45 preguntas
-- Remueve los 40 ítems artificiales no liberados por DEMRE para garantizar integridad pedagógica
--
BEGIN;

UPDATE public.evaluaciones
SET total_preguntas = 45,
    pregunta_ids = '["preg-paes-his-25reg-01","preg-paes-his-25reg-02","preg-paes-his-25reg-03","preg-paes-his-25reg-05","preg-paes-his-25reg-06","preg-paes-his-25reg-07","preg-paes-his-25reg-08","preg-paes-his-25reg-10","preg-paes-his-25reg-11","preg-paes-his-25reg-12","preg-paes-his-25reg-13","preg-paes-his-25reg-15","preg-paes-his-25reg-16","preg-paes-his-25reg-17","preg-paes-his-25reg-18","preg-paes-his-25reg-24","preg-paes-his-25reg-25","preg-paes-his-25reg-26","preg-paes-his-25reg-27","preg-paes-his-25reg-29","preg-paes-his-25reg-30","preg-paes-his-25reg-32","preg-paes-his-25reg-33","preg-paes-his-25reg-34","preg-paes-his-25reg-35","preg-paes-his-25reg-38","preg-paes-his-25reg-39","preg-paes-his-25reg-42","preg-paes-his-25reg-44","preg-paes-his-25reg-45","preg-paes-his-25reg-46","preg-paes-his-25reg-47","preg-paes-his-25reg-48","preg-paes-his-25reg-49","preg-paes-his-25reg-52","preg-paes-his-25reg-53","preg-paes-his-25reg-55","preg-paes-his-25reg-56","preg-paes-his-25reg-58","preg-paes-his-25reg-59","preg-paes-his-25reg-60","preg-paes-his-25reg-61","preg-paes-his-25reg-62","preg-paes-his-25reg-64","preg-paes-his-25reg-65"]'::jsonb,
    titulo = 'PAES Oficial Historia y Ciencias Sociales — Proceso 2025 (Selección Oficial Forma 103 — Regular)'
WHERE id = 'eval-paes-his-2025-reg-f103';

UPDATE public.evaluaciones
SET total_preguntas = 45,
    pregunta_ids = '["preg-paes-his-26reg-01","preg-paes-his-26reg-02","preg-paes-his-26reg-03","preg-paes-his-26reg-04","preg-paes-his-26reg-06","preg-paes-his-26reg-07","preg-paes-his-26reg-08","preg-paes-his-26reg-09","preg-paes-his-26reg-10","preg-paes-his-26reg-11","preg-paes-his-26reg-12","preg-paes-his-26reg-13","preg-paes-his-26reg-14","preg-paes-his-26reg-15","preg-paes-his-26reg-16","preg-paes-his-26reg-17","preg-paes-his-26reg-20","preg-paes-his-26reg-21","preg-paes-his-26reg-23","preg-paes-his-26reg-24","preg-paes-his-26reg-27","preg-paes-his-26reg-28","preg-paes-his-26reg-30","preg-paes-his-26reg-32","preg-paes-his-26reg-35","preg-paes-his-26reg-36","preg-paes-his-26reg-37","preg-paes-his-26reg-40","preg-paes-his-26reg-42","preg-paes-his-26reg-43","preg-paes-his-26reg-45","preg-paes-his-26reg-46","preg-paes-his-26reg-47","preg-paes-his-26reg-48","preg-paes-his-26reg-50","preg-paes-his-26reg-52","preg-paes-his-26reg-53","preg-paes-his-26reg-55","preg-paes-his-26reg-56","preg-paes-his-26reg-58","preg-paes-his-26reg-59","preg-paes-his-26reg-60","preg-paes-his-26reg-62","preg-paes-his-26reg-63","preg-paes-his-26reg-64"]'::jsonb,
    titulo = 'PAES Oficial Historia y Ciencias Sociales — Proceso 2026 (Selección Oficial Forma 103 — Regular)'
WHERE id = 'eval-paes-his-2026-reg-f103';

DELETE FROM public.preguntas WHERE id IN ('preg-paes-his-25reg-04', 'preg-paes-his-25reg-09', 'preg-paes-his-25reg-14', 'preg-paes-his-25reg-19', 'preg-paes-his-25reg-20', 'preg-paes-his-25reg-21', 'preg-paes-his-25reg-22', 'preg-paes-his-25reg-23', 'preg-paes-his-25reg-28', 'preg-paes-his-25reg-31', 'preg-paes-his-25reg-36', 'preg-paes-his-25reg-37', 'preg-paes-his-25reg-40', 'preg-paes-his-25reg-41', 'preg-paes-his-25reg-43', 'preg-paes-his-25reg-50', 'preg-paes-his-25reg-51', 'preg-paes-his-25reg-54', 'preg-paes-his-25reg-57', 'preg-paes-his-25reg-63', 'preg-paes-his-26reg-05', 'preg-paes-his-26reg-18', 'preg-paes-his-26reg-19', 'preg-paes-his-26reg-22', 'preg-paes-his-26reg-25', 'preg-paes-his-26reg-26', 'preg-paes-his-26reg-29', 'preg-paes-his-26reg-31', 'preg-paes-his-26reg-33', 'preg-paes-his-26reg-34', 'preg-paes-his-26reg-38', 'preg-paes-his-26reg-39', 'preg-paes-his-26reg-41', 'preg-paes-his-26reg-44', 'preg-paes-his-26reg-49', 'preg-paes-his-26reg-51', 'preg-paes-his-26reg-54', 'preg-paes-his-26reg-57', 'preg-paes-his-26reg-61', 'preg-paes-his-26reg-65');

COMMIT;
