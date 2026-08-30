import React from 'react';
import { resolveImageUrl } from '../../lib/storage';

interface EnunciadoRendererProps {
  content?: string;
  className?: string;
  forceLightMode?: boolean;
  stripLeadingNumber?: boolean;
}

/**
 * Sanitiza números de ítem redundantes al inicio de líneas (ej. "23. ¿Qué...", "5. ¿Cuál...", "**23.** ")
 * para que no colisionen con los números secuenciales asignados dinámicamente por la interfaz.
 */
function sanitizeEnunciadoLine(line: string): string {
  return line.replace(/^(\s*(?:\*\*)?[0-9]{1,3}[.)\-]+(?:\*\*)?\s*)([¿A-ZÁÉÍÓÚÑa-z])/g, '$2');
}

/**
 * Normaliza texto con artefactos de extracción PDF:
 * - Fusiona fragmentos de números con separador de miles que quedaron en líneas separadas
 *   (ej: "$\n120\n000" → "$120.000", "1\n,25" → "1,25")
 * - Elimina líneas que son solo marcas de forma/fuente ("FORMA 113 | 2023", etc.)
 * - Colapsa líneas muy cortas que son claramente parte de la anterior
 */
function normalizeMathText(raw: string): string {
  // 1. Eliminar marcas de forma/fuente (artefactos de marca de agua PDF)
  let text = raw
    .replace(/FORMA\s+\d+\s*[|│]\s*\d{4}/gi, '')
    .replace(/www\.[a-z0-9.-]+\.[a-z]{2,}/gi, '');

  // 2. Unir líneas que son solo dígitos/símbolos de miles con la línea anterior/siguiente
  //    Patrón: línea termina con $ o cifra, siguiente es solo dígitos o coma+dígitos
  const lines = text.split('\n');
  const merged: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const cur = lines[i];
    const trimCur = cur.trim();

    // Línea vacía: pasar tal cual
    if (!trimCur) {
      merged.push(cur);
      continue;
    }

    // ¿Esta línea parece un fragmento de número que sigue a la anterior?
    // Casos: solo dígitos, solo ",digits", solo "digits,", símbolo $, etc.
    const isNumberFragment = /^[,.]?\d{1,3}[,.]?$/.test(trimCur) || /^[,.]\d+$/.test(trimCur);
    // ¿La línea anterior termina en un símbolo monetario o en dígitos?
    const prevEndsWithNumOrSymbol = merged.length > 0 && /[\$\d,.]\s*$/.test(merged[merged.length - 1]);

    if (isNumberFragment && prevEndsWithNumOrSymbol) {
      // Fusionar con la línea anterior sin espacio si es solo dígitos (miles)
      const prev = merged[merged.length - 1].trimEnd();
      const separator = /^\d+$/.test(trimCur) ? '.' : '';
      merged[merged.length - 1] = prev + separator + trimCur;
      continue;
    }

    // ¿La línea siguiente es un fragmento numérico que completa esta?
    // Si esta línea termina en $ o "por" o en dígito, y la siguiente es solo dígitos
    if (i + 1 < lines.length) {
      const nextTrim = lines[i + 1].trim();
      const nextIsFragment = /^[,.]?\d{1,3}[,.]?$/.test(nextTrim) || /^[,.]\d+$/.test(nextTrim);
      if (nextIsFragment && /[\$\d,.]$/.test(trimCur)) {
        // Absorber la siguiente línea ahora
        const separator = /^\d+$/.test(nextTrim) ? '.' : '';
        merged.push(cur.trimEnd() + separator + nextTrim);
        i++; // saltar la siguiente
        continue;
      }
    }

    merged.push(cur);
  }

  // 3. Segunda pasada: fusionar líneas muy cortas (≤3 chars, solo símbolo) con la siguiente
  const result: string[] = [];
  for (let i = 0; i < merged.length; i++) {
    const t = merged[i].trim();
    if (t.length <= 3 && /^[\$€£%·×÷±≤≥≠≈pqrf]$/.test(t) && i + 1 < merged.length) {
      // Fusionar símbolo suelto con la línea siguiente
      result.push(t + ' ' + merged[i + 1].trim());
      i++;
    } else {
      result.push(merged[i]);
    }
  }

  return result.join('\n');
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
}) => {
  if (!content) return null;

  const textClass = forceLightMode
    ? 'text-slate-900 font-medium'
    : 'text-slate-800 dark:text-slate-200';
  const boldClass = forceLightMode
    ? 'font-bold text-black'
    : 'font-bold text-slate-900 dark:text-white';
  const headingClass = forceLightMode
    ? 'font-black text-black'
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
            className="max-h-48 max-w-full rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 object-contain inline-block p-1"
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

  // Formatear negrita, cursiva y símbolos matemáticos
  const renderFormattedText = (raw: string, keyPrefix: string): React.ReactNode => {
    // Limpiar notación de bloques $$...$$ o $...$
    const clean = raw
      .replace(/\$\$(.*?)\$\$/g, '$1')
      .replace(/\$(.*?)\$/g, '$1')
      .replace(/\\cdot/g, ' · ')
      .replace(/\\times/g, ' × ')
      .replace(/\\div/g, ' ÷ ')
      .replace(/\\pm/g, ' ± ')
      .replace(/\\leq/g, ' ≤ ')
      .replace(/\\geq/g, ' ≥ ')
      .replace(/\\neq/g, ' ≠ ')
      .replace(/\\approx/g, ' ≈ ');

    // Separar por negrita **...**
    const boldParts = clean.split(/(\*\*.*?\*\*)/g);

    return (
      <span key={keyPrefix}>
        {boldParts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const inner = part.slice(2, -2);
            return (
              <strong key={`${keyPrefix}-b-${pIdx}`} className={boldClass}>
                {inner}
              </strong>
            );
          }
          // Cursiva *...*
          const italicParts = part.split(/(\*.*?\*)/g);
          return (
            <span key={`${keyPrefix}-p-${pIdx}`}>
              {italicParts.map((sub, sIdx) => {
                if (sub.startsWith('*') && sub.endsWith('*') && sub.length > 2) {
                  return (
                    <em key={`${keyPrefix}-i-${sIdx}`} className="italic">
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

  // Parser de bloques (párrafos, encabezados, tablas)
  // Normalizar texto antes de parsear para corregir artefactos de extracción PDF
  const normalizedContent = normalizeMathText(content);
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
