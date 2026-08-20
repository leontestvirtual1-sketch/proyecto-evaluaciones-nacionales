import React, { useState } from 'react';
import { useAuth, RegisterData } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, User, Building2, CreditCard, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Clock, Copy, Check, ExternalLink, BookOpen, Hash } from 'lucide-react';
import { UserRole } from '../types';
import { asignaturasMock } from '../data/mockData';

const ASIGNATURAS_MINEDUC = [
  { id: 'asig-1', codigo: 'MAT', nombre: 'Matemática' },
  { id: 'asig-2', codigo: 'LEN', nombre: 'Lenguaje y Comunicación' },
  { id: 'asig-3', codigo: 'CN', nombre: 'Ciencias Naturales' },
  { id: 'asig-hist', codigo: 'HIST', nombre: 'Historia, Geografía y Cs. Sociales' },
  { id: 'asig-ing', codigo: 'ING', nombre: 'Idioma Extranjero: Inglés' },
  { id: 'asig-ef', codigo: 'EF', nombre: 'Educación Física y Salud' },
  { id: 'asig-art', codigo: 'ART', nombre: 'Artes Visuales' },
  { id: 'asig-mus', codigo: 'MUS', nombre: 'Música' },
  { id: 'asig-tec', codigo: 'TEC', nombre: 'Tecnología' },
  { id: 'asig-filo', codigo: 'FILO', nombre: 'Filosofía' },
  { id: 'asig-fis', codigo: 'FIS', nombre: 'Física' },
  { id: 'asig-quim', codigo: 'QUIM', nombre: 'Química' },
  { id: 'asig-otra', codigo: 'OTRA', nombre: 'Otra asignatura' },
];

interface RegisterPageProps {
  onGoToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onGoToLogin }) => {
  const { register, isLoading } = useAuth();
  const [form, setForm] = useState<RegisterData>({
    rut: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'profesor',
    establecimiento: '',
    rbd: '',
    asignaturaId: 'asig-1',
    asignaturaNombre: 'Matemática',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleChange = (field: keyof RegisterData, value: string) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'apellidoPaterno' || field === 'apellidoMaterno') {
        updated.apellido = `${updated.apellidoPaterno || ''} ${updated.apellidoMaterno || ''}`.trim();
      }
      return updated;
    });
  };

  /** Valida RUT chileno con dígito verificador */
  const validarRutChileno = (rut: string): boolean => {
    // Limpiar puntos, guiones y espacios
    const clean = rut.replace(/[\.\-\s]/g, '').toUpperCase();
    if (clean.length < 2) return false;

    const cuerpo = clean.slice(0, -1);
    const dv = clean.slice(-1);

    if (!/^\d+$/.test(cuerpo)) return false;

    // Calcular dígito verificador
    let suma = 0;
    let multiplicador = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : String(dvEsperado);

    return dv === dvCalculado;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.rut || !form.nombre || !form.apellidoPaterno || !form.apellidoMaterno || !form.email || !form.password || !form.establecimiento) {
      setError('Por favor completa todos los campos obligatorios (Nombres, Apellido Paterno, Apellido Materno, RUT, Email, Establecimiento y Contraseña).');
      return;
    }

    if (form.rol === 'profesor' && !form.asignaturaId) {
      setError('Selecciona tu especialidad o asignatura principal.');
      return;
    }

    // Validar RUT chileno
    if (!validarRutChileno(form.rut)) {
      setError('El RUT ingresado no es válido. Verifica el número y dígito verificador (ej: 12.345.678-9).');
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

    const res = await register({
      ...form,
      apellido: `${form.apellidoPaterno} ${form.apellidoMaterno}`.trim()
    });

    if (res.error) {
      setError(res.error);
    } else {
      setRegisteredSuccess(true);
    }
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
          {registeredSuccess ? (
            /* Vista de Éxito y Pasos de Verificación */
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-white">¡Solicitud de Registro Enviada!</h2>
                <p className="text-xs text-slate-300">
                  Tu cuenta para <strong className="text-indigo-300">{form.nombre} {form.apellidoPaterno} {form.apellidoMaterno}</strong> ({form.establecimiento}) ha sido registrada en nuestro sistema.
                </p>
              </div>

              {/* Proceso en 2 Pasos */}
              <div className="space-y-3 bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500 text-indigo-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      Notificación Enviada al Administrador
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Se ha notificado al equipo de Administración y UTP de <strong>Sysget Saber</strong> con los datos de tu establecimiento y especialidad.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-3 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/30 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Activación de Acceso Institucional (Trial 30 Días)
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Una vez validada la solicitud desde el panel institucional o mediante el correo de autorización, podrás iniciar sesión inmediatamente con tu correo y contraseña.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botón Ir a Login */}
              <button
                onClick={onGoToLogin}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
              >
                <span>Ir al Inicio de Sesión</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Formulario de Registro */
            <>
              <div>
                <h2 className="text-xl font-bold text-white">Crear Cuenta Institucional</h2>
                <p className="text-xs text-slate-400 mt-0.5">Acceso con 30 días de prueba gratuita para tu establecimiento</p>
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

                {/* Nombres y Apellidos Separados */}
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Nombres</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.nombre}
                        onChange={e => handleChange('nombre', e.target.value)}
                        placeholder="ej. Susana Andrea"
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                      />
                      <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Apellido Paterno</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={form.apellidoPaterno}
                          onChange={e => handleChange('apellidoPaterno', e.target.value)}
                          placeholder="ej. Pizarro"
                          className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                        />
                        <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Apellido Materno</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={form.apellidoMaterno}
                          onChange={e => handleChange('apellidoMaterno', e.target.value)}
                          placeholder="ej. Rojas"
                          className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                        />
                        <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                      </div>
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

                {/* Establecimiento + RBD */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Establecimiento Educacional</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.establecimiento}
                      onChange={e => handleChange('establecimiento', e.target.value)}
                      placeholder="Liceo / Colegio Ejemplo"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                    />
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>RBD del Establecimiento</span>
                    <span className="text-[10px] font-normal text-slate-500 normal-case">(Opcional — ubica tu colegio en el sistema MINEDUC)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.rbd || ''}
                      onChange={e => handleChange('rbd', e.target.value)}
                      placeholder="ej. 12345-6"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-600 font-mono"
                    />
                    <Hash className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  </div>
                  <p className="text-[10px] text-slate-500">Con el RBD podemos localizar automáticamente la región, dependencia y datos del establecimiento.</p>
                </div>

                {/* Especialidad — Solo para docentes */}
                {form.rol === 'profesor' && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                      Especialidad / Asignatura Principal
                    </label>
                    <div className="relative">
                      <select
                        value={form.asignaturaId || 'asig-1'}
                        onChange={e => {
                          const selected = ASIGNATURAS_MINEDUC.find(a => a.id === e.target.value);
                          setForm(prev => ({
                            ...prev,
                            asignaturaId: e.target.value,
                            asignaturaNombre: selected?.nombre || ''
                          }));
                        }}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 text-white border border-indigo-500/40 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                      >
                        {ASIGNATURAS_MINEDUC.map(asig => (
                          <option key={asig.id} value={asig.id}>
                            {asig.nombre} ({asig.codigo})
                          </option>
                        ))}
                      </select>
                      <BookOpen className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3" />
                    </div>
                    <p className="text-[10px] text-slate-500">Define qué banco de preguntas y evaluaciones tendrás disponibles por defecto.</p>
                  </div>
                )}

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
                      <span>Solicitar Acceso Gratuito (30 Días)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-800">
                <button
                  onClick={onGoToLogin}
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors mx-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Ya tengo cuenta • Iniciar Sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

