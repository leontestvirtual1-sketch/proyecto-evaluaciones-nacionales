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

function mapRowToCurso(row: Record<string, unknown>): CursoItem {
  return {
    id: (row.id as string) ?? '',
    nombre: (row.nombre as string) || '',
    nivel: (row.nivel as string) || '',
    anio: Number(row.anio) || new Date().getFullYear(),
    codigoInvitacion: (row.codigo_invitacion as string) || generateCode(),
    totalAlumnos: Number(row.total_alumnos) || 0,
    establecimiento: (row.establecimiento as string) || '',
    profesorJefeId: (row.profesor_jefe_id as string) || undefined,
    rbd: (row.rbd as string) || undefined,
  };
}

function mapCursoToRow(c: CursoItem, userId: string, rbd?: string): Record<string, unknown> {
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

  const storageKey = isSandboxMode
    ? `sysget_demo_cursos_${currentUser?.id || 'default'}`
    : `sysget_prod_cursos_${currentUser?.id || 'default'}`;
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
    // Resetear el ref de migración al montar/remontar para evitar el bug
    // de React StrictMode que ejecuta el efecto dos veces en desarrollo
    isMigratedRef.current = false;
    setIsLoading(true);

    async function loadCursos() {
      try {
        let query = supabase.from('cursos').select('*');

        const isAdmin = currentUser!.rol === 'admin';

        if (!isAdmin) {
          // Aislamiento genérico (Directiva 4): docente ve sus propios cursos o los de su RBD.
          // La RLS de Supabase (20260822_private_teacher_data.sql) ya garantiza el aislamiento por tenant.
          if (currentUser!.rbd) {
            query = query.or(`profesor_jefe_id.eq.${currentUser!.id},rbd.eq.${currentUser!.rbd}`);
          } else {
            query = query.eq('profesor_jefe_id', currentUser!.id);
          }
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          console.error('[useCursos] Error al consultar cursos en Supabase:', error.message);
          if (isMounted) {
            // Directiva 2: estado vacío legítimo en error. No se inventan cursos.
            setCursos([]);
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

        // Directiva 2: estado vacío legítimo cuando no hay cursos en DB.
        // No se auto-pobla con cursos inventados.
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
      isMigratedRef.current = false; // reset para el próximo mount
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
