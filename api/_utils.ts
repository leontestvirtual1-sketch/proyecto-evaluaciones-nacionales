/**
 * api/_utils.ts
 * Utilidades compartidas para funciones serverless en api/
 */

/**
 * Escapa caracteres especiales de HTML para mitigar inyecciones HTML y XSS
 * en correos electrónicos (SMTP) y respuestas HTML del servidor.
 */
export function escapeHtml(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
