import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = 'evaluaciones_fuente/paes/paes-oficial-matematica1-p2023.pdf'
doc = fitz.open(pdf_path)

for p_num in range(len(doc)):
    page = doc[p_num]
    t = page.get_text()
    if 'balanza' in t.lower():
        print(f"Balanza found on Page {p_num+1}!")
        print(t[:400])
    if 'pirámide' in t.lower() or 'piramide' in t.lower() or 'casilleros' in t.lower():
        print(f"Casilleros/Piramide found on Page {p_num+1}!")
    if 'escalera' in t.lower():
        print(f"Escalera found on Page {p_num+1}!")
        print(t[:400])
    if 'pandereta' in t.lower():
        print(f"Pandereta found on Page {p_num+1}!")
