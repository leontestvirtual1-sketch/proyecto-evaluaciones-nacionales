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

/**
 * Validador estricto de CORS para mitigar ataques CSRF y Cross-Origin Data Leaks.
 * 
 * Reglas (Fase 3.4):
 * - Origen permitido si coincide exactamente con process.env.APP_URL o 'https://sysget-saber.vercel.app'.
 * - Orígenes localhost / 127.0.0.1 son permitidos ÚNICAMENTE si process.env.VERCEL_ENV !== 'production'.
 * - Se prohíben terminantemente búsquedas con startsWith("http://localhost") que permitan
 *   dominios maliciosos del tipo http://localhost.sitio-atacante.com.
 */
export function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return false;

  const appUrl = (process.env.APP_URL || 'https://sysget-saber.vercel.app').trim();
  if (origin === appUrl) return true;

  // En producción (VERCEL_ENV === 'production'), localhost está estrictamente denegado
  const isProduction = process.env.VERCEL_ENV === 'production';
  if (isProduction) {
    return false;
  }

  // En desarrollo/testing/preview, validar localhost o 127.0.0.1 con puerto exacto opcional
  const localhostRegex = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
  return localhostRegex.test(origin);
}

/**
 * Aplica cabeceras CORS seguras a la respuesta HTTP.
 */
export function setCorsHeaders(
  res: any,
  origin: string | undefined,
  options: {
    methods?: string;
    headers?: string;
  } = {}
): void {
  const allowed = isOriginAllowed(origin);
  const defaultOrigin = (process.env.APP_URL || 'https://sysget-saber.vercel.app').trim();

  res.setHeader('Access-Control-Allow-Origin', allowed && origin ? origin : defaultOrigin);
  res.setHeader('Access-Control-Allow-Methods', options.methods || 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', options.headers || 'Content-Type, Authorization');
  res.setHeader('Vary', 'Origin');
}
