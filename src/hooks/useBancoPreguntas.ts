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

    // ── MODO PRODUCCIÓN (Supabase First - Directiva 3) ──
    let isMounted = true;
    setIsLoading(true);

    async function loadBanco() {
      try {
        let query = supabase.from('preguntas').select('*');

        const userEmail = (user!.email || '').toLowerCase();
        const isPremil = userEmail.includes('premil') || userEmail.includes('mariateresa') || user!.id === '98e7e5c9-e55d-4b47-bd5d-c6aabd463d18';
        const isSusana = userEmail.includes('susana') || userEmail.includes('nentitasusana') || user!.id === 'e14d8a54-fe01-4a6b-a22d-8f8e00000001';
        const teacherAsig = user!.asignaturaId || (isPremil ? 'asig-2' : isSusana ? 'asig-1' : '');

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

          // Enriquecedor de metadatos (imágenes oficiales y tablas formateadas)
          const imageMap = new Map<string, { imagenUrl?: string; tablaMarkdown?: string }>();
          [...preguntasLenguaje2MMock, ...preguntasLenguaje2MJunioMock, ...preguntasLenguaje2MAbrilMock].forEach(p => {
            imageMap.set(p.id, { imagenUrl: p.imagenUrl, tablaMarkdown: p.tablaMarkdown });
          });

          const enrichedQuestions = dbQuestions.map(p => {
            const meta = imageMap.get(p.id);
            return {
              ...p,
              imagenUrl: p.imagenUrl || meta?.imagenUrl,
              tablaMarkdown: p.tablaMarkdown || meta?.tablaMarkdown
            };
          });

          // Limpiar claves residuales de localStorage para cumplir con almacenamiento limpio (Directiva 3)
          try {
            const keysToClean = [
              `sysget_banco_preguntas_${user!.id}`,
              'sysget_banco_preguntas_custom'
            ];
            keysToClean.forEach(k => localStorage.removeItem(k));
          } catch { /* ignorar en entornos sin localStorage */ }

          setPreguntas(enrichedQuestions);
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

  // Agregar pregunta — SUPABASE FIRST (Directiva 3, sin localStorage)
  const addPregunta = useCallback(
    async (p: Pregunta): Promise<{ success: boolean; error?: string }> => {
      const fullPregunta: Pregunta = {
        ...p,
        propietarioId: user?.id || p.propietarioId,
        asignaturaId: p.asignaturaId || user?.asignaturaId || 'asig-2',
        establecimiento: p.establecimiento || user?.establecimiento,
        nivel: p.nivel || '4° Básico'
      };

      // ── MODO SANDBOX / DEMO: solo memoria ──
      if (isSandboxMode || !user) {
        setPreguntas(prev => [fullPregunta, ...prev.filter(item => item.id !== fullPregunta.id)]);
        return { success: true };
      }

      // ── MODO PRODUCCIÓN: Supabase es la fuente única de verdad ──
      try {
        const row = mapPreguntaToRow(fullPregunta, user.id);
        const { error } = await supabase.from('preguntas').upsert(row, { onConflict: 'id' });

        if (error) {
          console.error('[useBancoPreguntas] Error al insertar en Supabase:', error);
          return { success: false, error: `Error en base de datos: ${error.message}` };
        }

        // Confirmado en Supabase → actualizar estado en React
        setPreguntas(prev => [fullPregunta, ...prev.filter(item => item.id !== fullPregunta.id)]);
        return { success: true };
      } catch (err: any) {
        console.error('[useBancoPreguntas] Excepción al agregar pregunta:', err);
        return { success: false, error: `Error inesperado: ${err?.message || 'Sin conexión'}` };
      }
    },
    [user, isSandboxMode]
  );

  // Actualizar pregunta — SUPABASE FIRST (Directiva 3, sin localStorage)
  const updatePregunta = useCallback(
    async (p: Pregunta): Promise<{ success: boolean; error?: string }> => {
      if (isSandboxMode || !user) {
        setPreguntas(prev => prev.map(item => (item.id === p.id ? p : item)));
        return { success: true };
      }

      try {
        const row = mapPreguntaToRow(p, user.id);
        const { error } = await supabase
          .from('preguntas')
          .update(row)
          .eq('id', p.id);

        if (error) {
          console.error('[useBancoPreguntas] Error al actualizar en Supabase:', error);
          return { success: false, error: `Error al actualizar: ${error.message}` };
        }

        setPreguntas(prev => prev.map(item => (item.id === p.id ? p : item)));
        return { success: true };
      } catch (err: any) {
        console.error('[useBancoPreguntas] Excepción al actualizar pregunta:', err);
        return { success: false, error: `Error inesperado: ${err?.message || 'Sin conexión'}` };
      }
    },
    [user, isSandboxMode]
  );

  // Eliminar pregunta — SUPABASE FIRST (Directiva 3, sin localStorage)
  const deletePregunta = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      if (isSandboxMode || !user) {
        setPreguntas(prev => prev.filter(item => item.id !== id));
        return { success: true };
      }

      try {
        const { error } = await supabase
          .from('preguntas')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('[useBancoPreguntas] Error al eliminar de Supabase:', error);
          return { success: false, error: `Error al eliminar: ${error.message}` };
        }

        setPreguntas(prev => prev.filter(item => item.id !== id));
        return { success: true };
      } catch (err: any) {
        console.error('[useBancoPreguntas] Excepción al eliminar pregunta:', err);
        return { success: false, error: `Error inesperado: ${err?.message || 'Sin conexión'}` };
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
