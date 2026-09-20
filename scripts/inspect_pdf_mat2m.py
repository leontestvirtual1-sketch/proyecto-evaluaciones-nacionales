import fitz # PyMuPDF
import json
import os

pdf_path = "evaluaciones_fuente/2_medio/ensayo_3_simce_matematica_2m.pdf"
doc = fitz.open(pdf_path)
print(f"Total paginas: {len(doc)}")

for page_idx in range(len(doc)):
    page = doc[page_idx]
    text = page.get_text()
    images = page.get_images()
    print(f"--- Pagina {page_idx + 1} (Imagenes: {len(images)}) ---")
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    print(f"Total lineas: {len(lines)}")
    # Print first few lines
    for l in lines[:5]:
        print("  ", l)
