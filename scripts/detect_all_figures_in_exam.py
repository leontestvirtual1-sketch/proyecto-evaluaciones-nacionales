import fitz
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = 'evaluaciones_fuente/paes/paes-oficial-matematica1-p2023.pdf'
doc = fitz.open(pdf_path)

# Let's locate each question 1..65 exactly by finding its number marker 'X. '
# On each page, questions start with a number like "3. " at the beginning of a line.

question_locs = []

for page_idx in range(2, len(doc)):
    page = doc[page_idx]
    blocks = page.get_text("blocks")
    for b in blocks:
        x0, y0, x1, y1, text, bno, btype = b
        lines = [l.strip() for l in text.strip().split('\n') if l.strip()]
        if not lines:
            continue
        first_line = lines[0]
        m = re.match(r'^(\d{1,2})\.\s+', first_line)
        if m:
            q_num = int(m.group(1))
            if 1 <= q_num <= 65:
                # check that it's a real question start
                question_locs.append({
                    'num': q_num,
                    'page_idx': page_idx,
                    'page_num': page_idx + 1,
                    'y0': y0,
                    'y1': y1,
                    'text': text
                })

# Deduplicate if any
unique_qs = {}
for q in question_locs:
    if q['num'] not in unique_qs:
        unique_qs[q['num']] = q

print(f"Total unique questions located: {len(unique_qs)}")

# Now for each question, find its bounding box on the page
questions_with_drawings = []

for num in range(1, 66):
    if num not in unique_qs:
        print(f"WARNING: Q{num} not found!")
        continue
    
    q_info = unique_qs[num]
    p_idx = q_info['page_idx']
    page = doc[p_idx]
    
    # find next question on the same page if any
    next_q_on_page = [unique_qs[n] for n in unique_qs if unique_qs[n]['page_idx'] == p_idx and unique_qs[n]['y0'] > q_info['y0']]
    
    y_top = q_info['y0']
    if next_q_on_page:
        next_q_on_page.sort(key=lambda x: x['y0'])
        y_bottom = next_q_on_page[0]['y0']
    else:
        y_bottom = page.rect.height - 40
        
    q_rect = fitz.Rect(0, y_top, page.rect.width, y_bottom)
    
    # Check if there are drawings inside this rect
    drawings = page.get_drawings()
    q_drawings = [d for d in drawings if q_rect.intersects(d['rect'])]
    
    # Check if there are images inside this rect
    # get image rects
    img_list = page.get_images()
    
    # Check text for keywords
    full_q_text = page.get_text(clip=q_rect)
    
    has_fig_kw = any(w in full_q_text.lower() for w in ['figura', 'gráfico', 'grafico', 'diagrama', 'siguiente imagen', 'adjunta', 'representa'])
    
    if len(q_drawings) > 3 or len(img_list) > 0 or has_fig_kw:
        questions_with_drawings.append({
            'num': num,
            'page': p_idx + 1,
            'rect': (q_rect.x0, q_rect.y0, q_rect.x1, q_rect.y1),
            'drawings_count': len(q_drawings),
            'has_images': len(img_list) > 0,
            'has_fig_kw': has_fig_kw,
            'first_line': full_q_text.strip().split('\n')[0][:80]
        })

print(f"\n--- Questions that likely have figures/graphics ({len(questions_with_drawings)}) ---")
for item in questions_with_drawings:
    print(f"Q{item['num']:02d} (Page {item['page']}): drawings={item['drawings_count']}, images={item['has_images']}, kw={item['has_fig_kw']} | {item['first_line']}")
