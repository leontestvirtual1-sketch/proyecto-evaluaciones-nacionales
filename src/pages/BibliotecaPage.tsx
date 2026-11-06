import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  BookOpen,
  FileText,
  Video,
  Presentation,
  FolderOpen,
  ExternalLink,
  Eye,
  Star,
  Search,
  Filter,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { MaterialEstudio, TipoMaterial, AsignaturaBiblioteca, ModalVisorData } from '../types/biblioteca';
import bibliotecaDataRaw from '../data/biblioteca_paes.json';

const bibliotecaMateriales: MaterialEstudio[] = bibliotecaDataRaw as MaterialEstudio[];

const DRIVE_FOLDER_OFICIAL_URL = 'https://drive.google.com/drive/folders/1pd6PXvuU87PVfLe0nevk_oWaWXBlVA4k?usp=sharing';
const DRIVE_FOLDER_ID = '1pd6PXvuU87PVfLe0nevk_oWaWXBlVA4k';

const EJES_POR_ASIGNATURA: Record<AsignaturaBiblioteca, string[]> = {
  matematica: ['Números', 'Álgebra y Funciones', 'Geometría', 'Datos y Azar'],
  lenguaje:   ['Comprensión Lectora', 'Vocabulario', 'Textos Literarios', 'Textos No Literarios'],
  historia:   ['Historia de Chile', 'Formación Ciudadana', 'Economía', 'Mundo Global'],
  biologia:   ['Biología Celular', 'Genética y Evolución', 'Fisiología', 'Ecología'],
  fisica:     ['Mecánica', 'Termodinámica', 'Electricidad y Magnetismo', 'Óptica y Ondas'],
  quimica:    ['Materia y sus Transformaciones', 'Reacciones Químicas', 'Química Orgánica', 'Solución y Mezclas'],
  tp:         ['Ciencias para la Vida', 'Tecnología y Sociedad', 'Sistemas de Producción']
};

const ASIGNATURAS_CONFIG: { id: AsignaturaBiblioteca; label: string; icon: string; color: string }[] = [
  { id: 'matematica', label: 'Matemática (M1/M2)', icon: '📐', color: 'from-blue-600 to-indigo-600' },
  { id: 'lenguaje',   label: 'Lenguaje',          icon: '📖', color: 'from-sky-600 to-cyan-600' },
  { id: 'historia',   label: 'Historia y CC.SS.',  icon: '🏛️', color: 'from-amber-600 to-yellow-600' },
  { id: 'biologia',   label: 'Biología',          icon: '🧬', color: 'from-emerald-600 to-teal-600' },
  { id: 'fisica',     label: 'Física',            icon: '⚡', color: 'from-violet-600 to-purple-600' },
  { id: 'quimica',    label: 'Química',           icon: '🧪', color: 'from-pink-600 to-rose-600' },
  { id: 'tp',         label: 'Técnico Profesional', icon: '🔧', color: 'from-slate-600 to-gray-600' },
];

function extraerYoutubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function convertirDriveAEmbed(url: string): string {
  if (url.includes('/folders/')) {
    const mFolder = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (mFolder) return `https://drive.google.com/embeddedfolderview?id=${mFolder[1]}#grid`;
  }
  const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
  const m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m2) return `https://drive.google.com/file/d/${m2[1]}/preview`;
  return url;
}

export const BibliotecaPage: React.FC = () => {
  const [asignatura, setAsignatura] = useState<AsignaturaBiblioteca>('matematica');
  const [eje, setEje] = useState<string>('todos');
  const [tipoFiltro, setTipoFiltro] = useState<'todos' | TipoMaterial>('todos');
  const [busqueda, setBusqueda] = useState<string>('');
  const [soloFavoritos, setSoloFavoritos] = useState<boolean>(false);
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const ITEMS_POR_PAGINA = 24;

  const [favoritos, setFavoritos] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('sysget_biblioteca_favs');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [modalVisor, setModalVisor] = useState<ModalVisorData | null>(null);

  useEffect(() => {
    if (!modalVisor) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalVisor(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalVisor]);

  const toggleFavorito = (id: string) => {
    setFavoritos(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem('sysget_biblioteca_favs', JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleAsignaturaChange = (nuevaAsig: AsignaturaBiblioteca) => {
    setAsignatura(nuevaAsig);
    setEje('todos');
    setPaginaActual(1);
  };

  const handleEjeChange = (nuevoEje: string) => {
    setEje(nuevoEje);
    setPaginaActual(1);
  };

  const ejesDisponibles = EJES_POR_ASIGNATURA[asignatura] || [];

  const materialesFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return bibliotecaMateriales.filter(m => {
      const matchAsig = m.asignatura === asignatura;
      const matchEje = eje === 'todos' || m.eje.toLowerCase() === eje.toLowerCase();
      const matchTipo = tipoFiltro === 'todos' || m.tipo === tipoFiltro;
      const matchFav = !soloFavoritos || favoritos.has(m.id);
      const matchQ =
        !q ||
        m.titulo.toLowerCase().includes(q) ||
        m.eje.toLowerCase().includes(q) ||
        m.descripcion.toLowerCase().includes(q);

      return matchAsig && matchEje && matchTipo && matchFav && matchQ;
    });
  }, [asignatura, eje, tipoFiltro, soloFavoritos, busqueda, favoritos]);

  const totalPaginas = Math.ceil(materialesFiltrados.length / ITEMS_POR_PAGINA) || 1;
  const materialesPaginados = useMemo(() => {
    const start = (paginaActual - 1) * ITEMS_POR_PAGINA;
    return materialesFiltrados.slice(start, start + ITEMS_POR_PAGINA);
  }, [materialesFiltrados, paginaActual]);

  const abrirMaterial = (m: MaterialEstudio) => {
    const url = m.url || '#';

    if (!url || url === '#') {
      abrirCarpetaDriveOficial();
      return;
    }

    // 1. Enlaces institucionales o protegidos
    if (url.includes('uautonoma.cl') || url.includes('ogr.cl')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    // 2. Videos de YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = extraerYoutubeId(url);
      if (videoId) {
        setModalVisor({
          titulo: m.titulo,
          embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
          externalUrl: `https://www.youtube.com/watch?v=${videoId}`,
          tipo: 'video'
        });
        return;
      }
    }

    // 3. Archivos en Google Drive
    if (url.includes('drive.google.com')) {
      setModalVisor({
        titulo: m.titulo,
        embedUrl: convertirDriveAEmbed(url),
        externalUrl: url,
        tipo: 'drive_folder'
      });
      return;
    }

    // 4. PDFs directos
    if (url.toLowerCase().includes('.pdf')) {
      const embedPdfUrl = url.startsWith('http')
        ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`
        : url;
      setModalVisor({
        titulo: m.titulo,
        embedUrl: embedPdfUrl,
        externalUrl: url,
        tipo: 'pdf'
      });
      return;
    }

    // 5. Presentaciones PPT / PPTX
    if (url.toLowerCase().match(/\.pptx?(\?.*)?$/)) {
      const viewerUrl = url.includes('?') ? `${url}&v=sysget2` : `${url}?v=sysget2`;
      setModalVisor({
        titulo: m.titulo,
        embedUrl: `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(viewerUrl)}`,
        externalUrl: url,
        tipo: 'ppt'
      });
      return;
    }

    // 6. Resto: abrir en nueva pestaña
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const abrirCarpetaDriveOficial = () => {
    window.open(DRIVE_FOLDER_OFICIAL_URL, '_blank', 'noopener,noreferrer');
  };

  const renderBadgeTipo = (tipo: TipoMaterial) => {
    switch (tipo) {
      case 'pdf':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <FileText className="w-3 h-3" /> PDF Formulario
          </span>
        );
      case 'ppt':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Presentation className="w-3 h-3" /> PPT Clase
          </span>
        );
      case 'video':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <Video className="w-3 h-3" /> Video Clase
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <BookOpen className="w-3 h-3" /> Ejercitación
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Encabezado Principal */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900/90 to-purple-900/60 border border-indigo-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>526 Recursos de Estudio PAES Oficiales</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              📚 Biblioteca Digital de Estudio
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Formularios oficiales, presentaciones PPT de clases, video-clases y miniensayos
              organizados por ejes temáticos oficiales del DEMRE para preparación integral.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={abrirCarpetaDriveOficial}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              title="Abrir carpeta de respaldo en Google Drive (nueva pestaña)"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Carpeta Oficial Google Drive</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>
            <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
              <div className="text-xs text-slate-400 font-medium">Recursos Totales</div>
              <div className="text-lg font-bold text-indigo-400">{bibliotecaMateriales.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de Asignaturas (Tabs) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {ASIGNATURAS_CONFIG.map(asig => {
          const activa = asignatura === asig.id;
          return (
            <button
              key={asig.id}
              onClick={() => handleAsignaturaChange(asig.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activa
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 border-transparent'
                  : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{asig.icon}</span>
              <span>{asig.label}</span>
            </button>
          );
        })}
      </div>

      {/* Barra de Filtros, Buscador y Ejes */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Buscador */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busqueda}
              onChange={e => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
              placeholder="Buscar por concepto, título de clase, eje o tema..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtros de Tipo y Favoritos */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => { setTipoFiltro('todos'); setPaginaActual(1); }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  tipoFiltro === 'todos'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => { setTipoFiltro('pdf'); setPaginaActual(1); }}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                  tipoFiltro === 'pdf'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-3 h-3" /> PDFs
              </button>
              <button
                onClick={() => { setTipoFiltro('ppt'); setPaginaActual(1); }}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                  tipoFiltro === 'ppt'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Presentation className="w-3 h-3" /> PPTs
              </button>
              <button
                onClick={() => { setTipoFiltro('video'); setPaginaActual(1); }}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                  tipoFiltro === 'video'
                    ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Video className="w-3 h-3" /> Videos
              </button>
            </div>

            <button
              onClick={() => { setSoloFavoritos(!soloFavoritos); setPaginaActual(1); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                soloFavoritos
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-500'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-amber-500'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${soloFavoritos ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>Favoritos</span>
            </button>
          </div>
        </div>

        {/* Chips de Eje Temático DEMRE */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Eje DEMRE:
          </span>
          <button
            onClick={() => handleEjeChange('todos')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              eje === 'todos'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Todos los Ejes
          </button>
          {ejesDisponibles.map(itemEje => {
            const activo = eje.toLowerCase() === itemEje.toLowerCase();
            return (
              <button
                key={itemEje}
                onClick={() => handleEjeChange(itemEje)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activo
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {itemEje}
              </button>
            );
          })}
        </div>
      </div>

      {/* Estado y Contador */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <div>
          Mostrando <strong className="text-slate-800 dark:text-slate-200">{materialesFiltrados.length}</strong> recursos
          {eje !== 'todos' && <span> en el eje <strong className="text-indigo-400">{eje}</strong></span>}
        </div>
        {totalPaginas > 1 && (
          <div>Página {paginaActual} de {totalPaginas}</div>
        )}
      </div>

      {/* Grilla de Recursos */}
      {materialesPaginados.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No se encontraron materiales para los filtros seleccionados
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Prueba cambiando el eje temático, limpiando el texto del buscador o seleccionando otra asignatura.
          </p>
          <button
            onClick={() => {
              setBusqueda('');
              setEje('todos');
              setTipoFiltro('todos');
              setSoloFavoritos(false);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materialesPaginados.map(m => {
            const esFav = favoritos.has(m.id);
            const tieneUrl = Boolean(m.url && m.url !== '#');

            return (
              <div
                key={m.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-sm hover:shadow-md group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-md border border-purple-500/20 truncate">
                      📍 {m.eje}
                    </span>
                    {renderBadgeTipo(m.tipo)}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {m.titulo}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {m.descripcion}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => abrirMaterial(m)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{tieneUrl ? 'Ver en Visor' : 'Explorar en Drive'}</span>
                  </button>

                  {tieneUrl && (
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Abrir directamente en nueva pestaña"
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => toggleFavorito(m.id)}
                    title={esFav ? 'Quitar de favoritos' : 'Marcar como favorito'}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      esFav
                        ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-amber-500'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${esFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300 px-3">
            Página {paginaActual} de {totalPaginas}
          </div>
          <button
            onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
            disabled={paginaActual === totalPaginas}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal Visor Embebido */}
      {modalVisor && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalVisor(null);
          }}
        >
          {/* Botón flotante siempre visible para volver atrás / cerrar */}
          <button
            onClick={() => setModalVisor(null)}
            className="fixed top-4 right-4 z-[110] flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700 shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            title="Volver atrás / Cerrar (Esc)"
          >
            <X size={15} />
            <span>Volver / Cerrar (Esc)</span>
          </button>

          <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Header Modal */}
            <div className="px-5 py-3.5 bg-slate-800/95 border-b border-slate-700/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{modalVisor.titulo}</h3>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span>Visor Integrado SysGet</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {modalVisor.externalUrl && (
                  <a
                    href={modalVisor.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm shadow-indigo-600/30 whitespace-nowrap"
                  >
                    <span>Abrir en Pestaña Nueva</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setModalVisor(null)}
                  className="p-2 rounded-xl bg-slate-700 hover:bg-rose-600 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Cerrar visor"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sub-barra informativa para PDFs */}
            {modalVisor.tipo === 'pdf' && modalVisor.externalUrl && (
              <div className="bg-indigo-950/40 border-b border-indigo-900/40 px-5 py-2 flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  Visualizando mediante Google Docs Viewer.
                </span>
                <a
                  href={modalVisor.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 font-bold underline ml-2 whitespace-nowrap"
                >
                  Descargar o ver PDF directo ↗
                </a>
              </div>
            )}

            {/* Contenido Iframe */}
            <div className="flex-1 bg-black relative">
              <iframe
                src={modalVisor.embedUrl}
                title={modalVisor.titulo}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
