import sys
import pymupdf
import re

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"evaluaciones_fuente\paes_lectora_2026\clavijero-paes-invierno-competencia-lectora-p2026.pdf"
doc = pymupdf.open(pdf_path)

print(f"Páginas en clavijero: {len(doc)}")
for i, page in enumerate(doc):
    txt = page.get_text().replace('\uf02d', '-')
    print(f"--- PÁGINA {i+1} ---")
    print(txt)
