/**
 * mathContentNormalizer.ts
 * Módulo puro y centralizado de normalización de contenido matemático, científico y textual PAES / DEMRE.
 * Compartido entre EnunciadoRenderer, suites de pruebas unitarias y scripts de migración.
 */

/**
 * Sanitiza caracteres propietarios del bloque Private Use Area (PUA) de Unicode (\uF000-\uF0FF y \uE000-\uF8FF),
 * típicamente introducidos por fuentes matemáticas Symbol / Wingdings al extraer texto desde PDFs oficiales MINEDUC / DEMRE.
 */
export function cleanSymbolFont(text: string): string {
  if (!text) return text;
  return text
    // Paréntesis, corchetes y llaves (incluyendo variantes apiladas de Symbol font)
    .replace(/[\uF028\uF0E6\uF0E7\uF0E8]/g, '(')
    .replace(/[\uF029\uF0F6\uF0F7\uF0F8]/g, ')')
    .replace(/[\uF05B\uF0E9\uF0EA\uF0EB]/g, '[')
    .replace(/[\uF05D\uF0F9\uF0FA\uF0FB]/g, ']')
    .replace(/\uF07B/g, '{')
    .replace(/\uF07D/g, '}')
    // Operadores básicos y multiplicaciones
    .replace(/\uF02B/g, '+')
    .replace(/[\uF02D\u2013\u2014]/g, '-')
    .replace(/[\uF0B7\uF0D7\uF0B4]/g, '·')
    .replace(/\uF0B8/g, '÷')
    .replace(/\uF03D/g, '=')
    .replace(/\uF0B9/g, '≠')
    .replace(/\uF0BB/g, '≈')
    .replace(/\uF03C/g, '<')
    .replace(/\uF03E/g, '>')
    .replace(/\uF0A3/g, '≤')
    .replace(/\uF0B3/g, '≥')
    // Símbolos matemáticos y conjuntos
    .replace(/\uF070/g, 'π')
    .replace(/\uF0B0/g, '°')
    .replace(/\uF0A5/g, '∞')
    .replace(/\uF0C7/g, '∩')
    .replace(/\uF0C8/g, '∪')
    .replace(/\uF0CE/g, '∈')
    .replace(/\uF07E/g, '~')
    .replace(/\uF05E/g, '^')
    // Letras griegas y constantes científicas (Física, Química, Matemática)
    .replace(/\uF061/g, 'α')
    .replace(/\uF062/g, 'β')
    .replace(/\uF071/g, 'θ')
    .replace(/\uF072/g, 'ρ')
    .replace(/\uF073/g, 'σ')
    .replace(/\uF044/g, 'Δ')
    .replace(/\uF064/g, 'δ')
    .replace(/\uF06C/g, 'λ')   // lambda (longitud de onda)
    .replace(/\uF067/g, 'γ')   // gamma
    .replace(/\uF077/g, 'ω')   // omega
    .replace(/\uF057/g, 'Ω')   // Omega mayúscula (Ohm)
    .replace(/[\uF06D\uF0B5]/g, 'μ') // mu / micro
    .replace(/\uF065/g, 'ε')   // épsilon
    .replace(/\uF066/g, 'φ')   // phi
    .replace(/\uF06E/g, 'η')   // eta
    // Operadores y flechas de reacciones y vectores
    .replace(/\uF0AE/g, '→')   // flecha derecha (reacción, vector)
    .replace(/\uF0AC/g, '←')   // flecha izquierda
    .replace(/\uF0DF/g, '↔')   // equilibrio químico
    .replace(/\uF0B1/g, '±')   // más o menos
    .replace(/\uF02F/g, '/')
    .replace(/\uF020/g, ' ')   // slash / espacio
    // Íconos auxiliares, viñetas y marcas registradas de folletos DEMRE
    .replace(/\uF0FC/g, '✓')
    .replace(/[\uF0E3\uF8E9]/g, '©')
    .replace(/\uF0E2/g, '®')   // Marca registrada
    .replace(/[\uF138\uF0D8]/g, '►');
}

/**
 * Sanitiza números de ítem redundantes al inicio de líneas (ej. "23. ¿Qué...", "5. ¿Cuál...", "**23.** ")
 * para que no colisionen con los números secuenciales asignados dinámicamente por la interfaz.
 */
export function sanitizeEnunciadoLine(line: string): string {
  return line.replace(/^(\s*(?:\*\*)?[0-9]{1,3}[.)\-]+(?:\*\*)?\s*)([¿A-ZÁÉÍÓÚÑa-z])/g, '$2');
}

/**
 * Limpia artefactos de marcas de agua del PDF ("FORMA 113 | 2023", URLs, etc.),
 * caracteres propietarios Symbol Font y normaliza el texto para renderizado:
 * convierte \n sueltos en espacios y \n\n en separadores de párrafo real.
 * Esto evita que fragmentos de números extraídos del PDF aparezcan en líneas separadas.
 */
export function normalizeText(raw: string): string {
  if (!raw) return '';

  // 1. Limpieza de fuentes propietarias Symbol PUA
  let text = cleanSymbolFont(raw);

  // 2. Normalización de decimales partidos por saltos de extracción: ",0 75" -> "0,75", ",1 25" -> "1,25"
  // Exige delimitador previo y espacios horizontales estrictos [ \t]; NUNCA cruza saltos de línea ni filas de tablas
  text = text.replace(/(^|[\s(·*+–-])[,][ \t]*([0-9])[ \t]+([0-9]{2,})\b/g, '$1$2,$3');

  // 3. Normalización de coordenadas partidas e invertidas: (,x y) → (x, y), (,0 0) → (0, 0)
  //    Paso 1: regex genérico que convierte cualquier (,a b) → (a, b)
  text = text.replace(/\(\s*,\s*([a-zA-Z0-9_-]+)\s+([a-zA-Z0-9_-]+)\s*\)/g, '($1, $2)');
  //    Paso 2: agrega espacio entre palabra clave y paréntesis: puntos(x, y) → puntos (x, y)
  text = text.replace(/\b(punto|puntos|vector|vectores)\s*\(([^)]+)\)/gi, '$1 ($2)');

  // 4. Eliminar marcas de forma/fuente (artefactos de marca de agua PDF)
  text = text
    .replace(/FORMA\s+\d+\s*[|│▌]\s*\d{4}/gi, '')
    .replace(/www\.[a-z0-9.-]+\.[a-z]{2,}/gi, '')
    .replace(/[\u25a1\u25aa\u25ab\u25fc\u25fd\ufffd]/g, '·');

  // 5. Si ya contiene formato estructurado (tablas |...|, párrafos dobles \n\n, encabezados #)
  // procesar por bloques para no romper tablas
  const lines = text.split('\n');
  const result: string[] = [];
  let buffer = '';

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l) {
      if (buffer) {
        result.push(buffer);
        buffer = '';
      }
      result.push('');
      continue;
    }

    // Si es tabla, encabezado, separador o bloque de imagen, guardar directo
    if (
      l.startsWith('|') ||
      l.startsWith('#') ||
      l.startsWith('$$') ||
      l === '---' ||
      l.startsWith('![') ||
      /^\[(IMAGEN|FIGURA)\]$/i.test(l)
    ) {
      if (buffer) {
        result.push(buffer);
        buffer = '';
      }
      result.push(l);
      continue;
    }

    if (!buffer) {
      buffer = l;
    } else {
      if (/[.:?!]$/.test(buffer) && (l.startsWith('¿') || l.startsWith('Si ') || l.startsWith('Considere'))) {
        result.push(buffer);
        buffer = l;
      } else {
        if (buffer.endsWith('-')) {
          buffer += l; // Une palabras compuestas o cortadas por salto de línea sin espacio espurio (ej. "Perú-Boliviana")
        } else {
          buffer += ' ' + l;
        }
      }
    }
  }
  if (buffer) result.push(buffer);

  return result.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
