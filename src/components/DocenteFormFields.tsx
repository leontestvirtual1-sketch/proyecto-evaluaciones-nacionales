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
    <div className="space-y-4 text-left">
      {/* Nombres y Apellidos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
            Nombre(s) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={e => onChange('nombre', e.target.value)}
              placeholder="ej. Susana Angélica"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
            Apellido Paterno <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.apellidoPaterno}
            onChange={e => onChange('apellidoPaterno', e.target.value)}
            placeholder="ej. Pizarro"
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
            Apellido Materno <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.apellidoMaterno}
            onChange={e => onChange('apellidoMaterno', e.target.value)}
            placeholder="ej. Valenzuela"
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* RUT y Correo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span>RUT Chileno <span className="text-red-500">*</span></span>
            {isRutValid === true && (
              <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> Válido
              </span>
            )}
            {isRutValid === false && (
              <span className="text-[10px] text-rose-500 font-medium flex items-center gap-0.5">
                <AlertCircle className="w-3 h-3" /> RUT Inválido
              </span>
            )}
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={formData.rut}
              onChange={handleRutChange}
              onBlur={handleRutBlur}
              placeholder="12.345.678-9"
              className={`w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border ${
                isRutValid === false ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-slate-300 dark:border-slate-700'
              } rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400`}
            />
            <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
            Correo Electrónico Institucional <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => onChange('email', e.target.value)}
              placeholder="profesor@colegio.cl"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Establecimiento y RBD */}
      <div className="space-y-2.5 p-3 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-indigo-500" />
            Establecimiento Educacional y RBD <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Seleccionar Colegio
            </label>
            <select
              value={isCustomEstablecimiento ? 'CUSTOM' : (formData.rbd || '')}
              onChange={handleEstablecimientoSelect}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="" disabled>Seleccione un establecimiento...</option>
              {establecimientosList.map(est => (
                <option key={est.rbd} value={est.rbd}>
                  {est.nombre} (RBD: {est.rbd})
                </option>
              ))}
              <option value="CUSTOM">➕ Registrar otro establecimiento...</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>RBD Oficial MINEDUC <span className="text-red-500">*</span></span>
              {isRbdValid === true && (
                <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Válido
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.rbd}
                onChange={handleRbdChange}
                placeholder="ej. 31030 o 99999"
                className={`w-full pl-9 pr-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 text-slate-900 dark:text-white border ${
                  isRbdValid === false ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-slate-300 dark:border-slate-700'
                } rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400`}
              />
              <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {isCustomEstablecimiento && (
          <div className="space-y-2.5 pt-1 border-t border-slate-200 dark:border-slate-800/80 animate-fade-in">
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Nombre Oficial del Establecimiento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.establecimiento}
                onChange={e => onChange('establecimiento', e.target.value)}
                placeholder="ej. Colegio San Francisco de Asís"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-indigo-400/50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-indigo-500" />
                  Comuna (Región Metropolitana) <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.comuna || 'Santiago'}
                  onChange={e => onChange('comuna', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                >
                  <option value="" disabled>Seleccione una comuna...</option>
                  {comunasList.map(comunaName => (
                    <option key={comunaName} value={comunaName}>
                      {comunaName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Dependencia Administrativa
                </label>
                <select
                  value={formData.dependencia || 'Particular Subvencionado'}
                  onChange={e => onChange('dependencia', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="Particular Subvencionado">Particular Subvencionado</option>
                  <option value="Municipal">Municipal / SLEP</option>
                  <option value="Particular Pagado">Particular Pagado</option>
                  <option value="Administración Delegada">Administración Delegada</option>
                </select>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              El RBD, nombre, comuna y dependencia quedarán guardados en la tabla oficial de establecimientos.
            </p>
          </div>
        )}
      </div>

      {/* Especialidad / Asignatura y Cargo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            Especialidad / Asignatura Principal <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.asignaturaId || asignaturas[0]?.id || 'asig-1'}
            onChange={handleAsignaturaChange}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-indigo-500/40 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
          >
            {asignaturas.map(asig => (
              <option key={asig.id} value={asig.id}>
                {asig.nombre} ({asig.codigo})
              </option>
            ))}
          </select>
        </div>

        {showCargoField && (
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
              Cargo o Función
            </label>
            <input
              type="text"
              value={formData.cargo || ''}
              onChange={e => onChange('cargo', e.target.value)}
              placeholder="ej. Docente de Matemática / Jefe UTP"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>
        )}
      </div>
    </div>
  );
};
