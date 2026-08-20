import docx
import re
import json

doc = docx.Document('evaluaciones_fuente/Ensayo+SIMCE+Lenguaje+2° Medio+Abril 2026.docx')

tables = doc.tables

# Readings
r1 = tables[1].rows[0].cells[0].text.strip()
r2 = tables[3].rows[0].cells[0].text.strip()
r3 = tables[5].rows[0].cells[0].text.strip()
r4 = tables[7].rows[0].cells[0].text.strip()
r5 = tables[9].rows[0].cells[0].text.strip()
r6 = tables[11].rows[0].cells[0].text.strip()

print("Readings extracted successfully.")
print(f"R1: {len(r1)} chars, R2: {len(r2)} chars, R3: {len(r3)} chars, R4: {len(r4)} chars, R5: {len(r5)} chars, R6: {len(r6)} chars")
