import os
import sys

sys.path.append(r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts")
from process_all_paes_exams import process_single_exam

HIST_CONFIGS = [
    {
        "materia": "his",
        "asignaturaId": "asig-4",
        "maxQ": 65,
        "evalId": "eval-paes-his-2023-reg-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_historia\paes-oficial-historia-p2023.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-his-2023-reg-f113.json",
        "idPrefix": "preg-paes-his-23reg-",
        "titulo": "PAES Oficial Historia y Ciencias Sociales — Proceso 2023 (Forma 113 — Regular)"
    },
    {
        "materia": "his",
        "asignaturaId": "asig-4",
        "maxQ": 65,
        "evalId": "eval-paes-his-2024-inv-f111",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_historia\paes-invierno-oficial-historia-p2024.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-his-2024-inv-f111.json",
        "idPrefix": "preg-paes-his-24inv-",
        "titulo": "PAES Oficial Historia y Ciencias Sociales — Proceso 2024 (Forma 111 — Invierno)"
    },
    {
        "materia": "his",
        "asignaturaId": "asig-4",
        "maxQ": 65,
        "evalId": "eval-paes-his-2024-reg-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_historia\paes-regular-oficial-historia-p2024.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-his-2024-reg-f113.json",
        "idPrefix": "preg-paes-his-24reg-",
        "titulo": "PAES Oficial Historia y Ciencias Sociales — Proceso 2024 (Forma 113 — Regular)"
    },
    {
        "materia": "his",
        "asignaturaId": "asig-4",
        "maxQ": 65,
        "evalId": "eval-paes-his-2025-inv-f111",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_historia\paes-invierno-oficial-historia-p2025.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-his-2025-inv-f111.json",
        "idPrefix": "preg-paes-his-25inv-",
        "titulo": "PAES Oficial Historia y Ciencias Sociales — Proceso 2025 (Forma 111 — Invierno)"
    },
    {
        "materia": "his",
        "asignaturaId": "asig-4",
        "maxQ": 65,
        "evalId": "eval-paes-his-2025-reg-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_historia\paes-regular-oficial-historia-p2025.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-his-2025-reg-f113.json",
        "idPrefix": "preg-paes-his-25reg-",
        "titulo": "PAES Oficial Historia y Ciencias Sociales — Proceso 2025 (Forma 113 — Regular)"
    },
    {
        "materia": "his",
        "asignaturaId": "asig-4",
        "maxQ": 65,
        "evalId": "eval-paes-his-2026-inv-f111",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_historia\paes-invierno-oficial-historia-p2026.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-his-2026-inv-f111.json",
        "idPrefix": "preg-paes-his-26inv-",
        "titulo": "PAES Oficial Historia y Ciencias Sociales — Proceso 2026 (Forma 111 — Invierno)"
    },
    {
        "materia": "his",
        "asignaturaId": "asig-4",
        "maxQ": 65,
        "evalId": "eval-paes-his-2026-reg-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_historia\paes-regular-oficial-historia-p2026.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-his-2026-reg-f113.json",
        "idPrefix": "preg-paes-his-26reg-",
        "titulo": "PAES Oficial Historia y Ciencias Sociales — Proceso 2026 (Forma 113 — Regular)"
    }
]

for cfg in HIST_CONFIGS:
    try:
        process_single_exam(cfg)
    except Exception as e:
        print(f"❌ Error en {cfg['titulo']}: {e}")
