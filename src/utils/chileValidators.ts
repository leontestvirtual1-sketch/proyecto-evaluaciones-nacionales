/**
 * Utilidades de validación y formateo para identificadores oficiales chilenos (RUT y RBD)
 */

/**
 * Valida un RUT chileno con su algoritmo de dígito verificador (módulo 11).
 */
export function validarRutChileno(rut: string): boolean {
  if (!rut) return false;
  const clean = rut.replace(/[\.\-\s]/g, '').toUpperCase();
  if (clean.length < 2) return false;

  const cuerpo = clean.slice(0, -1);
  const dv = clean.slice(-1);

  if (!/^\d+$/.test(cuerpo)) return false;

  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const dvEsperado = 11 - (suma % 11);
  const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : String(dvEsperado);

  return dv === dvCalculado;
}

/**
 * Formatea un RUT chileno a la convención estándar (ej. 12.345.678-9).
 */
export function formatearRutChileno(rut: string): string {
  const clean = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (clean.length <= 1) return clean;

  const cuerpo = clean.slice(0, -1);
  const dv = clean.slice(-1);

  let formattedCuerpo = '';
  for (let i = cuerpo.length - 1, j = 0; i >= 0; i--, j++) {
    if (j > 0 && j % 3 === 0) {
      formattedCuerpo = '.' + formattedCuerpo;
    }
    formattedCuerpo = cuerpo[i] + formattedCuerpo;
  }

  return `${formattedCuerpo}-${dv}`;
}

/**
 * Valida que el RBD (Rol Base de Datos de MINEDUC) sea válido.
 * En Chile, los RBD son números de 1 a 6 dígitos (a veces con guion y DV).
 */
export function validarRBD(rbd: string): boolean {
  if (!rbd) return false;
  const clean = rbd.replace(/[\.\-\s]/g, '').trim();
  // Debe contener solo números (o terminar opcionalmente en K) y tener entre 1 y 8 caracteres
  if (!/^\d+[0-9kK]?$/i.test(clean)) return false;
  const numPart = clean.replace(/[^0-9]/g, '');
  return numPart.length >= 1 && numPart.length <= 8;
}

/**
 * Normaliza el RBD eliminando puntos, espacios y guiones para almacenamiento uniforme.
 */
export function normalizarRBD(rbd: string): string {
  if (!rbd) return '';
  return rbd.replace(/[\.\-\s]/g, '').trim();
}
