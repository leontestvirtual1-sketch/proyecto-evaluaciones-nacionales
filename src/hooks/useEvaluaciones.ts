import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Prueba, UserProfile } from '../types';
import {
  pruebasMock,
  pruebaLenguaje2MMock,
  pruebaLenguaje2MJunioMock,
  pruebaLenguaje2MAbrilMock,
} from '../data/mockData';

interface UseEvaluacionesProps {
  currentUser?: UserProfile | null;
  isSandboxMode?: boolean;
}

function mapRowToPrueba(row: any): Prueba {
  return {
    id: row.id,
    titulo: row.titulo || 'Sin título',
    descripcion: row.descripcion || '',
    asignaturaId: row.asignatura_id || 'asig-1',
    asignaturaNombre: row.asignatura_nombre || (row.asignatura_id === 'asig-2' ? 'Lengua y Literatura' : row.asignatura_id === 'asig-3' ? 'Ciencias Naturales' : 'Matemática'),
    nivel: row.nivel || '2° Medio',
    profesorId: row.profesor_id || '',
    cursoId: row.curso_id || '',
    cursoNombre: row.curso_nombre || 'Curso General',
    codigoPublico: row.codigo_acceso || row.codigo_publico || 'EVAL-001',
    duracionMinutos: Number(row.tiempo_limite) || Number(row.duracion_minutos) || 60,
    creadoEn: row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    preguntasIds: Array.isArray(row.pregunta_ids) ? row.pregunta_ids : Array.isArray(row.preguntas_ids) ? row.preguntas_ids : [],
    totalPreguntas: Number(row.total_preguntas) || (Array.isArray(row.pregunta_ids) ? row.pregunta_ids.length : 30),
    estado: row.estado === 'activa' || row.estado === 'finalizada' ? row.estado : 'borrador',
  };
}

function mapPruebaToRow(p: Prueba, userId: string, establecimiento: string): Record<string, any> {
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
    pregunta_ids: p.preguntasIds || [],
    establecimiento: establecimiento,
    updated_at: new Date().toISOString(),
  };
}

export function useEvaluaciones({ currentUser, isSandboxMode = false }: UseEvaluacionesProps) {
  const [pruebas, setPruebas] = useState<Prueba[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isSeededRef = useRef<boolean>(false);

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

        const email = (currentUser!.email || '').toLowerCase();
        const isPremilitarTeacher = email.includes('premil.cl') || email.includes('mariateresa') || currentUser!.id === 'prof-prem-01';
        const isSusanaTeacher = email.includes('susana') || email.includes('nentitasusana') || currentUser!.id === 'prof-mc-01';
        const isAdmin = currentUser!.rol === 'admin';

        if (!isAdmin) {
          if (isPremilitarTeacher) {
            query = query.or(`profesor_id.eq.${currentUser!.id},profesor_id.eq.prof-prem-01,asignatura_id.eq.asig-2`);
          } else if (isSusanaTeacher) {
            query = query.or(`profesor_id.eq.${currentUser!.id},profesor_id.eq.prof-mc-01,asignatura_id.eq.asig-1`);
          } else {
            query = query.eq('profesor_id', currentUser!.id);
          }
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          console.warn('[useEvaluaciones] Error al consultar Supabase:', error.message);
          if (isMounted) {
            // Caso María Teresa en fallback
            if (isPremilitarTeacher || isAdmin) {
              setPruebas([pruebaLenguaje2MMock, pruebaLenguaje2MJunioMock, pruebaLenguaje2MAbrilMock]);
            } else {
              setPruebas([]);
            }
            setIsLoading(false);
          }
          return;
        }

        if (data && data.length > 0) {
          if (isMounted) {
            const dbPruebas = data.map(mapRowToPrueba);
            // Si es docente de Lenguaje o María Teresa, asegurar que las 3 oficiales estén presentes
            if (isPremilitarTeacher) {
              const mapById = new Map<string, Prueba>();
              [pruebaLenguaje2MMock, pruebaLenguaje2MJunioMock, pruebaLenguaje2MAbrilMock].forEach(p => mapById.set(p.id, p));
              dbPruebas.forEach(p => mapById.set(p.id, p));
              setPruebas(Array.from(mapById.values()));
            } else {
              setPruebas(dbPruebas);
            }
            setIsLoading(false);
          }
          return;
        }

        // Si la tabla en Supabase está vacía o sin filas para este docente:
        if (isPremilitarTeacher || isAdmin) {
          const premilitarPruebas = [
            { ...pruebaLenguaje2MMock, profesorId: currentUser!.id },
            { ...pruebaLenguaje2MJunioMock, profesorId: currentUser!.id },
            { ...pruebaLenguaje2MAbrilMock, profesorId: currentUser!.id }
          ];

          if (isMounted) {
            setPruebas(premilitarPruebas);
            setIsLoading(false);
          }

          try {
            const rows = premilitarPruebas.map(p =>
              mapPruebaToRow(p, currentUser!.id, currentUser!.establecimiento || 'Escuela Premilitar Héroes de la Concepción')
            );
            await supabase.from('evaluaciones').upsert(rows, { onConflict: 'id' });
          } catch (err) {
            console.error('[useEvaluaciones] Error auto-seeding evaluaciones Premilitar:', err);
          }
          return;
        }

        // Para cualquier otro docente nuevo de producción: parte en 0 legítimo (Directiva 2)
        if (isMounted) {
          setPruebas([]);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('[useEvaluaciones] Error general al cargar evaluaciones:', err);
        if (isMounted) {
          const email = (currentUser!.email || '').toLowerCase();
          if (email.includes('premil.cl') || email.includes('mariateresa') || currentUser!.rol === 'admin') {
            setPruebas([pruebaLenguaje2MMock, pruebaLenguaje2MJunioMock, pruebaLenguaje2MAbrilMock]);
          } else {
            setPruebas([]);
          }
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
        const row = mapPruebaToRow(
          nuevaPrueba,
          currentUser.id,
          currentUser.establecimiento || 'Establecimiento'
        );
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
