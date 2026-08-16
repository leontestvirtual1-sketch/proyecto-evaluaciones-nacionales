import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onGoToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onGoToRegister }) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('admin@sysget.cl');
  const [password, setPassword] = useState('demo1234');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Completa todos los campos.');
      return;
    }
    const { error: loginError } = await login(email, password);
    if (loginError) setError(loginError);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo & Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/30">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Sysget<span className="text-indigo-400">Saber</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Plataforma de Evaluaciones — Chile 2026
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Iniciar Sesión</h2>
            <p className="text-xs text-slate-400 mt-0.5">Ingresa con tu cuenta institucional</p>
          </div>

          {/* Demo hint */}
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-indigo-400">
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              Cuentas de demostración (cualquier contraseña)
            </div>
            <div className="grid grid-cols-1 gap-1 pl-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">👑 Admin/UTP</span>
                <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">admin@sysget.cl</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">📐 Prof. Matemática</span>
                <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">maria@demo.cl</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">🔬 Prof. Ciencias</span>
                <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">patricia@demo.cl</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">📖 Prof. Lenguaje</span>
                <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">carlos@demo.cl</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">🎓 Alumno</span>
                <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">pedro@demo.cl</code>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nombre@colegio.cl"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error / Status message */}
            {error && (
              <div className={`p-3.5 rounded-xl text-xs border ${
                error.includes('pendiente')
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : error.includes('suspendida')
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
              }`}>
                <div className="font-semibold mb-0.5">
                  {error.includes('pendiente') ? '⏳ Cuenta en Revisión' : error.includes('suspendida') ? '🚫 Cuenta Suspendida' : '⚠️ Error al Iniciar Sesión'}
                </div>
                <div className="text-[11px] leading-relaxed text-slate-300">
                  {error}
                </div>
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
                  <span>Ingresar a Sysget Saber</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 space-y-2 pt-2 border-t border-slate-800">
            <div>
              ¿No tienes cuenta?{' '}
              <button
                onClick={onGoToRegister}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors underline underline-offset-2"
              >
                Solicita 30 días de prueba gratis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

