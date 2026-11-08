-- Migración 067: Corrección ortográfica y editorial de Historia 2023 Regular (P19 y P22)
-- Corrige pérdida de letras/tildes en P19 y puntuación/guion en P22
-- Fecha: 2026-11-08T02:21:25.328Z

UPDATE public.preguntas SET enunciado = '**19. Durante la primera mitad del siglo XIX, Chile como país independiente debió organizar la naciente República, lo que implicó grandes desafíos en pos de la conformación del Estado-nación. ¿Qué estrategia se implementó para llevar a cabo este proceso?**' WHERE id = 'preg-paes-his-23reg-19';
UPDATE public.preguntas SET enunciado = '**22. El triunfo del ejército chileno en el conflicto contra la Confederación Perú-Boliviana (1836-1839) tuvo un significado importante en la consolidación del incipiente Estado-nación. En ese contexto, la victoria fue relevante para Chile, porque**' WHERE id = 'preg-paes-his-23reg-22';
