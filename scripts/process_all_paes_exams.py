import os
import sys
import json
import fitz
from supabase import create_client

sys.path.append(r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\lib")
from paes_parser import detect_questions, parse_question

# 1. Load env
env_path = r"C:\Proyectos\Proyecto Evaluaciones Nacionales\.env.local"
env = {}
with open(env_path, "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith("#"): continue
        if "=" in line:
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip("'\"")

supabase = create_client(env["VITE_SUPABASE_URL"], env["SUPABASE_SERVICE_ROLE_KEY"])
ADMIN_ID = "99cf9f8f-720f-4e74-b8d9-eae95208b421"

def process_single_exam(cfg):
    eval_id = cfg["evalId"]
    pdf_path = cfg["pdfPath"]
    claves_path = cfg["clavesPath"]
    id_prefix = cfg["idPrefix"]
    max_q = cfg["maxQ"]

    print(f"\n========================================================")
    print(f"🚀 Procesando: {cfg['titulo']}")
    print(f"========================================================")

    if not os.path.exists(pdf_path):
        print(f"  ❌ PDF no encontrado: {pdf_path}")
        return

    # Load claves
    claves = {}
    if os.path.exists(claves_path):
        with open(claves_path, "r", encoding="utf-8") as f:
            claves_data = json.load(f)
        claves = claves_data.get("claves", claves_data)
    else:
        print(f"  ⚠️ Claves no encontradas: {claves_path}, se usará 'A' como fallback")

    out_fig_dir = rf"C:\Proyectos\Proyecto Evaluaciones Nacionales\public\preguntas\{eval_id}"
    os.makedirs(out_fig_dir, exist_ok=True)

    doc = fitz.open(pdf_path)
    q_list = detect_questions(doc, max_q)
    print(f"  Detected questions: {len(q_list)} / {max_q}")

    if len(q_list) == 0:
        print(f"  ❌ No se detectaron preguntas en {pdf_path}")
        return

    parsed = []
    for idx, q in enumerate(q_list):
        next_q = q_list[idx + 1] if idx + 1 < len(q_list) else None
        res = parse_question(doc, q, next_q, out_fig_dir, eval_id)
        parsed.append(res)

    # Upload figures to Supabase Storage
    uploaded_urls = {}
    for p in parsed:
        if p["imagen_url"]:
            num = p["numero"]
            img_name = f"figura_p{num:02d}.png"
            local_path = os.path.join(out_fig_dir, img_name)
            if os.path.exists(local_path):
                storage_path = f"{eval_id}/{img_name}"
                with open(local_path, "rb") as f_img:
                    img_bytes = f_img.read()
                
                try:
                    res_up = supabase.storage.from_("evaluaciones-media").upload(
                        path=storage_path,
                        file=img_bytes,
                        file_options={"content-type": "image/png", "upsert": "true"}
                    )
                    pub_url = f"{env['VITE_SUPABASE_URL']}/storage/v1/object/public/evaluaciones-media/{storage_path}"
                    uploaded_urls[num] = pub_url
                    p["imagen_url"] = pub_url
                except Exception as e:
                    print(f"  ⚠️ Error subiendo {storage_path}: {e}")

    # Prepare DB updates
    updates = []
    pregunta_ids = []
    for p in parsed:
        num = p["numero"]
        q_id = f"{id_prefix}{num:02d}"
        pregunta_ids.append(q_id)
        clave = str(claves.get(str(num), claves.get(num, "A"))).upper()

        alts = p["alternativas"]
        if len(alts) < 4:
            existing_letters = {a["letra"] for a in alts}
            for l in ["A", "B", "C", "D"]:
                if l not in existing_letters:
                    alts.append({
                        "letra": l,
                        "texto": f"Opción {l} (ver figura)",
                        "es_correcta": False
                    })
            alts.sort(key=lambda a: a["letra"])

        for a in alts:
            a["es_correcta"] = (a["letra"] == clave)

        update_payload = {
            "id": q_id,
            "propietario_id": ADMIN_ID,
            "asignatura_id": cfg["asignaturaId"],
            "eje_tematico_id": f"eje-{cfg['materia']}-1",
            "habilidad_id": f"hab-{cfg['materia']}-1",
            "tipo": "seleccion_multiple",
            "nivel": "4° Medio",
            "dificultad": "media",
            "puntaje": 1,
            "fuente": cfg["titulo"],
            "enunciado": p["enunciado"],
            "alternativas": alts,
            "respuesta_correcta": clave,
            "imagen_url": p["imagen_url"],
            "updated_at": "now()"
        }
        updates.append(update_payload)

    # Batch upsert to Supabase
    batch_size = 25
    for i in range(0, len(updates), batch_size):
        chunk = updates[i:i + batch_size]
        res = supabase.from_("preguntas").upsert(chunk).execute()

    # Update evaluacion
    supabase.from_("evaluaciones").update({
        "pregunta_ids": pregunta_ids,
        "total_preguntas": len(pregunta_ids),
        "updated_at": "now()"
    }).eq("id", eval_id).execute()

    print(f"  ✅ {cfg['titulo']}: {len(updates)} preguntas sincronizadas, {len(uploaded_urls)} figuras en Storage.")

# Definitions for all 14 Matemática and 14 Ciencias
ALL_CONFIGS = [
    # --- M1 (Matemática 1) ---
    {
        "materia": "m1",
        "asignaturaId": "asig-1",
        "maxQ": 65,
        "evalId": "eval-paes-mat1-2023-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_m1\paes-oficial-matematica1-p2023.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-mat1-2023-reg-f113.json",
        "idPrefix": "preg-paes-mat1-23reg-",
        "titulo": "PAES Oficial Competencia Matemática 1 (M1) — Proceso 2023 (Forma 113 — Regular)"
    },
    {
        "materia": "m1",
        "asignaturaId": "asig-1",
        "maxQ": 65,
        "evalId": "eval-paes-mat1-2024-inv-f111",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_m1\paes-invierno-oficial-matematica1-p2024.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-mat1-2024-inv-f111.json",
        "idPrefix": "preg-paes-mat1-24inv-",
        "titulo": "PAES Oficial Competencia Matemática 1 (M1) — Proceso 2024 (Forma 111 — Invierno)"
    },
    {
        "materia": "m1",
        "asignaturaId": "asig-1",
        "maxQ": 65,
        "evalId": "eval-paes-mat1-2024-reg-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_m1\paes-regular-oficial-matematica1-p2024.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-mat1-2024-reg-f113.json",
        "idPrefix": "preg-paes-mat1-24reg-",
        "titulo": "PAES Oficial Competencia Matemática 1 (M1) — Proceso 2024 (Forma 113 — Regular)"
    },
    {
        "materia": "m1",
        "asignaturaId": "asig-1",
        "maxQ": 65,
        "evalId": "eval-paes-mat1-2025-inv-f111",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_m1\paes-invierno-oficial-matematica1-p2025.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-mat1-2025-inv-f111.json",
        "idPrefix": "preg-paes-mat1-25inv-",
        "titulo": "PAES Oficial Competencia Matemática 1 (M1) — Proceso 2025 (Forma 111 — Invierno)"
    },
    {
        "materia": "m1",
        "asignaturaId": "asig-1",
        "maxQ": 65,
        "evalId": "eval-paes-mat1-2025-reg-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_m1\paes-regular-oficial-matematica1-p2025.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-mat1-2025-reg-f113.json",
        "idPrefix": "preg-paes-mat1-25reg-",
        "titulo": "PAES Oficial Competencia Matemática 1 (M1) — Proceso 2025 (Forma 113 — Regular)"
    },
    {
        "materia": "m1",
        "asignaturaId": "asig-1",
        "maxQ": 65,
        "evalId": "eval-paes-mat1-2026-inv-f111",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_m1\paes-invierno-oficial-matematica1-p2026.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-mat1-2026-inv-f111.json",
        "idPrefix": "preg-paes-mat1-26inv-",
        "titulo": "PAES Oficial Competencia Matemática 1 (M1) — Proceso 2026 (Forma 111 — Invierno)"
    },
    {
        "materia": "m1",
        "asignaturaId": "asig-1",
        "maxQ": 65,
        "evalId": "eval-paes-mat1-2026-reg-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_m1\paes-regular-oficial-matematica1-p2026.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-mat1-2026-reg-f113.json",
        "idPrefix": "preg-paes-mat1-26reg-",
        "titulo": "PAES Oficial Competencia Matemática 1 (M1) — Proceso 2026 (Forma 113 — Regular)"
    },

    # --- M2 (Matemática 2) ---
    {
        "materia": "m2",
        "asignaturaId": "asig-9",
        "maxQ": 55,
        "evalId": "eval-paes-mat2-2023-reg-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_m2\paes-oficial-matematica2-p2023.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-mat2-2023-reg-f113.json",
        "idPrefix": "preg-paes-mat2-23reg-",
        "titulo": "PAES Oficial Competencia Matemática 2 (M2) — Proceso 2023 (Forma 113 — Regular)"
    },
    {
        "materia": "m2",
        "asignaturaId": "asig-9",
        "maxQ": 55,
        "evalId": "eval-paes-mat2-2024-inv-f111",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_m2\paes-invierno-oficial-matematica2-p2024.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-mat2-2024-inv-f111.json",
        "idPrefix": "preg-paes-mat2-24inv-",
        "titulo": "PAES Oficial Competencia Matemática 2 (M2) — Proceso 2024 (Forma 111 — Invierno)"
    },
    {
        "materia": "m2",
        "asignaturaId": "asig-9",
        "maxQ": 55,
        "evalId": "eval-paes-mat2-2024-reg-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_m2\paes-regular-oficial-matematica2-p2024.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-mat2-2024-reg-f113.json",
        "idPrefix": "preg-paes-mat2-24reg-",
        "titulo": "PAES Oficial Competencia Matemática 2 (M2) — Proceso 2024 (Forma 113 — Regular)"
    },
    {
        "materia": "m2",
        "asignaturaId": "asig-9",
        "maxQ": 55,
        "evalId": "eval-paes-mat2-2025-inv-f111",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_m2\paes-invierno-oficial-matematica2-p2025.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-mat2-2025-inv-f111.json",
        "idPrefix": "preg-paes-mat2-25inv-",
        "titulo": "PAES Oficial Competencia Matemática 2 (M2) — Proceso 2025 (Forma 111 — Invierno)"
    },
    {
        "materia": "m2",
        "asignaturaId": "asig-9",
        "maxQ": 55,
        "evalId": "eval-paes-mat2-2025-reg-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_m2\paes-regular-oficial-matematica2-p2025.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-mat2-2025-reg-f113.json",
        "idPrefix": "preg-paes-mat2-25reg-",
        "titulo": "PAES Oficial Competencia Matemática 2 (M2) — Proceso 2025 (Forma 113 — Regular)"
    },
    {
        "materia": "m2",
        "asignaturaId": "asig-9",
        "maxQ": 55,
        "evalId": "eval-paes-mat2-2026-inv-f111",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_m2\paes-invierno-oficial-matematica2-p2026.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-mat2-2026-inv-f111.json",
        "idPrefix": "preg-paes-mat2-26inv-",
        "titulo": "PAES Oficial Competencia Matemática 2 (M2) — Proceso 2026 (Forma 111 — Invierno)"
    },
    {
        "materia": "m2",
        "asignaturaId": "asig-9",
        "maxQ": 55,
        "evalId": "eval-paes-mat2-2026-reg-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_m2\paes-regular-oficial-matematica2-p2026.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-mat2-2026-reg-f113.json",
        "idPrefix": "preg-paes-mat2-26reg-",
        "titulo": "PAES Oficial Competencia Matemática 2 (M2) — Proceso 2026 (Forma 113 — Regular)"
    },

    # --- CIENCIAS: FÍSICA ---
    {
        "materia": "fis",
        "asignaturaId": "asig-6",
        "maxQ": 80,
        "evalId": "eval-paes-fis-2023-reg-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_fisica\paes-oficial-ciencias-fisica-p2023.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-fis-2023-reg-f113.json",
        "idPrefix": "preg-paes-fis-23reg-",
        "titulo": "PAES Oficial Ciencias — Física — Proceso 2023 (Forma 113 — Regular)"
    },
    {
        "materia": "fis",
        "asignaturaId": "asig-6",
        "maxQ": 80,
        "evalId": "eval-paes-fis-2024-inv-f111",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_fisica\paes-invierno-oficial-ciencias-fisica-p2024.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-fis-2024-inv-f111.json",
        "idPrefix": "preg-paes-fis-24inv-",
        "titulo": "PAES Oficial Ciencias — Física — Proceso 2024 (Forma 111 — Invierno)"
    },
    {
        "materia": "fis",
        "asignaturaId": "asig-6",
        "maxQ": 80,
        "evalId": "eval-paes-fis-2024-reg-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_fisica\paes-regular-oficial-ciencias-fisica-p2024.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-fis-2024-reg-f113.json",
        "idPrefix": "preg-paes-fis-24reg-",
        "titulo": "PAES Oficial Ciencias — Física — Proceso 2024 (Forma 113 — Regular)"
    },
    {
        "materia": "fis",
        "asignaturaId": "asig-6",
        "maxQ": 80,
        "evalId": "eval-paes-fis-2025-inv-f111",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_fisica\paes-invierno-oficial-ciencias-fisica-p2025.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-fis-2025-inv-f111.json",
        "idPrefix": "preg-paes-fis-25inv-",
        "titulo": "PAES Oficial Ciencias — Física — Proceso 2025 (Forma 111 — Invierno)"
    },
    {
        "materia": "fis",
        "asignaturaId": "asig-6",
        "maxQ": 80,
        "evalId": "eval-paes-fis-2025-reg-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_fisica\paes-regular-oficial-ciencias-fisica-p2025.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-fis-2025-reg-f113.json",
        "idPrefix": "preg-paes-fis-25reg-",
        "titulo": "PAES Oficial Ciencias — Física — Proceso 2025 (Forma 113 — Regular)"
    },
    {
        "materia": "fis",
        "asignaturaId": "asig-6",
        "maxQ": 80,
        "evalId": "eval-paes-fis-2026-inv-f111",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_fisica\paes-invierno-oficial-ciencias-fisica-p2026.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-fis-2026-inv-f111.json",
        "idPrefix": "preg-paes-fis-26inv-",
        "titulo": "PAES Oficial Ciencias — Física — Proceso 2026 (Forma 111 — Invierno)"
    },
    {
        "materia": "fis",
        "asignaturaId": "asig-6",
        "maxQ": 80,
        "evalId": "eval-paes-fis-2026-reg-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_fisica\paes-regular-oficial-ciencias-fisica-p2026.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-fis-2026-reg-f113.json",
        "idPrefix": "preg-paes-fis-26reg-",
        "titulo": "PAES Oficial Ciencias — Física — Proceso 2026 (Forma 113 — Regular)"
    },

    # --- CIENCIAS: QUÍMICA ---
    {
        "materia": "qui",
        "asignaturaId": "asig-7",
        "maxQ": 80,
        "evalId": "eval-paes-qui-2023-reg-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_quimica\paes-oficial-ciencias-quimica-p2023.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-qui-2023-reg-f113.json",
        "idPrefix": "preg-paes-qui-23reg-",
        "titulo": "PAES Oficial Ciencias — Química — Proceso 2023 (Forma 113 — Regular)"
    },
    {
        "materia": "qui",
        "asignaturaId": "asig-7",
        "maxQ": 80,
        "evalId": "eval-paes-qui-2024-inv-f111",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_quimica\paes-invierno-oficial-ciencias-quimica-p2024.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-qui-2024-inv-f111.json",
        "idPrefix": "preg-paes-qui-24inv-",
        "titulo": "PAES Oficial Ciencias — Química — Proceso 2024 (Forma 111 — Invierno)"
    },
    {
        "materia": "qui",
        "asignaturaId": "asig-7",
        "maxQ": 80,
        "evalId": "eval-paes-qui-2024-reg-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_quimica\paes-regular-oficial-ciencias-quimica-p2024.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-qui-2024-reg-f113.json",
        "idPrefix": "preg-paes-qui-24reg-",
        "titulo": "PAES Oficial Ciencias — Química — Proceso 2024 (Forma 113 — Regular)"
    },
    {
        "materia": "qui",
        "asignaturaId": "asig-7",
        "maxQ": 80,
        "evalId": "eval-paes-qui-2025-inv-f111",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_quimica\paes-invierno-oficial-ciencias-quimica-p2025.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-qui-2025-inv-f111.json",
        "idPrefix": "preg-paes-qui-25inv-",
        "titulo": "PAES Oficial Ciencias — Química — Proceso 2025 (Forma 111 — Invierno)"
    },
    {
        "materia": "qui",
        "asignaturaId": "asig-7",
        "maxQ": 80,
        "evalId": "eval-paes-qui-2025-reg-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_quimica\paes-regular-oficial-ciencias-quimica-p2025.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-qui-2025-reg-f113.json",
        "idPrefix": "preg-paes-qui-25reg-",
        "titulo": "PAES Oficial Ciencias — Química — Proceso 2025 (Forma 113 — Regular)"
    },
    {
        "materia": "qui",
        "asignaturaId": "asig-7",
        "maxQ": 80,
        "evalId": "eval-paes-qui-2026-inv-f111",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_quimica\paes-invierno-oficial-ciencias-quimica-p2026.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-qui-2026-inv-f111.json",
        "idPrefix": "preg-paes-qui-26inv-",
        "titulo": "PAES Oficial Ciencias — Química — Proceso 2026 (Forma 111 — Invierno)"
    },
    {
        "materia": "qui",
        "asignaturaId": "asig-7",
        "maxQ": 80,
        "evalId": "eval-paes-qui-2026-reg-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_quimica\paes-regular-oficial-ciencias-quimica-p2026.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-qui-2026-reg-f113.json",
        "idPrefix": "preg-paes-qui-26reg-",
        "titulo": "PAES Oficial Ciencias — Química — Proceso 2026 (Forma 113 — Regular)"
    }
]

def main():
    print(f"🎯 Iniciando procesamiento y sincronización de {len(ALL_CONFIGS)} evaluaciones PAES...")
    for idx, cfg in enumerate(ALL_CONFIGS):
        print(f"\n[{idx+1}/{len(ALL_CONFIGS)}] ----------------------------------------")
        try:
            process_single_exam(cfg)
        except Exception as e:
            print(f"  ❌ Error procesando {cfg['titulo']}: {e}")

    print("\n🎉 Proceso completado exitosamente para todas las evaluaciones.")

if __name__ == "__main__":
    main()

