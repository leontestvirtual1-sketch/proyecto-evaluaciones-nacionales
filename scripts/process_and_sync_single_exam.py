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

def process_exam(cfg):
    eval_id = cfg["evalId"]
    pdf_path = cfg["pdfPath"]
    claves_path = cfg["clavesPath"]
    id_prefix = cfg["idPrefix"]
    max_q = cfg["maxQ"]

    print(f"\n========================================================")
    print(f"🚀 Procesando: {cfg['titulo']}")
    print(f"========================================================")

    # Load claves
    with open(claves_path, "r", encoding="utf-8") as f:
        claves_data = json.load(f)
    claves = claves_data.get("claves", claves_data)

    out_fig_dir = rf"C:\Proyectos\Proyecto Evaluaciones Nacionales\public\preguntas\{eval_id}"
    os.makedirs(out_fig_dir, exist_ok=True)

    doc = fitz.open(pdf_path)
    q_list = detect_questions(doc, max_q)
    print(f"  Detected questions: {len(q_list)} / {max_q}")

    # Process all questions
    parsed = []
    for idx, q in enumerate(q_list):
        next_q = q_list[idx + 1] if idx + 1 < len(q_list) else None
        res = parse_question(doc, q, next_q, out_fig_dir, eval_id)
        parsed.append(res)

    print(f"  Parsed {len(parsed)} questions. Uploading figures to Supabase Storage...")

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
                
                res_up = supabase.storage.from_("evaluaciones-media").upload(
                    path=storage_path,
                    file=img_bytes,
                    file_options={"content-type": "image/png", "upsert": "true"}
                )
                pub_url = f"{env['VITE_SUPABASE_URL']}/storage/v1/object/public/evaluaciones-media/{storage_path}"
                uploaded_urls[num] = pub_url
                p["imagen_url"] = pub_url

    print(f"  Uploaded {len(uploaded_urls)} figures to Storage.")

    # Prepare DB updates
    admin_id = "99cf9f8f-720f-4e74-b8d9-eae95208b421"
    updates = []
    pregunta_ids = []
    for p in parsed:
        num = p["numero"]
        q_id = f"{id_prefix}{num:02d}"
        pregunta_ids.append(q_id)
        clave = str(claves.get(str(num), claves.get(num, "A"))).upper()

        alts = p["alternativas"]
        if len(alts) < 4:
            # fill visual alternatives if graphic question
            existing_letters = {a["letra"] for a in alts}
            for l in ["A", "B", "C", "D"]:
                if l not in existing_letters:
                    alts.append({
                        "letra": l,
                        "texto": f"Opción {l} (ver figura)",
                        "es_correcta": False
                    })
            alts.sort(key=lambda a: a["letra"])

        # Mark correct answer
        for a in alts:
            a["es_correcta"] = (a["letra"] == clave)

        update_payload = {
            "id": q_id,
            "propietario_id": admin_id,
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
    print(f"  Upserting {len(updates)} questions to Supabase 'preguntas'...")
    batch_size = 25
    for i in range(0, len(updates), batch_size):
        chunk = updates[i:i + batch_size]
        res = supabase.from_("preguntas").upsert(chunk).execute()
        print(f"    Upserted chunk {i+1} to {min(i+batch_size, len(updates))}")

    # Update evaluacion
    supabase.from_("evaluaciones").update({
        "pregunta_ids": pregunta_ids,
        "total_preguntas": len(pregunta_ids),
        "updated_at": "now()"
    }).eq("id", eval_id).execute()

    print(f"  ✅ {cfg['titulo']} sincronizada exitosamente con {len(updates)} preguntas y {len(uploaded_urls)} figuras.")

if __name__ == "__main__":
    test_cfg = {
        "materia": "m1",
        "asignaturaId": "asig-1",
        "maxQ": 65,
        "evalId": "eval-paes-mat1-2024-reg-f113",
        "pdfPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\evaluaciones_fuente\paes_m1\paes-regular-oficial-matematica1-p2024.pdf",
        "clavesPath": r"C:\Proyectos\Proyecto Evaluaciones Nacionales\scripts\data\claves_oficiales\paes-mat1-2024-reg-f113.json",
        "idPrefix": "preg-paes-mat1-24reg-",
        "titulo": "PAES Oficial Competencia Matemática 1 (M1) — Proceso 2024 (Forma 113 — Regular)"
    }
    process_exam(test_cfg)
