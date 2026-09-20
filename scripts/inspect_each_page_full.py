import fitz
import json
import re

doc = fitz.open("evaluaciones_fuente/2_medio/ensayo_3_simce_matematica_2m.pdf")

# In the PDF, each page has 2 or 3 questions.
# Each question has:
# Number
# Enunciado
# Alternatives A, B, C, D
# "Respuesta": the correct answer according to the solucionario

for page_idx, page in enumerate(doc):
    text = page.get_text()
    print(f"\n============================== PAGINA {page_idx + 1} ==============================")
    print(text.strip())
