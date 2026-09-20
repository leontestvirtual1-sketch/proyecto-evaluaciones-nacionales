import fitz
from PIL import Image

pdf_path = 'evaluaciones_fuente/paes/paes-oficial-matematica1-p2023.pdf'
doc = fitz.open(pdf_path)
page = doc[3] # page 4

# The drawing rect
# 25 is top, p, q, 4 are bottom
rect = fitz.Rect(235, 125, 380, 210)
mat = fitz.Matrix(3.0, 3.0) # 300 DPI retina crisp
pix = page.get_pixmap(matrix=mat, clip=rect)
pix.save('public/preguntas/paes_mat1_2023_forma113/figura_p03_piramide.png')
print("Saved figura_p03_piramide.png:", pix.width, pix.height)
