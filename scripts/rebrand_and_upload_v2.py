import os
import re
import sys
import zipfile
import urllib.request
import json
from pathlib import Path
from PIL import Image
import io

BASE_DIR = Path(__file__).parent.parent
JSON_PATH = BASE_DIR / 'src' / 'data' / 'biblioteca_paes.json'
ORIGINAL_JSON_PATH = Path('C:/Proyectos/Proyecto PAES WEB/Proyecto PAES WEB/biblioteca_paes.json')
ENV_PATH = BASE_DIR / '.env.local'
TEMP_DIR = BASE_DIR / 'scratch' / 'ppts_v2_temp'
TEMP_DIR.mkdir(parents=True, exist_ok=True)

# 1. Credenciales Supabase
env_vars = {}
with open(ENV_PATH, 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            k, v = line.split('=', 1)
            env_vars[k.strip()] = v.strip().strip('"').strip("'")

supabase_url = env_vars.get('VITE_SUPABASE_URL')
service_key = env_vars.get('SUPABASE_SERVICE_ROLE_KEY')

# 2. Cargar logos
logo_marco = Image.open(BASE_DIR / 'scratch' / 'sysget_logo_marco.png')
logo_portada = Image.open(BASE_DIR / 'scratch' / 'sysget_logo_clean.png')

# 3. Cargar catálogo original (de S3) y catálogo destino
with open(ORIGINAL_JSON_PATH, 'r', encoding='utf-8') as f:
    cat_original = json.load(f)

with open(JSON_PATH, 'r', encoding='utf-8') as f:
    cat_destino = json.load(f)

# Mapear títulos de PPTs a su URL original de S3
s3_map = {}
for item in cat_original:
    if item.get('tipo') == 'ppt':
        s3_map[item['id']] = item['url']

ppts_destino = [m for m in cat_destino if m.get('tipo') == 'ppt']
total_ppts = len(ppts_destino)

print(f"=== INICIANDO PIPELINE V2 DE REBRANDING INTEGRAL (TOTAL: {total_ppts} PPTs) ===")
print("Estrategia: Descargar original de S3, procesar con detección de color y marco, subir a pptx_v2/\n")

def procesar_presentacion(in_path, out_path):
    with zipfile.ZipFile(in_path, 'r') as zin, zipfile.ZipFile(out_path, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
        all_files = zin.namelist()
        
        # 1. Portada
        portada_target = None
        if 'ppt/slides/_rels/slide1.xml.rels' in all_files:
            s1_rels = zin.read('ppt/slides/_rels/slide1.xml.rels').decode('utf-8', errors='ignore')
            m = re.findall(r'Target="([^"]+media/[^"]+)"', s1_rels)
            if m:
                portada_target = 'ppt/' + m[0].replace('../', '')
        
        # 2. Marco
        marco_target = None
        if 'ppt/slideMasters/_rels/slideMaster1.xml.rels' in all_files:
            sm_rels = zin.read('ppt/slideMasters/_rels/slideMaster1.xml.rels').decode('utf-8', errors='ignore')
            m = re.findall(r'Target="([^"]+media/[^"]+)"', sm_rels)
            if m:
                marco_target = 'ppt/' + m[0].replace('../', '')
                
        if not marco_target:
            ref_counts = {}
            for f in all_files:
                if f.startswith('ppt/slides/_rels/slide') and f.endswith('.xml.rels') and 'slide1.xml.rels' not in f:
                    r_data = zin.read(f).decode('utf-8', errors='ignore')
                    targets = re.findall(r'Target="([^"]+media/[^"]+)"', r_data)
                    for t in targets:
                        full_t = 'ppt/' + t.replace('../', '')
                        ref_counts[full_t] = ref_counts.get(full_t, 0) + 1
            if ref_counts:
                marco_target = max(ref_counts.items(), key=lambda x: x[1])[0]

        for item in zin.infolist():
            data = zin.read(item.filename)
            fname = item.filename
            
            # --- PORTADA ---
            if fname == portada_target:
                try:
                    im = Image.open(io.BytesIO(data)).convert('RGBA')
                    w, h = im.size
                    bg_color = im.getpixel((int(w * 0.25), int(h * 0.45)))
                    
                    x_start = int(w * 0.16)
                    x_end = int(w * 0.52)
                    y_start = int(h * 0.48)
                    y_end = int(h * 0.68)
                    for y in range(y_start, y_end):
                        for x in range(x_start, x_end):
                            im.putpixel((x, y), bg_color)
                            
                    target_h = int(h * 0.11)
                    target_w = int(logo_portada.width * (target_h / logo_portada.height))
                    logo_resized = logo_portada.resize((target_w, target_h), Image.Resampling.LANCZOS)
                    paste_x = int(w * 0.19)
                    paste_y = y_start + (y_end - y_start - target_h) // 2
                    im.paste(logo_resized, (paste_x, paste_y), logo_resized)
                    
                    buf = io.BytesIO()
                    im.save(buf, format='PNG')
                    data = buf.getvalue()
                except Exception as e:
                    print(f"      [WARN Portada]: {e}")

            # --- MARCO ---
            elif fname == marco_target:
                try:
                    im = Image.open(io.BytesIO(data)).convert('RGBA')
                    w, h = im.size
                    
                    x_start = int(w * 0.12)
                    x_end = int(w * 0.44)
                    y_start = int(h * 0.87)
                    y_end = int(h * 0.995)
                    for y in range(y_start, y_end):
                        for x in range(x_start, x_end):
                            im.putpixel((x, y), (0, 0, 0, 0))
                            
                    target_h = int(h * 0.052)
                    target_w = int(logo_marco.width * (target_h / logo_marco.height))
                    logo_resized = logo_marco.resize((target_w, target_h), Image.Resampling.LANCZOS)
                    paste_x = int(w * 0.13)
                    paste_y = int(h * 0.92)
                    im.paste(logo_resized, (paste_x, paste_y), logo_resized)
                    
                    buf = io.BytesIO()
                    im.save(buf, format='PNG')
                    data = buf.getvalue()
                except Exception as e:
                    print(f"      [WARN Marco]: {e}")

            # --- LOGOS ADICIONALES ---
            elif fname == 'ppt/media/image17.png' or (fname.startswith('ppt/media/') and 'logo' in fname.lower()):
                trans = Image.new('RGBA', (100, 100), (0, 0, 0, 0))
                buf = io.BytesIO()
                trans.save(buf, format='PNG')
                data = buf.getvalue()

            # --- QR CODE ---
            elif fname == 'ppt/media/image3.png':
                trans = Image.new('RGBA', (180, 180), (0, 0, 0, 0))
                buf = io.BytesIO()
                trans.save(buf, format='PNG')
                data = buf.getvalue()

            # --- REDES SOCIALES ---
            elif fname in ['ppt/media/image12.png', 'ppt/media/image13.png', 'ppt/media/image14.png']:
                trans = Image.new('RGBA', (100, 100), (0, 0, 0, 0))
                buf = io.BytesIO()
                trans.save(buf, format='PNG')
                data = buf.getvalue()

            # --- SLIDES XML TEXTOS ---
            elif fname.startswith('ppt/slides/slide') and fname.endswith('.xml'):
                xml_str = data.decode('utf-8', errors='ignore')
                xml_str = re.sub(r'puntajenacional\.cl', 'sysgetsaber.cl', xml_str, flags=re.IGNORECASE)
                xml_str = re.sub(r'@puntajenacional', '@sysgetsaber', xml_str, flags=re.IGNORECASE)
                xml_str = re.sub(r'Puntaje Nacional Chile', 'Sysget Saber Chile', xml_str, flags=re.IGNORECASE)
                xml_str = re.sub(r'Puntaje Nacional', 'Sysget Saber', xml_str, flags=re.IGNORECASE)
                xml_str = re.sub(r'puntaje nacional', 'Sysget Saber', xml_str, flags=re.IGNORECASE)
                xml_str = re.sub(r'n9\.cl/svy4a', 'sysgetsaber.vercel.app', xml_str, flags=re.IGNORECASE)
                xml_str = re.sub(r'¡Participen!', 'Sysget Saber PAES', xml_str, flags=re.IGNORECASE)
                xml_str = re.sub(r'¿Puedo hacer preguntas\?', 'Preguntas y Consultas', xml_str, flags=re.IGNORECASE)
                xml_str = re.sub(r'Síguenos\s+en:', 'Sysget Saber:', xml_str, flags=re.IGNORECASE)
                data = xml_str.encode('utf-8')

            zout.writestr(item, data)

def upload_to_supabase(file_path, storage_subpath):
    url = f"{supabase_url}/storage/v1/object/materiales-educativos/{storage_subpath}"
    with open(file_path, 'rb') as f:
        data = f.read()
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"Bearer {service_key}",
            "apikey": service_key,
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "x-upsert": "true"
        },
        method="POST"
    )
    with urllib.request.urlopen(req) as resp:
        return resp.status == 200

exitos = 0
fallos = 0

for i, p in enumerate(ppts_destino):
    pid = p.get('id')
    titulo = p.get('titulo', f'PPT {i+1}')
    s3_url = s3_map.get(pid)
    
    # Si no lo encontramos por id, buscar por título o usar la url actual
    if not s3_url:
        match = next((item for item in cat_original if item.get('titulo') == titulo), None)
        if match:
            s3_url = match.get('url')
        else:
            s3_url = p.get('url') # fallback

    # Nombre de archivo limpio
    filename_raw = s3_url.split('/')[-1].split('?')[0]
    filename_base = filename_raw.replace('.pptx', '')
    subpath_v2 = f"pptx_v2/{filename_base}_sysget.pptx"
    new_public_url = f"{supabase_url}/storage/v1/object/public/materiales-educativos/{subpath_v2}"

    raw_local = TEMP_DIR / f"raw_{i}.pptx"
    clean_local = TEMP_DIR / f"clean_{i}.pptx"

    try:
        print(f"[{i+1}/{total_ppts}] {titulo}...")
        urllib.request.urlretrieve(s3_url, raw_local)
        
        procesar_presentacion(raw_local, clean_local)
        
        subido = upload_to_supabase(clean_local, subpath_v2)
        if subido:
            # Actualizar URL en el objeto del catálogo en memoria
            p['url'] = new_public_url
            exitos += 1
            print(f"       [OK] Subido a: {subpath_v2}")
        else:
            print(f"       [WARN] Error de subida HTTP")
            fallos += 1
    except Exception as e:
        print(f"       [ERROR]: {e}")
        fallos += 1
    finally:
        if raw_local.exists():
            try: os.remove(raw_local)
            except: pass
        if clean_local.exists():
            try: os.remove(clean_local)
            except: pass

    # Guardar progreso parcial cada 10 items
    if (i + 1) % 10 == 0 or (i + 1) == total_ppts:
        with open(JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(cat_destino, f, indent=2, ensure_ascii=False)
        print(f"\n--- Progreso: {i+1}/{total_ppts} guardado en JSON ---\n")

print("\n=======================================================")
print(f"REBRANDING V2 FINALIZADO:")
print(f" - Éxitos: {exitos} de {total_ppts}")
print(f" - Fallos: {fallos}")
print("=======================================================")
