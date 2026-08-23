import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { UserProfile } from '../types';
import { APP_CONFIG } from '../config/appConfig';

export interface CursoItem {
  id: string;
  nombre: string;
  nivel: string;
  anio: number;
  codigoInvitacion: string;
  totalAlumnos: number;
  establecimiento: string;
  profesorJefeId?: string;
  rbd?: string;
}

interface UseCursosProps {
  currentUser?: UserProfile | null;
  isSandboxMode?: boolean;
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function mapRowToCurso(row: any): CursoItem {
  return {
    id: row.id,
    nombre: row.nombre || '',
    nivel: row.nivel || '',
    anio: Number(row.anio) || new Date().getFullYear(),
    codigoInvitacion: row.codigo_invitacion || generateCode(),
    totalAlumnos: Number(row.total_alumnos) || 0,
    establecimiento: row.establecimiento || '',
    profesorJefeId: row.profesor_jefe_id || undefined,
    rbd: row.rbd || undefined,
  };
}

function mapCursoToRow(c: CursoItem, userId: string, rbd?: string): Record<string, any> {
  return {
    id: c.id,
    nombre: c.nombre,
    nivel: c.nivel,
    anio: c.anio,
    codigo_invitacion: c.codigoInvitacion,
    total_alumnos: c.totalAlumnos,
    establecimiento: c.establecimiento,
    profesor_jefe_id: userId,
    rbd: rbd || c.rbd || null,
    activo: true,
  };
}

export function useCursos({ currentUser, isSandboxMode = false }: UseCursosProps) {
  const [cursos, setCursos] = useState<CursoItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isMigratedRef = useRef<boolean>(false);

  const storageKey = `sysget_cursos_${currentUser?.id || 'default'}`;
  const colegioNombre = currentUser?.establecimiento || APP_CONFIG.nombreEstablecimiento;

  // Cursos iniciales para modo demo/sandbox
  const getDemoCursos = useCallback((): CursoItem[] => {
    return [
      { id: 'curso-1', nombre: '8° Básico A', nivel: '8° Básico', anio: 2026, codigoInvitacion: 'DEMO2026', totalAlumnos: 28, establecimiento: colegioNombre },
      { id: 'curso-2', nombre: '8° Básico B', nivel: '8° Básico', anio: 2026, codigoInvitacion: 'BIOB2026', totalAlumnos: 30, establecimiento: colegioNombre },
      { id: 'curso-6a', nombre: '6° Básico A', nivel: '6° Básico', anio: 2026, codigoInvitacion: 'CN6A2026', totalAlumnos: 25, establecimiento: colegioNombre },
      { id: 'curso-6b', nombre: '6° Básico B', nivel: '6° Básico', anio: 2026, codigoInvitacion: 'CN6B2026', totalAlumnos: 25, establecimiento: colegioNombre },
    ];
  }, [colegioNombre]);

  useEffect(() => {
    if (!currentUser) {
      setCursos([]);
      setIsLoading(false);
      return;
    }

    // ── MODO SANDBOX / DEMO ──
    if (isSandboxMode) {
      const saved = localStorage.getItem(`sysget_demo_cursos_${currentUser.id}`);
      if (saved) {
        try {
          setCursos(JSON.parse(saved));
        } catch {
          setCursos(getDemoCursos());
        }
      } else {
        setCursos(getDemoCursos());
      }
      setIsLoading(false);
      return;
    }

    // ── MODO PRODUCCIÓN (Supabase First) ──
    let isMounted = true;
    setIsLoading(true);

    async function loadCursos() {
      try {
        let query = supabase.from('cursos').select('*');

        if (currentUser!.rol !== 'admin') {
          query = query.eq('profesor_jefe_id', currentUser!.id);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          console.warn('[useCursos] Error al consultar cursos en Supabase:', error.message);
          if (isMounted) {
            // Fallback temporal si la tabla aún se está configurando
            try {
              const stored = localStorage.getItem(storageKey);
              setCursos(stored ? JSON.parse(stored) : []);
            } catch {
              setCursos([]);
            }
            setIsLoading(false);
          }
          return;
        }

        if (data && data.length > 0) {
          if (isMounted) {
            const dbCursos = data.map(mapRowToCurso);
            setCursos(dbCursos);
            setIsLoading(false);
          }
          return;
        }

        // Si no hay cursos en Supabase, verificar si hay que migrar desde localStorage
        if (!isMigratedRef.current) {
          isMigratedRef.current = true;
          try {
            const localStored = localStorage.getItem(storageKey);
            if (localStored) {
              const localList: CursoItem[] = JSON.parse(localStored);
              // Filtrar placeholders obsoletos
              const validList = localList.filter(c => !(c.nombre === 'Curso 1' && c.totalAlumnos === 0));
              if (validList.length > 0) {
                const rows = validList.map(c => mapCursoToRow(c, currentUser!.id, currentUser!.rbd));
                const { error: insertErr } = await supabase.from('cursos').upsert(rows, { onConflict: 'id' });
                if (!insertErr && isMounted) {
                  setCursos(validList);
                  localStorage.removeItem(storageKey);
                  setIsLoading(false);
                  return;
                }
              }
            }
          } catch (e) {
            console.error('[useCursos] Error migrando cursos locales:', e);
          }
        }

        // Docente de producción nuevo: empieza limpio con 0 cursos
        if (isMounted) {
          setCursos([]);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('[useCursos] Error general al cargar cursos:', err);
        if (isMounted) {
          setCursos([]);
          setIsLoading(false);
        }
      }
    }

    loadCursos();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.id, currentUser?.rol, isSandboxMode, storageKey, getDemoCursos]);

  // Guardar curso (Crear o Editar)
  const saveCurso = useCallback(
    async (c: CursoItem) => {
      setCursos(prev => {
        const exists = prev.find(p => p.id === c.id);
        return exists ? prev.map(p => (p.id === c.id ? c : p)) : [c, ...prev];
      });

      if (isSandboxMode || !currentUser) {
        try {
          const current = JSON.parse(localStorage.getItem(`sysget_demo_cursos_${currentUser?.id}`) || '[]');
          const updated = current.some((item: CursoItem) => item.id === c.id)
            ? current.map((item: CursoItem) => (item.id === c.id ? c : item))
            : [c, ...current];
          localStorage.setItem(`sysget_demo_cursos_${currentUser?.id}`, JSON.stringify(updated));
        } catch {}
        return;
      }

      try {
        const row = mapCursoToRow(c, currentUser.id, currentUser.rbd);
        const { error } = await supabase.from('cursos').upsert(row, { onConflict: 'id' });
        if (error) {
          console.error('[useCursos] Error al guardar curso en Supabase:', error.message);
        }
      } catch (err) {
        console.error('[useCursos] Excepción al guardar curso:', err);
      }
    },
    [currentUser, isSandboxMode]
  );

  // Eliminar curso
  const deleteCurso = useCallback(
    async (id: string) => {
      setCursos(prev => prev.filter(c => c.id !== id));

      if (isSandboxMode || !currentUser) return;

      try {
        const { error } = await supabase.from('cursos').delete().eq('id', id);
        if (error) {
          console.error('[useCursos] Error al eliminar curso en Supabase:', error.message);
        }
      } catch (err) {
        console.error('[useCursos] Excepción al eliminar curso:', err);
      }
    },
    [currentUser, isSandboxMode]
  );

  // Regenerar código de invitación
  const regenCodigo = useCallback(
    async (id: string) => {
      const newCode = generateCode();
      setCursos(prev => prev.map(c => (c.id === id ? { ...c, codigoInvitacion: newCode } : c)));

      if (isSandboxMode || !currentUser) return;

      try {
        const { error } = await supabase
          .from('cursos')
          .update({ codigo_invitacion: newCode })
          .eq('id', id);
        if (error) {
          console.error('[useCursos] Error al regenerar código:', error.message);
        }
      } catch (err) {
        console.error('[useCursos] Excepción al regenerar código:', err);
      }
    },
    [currentUser, isSandboxMode]
  );

  return {
    cursos,
    isLoading,
    saveCurso,
    deleteCurso,
    regenCodigo,
  };
}
