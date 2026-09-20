-- ==============================================================================
-- Migración 050: Corrección LaTeX — Ensayo 3 SIMCE Matemática 2° Medio
-- Fecha: 2026-09-20
-- Correcciones:
--   · Q01 Alt A: $^(1/3)(a + b)$ roto → $(a + b)^{1/3}$ correcto
--   · Q02: Logaritmos sin delimitadores → $\log_{64}(4)$ etc.
--   · Q04: Radicales Unicode (⁵√, ⁶√) → $\sqrt[5]{...}$ KaTeX
--   · Q08-09: √ Unicode → $\sqrt{...}$ KaTeX
--   · Q12: Δ Unicode → $\Delta$ KaTeX
--   · Q16 Alt B: ² Unicode → ^2 LaTeX
--   · Q21: Pendientes 3/2 → $\frac{3}{2}$ KaTeX
--   · Q22 Alt C: -1/2 → $-\frac{1}{2}$ KaTeX
--   · Q23: Subscripts L₁, L₂ + fracciones → LaTeX
--   · Q25: cm² Unicode → $\text{cm}^2$ KaTeX
--   · Q26-27: π cm³/cm² Unicode → $\pi\text{cm}^3$ KaTeX
--   · Q29: · sin/cos/tan → $\cdot \sin()$ KaTeX
--   · Q30: 3/4, 3/5 plain → $\dfrac{}{}$ KaTeX
-- ==============================================================================
BEGIN;

UPDATE public.preguntas SET
  alternativas = '[
    {"letra":"A","texto":"$(a + b)^{1/3}$","es_correcta":true},
    {"letra":"B","texto":"$(a + b)^3$","es_correcta":false},
    {"letra":"C","texto":"$a^{1/3} + b^{1/3}$","es_correcta":false},
    {"letra":"D","texto":"$\\frac{1}{3}(a + b)$","es_correcta":false}
  ]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-mat2m-e3-01';

UPDATE public.preguntas SET
  alternativas = '[
    {"letra":"A","texto":"$\\log_{64}(4) = \\frac{1}{3}$","es_correcta":true},
    {"letra":"B","texto":"$\\log_{64}(3) = 4$","es_correcta":false},
    {"letra":"C","texto":"$\\log_4(8) = \\frac{1}{3}$","es_correcta":false},
    {"letra":"D","texto":"$\\log_4\\!\\left(\\frac{1}{3}\\right) = 64$","es_correcta":false}
  ]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-mat2m-e3-02';

UPDATE public.preguntas SET
  alternativas = '[
    {"letra":"A","texto":"$\\sqrt[5]{3}$","es_correcta":false},
    {"letra":"B","texto":"$\\sqrt[5]{3^2}$","es_correcta":false},
    {"letra":"C","texto":"$\\sqrt[6]{3^5}$","es_correcta":true},
    {"letra":"D","texto":"$\\sqrt[6]{3^6}$","es_correcta":false}
  ]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-mat2m-e3-04';

UPDATE public.preguntas SET
  alternativas = '[
    {"letra":"A","texto":"$\\sqrt{x + 9} = \\sqrt{x} + 3$","es_correcta":false},
    {"letra":"B","texto":"$\\sqrt{9x} = 3\\sqrt{x}$","es_correcta":true},
    {"letra":"C","texto":"$(\\sqrt{x} + 3)^2 = x + 9$","es_correcta":false},
    {"letra":"D","texto":"$\\sqrt{x^2 + y^2} = x + y$","es_correcta":false}
  ]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-mat2m-e3-08';

UPDATE public.preguntas SET
  alternativas = '[
    {"letra":"A","texto":"$2\\sqrt{3}$","es_correcta":true},
    {"letra":"B","texto":"$3\\sqrt{3}$","es_correcta":false},
    {"letra":"C","texto":"$6\\sqrt{3}$","es_correcta":false},
    {"letra":"D","texto":"$2$","es_correcta":false}
  ]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-mat2m-e3-09';

UPDATE public.preguntas SET
  alternativas = '[
    {"letra":"A","texto":"$\\Delta = -24$, no tiene soluciones reales.","es_correcta":true},
    {"letra":"B","texto":"$\\Delta = 56$, tiene dos soluciones reales distintas.","es_correcta":false},
    {"letra":"C","texto":"$\\Delta = 0$, tiene una única solución real.","es_correcta":false},
    {"letra":"D","texto":"$\\Delta = -4$, no tiene soluciones reales.","es_correcta":false}
  ]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-mat2m-e3-12';

UPDATE public.preguntas SET
  alternativas = '[
    {"letra":"A","texto":"$(2x - 3y)(2x + 3y)$","es_correcta":true},
    {"letra":"B","texto":"$(2x - 3y)^2$","es_correcta":false},
    {"letra":"C","texto":"$(4x - 9y)(x + y)$","es_correcta":false},
    {"letra":"D","texto":"$2(x - 3y)(x + 3y)$","es_correcta":false}
  ]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-mat2m-e3-16';

UPDATE public.preguntas SET
  alternativas = '[
    {"letra":"A","texto":"$m = \\frac{3}{2}$, $n = 3$","es_correcta":true},
    {"letra":"B","texto":"$m = -\\frac{3}{2}$, $n = -3$","es_correcta":false},
    {"letra":"C","texto":"$m = 3$, $n = 6$","es_correcta":false},
    {"letra":"D","texto":"$m = \\frac{2}{3}$, $n = -3$","es_correcta":false}
  ]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-mat2m-e3-21';

UPDATE public.preguntas SET
  alternativas = '[
    {"letra":"A","texto":"$y = -2x + 4$","es_correcta":true},
    {"letra":"B","texto":"$y = 2x + 4$","es_correcta":false},
    {"letra":"C","texto":"$y = -\\frac{1}{2}x + 2$","es_correcta":false},
    {"letra":"D","texto":"$y = 2x - 4$","es_correcta":false}
  ]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-mat2m-e3-22';

UPDATE public.preguntas SET
  alternativas = '[
    {"letra":"A","texto":"$L_1: y = 2x + 1\\quad$ y $\\quad L_2: y = -\\frac{1}{2}x + 5$","es_correcta":true},
    {"letra":"B","texto":"$L_1: y = 3x - 2\\quad$ y $\\quad L_2: y = 3x + 4$","es_correcta":false},
    {"letra":"C","texto":"$L_1: y = -4x + 1\\quad$ y $\\quad L_2: y = 4x - 1$","es_correcta":false},
    {"letra":"D","texto":"$L_1: y = \\frac{1}{3}x\\quad$ y $\\quad L_2: y = 3x$","es_correcta":false}
  ]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-mat2m-e3-23';

UPDATE public.preguntas SET
  alternativas = '[
    {"letra":"A","texto":"$108\\text{ cm}^2$","es_correcta":true},
    {"letra":"B","texto":"$36\\text{ cm}^2$","es_correcta":false},
    {"letra":"C","texto":"$72\\text{ cm}^2$","es_correcta":false},
    {"letra":"D","texto":"$144\\text{ cm}^2$","es_correcta":false}
  ]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-mat2m-e3-25';

UPDATE public.preguntas SET
  alternativas = '[
    {"letra":"A","texto":"$30\\pi\\text{ cm}^3$","es_correcta":true},
    {"letra":"B","texto":"$90\\pi\\text{ cm}^3$","es_correcta":false},
    {"letra":"C","texto":"$45\\pi\\text{ cm}^3$","es_correcta":false},
    {"letra":"D","texto":"$15\\pi\\text{ cm}^3$","es_correcta":false}
  ]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-mat2m-e3-26';

UPDATE public.preguntas SET
  alternativas = '[
    {"letra":"A","texto":"$5\\pi\\text{ cm}^2$","es_correcta":true},
    {"letra":"B","texto":"$10\\pi\\text{ cm}^2$","es_correcta":false},
    {"letra":"C","texto":"$2{,}5\\pi\\text{ cm}^2$","es_correcta":false},
    {"letra":"D","texto":"$25\\pi\\text{ cm}^2$","es_correcta":false}
  ]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-mat2m-e3-27';

UPDATE public.preguntas SET
  alternativas = '[
    {"letra":"A","texto":"$h = 50 \\cdot \\sin(30°)$","es_correcta":true},
    {"letra":"B","texto":"$h = \\dfrac{50}{\\cos(30°)}$","es_correcta":false},
    {"letra":"C","texto":"$h = 50 \\cdot \\tan(30°)$","es_correcta":false},
    {"letra":"D","texto":"$h = 50 \\cdot \\cos(30°)$","es_correcta":false}
  ]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-mat2m-e3-29';

UPDATE public.preguntas SET
  alternativas = '[
    {"letra":"A","texto":"$\\dfrac{3}{4}$","es_correcta":true},
    {"letra":"B","texto":"$\\dfrac{3}{5}$","es_correcta":false},
    {"letra":"C","texto":"$\\dfrac{4}{3}$","es_correcta":false},
    {"letra":"D","texto":"$\\dfrac{5}{4}$","es_correcta":false}
  ]'::jsonb,
  updated_at = NOW()
WHERE id = 'preg-mat2m-e3-30';

COMMIT;
