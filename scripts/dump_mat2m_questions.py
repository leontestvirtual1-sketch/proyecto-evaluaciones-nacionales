import json

with open("scratch/supabase_mat2m_e3_current.json", "r", encoding="utf-8") as f:
    questions = json.load(f)

with open("scratch/dump_mat2m_analysis.txt", "w", encoding="utf-8") as out:
    out.write(f"Total questions: {len(questions)}\n")
    for q in questions:
        qid = q.get('id')
        enunciado = q.get('enunciado', '')
        alts = q.get('alternativas', [])
        rc = q.get('respuesta_correcta')
        img = q.get('imagen_url')
        out.write(f"\n==================== {qid} | RC: {rc} | IMG: {img} ====================\n")
        out.write(f"ENUNCIADO:\n{enunciado}\n")
        out.write("ALTERNATIVAS:\n")
        for alt in alts:
            out.write(f"  [{alt.get('letra')}] (correcta={alt.get('es_correcta')}): {alt.get('texto')}\n")
