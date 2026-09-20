import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = 'evaluaciones_fuente/paes/paes-oficial-matematica1-p2023.pdf'
doc = fitz.open(pdf_path)

for p in range(2, 6):
    print(f"================== PAGE {p+1} ==================")
    print(doc[p].get_text())
