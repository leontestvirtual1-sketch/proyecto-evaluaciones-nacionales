import React, { useState, useRef } from 'react';
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
import { cursosMock } from '../data/mockData';
import { parseAlumnosCSV, csvAlumnosToProfiles } from '../utils/csvParser';

// Extendemos localmente con cursoId para el filtro (sin modificar el tipo global)
type AlumnoConCurso = UserProfile & { cursoId?: string };

const alumnosIniciales: AlumnoConCurso[] = [
  { id: 'alum-1', rut: '22.876.543-0', nombre: 'Pedro', apellido: 'Soto', email: 'pedro@demo.cl', rol: 'alumno', establecimiento: 'Escuela Bicentenario Demo', cursoId: 'curso-1' },
  { id: 'alum-2', rut: '23.111.111-1', nombre: 'Ana', apellido: 'López', email: 'ana@demo.cl', rol: 'alumno', establecimiento: 'Escuela Bicentenario Demo', cursoId: 'curso-1' },
  { id: 'alum-3', rut: '22.222.222-2', nombre: 'Carlos', apellido: 'Martínez', email: 'carlos@demo.cl', rol: 'alumno', establecimiento: 'Escuela Bicentenario Demo', cursoId: 'curso-2' },
  { id: 'alum-4', rut: '23.444.555-9', nombre: 'Sofía', apellido: 'Valenzuela', email: 'sofia@demo.cl', rol: 'alumno', establecimiento: 'Escuela Bicentenario Demo', cursoId: 'curso-2' },
  { id: 'alum-5', rut: '24.555.666-K', nombre: 'Diego', apellido: 'Fuentes', email: 'diego@demo.cl', rol: 'alumno', establecimiento: 'Escuela Bicentenario Demo', cursoId: 'curso-1' },
];

// ─── Manual form modal ───────────────────────────────────────
interface AlumnoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (a: UserProfile) => void;
  editAlumno?: UserProfile | null;
}

const AlumnoFormModal: React.FC<AlumnoFormModalProps> = ({ isOpen, onClose, onSave, editAlumno }) => {
  const [form, setForm] = useState<Partial<UserProfile>>(
    editAlumno || { rut: '', nombre: '', apellido: '', email: '', rol: 'alumno', establecimiento: 'Escuela Bicentenario Demo' }
  );

  if (!isOpen) return null;

  const handleSave = () => {
    if (!form.rut || !form.nombre || !form.apellido || !form.email) return;
    onSave({ id: editAlumno?.id || `alum-${Date.now()}`, ...form } as UserProfile);
    onClose();
  };

  const fields = [
    { label: 'Nombre', key: 'nombre', placeholder: 'Pedro', type: 'text' },
    { label: 'Apellido', key: 'apellido', placeholder: 'Soto', type: 'text' },
    { label: 'RUT', key: 'rut', placeholder: '22.876.543-0', type: 'text' },
    { label: 'Correo Electrónico', key: 'email', placeholder: 'pedro@colegio.cl', type: 'email' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editAlumno ? 'Editar Alumno' : 'Agregar Alumno'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {fields.slice(0, 2).map(f => (
              <div key={f.key} className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{f.label}</label>
                <input
                  type={f.type}
                  value={(form as any)[f.key] || ''}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            ))}
          </div>
          {fields.slice(2).map(f => (
            <div key={f.key} className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{f.label}</label>
              <input
                type={f.type}
                value={(form as any)[f.key] || ''}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          ))}

          {/* Curso select */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Curso</label>
            <select className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all">
              {cursosMock.map(c => <option key={c.id} value={c.id}>{c.nombre} — {c.nivel}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
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
  onImport: (alumnos: UserProfile[]) => void;
}

const CSV_TEMPLATE = `rut,nombre,apellido,email,curso
22.111.222-3,Valentina,Torres,v.torres@colegio.cl,8° Básico A
23.333.444-5,Ignacio,Pérez,i.perez@colegio.cl,8° Básico A
24.555.666-7,Camila,Rojas,c.rojas@colegio.cl,8° Básico B`;

const AlumnoCargaMasivaModal: React.FC<CSVModalProps> = ({ isOpen, onClose, onImport }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<UserProfile[]>([]);
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
      setErrors(errs);
      setPreview(csvAlumnosToProfiles(rows));
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_alumnos.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(CSV_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    onImport(preview);
    onClose();
    setPreview([]);
    setErrors([]);
    setFileName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Carga Masiva de Alumnos</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Importa tu nómina desde un archivo CSV</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Template download */}
          <div className="p-4 bg-sky-500/5 border border-sky-500/20 rounded-xl space-y-2">
            <p className="text-xs font-bold text-sky-600 dark:text-sky-400">Plantilla de Columnas Requeridas</p>
            <code className="block text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 p-2.5 rounded-lg font-mono">
              rut, nombre, apellido, email, curso
            </code>
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Descargar Plantilla .CSV
              </button>
              <button
                onClick={handleCopyTemplate}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Drop zone */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl p-8 text-center cursor-pointer transition-colors group"
          >
            <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 mx-auto mb-3 transition-colors" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {fileName ? fileName : 'Haz clic para seleccionar tu archivo .CSV'}
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
export const AlumnosPage: React.FC = () => {
  const [alumnos, setAlumnos] = useState<AlumnoConCurso[]>(alumnosIniciales);
  const [search, setSearch] = useState('');
  const [cursoFilter, setCursoFilter] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [editingAlumno, setEditingAlumno] = useState<UserProfile | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const codigoInvitacion = 'DEMO2026';

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-500" /> Gestión de Alumnos
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {alumnos.length} estudiantes registrados en el establecimiento
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCsvModalOpen(true)}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition-all"
          >
            <Upload className="w-4 h-4" /> Carga CSV
          </button>
          <button
            onClick={() => { setEditingAlumno(null); setFormModalOpen(true); }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Nuevo Alumno
          </button>
        </div>
      </div>

      {/* Código de invitación del curso */}
      <div className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-emerald-500">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Código de Invitación — Auto-Registro del Alumno
            </p>
            <p className="text-lg font-mono font-extrabold text-slate-900 dark:text-white tracking-widest">
              {codigoInvitacion}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              El alumno ingresa este código al registrarse para unirse al curso automáticamente.
            </p>
          </div>
        </div>
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl transition-all"
        >
          {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          {copiedCode ? 'Copiado' : 'Copiar Código'}
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, RUT o correo..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
        <select
          value={cursoFilter}
          onChange={e => setCursoFilter(e.target.value)}
          className="px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
        >
          <option value="">Todos los cursos</option>
          {cursosMock.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <span className="text-xs text-slate-500 font-medium whitespace-nowrap self-center">
          {filtered.length} de {alumnos.length}
        </span>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                <th className="py-3.5 px-5 text-slate-500 uppercase tracking-wider font-semibold">Estudiante</th>
                <th className="py-3.5 px-5 text-slate-500 uppercase tracking-wider font-semibold hidden sm:table-cell">RUT</th>
                <th className="py-3.5 px-5 text-slate-500 uppercase tracking-wider font-semibold hidden md:table-cell">Correo</th>
                <th className="py-3.5 px-5 text-slate-500 uppercase tracking-wider font-semibold hidden lg:table-cell">Curso</th>
                <th className="py-3.5 px-5 text-slate-500 uppercase tracking-wider font-semibold">Estado</th>
                <th className="py-3.5 px-5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Users className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-500">No se encontraron alumnos</p>
                    <p className="text-xs text-slate-400 mt-1">Agrega alumnos manualmente o importa desde un archivo CSV</p>
                  </td>
                </tr>
              ) : filtered.map(al => (
                <tr key={al.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                        {al.nombre[0]}{al.apellido[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{al.nombre} {al.apellido}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 md:hidden">{al.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-slate-600 dark:text-slate-400 hidden sm:table-cell font-mono">{al.rut}</td>
                  <td className="py-3.5 px-5 hidden md:table-cell">
                    <a href={`mailto:${al.email}`} className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline">
                      <Mail className="w-3 h-3" /> {al.email}
                    </a>
                  </td>
                  <td className="py-3.5 px-5 hidden lg:table-cell text-slate-600 dark:text-slate-400">
                    {cursosMock.find(c => c.id === al.cursoId)?.nombre ?? <span className="text-slate-300 dark:text-slate-600 italic">Sin curso</span>}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      <UserCheck className="w-3 h-3" /> Activo
                    </span>
                  </td>
                  <td className="py-3.5 px-4 relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === al.id ? null : al.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {activeMenuId === al.id && (
                      <div className="absolute right-4 top-10 z-20 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 animate-fade-in">
                        <button
                          onClick={() => { setEditingAlumno(al); setFormModalOpen(true); setActiveMenuId(null); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-emerald-500" /> Editar
                        </button>
                        <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                        <button
                          onClick={() => { setAlumnos(p => p.filter(a => a.id !== al.id)); setActiveMenuId(null); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AlumnoFormModal
        isOpen={formModalOpen}
        onClose={() => { setFormModalOpen(false); setEditingAlumno(null); }}
        onSave={handleSaveAlumno}
        editAlumno={editingAlumno}
      />
      <AlumnoCargaMasivaModal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        onImport={handleImportCSV}
      />
    </div>
  );
};
