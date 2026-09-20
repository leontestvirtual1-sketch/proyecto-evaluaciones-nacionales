import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = 'evaluaciones_fuente/paes/paes-oficial-matematica1-p2023.pdf'
doc = fitz.open(pdf_path)

def inspect_page(p_num):
    page = doc[p_num - 1]
    print(f"\n================ PAGE {p_num} ================")
    blocks = page.get_text("blocks")
    for b in blocks:
        # print first line of each block and bbox
        first = b[4].strip().split('\n')[0][:70] if b[4].strip() else ''
        print(f"  bbox=({b[0]:.1f}, {b[1]:.1f}, {b[2]:.1f}, {b[3]:.1f}) -> '{first}'")
    
    drawings = page.get_drawings()
    if drawings:
        d_rects = [d['rect'] for d in drawings]
        x0 = min(r.x0 for r in d_rects)
        y0 = min(r.y0 for r in d_rects)
        x1 = max(r.x1 for r in d_rects)
        y1 = max(r.y1 for r in d_rects)
        print(f"  Drawing bounding envelope: ({x0:.1f}, {y0:.1f}, {x1:.1f}, {y1:.1f}), count={len(drawings)}")

# Inspect key pages:
# 4 (Q3), 12 (Q17), 15 (Q23), 17 (Q26), 18 (Q27), 21 (Q30), 23 (Q34), 24 (Q35), 28 (Q40), 29 (Q41), 30 (Q42), 32 (Q45), 33 (Q46), 35 (Q50), 36 (Q51), 37 (Q52), 38 (Q53), 39 (Q54), 41 (Q56), 42 (Q57), 44 (Q60)
pages_to_check = [4, 12, 15, 17, 18, 21, 23, 24, 28, 29, 30, 32, 33, 35, 36, 37, 38, 39, 41, 42, 44]
for p in pages_to_check:
    inspect_page(p)
