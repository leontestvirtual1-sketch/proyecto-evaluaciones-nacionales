import os
import sys
import re
import json
import pdfplumber
from supabase import create_client

sys.stdout.reconfigure(encoding='utf-8')

# 1. Load env
env_path = '.env.local'
env = {}
with open(env_path, 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        if '=' in line:
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip().strip("'\"")

supabase = create_client(env['VITE_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY'])

# 2. Claves oficiales DEMRE de la pauta docente
claves_oficiales = {
    1:'B', 2:'A', 3:'C', 4:'A', 5:'C', 6:'D', 7:'D', 8:'A', 9:'D', 10:'C',
    11:'A', 12:'D', 13:'C', 14:'B', 15:'C', 16:'A', 17:'C', 18:'D', 19:'B', 20:'C',
    21:'A', 22:'B', 23:'D', 24:'D', 25:'A', 26:'B', 27:'C', 28:'D', 29:'A', 30:'D',
    31:'A', 32:'A', 33:'C', 34:'B', 35:'C', 36:'B', 37:'B', 38:'B', 39:'D', 40:'C',
    41:'C', 42:'C', 43:'B', 44:'C', 45:'A', 46:'B', 47:'C', 48:'B', 49:'D', 50:'B',
    51:'B', 52:'B', 53:'D', 54:'B', 55:'A', 56:'D', 57:'B', 58:'D', 59:'D', 60:'C',
    61:'A', 62:'B', 63:'A', 64:'C', 65:'B'
}

# 3. Read current records from Supabase
res = supabase.from_('preguntas').select('*').like('id', 'preg-paes-m1-23-%').order('id').execute()
current_records = {int(r['id'].replace('preg-paes-m1-23-', '')): r for r in res.data}
print(f'Loaded {len(current_records)} current records from Supabase.')

# 4. Clean function for text
def clean_general_text(txt):
    if not txt:
        return ''
    # Remove watermarks
    txt = re.sub(r'FORMA\s*113\s*[-–—▌|│]?\s*2023', '', txt, flags=re.I)
    txt = re.sub(r'FORMA\s*113', '', txt, flags=re.I)
    txt = re.sub(r'-\s*\d+\s*-', '', txt) # page numbers
    
    # Fix inverted currency: "000 120" -> "$120.000", "000 240 $" -> "$240.000"
    txt = re.sub(r'000\s*(\d{1,3})\s*\$?', r'$\1.000', txt)
    txt = re.sub(r'\$\s*(\d{1,3})\s*000(?!\d)', r'$\1.000', txt)
    txt = re.sub(r'(\d{1,3})\s*000\s*\$', r'$\1.000', txt)
    
    # Fix Chilean numbers without dot: "$120000" -> "$120.000", "$25000" -> "$25.000", "$240000" -> "$240.000"
    txt = re.sub(r'\$(\d{1,3})(\d{3})(?!\d)', r'$\1.\2', txt)
    
    # Fix inverted decimals: "25 ,1" -> "1,25", "75 ,0" -> "0,75"
    txt = re.sub(r'(\d{2})\s*,\s*(\d)\b', r'\2,\1', txt)
    
    # Fix inverted percentages: "% 25" -> "25%", "% 40" -> "40%", "% 15" -> "15%"
    txt = re.sub(r'%\s*(\d+)', r'\1%', txt)
    
    # Fix inverted units: "m 15" -> "15 m", "m 5,1" -> "1,5 m", "L 360" -> "360 L", "m 20" -> "20 m", "cm 3" -> "3 cm", "cm 9" -> "9 cm"
    txt = re.sub(r'\b([Lmc]m?)\s+(\d+(?:,\d+)?)', r'\2 \1', txt)
    
    # Fix common glued words
    txt = txt.replace('porcuatrohoras', 'por cuatro horas')
    txt = txt.replace('más00025', 'más $25.000')
    txt = txt.replace('mas00025', 'más $25.000')
    
    return txt.strip()

# Apply sanitation across all 65 questions
updates = []
for num, row in sorted(current_records.items()):
    clave = claves_oficiales.get(num, row.get('respuesta_correcta', 'A'))
    old_enunciado = row.get('enunciado', '')
    old_alts = row.get('alternativas', [])
    
    # Clean enunciado
    new_enunciado = clean_general_text(old_enunciado)
    
    # Clean alternativas
    new_alts = []
    for a in old_alts:
        letra = a.get('letra', '')
        texto = clean_general_text(a.get('texto', ''))
        es_correcta = (letra == clave)
        new_alts.append({
            'letra': letra,
            'texto': texto,
            'es_correcta': es_correcta
        })
    
    # Specific targeted manual overrides for Q1, Q2, Q5, Q6, Q9, Q12 to be 100% textbook perfect:
    if num == 1:
        new_enunciado = (
            "Por el arriendo de un juego inflable se cobra una cuota fija de $120.000 por cuatro horas, "
            "más $25.000 por cada hora adicional.\n\n"
            "¿Cuántas horas como máximo puede arrendar una empresa el juego inflable si tiene un presupuesto "
            "de $240.000 para este efecto?"
        )
        new_alts = [
            {"letra": "A", "texto": "4", "es_correcta": False},
            {"letra": "B", "texto": "8", "es_correcta": True},
            {"letra": "C", "texto": "9", "es_correcta": False},
            {"letra": "D", "texto": "10", "es_correcta": False}
        ]
    elif num == 2:
        new_enunciado = (
            "Considera el número $p$ distinto de cero que es multiplicado dos veces por $1{,}25$ "
            "y luego, dos veces por $0{,}75$, tal como se representa a continuación:\n\n"
            "$$p \\cdot 1{,}25 \\cdot 1{,}25 \\cdot 0{,}75 \\cdot 0{,}75$$\n\n"
            "¿Qué pueden representar dichas multiplicaciones, respecto del número original $p$?"
        )
        new_alts = [
            {"letra": "A", "texto": "Que hubo dos aumentos del 25% y luego, dos disminuciones del 25%.", "es_correcta": True},
            {"letra": "B", "texto": "Que no hubo aumento de $p$ ni disminución de $p$.", "es_correcta": False},
            {"letra": "C", "texto": "Que hubo dos aumentos de $0{,}25$ y luego, dos disminuciones de $0{,}75$.", "es_correcta": False},
            {"letra": "D", "texto": "Que hubo dos aumentos del 25% y luego, dos disminuciones del 75%.", "es_correcta": False}
        ]
    elif num == 8:
        new_enunciado = "¿Cuál es el 40% del 15% de 300?"
        new_alts = [
            {"letra": "A", "texto": "18", "es_correcta": True},
            {"letra": "B", "texto": "75", "es_correcta": False},
            {"letra": "C", "texto": "165", "es_correcta": False},
            {"letra": "D", "texto": "180", "es_correcta": False}
        ]
    elif num == 9:
        new_enunciado = "Si el precio de un helado es $500, ¿cuál de las siguientes expresiones representa el valor del helado aumentado en su 120%?"
        new_alts = [
            {"letra": "A", "texto": "$500 + 120 \\cdot 500$", "es_correcta": False},
            {"letra": "B", "texto": "$500 + 20 \\cdot 500$", "es_correcta": False},
            {"letra": "C", "texto": "$1{,}20 \\cdot 500$", "es_correcta": False},
            {"letra": "D", "texto": "$2{,}20 \\cdot 500$", "es_correcta": True}
        ]
    elif num == 12:
        new_enunciado = "¿Qué porcentaje es 4.740 de 15.800?"
        new_alts = [
            {"letra": "A", "texto": "0,3%", "es_correcta": False},
            {"letra": "B", "texto": "3%", "es_correcta": False},
            {"letra": "C", "texto": "3,3%", "es_correcta": False},
            {"letra": "D", "texto": "30%", "es_correcta": True}
        ]
    
    updates.append({
        'id': row['id'],
        'num': num,
        'enunciado': new_enunciado,
        'alternativas': new_alts,
        'respuesta_correcta': clave
    })

print(f'Prepared {len(updates)} questions for database update.')

# 5. Apply updates to Supabase
success = 0
failed = 0
for u in updates:
    res = supabase.from_('preguntas').update({
        'enunciado': u['enunciado'],
        'alternativas': u['alternativas'],
        'respuesta_correcta': u['respuesta_correcta'],
        'updated_at': 'now()'
    }).eq('id', u['id']).execute()
    
    if res.data:
        success += 1
    else:
        print(f"Error updating {u['id']}")
        failed += 1

print(f'Done! Successfully updated {success} questions in Supabase ({failed} failed).')

# 6. Generate SQL migration 040
sql_lines = [
    "-- ====================================================================",
    "-- MIGRATION 040: Sanitización Integral de las 65 Preguntas PAES M1 2023 (Forma 113)",
    "-- Corrección de números invertidos, marcas de agua y puntuación",
    "-- ====================================================================\n"
]
for u in updates:
    enunc_esc = u['enunciado'].replace("'", "''")
    alts_json = json.dumps(u['alternativas'], ensure_ascii=False).replace("'", "''")
    sql_lines.append(f"-- Pregunta {u['num']}")
    sql_lines.append(f"UPDATE public.preguntas SET")
    sql_lines.append(f"  enunciado = '{enunc_esc}',")
    sql_lines.append(f"  alternativas = '{alts_json}'::jsonb,")
    sql_lines.append(f"  respuesta_correcta = '{u['respuesta_correcta']}',")
    sql_lines.append(f"  updated_at = NOW()")
    sql_lines.append(f"WHERE id = '{u['id']}';\n")

with open('supabase/migrations/040_sanitize_all_65_paes_mat1_2023.sql', 'w', encoding='utf-8') as f:
    f.write('\n'.join(sql_lines))

print('Generated supabase/migrations/040_sanitize_all_65_paes_mat1_2023.sql')
