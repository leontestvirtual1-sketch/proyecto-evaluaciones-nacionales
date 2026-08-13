import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, UserRole } from '../types';
import {
  currentUserAdmin,
  currentUserProfesor,
  currentUserProfesorLenguaje,
  currentUserAlumno
} from '../data/mockData';
import { supabase } from '../lib/supabaseClient';
import { APP_CONFIG } from '../config/appConfig';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnlineSupabase: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (data: RegisterData) => Promise<{ error: string | null }>;
  logout: () => void;
  switchRole: (role: UserRole, extra?: 'matematica' | 'lenguaje') => void;
}

export interface RegisterData {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: UserRole;
  establecimiento: string;
  asignaturaId?: string;
  asignaturaNombre?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo fallback users for testing
const DEMO_USERS: Record<string, UserProfile> = {
  'admin@sysget.cl': currentUserAdmin,
  'maria@demo.cl': currentUserProfesor,
  'carlos@demo.cl': currentUserProfesorLenguaje,
  'pedro@demo.cl': currentUserAlumno,
};


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnlineSupabase, setIsOnlineSupabase] = useState(false);

  // Check initial Supabase Session
  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session?.user && !error) {
          setIsOnlineSupabase(true);
          // Fetch profile from perfiles table
          const { data: profile } = await supabase
            .from('perfiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              rut: profile.rut || '12.345.678-9',
              nombre: profile.nombre || session.user.email?.split('@')[0] || 'Usuario',
              apellido: profile.apellido || '',
              email: session.user.email || '',
              rol: (profile.rol as UserRole) || 'profesor',
              establecimiento: profile.establecimiento || APP_CONFIG.nombreEstablecimiento
            });
          }
        }
      } catch (err) {
        console.warn('Supabase local session check offline, using mock auth fallback.');
      } finally {
        setIsLoading(false);
      }
    }

    checkSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // 1. Try real Supabase auth first
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (!error && data.user) {
        setIsOnlineSupabase(true);
        const { data: profile } = await supabase
          .from('perfiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        setUser({
          id: data.user.id,
          rut: profile?.rut || '12.345.678-9',
          nombre: profile?.nombre || email.split('@')[0],
          apellido: profile?.apellido || '',
          email: data.user.email || email,
          rol: (profile?.rol as UserRole) || 'profesor',
          establecimiento: profile?.establecimiento || 'Escuela Bicentenario Demo'
        });
        setIsLoading(false);
        return { error: null };
      }
    } catch (err) {
      // Ignore network errors and fallback to demo accounts
    }

    // 2. Demo Fallback for local testing
    await new Promise(res => setTimeout(res, 500));
    const found = DEMO_USERS[email.toLowerCase()];
    if (found) {
      setUser(found);
      setIsLoading(false);
      return { error: null };
    }

    setIsLoading(false);
    return { error: 'Credenciales no encontradas. Usa maria@demo.cl (Profesor) o pedro@demo.cl (Alumno).' };
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);

    try {
      // 1. Try Supabase registration
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            rut: data.rut,
            nombre: data.nombre,
            apellido: data.apellido,
            rol: data.rol,
            establecimiento: data.establecimiento
          }
        }
      });

      if (!authError && authData.user) {
        setIsOnlineSupabase(true);
        // Insert into perfiles table
        await supabase.from('perfiles').insert({
          id: authData.user.id,
          rut: data.rut,
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          rol: data.rol,
          establecimiento: data.establecimiento
        });

        const newUser: UserProfile = {
          id: authData.user.id,
          rut: data.rut,
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          rol: data.rol,
          establecimiento: data.establecimiento
        };
        setUser(newUser);
        setIsLoading(false);
        return { error: null };
      }
    } catch (err) {
      // Fallback local creation
    }

    // Fallback demo user creation
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      rut: data.rut,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      rol: data.rol,
      establecimiento: data.establecimiento,
    };

    setUser(newUser);
    setIsLoading(false);
    return { error: null };
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole, extra?: 'matematica' | 'lenguaje') => {
    if (role === 'admin') {
      setUser(currentUserAdmin);
    } else if (role === 'profesor') {
      if (extra === 'lenguaje') {
        setUser(currentUserProfesorLenguaje);
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
      isAuthenticated: !!user,
      isLoading,
      isOnlineSupabase,
      login,
      register,
      logout,
      switchRole,
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
