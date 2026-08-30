import { supabase, getSupabaseConfig } from './supabaseClient';

export const EVALUACIONES_BUCKET = 'evaluaciones-media';

/**
 * Obtiene la URL pública directa desde Supabase Storage CDN para un path dentro del bucket.
 * Ejemplo: getStoragePublicUrl('simce_mat_6b_e3/p05_recta_numerica.png')
 */
export function getStoragePublicUrl(path: string): string {
  if (!path) return '';
  // Si ya es una URL completa (http/https), devolverla tal cual
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Si la ruta comienza con preguntas/, quitar el prefijo preguntas/ para buscar dentro del bucket
  const storagePath = cleanPath.startsWith('preguntas/') 
    ? cleanPath.replace(/^preguntas\//, '') 
    : cleanPath;

  const { data } = supabase.storage.from(EVALUACIONES_BUCKET).getPublicUrl(storagePath);
  return data?.publicUrl || path;
}

/**
 * Resuelve inteligentemente cualquier URL de imagen (sea local o de Storage).
 * Si Supabase está configurado en la nube, prefiere la URL del Storage CDN.
 * Si estamos en entorno offline/demo local sin internet, soporta el fallback local.
 */
export function resolveImageUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }

  const { isCloud } = getSupabaseConfig();
  if (isCloud && (url.startsWith('/preguntas/') || url.startsWith('preguntas/'))) {
    return getStoragePublicUrl(url);
  }

  return url;
}

/**
 * Sube una imagen directamente a Supabase Storage en el bucket evaluaciones-media.
 * @param file Archivo File a subir
 * @param subfolder Carpeta destino (ej: 'simce_mat_6b', 'custom_eval')
 * @returns URL pública del archivo subido o error
 */
export async function uploadPreguntaImage(
  file: File,
  subfolder: string = 'general'
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${subfolder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(EVALUACIONES_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Error al subir imagen a Supabase Storage:', uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data } = supabase.storage.from(EVALUACIONES_BUCKET).getPublicUrl(filePath);
    return { success: true, url: data.publicUrl };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error inesperado al subir la imagen' };
  }
}
