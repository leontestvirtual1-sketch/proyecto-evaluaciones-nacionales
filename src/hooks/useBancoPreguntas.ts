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
    propietarioId: row.propietario_id || undefined,
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
          if (isMounted) {
            if (user!.rol === 'admin') {
              const allPremilitar = [
                ...preguntasLenguaje2MMock,
                ...preguntasLenguaje2MJunioMock,
                ...preguntasLenguaje2MAbrilMock,
              ];
              const uniqueMap = new Map<string, Pregunta>();
              allPremilitar.forEach(p => uniqueMap.set(p.id, p));
              setPreguntas(Array.from(uniqueMap.values()));
            } else {
              try {
                const stored = localStorage.getItem(`sysget_banco_preguntas_${user!.id}`);
                setPreguntas(stored ? JSON.parse(stored) : []);
              } catch {
                setPreguntas([]);
              }
            }
            setIsLoading(false);
          }
          return;
        }

        if (data && data.length > 0) {
          if (isMounted) {
            const dbQuestions = data.map(mapRowToPregunta);
            if (user!.rol === 'admin') {
              const allGlobal = [
                ...preguntasMock,
                ...preguntasLenguaje2MMock,
                ...preguntasLenguaje2MJunioMock,
                ...preguntasLenguaje2MAbrilMock,
              ];
              const uniqueMap = new Map<string, Pregunta>();
              allGlobal.forEach(p => uniqueMap.set(p.id, p));
              // Las preguntas de Supabase se fusionan preservando imágenes del catálogo si no están en DB
              dbQuestions.forEach(p => {
                const existing = uniqueMap.get(p.id);
                uniqueMap.set(p.id, {
                  ...existing,
                  ...p,
                  imagenUrl: p.imagenUrl || existing?.imagenUrl,
                  tablaMarkdown: p.tablaMarkdown || existing?.tablaMarkdown
                });
              });
              setPreguntas(Array.from(uniqueMap.values()));
            } else {
              // Dinámico para cualquier docente: combina preguntas de su especialidad con sus preguntas de Supabase
              const teacherAsig = user!.asignaturaId || '';
              const baseForSubject = teacherAsig
                ? [
                    ...preguntasMock.filter(p => p.asignaturaId === teacherAsig),
                    ...(teacherAsig === 'asig-2' ? [...preguntasLenguaje2MMock, ...preguntasLenguaje2MJunioMock, ...preguntasLenguaje2MAbrilMock] : [])
                  ]
                : preguntasMock;

              const uniqueMap = new Map<string, Pregunta>();
              baseForSubject.forEach(p => uniqueMap.set(p.id, { ...p, propietarioId: user!.id }));
              dbQuestions.forEach(p => {
                const existing = uniqueMap.get(p.id);
                uniqueMap.set(p.id, {
                  ...existing,
                  ...p,
                  imagenUrl: p.imagenUrl || existing?.imagenUrl,
                  tablaMarkdown: p.tablaMarkdown || existing?.tablaMarkdown
                });
              });
              setPreguntas(Array.from(uniqueMap.values()));
            }
            setIsLoading(false);
          }
          return;
        }

        // Si el banco en Supabase está vacío o se está inicializando, verificamos el seed por especialidad
        if (!isMigratingRef.current) {
          isMigratingRef.current = true;

          // 1. Caso Administrador: proveer catálogo global institucional completo
          if (user!.rol === 'admin') {
            const allGlobal = [
              ...preguntasMock,
              ...preguntasLenguaje2MMock,
              ...preguntasLenguaje2MJunioMock,
              ...preguntasLenguaje2MAbrilMock,
            ];
            const uniqueMap = new Map<string, Pregunta>();
            allGlobal.forEach(p => uniqueMap.set(p.id, p));
            const globalQuestions = Array.from(uniqueMap.values());

            if (isMounted) {
              setPreguntas(globalQuestions);
              setIsLoading(false);
            }
            return;
          }

          // 2. Dinámico para cualquier docente actual o futuro según su asignatura
          const teacherAsig = user!.asignaturaId || '';
          const subjectQuestions = teacherAsig
            ? [
                ...preguntasMock.filter(p => p.asignaturaId === teacherAsig),
                ...(teacherAsig === 'asig-2' ? [...preguntasLenguaje2MMock, ...preguntasLenguaje2MJunioMock, ...preguntasLenguaje2MAbrilMock] : [])
              ]
            : preguntasMock;

          const uniqueMap = new Map<string, Pregunta>();
          subjectQuestions.forEach(p => uniqueMap.set(p.id, { ...p, propietarioId: user!.id }));
          const seedQuestions = Array.from(uniqueMap.values());

          if (seedQuestions.length > 0) {
            if (isMounted) {
              setPreguntas(seedQuestions);
              setIsLoading(false);
            }

            // Persistir de forma segura en Supabase para el docente
            try {
              const rowsToInsert = seedQuestions.map(p => mapPreguntaToRow(p, user!.id));
              const { error: seedError } = await supabase.from('preguntas').upsert(rowsToInsert, { onConflict: 'id' });
              if (seedError) {
                console.warn('[useBancoPreguntas] Seed notice:', seedError.message);
              }
            } catch (err) {
              console.error('[useBancoPreguntas] Error al persistir seed:', err);
            }
            return;
          }

          // 4. Migrar de localStorage si existían preguntas guardadas previamente
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
          if (user!.rol === 'admin') {
            const allGlobal = [
              ...preguntasMock,
              ...preguntasLenguaje2MMock,
              ...preguntasLenguaje2MJunioMock,
              ...preguntasLenguaje2MAbrilMock,
            ];
            const uniqueMap = new Map<string, Pregunta>();
            allGlobal.forEach(p => uniqueMap.set(p.id, p));
            setPreguntas(Array.from(uniqueMap.values()));
          } else {
            setPreguntas([]);
          }
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
