/**
 * api/verify-student-access.ts
 * 
 * Nivel 1: Validación de RUT Oficial para Estudiantes (Cero contraseñas)
 * 
 * Permite a los alumnos validar su identidad institucional mediante su RUT chileno
 * sin requerir contraseñas ni registro previo, asegurando que quien contesta la prueba
 * pertenece legítimamente a la nómina del curso y del establecimiento.
 */

import { createClient } from '@supabase/supabase-js';
import { setCorsHeaders } from './_utils';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const sbAdmin = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  : null;

// Nómina de respaldo / entorno demo para pruebas y validaciones locales
const NOMINA_MOCK = [
  { id: 'alu-001', rut: '21.001.001-1', nombre: 'Camila', apellido: 'Araya Pérez', email: 'camila.araya@colegio.cl' },
  { id: 'alu-002', rut: '21.002.002-2', nombre: 'Diego', apellido: 'Bravo Soto', email: 'diego.bravo@colegio.cl' },
  { id: 'alu-003', rut: '21.003.003-3', nombre: 'Fernanda', apellido: 'Castro Muñoz', email: 'fernanda.castro@colegio.cl' },
  { id: 'alu-demo', rut: '22.876.543-0', nombre: 'Pedro', apellido: 'Soto', email: 'pedro.soto@sysget.cl' },
  { id: '29a04e65-bfb6-4344-9c38-665c50dc557a', rut: '23.386.193-6', nombre: 'Ignacia Andrea', apellido: 'Leon Pizarro', email: 'ignaciaandrealeonpizarro@gmail.com' },
  { id: '83a021dd-bc78-4e2d-a949-6ae6d9807cee', rut: '23.315.875-5', nombre: 'Florencia Angelica', apellido: 'Leon PIzarro', email: 'florenciaangelicaleonpizarro@gmail.com' }
];

export function cleanRut(rutRaw: string): string {
  return (rutRaw || '').replace(/[^0-9kK]/g, '').toUpperCase().trim();
}

export function formatRut(rutRaw: string): string {
  const clean = cleanRut(rutRaw);
  if (clean.length < 2) return clean;
  const cuerpo = clean.slice(0, -1);
  const dv = clean.slice(-1);
  let cuerpoFormateado = '';
  let count = 0;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    count++;
    cuerpoFormateado = cuerpo[i] + cuerpoFormateado;
    if (count % 3 === 0 && i > 0) {
      cuerpoFormateado = '.' + cuerpoFormateado;
    }
  }
  return `${cuerpoFormateado}-${dv}`;
}

export default async function handler(req: any, res: any) {
  setCorsHeaders(res, req.headers?.origin, {
    methods: 'POST, OPTIONS',
    headers: 'Content-Type, Authorization'
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Solo se acepta POST.' });
  }

  const { codigo, rut, email, nombre } = req.body || {};

  const cleanInputRut = cleanRut(rut);
  if (!cleanInputRut || cleanInputRut.length < 7 || cleanInputRut.length > 9) {
    return res.status(400).json({
      ok: false,
      error: 'Por favor ingresa un RUT chileno válido (mínimo 7 y máximo 9 caracteres).'
    });
  }

  const cleanInputEmail = (email || '').toLowerCase().trim();
  const cleanInputNombre = (nombre || '').toLowerCase().trim();

  // 1. Verificar existencia y estado de la evaluación si se proporcionó código
  if (sbAdmin && codigo) {
    const { data: evaluacion } = await sbAdmin
      .from('evaluaciones')
      .select('id, titulo, estado, codigo_acceso')
      .or(`codigo_acceso.eq.${codigo},id.eq.${codigo}`)
      .maybeSingle();

    if (evaluacion && evaluacion.estado && evaluacion.estado !== 'activa') {
      return res.status(403).json({
        ok: false,
        error: 'Esta evaluación ya no se encuentra activa para su rendición.'
      });
    }
  }

  // 2. Buscar en Supabase perfiles (usando sbAdmin con service_role para eludir RLS en la verificación)
  let alumnoEncontrado: any = null;

  if (sbAdmin) {
    try {
      const { data: perfiles, error: perfilesErr } = await sbAdmin
        .from('perfiles')
        .select('id, rut, nombre, apellido, email, rol, rbd, establecimiento')
        .eq('rol', 'alumno');

      if (!perfilesErr && perfiles && perfiles.length > 0) {
        alumnoEncontrado = perfiles.find(p => cleanRut(p.rut || '') === cleanInputRut);
      }
    } catch (err) {
      console.warn('[verify-student-access] Error consultando perfiles en Supabase:', err);
    }
  }

  // 3. Fallback en nómina mock / respaldo
  if (!alumnoEncontrado) {
    alumnoEncontrado = NOMINA_MOCK.find(p => cleanRut(p.rut) === cleanInputRut);
  }

  if (!alumnoEncontrado) {
    return res.status(403).json({
      ok: false,
      error: 'El RUT ingresado no coincide con ningún estudiante registrado en la nómina oficial.'
    });
  }

  // 4. Si el enlace venía dirigido a un email específico, validar consistencia
  if (cleanInputEmail && alumnoEncontrado.email) {
    const studentEmail = alumnoEncontrado.email.toLowerCase().trim();
    if (studentEmail !== cleanInputEmail) {
      return res.status(403).json({
        ok: false,
        error: 'El RUT ingresado pertenece a otro estudiante y no corresponde al enlace asignado a este correo.'
      });
    }
  }

  // 5. Retornar éxito con datos del alumno
  const nombreCompleto = `${alumnoEncontrado.nombre || ''} ${alumnoEncontrado.apellido || ''}`.trim();

  return res.status(200).json({
    ok: true,
    message: 'Identidad institucional verificada exitosamente.',
    alumno: {
      id: alumnoEncontrado.id,
      rut: alumnoEncontrado.rut || formatRut(cleanInputRut),
      nombre: alumnoEncontrado.nombre,
      apellido: alumnoEncontrado.apellido || '',
      nombreCompleto,
      email: alumnoEncontrado.email || cleanInputEmail,
      establecimiento: alumnoEncontrado.establecimiento || 'Escuela Premilitar Héroes de la Concepción',
      rbd: alumnoEncontrado.rbd || '31030'
    }
  });
}
