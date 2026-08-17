import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, UserRole, UserEstado, UserPlan } from '../types';
import {
  currentUserAdmin,
  currentUserAdminDemo,
  currentUserProfesor,
  currentUserProfesorCiencias,
  currentUserProfesorLenguaje,
  currentUserProfesorPremilitar,
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
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnlineSupabase: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (data: RegisterData) => Promise<RegisterResult>;
  logout: () => void;
  switchRole: (role: UserRole, extra?: 'ciencias' | 'matematica' | 'lenguaje' | 'premilitar') => void;
  approveUser: (userId: string, nuevoPlan?: UserPlan) => Promise<{ error: string | null }>;
  approveUserByToken: (token: string) => Promise<TokenApprovalResult>;
  rejectOrSuspendUser: (userId: string, nuevoEstado: 'suspendido' | 'rechazado') => Promise<{ error: string | null }>;
  changeUserPlan: (userId: string, nuevoPlan: UserPlan) => Promise<{ error: string | null }>;
}

export interface RegisterData {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: UserRole;
  establecimiento: string;
  rbd?: string;
  asignaturaId?: string;
  asignaturaNombre?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Usuarios autorizados oficiales del sistema
const DEMO_USERS: Record<string, UserProfile> = {
  // Super Administrador Oficial
  'leontesvirtual1@gmail.com': currentUserAdmin,
  'luis_leon_g@hotmail.com':   currentUserAdmin,
  // Docente Oficial — María Teresa González (Escuela Premilitar Héroes de la Concepción)
  'luis.leon@premil.cl':       currentUserProfesorPremilitar,
  // Admin Demo para evaluación
  'admin@sysget.cl':           currentUserAdminDemo,
};

/** Contraseñas autorizadas por correo (fallback local cuando Supabase no está disponible) */
const DEMO_USER_PASSWORDS: Record<string, string[]> = {
  'leontesvirtual1@gmail.com': ['Saber_2026!'],
  'luis_leon_g@hotmail.com':   ['Saber_2026!'],
  'luis.leon@premil.cl':       ['Premil_2026!'],
  'admin@sysget.cl':           ['demo1234', '123456', 'admin123'],
};

/**
 * ⛔ SEGURIDAD: Esta función NO debe inferir usuarios por patrones genéricos.
 * Solo retorna null (bloqueo total). El acceso solo se permite a emails
 * explícitamente listados en DEMO_USERS o registrados en la base de datos.
 */
function inferUserFromEmail(_email: string): UserProfile | null {
  // Rechazo absoluto — no hay inferencia por patrones de dominio ni roles
  return null;
}


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [usuarios, setUsuarios] = useState<UserProfile[]>(usuariosRegistradosMock);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnlineSupabase, setIsOnlineSupabase] = useState(false);

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
              const restoredUser: UserProfile = {
                id: profile.id,
                rut: profile.rut || '12.345.678-9',
                nombre: profile.nombre || email.split('@')[0] || 'Usuario',
                apellido: profile.apellido || '',
                email: email,
                rol: (profile.rol as UserRole) || 'profesor',
                establecimiento: profile.establecimiento || APP_CONFIG.nombreEstablecimiento,
                asignaturaId: profile.asignatura_id,
                asignaturaNombre: profile.asignatura_nombre,
                cargo: profile.cargo,
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
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const cleanEmail = email.toLowerCase().trim();

    try {
      // 1. Try real Supabase auth first
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
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

          // Verificar estado de aprobación
          if (estado === 'pendiente_aprobacion') {
            await supabase.auth.signOut();
            return {
              error: 'Tu cuenta está pendiente de activación por el Administrador de Sysget Saber. Te enviaremos un correo electrónico cuando tu acceso de prueba (Trial 30 días) esté activo.'
            };
          }

          if (estado === 'suspendido') {
            await supabase.auth.signOut();
            return {
              error: 'Esta cuenta ha sido suspendida temporalmente. Contacta a soporte@sysget.cl para regularizar tu plan.'
            };
          }

          if (estado === 'rechazado') {
            await supabase.auth.signOut();
            return {
              error: 'Tu solicitud de acceso no fue aprobada por el administrador.'
            };
          }

          const loggedUser: UserProfile = {
            id: profile.id,
            rut: profile.rut || '12.345.678-9',
            nombre: profile.nombre || data.user.email?.split('@')[0] || 'Usuario',
            apellido: profile.apellido || '',
            email: data.user.email || '',
            rol: (profile.rol as UserRole) || 'profesor',
            establecimiento: profile.establecimiento || APP_CONFIG.nombreEstablecimiento,
            asignaturaId: profile.asignatura_id,
            asignaturaNombre: profile.asignatura_nombre,
            cargo: profile.cargo,
            estado: estado,
            plan: (profile.plan as UserPlan) || 'trial',
            diasRestantesTrial: 30
          };
          setUser(loggedUser);
          // ✅ Guardar email en localStorage para persistencia en refresh
          localStorage.setItem('sysget_session_email', cleanEmail);
          return { error: null };
        } else {
          // Supabase autenticado pero sin perfil en tabla perfiles
          // (ocurre con el Super Admin creado directamente en Supabase dashboard)
          const demoFallback = DEMO_USERS[cleanEmail];
          if (demoFallback) {
            setUser({ ...demoFallback, id: data.user.id, email: cleanEmail });
            localStorage.setItem('sysget_session_email', cleanEmail);
            return { error: null };
          }
        }
      }
    } catch (err) {
      console.warn('Supabase login failed, using local mock auth');
    }

    // 2. Revisar lista de usuarios registrados dinámicamente (requiere validación de contraseña)
    const foundMock = usuarios.find(u => u.email.toLowerCase() === cleanEmail);
    if (foundMock) {
      if (foundMock.estado === 'pendiente_aprobacion') {
        return {
          error: 'Tu cuenta está pendiente de activación por el Administrador de Sysget Saber. Te enviaremos un correo electrónico cuando tu acceso de prueba (Trial 30 días) esté activo.'
        };
      }
      if (foundMock.estado === 'suspendido') {
        return {
          error: 'Esta cuenta ha sido suspendida temporalmente. Contacta a soporte@sysget.cl para regularizar tu plan.'
        };
      }
      if (foundMock.estado === 'rechazado') {
        return {
          error: 'Tu solicitud de acceso no fue aprobada.'
        };
      }
      // ⛔ SEGURIDAD: Validar contraseña si el email tiene una contraseña registrada
      const allowedForMock = DEMO_USER_PASSWORDS[cleanEmail];
      let customPassForMock: string | null = null;
      try {
        const cp = JSON.parse(localStorage.getItem('sysget_custom_passwords') || '{}');
        if (cp[cleanEmail]) customPassForMock = cp[cleanEmail];
      } catch (e) {}

      if (allowedForMock || customPassForMock) {
        const cleanPass = password.trim();
        const validPasswords = customPassForMock
          ? [customPassForMock, ...(allowedForMock || [])]
          : (allowedForMock || []);
        if (!validPasswords.includes(cleanPass)) {
          return { error: 'Contraseña incorrecta. Por favor verifica tus credenciales.' };
        }
      } else {
        // Si no hay contraseña registrada, rechazar por seguridad
        return { error: 'Esta cuenta no tiene credenciales configuradas. Contacta al administrador.' };
      }

      setUser(foundMock);
      localStorage.setItem('sysget_session_email', cleanEmail);
      return { error: null };
    }

    // 3. Login con cuentas autorizadas y soporte de contraseñas personalizadas
    // Leer contraseñas personalizadas asignadas por el Administrador
    let customPasswordForUser: string | null = null;
    try {
      const customPasswords = JSON.parse(localStorage.getItem('sysget_custom_passwords') || '{}');
      if (customPasswords[cleanEmail]) {
        customPasswordForUser = customPasswords[cleanEmail];
      }
    } catch (e) {}

    // Buscar si es un docente creado dinámicamente por el Administrador en ProfesoresPage
    let dynamicProfesor: UserProfile | null = null;
    try {
      const localProfesores = JSON.parse(localStorage.getItem('sysget_profesores_list') || '[]');
      if (Array.isArray(localProfesores)) {
        dynamicProfesor = localProfesores.find((p: UserProfile) => p.email.toLowerCase().trim() === cleanEmail) || null;
      }
    } catch (e) {}

    const targetUser = dynamicProfesor || DEMO_USERS[cleanEmail];

    if (targetUser) {
      const cleanPass = password.trim();
      const defaultAllowed = DEMO_USER_PASSWORDS[cleanEmail] || ['123456', 'demo1234'];
      const allowedPasswords = customPasswordForUser ? [customPasswordForUser, ...defaultAllowed] : defaultAllowed;

      if (!allowedPasswords.includes(cleanPass)) {
        return {
          error: 'Contraseña incorrecta para este usuario. Por favor verifica tus credenciales.'
        };
      }

      setUser(targetUser);
      localStorage.setItem('sysget_session_email', cleanEmail);
      return { error: null };
    }

    // 4. Inferir por pistas (retorna null por seguridad)
    const inferredUser = inferUserFromEmail(cleanEmail);
    if (inferredUser) {
      setUser({ ...inferredUser, email: cleanEmail });
      localStorage.setItem('sysget_session_email', cleanEmail);
      return { error: null };
    }

    // 5. Credenciales no reconocidas → retornar error
    return { error: 'Credenciales no reconocidas. Verifica tu correo y contraseña o solicita tu cuenta de prueba.' };
  }, [usuarios]);

  /** Llama a la Edge Function que notifica al admin por Resend */
  const notifyAdminNewRegistration = async (userData: RegisterData, token: string) => {
    const payload = {
      nombre: userData.nombre,
      apellido: userData.apellido,
      email: userData.email,
      rut: userData.rut,
      rol: userData.rol,
      establecimiento: userData.establecimiento,
      rbd: userData.rbd,
      asignaturaNombre: userData.asignaturaNombre,
      approvalToken: token,
    };

    try {
      // 1. Intentar endpoint directo en Vercel (/api/notify-admin)
      const res = await fetch('/api/notify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) return;
    } catch (e) {
      console.warn('Vercel API notify-admin offline, probando Supabase Edge Function...');
    }

    try {
      // 2. Fallback a Supabase Edge Function
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
      await fetch(`${SUPABASE_URL}/functions/v1/notify-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.warn('No se pudo notificar al admin por email:', e);
    }
  };

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        if (data.users && Array.isArray(data.users)) {
          setUsuarios(prev => {
            const apiEmails = new Set(data.users.map((u: UserProfile) => u.email.toLowerCase()));
            return [
              ...data.users,
              ...prev.filter(u => !apiEmails.has(u.email.toLowerCase()))
            ];
          });
        }
      }
    } catch (e) {
      console.warn('Error fetching /api/users:', e);
    }
  }, []);

  useEffect(() => {
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
      await fetch('/api/users?action=approve-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan: nuevoPlan })
      });
      await fetchUsers();
    } catch (e) {
      console.warn('Error syncing approval:', e);
    }

    setUsuarios(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          estado: 'activo',
          plan: nuevoPlan,
          diasRestantesTrial: 30
        };
      }
      return u;
    }));

    return { error: null };
  }, [fetchUsers]);

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
      await fetch('/api/users?action=suspend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, estado: nuevoEstado })
      });
      await fetchUsers();
    } catch (e) {
      console.warn('Error updating status in Supabase:', e);
    }

    setUsuarios(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, estado: nuevoEstado };
      }
      return u;
    }));

    return { error: null };
  }, [fetchUsers]);

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

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('sysget_session_email');
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole, extra?: 'ciencias' | 'matematica' | 'lenguaje' | 'premilitar') => {
    if (role === 'admin') {
      setUser(currentUserAdminDemo);
    } else if (role === 'profesor') {
      if (extra === 'premilitar') {
        setUser(currentUserProfesorPremilitar);
      } else if (extra === 'lenguaje') {
        setUser(currentUserProfesorLenguaje);
      } else if (extra === 'ciencias') {
        setUser(currentUserProfesorCiencias);
      } else {
        setUser(currentUserProfesor);
      }
    } else {
      setUser(currentUserAlumno);
    }
  }, []);


  return (
    <AuthContext.Provider value={{
      user,
      usuarios,
      isAuthenticated: !!user,
      isLoading,
      isOnlineSupabase,
      login,
      register,
      logout,
      switchRole,
      approveUser,
      approveUserByToken,
      rejectOrSuspendUser,
      changeUserPlan
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

