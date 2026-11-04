"""
=======================================================
DESCARGADOR DE PRUEBAS PAES INVIERNO 2026 - DEMRE
=======================================================
Descarga automáticamente todas las PAES de Invierno
Proceso de Admisión 2026 y sus clavijeros desde demre.cl
=======================================================
"""

import os
import sys
import time
import requests
import json
from pathlib import Path

# ──────────────────────────────────────────────────────
# CONFIGURACIÓN
# ──────────────────────────────────────────────────────
BASE_URL = "https://demre.cl/publicaciones/pdf/"
OUTPUT_DIR = Path(__file__).parent / "pruebas_paes"

def cargar_catalogo():
    try:
        with open('catalogo_historico.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"{ROJO}Error: No se encontró 'catalogo_historico.json'. Ejecuta 'python scrape_paes.py' primero.{RESET}")
        return {"pruebas": [], "clavijeros": []}

# Cargar catálogo dinámico
CATALOGO_COMPLETO = cargar_catalogo()

# Colores para consola
VERDE  = "\033[92m"
ROJO   = "\033[91m"
AMARI  = "\033[93m"
CYAN   = "\033[96m"
RESET  = "\033[0m"
BOLD   = "\033[1m"



# ──────────────────────────────────────────────────────
# FUNCIONES
# ──────────────────────────────────────────────────────

def print_banner():
    print(f"""
{CYAN}{BOLD}
==============================================================
         DESCARGADOR PAES INVIERNO 2026 - DEMRE              
         Proceso de Admisión 2026 | demre.cl                 
==============================================================
{RESET}""")

def barra_progreso(actual, total, ancho=40):
    porcentaje = actual / total
    lleno = int(ancho * porcentaje)
    barra = "█" * lleno + "░" * (ancho - lleno)
    return f"[{barra}] {actual}/{total} ({porcentaje*100:.0f}%)"

def descargar_pdf(archivo, carpeta_destino, nombre_display, url):
    """Descarga un PDF desde DEMRE y lo guarda localmente."""
    ruta_destino = carpeta_destino / archivo
    
    # Verificar si ya existe
    if ruta_destino.exists():
        print(f"  {AMARI}⚡ Ya existe:{RESET} {archivo}")
        return True, "existe"
    
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/pdf,*/*",
            "Referer": "https://demre.cl/"
        }
        
        print(f"  {CYAN}⬇  Descargando:{RESET} {nombre_display}...")
        
        # Descarga con streaming para mostrar progreso
        response = requests.get(url, stream=True, headers=headers, timeout=30)
        
        if response.status_code != 200:
            print(f"  {ROJO}✗ Error HTTP {response.status_code}{RESET} ({url})")
            return False, f"HTTP {response.status_code}"
            
        total_size = int(response.headers.get('content-length', 0))
        
        with open(ruta_destino, 'wb') as f:
            if total_size == 0:
                f.write(response.content)
            else:
                descargado = 0
                for data in response.iter_content(chunk_size=8192):
                    descargado += len(data)
                    f.write(data)
                    print(f"\r  {barra_progreso(descargado, total_size)}", end="")
                    
        print(f"\r  {VERDE}✓ Descargado:{RESET} {archivo} ({(total_size/(1024*1024)):.2f} MB){' '*20}")
        return True, "descargado"
        
    except requests.exceptions.RequestException as e:
        print(f"\r  {ROJO}✗ Error conexión:{RESET} {str(e)[:60]}")
        return False, "conexion"
    except Exception as e:
        print(f"\r  {ROJO}✗ Error:{RESET} {str(e)[:80]}")
        return False, "error"

def crear_estructura():
    """Crea la estructura de carpetas."""
    carpetas = {
        "pruebas": OUTPUT_DIR / "pruebas",
        "clavijeros": OUTPUT_DIR / "clavijeros",
    }
    for nombre, ruta in carpetas.items():
        ruta.mkdir(parents=True, exist_ok=True)
    return carpetas

def descargar_todo():
    """Función principal que descarga todas las pruebas y clavijeros del catálogo histórico."""
    print_banner()
    
    if not CATALOGO_COMPLETO:
        return
        
    carpetas = crear_estructura()
    
    resultados = {
        "descargados": [],
        "existentes": [],
        "errores": []
    }
    
    # Filtrar catálogo
    pruebas = []
    clavijeros = []
    
    for item in CATALOGO_COMPLETO:
        if "temario" in item["archivo"].lower() or "revista" in item["archivo"].lower():
            continue
            
        if item["tipo"] == "prueba":
            pruebas.append(item)
        else:
            clavijeros.append(item)
    
    # ── DESCARGAR PRUEBAS ──────────────────────────
    print(f"\n{BOLD}{CYAN}━━━ PRUEBAS HISTÓRICAS ({len(pruebas)} archivos) ━━━{RESET}")
    
    for i, prueba in enumerate(pruebas, 1):
        print(f"\n  [{i}/{len(pruebas)}] {BOLD}{prueba['materia'].upper()} ({prueba['anio']}){RESET}")
        ok, estado = descargar_pdf(prueba["archivo"], carpetas["pruebas"], f"{prueba['materia']} {prueba['anio']}", prueba["url"])
        
        if ok:
            if estado == "descargado":
                resultados["descargados"].append(prueba["archivo"])
            else:
                resultados["existentes"].append(prueba["archivo"])
        else:
            resultados["errores"].append({"nombre": prueba["archivo"], "razon": estado})
        
        if ok and estado == "descargado":
            time.sleep(1.0)
    
    # ── DESCARGAR CLAVIJEROS ──────────────────────────
    print(f"\n{BOLD}{CYAN}━━━ CLAVIJEROS HISTÓRICOS ({len(clavijeros)} archivos) ━━━{RESET}")
    
    for i, clav in enumerate(clavijeros, 1):
        print(f"\n  [{i}/{len(clavijeros)}] {BOLD}Clavijero {clav['materia'].upper()} ({clav['anio']}){RESET}")
        ok, estado = descargar_pdf(clav["archivo"], carpetas["clavijeros"], f"Clavijero {clav['materia']} {clav['anio']}", clav["url"])
        
        if ok:
            if estado == "descargado":
                resultados["descargados"].append(clav["archivo"])
            else:
                resultados["existentes"].append(clav["archivo"])
        else:
            resultados["errores"].append({"nombre": clav["archivo"], "razon": estado})
        
        if ok and estado == "descargado":
            time.sleep(1.0)
    
    # ── RESUMEN ──────────────────────────────────────
    print(f"\n\n{BOLD}{'═'*60}{RESET}")
    print(f"{BOLD}RESUMEN DE DESCARGA{RESET}")
    print(f"{'═'*60}")
    print(f"  {VERDE}✓ Descargados:{RESET}  {len(resultados['descargados'])}")
    print(f"  {AMARI}⚡ Ya existían:{RESET}  {len(resultados['existentes'])}")
    print(f"  {ROJO}✗ Con errores:{RESET}  {len(resultados['errores'])}")
    
    if resultados["errores"]:
        print(f"\n{ROJO}Archivos con error:{RESET}")
        for err in resultados["errores"]:
            print(f"  • {err['nombre']} → {err['razon']}")
    
    print(f"\n{VERDE}Archivos guardados en:{RESET}")
    print(f"  {OUTPUT_DIR}")
    print(f"{'═'*60}\n")
    
    return resultados

# ──────────────────────────────────────────────────────
# ENTRY POINT
# ──────────────────────────────────────────────────────
if __name__ == "__main__":
    try:
        descargar_todo()
    except KeyboardInterrupt:
        print(f"\n\n{AMARI}Descarga interrumpida por el usuario.{RESET}")
        sys.exit(0)
