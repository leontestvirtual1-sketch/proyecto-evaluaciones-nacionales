import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Pregunta, UserProfile } from '../types';
import {
  preguntasMock,
  preguntasLenguaje2MMock,
  preguntasLenguaje2MJunioMock,
  preguntasLenguaje2MAbrilMock,
} from '../data/mockData';

interface UseBancoPreguntasProps {
  user: UserProfile | null;
  isSandboxMode: boolean;
}

// Convertidor de base de datos (snake_case) a modelo TypeScript (camelCase)
export function mapRowToPregunta(row: any): Pregunta {
  return {
    id: row.id,
    asignaturaId: row.asignatura_id || '',
    ejeTematicoId: row.eje_tematico_id || '',
    habilidadId: row.habilidad_id || '',
    tipo: row.tipo || 'seleccion_multiple',
    nivel: row.nivel || '2° medio',
    dificultad: row.dificultad || 'media',
    enunciado: row.enunciado || '',
    imagenUrl: row.imagen_url || undefined,
    tablaMarkdown: row.tabla_markdown || undefined,
    alternativas: Array.isArray(row.alternativas) ? row.alternativas : [],
    respuestaCorrecta: row.respuesta_correcta ?? null,
    puntaje: Number(row.puntaje) || 1,
    fuente: row.fuente || 'Creada por docente',
  };
}

// Convertidor de modelo TypeScript (camelCase) a base de datos (snake_case)
export function mapPreguntaToRow(p: Pregunta, userId: string): Record<string, any> {
  return {
    id: p.id,
    propietario_id: userId,
    asignatura_id: p.asignaturaId,
    eje_tematico_id: p.ejeTematicoId || null,
    habilidad_id: p.habilidadId || null,
    tipo: p.tipo,
    nivel: p.nivel,
    dificultad: p.dificultad,
    enunciado: p.enunciado,
    imagen_url: p.imagenUrl || null,
    tabla_markdown: p.tablaMarkdown || null,
    alternativas: p.alternativas,
    respuesta_correcta: p.respuestaCorrecta,
    puntaje: p.puntaje,
    fuente: p.fuente || 'Creada por docente',
    updated_at: new Date().toISOString(),
  };
}

export function useBancoPreguntas({ user, isSandboxMode }: UseBancoPreguntasProps) {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isMigratingRef = useRef<boolean>(false);

  // Carga inicial y sincronización
  useEffect(() => {
    if (!user) {
      setPreguntas([]);
      setIsLoading(false);
      return;
    }

    // ── MODO SANDBOX / DEMO ──
    if (isSandboxMode) {
      setPreguntas(preguntasMock);
      setIsLoading(false);
      return;
    }

    // ── MODO PRODUCCIÓN (Supabase First) ──
    let isMounted = true;
    setIsLoading(true);

    async function loadBanco() {
      try {
        let query = supabase.from('preguntas').select('*');

        // Si no es admin, filtrar estrictamente por su ID de docente
        if (user!.rol !== 'admin') {
          query = query.eq('propietario_id', user!.id);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          console.warn('[useBancoPreguntas] Error al consultar Supabase:', error.message);
          // Fallback a localStorage si la tabla aún no existe o hay error transitorio
          try {
            const stored = localStorage.getItem(`sysget_banco_preguntas_${user!.id}`);
            if (stored && isMounted) {
              setPreguntas(JSON.parse(stored));
            } else if (isMounted) {
              setPreguntas([]);
            }
          } catch {
            if (isMounted) setPreguntas([]);
          }
          if (isMounted) setIsLoading(false);
          return;
        }

        if (data && data.length > 0) {
          if (isMounted) {
            setPreguntas(data.map(mapRowToPregunta));
            setIsLoading(false);
          }
          return;
        }

        // Si el banco en Supabase está vacío, verificamos si requiere seed inicial o migración
        if (!isMigratingRef.current) {
          isMigratingRef.current = true;

          // 1. Caso especial: María Teresa González (Escuela Premilitar)
          const isPremilitarTeacher =
            user!.email.toLowerCase().includes('premil.cl') ||
            user!.email.toLowerCase().includes('maria') ||
            user!.establecimiento?.toLowerCase().includes('premilitar');

          if (isPremilitarTeacher) {
            const allPremilitarQuestions = [
              ...preguntasLenguaje2MMock,
              ...preguntasLenguaje2MJunioMock,
              ...preguntasLenguaje2MAbrilMock,
            ];

            // Eliminar posibles duplicados por ID
            const uniqueMap = new Map<string, Pregunta>();
            allPremilitarQuestions.forEach(p => uniqueMap.set(p.id, p));
            const seedQuestions = Array.from(uniqueMap.values());

            // 1. Mostrar de inmediato en UI
            if (isMounted) {
              setPreguntas(seedQuestions);
              setIsLoading(false);
            }

            // 2. Persistir en segundo plano en Supabase
            try {
              const rowsToInsert = seedQuestions.map(p => mapPreguntaToRow(p, user!.id));
              const { error: seedError } = await supabase.from('preguntas').upsert(rowsToInsert, { onConflict: 'id' });
              if (seedError) {
                console.warn('[useBancoPreguntas] Warning al guardar seed en Supabase:', seedError.message);
              }
            } catch (err) {
              console.error('[useBancoPreguntas] Error al persistir seed:', err);
            }

            return;
          }

          // 2. Migrar de localStorage si existían preguntas guardadas previamente
          try {
            const localStored = localStorage.getItem(`sysget_banco_preguntas_${user!.id}`);
            if (localStored) {
              const localList: Pregunta[] = JSON.parse(localStored);
              if (localList.length > 0) {
                const rows = localList.map(p => mapPreguntaToRow(p, user!.id));
                const { error: migError } = await supabase.from('preguntas').upsert(rows);
                if (!migError && isMounted) {
                  setPreguntas(localList);
                  localStorage.removeItem(`sysget_banco_preguntas_${user!.id}`);
                  setIsLoading(false);
                  return;
                }
              }
            }
          } catch (e) {
            console.error('[useBancoPreguntas] Error migrando localStorage a Supabase:', e);
          }
        }

        if (isMounted) {
          setPreguntas([]);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('[useBancoPreguntas] Error general al cargar banco:', err);
        if (isMounted) {
          setPreguntas([]);
          setIsLoading(false);
        }
      }
    }

    loadBanco();

    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.email, isSandboxMode]);

  // Agregar pregunta
  const addPregunta = useCallback(
    async (p: Pregunta) => {
      // Optimistic update
      setPreguntas(prev => [p, ...prev]);

      if (isSandboxMode || !user) return;

      try {
        const row = mapPreguntaToRow(p, user.id);
        const { error } = await supabase.from('preguntas').insert(row);
        if (error) {
          console.error('[useBancoPreguntas] Error al insertar en Supabase:', error);
          // Fallback seguro a localStorage en caso de error
          try {
            const current = JSON.parse(localStorage.getItem(`sysget_banco_preguntas_${user.id}`) || '[]');
            localStorage.setItem(`sysget_banco_preguntas_${user.id}`, JSON.stringify([p, ...current]));
          } catch {}
        }
      } catch (err) {
        console.error('[useBancoPreguntas] Excepción al agregar pregunta:', err);
      }
    },
    [user, isSandboxMode]
  );

  // Actualizar pregunta
  const updatePregunta = useCallback(
    async (p: Pregunta) => {
      setPreguntas(prev => prev.map(item => (item.id === p.id ? p : item)));

      if (isSandboxMode || !user) return;

      try {
        const row = mapPreguntaToRow(p, user.id);
        const { error } = await supabase
          .from('preguntas')
          .update(row)
          .eq('id', p.id)
          .eq('propietario_id', user.id);

        if (error) {
          console.error('[useBancoPreguntas] Error al actualizar en Supabase:', error);
        }
      } catch (err) {
        console.error('[useBancoPreguntas] Excepción al actualizar pregunta:', err);
      }
    },
    [user, isSandboxMode]
  );

  // Eliminar pregunta
  const deletePregunta = useCallback(
    async (id: string) => {
      setPreguntas(prev => prev.filter(item => item.id !== id));

      if (isSandboxMode || !user) return;

      try {
        const { error } = await supabase
          .from('preguntas')
          .delete()
          .eq('id', id)
          .eq('propietario_id', user.id);

        if (error) {
          console.error('[useBancoPreguntas] Error al eliminar de Supabase:', error);
        }
      } catch (err) {
        console.error('[useBancoPreguntas] Excepción al eliminar pregunta:', err);
      }
    },
    [user, isSandboxMode]
  );

  return {
    preguntas,
    isLoading,
    addPregunta,
    updatePregunta,
    deletePregunta,
  };
}
