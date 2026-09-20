import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("scratch/supabase_mat2m_e3_current.json", "r", encoding="utf-8") as f:
    questions = json.load(f)

for q in questions:
    qid = q['id']
    enunciado = q['enunciado']
    alts = q['alternativas']
    rc = q['respuesta_correcta']
    img = q.get('imagen_url')
    
    corr_alts = [a['letra'] for a in alts if a.get('es_correcta')]
    mismatch = (corr_alts != [rc])
    
    print(f"ID: {qid} | RC: {rc} | Alts Correctas: {corr_alts} | Mismatch: {mismatch}")
    for a in alts:
        txt = a['texto']
        suspicious = []
        if any(c in txt for c in ['⁵', '⁶', '²', '³', '√', 'π', 'ℕ', 'ℚ', '𝕀', 'ℤ', 'Δ', '₁', '₂']):
            suspicious.append("unicode_math")
        if "^" in txt and "$" not in txt:
            suspicious.append("caret_no_math")
        if "_" in txt and "$" not in txt:
            suspicious.append("underscore_no_math")
        if "$^" in txt:
            suspicious.append("broken_math_power")
        if "/" in txt and "$" not in txt and not txt.startswith("http"):
            suspicious.append("slash_fraction_no_math")
        if suspicious:
            print(f"   [{a['letra']}]: '{txt}' -> {suspicious}")
