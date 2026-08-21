/**
 * Utilidades para el Motor de Impresión Aislada y Generación de PDF (Sysget Saber)
 * Maneja la asignación de nombres dinámicos y secuenciales por sesión para descargas
 * evitando la sobreescritura forzada en el sistema operativo (ej. '(1)', '(2)', etc.).
 */

export function getSequentialPrintTitle(baseTitle: string): string {
  try {
    const sanitizedKey = baseTitle.trim().toLowerCase().replace(/[^a-z0-9]/gi, '_');
    const storageKey = `sysget_print_counter_${sanitizedKey}`;
    const rawCount = sessionStorage.getItem(storageKey);
    const count = rawCount ? parseInt(rawCount, 10) : 0;

    // Incrementar contador para la siguiente descarga en la sesión activa
    sessionStorage.setItem(storageKey, (count + 1).toString());

    if (count === 0) {
      return baseTitle;
    }
    return `${baseTitle} (${count})`;
  } catch (e) {
    return baseTitle;
  }
}
