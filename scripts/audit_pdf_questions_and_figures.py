import fitz
import re
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = 'evaluaciones_fuente/paes/paes-oficial-matematica1-p2023.pdf'
doc = fitz.open(pdf_path)

# Let's inspect page by page (pages 3 to 47 in 1-based, index 2 to 46)
print(f"Inspecting pages 3 to 47 of {pdf_path}...")

for page_idx in range(2, len(doc)):
    page = doc[page_idx]
    text = page.get_text()
    
    # Clean text to see question headers
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    q_lines = [l for l in lines if re.match(r'^\d{1,2}\.\s+', l)]
    
    drawings = page.get_drawings()
    images = page.get_images()
    
    # check if words like figura, gráfico, tabla, etc. appear
    keywords = [w for w in ['figura', 'gráfico', 'grafico', 'diagrama', 'tabla', 'imagen'] if w in text.lower()]
    
    print(f"\n--- Page {page_idx + 1} (drawings: {len(drawings)}, images: {len(images)}, kw: {keywords}) ---")
    for q in q_lines:
        print(f"   {q}")
