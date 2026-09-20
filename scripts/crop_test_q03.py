import fitz
from PIL import Image

pdf_path = 'evaluaciones_fuente/paes/paes-oficial-matematica1-p2023.pdf'
doc = fitz.open(pdf_path)

# Page 4 is index 3
page = doc[3]

# Let's inspect drawings and text rects on page 4 around question 3
text_instances = page.get_text("blocks")
for b in text_instances:
    print(b)

# Notice where the pyramid is:
# Below "3. En la figura adjunta...", above "Si la suma de los tres valores..."
# Between y0 ~ 130 and y1 ~ 320
rect = fitz.Rect(120, 110, 480, 240)
mat = fitz.Matrix(3.0, 3.0) # High-res
pix = page.get_pixmap(matrix=mat, clip=rect)
pix.save('scratch/test_q03_crop.png')
print("Saved scratch/test_q03_crop.png with size", pix.width, pix.height)
