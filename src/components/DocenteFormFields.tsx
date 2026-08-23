import React, { useEffect, useState } from 'react';
import { User, Mail, Building2, Hash, BookOpen, AlertCircle, CheckCircle2, MapPin } from 'lucide-react';
import { Asignatura, EstablecimientoInfo } from '../types';
import { asignaturasMock, establecimientosCatalog } from '../data/mockData';
import { validarRutChileno, formatearRutChileno, validarRBD, normalizarRBD } from '../utils/chileValidators';
import { supabase } from '../lib/supabaseClient';

export const COMUNAS_REGION_METROPOLITANA = [
  'Santiago',
  'Cerrillos',
  'Cerro Navia',
  'Conchalí',
  'El Bosque',
  'Estación Central',
  'Huechuraba',
  'Independencia',
  'La Cisterna',
  'La Florida',
  'La Granja',
  'La Pintana',
  'La Reina',
  'Las Condes',
  'Lo Barnechea',
  'Lo Espejo',
  'Lo Prado',
  'Macul',
  'Maipú',
  'Ñuñoa',
  'Pedro Aguirre Cerda',
  'Peñalolén',
  'Providencia',
  'Pudahuel',
  'Quilicura',
  'Quinta Normal',
  'Recoleta',
  'Renca',
  'San Joaquín',
  'San Miguel',
  'San Ramón',
  'Vitacura',
  'Puente Alto',
  'Pirque',
  'San José de Maipo',
  'Colina',
  'Lampa',
  'Til Til',
  'San Bernardo',
  'Buin',
  'Calera de Tango',
  'Paine',
  'Melipilla',
  'Alhué',
  'Curacaví',
  'María Pinto',
  'San Pedro',
  'Talagante',
  'El Monte',
  'Isla de Maipo',
  'Padre Hurtado',
  'Peñaflor'
].sort((a, b) => a.localeCompare('es'));

export interface DocenteFormData {
  rut: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  apellido?: string;
  email: string;
  establecimiento: string;
  rbd: string;
  comuna?: string;
  dependencia?: string;
  asignaturaId: string;
  asignaturaNombre: string;
  cargo?: string;
}

interface DocenteFormFieldsProps {
  formData: DocenteFormData;
  onChange: (field: keyof DocenteFormData, value: string) => void;
  asignaturas?: Asignatura[];
  showCargoField?: boolean;
}

export const DocenteFormFields: React.FC<DocenteFormFieldsProps> = ({
  formData,
  onChange,
  asignaturas = asignaturasMock,
  showCargoField = false
}) => {
  const [establecimientosList, setEstablecimientosList] = useState<EstablecimientoInfo[]>(establecimientosCatalog);
  const [isCustomEstablecimiento, setIsCustomEstablecimiento] = useState(false);
  const [comunasList, setComunasList] = useState<string[]>(COMUNAS_REGION_METROPOLITANA);

  // Cargar establecimientos desde Supabase si están disponibles
  useEffect(() => {
    async function loadEstablecimientos() {
      try {
        const { data, error } = await supabase
          .from('establecimientos')
          .select('rbd, nombre, comuna, dependencia, logo_url');
        if (!error && data && data.length > 0) {
          const mapped: EstablecimientoInfo[] = data.map(e => ({
            rbd: e.rbd,
            nombre: e.nombre,
            comuna: e.comuna || '',
            dependencia: e.dependencia || 'Particular Subvencionado',
            logoUrl: e.logo_url || ''
          }));
          
          // Mezclar con catálogo local sin duplicar RBD
          const merged = [...mapped];
          establecimientosCatalog.forEach(c => {
            if (!merged.find(m => m.rbd === c.rbd)) {
              merged.push(c);
            }
          });
          setEstablecimientosList(merged);
        }
      } catch (err) {
        console.warn('Usando catálogo local de establecimientos:', err);
      }
    }
    loadEstablecimientos();
  }, []);

  // Cargar comunas desde Supabase (tabla public.comunas) con fallback al array local
  useEffect(() => {
    async function loadComunas() {
      try {
        const { data, error } = await supabase
          .from('comunas')
          .select('nombre, provincia')
          .eq('region_numero', '13')
          .order('nombre', { ascending: true });
        if (!error && data && data.length > 0) {
          setComunasList(data.map(c => c.nombre));
        }
      } catch (err) {
        console.warn('Usando listado local de comunas de la RM:', err);
      }
    }
    loadComunas();
  }, []);


  // Verificar si el establecimiento actual está en la lista conocida
  useEffect(() => {
    if (formData.rbd) {
      const match = establecimientosList.find(e => e.rbd === formData.rbd);
      if (match) {
        setIsCustomEstablecimiento(false);
      }
    }
  }, [formData.rbd, establecimientosList]);

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    onChange('rut', rawVal);
  };

  const handleRutBlur = () => {
    if (formData.rut.trim()) {
      const formatted = formatearRutChileno(formData.rut);
      onChange('rut', formatted);
    }
  };

  const handleEstablecimientoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'CUSTOM') {
      setIsCustomEstablecimiento(true);
      onChange('establecimiento', '');
      onChange('rbd', '');
      onChange('comuna', '');
      onChange('dependencia', 'Particular Subvencionado');
    } else {
      setIsCustomEstablecimiento(false);
      const selected = establecimientosList.find(est => est.rbd === val);
      if (selected) {
        onChange('rbd', selected.rbd);
        onChange('establecimiento', selected.nombre);
        onChange('comuna', selected.comuna || '');
        onChange('dependencia', selected.dependencia || 'Particular Subvencionado');
      }
    }
  };

  const handleRbdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizarRBD(e.target.value);
    onChange('rbd', normalized);
  };

  const handleAsignaturaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const asigId = e.target.value;
    const selected = asignaturas.find(a => a.id === asigId);
    onChange('asignaturaId', asigId);
    onChange('asignaturaNombre', selected?.nombre || '');
    if (selected) {
      onChange('cargo', `Docente de ${selected.nombre}`);
    }
  };

  const isRutValid = formData.rut.trim().length >= 8 ? validarRutChileno(formData.rut) : null;
  const isRbdValid = formData.rbd.trim().length > 0 ? validarRBD(formData.rbd) : null;

  return (
    <div className="space-y-2 text-left">
      {/* Fila 1: Nombre + Ap. Paterno + Ap. Materno */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5">
            Nombre(s) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input type="text" required value={formData.nombre} onChange={e => onChange('nombre', e.target.value)}
              placeholder="ej. Susana"
              className="w-full pl-7 pr-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-slate-400" />
            <User className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5">
            Ap. Paterno <span className="text-red-500">*</span>
          </label>
          <input type="text" required value={formData.apellidoPaterno} onChange={e => onChange('apellidoPaterno', e.target.value)}
            placeholder="ej. Pizarro"
            className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-slate-400" />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5">
            Ap. Materno
          </label>
          <input type="text" value={formData.apellidoMaterno} onChange={e => onChange('apellidoMaterno', e.target.value)}
            placeholder="ej. Valenzuela"
            className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-slate-400" />
        </div>
      </div>

      {/* Fila 2: RUT + Correo */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5 flex items-center justify-between">
            <span>RUT <span className="text-red-500">*</span></span>
            {isRutValid === true && <span className="text-emerald-500 font-medium flex items-center gap-0.5 normal-case"><CheckCircle2 className="w-3 h-3" /> OK</span>}
            {isRutValid === false && <span className="text-rose-500 font-medium flex items-center gap-0.5 normal-case"><AlertCircle className="w-3 h-3" /> Inválido</span>}
          </label>
          <div className="relative">
            <input type="text" required value={formData.rut} onChange={handleRutChange} onBlur={handleRutBlur}
              placeholder="12.345.678-9"
              className={`w-full pl-7 pr-2 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border ${
                isRutValid === false ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-slate-300 dark:border-slate-700'
              } rounded-lg outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-slate-400`} />
            <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5">
            Correo <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input type="email" required value={formData.email} onChange={e => onChange('email', e.target.value)}
              placeholder="profe@colegio.cl"
              className="w-full pl-7 pr-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-slate-400" />
            <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
          </div>
        </div>
      </div>

      {/* Fila 3: Colegio (3/5) + RBD (2/5) */}
      <div className="grid grid-cols-5 gap-2">
        <div className="col-span-3">
          <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-indigo-400" /> Colegio <span className="text-red-500">*</span>
          </label>
          <select value={isCustomEstablecimiento ? 'CUSTOM' : (formData.rbd || '')} onChange={handleEstablecimientoSelect}
            className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all">
            <option value="" disabled>Seleccionar establecimiento...</option>
            {establecimientosList.map(est => (
              <option key={est.rbd} value={est.rbd}>{est.nombre} ({est.rbd})</option>
            ))}
            <option value="CUSTOM">➕ Otro establecimiento...</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5 flex items-center justify-between">
            <span>RBD <span className="text-red-500">*</span></span>
            {isRbdValid === true && <span className="text-emerald-500 font-medium flex items-center gap-0.5 normal-case"><CheckCircle2 className="w-3 h-3" /> OK</span>}
          </label>
          <div className="relative">
            <input type="text" required value={formData.rbd} onChange={handleRbdChange}
              placeholder="ej. 31030"
              className={`w-full pl-7 pr-2 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border ${
                isRbdValid === false ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-slate-300 dark:border-slate-700'
              } rounded-lg outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-slate-400`} />
            <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
          </div>
        </div>
      </div>

      {/* Panel expandible: establecimiento personalizado */}
      {isCustomEstablecimiento && (
        <div className="grid grid-cols-2 gap-2 p-2 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40 rounded-lg animate-fade-in">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5">Nombre Oficial *</label>
            <input type="text" required value={formData.establecimiento} onChange={e => onChange('establecimiento', e.target.value)}
              placeholder="Nombre del establecimiento"
              className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-indigo-300 dark:border-indigo-700 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500/30" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-indigo-400" /> Comuna *
            </label>
            <select value={formData.comuna || 'Santiago'} onChange={e => onChange('comuna', e.target.value)}
              className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500/30">
              {comunasList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Fila 4: Asignatura + Cargo */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-indigo-400" /> Asignatura <span className="text-red-500">*</span>
          </label>
          <select value={formData.asignaturaId || asignaturas[0]?.id || 'asig-1'} onChange={handleAsignaturaChange}
            className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-indigo-400/40 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-medium">
            {asignaturas.map(asig => (
              <option key={asig.id} value={asig.id}>{asig.nombre} ({asig.codigo})</option>
            ))}
          </select>
        </div>
        {showCargoField && (
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5">Cargo</label>
            <input type="text" value={formData.cargo || ''} onChange={e => onChange('cargo', e.target.value)}
              placeholder="ej. Docente de Matemática"
              className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-slate-400" />
          </div>
        )}
      </div>
    </div>
  );
};

