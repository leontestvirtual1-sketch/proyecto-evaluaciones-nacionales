import os
import re
import fitz

pdf_path = 'evaluaciones_fuente/paes/paes-oficial-matematica1-p2023.pdf'
doc = fitz.open(pdf_path)

print(f"Total pages: {len(doc)}")

# Let's locate each question 1..65 and see which page it is on, and extract its text
questions = {}
for page_num in range(len(doc)):
    page = doc[page_num]
    text = page.get_text()
    
    # find question starts
    matches = re.finditer(r'(?:^|\n)\s*(\d{1,2})\.\s+', text)
    for m in matches:
        q_num = int(m.group(1))
        if 1 <= q_num <= 65:
            if q_num not in questions:
                questions[q_num] = {'page': page_num + 1, 'pos': m.start()}

print(f"Found {len(questions)} questions")

# Check mentions of figura, gráfico, tabla, etc. in each question text in PDF
keywords = ['figura', 'gráfico', 'grafico', 'diagrama', 'tabla', 'imagen', 'representa a continuación', 'siguiente figura', 'siguiente gráfico']

for page_num in range(2, len(doc)):
    page = doc[page_num]
    text = page.get_text()
    drawings = page.get_drawings()
    images = page.get_images()
    # print summary per page
    # find which questions are on this page
    page_qs = [q for q, data in questions.items() if data['page'] == page_num + 1]
    has_kw = [kw for kw in keywords if kw in text.lower()]
    print(f"Page {page_num + 1}: Questions {page_qs} | Drawings: {len(drawings)} | Images: {len(images)} | Keywords: {has_kw}")
