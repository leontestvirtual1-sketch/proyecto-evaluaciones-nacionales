import fitz
import os

pdf_path = "evaluaciones_fuente/2_medio/ensayo_3_simce_matematica_2m.pdf"
doc = fitz.open(pdf_path)

os.makedirs("scratch/pdf_2m_images", exist_ok=True)
count = 0
for p_no in range(len(doc)):
    page = doc[p_no]
    il = page.get_images()
    for img_idx, img in enumerate(il):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        out_name = f"scratch/pdf_2m_images/p{p_no+1}_img{img_idx+1}_{xref}.{image_ext}"
        with open(out_name, "wb") as f:
            f.write(image_bytes)
        count += 1
        print(f"Extracted page {p_no+1} img {img_idx+1}: {out_name} ({len(image_bytes)} bytes)")

print(f"Total extracted: {count}")
