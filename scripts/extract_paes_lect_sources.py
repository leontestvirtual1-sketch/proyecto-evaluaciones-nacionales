import sys
import pymupdf
import re

# Asegurar salida utf-8 en consola
sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"evaluaciones_fuente\paes_lectora_2026\paes-invierno-competencia-lectora-p2026.pdf"
doc = pymupdf.open(pdf_path)

print(f"Total páginas en el PDF: {len(doc)}")

# Veamos páginas 2 a 10 para ver dónde está la Lectura 1
for p in range(1, 10):
    txt = doc[p].get_text()
    # Limpiar caracter PUA \uf02d
    txt = txt.replace('\uf02d', '-')
    print(f"\n--- PÁGINA {p+1} ---")
    lines = [l.strip() for l in txt.split('\n') if l.strip()]
    print("\n".join(lines[:10]))
