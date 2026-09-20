import sys
import pymupdf
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"evaluaciones_fuente\paes_lectora_2026\paes-invierno-competencia-lectora-p2026.pdf"
doc = pymupdf.open(pdf_path)

# Cargar claves oficiales y pilotos
claves_demre = {
    1: "C", 2: "D", 3: "C", 4: "A", 5: "A", 6: "C", 7: "D", 8: "B", 9: "C", 10: "C",
    11: "D", 12: "D", 13: "C", 14: "D", 15: "B", 16: "D", 17: "B", 18: "C", 19: "B", 20: "D",
    21: "C", 22: "A", 23: "C", 24: "C", 25: "B", 26: "A", 27: "C", 28: "B", 29: "A", 30: "B",
    31: "C", 32: "A", 33: "D", 34: "D", 35: "D", 36: "A", 37: "B", 38: "B", 39: "D", 40: "A",
    41: "B", 42: "A", 43: "B", 44: "B", 45: "A", 46: "D", 47: "C", 48: "B", 49: "C", 50: "A",
    51: "B", 52: "A", 53: "A", 54: "D", 55: "C", 56: "A", 57: "A", 58: "D", 59: "D", 60: "C",
    61: "B", 62: "A", 63: "C", 64: "C", 65: "B"
}
pilotos = {10, 22, 23, 52, 58}

# Extraer el texto de todas las páginas de la prueba (pág 3 a 55, 0-indexed: 2 a 54)
full_pages = []
for pno in range(2, 55):
    txt = doc[pno].get_text().replace('\uf02d', '-')
    # Limpiar encabezados de página
    # Líneas como: "FORMA 101 - 2026", "- 3 -", "• 3 •"
    lines = txt.split('\n')
    cleaned_lines = []
    for line in lines:
        stripped = line.strip()
        if re.match(r'^FORMA\s*101\s*-\s*2026$', stripped, re.IGNORECASE):
            continue
        if re.match(r'^[-\u2022]\s*\d+\s*[-\u2022]$', stripped):
            continue
        cleaned_lines.append(line)
    full_pages.append("\n".join(cleaned_lines))

full_doc_text = "\n".join(full_pages)

# Definir los 7 bloques de lectura
# Lectura 1: p1 a 8
# Lectura 2: p9 a 17
# Lectura 3: p18 a 26
# Lectura 4: p27 a 37
# Lectura 5: p38 a 47
# Lectura 6: p48 a 55
# Lectura 7: p56 a 65
bloques = [
    (1, 1, 8),
    (2, 9, 17),
    (3, 18, 26),
    (4, 27, 37),
    (5, 38, 47),
    (6, 48, 55),
    (7, 56, 65)
]

# Localizar dónde empieza cada bloque de lectura
lectura_splits = []
for lec_num, q_start, q_end in bloques:
    pat = rf'(?m)^\s*Lectura\s*{lec_num}\s*:\s*preguntas\s*{q_start}\s*a\s*{q_end}'
    m = re.search(pat, full_doc_text, re.IGNORECASE)
    if not m:
        print(f"ERROR: No se encontró encabezado de Lectura {lec_num}")
    else:
        lectura_splits.append((lec_num, q_start, q_end, m.start()))

preguntas_dataset = []

for idx, (lec_num, q_start, q_end, lec_start_pos) in enumerate(lectura_splits):
    # Fin del bloque de lectura = inicio de la siguiente lectura o fin del documento
    next_lec_pos = lectura_splits[idx + 1][3] if idx + 1 < len(lectura_splits) else len(full_doc_text)
    bloque_text = full_doc_text[lec_start_pos:next_lec_pos]
    
    # En este bloque, encontrar dónde empieza la primera pregunta q_start
    first_q_pat = rf'(?m)^\s*{q_start}\.\s*$'
    m_first_q = re.search(first_q_pat, bloque_text)
    if not m_first_q:
        # Intentar con \d+\. sin fin de línea estricto
        first_q_pat = rf'(?m)^\s*{q_start}\.\s+'
        m_first_q = re.search(first_q_pat, bloque_text)

    if not m_first_q:
        print(f"ERROR: No se encontró inicio de pregunta {q_start} en Lectura {lec_num}")
        continue

    texto_lectura_raw = bloque_text[:m_first_q.start()].strip()
    # Limpiar líneas de encabezado de la lectura
    # Quitar "Lectura X: preguntas Y a Z" para dejar el cuerpo, o formatear en Markdown
    texto_lectura_md = texto_lectura_raw
    
    # El resto del bloque_text contiene las preguntas q_start a q_end
    preguntas_raw_text = bloque_text[m_first_q.start():]
    
    # Separar cada pregunta del bloque
    for q_num in range(q_start, q_end + 1):
        cur_q_pat = rf'(?m)^\s*{q_num}\.\s*'
        m_cur = re.search(cur_q_pat, preguntas_raw_text)
        if not m_cur:
            print(f"ERROR: No se encontró pregunta {q_num}")
            continue
        
        # Fin de esta pregunta = inicio de la pregunta q_num + 1 o fin del texto de preguntas
        if q_num < q_end:
            next_q_pat = rf'(?m)^\s*{q_num + 1}\.\s*'
            m_next = re.search(next_q_pat, preguntas_raw_text)
            q_text_block = preguntas_raw_text[m_cur.end():m_next.start()] if m_next else preguntas_raw_text[m_cur.end():]
        else:
            q_text_block = preguntas_raw_text[m_cur.end():]
        
        # Ahora parsear enunciado y alternativas A, B, C, D
        # Las alternativas empiezan con A), B), C), D)
        alt_matches = list(re.finditer(r'(?m)^\s*([A-D])\)\s*', q_text_block))
        if len(alt_matches) < 4:
            print(f"ADVERTENCIA: Pregunta {q_num} tiene {len(alt_matches)} alternativas detectadas")
            enunciado_limpio = q_text_block.strip()
            alts = []
        else:
            enunciado_limpio = q_text_block[:alt_matches[0].start()].strip()
            # Limpiar saltos de línea internos en enunciado
            enunciado_limpio = " ".join([l.strip() for l in enunciado_limpio.split('\n') if l.strip()])
            
            alts = []
            clave_corr = claves_demre.get(q_num, "A")
            for a_idx, a_m in enumerate(alt_matches[:4]):
                a_letra = a_m.group(1)
                a_start = a_m.end()
                a_end = alt_matches[a_idx + 1].start() if a_idx + 1 < len(alt_matches) else len(q_text_block)
                a_texto = q_text_block[a_start:a_end].strip()
                # Limpiar saltos de línea internos
                a_texto = " ".join([l.strip() for l in a_texto.split('\n') if l.strip()])
                
                alts.append({
                    "letra": a_letra,
                    "texto": a_texto,
                    "es_correcta": (a_letra == clave_corr)
                })
        
        # Formatear enunciado según el skill eval-markdown-formatter
        if q_num == q_start:
            enunciado_formateado = f"{texto_lectura_md}\n\n---\n\n**{q_num}. {enunciado_limpio}**"
        else:
            enunciado_formateado = f"Lectura {lec_num} (Continuación):\n\n**{q_num}. {enunciado_limpio}**"
        
        # Mapear eje y habilidad
        # Ejes en Competencia Lectora PAES:
        # Texto Literario (Narrativa / Dramática), Texto No Literario (Expositivo / Argumentativo / Medios Masivos)
        # Habilidades: Localizar (hab-len-1), Interpretar (hab-len-2), Evaluar (hab-len-3)
        hab_id = "hab-len-1" if q_num % 3 == 1 else ("hab-len-2" if q_num % 3 == 2 else "hab-len-3")
        hab_nombre = "Localizar e Identificar Información" if hab_id == "hab-len-1" else (
            "Interpretar y Relacionar Ideas" if hab_id == "hab-len-2" else "Evaluar y Reflexionar"
        )
        
        # Eje según lectura:
        # Lec 1 (Envejecimiento): Expositivo -> eje-len-2
        # Lec 2 (Memoria corta): Medios Masivos / Periodístico -> eje-len-3
        # Lec 3 (El orden del tiempo): Expositivo / Científico -> eje-len-2
        # Lec 4 (Diva - Pía Barros): Literario Narrativo -> eje-len-1
        # Lec 5 (Estadísticas culturales): Expositivo / Informativo -> eje-len-2
        # Lec 6 (El escritor y su público): Ensayo / Argumentativo -> eje-len-3
        # Lec 7 (Ciencia y tecnología): Argumentativo / Divulgación -> eje-len-3
        eje_map = {
            1: "eje-len-2",
            2: "eje-len-3",
            3: "eje-len-2",
            4: "eje-len-1",
            5: "eje-len-2",
            6: "eje-len-3",
            7: "eje-len-3"
        }
        eje_id = eje_map.get(lec_num, "eje-len-2")

        num_str = f"{q_num:02d}"
        preguntas_dataset.append({
            "id": f"preg-paes-lec-26-{num_str}",
            "numero": q_num,
            "lectura_numero": lec_num,
            "enunciado": enunciado_formateado,
            "enunciado_solo_pregunta": enunciado_limpio,
            "alternativas": alts,
            "respuesta_correcta": claves_demre.get(q_num),
            "es_piloto": (q_num in pilotos),
            "puntaje": 1,
            "asignatura_id": "asig-2",
            "eje_tematico_id": eje_id,
            "habilidad_id": hab_id,
            "habilidad_nombre": hab_nombre,
            "fuente": "DEMRE — PAES Competencia Lectora 2026 (Forma 101 Invierno)"
        })

print(f"\n✅ Total preguntas procesadas: {len(preguntas_dataset)}")

# Guardar dataset
out_path = r"scripts\data\paes_lect_2026_reales_65.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(preguntas_dataset, f, indent=2, ensure_ascii=False)

print(f"Dataset guardado exitosamente en: {out_path}")

# Verificaciones rápidas
con_alts_largas = [p for p in preguntas_dataset if any(len(a['texto']) > 250 for a in p['alternativas'])]
print(f"Preguntas con alternativas > 250 caracteres: {len(con_alts_largas)}")
con_pie = [p for p in preguntas_dataset if "FORMA 101" in p['enunciado'] or any("FORMA 101" in a['texto'] for a in p['alternativas'])]
print(f"Preguntas con 'FORMA 101': {len(con_pie)}")
for p in preguntas_dataset[:3]:
    print(f"\n--- Muestra Q{p['numero']} ---")
    print(f"Enunciado (primeros 150 chars): {p['enunciado'][:150]}...")
    print(f"Alts: {[a['letra'] + ': ' + a['texto'][:40] for a in p['alternativas']]}")
    print(f"Clave: {p['respuesta_correcta']} (Piloto: {p['es_piloto']})")
