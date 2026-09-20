import fitz
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = 'evaluaciones_fuente/paes/paes-oficial-matematica1-p2023.pdf'
doc = fitz.open(pdf_path)

# Let's inspect each of the 65 questions and their exact text in the PDF
print("Analyzing all 65 questions for diagrams/figures...")

# We know the page of each question:
# Let's search each page for question blocks
for page_num in range(2, len(doc)):
    page = doc[page_num]
    text = page.get_text()
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    
    # find question starts
    for idx, l in enumerate(lines):
        m = re.match(r'^(\d{1,2})\.\s*(.*)', l)
        if m:
            q_num = int(m.group(1))
            q_rest = m.group(2)
            if 1 <= q_num <= 65:
                # get next ~5 lines
                snippet = " ".join([l] + lines[idx+1:idx+6])
                # check if figura or grafico or diagrama is mentioned
                has_fig = any(k in snippet.lower() for k in ['figura', 'gráfico', 'grafico', 'diagrama', 'siguiente imagen', 'adjunta', 'representa a continuación'])
                drawings = len(page.get_drawings())
                images = len(page.get_images())
                if has_fig or drawings > 5 or images > 0:
                    print(f"Q{q_num:02d} (Page {page_num+1}): drawings={drawings}, images={images} | {snippet[:110]}...")
