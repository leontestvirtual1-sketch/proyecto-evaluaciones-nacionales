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
ENV_PATH = BASE_DIR / '.env.local'
TEMP_DIR = BASE_DIR / 'scratch' / 'ppts_rebrand_temp'
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

# 3. Cargar catálogo
with open(JSON_PATH, 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

ppts = [m for m in catalogo if m.get('tipo') == 'ppt']
total_ppts = len(ppts)

print(f"=== INICIANDO REBRANDING INTEGRAL A SYSGET SABER EN {total_ppts} PPTs ===")
print("Objetivo: Sustituir puntajenacional.cl por Sysget Saber, quitar QR y redes sociales.\n")

def procesar_pptx(in_path, out_path):
    with zipfile.ZipFile(in_path, 'r') as zin, zipfile.ZipFile(out_path, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)

            # 1. Modificar marco (image1.png)
            if item.filename == 'ppt/media/image1.png':
                try:
                    im1 = Image.open(io.BytesIO(data))
                    # Limpiar zona del logo puntajenacional y estampar Sysget Saber
                    for y in range(1030, min(1095, im1.height)):
                        for x in range(140, min(800, im1.width)):
                            im1.putpixel((x, y), (0, 0, 0, 0))
                    
                    alto_deseado = 56
                    w_nuevo = int(logo_marco.width * (alto_deseado / logo_marco.height))
                    logo_resized = logo_marco.resize((w_nuevo, alto_deseado), Image.Resampling.LANCZOS)
                    im1.paste(logo_resized, (155, 1032), logo_resized)
                    
                    buf = io.BytesIO()
                    im1.save(buf, format='PNG')
                    data = buf.getvalue()
                except Exception as e:
                    print(f"   [WARN] No se pudo editar image1.png: {e}")

            # 2. Modificar portada (image2.png)
            elif item.filename == 'ppt/media/image2.png':
                try:
                    im2 = Image.open(io.BytesIO(data))
                    bg_color = (47, 101, 181, 255)
                    # Rellenar zona del logo antiguo en el recuadro azul
                    for y in range(570, min(715, im2.height)):
                        for x in range(365, min(835, im2.width)):
                            im2.putpixel((x, y), bg_color)
                    
                    # Pegar logo Sysget Saber blanco
                    alto_deseado = 90
                    w_nuevo = int(logo_portada.width * (alto_deseado / logo_portada.height))
                    logo_resized = logo_portada.resize((w_nuevo, alto_deseado), Image.Resampling.LANCZOS)
                    im2.paste(logo_resized, (380, 595), logo_resized)
                    
                    buf = io.BytesIO()
                    im2.save(buf, format='PNG')
                    data = buf.getvalue()
                except Exception as e:
                    print(f"   [WARN] No se pudo editar image2.png: {e}")

            # 3. Eliminar código QR (image3.png)
            elif item.filename == 'ppt/media/image3.png':
                try:
                    im_qr = Image.open(io.BytesIO(data))
                    trans_qr = Image.new('RGBA', im_qr.size, (0, 0, 0, 0))
                    buf = io.BytesIO()
                    trans_qr.save(buf, format='PNG')
                    data = buf.getvalue()
                except Exception:
                    pass

            # 4. Eliminar iconos de redes sociales (image12, image13, image14)
            elif item.filename in ['ppt/media/image12.png', 'ppt/media/image13.png', 'ppt/media/image14.png']:
                try:
                    trans_icon = Image.new('RGBA', (100, 100), (0, 0, 0, 0))
                    buf = io.BytesIO()
                    trans_icon.save(buf, format='PNG')
                    data = buf.getvalue()
                except Exception:
                    pass

            # 5. Modificar textos en XML de todas las diapositivas
            elif item.filename.startswith('ppt/slides/slide') and item.filename.endswith('.xml'):
                xml_str = data.decode('utf-8', errors='ignore')
                xml_str = re.sub(r'puntajenacional\.cl', 'sysgetsaber.cl', xml_str, flags=re.IGNORECASE)
                xml_str = re.sub(r'@puntajenacional', '@sysgetsaber', xml_str, flags=re.IGNORECASE)
                xml_str = re.sub(r'Puntaje Nacional Chile', 'Sysget Saber Chile', xml_str, flags=re.IGNORECASE)
                xml_str = re.sub(r'Puntaje Nacional', 'Sysget Saber', xml_str, flags=re.IGNORECASE)
                xml_str = re.sub(r'puntaje nacional', 'Sysget Saber', xml_str, flags=re.IGNORECASE)
                xml_str = re.sub(r'n9\.cl/svy4a', 'sysgetsaber.vercel.app', xml_str, flags=re.IGNORECASE)
                xml_str = re.sub(r'¡Participen!', 'Sysget Saber PAES', xml_str, flags=re.IGNORECASE)
                xml_str = re.sub(r'¿Puedo hacer preguntas\?', 'Preguntas y Consultas', xml_str, flags=re.IGNORECASE)
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

procesados = 0
errores = 0

for i, p in enumerate(ppts):
    curr_url = p.get('url', '')
    titulo = p.get('titulo', 'clase')
    storage_subpath = curr_url.split('/materiales-educativos/')[-1].split('?')[0]

    raw_path = TEMP_DIR / f"raw_{i}.pptx"
    clean_path = TEMP_DIR / f"clean_{i}.pptx"

    try:
        print(f"[{i+1}/{total_ppts}] Procesando: {titulo}...")
        urllib.request.urlretrieve(curr_url, raw_path)

        procesar_pptx(raw_path, clean_path)

        subido = upload_to_supabase(clean_path, storage_subpath)
        if subido:
            procesados += 1
            print(f"       [OK] Rebranding aplicado y subido a Supabase ({storage_subpath})")
        else:
            print(f"       [WARN] Error de subida para {titulo}")
            errores += 1

    except Exception as e:
        print(f"       [ERROR] Falló en {titulo}: {e}")
        errores += 1

    finally:
        if raw_path.exists():
            try: os.remove(raw_path)
            except: pass
        if clean_path.exists():
            try: os.remove(clean_path)
            except: pass

    if (i + 1) % 5 == 0:
        print(f"\n--- Progreso: {i+1}/{total_ppts} completadas ---\n")

print("\n=======================================================")
print(f"REBRANDING TOTAL FINALIZADO:")
print(f" - Total PPTs procesadas: {procesados} de {total_ppts}")
print(f" - Errores: {errores}")
print("=======================================================")

