import React, { useState } from 'react';
import { useAuth, RegisterData } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, User, Building2, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';
import { UserRole } from '../types';

interface RegisterPageProps {
  onGoToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onGoToLogin }) => {
  const { register, isLoading } = useAuth();
  const [form, setForm] = useState<RegisterData>({
    rut: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'profesor',
    establecimiento: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleChange = (field: keyof RegisterData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.rut || !form.nombre || !form.apellido || !form.email || !form.password || !form.establecimiento) {
      setError('Completa todos los campos obligatorios.');
      return;
    }
    if (form.password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const { error: regError } = await register(form);
    if (regError) setError(regError);
  };

  const roles: { value: UserRole; label: string; desc: string }[] = [
    { value: 'profesor', label: 'Profesor / Docente', desc: 'Crea y gestiona evaluaciones' },
    { value: 'alumno', label: 'Estudiante', desc: 'Rinde evaluaciones asignadas' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg space-y-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3.5 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/30">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Sysget<span className="text-indigo-400">Saber</span>
          </h1>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white">Crear Cuenta</h2>
            <p className="text-xs text-slate-400 mt-0.5">Acceso a la Plataforma de Evaluaciones</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rol */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Tipo de Cuenta
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => handleChange('rol', r.value)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      form.rol === r.value
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                        : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-indigo-500/50'
                    }`}
                  >
                    <div className="text-xs font-bold">{r.label}</div>
                    <div className={`text-[11px] mt-0.5 ${form.rol === r.value ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {r.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Nombre + Apellido */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Nombre</label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={e => handleChange('nombre', e.target.value)}
                    placeholder="María"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                  />
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Apellido</label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.apellido}
                    onChange={e => handleChange('apellido', e.target.value)}
                    placeholder="González"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                  />
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            {/* RUT */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">RUT</label>
              <div className="relative">
                <input
                  type="text"
                  value={form.rut}
                  onChange={e => handleChange('rut', e.target.value)}
                  placeholder="12.345.678-9"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                />
                <CreditCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Correo Electrónico</label>
              <div className="relative">
                <input
                  type="email"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="nombre@colegio.cl"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Establecimiento */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Establecimiento Educacional</label>
              <div className="relative">
                <input
                  type="text"
                  value={form.establecimiento}
                  onChange={e => handleChange('establecimiento', e.target.value)}
                  placeholder="Escuela Bicentenario de Ejemplo"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                />
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Password grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Contraseña</label>
                <div className="relative">
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => handleChange('password', e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirmar</label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Crear Cuenta</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            <button
              onClick={onGoToLogin}
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
