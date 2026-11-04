import React, { useState, useMemo } from 'react';
import {
  Download,
  FileText,
  Search,
  ExternalLink,
  Eye,
  Check,
  Copy,
  Terminal,
  BookOpen,
  Key,
  BookmarkCheck,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  X,
  Code,
  Sparkles,
  Info
} from 'lucide-react';
import { DocumentoDemre, TipoDocumentoDemre, MateriaDemre, ModalVisorDemreData } from '../types/demre';
import catalogoHistoricoRaw from '../data/catalogo_historico.json';

const catalogoDocumentos: DocumentoDemre[] = catalogoHistoricoRaw as DocumentoDemre[];

const MATERIA_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  m1: { label: 'Matemática M1', icon: '📐', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  m2: { label: 'Matemática M2', icon: '📐', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  matematica: { label: 'Matemática General', icon: '📐', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  lectora: { label: 'Competencia Lectora', icon: '📖', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  historia: { label: 'Historia y CC.SS.', icon: '🏛️', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  biologia: { label: 'Ciencias - Biología', icon: '🧬', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  quimica: { label: 'Ciencias - Química', icon: '🧪', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
  fisica: { label: 'Ciencias - Física', icon: '⚡', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  tp: { label: 'Ciencias - Técnico Prof.', icon: '🔧', color: 'text-slate-300 bg-slate-500/10 border-slate-500/20' },
  ciencias: { label: 'Ciencias General', icon: '🔬', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
  desconocida: { label: 'Institucional / General', icon: '📄', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
};

function formatTituloAmigable(doc: DocumentoDemre): string {
  const isInvierno = doc.archivo.toLowerCase().includes('invierno');
  const edicion = isInvierno ? 'Invierno' : 'Regular';
  const matInfo = MATERIA_LABELS[doc.materia] || MATERIA_LABELS.desconocida;

  switch (doc.tipo) {
    case 'prueba':
      return `Prueba Oficial PAES ${matInfo.label} (${edicion} ${doc.anio})`;
    case 'clavijero':
      return `Clavijero Oficial ${matInfo.label} (${edicion} ${doc.anio})`;
    case 'temario':
      return `Temario y Especificaciones ${matInfo.label} (Admisión ${doc.anio})`;
    case 'revista':
      return `Publicación / Revista Oficial DEMRE (${doc.anio})`;
    default:
      return doc.archivo.replace('.pdf', '');
  }
}

export const DescargaDemrePage: React.FC = () => {
  const [tipoFiltro, setTipoFiltro] = useState<'todos' | TipoDocumentoDemre>('todos');
  const [anioFiltro, setAnioFiltro] = useState<string>('todos');
  const [materiaFiltro, setMateriaFiltro] = useState<string>('todas');
  const [busqueda, setBusqueda] = useState<string>('');
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [modalVisor, setModalVisor] = useState<ModalVisorDemreData | null>(null);
  const [modalScriptsOpen, setModalScriptsOpen] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const ITEMS_POR_PAGINA = 24;

  // Estadísticas del catálogo
  const stats = useMemo(() => {
    let pruebas = 0;
    let clavijeros = 0;
    let temarios = 0;
    let revistas = 0;
    catalogoDocumentos.forEach(d => {
      if (d.tipo === 'prueba') pruebas++;
      else if (d.tipo === 'clavijero') clavijeros++;
      else if (d.tipo === 'temario') temarios++;
      else if (d.tipo === 'revista') revistas++;
    });
    return {
      total: catalogoDocumentos.length,
      pruebas,
      clavijeros,
      temarios,
      revistas
    };
  }, []);

  // Filtrado reactivo
  const documentosFiltrados = useMemo(() => {
    return catalogoDocumentos.filter(doc => {
      // Filtro tipo
      if (tipoFiltro !== 'todos' && doc.tipo !== tipoFiltro) return false;
      // Filtro año
      if (anioFiltro !== 'todos' && doc.anio.toString() !== anioFiltro) return false;
      // Filtro materia
      if (materiaFiltro !== 'todas' && doc.materia !== materiaFiltro) return false;
      // Búsqueda libre
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase().trim();
        const titulo = formatTituloAmigable(doc).toLowerCase();
        const archivo = doc.archivo.toLowerCase();
        const mat = (MATERIA_LABELS[doc.materia]?.label || '').toLowerCase();
        const anio = doc.anio.toString();
        if (!titulo.includes(q) && !archivo.includes(q) && !mat.includes(q) && !anio.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [tipoFiltro, anioFiltro, materiaFiltro, busqueda]);

  // Paginación
  const totalPaginas = Math.ceil(documentosFiltrados.length / ITEMS_POR_PAGINA) || 1;
  const documentosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    return documentosFiltrados.slice(inicio, inicio + ITEMS_POR_PAGINA);
  }, [documentosFiltrados, paginaActual]);

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in text-left pb-12">
      {/* ── HEADER PRINCIPAL ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 border border-indigo-500/20 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-300">
              <Download className="w-3.5 h-3.5" />
              <span>Repositorio Indexado de Documentos Oficiales</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>📥 Descargas de Pruebas Oficiales DEMRE</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Catálogo histórico con <strong>185 documentos oficiales</strong> catalogados entre los años 2023 y 2026.
              Acceso a pruebas oficiales PAES Regular e Invierno, clavijeros de respuestas, temarios de admisión y motor algorítmico de mezcla.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setModalScriptsOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-sm font-semibold transition-all shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-500/40"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Scripts & Motor DEMRE</span>
            </button>
            <a
              href="https://demre.cl/publicaciones/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-600/30 hover:scale-[1.02]"
            >
              <span>Portal DEMRE Oficial</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* ── STATS KPI CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-700/50">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Total Catálogo</span>
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">{stats.total}</div>
            <div className="text-[11px] text-slate-400">Archivos oficiales</div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Pruebas PAES</span>
              <BookOpen className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">{stats.pruebas}</div>
            <div className="text-[11px] text-cyan-300/80">Regular e Invierno</div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Clavijeros Oficiales</span>
              <Key className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">{stats.clavijeros}</div>
            <div className="text-[11px] text-emerald-300/80">Pautas y claves</div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Temarios</span>
              <BookmarkCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">{stats.temarios}</div>
            <div className="text-[11px] text-amber-300/80">Tablas de especif.</div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5 backdrop-blur-sm col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Revistas DEMRE</span>
              <Newspaper className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">{stats.revistas}</div>
            <div className="text-[11px] text-purple-300/80">Ediciones históricas</div>
          </div>
        </div>
      </div>

      {/* ── BARRA DE BÚSQUEDA Y FILTROS ── */}
      <div className="space-y-4">
        {/* Fila 1: Buscador y Filtro por Tipo */}
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
              placeholder="Buscar por prueba, clavijero, año, asignatura o nombre de archivo..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filtro por Tipo */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => { setTipoFiltro('todos'); setPaginaActual(1); }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                tipoFiltro === 'todos'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Todos ({stats.total})
            </button>
            <button
              onClick={() => { setTipoFiltro('prueba'); setPaginaActual(1); }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                tipoFiltro === 'prueba'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>📝 Pruebas</span>
              <span className="opacity-80">({stats.pruebas})</span>
            </button>
            <button
              onClick={() => { setTipoFiltro('clavijero'); setPaginaActual(1); }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                tipoFiltro === 'clavijero'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>🔑 Clavijeros</span>
              <span className="opacity-80">({stats.clavijeros})</span>
            </button>
            <button
              onClick={() => { setTipoFiltro('temario'); setPaginaActual(1); }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                tipoFiltro === 'temario'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>📋 Temarios</span>
              <span className="opacity-80">({stats.temarios})</span>
            </button>
            <button
              onClick={() => { setTipoFiltro('revista'); setPaginaActual(1); }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                tipoFiltro === 'revista'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>📰 Revistas</span>
              <span className="opacity-80">({stats.revistas})</span>
            </button>
          </div>
        </div>

        {/* Fila 2: Filtro por Año y Asignatura */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Año Admisión:</span>
            {['todos', '2026', '2025', '2024', '2023'].map(a => (
              <button
                key={a}
                onClick={() => { setAnioFiltro(a); setPaginaActual(1); }}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  anioFiltro === a
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/40'
                }`}
              >
                {a === 'todos' ? 'Todos los Años' : a}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto max-w-full">
            <span className="text-slate-400 font-medium whitespace-nowrap">Área:</span>
            <select
              value={materiaFiltro}
              onChange={(e) => { setMateriaFiltro(e.target.value); setPaginaActual(1); }}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500"
            >
              <option value="todas">Todas las Áreas</option>
              <option value="m1">Matemática M1</option>
              <option value="m2">Matemática M2</option>
              <option value="lectora">Competencia Lectora</option>
              <option value="historia">Historia y CC.SS.</option>
              <option value="biologia">Ciencias - Biología</option>
              <option value="fisica">Ciencias - Física</option>
              <option value="quimica">Ciencias - Química</option>
              <option value="tp">Ciencias - Técnico Profesional</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── LISTADO DE RESULTADOS ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
          <span>Mostrando <strong>{documentosFiltrados.length}</strong> documentos</span>
          <span>Página {paginaActual} de {totalPaginas}</span>
        </div>

        {documentosFiltrados.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <FileText className="w-12 h-12 text-slate-600 mx-auto" />
            <div className="text-slate-300 font-semibold text-base">No se encontraron documentos</div>
            <p className="text-slate-500 text-xs max-w-md mx-auto">
              No hay archivos en el catálogo que coincidan con los filtros seleccionados. Intenta restablecer los filtros de búsqueda.
            </p>
            <button
              onClick={() => {
                setTipoFiltro('todos');
                setAnioFiltro('todos');
                setMateriaFiltro('todas');
                setBusqueda('');
                setPaginaActual(1);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-indigo-400 font-semibold"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentosPaginados.map((doc, idx) => {
              const titulo = formatTituloAmigable(doc);
              const matInfo = MATERIA_LABELS[doc.materia] || MATERIA_LABELS.desconocida;
              const isInvierno = doc.archivo.toLowerCase().includes('invierno');

              let tipoBadgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
              let tipoLabel = 'Prueba Oficial';
              if (doc.tipo === 'clavijero') {
                tipoBadgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                tipoLabel = 'Clavijero';
              } else if (doc.tipo === 'temario') {
                tipoBadgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                tipoLabel = 'Temario';
              } else if (doc.tipo === 'revista') {
                tipoBadgeColor = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
                tipoLabel = 'Revista DEMRE';
              }

              return (
                <div
                  key={`${doc.archivo}-${idx}`}
                  className="group relative bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5"
                >
                  <div className="space-y-3">
                    {/* Tags superiores */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${tipoBadgeColor}`}>
                          {tipoLabel}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          {doc.anio}
                        </span>
                        {isInvierno && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                            Invierno
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleCopyLink(doc.url)}
                        title="Copiar enlace oficial"
                        className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        {copiedUrl === doc.url ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Título del documento */}
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                        {titulo}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono mt-1 truncate" title={doc.archivo}>
                        {doc.archivo}
                      </p>
                    </div>

                    {/* Área / Materia */}
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border bg-slate-800/60 border-slate-700/60 text-slate-300">
                      <span>{matInfo.icon}</span>
                      <span>{matInfo.label}</span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => setModalVisor({
                        titulo,
                        url: doc.url,
                        tipo: doc.tipo,
                        anio: doc.anio,
                        materia: matInfo.label
                      })}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all hover:text-white"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Ver en Visor</span>
                    </button>

                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 text-blue-300 hover:text-white text-xs font-semibold transition-all shadow-sm"
                      title="Descargar documento directamente desde DEMRE"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── PAGINACIÓN ── */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
              disabled={paginaActual === 1}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => {
              if (
                p === 1 ||
                p === totalPaginas ||
                (p >= paginaActual - 1 && p <= paginaActual + 1)
              ) {
                return (
                  <button
                    key={p}
                    onClick={() => setPaginaActual(p)}
                    className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all ${
                      paginaActual === p
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                );
              }
              if (p === paginaActual - 2 || p === paginaActual + 2) {
                return <span key={p} className="text-slate-600 text-xs">...</span>;
              }
              return null;
            })}

            <button
              onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
              disabled={paginaActual === totalPaginas}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ── MODAL VISOR INTEGRADO ── */}
      {modalVisor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-5xl h-[88vh] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            {/* Cabecera del Visor */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70">
              <div className="flex items-center gap-3 truncate mr-4">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h3 className="text-sm font-bold text-white truncate">{modalVisor.titulo}</h3>
                  <p className="text-xs text-slate-400 truncate">{modalVisor.url}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={modalVisor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
                >
                  <span>Abrir en Pestaña Nueva</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setModalVisor(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenedor del Visor (Google Docs Viewer / Native PDF) */}
            <div className="flex-1 bg-slate-950 relative">
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(modalVisor.url)}&embedded=true`}
                className="w-full h-full border-0"
                title={modalVisor.titulo}
                allow="fullscreen"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL SCRIPTS Y AUTOMATIZACIÓN DEMRE ── */}
      {modalScriptsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[88vh] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Scripts & Motor de Extracción DEMRE</h3>
                  <p className="text-xs text-slate-400">Herramientas automatizadas del sistema SysGet Saber</p>
                </div>
              </div>

              <button
                onClick={() => setModalScriptsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                  <Info className="w-4 h-4" />
                  <span>Arquitectura de Automatización de Ensayos</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  SysGet Saber cuenta con un pipeline completo en Python para rastrear las publicaciones del DEMRE,
                  descargar los instrumentos oficiales concurrentemente y ensamblar nuevos ensayos combinatorios
                  sin solapamiento de preguntas.
                </p>
              </div>

              {/* Script 1: scrape_paes.py */}
              <div className="space-y-2 border border-slate-800 rounded-xl p-4 bg-slate-950/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Code className="w-4 h-4 text-cyan-400" />
                    <span>1. Scraper Oficial DEMRE (<code>scrape_paes.py</code>)</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Extracción Web
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Rastrea y extrae enlaces directos a PDFs desde <code>https://demre.cl/publicaciones/</code> para los años 2022 al 2026.
                  Clasifica automáticamente cada recurso en <strong>prueba</strong>, <strong>clavijero</strong>, <strong>temario</strong> o <strong>revista</strong>, detectando la asignatura oficial.
                </p>
                <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs text-slate-300 overflow-x-auto border border-slate-800">
                  python scripts/demre_tools/scrape_paes.py
                </div>
              </div>

              {/* Script 2: descargar_paes.py */}
              <div className="space-y-2 border border-slate-800 rounded-xl p-4 bg-slate-950/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>2. Descargador Masivo de PDFs (<code>descargar_paes.py</code>)</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Descarga Paralela
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Lee el archivo <code>catalogo_historico.json</code> y descarga masivamente todos los documentos oficiales del DEMRE
                  hacia la carpeta local del proyecto con barras de progreso y verificación de integridad.
                </p>
                <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs text-slate-300 overflow-x-auto border border-slate-800">
                  python scripts/demre_tools/descargar_paes.py
                </div>
              </div>

              {/* Script 3: mezclar_paes.py */}
              <div className="space-y-2 border border-slate-800 rounded-xl p-4 bg-slate-950/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>3. Motor Algorítmico de Ensayos (<code>mezclar_paes.py</code>)</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Generador PDF
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Motor de generación combinatoria que extrae preguntas usando <strong>PyMuPDF</strong> y <strong>ReportLab</strong>,
                  verificando que ninguna pregunta se repita entre ensayos mediante el registro persistente <code>preguntas_usadas.json</code>.
                </p>
                <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs text-slate-300 overflow-x-auto border border-slate-800">
                  python scripts/demre_tools/mezclar_paes.py --materia m1 --cantidad 65 --output ensayo_m1_nuevo.pdf
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex justify-end">
              <button
                onClick={() => setModalScriptsOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
