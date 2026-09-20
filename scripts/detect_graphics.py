import fitz
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = 'evaluaciones_fuente/paes/paes-oficial-matematica1-p2023.pdf'
doc = fitz.open(pdf_path)

# Questions mapping
page_map = {
    1: 3, 2: 3, 3: 4, 4: 4, 5: 5, 6: 5, 7: 6, 8: 6, 9: 6, 10: 7,
    11: 8, 12: 8, 13: 9, 14: 10, 15: 11, 16: 12, 17: 12, 18: 13, 19: 13, 20: 14,
    21: 14, 22: 15, 23: 15, 24: 16, 25: 16, 26: 17, 27: 18, 28: 19, 29: 20, 30: 21,
    31: 22, 32: 22, 33: 23, 34: 23, 35: 24, 36: 25, 37: 25, 38: 26, 39: 27, 40: 28,
    41: 29, 42: 30, 43: 31, 44: 31, 45: 32, 46: 33, 47: 34, 48: 34, 49: 35, 50: 35,
    51: 36, 52: 37, 53: 38, 54: 39, 55: 40, 56: 41, 57: 42, 58: 42, 59: 43, 60: 44,
    61: 45, 62: 45, 63: 46, 64: 46, 65: 47
}

fig_keywords = ['figura', 'gráfico', 'grafico', 'diagrama', 'siguiente imagen', 'adjunta', 'representa a continuación', 'recta numérica']

results = []

for q, p in page_map.items():
    page = doc[p - 1]
    text = page.get_text()
    
    # Extract question text roughly
    # find where this question starts
    m = re.search(rf'(?:^|\n)\s*{q}\.\s+', text)
    if not m:
        continue
    start_pos = m.start()
    
    # find where next question starts or end of text
    next_q = q + 1
    end_pos = len(text)
    if page_map.get(next_q) == p:
        m2 = re.search(rf'(?:^|\n)\s*{next_q}\.\s+', text[start_pos+5:])
        if m2:
            end_pos = start_pos + 5 + m2.start()
            
    q_text = text[start_pos:end_pos]
    
    # check for keywords
    found_kws = [kw for kw in fig_keywords if kw in q_text.lower()]
    
    if found_kws:
        results.append((q, p, found_kws, q_text.split('\n')[0]))

print(f"Questions mentioning figures/graphics ({len(results)} questions):")
for r in results:
    print(f"Q{r[0]:02d} (P{r[1]}): {r[2]} -> {r[3]}")
