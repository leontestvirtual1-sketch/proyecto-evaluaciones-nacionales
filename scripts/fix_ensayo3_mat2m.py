import sys
from supabase import create_client
import json

sys.stdout.reconfigure(encoding='utf-8')

env = {}
with open('.env.local', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if '=' in line and not line.startswith('#'):
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip().strip("'\"")

sb = create_client(env['VITE_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY'])

# ============================================================
# FIX CATALOG: Ensayo 3 SIMCE Matemática 2° Medio
# Corrección de:
# 1. Notación matemática LaTeX en alternativas
# 2. Caracteres extraños / fracciones sin delimitadores
# 3. Superíndices unicode → LaTeX oficial
# ============================================================

fixes = {}

# ── PREGUNTA 01 ─────────────────────────────────────────────
# Alt A: "$^(1/3)(a + b)$" → "$(a + b)^{1/3}$"
# Alts B, C, D: expresiones sin LaTeX → con LaTeX
fixes['preg-mat2m-e3-01'] = {
    'alternativas': [
        {'letra': 'A', 'texto': '$(a + b)^{1/3}$', 'es_correcta': True},
        {'letra': 'B', 'texto': '$(a + b)^3$', 'es_correcta': False},
        {'letra': 'C', 'texto': '$a^{1/3} + b^{1/3}$', 'es_correcta': False},
        {'letra': 'D', 'texto': '$\\frac{1}{3}(a + b)$', 'es_correcta': False},
    ]
}

# ── PREGUNTA 02 ─────────────────────────────────────────────
# "log_64(4) = 1/3" → LaTeX correcto con subscripts y fracciones
fixes['preg-mat2m-e3-02'] = {
    'alternativas': [
        {'letra': 'A', 'texto': '$\\log_{64}(4) = \\frac{1}{3}$', 'es_correcta': True},
        {'letra': 'B', 'texto': '$\\log_{64}(3) = 4$', 'es_correcta': False},
        {'letra': 'C', 'texto': '$\\log_4(8) = \\frac{1}{3}$', 'es_correcta': False},
        {'letra': 'D', 'texto': '$\\log_4\\!\\left(\\frac{1}{3}\\right) = 64$', 'es_correcta': False},
    ]
}

# ── PREGUNTA 04 ─────────────────────────────────────────────
# Radicales con superíndices Unicode → LaTeX KaTeX
fixes['preg-mat2m-e3-04'] = {
    'alternativas': [
        {'letra': 'A', 'texto': '$\\sqrt[5]{3}$', 'es_correcta': False},
        {'letra': 'B', 'texto': '$\\sqrt[5]{3^2}$', 'es_correcta': False},
        {'letra': 'C', 'texto': '$\\sqrt[6]{3^5}$', 'es_correcta': True},
        {'letra': 'D', 'texto': '$\\sqrt[6]{3^6}$', 'es_correcta': False},
    ]
}

# ── PREGUNTA 08 ─────────────────────────────────────────────
# Radicales Unicode → LaTeX
fixes['preg-mat2m-e3-08'] = {
    'alternativas': [
        {'letra': 'A', 'texto': '$\\sqrt{x + 9} = \\sqrt{x} + 3$', 'es_correcta': False},
        {'letra': 'B', 'texto': '$\\sqrt{9x} = 3\\sqrt{x}$', 'es_correcta': True},
        {'letra': 'C', 'texto': '$(\\sqrt{x} + 3)^2 = x + 9$', 'es_correcta': False},
        {'letra': 'D', 'texto': '$\\sqrt{x^2 + y^2} = x + y$', 'es_correcta': False},
    ]
}

# ── PREGUNTA 09 ─────────────────────────────────────────────
# "2√3" → LaTeX
fixes['preg-mat2m-e3-09'] = {
    'alternativas': [
        {'letra': 'A', 'texto': '$2\\sqrt{3}$', 'es_correcta': True},
        {'letra': 'B', 'texto': '$3\\sqrt{3}$', 'es_correcta': False},
        {'letra': 'C', 'texto': '$6\\sqrt{3}$', 'es_correcta': False},
        {'letra': 'D', 'texto': '$2$', 'es_correcta': False},
    ]
}

# ── PREGUNTA 12 ─────────────────────────────────────────────
# Δ Unicode → $\Delta$ LaTeX
fixes['preg-mat2m-e3-12'] = {
    'alternativas': [
        {'letra': 'A', 'texto': '$\\Delta = -24$, no tiene soluciones reales.', 'es_correcta': True},
        {'letra': 'B', 'texto': '$\\Delta = 56$, tiene dos soluciones reales distintas.', 'es_correcta': False},
        {'letra': 'C', 'texto': '$\\Delta = 0$, tiene una única solución real.', 'es_correcta': False},
        {'letra': 'D', 'texto': '$\\Delta = -4$, no tiene soluciones reales.', 'es_correcta': False},
    ]
}

# ── PREGUNTA 16 ─────────────────────────────────────────────
# Alt B: "(2x - 3y)²" → LaTeX
fixes['preg-mat2m-e3-16'] = {
    'alternativas': [
        {'letra': 'A', 'texto': '$(2x - 3y)(2x + 3y)$', 'es_correcta': True},
        {'letra': 'B', 'texto': '$(2x - 3y)^2$', 'es_correcta': False},
        {'letra': 'C', 'texto': '$(4x - 9y)(x + y)$', 'es_correcta': False},
        {'letra': 'D', 'texto': '$2(x - 3y)(x + 3y)$', 'es_correcta': False},
    ]
}

# ── PREGUNTA 21 ─────────────────────────────────────────────
# "m = 3/2" → LaTeX
fixes['preg-mat2m-e3-21'] = {
    'alternativas': [
        {'letra': 'A', 'texto': '$m = \\frac{3}{2}$, $n = 3$', 'es_correcta': True},
        {'letra': 'B', 'texto': '$m = -\\frac{3}{2}$, $n = -3$', 'es_correcta': False},
        {'letra': 'C', 'texto': '$m = 3$, $n = 6$', 'es_correcta': False},
        {'letra': 'D', 'texto': '$m = \\frac{2}{3}$, $n = -3$', 'es_correcta': False},
    ]
}

# ── PREGUNTA 22 ─────────────────────────────────────────────
# Alt C: "y = -1/2 x + 2" → LaTeX
fixes['preg-mat2m-e3-22'] = {
    'alternativas': [
        {'letra': 'A', 'texto': '$y = -2x + 4$', 'es_correcta': True},
        {'letra': 'B', 'texto': '$y = 2x + 4$', 'es_correcta': False},
        {'letra': 'C', 'texto': '$y = -\\frac{1}{2}x + 2$', 'es_correcta': False},
        {'letra': 'D', 'texto': '$y = 2x - 4$', 'es_correcta': False},
    ]
}

# ── PREGUNTA 23 ─────────────────────────────────────────────
# Subscripts Unicode L₁, L₂ + fracciones → LaTeX
fixes['preg-mat2m-e3-23'] = {
    'alternativas': [
        {'letra': 'A', 'texto': '$L_1: y = 2x + 1\\quad$ y $\\quad L_2: y = -\\frac{1}{2}x + 5$', 'es_correcta': True},
        {'letra': 'B', 'texto': '$L_1: y = 3x - 2\\quad$ y $\\quad L_2: y = 3x + 4$', 'es_correcta': False},
        {'letra': 'C', 'texto': '$L_1: y = -4x + 1\\quad$ y $\\quad L_2: y = 4x - 1$', 'es_correcta': False},
        {'letra': 'D', 'texto': '$L_1: y = \\frac{1}{3}x\\quad$ y $\\quad L_2: y = 3x$', 'es_correcta': False},
    ]
}

# ── PREGUNTA 25 ─────────────────────────────────────────────
# "cm²" Unicode → LaTeX
fixes['preg-mat2m-e3-25'] = {
    'alternativas': [
        {'letra': 'A', 'texto': '$108\\text{ cm}^2$', 'es_correcta': True},
        {'letra': 'B', 'texto': '$36\\text{ cm}^2$', 'es_correcta': False},
        {'letra': 'C', 'texto': '$72\\text{ cm}^2$', 'es_correcta': False},
        {'letra': 'D', 'texto': '$144\\text{ cm}^2$', 'es_correcta': False},
    ]
}

# ── PREGUNTA 26 ─────────────────────────────────────────────
# "30π cm³" Unicode → LaTeX
fixes['preg-mat2m-e3-26'] = {
    'alternativas': [
        {'letra': 'A', 'texto': '$30\\pi\\text{ cm}^3$', 'es_correcta': True},
        {'letra': 'B', 'texto': '$90\\pi\\text{ cm}^3$', 'es_correcta': False},
        {'letra': 'C', 'texto': '$45\\pi\\text{ cm}^3$', 'es_correcta': False},
        {'letra': 'D', 'texto': '$15\\pi\\text{ cm}^3$', 'es_correcta': False},
    ]
}

# ── PREGUNTA 27 ─────────────────────────────────────────────
# "5π cm²" Unicode → LaTeX
fixes['preg-mat2m-e3-27'] = {
    'alternativas': [
        {'letra': 'A', 'texto': '$5\\pi\\text{ cm}^2$', 'es_correcta': True},
        {'letra': 'B', 'texto': '$10\\pi\\text{ cm}^2$', 'es_correcta': False},
        {'letra': 'C', 'texto': '$2{,}5\\pi\\text{ cm}^2$', 'es_correcta': False},
        {'letra': 'D', 'texto': '$25\\pi\\text{ cm}^2$', 'es_correcta': False},
    ]
}

# ── PREGUNTA 29 ─────────────────────────────────────────────
# Alternativas con punto medio · y fracciones trigonométricas → LaTeX
fixes['preg-mat2m-e3-29'] = {
    'alternativas': [
        {'letra': 'A', 'texto': '$h = 50 \\cdot \\sin(30°)$', 'es_correcta': True},
        {'letra': 'B', 'texto': '$h = \\dfrac{50}{\\cos(30°)}$', 'es_correcta': False},
        {'letra': 'C', 'texto': '$h = 50 \\cdot \\tan(30°)$', 'es_correcta': False},
        {'letra': 'D', 'texto': '$h = 50 \\cdot \\cos(30°)$', 'es_correcta': False},
    ]
}

# ── PREGUNTA 30 ─────────────────────────────────────────────
# Fracciones simples → LaTeX
fixes['preg-mat2m-e3-30'] = {
    'alternativas': [
        {'letra': 'A', 'texto': '$\\dfrac{3}{4}$', 'es_correcta': True},
        {'letra': 'B', 'texto': '$\\dfrac{3}{5}$', 'es_correcta': False},
        {'letra': 'C', 'texto': '$\\dfrac{4}{3}$', 'es_correcta': False},
        {'letra': 'D', 'texto': '$\\dfrac{5}{4}$', 'es_correcta': False},
    ]
}

# ── EJECUTAR ACTUALIZACIONES ─────────────────────────────────
for q_id, q_data in fixes.items():
    update_payload = {'updated_at': 'now()'}
    if 'alternativas' in q_data:
        update_payload['alternativas'] = q_data['alternativas']
    if 'enunciado' in q_data:
        update_payload['enunciado'] = q_data['enunciado']
    
    result = sb.from_('preguntas').update(update_payload).eq('id', q_id).execute()
    if hasattr(result, 'data') and result.data:
        print(f"✅ {q_id}: actualizado ({len(update_payload)-1} campos)")
    else:
        print(f"❌ {q_id}: sin respuesta de datos (verificar manualmente)")

print("\n✅ Corrección Ensayo 3 SIMCE Matemática 2° Medio completada.")
