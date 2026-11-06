import os
import re
import fitz

def clean_symbols(s):
    if not s: return ""
    replacements = {
        "\uf028": "(", "\uf029": ")", "\uf02d": "-", "\uf0b7": "\\cdot ",
        "\uf03d": "=", "\uf0b1": "\\pm ", "\uf070": "\\pi ", "\uf0a3": "\\le ",
        "\uf0b3": "\\ge ", "\uf0b9": "\\ne ", "\uf03c": "<", "\uf03e": ">",
        "\uf07e": "\\sim ", "\u2212": "-", "\u00d7": "\\cdot ", "": "\\cdot ",
        "\u2264": "\\le ", "\u2265": "\\ge ", "\u2260": "\\ne ",
        "–": "-", "—": "-"
    }
    for k, v in replacements.items():
        s = s.replace(k, v)
    return s

def clean_math_text(txt):
    if not txt: return ""
    # Inverted Chilean currency
    txt = re.sub(r'000\s*(\d{1,3})\s*\$?', r'$\1.000', txt)
    txt = re.sub(r'\$\s*(\d{1,3})\s*000(?!\d)', r'$\1.000', txt)
    txt = re.sub(r'(\d{1,3})\s*000\s*\$', r'$\1.000', txt)
    # Missing dots in pesos
    txt = re.sub(r'\$(\d{1,3})(\d{3})(?!\d)', r'$\1.\2', txt)
    # Inverted percentages: "% 25" -> "25%"
    txt = re.sub(r'%\s*(\d+(?:,\d+)?)', r'\1%', txt)
    # Inverted units
    txt = re.sub(r'\b([Lmc]m?)\s+(\d+(?:,\d+)?)', r'\2 \1', txt)
    # Remove watermarks / headers
    txt = re.sub(r'FORMA\s*\d+\s*[-–—]?\s*\d*', '', txt, flags=re.I)
    txt = re.sub(r'-\s*\d+\s*-', '', txt)
    return txt.strip()

def detect_questions(doc, max_q=65):
    """
    Detects all questions in a DEMRE PDF.
    Returns list of dicts: {num, pno, y0, bbox}
    """
    # Find first page with actual questions (must have options A) and B))
    start_pno = 1
    for pno in range(min(6, len(doc))):
        txt = doc[pno].get_text()
        if "A)" in txt and "B)" in txt:
            start_pno = pno
            break

    detected = {}
    for pno in range(start_pno, len(doc)):
        page = doc[pno]
        blocks = page.get_text("dict")["blocks"]
        for b in blocks:
            if "lines" not in b: continue
            for l in b["lines"]:
                for s in l["spans"]:
                    txt = s["text"].strip()
                    m = re.match(r"^(\d{1,2})\.?$", txt)
                    # Check left column question number
                    if m and s["bbox"][0] < 85:
                        num = int(m.group(1))
                        if 1 <= num <= max_q and num not in detected:
                            detected[num] = {
                                "num": num,
                                "pno": pno,
                                "y0": s["bbox"][1],
                                "x0": s["bbox"][0],
                                "bbox": s["bbox"]
                            }

    # Fallback for questions where the dot or text was joined (e.g. "57. En la siguiente...")
    for pno in range(start_pno, len(doc)):
        page = doc[pno]
        blocks = page.get_text("dict")["blocks"]
        for b in blocks:
            if "lines" not in b: continue
            for l in b["lines"]:
                for s in l["spans"]:
                    txt = s["text"].strip()
                    m = re.match(r"^(\d{1,2})\.\s+", txt)
                    if m and s["bbox"][0] < 85:
                        num = int(m.group(1))
                        if 1 <= num <= max_q and num not in detected:
                            detected[num] = {
                                "num": num,
                                "pno": pno,
                                "y0": s["bbox"][1],
                                "x0": s["bbox"][0],
                                "bbox": s["bbox"]
                            }

    q_list = list(detected.values())
    q_list.sort(key=lambda q: (q["pno"], q["y0"]))
    return q_list

def extract_spatial_lines(page, y_start, y_end):
    words = page.get_text("words")
    slice_words = [
        (w[0], w[1], w[2], w[3], clean_symbols(w[4]))
        for w in words
        if y_start <= w[1] <= y_end and w[3] <= 750
    ]
    if not slice_words:
        return []

    def y_center(w): return (w[1] + w[3]) / 2.0
    slice_words.sort(key=lambda w: y_center(w))

    clusters = []
    for w in slice_words:
        w_yc = y_center(w)
        matched = False
        for c in clusters:
            c_yc = sum(y_center(item) for item in c) / len(c)
            overlap = min(w[3], max(item[3] for item in c)) - max(w[1], min(item[1] for item in c))
            if abs(w_yc - c_yc) <= 7.0 or overlap > 2.0:
                c.append(w)
                matched = True
                break
        if not matched:
            clusters.append([w])

    clusters.sort(key=lambda c: sum(y_center(w) for w in c) / len(c))

    lines = []
    for c in clusters:
        c.sort(key=lambda w: w[0])
        line_text = ""
        for i, w in enumerate(c):
            txt = w[4]
            if i == 0:
                line_text = txt
            else:
                prev = c[i - 1]
                if prev[4] in "(-" or txt in "(),.?!:;":
                    line_text += txt
                elif prev[4] == "$" or txt == "$":
                    line_text += txt
                else:
                    line_text += " " + txt

        line_text = re.sub(r'\(\s*-\s*', '(-', line_text)
        line_text = re.sub(r'\s*\)', ')', line_text)
        line_text = re.sub(r'\(\s*', '(', line_text)
        line_text = re.sub(r'-\s+(\d+)', r'-\1', line_text)
        if line_text.strip():
            lines.append(line_text.strip())

    return lines

def parse_question(doc, q, next_q, out_fig_dir, eval_id):
    num = q["num"]
    pno = q["pno"]
    page = doc[pno]
    y_start = max(60, q["y0"] - 6)

    if next_q and next_q["pno"] == pno:
        y_end = next_q["y0"] - 6
    else:
        y_end = 740

    # 1. Detect & Crop Figure
    drawings = page.get_drawings()
    q_drawings = [
        d["rect"] for d in drawings
        if y_start <= d["rect"].y0 <= y_end and d["rect"].width > 18 and d["rect"].height > 18
        and d["rect"].width < 500
    ]

    # Also check raster images
    images = page.get_images()
    has_image = False
    for img_info in images:
        xref = img_info[0]
        rects = page.get_image_rects(xref)
        for r in rects:
            if y_start <= r.y0 <= y_end and r.width > 20 and r.height > 20:
                q_drawings.append(r)
                has_image = True

    imagen_rel_path = None
    if q_drawings:
        x0 = max(45, min(r.x0 for r in q_drawings) - 8)
        y0 = max(y_start, min(r.y0 for r in q_drawings) - 8)
        x1 = min(565, max(r.x1 for r in q_drawings) + 8)
        y1 = min(y_end, max(r.y1 for r in q_drawings) + 8)

        if (x1 - x0) > 25 and (y1 - y0) > 25:
            os.makedirs(out_fig_dir, exist_ok=True)
            crop_rect = fitz.Rect(x0, y0, x1, y1)
            pix = page.get_pixmap(clip=crop_rect, dpi=150)
            img_name = f"figura_p{num:02d}.png"
            local_path = os.path.join(out_fig_dir, img_name)
            pix.save(local_path)
            imagen_rel_path = f"/preguntas/{eval_id}/{img_name}"

    # 2. Extract Lines
    lines = extract_spatial_lines(page, y_start, y_end)

    # Clean question number from first line if present
    if lines:
        lines[0] = re.sub(rf'^{num}\.\s*', '', lines[0]).strip()

    # Separate enunciado from alternatives
    alts_dict = {}
    enunc_lines = []
    current_alt = None

    for line in lines:
        m_alt = re.match(r'^([A-E])\)\s*(.*)', line)
        if m_alt:
            current_alt = m_alt.group(1)
            alts_dict[current_alt] = m_alt.group(2).strip()
        elif current_alt:
            # continuation of alternative text
            if line and not re.match(r'^-\s*\d+\s*-', line):
                alts_dict[current_alt] = (alts_dict[current_alt] + " " + line).strip()
        else:
            if line and not re.match(r'^-\s*\d+\s*-', line):
                enunc_lines.append(line)

    enunciado = clean_math_text("\n".join(enunc_lines))
    
    # Format alternatives list
    alternativas = []
    for letra in ["A", "B", "C", "D", "E"]:
        if letra in alts_dict:
            txt = clean_math_text(alts_dict[letra])
            alternativas.append({
                "letra": letra,
                "texto": txt,
                "es_correcta": False
            })

    return {
        "numero": num,
        "enunciado": enunciado,
        "alternativas": alternativas,
        "imagen_url": imagen_rel_path,
        "page": pno + 1
    }
