# -*- coding: utf-8 -*-
import json

with open(r'c:\Proyectos\Proyecto Evaluaciones Nacionales\scratch\scratch_insert_len2m.py', 'r', encoding='utf-8') as f:
    code = f.read()

loc = {}
exec(code, loc, loc)
questions_data = loc['questions_data']

ts_questions = []
for q in questions_data:
    alts_formatted = []
    for alt in q['alternativas']:
        alt_str = f"{{ letra: '{alt['letra']}', texto: {json.dumps(alt['texto'], ensure_ascii=False)}, es_correcta: {'true' if alt['es_correcta'] else 'false'} }}"
        alts_formatted.append(alt_str)
    alts_block = "[\n      " + ",\n      ".join(alts_formatted) + "\n    ]"
    
    img_line = f"    imagenUrl: '{q['imagenUrl']}',\n" if 'imagenUrl' in q else ""
    resp = json.dumps(q['respuestaCorrecta'], ensure_ascii=False) if q['respuestaCorrecta'] is not None else 'null'
    enunc = json.dumps(q['enunciado'], ensure_ascii=False)
    
    ts_q = f"""  {{
    id: '{q['id']}',
    asignaturaId: '{q['asignaturaId']}',
    ejeTematicoId: '{q['ejeTematicoId']}',
    habilidadId: '{q['habilidadId']}',
    tipo: '{q['tipo']}',
    nivel: '{q['nivel']}',
    dificultad: '{q['dificultad']}',
{img_line}    enunciado: {enunc},
    alternativas: {alts_block},
    respuestaCorrecta: {resp},
    puntaje: {q['puntaje']},
    fuente: '{q['fuente']}'
  }}"""
    ts_questions.append(ts_q)

all_ts_questions = ",\n\n".join(ts_questions)

with open(r'c:\Proyectos\Proyecto Evaluaciones Nacionales\src\data\mockData.ts', 'r', encoding='utf-8') as f:
    mock_content = f.read()

# Replace the preguntasMock content for preg-len2m-01 to preg-len2m-30
# We can find from preg-len2m-01 to the line before // === 1. MATEMÁTICA Y LENGUAJE 8° BÁSICO ===
import re
pattern = r"export const preguntasMock: Pregunta\[\] = \[\n  \{\n    id: 'preg-len2m-01'.*?\n  // === 1\. MATEMÁTICA Y LENGUAJE 8° BÁSICO ==="
replacement = f"export const preguntasMock: Pregunta[] = [\n{all_ts_questions},\n\n  // === 1. MATEMÁTICA Y LENGUAJE 8° BÁSICO ==="

mock_content = re.sub(pattern, replacement, mock_content, flags=re.DOTALL)

with open(r'c:\Proyectos\Proyecto Evaluaciones Nacionales\src\data\mockData.ts', 'w', encoding='utf-8') as f:
    f.write(mock_content)

print("mockData.ts repaired successfully!")
