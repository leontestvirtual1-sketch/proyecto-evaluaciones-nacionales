import fitz
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = 'evaluaciones_fuente/paes/paes-oficial-matematica1-p2023.pdf'
doc = fitz.open(pdf_path)

print(f"Total pages: {len(doc)}")

# Look at every page from page 3 (index 2) to end
all_text_by_page = {}
for i in range(2, len(doc)):
    page = doc[i]
    t = page.get_text()
    all_text_by_page[i+1] = t

# Find all questions 1..65 and their page and text
questions_found = {}
for q in range(1, 66):
    pattern = rf'(?:^|\n)\s*{q}\.\s+'
    for p_num, text in all_text_by_page.items():
        m = re.search(pattern, text)
        if m:
            questions_found[q] = p_num
            break

print("Questions mapping to pages:")
for q in range(1, 66):
    p = questions_found.get(q, 'NOT FOUND')
    print(f"Q{q:02d} -> Page {p}")
