import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = 'evaluaciones_fuente/paes/paes-oficial-matematica1-p2023.pdf'
doc = fitz.open(pdf_path)

def check_pages(*pages):
    for p in pages:
        print(f"=== PAGE {p} ===")
        page = doc[p-1]
        print(page.get_text())

check_pages(7, 8, 14, 22, 26, 27, 34, 35, 46)
