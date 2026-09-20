import fitz # PyMuPDF
import re

pdf_path = "evaluaciones_fuente/2_medio/ensayo_3_simce_matematica_2m.pdf"
doc = fitz.open(pdf_path)

with open("scratch/pdf_mat2m_full_text.txt", "w", encoding="utf-8") as f:
    for page_idx in range(len(doc)):
        page = doc[page_idx]
        text = page.get_text()
        f.write(f"\n==================== PAGINA {page_idx + 1} ====================\n")
        f.write(text)

print("Texto extraído a scratch/pdf_mat2m_full_text.txt")
