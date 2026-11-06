/**
 * Utilidades de formateo para números y localización chilena (CL)
 */

/**
 * Formatea un número o string numérico con punto separador de miles.
 * Ejemplos:
 *   3159 -> '3.159'
 *   1000 -> '1.000'
 *   0 -> '0'
 *   '4500' -> '4.500'
 */
export function formatMiles(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === '') return '0';
  const num = typeof val === 'string' ? Number(val) : val;
  if (isNaN(num)) return String(val);
  return num.toLocaleString('es-CL');
}
