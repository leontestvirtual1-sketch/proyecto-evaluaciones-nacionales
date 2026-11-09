/**
 * api/upload-image.ts
 * 
 * Endpoint seguro para subir imágenes pedagógicas a Supabase Storage (evaluaciones-media).
 * Utiliza el Service Role Key del servidor para saltar las restricciones RLS anónimas
 * de Supabase Storage de forma controlada y segura.
 */

import { createClient } from '@supabase/supabase-js';
import { setCorsHeaders } from './_utils.js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const EVALUACIONES_BUCKET = 'evaluaciones-media';

const sbAdmin = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  : null;

export default async function handler(req: any, res: any) {
  const origin = req.headers.origin as string | undefined;
  setCorsHeaders(res, origin, {
    methods: 'POST, OPTIONS',
    headers: 'Content-Type, Authorization'
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido. Use POST.' });
  }

  if (!sbAdmin) {
    return res.status(500).json({ success: false, error: 'Configuración de servidor incompleta.' });
  }

  try {
    const { imageBase64, fileName, mimeType, subfolder = 'general' } = req.body || {};

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ success: false, error: 'Falta el contenido de la imagen (imageBase64).' });
    }

    // Limpiar posible data URL prefix: "data:image/png;base64,..."
    const base64Data = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Validar tamaño máximo (máx 10 MB)
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ success: false, error: 'La imagen excede el límite de 10 MB.' });
    }

    // Extraer extensión segura
    let ext = 'png';
    if (mimeType) {
      if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
      else if (mimeType.includes('webp')) ext = 'webp';
      else if (mimeType.includes('svg')) ext = 'svg';
    } else if (fileName && fileName.includes('.')) {
      ext = fileName.split('.').pop()?.toLowerCase() || 'png';
    }

    const cleanFolder = (subfolder || 'general').replace(/[^a-zA-Z0-9_-]/g, '');
    const finalFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = `${cleanFolder}/${finalFileName}`;

    const { error: uploadError } = await sbAdmin.storage
      .from(EVALUACIONES_BUCKET)
      .upload(filePath, buffer, {
        contentType: mimeType || `image/${ext}`,
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('[upload-image] Error en Supabase Storage:', uploadError);
      return res.status(500).json({ success: false, error: uploadError.message });
    }

    const { data: publicUrlData } = sbAdmin.storage
      .from(EVALUACIONES_BUCKET)
      .getPublicUrl(filePath);

    return res.status(200).json({
      success: true,
      url: publicUrlData.publicUrl,
      path: filePath
    });
  } catch (err: unknown) {
    console.error('[upload-image] Error inesperado:', err);
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Error interno al procesar la imagen.'
    });
  }
}
