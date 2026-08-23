import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Users,
  PlusCircle,
  Search,
  Upload,
  MoreVertical,
  Mail,
  Edit2,
  Trash2,
  UserCheck,
  KeyRound,
  X,
  CheckCircle2,
  AlertCircle,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { UserProfile } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { parseAlumnosCSV, csvAlumnosToProfiles } from '../utils/csvParser';
import { CursoItem, useCursos } from '../hooks/useCursos';

// Extendemos localmente con cursoId para el filtro
export type AlumnoConCurso = UserProfile & { cursoId?: string; cursoNombre?: string };

// ─── Manual form modal ───────────────────────────────────────
interface AlumnoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (a: AlumnoConCurso) => void;
  editAlumno?: AlumnoConCurso | null;
  cursosDisponibles: { id: string; nombre: string }[];
  establecimientoNombre: string;
}

const AlumnoFormModal: React.FC<AlumnoFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editAlumno,
  cursosDisponibles,
  establecimientoNombre
}) => {
  const [form, setForm] = useState<Partial<AlumnoConCurso>>({
    rut: '',
    nombre: '',
    apellido: '',
    email: '',
    rol: 'alumno',
    establecimiento: establecimientoNombre,
    cursoId: cursosDisponibles[0]?.id || '',
    cursoNombre: cursosDisponibles[0]?.nombre || ''
  });

  useEffect(() => {
    if (editAlumno) {
      setForm(editAlumno);
    } else {
      setForm({
        rut: '',
        nombre: '',
        apellido: '',
        email: '',
        rol: 'alumno',
        establecimiento: establecimientoNombre,
        cursoId: cursosDisponibles[0]?.id || '',
        cursoNombre: cursosDisponibles[0]?.nombre || ''
      });
    }
  }, [editAlumno, isOpen, establecimientoNombre, cursosDisponibles]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!form.rut || !form.nombre || !form.apellido || !form.email || !form.cursoId) return;
    const selectedCurso = cursosDisponibles.find(c => c.id === form.cursoId);
    onSave({
      id: editAlumno?.id || `alum-${Date.now()}`,
      ...form,
      establecimiento: establecimientoNombre,
      cursoNombre: selectedCurso ? selectedCurso.nombre : form.cursoNombre || ''
    } as AlumnoConCurso);
    onClose();
  };

  const fields = [
    { label: 'Nombre', key: 'nombre', placeholder: 'Ignacio', type: 'text' },
    { label: 'Apellido', key: 'apellido', placeholder: 'Soto', type: 'text' },
    { label: 'RUT', key: 'rut', placeholder: '22.876.543-0', type: 'text' },
    { label: 'Correo Electrónico', key: 'email', placeholder: 'alumno@premilitar.cl', type: 'email' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in text-left">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editAlumno ? 'Editar Alumno' : 'Registrar Nuevo Alumno'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{f.label}</label>
              <input
                type={f.type}
                value={(form[f.key] as string) || ''}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 dark:text-white"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Curso Asignado</label>
            <select
              value={form.cursoId || (cursosDisponibles[0]?.id || '')}
              onChange={e => {
                const cId = e.target.value;
                const cObj = cursosDisponibles.find(c => c.id === cId);
                setForm(prev => ({ ...prev, cursoId: cId, cursoNombre: cObj?.nombre || '' }));
              }}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-900 dark:text-white"
            >
              {cursosDisponibles.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            Cancelar
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all">
            {editAlumno ? 'Guardar Cambios' : 'Agregar Alumno'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── CSV Upload Modal ────────────────────────────────────────
interface CSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (alumnos: AlumnoConCurso[]) => void;
  establecimientoNombre: string;
  cursosDisponibles: { id: string; nombre: string }[];
}

const CSV_TEMPLATE = `rut,nombre,apellido,email,curso
22.111.222-3,Valentina,Torres,v.torres@premilitar.cl,2° Medio A
23.333.444-5,Ignacio,Pérez,i.perez@premilitar.cl,2° Medio A
24.555.666-7,Camila,Rojas,c.rojas@premilitar.cl,2° Medio A`;

const AlumnoCargaMasivaModal: React.FC<CSVModalProps> = ({ isOpen, onClose, onImport, establecimientoNombre, cursosDisponibles }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<AlumnoConCurso[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = ev => {
      const raw = ev.target?.result as string;
      const { rows, errors: errs } = parseAlumnosCSV(raw);
      const cursosPorNombre = new Map(cursosDisponibles.map(c => [c.nombre.trim().toLocaleLowerCase(), c]));
      const courseErrors: string[] = [];
      const mappedProfiles = csvAlumnosToProfiles(rows).flatMap((p, idx) => {
        const cursoNombre = rows[idx]?.curso?.trim() || '';
        const curso = cursosPorNombre.get(cursoNombre.toLocaleLowerCase());
        if (!curso) {
          courseErrors.push(`Fila ${idx + 2}: el curso "${cursoNombre}" no existe en tu lista de cursos.`);
          return [];
        }
        return [{ ...p, establecimiento: establecimientoNombre, cursoId: curso.id, cursoNombre: curso.nombre }];
      });
      setErrors([...errs, ...courseErrors]);
      setPreview(mappedProfiles);
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_alumnos_sysget.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (preview.length === 0) return;
    onImport(preview);
    setPreview([]);
    setFileName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in text-left">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Carga Masiva de Alumnos</h3>
              <p className="text-xs text-slate-500 mt-0.5">Importa la nómina de tu curso mediante un archivo CSV</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Template Download */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <Download className="w-4 h-4 text-sky-500" />
              <span>Descargar plantilla de ejemplo (.csv)</span>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              Descargar
            </button>
          </div>

          {/* Dropzone */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-sky-500/50 dark:hover:border-sky-500/50 rounded-2xl p-6 text-center cursor-pointer transition-colors group"
          >
            <Upload className="w-8 h-8 mx-auto text-slate-400 group-hover:text-sky-500 transition-colors mb-2" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {fileName ? fileName : 'Haz clic para seleccionar el archivo CSV'}
            </p>
            <p className="text-xs text-slate-400 mt-1">Separador coma (,) o punto y coma (;) — UTF-8</p>
            <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFile} className="hidden" />
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1">
              <p className="text-xs font-bold text-rose-600 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> {errors.length} error(es) encontrado(s)
              </p>
              {errors.map((e, i) => <p key={i} className="text-xs text-rose-500 pl-5">{e}</p>)}
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> {preview.length} alumno(s) listos para importar
              </p>
              <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
                {preview.map((a, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2.5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-[10px]">
                        {a.nombre[0]}{a.apellido[0]}
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{a.nombre} {a.apellido}</span>
                    </div>
                    <span className="text-slate-400 font-mono">{a.rut}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            Cancelar
          </button>
          <button
            onClick={handleImport}
            disabled={preview.length === 0}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-40 shadow-md transition-all"
          >
            Importar {preview.length > 0 ? `${preview.length} Alumnos` : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main AlumnosPage ─────────────────────────────────────────
interface AlumnosPageProps {
  currentUser?: UserProfile | null;
  isSandboxMode?: boolean;
}

export const AlumnosPage: React.FC<AlumnosPageProps> = ({ currentUser, isSandboxMode = false }) => {
  const colegioNombre = currentUser?.establecimiento || APP_CONFIG.nombreEstablecimiento;
  const storageKey = isSandboxMode
    ? `sysget_demo_alumnos_${currentUser?.id || 'default'}`
    : `sysget_prod_alumnos_${currentUser?.id || 'default'}`;

  const { cursos: cursosFromHook } = useCursos({ currentUser, isSandboxMode });

  // Inicializar alumnos aislados:
  // En PRODUCCIÓN: siempre inicia 100% limpio (0 alumnos) con empty state legítimo (Directiva 2)
  // En MODO DEMO / SANDBOX: carga la nómina demo de 8° y 6°
  const getInitialAlumnos = (): AlumnoConCurso[] => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (err) {
        console.error('Error parsing saved alumnos:', err);
      }
    }

    if (isSandboxMode) {
      return [
        { id: 'alum-1', rut: '22.876.543-0', nombre: 'Pedro', apellido: 'Soto', email: 'pedro@demo.cl', rol: 'alumno', establecimiento: colegioNombre, cursoId: 'curso-1', cursoNombre: '8° Básico A' },
        { id: 'alum-2', rut: '23.111.111-1', nombre: 'Ana', apellido: 'López', email: 'ana@demo.cl', rol: 'alumno', establecimiento: colegioNombre, cursoId: 'curso-1', cursoNombre: '8° Básico A' },
        { id: 'alum-3', rut: '22.222.222-2', nombre: 'Carlos', apellido: 'Martínez', email: 'carlos@demo.cl', rol: 'alumno', establecimiento: colegioNombre, cursoId: 'curso-2', cursoNombre: '8° Básico B' },
        { id: 'alum-4', rut: '23.444.555-9', nombre: 'Sofía', apellido: 'Valenzuela', email: 'sofia@demo.cl', rol: 'alumno', establecimiento: colegioNombre, cursoId: 'curso-2', cursoNombre: '8° Básico B' },
        { id: 'alum-5', rut: '24.555.666-K', nombre: 'Diego', apellido: 'Fuentes', email: 'diego@demo.cl', rol: 'alumno', establecimiento: colegioNombre, cursoId: 'curso-1', cursoNombre: '8° Básico A' },
        { id: 'alum-6', rut: '21.016.016-5', nombre: 'Tomás', apellido: 'Quintero', email: 'tomas.quintero@demo.cl', rol: 'alumno', establecimiento: colegioNombre, cursoId: 'curso-6b', cursoNombre: '6° Básico B' },
        { id: 'alum-7', rut: '21.017.017-6', nombre: 'Emilia', apellido: 'Rojas', email: 'emilia.rojas@demo.cl', rol: 'alumno', establecimiento: colegioNombre, cursoId: 'curso-6b', cursoNombre: '6° Básico B' },
        { id: 'alum-8', rut: '21.018.018-7', nombre: 'Benjamín', apellido: 'Soto', email: 'benjamin.soto@demo.cl', rol: 'alumno', establecimiento: colegioNombre, cursoId: 'curso-6b', cursoNombre: '6° Básico B' },
      ];
    }

    const email = (currentUser?.email || '').toLowerCase();
    const est = (currentUser?.establecimiento || '').toLowerCase();
    const isDemoAccount = email.endsWith('@escuelademo.cl') ||
                          email.endsWith('@demo.cl') ||
                          email.endsWith('@sysget.cl') ||
                          email === 'admin@sysget.cl' ||
                          est.includes('demo') ||
                          est.includes('bicentenario');

    if (isDemoAccount && !email.includes('leontestvirtual1') && !email.includes('mariateresa') && !email.includes('susana')) {
      return [
        { id: 'alum-1', rut: '22.876.543-0', nombre: 'Pedro', apellido: 'Soto', email: 'pedro@demo.cl', rol: 'alumno', establecimiento: colegioNombre, cursoId: 'curso-1', cursoNombre: '8° Básico A' },
        { id: 'alum-2', rut: '23.111.111-1', nombre: 'Ana', apellido: 'López', email: 'ana@demo.cl', rol: 'alumno', establecimiento: colegioNombre, cursoId: 'curso-1', cursoNombre: '8° Básico A' },
        { id: 'alum-3', rut: '22.222.222-2', nombre: 'Carlos', apellido: 'Martínez', email: 'carlos@demo.cl', rol: 'alumno', establecimiento: colegioNombre, cursoId: 'curso-2', cursoNombre: '8° Básico B' },
        { id: 'alum-4', rut: '23.444.555-9', nombre: 'Sofía', apellido: 'Valenzuela', email: 'sofia@demo.cl', rol: 'alumno', establecimiento: colegioNombre, cursoId: 'curso-2', cursoNombre: '8° Básico B' },
        { id: 'alum-5', rut: '24.555.666-K', nombre: 'Diego', apellido: 'Fuentes', email: 'diego@demo.cl', rol: 'alumno', establecimiento: colegioNombre, cursoId: 'curso-1', cursoNombre: '8° Básico A' },
        { id: 'alum-6', rut: '21.016.016-5', nombre: 'Tomás', apellido: 'Quintero', email: 'tomas.quintero@demo.cl', rol: 'alumno', establecimiento: colegioNombre, cursoId: 'curso-6b', cursoNombre: '6° Básico B' },
        { id: 'alum-7', rut: '21.017.017-6', nombre: 'Emilia', apellido: 'Rojas', email: 'emilia.rojas@demo.cl', rol: 'alumno', establecimiento: colegioNombre, cursoId: 'curso-6b', cursoNombre: '6° Básico B' },
        { id: 'alum-8', rut: '21.018.018-7', nombre: 'Benjamín', apellido: 'Soto', email: 'benjamin.soto@demo.cl', rol: 'alumno', establecimiento: colegioNombre, cursoId: 'curso-6b', cursoNombre: '6° Básico B' },
      ];
    }

    return [];
  };

  const [alumnos, setAlumnos] = useState<AlumnoConCurso[]>(getInitialAlumnos);
  const [search, setSearch] = useState('');
  const [cursoFilter, setCursoFilter] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [editingAlumno, setEditingAlumno] = useState<AlumnoConCurso | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Guardar en localStorage cada vez que cambie la lista de alumnos
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(alumnos));
  }, [alumnos, storageKey]);

  // Cursos disponibles obtenidos reactivamente del hook
  const cursosDisponibles = useMemo(() => {
    return cursosFromHook.map(curso => ({
      id: curso.id,
      nombre: curso.nombre,
      codigoInvitacion: curso.codigoInvitacion,
    }));
  }, [cursosFromHook]);
  const puedeGestionarAlumnos = cursosDisponibles.length > 0;

  const codigoInvitacion = cursosDisponibles[0]?.codigoInvitacion || '';

  const filtered = alumnos.filter(a => {
    const matchesSearch = `${a.nombre} ${a.apellido} ${a.rut} ${a.email}`.toLowerCase().includes(search.toLowerCase());
    const matchesCurso = cursoFilter === '' || a.cursoId === cursoFilter;
    return matchesSearch && matchesCurso;
  });

  const handleSaveAlumno = (a: AlumnoConCurso) => {
    setAlumnos(prev => {
      const exists = prev.find(p => p.id === a.id);
      return exists ? prev.map(p => p.id === a.id ? a : p) : [a, ...prev];
    });
    setEditingAlumno(null);
  };

  const handleImportCSV = (nuevos: AlumnoConCurso[]) => {
    setAlumnos(prev => [...nuevos, ...prev]);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codigoInvitacion);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDelete = (id: string) => {
    setAlumnos(prev => prev.filter(a => a.id !== id));
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-500" /> Gestión de Alumnos
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {alumnos.length} estudiantes registrados en <strong>{colegioNombre}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCsvModalOpen(true)}
            disabled={!puedeGestionarAlumnos}
            title={puedeGestionarAlumnos ? 'Cargar alumnos desde CSV' : 'Primero crea un curso'}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-sky-600/20 transition-all"
          >
            <Upload className="w-4 h-4" /> Carga CSV
          </button>
          <button
            onClick={() => { setEditingAlumno(null); setFormModalOpen(true); }}
            disabled={!puedeGestionarAlumnos}
            title={puedeGestionarAlumnos ? 'Registrar alumno' : 'Primero crea un curso'}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Nuevo Alumno
          </button>
        </div>
      </div>

      {/* Auto-registration card */}
      <div className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-500/10 via-slate-900/50 to-slate-900 border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {puedeGestionarAlumnos ? 'Código de Invitación — Auto-registro del Alumno' : 'Aún no hay cursos creados'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {puedeGestionarAlumnos
                ? 'El alumno ingresa este código al registrarse para unirse al curso automáticamente.'
                : 'Crea el primer curso antes de cargar alumnos o compartir un código de invitación.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {puedeGestionarAlumnos && <span className="font-mono font-extrabold text-base tracking-widest text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            {codigoInvitacion}
          </span>}
          <button
            onClick={handleCopyCode}
            disabled={!puedeGestionarAlumnos}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-xl transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedCode ? 'Copiado' : 'Copiar Código'}
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, RUT o correo..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 dark:text-white"
          />
        </div>

        <select
          value={cursoFilter}
          onChange={e => setCursoFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-900 dark:text-white"
        >
          <option value="">Todos los cursos ({alumnos.length})</option>
          {cursosDisponibles.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      {/* Alumnos Table */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Sin estudiantes en la nómina</h3>
            <p className="text-xs text-slate-500 mt-1">
              {search ? 'No se encontraron alumnos con el filtro aplicado.' : 'Comienza agregando alumnos manualmente o subiendo tu archivo CSV.'}
            </p>
          </div>
          {!search && (
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setCsvModalOpen(true)}
                disabled={!puedeGestionarAlumnos}
                className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all"
              >
                <Upload className="w-4 h-4" /> Cargar Nómina CSV
              </button>
              <button
                onClick={() => { setEditingAlumno(null); setFormModalOpen(true); }}
                disabled={!puedeGestionarAlumnos}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all"
              >
                <PlusCircle className="w-4 h-4" /> Nuevo Alumno
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Estudiante</th>
                  <th className="px-5 py-3">RUT</th>
                  <th className="px-5 py-3">Correo</th>
                  <th className="px-5 py-3">Curso</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filtered.map(alumno => (
                  <tr key={alumno.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                          {alumno.nombre[0]}{alumno.apellido[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{alumno.nombre} {alumno.apellido}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-600 dark:text-slate-300">{alumno.rut}</td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{alumno.email}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-700 dark:text-slate-300">
                      {alumno.cursoNombre || '2° Medio A'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Activo
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === alumno.id ? null : alumno.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeMenuId === alumno.id && (
                          <div className="absolute right-0 top-8 z-20 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 animate-fade-in text-left">
                            <button
                              onClick={() => { setEditingAlumno(alumno); setFormModalOpen(true); setActiveMenuId(null); }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-emerald-500" /> Editar
                            </button>
                            <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                            <button
                              onClick={() => handleDelete(alumno.id)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <AlumnoFormModal
        isOpen={formModalOpen}
        onClose={() => { setFormModalOpen(false); setEditingAlumno(null); }}
        onSave={handleSaveAlumno}
        editAlumno={editingAlumno}
        cursosDisponibles={cursosDisponibles}
        establecimientoNombre={colegioNombre}
      />

      {/* CSV Modal */}
      <AlumnoCargaMasivaModal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        onImport={handleImportCSV}
        establecimientoNombre={colegioNombre}
        cursosDisponibles={cursosDisponibles}
      />
    </div>
  );
};
