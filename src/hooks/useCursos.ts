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

        const email = (currentUser!.email || '').toLowerCase();
        const isPremil = email.includes('premil.cl') || email.includes('mariateresa') || (currentUser!.establecimiento || '').toLowerCase().includes('premilitar');
        const isSusana = email.includes('susana') || email.includes('nentitasusana') || (currentUser!.establecimiento || '').toLowerCase().includes('mi casa');
        const isAdmin = currentUser!.rol === 'admin';

        if (!isAdmin) {
          if (isPremil) {
            query = query.or(`profesor_jefe_id.eq.${currentUser!.id},rbd.eq.31030,establecimiento.ilike.%Premilitar%`);
          } else if (isSusana) {
            query = query.or(`profesor_jefe_id.eq.${currentUser!.id},rbd.eq.1234,establecimiento.ilike.%Mi Casa%`);
          } else if (currentUser!.rbd) {
            query = query.or(`profesor_jefe_id.eq.${currentUser!.id},rbd.eq.${currentUser!.rbd}`);
          } else {
            query = query.eq('profesor_jefe_id', currentUser!.id);
          }
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          console.warn('[useCursos] Error al consultar cursos en Supabase:', error.message);
          if (isMounted) {
            if (isPremil) {
              setCursos([
                { id: 'curso-prem-2m', nombre: '2° Medio A', nivel: '2° Medio', anio: 2026, codigoInvitacion: 'PREM2M26', totalAlumnos: 0, establecimiento: 'Escuela Premilitar Héroes de la Concepción', rbd: '31030', profesorJefeId: currentUser!.id }
              ]);
            } else if (isSusana) {
              setCursos([
                { id: 'curso-mc-4b', nombre: '4° Básico A', nivel: '4° Básico', anio: 2026, codigoInvitacion: 'MC4B2026', totalAlumnos: 0, establecimiento: 'Colegio Mi Casa', rbd: '1234', profesorJefeId: currentUser!.id },
                { id: 'curso-mc-6b', nombre: '6° Básico A', nivel: '6° Básico', anio: 2026, codigoInvitacion: 'MC6B2026', totalAlumnos: 0, establecimiento: 'Colegio Mi Casa', rbd: '1234', profesorJefeId: currentUser!.id },
                { id: 'curso-mc-8b', nombre: '8° Básico A', nivel: '8° Básico', anio: 2026, codigoInvitacion: 'MC8B2026', totalAlumnos: 0, establecimiento: 'Colegio Mi Casa', rbd: '1234', profesorJefeId: currentUser!.id }
              ]);
            } else if (isAdmin) {
              setCursos([
                { id: 'curso-prem-2m', nombre: '2° Medio A', nivel: '2° Medio', anio: 2026, codigoInvitacion: 'PREM2M26', totalAlumnos: 0, establecimiento: 'Escuela Premilitar Héroes de la Concepción', rbd: '31030' },
                { id: 'curso-mc-4b', nombre: '4° Básico A', nivel: '4° Básico', anio: 2026, codigoInvitacion: 'MC4B2026', totalAlumnos: 0, establecimiento: 'Colegio Mi Casa', rbd: '1234' },
                { id: 'curso-mc-6b', nombre: '6° Básico A', nivel: '6° Básico', anio: 2026, codigoInvitacion: 'MC6B2026', totalAlumnos: 0, establecimiento: 'Colegio Mi Casa', rbd: '1234' },
                { id: 'curso-mc-8b', nombre: '8° Básico A', nivel: '8° Básico', anio: 2026, codigoInvitacion: 'MC8B2026', totalAlumnos: 0, establecimiento: 'Colegio Mi Casa', rbd: '1234' }
              ]);
            } else {
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

        // Si la tabla cursos en Supabase no tiene filas para este usuario, auto-poblar
        let initialProdCursos: CursoItem[] = [];

        if (isSusana) {
          initialProdCursos = [
            { id: 'curso-mc-4b', nombre: '4° Básico A', nivel: '4° Básico', anio: 2026, codigoInvitacion: 'MC4B2026', totalAlumnos: 0, establecimiento: 'Colegio Mi Casa', rbd: '1234', profesorJefeId: currentUser!.id },
            { id: 'curso-mc-6b', nombre: '6° Básico A', nivel: '6° Básico', anio: 2026, codigoInvitacion: 'MC6B2026', totalAlumnos: 0, establecimiento: 'Colegio Mi Casa', rbd: '1234', profesorJefeId: currentUser!.id },
            { id: 'curso-mc-8b', nombre: '8° Básico A', nivel: '8° Básico', anio: 2026, codigoInvitacion: 'MC8B2026', totalAlumnos: 0, establecimiento: 'Colegio Mi Casa', rbd: '1234', profesorJefeId: currentUser!.id }
          ];
        } else if (isPremil) {
          initialProdCursos = [
            { id: 'curso-prem-2m', nombre: '2° Medio A', nivel: '2° Medio', anio: 2026, codigoInvitacion: 'PREM2M26', totalAlumnos: 0, establecimiento: 'Escuela Premilitar Héroes de la Concepción', rbd: '31030', profesorJefeId: currentUser!.id }
          ];
        } else if (isAdmin) {
          initialProdCursos = [
            { id: 'curso-prem-2m', nombre: '2° Medio A', nivel: '2° Medio', anio: 2026, codigoInvitacion: 'PREM2M26', totalAlumnos: 0, establecimiento: 'Escuela Premilitar Héroes de la Concepción', rbd: '31030' },
            { id: 'curso-mc-4b', nombre: '4° Básico A', nivel: '4° Básico', anio: 2026, codigoInvitacion: 'MC4B2026', totalAlumnos: 0, establecimiento: 'Colegio Mi Casa', rbd: '1234' },
            { id: 'curso-mc-6b', nombre: '6° Básico A', nivel: '6° Básico', anio: 2026, codigoInvitacion: 'MC6B2026', totalAlumnos: 0, establecimiento: 'Colegio Mi Casa', rbd: '1234' },
            { id: 'curso-mc-8b', nombre: '8° Básico A', nivel: '8° Básico', anio: 2026, codigoInvitacion: 'MC8B2026', totalAlumnos: 0, establecimiento: 'Colegio Mi Casa', rbd: '1234' }
          ];
        }

        if (initialProdCursos.length > 0) {
          if (isMounted) {
            setCursos(initialProdCursos);
            setIsLoading(false);
          }
          try {
            const rows = initialProdCursos.map(c => mapCursoToRow(c, currentUser!.id, c.rbd || currentUser!.rbd));
            await supabase.from('cursos').upsert(rows, { onConflict: 'id' });
          } catch (err) {
            console.error('[useCursos] Error auto-seeding cursos en Supabase:', err);
          }
          return;
        }

        // Fallback final: tabla vacía y sin seed aplicable
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
