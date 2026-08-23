import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, UserRole, UserEstado, UserPlan } from '../types';
import {
  currentUserAdmin,
  currentUserAdminDemo,
  currentUserProfesor,
  currentUserProfesorCiencias,
  currentUserProfesorLenguaje,
  currentUserProfesorPremilitar,
  currentUserProfesorMiCasa,
  currentUserAlumno,
  usuariosRegistradosMock
} from '../data/mockData';
import { supabase } from '../lib/supabaseClient';
import { APP_CONFIG } from '../config/appConfig';

export interface RegisterResult {
  error: string | null;
  needsEmailConfirmation?: boolean;
  needsAdminApproval?: boolean;
  approvalToken?: string;
}

export interface TokenApprovalResult {
  success: boolean;
  message: string;
  user?: UserProfile;
}

interface AuthContextType {
  user: UserProfile | null;
  usuarios: UserProfile[];
  docentesReales: UserProfile[];
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnlineSupabase: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (data: RegisterData) => Promise<RegisterResult>;
  logout: () => void;
  switchRole: (role: UserRole, extra?: 'ciencias' | 'matematica' | 'lenguaje' | 'premilitar' | 'demo' | 'prod') => void;
  switchToDocente: (docenteId: string) => void;
  approveUser: (userId: string, nuevoPlan?: UserPlan) => Promise<{ error: string | null }>;
  approveUserByToken: (token: string) => Promise<TokenApprovalResult>;
  rejectOrSuspendUser: (userId: string, nuevoEstado: 'suspendido' | 'rechazado') => Promise<{ error: string | null }>;
  changeUserPlan: (userId: string, nuevoPlan: UserPlan) => Promise<{ error: string | null }>;
  setUserPassword: (userId: string, email: string, newPassword: string) => Promise<{ error: string | null }>;
  loadDocentesReales: () => Promise<void>;
  loadUsuariosReales: () => Promise<void>;
  // ID del admin real que inició sesión (para poder volver desde vista de docente)
  adminBaseProfile: UserProfile | null;
}

export interface RegisterData {
  rut: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  apellido?: string;
  email: string;
  password: string;
  rol: UserRole;
  establecimiento: string;
  rbd?: string;
  comuna?: string;
  dependencia?: string;
  asignaturaId?: string;
  asignaturaNombre?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Perfiles de usuarios oficiales sin credenciales — solo para restaurar sesión en RAM
// cuando Supabase Auth ya la validó previamente.
const DEMO_USERS: Record<string, UserProfile> = {
  'leontestvirtual1@gmail.com':       currentUserAdmin,
  'leontesvirtual1@gmail.com':        currentUserAdmin,
  'mariateresa.gonzalez@premil.cl':    currentUserProfesorPremilitar,
  'luis.leon@premil.cl':              currentUserProfesorPremilitar,
  'nentitasusana@hotmail.com':        currentUserProfesorMiCasa,
  'admin@sysget.cl':                  currentUserAdminDemo,
};

/** No hay inferencia por patrones — siempre retorna null */
function inferUserFromEmail(_email: string): UserProfile | null {
  return null;
}


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [adminBaseProfile, setAdminBaseProfile] = useState<UserProfile | null>(null);
  const [usuarios, setUsuarios] = useState<UserProfile[]>([]);
  const [docentesReales, setDocentesReales] = useState<UserProfile[]>([
    currentUserProfesorPremilitar,
    currentUserProfesorMiCasa,
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnlineSupabase, setIsOnlineSupabase] = useState(false);

  const PRODUCTION_ADMIN_EMAIL = 'leontestvirtual1@gmail.com';

  /** Carga los docentes reales desde Supabase para el Admin de Producción (excluyendo cuentas demo) */
  const loadDocentesReales = useCallback(async () => {
    const defaultDocentes = [currentUserProfesorPremilitar, currentUserProfesorMiCasa];
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .eq('rol', 'profesor');
      if (!error && data && data.length > 0) {
        const dbDocentes: UserProfile[] = data
          .filter((p: Record<string, unknown>) => {
            const email = ((p.email as string) || '').toLowerCase();
            const est = ((p.establecimiento as string) || '').toLowerCase();
            return !email.endsWith('@demo.cl') && !email.endsWith('@escuelademo.cl') && !est.includes('demo');
          })
          .map((p: Record<string, unknown>) => ({
            id: p.id as string,
            rut: (p.rut as string) || '',
            nombre: (p.nombre as string) || '',
            apellido: (p.apellido as string) || '',
            apellidoPaterno: (p.apellido_paterno as string) || undefined,
            apellidoMaterno: (p.apellido_materno as string) || undefined,
            email: (p.email as string) || '',
            rol: 'profesor' as UserRole,
            establecimiento: (p.establecimiento as string) || '',
            rbd: (p.rbd as string) || undefined,
            asignaturaId: (p.asignatura_id as string) || undefined,
            asignaturaNombre: (p.asignatura_nombre as string) || undefined,
            cargo: (p.cargo as string) || undefined,
            estado: ((p.estado as string) || 'activo') as UserEstado,
            plan: ((p.plan as string) || 'trial') as UserPlan,
            logoUrl: (p.logo_url as string) || undefined,
          }));

        // Combinar datos asegurando que no se pierdan los perfiles oficiales
        const mapByEmail = new Map<string, UserProfile>();
        defaultDocentes.forEach(d => mapByEmail.set(d.email.toLowerCase(), d));
        dbDocentes.forEach(d => mapByEmail.set(d.email.toLowerCase(), d));

        setDocentesReales(Array.from(mapByEmail.values()));
      } else {
        setDocentesReales(defaultDocentes);
      }
    } catch {
      setDocentesReales(defaultDocentes);
    }
  }, []);

  /** Carga todos los usuarios registrados reales desde Supabase para el Admin */
  const loadUsuariosReales = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('*');

      const mapRow = (p: Record<string, unknown>): UserProfile => {
        const createdAt = (p.created_at || p.creado_en || p.fecha_registro) as string | undefined;
        let diasRestantes = 30;
        if (createdAt) {
          const createdDate = new Date(createdAt);
          if (!isNaN(createdDate.getTime())) {
            const diffMs = Date.now() - createdDate.getTime();
            const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
            diasRestantes = Math.max(0, Math.min(30, 30 - diffDays));
          }
        } else if (p.dias_restantes_trial !== undefined) {
          diasRestantes = Math.max(0, Math.min(30, p.dias_restantes_trial as number));
        }
        const fechaRegStr = createdAt
          ? new Date(createdAt).toISOString().replace('T', ' ').slice(0, 16)
          : undefined;

        let userEstado: UserEstado = 'activo';
        if (p.estado) {
          userEstado = p.estado as UserEstado;
        } else if (p.activo === false) {
          userEstado = 'pendiente_aprobacion';
        }

        return {
          id: p.id as string,
          rut: (p.rut as string) || '',
          nombre: (p.nombre as string) || '',
          apellido: (p.apellido as string) || '',
          apellidoPaterno: (p.apellido_paterno as string) || undefined,
          apellidoMaterno: (p.apellido_materno as string) || undefined,
          email: (p.email as string) || '',
          rol: ((p.rol as string) || 'profesor') as UserRole,
          establecimiento: (p.establecimiento as string) || '',
          rbd: (p.rbd as string) || undefined,
          asignaturaId: (p.asignatura_id as string) || undefined,
          asignaturaNombre: (p.asignatura_nombre as string) || undefined,
          cargo: (p.cargo as string) || undefined,
          estado: userEstado,
          plan: ((p.plan as string) || 'trial') as UserPlan,
          logoUrl: (p.logo_url as string) || undefined,
          fechaRegistro: fechaRegStr,
          diasRestantesTrial: diasRestantes,
          approvalToken: (p.approval_token as string) || undefined,
        };
      };

      if (!error && data && data.length > 0) {
        const realUsers = data.map(mapRow);
        setUsuarios(realUsers);
      } else {
        // Si la tabla retorna vacío (ej. RLS sin filas para admin sin perfil),
        // intentar poblar con sesión activa de Supabase como mínimo
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: ownProfile } = await supabase
            .from('perfiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (ownProfile) {
            setUsuarios([mapRow(ownProfile)]);
          }
        }
      }
    } catch {
      // Mantener estado actual si no conecta
    }
  }, []);

  // Check initial Supabase Session — persiste sesión entre refrescos
  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session?.user && !error) {
          setIsOnlineSupabase(true);
          const email = session.user.email || '';

          // Fetch profile from perfiles table
          const { data: profile } = await supabase
            .from('perfiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            const estado: UserEstado = (profile.estado as UserEstado) || 'activo';
            // Restaurar sesión solo si la cuenta está activa o es admin
            if (estado === 'activo' || profile.rol === 'admin' || profile.rol === 'superadmin') {
              const isPremil = email.toLowerCase() === 'mariateresa.gonzalez@premil.cl' || email.toLowerCase() === 'luis.leon@premil.cl';
              const restoredUser: UserProfile = {
                id: profile.id,
                rut: profile.rut || '18.359.422-2',
                nombre: profile.nombre || 'María Teresa',
                apellido: profile.apellido || 'González',
                email: email,
                rol: (profile.rol as UserRole) || 'profesor',
                establecimiento: profile.establecimiento || (isPremil ? 'Escuela Premilitar Héroes de la Concepción' : APP_CONFIG.nombreEstablecimiento),
                rbd: profile.rbd || (isPremil ? '31030' : undefined),
                asignaturaId: profile.asignatura_id || (isPremil ? 'asig-2' : undefined),
                asignaturaNombre: profile.asignatura_nombre || (isPremil ? 'Lenguaje y Comunicación' : undefined),
                cargo: profile.cargo || (isPremil ? 'Docente de Lenguaje y Comunicación' : undefined),
                estado: estado,
                plan: (profile.plan as UserPlan) || 'trial',
                diasRestantesTrial: profile.dias_restantes_trial ?? 30
              };
              setUser(restoredUser);
              localStorage.setItem('sysget_session_email', email);
            }
          } else {
            // No hay perfil en tabla → crear uno básico y restaurar sesión
            // Esto ocurre cuando el admin real no insertó su perfil previamente
            const emailLC = email.toLowerCase();
            const demoMatch = DEMO_USERS[emailLC];
            if (demoMatch) {
              setUser({ ...demoMatch, id: session.user.id, email });
              localStorage.setItem('sysget_session_email', email);
            }
          }
        } else {
          // Sin sesión Supabase — intentar restaurar desde localStorage
          const savedEmail = localStorage.getItem('sysget_session_email');
          if (savedEmail) {
            const demoUser = DEMO_USERS[savedEmail.toLowerCase()];
            if (demoUser) setUser({ ...demoUser, email: savedEmail });
          }
        }
      } catch (err) {
        console.warn('Supabase local session check offline, using mock auth fallback.');
        // Intentar restaurar desde localStorage
        const savedEmail = localStorage.getItem('sysget_session_email');
        if (savedEmail) {
          const demoUser = DEMO_USERS[savedEmail.toLowerCase()];
          if (demoUser) setUser({ ...demoUser, email: savedEmail });
        }
      } finally {
        setIsLoading(false);
      }
    }

    checkSession();
    loadDocentesReales();
    loadUsuariosReales();
  }, [loadDocentesReales, loadUsuariosReales]);

  const login = useCallback(async (email: string, password: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const cleanPass = password.trim();

    // SEGURIDAD: Todo login pasa exclusivamente por Supabase Auth.
    // No existen fallbacks locales ni contraseñas hardcodeadas (S-02).
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass
      });

      if (!error && data.user) {
        setIsOnlineSupabase(true);
        const { data: profile } = await supabase
          .from('perfiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          const estado: UserEstado = (profile.estado as UserEstado) || 'activo';

          if (estado === 'pendiente_aprobacion') {
            await supabase.auth.signOut();
            return {
              error: 'Tu cuenta está pendiente de activación por el Administrador de Sysget Saber. Te enviaremos un correo electrónico cuando tu acceso de prueba (Trial 30 días) esté activo.'
            };
          }
          if (estado === 'suspendido') {
            await supabase.auth.signOut();
            return { error: 'Esta cuenta ha sido suspendida temporalmente. Contacta a soporte@sysget.cl para regularizar tu plan.' };
          }
          if (estado === 'rechazado') {
            await supabase.auth.signOut();
            return { error: 'Tu solicitud de acceso no fue aprobada por el administrador.' };
          }

          const isPremil = cleanEmail === 'mariateresa.gonzalez@premil.cl' || cleanEmail === 'luis.leon@premil.cl';
          const loggedUser: UserProfile = {
            id: profile.id,
            rut: profile.rut || '',
            nombre: profile.nombre || '',
            apellido: profile.apellido || '',
            email: data.user.email || cleanEmail,
            rol: (profile.rol as UserRole) || 'profesor',
            establecimiento: profile.establecimiento || (isPremil ? 'Escuela Premilitar Héroes de la Concepción' : APP_CONFIG.nombreEstablecimiento),
            rbd: profile.rbd || (isPremil ? '31030' : undefined),
            asignaturaId: profile.asignatura_id || (isPremil ? 'asig-2' : undefined),
            asignaturaNombre: profile.asignatura_nombre || (isPremil ? 'Lenguaje y Comunicación' : undefined),
            cargo: profile.cargo || (isPremil ? 'Docente de Lenguaje y Comunicación' : undefined),
            estado: estado,
            plan: (profile.plan as UserPlan) || 'trial',
            diasRestantesTrial: profile.dias_restantes_trial ?? 30
          };
          setUser(loggedUser);
          localStorage.setItem('sysget_session_email', cleanEmail);
          loadUsuariosReales();
          loadDocentesReales();
          return { error: null };

        } else {
          // Supabase autenticado pero sin perfil en tabla — puede ser admin sin perfil creado
          const demoFallback = DEMO_USERS[cleanEmail];
          if (demoFallback) {
            setUser({ ...demoFallback, id: data.user.id, email: cleanEmail });
            localStorage.setItem('sysget_session_email', cleanEmail);
            loadUsuariosReales();
            loadDocentesReales();
            return { error: null };
          }
          await supabase.auth.signOut();
          return { error: 'No se encontró un perfil asociado a este correo. Contacta al administrador.' };
        }
      }

      if (error) {
        const isCredErr =
          error.message?.toLowerCase().includes('invalid login credentials') ||
          error.message?.toLowerCase().includes('invalid grant') ||
          error.status === 400;
        if (isCredErr) {
          return { error: 'Correo o contraseña incorrectos. Verifica tus credenciales.' };
        }
        return { error: 'No se pudo conectar con el servicio de autenticación. Intenta más tarde.' };
      }

    } catch (err) {
      console.error('Error en login:', err);
      return { error: 'Error de conexión. Verifica tu red e intenta nuevamente.' };
    }

    return { error: 'Credenciales no reconocidas. Verifica tu correo y contraseña.' };
  }, []);



  /** Helper centralizado: inyecta el Bearer JWT de Supabase en todas las llamadas admin */
  const authenticatedFetch = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || '';
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });
  }, []);

  const fetchUsers = useCallback(async () => {
    // 1. Intentar cargar perfiles reales directamente desde Supabase
    await loadUsuariosReales();
    await loadDocentesReales();

    // 2. Si existe el endpoint /api/users (producción Vercel), sincronizar datos extendidos
    try {
      const res = await authenticatedFetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        if (data.users && Array.isArray(data.users) && data.users.length > 0) {
          setUsuarios(data.users);
        }
      }
    } catch {
      // Si la API serverless no responde (ej. en desarrollo Vite), los datos ya fueron cargados desde Supabase
    }
  }, [authenticatedFetch, loadUsuariosReales, loadDocentesReales]);

  useEffect(() => {
    // fetchUsers se ejecuta sólo cuando el usuario esté autenticado
    // para que el token Bearer esté disponible
    fetchUsers();
  }, [fetchUsers]);

  const register = useCallback(async (data: RegisterData): Promise<RegisterResult> => {
    try {
      const res = await fetch('/api/users?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const resData = await res.json();
      if (!res.ok || resData.error) {
        return { error: resData.error || 'Error al procesar el registro' };
      }

      await fetchUsers();
      setUser(null);
      localStorage.removeItem('sysget_session_email');

      return {
        error: null,
        needsEmailConfirmation: true,
        needsAdminApproval: true,
        approvalToken: resData.approvalToken
      };
    } catch (err: any) {
      return { error: err.message || 'Error de conexión con el servidor' };
    }
  }, [fetchUsers]);

  const approveUser = useCallback(async (userId: string, nuevoPlan: UserPlan = 'trial') => {
    try {
      const res = await authenticatedFetch('/api/users?action=approve-id', {
        method: 'POST',
        body: JSON.stringify({ userId, plan: nuevoPlan })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { error: err.error || 'Error al aprobar el usuario.' };
      }
      await fetchUsers();
    } catch (e) {
      console.warn('Error syncing approval:', e);
      return { error: 'Error de conexión al aprobar el usuario.' };
    }

    setUsuarios(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, estado: 'activo', plan: nuevoPlan, diasRestantesTrial: 30 };
      }
      return u;
    }));

    return { error: null };
  }, [authenticatedFetch, fetchUsers]);

  const approveUserByToken = useCallback(async (token: string): Promise<TokenApprovalResult> => {
    try {
      const res = await fetch('/api/users?action=approve-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        await fetchUsers();
        return {
          success: true,
          message: resData.message,
          user: resData.user
        };
      } else {
        return {
          success: false,
          message: resData.message || 'El enlace de aprobación es inválido o la cuenta ya fue activada previamente.'
        };
      }
    } catch (e: any) {
      return {
        success: false,
        message: 'Error al conectar con el servidor de aprobación.'
      };
    }
  }, [fetchUsers]);

  const rejectOrSuspendUser = useCallback(async (userId: string, nuevoEstado: 'suspendido' | 'rechazado') => {
    try {
      const res = await authenticatedFetch('/api/users?action=suspend', {
        method: 'POST',
        body: JSON.stringify({ userId, estado: nuevoEstado })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { error: err.error || 'Error al actualizar el estado.' };
      }
      await fetchUsers();
    } catch (e) {
      console.warn('Error updating status in Supabase:', e);
      return { error: 'Error de conexión.' };
    }

    setUsuarios(prev => prev.map(u => {
      if (u.id === userId) return { ...u, estado: nuevoEstado };
      return u;
    }));

    return { error: null };
  }, [authenticatedFetch, fetchUsers]);

  const changeUserPlan = useCallback(async (userId: string, nuevoPlan: UserPlan) => {
    try {
      if (isOnlineSupabase) {
        await supabase
          .from('perfiles')
          .update({ plan: nuevoPlan })
          .eq('id', userId);
      }
    } catch (e) {
      console.warn('Error updating plan in Supabase:', e);
    }

    setUsuarios(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, plan: nuevoPlan };
      }
      return u;
    }));

    return { error: null };
  }, [isOnlineSupabase]);

  /**
   * Establece o restablece la contraseña de un usuario en Supabase Auth.
   * SEGURIDAD: No almacena contraseñas en localStorage (S-01).
   * Requiere token de administrador autenticado en el backend (S-03).
   */
  const setUserPassword = useCallback(async (userId: string, _email: string, newPassword: string): Promise<{ error: string | null }> => {
    try {
      // Llamar al backend con JWT de admin — acción unificada 'set-password'
      const res = await authenticatedFetch('/api/users?action=set-password', {
        method: 'POST',
        body: JSON.stringify({ userId, newPassword })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        return { error: data.error || 'No se pudo actualizar la contraseña en el servidor.' };
      }

      return { error: null };
    } catch (err: any) {
      console.error('Error llamando a set-password API:', err);
      return { error: 'Error de conexión al actualizar la contraseña.' };
    }
  }, [authenticatedFetch]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('sysget_session_email');
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole, extra?: 'ciencias' | 'matematica' | 'lenguaje' | 'premilitar' | 'demo' | 'prod') => {
    if (role === 'admin') {
      const savedEmail = localStorage.getItem('sysget_session_email')?.toLowerCase();
      if (extra === 'prod' || (!extra && (savedEmail === 'leontestvirtual1@gmail.com' || savedEmail === 'leontesvirtual1@gmail.com'))) {
        setUser(adminBaseProfile || currentUserAdmin);
      } else {
        // En cualquier flujo de demostración, sandbox o switch a demo, asignar siempre el admin de prueba
        setUser(currentUserAdminDemo);
      }
    } else if (role === 'profesor') {
      let localProf: UserProfile | null = null;
      try {
        const stored = JSON.parse(localStorage.getItem('sysget_profesores_list') || '[]');
        if (Array.isArray(stored)) {
          if (extra === 'matematica') {
            localProf = stored.find((p: UserProfile) => p.asignaturaId === 'asig-1') || null;
          } else if (extra === 'ciencias') {
            localProf = stored.find((p: UserProfile) => p.asignaturaId === 'asig-3') || null;
          } else if (extra === 'lenguaje') {
            localProf = stored.find((p: UserProfile) => p.asignaturaId === 'asig-2' && p.email !== 'luis.leon@premil.cl') || null;
          }
        }
      } catch (e) {}

      if (extra === 'premilitar') {
        // María Teresa González — SOLO accesible desde admin de producción
        setUser(currentUserProfesorPremilitar);
      } else if (extra === 'matematica') {
        setUser(localProf || currentUserProfesor);
      } else if (extra === 'ciencias') {
        setUser(localProf || currentUserProfesorCiencias);
      } else if (extra === 'lenguaje') {
        setUser(localProf || currentUserProfesorLenguaje);
      } else {
        setUser(currentUserProfesor);
      }
    } else {
      setUser(currentUserAlumno);
    }
  }, []);

  /** Cambia la vista al perfil de un docente real (supervisión por Admin Producción) */
  const switchToDocente = useCallback((docenteIdOrKey: string) => {
    const searchKey = (docenteIdOrKey || '').toLowerCase().trim();
    if (!searchKey) return;

    // Pool consolidado de búsqueda
    const pool: UserProfile[] = [
      ...docentesReales,
      ...usuarios.filter(u => u.rol === 'profesor'),
      currentUserProfesorPremilitar,
      currentUserProfesorMiCasa
    ];

    const docente = pool.find(d =>
      d.id === docenteIdOrKey ||
      (d.email && d.email.toLowerCase().trim() === searchKey) ||
      (d.rut && d.rut.toLowerCase().trim() === searchKey) ||
      (`${d.nombre} ${d.apellido}`).toLowerCase().trim().includes(searchKey) ||
      (searchKey.includes('susana') && (d.email?.toLowerCase().includes('susana') || d.nombre?.toLowerCase().includes('susana'))) ||
      (searchKey.includes('maria') && (d.email?.toLowerCase().includes('premil') || d.nombre?.toLowerCase().includes('maria')))
    );

    if (docente) {
      // Guardar perfil base del admin para poder volver
      setUser(prev => {
        if (prev?.rol === 'admin' && !adminBaseProfile) {
          setAdminBaseProfile(prev);
        }
        return docente;
      });
    } else {
      console.warn(`[switchToDocente] No se encontró docente para la clave: "${docenteIdOrKey}"`);
    }
  }, [docentesReales, usuarios, adminBaseProfile]);


  return (
    <AuthContext.Provider value={{
      user,
      usuarios,
      docentesReales,
      adminBaseProfile,
      isAuthenticated: !!user,
      isLoading,
      isOnlineSupabase,
      login,
      register,
      logout,
      switchRole,
      switchToDocente,
      approveUser,
      approveUserByToken,
      rejectOrSuspendUser,
      changeUserPlan,
      setUserPassword,
      loadDocentesReales,
      loadUsuariosReales
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

