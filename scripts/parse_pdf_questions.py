import fitz # PyMuPDF
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open("evaluaciones_fuente/2_medio/ensayo_3_simce_matematica_2m.pdf")

pages_text = []
for i in range(len(doc)):
    pages_text.append(doc[i].get_text())

with open("scratch/pdf_questions_dump.txt", "w", encoding="utf-8") as out:
    for page_idx, page in enumerate(doc):
        out.write(f"\n==================== PAGINA {page_idx + 1} ====================\n")
        blocks = page.get_text("blocks")
        for b in blocks:
            # b: (x0, y0, x1, y1, text, block_no, block_type)
            out.write(f"--- Block ({b[0]:.1f}, {b[1]:.1f}, {b[2]:.1f}, {b[3]:.1f}) ---\n{b[4]}\n")

print("Dump generado en scratch/pdf_questions_dump.txt")
