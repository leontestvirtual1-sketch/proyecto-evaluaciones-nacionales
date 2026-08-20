import re
from collections import Counter

# Let's inspect len2mQuestionsMock, len2mJunioQuestionsMock, len2mAbrilQuestionsMock and mockData
with open('src/data/len2mQuestionsMock.ts', 'r', encoding='utf-8') as f:
    ago_text = f.read()

with open('src/data/len2mJunioQuestionsMock.ts', 'r', encoding='utf-8') as f:
    jun_text = f.read()

with open('src/data/len2mAbrilQuestionsMock.ts', 'r', encoding='utf-8') as f:
    abr_text = f.read()

with open('src/data/mockData.ts', 'r', encoding='utf-8') as f:
    mock_text = f.read()

def count_items(t, name):
    ids = re.findall(r'id:\s*[\'"](preg-[^\'"]+)[\'"]', t)
    tipos = re.findall(r'tipo:\s*[\'"]([^\'"]+)[\'"]', t)
    fuentes = re.findall(r'fuente:\s*[\'"]([^\'"]+)[\'"]', t)
    print(f"=== {name} ===")
    print(f"Total questions: {len(ids)}")
    print(f"Tipos: {Counter(tipos)}")
    print(f"Fuentes: {Counter(fuentes)}")
    return ids

ago_ids = count_items(ago_text, "Agosto 2026")
jun_ids = count_items(jun_text, "Junio 2026")
abr_ids = count_items(abr_text, "Abril 2026")

# In mockData.ts
mock_ids = re.findall(r'id:\s*[\'"](preg-[^\'"]+)[\'"]', mock_text)
asig2_in_mock = re.findall(r'id:\s*[\'"](preg-[^\'"]+)[\'"].*?asignaturaId:\s*[\'"]asig-2[\'"]', mock_text, re.DOTALL)
print(f"=== mockData.ts inline questions ===")
print(f"Total inline questions in mockData: {len(mock_ids)}")
print(f"asig-2 in mockData: {len(asig2_in_mock)}")

for mid in mock_ids:
    # check if asig-2
    pattern = rf'id:\s*[\'"]{mid}[\'"].*?asignaturaId:\s*[\'"]([^\'"]+)[\'"]'
    m = re.search(pattern, mock_text, re.DOTALL)
    if m and m.group(1) == 'asig-2':
        print(f"Inline asig-2 question: {mid}")
