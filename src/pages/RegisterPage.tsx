import React, { useState } from 'react';
import { useAuth, RegisterData } from '../context/AuthContext';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Building2,
  UserCheck,
  Sparkles,
  School,
  Layers
} from 'lucide-react';
import { UserRole, TipoCuenta } from '../types';
import { asignaturasMock } from '../data/mockData';
import { DocenteFormFields, DocenteFormData, RutValidationStatus } from '../components/DocenteFormFields';
import { validarRutChileno, validarRBD, normalizarRBD } from '../utils/chileValidators';

interface RegisterPageProps {
  onGoToLogin: () => void;
  onGoToLanding?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onGoToLogin, onGoToLanding }) => {
  const { register, isLoading } = useAuth();
  
  // Modelo de contratación: Colegio (B2B) o Profesor Independiente (B2C)
  const [tipoCuenta, setTipoCuenta] = useState<TipoCuenta>('colegio');

  const [form, setForm] = useState<RegisterData>({
    rut: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    rol: 'profesor',
    establecimiento: '',
    rbd: '',
    asignaturaId: 'asig-1',
    asignaturaNombre: 'Matemática',
    tipoCuenta: 'colegio',
    cargo: 'Docente de Asignatura'
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [rutStatus, setRutStatus] = useState<RutValidationStatus | null>(null);

  const handleTipoCuentaChange = (nuevoTipo: TipoCuenta) => {
    setTipoCuenta(nuevoTipo);
    setForm(prev => {
      if (nuevoTipo === 'profesor_independiente') {
        return {
          ...prev,
          tipoCuenta: 'profesor_independiente',
          rol: 'profesor',
          establecimiento: prev.establecimiento || 'Docente Independiente / Particular',
          rbd: 'PARTICULAR',
          cargo: 'Profesor Particular / Independiente'
        };
      } else {
        return {
          ...prev,
          tipoCuenta: 'colegio',
          rbd: prev.rbd === 'PARTICULAR' ? '' : prev.rbd,
          establecimiento: prev.establecimiento === 'Docente Independiente / Particular' ? '' : prev.establecimiento,
          cargo: 'Docente de Asignatura'
        };
      }
    });
  };

  const handleFieldChange = (field: keyof DocenteFormData | 'password' | 'rol' | 'cargo', value: string) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'apellidoPaterno' || field === 'apellidoMaterno') {
        updated.apellido = `${updated.apellidoPaterno || ''} ${updated.apellidoMaterno || ''}`.trim();
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rutStatus?.expired) {
      setError(rutStatus.message || 'El usuario asociado a este RUT ya completó su período de prueba gratuita de 30 días. Comunícate con el administrador para renovar tu acceso o contratar una licencia.');
      return;
    }

    const isIndependiente = tipoCuenta === 'profesor_independiente';

    if (!form.rut || !form.nombre || !form.apellidoPaterno || !form.apellidoMaterno || !form.email || !form.password) {
      setError('Por favor completa todos tus datos personales obligatorios (Nombres, Apellidos, RUT, Email y Contraseña).');
      return;
    }

    if (!isIndependiente && (!form.establecimiento || !form.rbd)) {
      setError('Para cuentas de colegio, el Establecimiento y su código oficial RBD son obligatorios.');
      return;
    }

    if (!form.telefono || form.telefono.trim().length < 9) {
      setError('El teléfono celular es obligatorio. Ingresa un número válido en formato +56 9 XXXX XXXX.');
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

    // Validar RBD chileno solo para colegios
    if (!isIndependiente && !validarRBD(form.rbd || '')) {
      setError('El RBD ingresado no es válido. Debe ser el código numérico oficial MINEDUC de tu establecimiento.');
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
      tipoCuenta,
      rbd: isIndependiente ? 'PARTICULAR' : normalizarRBD(form.rbd || ''),
      establecimiento: isIndependiente ? (form.establecimiento || 'Docente Independiente') : form.establecimiento,
      apellido: `${form.apellidoPaterno} ${form.apellidoMaterno}`.trim()
    });

    if (res.error) {
      setError(res.error);
    } else {
      setRegisteredSuccess(true);
    }
  };

  const rolesColegio: { value: UserRole; label: string; desc: string }[] = [
    { value: 'profesor', label: 'Profesor / Docente', desc: 'Crea evaluaciones de aula, SIMCE y PAES' },
    { value: 'director', label: 'Director / Directivo', desc: 'Cuadro de mando ejecutivo y cobertura' },
    { value: 'utp', label: 'Jefe de UTP', desc: 'Supervisión pedagógica por departamento' },
    { value: 'alumno', label: 'Estudiante', desc: 'Rinde evaluaciones asignadas' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Botón volver al inicio */}
      {onGoToLanding && (
        <button
          onClick={onGoToLanding}
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700 shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Volver a la página de inicio"
        >
          <ArrowLeft size={15} />
          <span>Volver al Inicio</span>
        </button>
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl space-y-6 animate-fade-in my-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3.5 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/30">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Sysget<span className="text-indigo-400">Saber</span>
          </h1>
          <p className="text-sm text-slate-400">Plataforma de Evaluaciones Nacionales — Chile 2026</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          {registeredSuccess ? (
            /* Vista de Éxito */
            <div className="text-center space-y-5 animate-fade-in py-2">
              <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500/50 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">¡Solicitud de Registro Enviada!</h2>
                <p className="text-xs text-slate-400">
                  Tu cuenta ha sido creada exitosamente para <strong>{form.email}</strong>.
                </p>
              </div>

              {/* Proceso de Activación */}
              <div className="space-y-3 bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500 text-indigo-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      Notificación de Cuenta {tipoCuenta === 'colegio' ? 'Institucional' : 'Independiente'}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {tipoCuenta === 'colegio'
                        ? 'Se ha registrado tu solicitud asociada a tu establecimiento educativo con rol de ' + form.rol + '.'
                        : 'Se ha creado tu perfil como Profesor Independiente con aislamiento privado de evaluaciones.'}
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
                      Activación de Acceso (Trial 30 Días)
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Una vez validada la solicitud o mediante el correo de bienvenida, podrás iniciar sesión inmediatamente con tu correo y contraseña.
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
                <h2 className="text-xl font-bold text-white">Comenzar con Sysget Saber</h2>
                <p className="text-xs text-slate-400 mt-0.5">Prueba gratuita de 30 días para colegios y docentes independientes</p>
              </div>

              {/* ── Selector B2B (Colegio) vs B2C (Profesor Independiente) ── */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  ¿Cómo utilizarás la plataforma?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleTipoCuentaChange('colegio')}
                    className={`p-3.5 rounded-xl border text-left transition-all relative ${
                      tipoCuenta === 'colegio'
                        ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${tipoCuenta === 'colegio' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        <School className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Represento a un Colegio</div>
                        <div className="text-[11px] text-slate-400">Colegios, Liceos (B2B con RBD)</div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTipoCuentaChange('profesor_independiente')}
                    className={`p-3.5 rounded-xl border text-left transition-all relative ${
                      tipoCuenta === 'profesor_independiente'
                        ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${tipoCuenta === 'profesor_independiente' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Profesor Independiente</div>
                        <div className="text-[11px] text-slate-400">Docente particular (B2C)</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Si es colegio: Selección de Rol dentro del establecimiento */}
                {tipoCuenta === 'colegio' && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Tu Cargo en el Colegio
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {rolesColegio.map(r => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => {
                            handleFieldChange('rol', r.value);
                            if (r.value === 'director') {
                              handleFieldChange('cargo', 'Director / Directivo');
                            } else if (r.value === 'utp') {
                              handleFieldChange('cargo', 'Jefe de UTP');
                            } else if (r.value === 'profesor') {
                              handleFieldChange('cargo', 'Docente de Asignatura');
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            form.rol === r.value
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-indigo-500/50'
                          }`}
                        >
                          <div className="text-xs font-bold">{r.label}</div>
                          <div className={`text-[10px] mt-0.5 line-clamp-1 ${form.rol === r.value ? 'text-indigo-200' : 'text-slate-500'}`}>
                            {r.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Campos Unificados del Docente */}
                <DocenteFormFields
                  formData={{
                    rut: form.rut,
                    nombre: form.nombre,
                    apellidoPaterno: form.apellidoPaterno,
                    apellidoMaterno: form.apellidoMaterno,
                    apellido: form.apellido,
                    email: form.email,
                    telefono: form.telefono || '',
                    establecimiento: tipoCuenta === 'profesor_independiente' 
                      ? (form.establecimiento || 'Docente Independiente / Particular')
                      : form.establecimiento,
                    rbd: tipoCuenta === 'profesor_independiente' ? 'PARTICULAR' : (form.rbd || ''),
                    comuna: form.comuna || '',
                    dependencia: form.dependencia || '',
                    asignaturaId: form.asignaturaId || 'asig-1',
                    asignaturaNombre: form.asignaturaNombre || 'Matemática'
                  }}
                  onChange={(field, val) => handleFieldChange(field, val)}
                  onRutStatusChange={setRutStatus}
                  asignaturas={asignaturasMock}
                />

                {/* Password grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Contraseña</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={form.password}
                        onChange={e => handleFieldChange('password', e.target.value)}
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
                  disabled={isLoading || rutStatus?.expired}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : rutStatus?.expired ? (
                    <span className="text-rose-200">Período de Prueba Finalizado</span>
                  ) : (
                    <>
                      <span>
                        {tipoCuenta === 'colegio' ? 'Solicitar Acceso Institucional (30 Días)' : 'Crear Cuenta de Docente (30 Días)'}
                      </span>
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
