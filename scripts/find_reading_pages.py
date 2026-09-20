import sys
import pymupdf
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"evaluaciones_fuente\paes_lectora_2026\paes-invierno-competencia-lectora-p2026.pdf"
doc = pymupdf.open(pdf_path)

print("Buscando encabezados de Lecturas en el PDF...")
for i in range(len(doc)):
    page_text = doc[i].get_text().replace('\uf02d', '-')
    m = re.search(r'Lectura\s*(\d+)\s*:\s*preguntas\s*(\d+)\s*a\s*(\d+)', page_text, re.IGNORECASE)
    if m:
        print(f"Página {i+1}: Lectura {m.group(1)} (Preguntas {m.group(2)} a {m.group(3)})")
