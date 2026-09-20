import os
from PIL import Image

dirpath = 'public/preguntas/paes_mat1_2023_forma113'
for f in sorted(os.listdir(dirpath)):
    if f.startswith('figura_'):
        im = Image.open(os.path.join(dirpath, f))
        print(f"{f}: size={im.size}, mode={im.mode}")
