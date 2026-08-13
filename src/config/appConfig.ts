/**
 * Configuración Global del Establecimiento / Colegio
 * Para replicar la plataforma en un nuevo colegio, basta con cambiar
 * el valor en el archivo .env.local (VITE_NOMBRE_ESTABLECIMIENTO)
 * o modificar este archivo centralizado.
 */

export const APP_CONFIG = {
  // Nombre del Colegio / Escuela (Leído desde .env.local o fallback por defecto)
  nombreEstablecimiento:
    (import.meta.env && import.meta.env.VITE_NOMBRE_ESTABLECIMIENTO) ||
    'Escuela Bicentenario Demo',

  // Código RBD del Colegio (Registro Bases de Datos Mineduc)
  rbd: (import.meta.env && import.meta.env.VITE_ESTABLECIMIENTO_RBD) || '12345-6',

  // Ciudad / Comuna
  comuna: (import.meta.env && import.meta.env.VITE_ESTABLECIMIENTO_COMUNA) || 'Santiago',

  // Año Escolar Vigente
  anioEscolar: 2026,
};
