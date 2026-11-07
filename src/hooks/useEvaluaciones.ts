import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Prueba, UserProfile } from '../types';
import {
  pruebasMock,
} from '../data/mockData';

interface UseEvaluacionesProps {
  currentUser?: UserProfile | null;
  isSandboxMode?: boolean;
}

function deriveCodigoPublico(row: Record<string, unknown>): string {
  if (row.codigo_acceso && String(row.codigo_acceso).trim() !== '' && row.codigo_acceso !== 'EVAL-001') {
    return String(row.codigo_acceso);
  }
  if (row.codigo_publico && String(row.codigo_publico).trim() !== '' && row.codigo_publico !== 'EVAL-001') {
    return String(row.codigo_publico);
  }
  const id = String(row.id || '');
  if (id.startsWith('eval-paes-')) {
    const parts = id.replace('eval-paes-', '').split('-');
    let sub = parts[0]?.toUpperCase() || 'GEN';
    if (sub === 'LECT') sub = 'LEC';
    if (sub === 'MAT1') sub = 'M1';
    if (sub === 'MAT2') sub = 'M2';
    const yr = parts[1] || '2026';
    const forma = parts[parts.length - 1]?.toUpperCase() || 'REG';
    return `PAES-${sub}-${yr}-${forma}`;
  }
  if (id.startsWith('eval-simce-')) {
    return id.replace('eval-', '').toUpperCase();
  }
  if (id.startsWith('prueba-len')) {
    return id.replace('prueba-', 'SIMCE-').toUpperCase();
  }
  return id ? id.toUpperCase() : 'EVAL-001';
}

function mapRowToPrueba(row: Record<string, unknown>): Prueba {
  const preguntasIdsArray = Array.isArray(row.preguntas_ids)
    ? (row.preguntas_ids as string[])
    : Array.isArray(row.pregunta_ids)
      ? (row.pregunta_ids as string[])
      : [];
  return {
    id: String(row.id || ''),
    titulo: String(row.titulo || 'Sin título'),
    descripcion: String(row.descripcion || ''),
    asignaturaId: String(row.asignatura_id || 'asig-1'),
    asignaturaNombre: String(row.asignatura_nombre || (
      row.asignatura_id === 'asig-1' ? 'Competencia Matemática 1 (M1)' :
      row.asignatura_id === 'asig-2' ? 'Competencia Lectora' :
      row.asignatura_id === 'asig-3' ? 'Ciencias' :
      row.asignatura_id === 'asig-4' ? 'Historia, Geografía y Ciencias Sociales' :
      row.asignatura_id === 'asig-5' ? 'Ciencias — Biología' :
      row.asignatura_id === 'asig-6' ? 'Ciencias — Física' :
      row.asignatura_id === 'asig-7' ? 'Ciencias — Química' :
      row.asignatura_id === 'asig-8' ? 'Ciencias — Técnico Profesional' :
      row.asignatura_id === 'asig-9' ? 'Competencia Matemática 2 (M2)' :
      'Competencia Matemática 1 (M1)'
    )),
    nivel: String(row.nivel || '2° Medio'),
    profesorId: String(row.profesor_id || ''),
    cursoId: String(row.curso_id || ''),
    cursoNombre: String(row.curso_nombre || 'Curso General'),
    codigoPublico: deriveCodigoPublico(row),
    duracionMinutos: Number(row.tiempo_limite) || Number(row.duracion_minutos) || 60,
    creadoEn: row.created_at ? new Date(String(row.created_at)).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    // CORRECCIÓN (Auditoría 2026-09-16): columna real es 'preguntas_ids' (plural).
    // Se conserva fallback a 'pregunta_ids' solo para compatibilidad con filas antiguas en DB.
    preguntasIds: preguntasIdsArray,
    totalPreguntas: Number(row.total_preguntas) || (preguntasIdsArray.length > 0 ? preguntasIdsArray.length : 30),
    estado: row.estado === 'activa' || row.estado === 'finalizada' ? row.estado : 'borrador',
  };
}

// CORRECCIÓN (Auditoría 2026-09-16):
// - 'pregunta_ids' → 'preguntas_ids' (nombre real de columna en tabla evaluaciones)
// - Eliminado campo 'establecimiento' que no existe en la tabla evaluaciones
function mapPruebaToRow(p: Prueba, userId: string): Record<string, unknown> {
  return {
    id: p.id,
    titulo: p.titulo,
    descripcion: p.descripcion,
    asignatura_id: p.asignaturaId,
    nivel: p.nivel,
    profesor_id: userId,
    curso_id: p.cursoId || null,
    estado: p.estado,
    tiempo_limite: p.duracionMinutos,
    codigo_acceso: p.codigoPublico,
    preguntas_ids: p.preguntasIds || [],
    updated_at: new Date().toISOString(),
  };
}

export function useEvaluaciones({ currentUser, isSandboxMode = false }: UseEvaluacionesProps) {
  const [pruebas, setPruebas] = useState<Prueba[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!currentUser) {
      setPruebas([]);
      setIsLoading(false);
      return;
    }

    // ── MODO SANDBOX / DEMO ──
    if (isSandboxMode) {
      const demoList = currentUser.asignaturaId
        ? pruebasMock.filter(p => p.asignaturaId === currentUser.asignaturaId)
        : pruebasMock;
      setPruebas(demoList);
      setIsLoading(false);
      return;
    }

    // ── MODO PRODUCCIÓN (Supabase First) ──
    let isMounted = true;
    setIsLoading(true);

    async function loadPruebas() {
      try {
        let query = supabase.from('evaluaciones').select('*');
        const isAlumno = currentUser!.rol === 'alumno';
        const isProfesor = currentUser!.rol === 'profesor';

        if (isProfesor) {
          // Aislamiento estricto (Directivas 1 y 4): cada docente solo ve sus evaluaciones
          query = query.eq('profesor_id', currentUser!.id);
        } else if (isAlumno) {
          // Para alumnos: solo evaluaciones activas permitidas por RLS
          query = query.eq('estado', 'activa');
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          console.error('[useEvaluaciones] Error al consultar Supabase:', error.message);
          if (isMounted) {
            // Directiva 2: estado vacío legítimo en caso de error, no fallback a mocks
            setPruebas([]);
            setIsLoading(false);
          }
          return;
        }

        if (data && data.length > 0) {
          if (isMounted) {
            const dbPruebas = data.map(mapRowToPrueba);
            setPruebas(dbPruebas);
            setIsLoading(false);
          }
          return;
        }

        // Si es alumno y la consulta directa retorna vacia (por RLS), consultar catalogo publico activo
        if (isAlumno) {
          try {
            const catRes = await fetch("/api/evaluaciones-catalogo?action=catalogo");
            if (catRes.ok) {
              const catData = await catRes.json();
              if (catData?.evaluaciones && catData.evaluaciones.length > 0 && isMounted) {
                const mappedCat = catData.evaluaciones.map((row: Record<string, unknown>) => mapRowToPrueba({
                  ...row,
                  estado: "activa"
                }));
                setPruebas(mappedCat);
                setIsLoading(false);
                return;
              }
            }
          } catch (catErr) {
            console.warn("[useEvaluaciones] Fallback catalogo alumno:", catErr);
          }
        }

        // Directiva 2: estado vacío legítimo en producción. No auto-seed de mocks.
        if (isMounted) {
          setPruebas([]);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('[useEvaluaciones] Error general al cargar evaluaciones:', err);
        if (isMounted) {
          // Directiva 2: estado vacío real en error, no fallback a mocks
          setPruebas([]);
          setIsLoading(false);
        }
      }
    }

    loadPruebas();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.id, currentUser?.rol, currentUser?.email, isSandboxMode]);

  // Crear o actualizar evaluación
  const addEvaluacion = useCallback(
    async (nuevaPrueba: Prueba) => {
      setPruebas(prev => [nuevaPrueba, ...prev.filter(p => p.id !== nuevaPrueba.id)]);

      if (isSandboxMode || !currentUser) return;

      try {
        const row = mapPruebaToRow(nuevaPrueba, currentUser.id);
        const { error } = await supabase.from('evaluaciones').upsert(row, { onConflict: 'id' });
        if (error) {
          console.error('[useEvaluaciones] Error guardando evaluación en Supabase:', error.message);
        }
      } catch (err) {
        console.error('[useEvaluaciones] Excepción guardando evaluación:', err);
      }
    },
    [currentUser, isSandboxMode]
  );

  // Actualizar estado de una evaluación
  const updateEvaluacionEstado = useCallback(
    async (pruebaId: string, nuevoEstado: 'borrador' | 'activa' | 'finalizada') => {
      setPruebas(prev => prev.map(p => (p.id === pruebaId ? { ...p, estado: nuevoEstado } : p)));

      if (isSandboxMode || !currentUser) return;

      try {
        const { error } = await supabase
          .from('evaluaciones')
          .update({ estado: nuevoEstado, updated_at: new Date().toISOString() })
          .eq('id', pruebaId);
        if (error) {
          console.error('[useEvaluaciones] Error actualizando estado en Supabase:', error.message);
        }
      } catch (err) {
        console.error('[useEvaluaciones] Excepción actualizando estado:', err);
      }
    },
    [currentUser, isSandboxMode]
  );

  // Eliminar evaluación
  const deleteEvaluacion = useCallback(
    async (pruebaId: string) => {
      setPruebas(prev => prev.filter(p => p.id !== pruebaId));

      if (isSandboxMode || !currentUser) return;

      try {
        const { error } = await supabase.from('evaluaciones').delete().eq('id', pruebaId);
        if (error) {
          console.error('[useEvaluaciones] Error eliminando evaluación en Supabase:', error.message);
        }
      } catch (err) {
        console.error('[useEvaluaciones] Excepción eliminando evaluación:', err);
      }
    },
    [currentUser, isSandboxMode]
  );

  return {
    pruebas,
    setPruebas,
    isLoading,
    addEvaluacion,
    updateEvaluacionEstado,
    deleteEvaluacion,
  };
}
