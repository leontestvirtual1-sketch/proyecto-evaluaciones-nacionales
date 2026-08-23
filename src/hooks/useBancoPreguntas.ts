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

        const userEmail = (user!.email || '').toLowerCase();
        const isPremil = userEmail.includes('premil') || userEmail.includes('mariateresa') || user!.id === '98e7e5c9-e55d-4b47-bd5d-c6aabd463d18';
        const isSusana = userEmail.includes('susana') || userEmail.includes('nentitasusana') || user!.id === 'e14d8a54-fe01-4a6b-a22d-8f8e00000001';
        const teacherAsig = user!.asignaturaId || (isPremil ? 'asig-2' : isSusana ? 'asig-1' : '');
        const isLenguaje = teacherAsig === 'asig-2' || isPremil;

        // Base oficial garantizada según especialidad
        const baseForSubject = user!.rol === 'admin'
          ? [
              ...preguntasMock,
              ...preguntasLenguaje2MMock,
              ...preguntasLenguaje2MJunioMock,
              ...preguntasLenguaje2MAbrilMock,
            ]
          : isLenguaje
          ? [
              ...preguntasLenguaje2MMock,
              ...preguntasLenguaje2MJunioMock,
              ...preguntasLenguaje2MAbrilMock
            ]
          : teacherAsig
          ? preguntasMock.filter(p => p.asignaturaId === teacherAsig)
          : preguntasMock;

        // Si no es admin, consultar las preguntas de su asignatura O de su ID de docente
        if (user!.rol !== 'admin') {
          if (teacherAsig) {
            query = query.or(`propietario_id.eq.${user!.id},asignatura_id.eq.${teacherAsig}`);
          } else {
            query = query.eq('propietario_id', user!.id);
          }
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          console.warn('[useBancoPreguntas] Error al consultar Supabase:', error.message);
        }

        if (isMounted) {
          const dbQuestions = data && data.length > 0 ? data.map(mapRowToPregunta) : [];
          const uniqueMap = new Map<string, Pregunta>();

          // 1. Inicializar con el catálogo base oficial
          baseForSubject.forEach(p => uniqueMap.set(p.id, { ...p, propietarioId: user!.id }));

          // 2. Fusionar con las preguntas de la base de datos Supabase
          const imageMap = new Map<string, { imagenUrl?: string; tablaMarkdown?: string }>();
          [...preguntasLenguaje2MMock, ...preguntasLenguaje2MJunioMock, ...preguntasLenguaje2MAbrilMock].forEach(p => {
            imageMap.set(p.id, { imagenUrl: p.imagenUrl, tablaMarkdown: p.tablaMarkdown });
          });

          dbQuestions.forEach(p => {
            const existing = uniqueMap.get(p.id);
            const meta = imageMap.get(p.id);
            uniqueMap.set(p.id, {
              ...existing,
              ...p,
              imagenUrl: p.imagenUrl || existing?.imagenUrl || meta?.imagenUrl,
              tablaMarkdown: p.tablaMarkdown || existing?.tablaMarkdown || meta?.tablaMarkdown
            });
          });

          // 3. Cargar y fusionar preguntas manuales guardadas en localStorage
          try {
            const localKeys = [`sysget_banco_preguntas_${user!.id}`, 'sysget_banco_preguntas_custom'];
            localKeys.forEach(k => {
              const stored = localStorage.getItem(k);
              if (stored) {
                const parsed: Pregunta[] = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                  parsed.forEach(lp => {
                    if (lp && lp.id) {
                      uniqueMap.set(lp.id, { ...lp, propietarioId: user!.id });
                    }
                  });
                }
              }
            });
          } catch (e) {}

          setPreguntas(Array.from(uniqueMap.values()));
          setIsLoading(false);
        }
      } catch (err) {
        console.error('[useBancoPreguntas] Error general al cargar banco:', err);
        if (isMounted) {
          const userEmail = (user!.email || '').toLowerCase();
          const isPremil = userEmail.includes('premil') || userEmail.includes('mariateresa') || user!.id === '98e7e5c9-e55d-4b47-bd5d-c6aabd463d18';
          const teacherAsig = user!.asignaturaId || (isPremil ? 'asig-2' : '');
          const fallback = (teacherAsig === 'asig-2' || isPremil)
            ? [
                ...preguntasLenguaje2MMock,
                ...preguntasLenguaje2MJunioMock,
                ...preguntasLenguaje2MAbrilMock,
              ]
            : preguntasMock;
          setPreguntas(fallback);
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
      const fullPregunta: Pregunta = {
        ...p,
        propietarioId: user?.id || p.propietarioId,
        asignaturaId: p.asignaturaId || user?.asignaturaId || 'asig-2',
        establecimiento: p.establecimiento || user?.establecimiento,
        nivel: p.nivel || '2° Medio'
      };

      // Optimistic update
      setPreguntas(prev => [fullPregunta, ...prev.filter(item => item.id !== fullPregunta.id)]);

      // Guardar en localStorage inmediatamente para garantizar disponibilidad offline y entre recargas
      if (user) {
        try {
          const key1 = `sysget_banco_preguntas_${user.id}`;
          const current1: Pregunta[] = JSON.parse(localStorage.getItem(key1) || '[]');
          localStorage.setItem(key1, JSON.stringify([fullPregunta, ...current1.filter(x => x.id !== fullPregunta.id)]));

          const currentAll: Pregunta[] = JSON.parse(localStorage.getItem('sysget_banco_preguntas_custom') || '[]');
          localStorage.setItem('sysget_banco_preguntas_custom', JSON.stringify([fullPregunta, ...currentAll.filter(x => x.id !== fullPregunta.id)]));
        } catch (e) {}
      }

      if (isSandboxMode || !user) return;

      try {
        const row = mapPreguntaToRow(fullPregunta, user.id);
        const { error } = await supabase.from('preguntas').upsert(row, { onConflict: 'id' });
        if (error) {
          console.error('[useBancoPreguntas] Error al insertar en Supabase:', error);
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
