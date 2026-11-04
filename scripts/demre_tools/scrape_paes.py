import requests
from bs4 import BeautifulSoup
import json
from urllib.parse import urljoin, urlparse

BASE_URL = "https://demre.cl/publicaciones/"
AÑOS = [2022, 2023, 2024, 2025, 2026]

def is_valid_url(url):
    parsed = urlparse(url)
    if "demre.cl" not in parsed.netloc: return False
    if "publicaciones" not in parsed.path: return False
    return True

def crawl_for_pdfs():
    visited = set()
    queue = []
    
    for anio in AÑOS:
        queue.append((f"{BASE_URL}listado-{anio}", 0, anio))
        
    pdfs_found = []
    
    while queue:
        url, depth, anio = queue.pop(0)
        
        if url in visited or depth > 3:
            continue
        visited.add(url)
        
        try:
            r = requests.get(url, timeout=10)
            if r.status_code != 200: continue
            soup = BeautifulSoup(r.text, 'html.parser')
            
            for a in soup.find_all('a', href=True):
                href = a['href']
                full_url = urljoin(url, href)
                full_url = full_url.split('#')[0]
                
                if full_url.endswith('.pdf'):
                    lower_url = full_url.lower()
                    if any(x in lower_url for x in ['paes', 'ptu', 'pdt', 'prueba', 'clavijero', 'oficial']):
                        if full_url not in [p['url'] for p in pdfs_found]:
                            if "temario" in lower_url:
                                tipo = "temario"
                            elif "revista" in lower_url:
                                tipo = "revista"
                            elif "clavijero" in lower_url or "clave" in lower_url:
                                tipo = "clavijero"
                            else:
                                tipo = "prueba"
                            
                            materia = "desconocida"
                            if "matematica1" in lower_url or "matematica 1" in lower_url or "m1" in lower_url: materia = "m1"
                            elif "matematica2" in lower_url or "matematica 2" in lower_url or "m2" in lower_url: materia = "m2"
                            elif "historia" in lower_url: materia = "historia"
                            elif "lectora" in lower_url or "lenguaje" in lower_url or "comprension" in lower_url: materia = "lectora"
                            elif "biologia" in lower_url: materia = "biologia"
                            elif "quimica" in lower_url: materia = "quimica"
                            elif "fisica" in lower_url: materia = "fisica"
                            elif "tp" in lower_url or "tecnico" in lower_url: materia = "tp"
                            elif "matematica" in lower_url: materia = "matematica"
                            elif "ciencias" in lower_url: materia = "ciencias"

                            pdfs_found.append({
                                "url": full_url,
                                "archivo": full_url.split('/')[-1],
                                "anio": anio,
                                "tipo": tipo,
                                "materia": materia
                            })
                            print(f"[{anio}] -> PDF ENCONTRADO: {full_url.split('/')[-1]}")
                
                elif is_valid_url(full_url):
                    lower_href = href.lower()
                    if any(str(yr) in lower_href for yr in AÑOS) or any(x in lower_href for x in ['paes', 'ptu', 'pdt', 'prueba', 'clavijero']):
                        if full_url not in visited:
                            queue.append((full_url, depth + 1, anio))
        except Exception as e:
            print(f"Error en {url}: {e}")
            
    with open('catalogo_historico.json', 'w', encoding='utf-8') as f:
        json.dump(pdfs_found, f, indent=2, ensure_ascii=False)
        
    print(f"\nExploración terminada. Se encontraron {len(pdfs_found)} PDFs.")

if __name__ == "__main__":
    print("Iniciando crawler...")
    crawl_for_pdfs()
