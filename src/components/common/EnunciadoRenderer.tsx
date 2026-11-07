import React from 'react';
import katex from 'katex';
import DOMPurify from 'dompurify';
import { resolveImageUrl } from '../../lib/storage';

/**
 * Intenta renderizar una expresión LaTeX con KaTeX de forma segura.
 * Aplica trust: false y sanitiza la salida con DOMPurify para blindar contra XSS (Fase 3.5).
 */
function renderKatex(expr: string, displayMode: boolean): string {
  try {
    const rawHtml = katex.renderToString(expr, {
      throwOnError: false,
      displayMode,
      strict: 'ignore',
      trust: false,
    });
    // DOMPurify sanitiza tanto en navegador como SSR (fallback si window es undefined)
    return typeof window !== 'undefined' ? DOMPurify.sanitize(rawHtml) : rawHtml;
  } catch {
    return expr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

interface EnunciadoRendererProps {
  content?: string;
  className?: string;
  forceLightMode?: boolean;
  stripLeadingNumber?: boolean;
  inline?: boolean;
  imagenUrl?: string;
}

/**
 * Sanitiza caracteres propietarios del bloque Private Use Area (PUA) de Unicode (\uF000-\uF0FF y \uE000-\uF8FF),
 * típicamente introducidos por fuentes matemáticas Symbol / Wingdings al extraer texto desde PDFs oficiales MINEDUC / DEMRE.
 */
function cleanSymbolFont(text: string): string {
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
    .replace(/[\uF0B7\uF0D7]/g, '·')
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
    // Letras griegas matemáticas
    .replace(/\uF061/g, 'α')
    .replace(/\uF062/g, 'β')
    .replace(/\uF071/g, 'θ')
    .replace(/\uF072/g, 'ρ')
    .replace(/\uF073/g, 'σ')
    .replace(/\uF044/g, 'Δ')
    // Íconos auxiliares de folletos DEMRE
    .replace(/\uF0FC/g, '✓')
    .replace(/\uF0E3/g, '©')
    .replace(/\uF138/g, '►');
}

/**
 * Sanitiza números de ítem redundantes al inicio de líneas (ej. "23. ¿Qué...", "5. ¿Cuál...", "**23.** ")
 * para que no colisionen con los números secuenciales asignados dinámicamente por la interfaz.
 */
function sanitizeEnunciadoLine(line: string): string {
  return line.replace(/^(\s*(?:\*\*)?[0-9]{1,3}[.)\-]+(?:\*\*)?\s*)([¿A-ZÁÉÍÓÚÑa-z])/g, '$2');
}

/**
 * Limpia artefactos de marcas de agua del PDF ("FORMA 113 | 2023", URLs, etc.),
 * caracteres propietarios Symbol Font y normaliza el texto para renderizado:
 * convierte \n sueltos en espacios y \n\n en separadores de párrafo real.
 * Esto evita que fragmentos de números extraídos del PDF aparezcan en líneas separadas.
 */
function normalizeText(raw: string): string {
  // 1. Limpieza de fuentes propietarias Symbol PUA
  let text = cleanSymbolFont(raw);

  // 2. Normalización de decimales partidos por saltos de extracción: ",0 75" -> "0,75", ",1 25" -> "1,25"
  text = text.replace(/,\s*([0-9])\s+([0-9]{2,})\b/g, '$1,$2');

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

  // 2. Si ya contiene formato estructurado (tablas |...|, párrafos dobles \n\n, encabezados #)
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
        buffer += ' ' + l;
      }
    }
  }
  if (buffer) result.push(buffer);

  return result.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Renderiza texto enriquecido con formato Markdown:
 * - Negrita (**texto**) y Cursiva (*texto*)
 * - Encabezados (#, ##, ###) y Separadores (---)
 * - Fórmulas matemáticas básicas ($...$, $$...$$, \cdot, \times, etc.)
 * - Tablas Markdown (| Col1 | Col2 | con alineaciones)
 * - Imágenes Markdown (![alt](url)), incluso dentro de celdas de tablas
 */
export const EnunciadoRenderer: React.FC<EnunciadoRendererProps> = ({
  content = '',
  className = '',
  forceLightMode = false,
  stripLeadingNumber = true,
  inline = false,
  imagenUrl = '',
}) => {
  if (!content) return null;

  const textClass = forceLightMode
    ? 'text-slate-900 font-medium'
    : 'text-slate-800 dark:text-slate-200';
  const boldClass = forceLightMode
    ? 'font-bold text-black'
    : 'font-bold text-slate-900 dark:text-white';

  // Renderizar texto inline (negrita, cursiva, latex básico, imágenes inline)
  const renderInline = (text: string) => {
    // Si contiene imagen markdown inline: ![alt](url)
    const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = imgRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(renderFormattedText(text.substring(lastIndex, match.index), `txt-${lastIndex}`));
      }
      const alt = match[1];
      const src = match[2];
      const resolvedSrc = resolveImageUrl(src);
      parts.push(
        <span key={`img-${match.index}`} className="inline-block my-1.5 align-middle mx-1">
          <img
            src={resolvedSrc}
            alt={alt || 'Figura'}
            className="max-h-80 max-w-full rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 object-contain inline-block p-1.5"
            loading="lazy"
          />
        </span>
      );
      lastIndex = imgRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(renderFormattedText(text.substring(lastIndex), `txt-${lastIndex}`));
    }

    return parts.length > 0 ? parts : renderFormattedText(text, 'txt-0');
  };

  // Formatear negrita, cursiva y fórmulas matemáticas (KaTeX)
  const renderFormattedText = (raw: string, keyPrefix: string): React.ReactNode => {
    // 0. Proteger montos monetarios (ej: $120.000, $25.000, $1.000.000, $500)
    // NOTA: El regex anterior /\$(\s*\d[\d.,]*)/ era demasiado agresivo: consumía
    // el '$' de abre de expresiones LaTeX como $0{,}25$ (notación decimal con coma),
    // dejando '{,}25$' con un '$' huérfano que emparejaba con el siguiente delimitador
    // y generaba garbage KaTeX. Ahora usamos dos regexes específicos:
    //
    //  (a) Formato miles chileno: $120.000, $1.000.000  (\d{1,3} + grupos de .\d{3})
    //  (b) Entero suelto: $500, $5  (solo dígitos sin '{' '\' ni ',' inmediatamente
    //      después, que indicarían expresión LaTeX como $0{,}25$ o $\frac)
    let text = raw
      .replace(/\$(\d{1,3}(?:\.\d{3})+)/g, '§PESO§$1')   // (a) $120.000, $25.000
      .replace(/\$(\d+)(?=[\s\.,;:?!)]|$)/g, '§PESO§$1'); // (b) $500, $5 (no seguido de LaTeX)

    // 1. Extraer y renderizar con KaTeX real los bloques $$...$$ y $...$ restantes
    //    (los montos ya están protegidos con §PESO§ y no calzan con estos patrones)
    const mathPlaceholders: string[] = [];
    text = text.replace(/\$\$(.+?)\$\$/g, (_m, expr) => {
      const html = renderKatex(expr.trim(), true);
      mathPlaceholders.push(html);
      return `§MATH${mathPlaceholders.length - 1}§`;
    });
    text = text.replace(/\$([^$]+?)\$/g, (_m, expr) => {
      const html = renderKatex(expr.trim(), false);
      mathPlaceholders.push(html);
      return `§MATH${mathPlaceholders.length - 1}§`;
    });

    // 2. Restaurar montos monetarios protegidos y limpiar símbolos LaTeX sueltos
    //    que puedan quedar fuera de delimitadores $ (contenido legado sin $)
    text = text
      .replace(/§PESO§/g, '$')
      .replace(/\\cdot/g, ' · ')
      .replace(/\\times/g, ' × ')
      .replace(/\\div/g, ' ÷ ')
      .replace(/\\pm/g, ' ± ')
      .replace(/\\leq/g, ' ≤ ')
      .replace(/\\geq/g, ' ≥ ')
      .replace(/\\neq/g, ' ≠ ')
      .replace(/\\approx/g, ' ≈ ')
      .replace(/\\left\(/g, '(')
      .replace(/\\right\)/g, ')')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');

    // 3. Separar primero por los placeholders de fórmulas KaTeX ya renderizadas
    const mathParts = text.split(/(§MATH\d+§)/g);

    const renderNonMathSegment = (segment: string, segKey: string): React.ReactNode => {
      // Negrita **...**
      const boldParts = segment.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={segKey}>
          {boldParts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              const inner = part.slice(2, -2);
              return (
                <strong key={`${segKey}-b-${pIdx}`} className={boldClass}>
                  {inner}
                </strong>
              );
            }
            // Cursiva *...*
            const italicParts = part.split(/(\*.*?\*)/g);
            return (
              <span key={`${segKey}-p-${pIdx}`}>
                {italicParts.map((sub, sIdx) => {
                  if (sub.startsWith('*') && sub.endsWith('*') && sub.length > 2) {
                    return (
                      <em key={`${segKey}-i-${sIdx}`} className="italic">
                        {sub.slice(1, -1)}
                      </em>
                    );
                  }
                  return sub;
                })}
              </span>
            );
          })}
        </span>
      );
    };

    return (
      <span key={keyPrefix}>
        {mathParts.map((part, idx) => {
          const mathMatch = part.match(/^§MATH(\d+)§$/);
          if (mathMatch) {
            const html = mathPlaceholders[Number(mathMatch[1])];
            const safeHtml = typeof window !== 'undefined' ? DOMPurify.sanitize(html) : html;
            return (
              <span
                key={`${keyPrefix}-math-${idx}`}
                className="katex-inline"
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            );
          }
          return renderNonMathSegment(part, `${keyPrefix}-seg-${idx}`);
        })}
      </span>
    );
  };


  // Normalizar texto para corregir artefactos de extracción PDF
  // (une \n simples como espacios, mantiene \n\n como separadores de párrafo)
  const normalizedContent = normalizeText(content);

  // Modo inline compacto para alternativas u opciones cortas
  if (inline) {
    const singleLine = normalizedContent.replace(/\n+/g, ' ').trim();
    const formatted = stripLeadingNumber ? sanitizeEnunciadoLine(singleLine) : singleLine;
    return <span className={`inline-block ${className}`}>{renderInline(formatted)}</span>;
  }

  const lines = normalizedContent.split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Línea vacía
    if (!trimmed) {
      i++;
      continue;
    }

    // Separador horizontal
    if (trimmed === '---' || trimmed === '***') {
      blocks.push(
        <hr key={`hr-${i}`} className={`my-3 ${forceLightMode ? 'border-slate-300' : 'border-slate-200 dark:border-slate-800'}`} />
      );
      i++;
      continue;
    }

    // Inserción de imagen pedagógica mediante etiqueta [IMAGEN] o [FIGURA]
    if (/^\[(IMAGEN|FIGURA)\]$/i.test(trimmed) && imagenUrl) {
      const src = resolveImageUrl(imagenUrl);
      blocks.push(
        <div key={`img-tag-${i}`} className="flex justify-center py-2.5 my-2">
          <div className={`rounded-xl shadow-md border p-2.5 max-w-md mx-auto ${forceLightMode ? 'bg-white border-slate-300' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
            <img
              src={src}
              alt="Figura pedagógica"
              className="max-h-56 w-auto object-contain rounded"
              loading="lazy"
            />
          </div>
        </div>
      );
      i++;
      continue;
    }

    // Inserción de imagen Markdown standalone: ![alt](url)
    if (trimmed.startsWith('![') && trimmed.endsWith(')')) {
      const match = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (match) {
        const alt = match[1];
        const src = resolveImageUrl(match[2]);
        blocks.push(
          <div key={`img-md-${i}`} className="flex justify-center py-2.5 my-2">
            <div className={`rounded-xl shadow-md border p-2.5 max-w-md mx-auto ${forceLightMode ? 'bg-white border-slate-300' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
              <img
                src={src}
                alt={alt || 'Figura pedagógica'}
                className="max-h-56 w-auto object-contain rounded"
                loading="lazy"
              />
            </div>
          </div>
        );
        i++;
        continue;
      }
    }

    // Encabezados
    if (trimmed.startsWith('# ')) {
      blocks.push(
        <h3 key={`h1-${i}`} className={`text-base font-black ${forceLightMode ? 'text-black border-slate-300' : 'text-slate-900 dark:text-white border-slate-200 dark:border-slate-800'} pt-2 pb-1 border-b`}>
          {renderInline(trimmed.replace(/^#\s+/, ''))}
        </h3>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      blocks.push(
        <h4 key={`h2-${i}`} className={`text-sm font-bold ${forceLightMode ? 'text-black' : 'text-slate-900 dark:text-white'} pt-2 pb-0.5`}>
          {renderInline(trimmed.replace(/^##\s+/, ''))}
        </h4>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith('### ')) {
      blocks.push(
        <h5 key={`h3-${i}`} className={`text-xs font-bold ${forceLightMode ? 'text-slate-900 font-extrabold uppercase' : 'text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'} pt-1.5 pb-0.5`}>
          {renderInline(trimmed.replace(/^###\s+/, ''))}
        </h5>
      );
      i++;
      continue;
    }

    // Detección de Tabla Markdown (| col1 | col2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        // Primera fila: headers
        const headerCols = tableLines[0]
          .split('|')
          .slice(1, -1)
          .map(c => c.trim());

        // Segunda fila: alineación (opcional si es |--:|)
        const isSeparator = /^\|?(\s*:?-+:?\s*\|?)+$/.test(tableLines[1]);
        const dataRows = isSeparator ? tableLines.slice(2) : tableLines.slice(1);

        blocks.push(
          <div key={`table-${i}`} className={`my-3 overflow-x-auto rounded-xl border ${forceLightMode ? 'border-slate-400 bg-white' : 'border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/60'} max-w-full`}>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className={`${forceLightMode ? 'bg-slate-100 border-b border-slate-300 text-slate-900' : 'bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'} font-bold`}>
                  {headerCols.map((col, cIdx) => (
                    <th key={`th-${cIdx}`} className="px-3.5 py-2.5 text-center first:text-left">
                      {renderInline(col)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={forceLightMode ? 'divide-y divide-slate-200' : 'divide-y divide-slate-100 dark:divide-slate-800/60'}>
                {dataRows.map((row, rIdx) => {
                  const cells = row
                    .split('|')
                    .slice(1, -1)
                    .map(c => c.trim());
                  return (
                    <tr
                      key={`tr-${rIdx}`}
                      className={forceLightMode ? 'text-slate-900' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors text-slate-800 dark:text-slate-300'}
                    >
                      {cells.map((cell, cIdx) => (
                        <td key={`td-${cIdx}`} className="px-3.5 py-2 text-center first:text-left align-middle font-medium">
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // Párrafo de texto regular (sanitizando números de ítem redundantes como "23. ", "5. ")
    const formattedLine = stripLeadingNumber ? sanitizeEnunciadoLine(trimmed) : trimmed;
    blocks.push(
      <div key={`p-${i}`} className={`text-sm ${textClass} leading-relaxed`}>
        {renderInline(formattedLine)}
      </div>
    );
    i++;
  }

  return <div className={`space-y-1 ${className}`}>{blocks}</div>;
};
