# -*- coding: utf-8 -*-
import re

with open(r'c:\Proyectos\Proyecto Evaluaciones Nacionales\src\data\mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove preg-10 and preg-11
p1 = r"// 10\. Lectura - Inferencia Local\s*\{\s*id: 'preg-10'.*?fuente: 'Banco Institucional'\s*\},"
content = re.sub(p1, "", content, flags=re.DOTALL)

# Remove preg-16, preg-17, preg-18
p2 = r"// 16\. Lectura - Idea Principal\s*\{\s*id: 'preg-16'.*?fuente: 'Liberada Oficial'\s*\},"
content = re.sub(p2, "", content, flags=re.DOTALL)

with open(r'c:\Proyectos\Proyecto Evaluaciones Nacionales\src\data\mockData.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Old language questions removed from mockData.ts!")
