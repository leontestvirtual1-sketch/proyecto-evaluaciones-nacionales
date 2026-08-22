import React, { useState } from 'react';
import { Pregunta, Asignatura, EjeTematico, Habilidad, TipoPregunta, DificultadPregunta, Alternativa } from '../types';
import { X, HelpCircle, CheckCircle2, Plus, Trash2, BookOpen, Layers, Sparkles } from 'lucide-react';

interface PreguntaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pregunta: Pregunta) => void;
  editPregunta?: Pregunta | null;
  initialNivel?: string;
  asignaturas: Asignatura[];
  ejes: EjeTematico[];
  habilidades: Habilidad[];
}

export const PreguntaFormModal: React.FC<PreguntaFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editPregunta,
  initialNivel,
  asignaturas,
  ejes,
  habilidades,
}) => {
  const [asignaturaId, setAsignaturaId] = useState<string>(
    editPregunta?.asignaturaId || asignaturas[0]?.id || 'asig-1'
  );
  const [ejeTematicoId, setEjeTematicoId] = useState<string>(
    editPregunta?.ejeTematicoId || ejes[0]?.id || 'eje-mat-1'
  );
  const [habilidadId, setHabilidadId] = useState<string>(
    editPregunta?.habilidadId || habilidades[0]?.id || 'hab-mat-2'
  );
  const [tipo, setTipo] = useState<TipoPregunta>(
    editPregunta?.tipo || 'seleccion_multiple'
  );
  const [nivel, setNivel] = useState<string>(
    editPregunta?.nivel || initialNivel || '2° Medio'
  );
  const [dificultad, setDificultad] = useState<DificultadPregunta>(
    editPregunta?.dificultad || 'media'
  );
  const [enunciado, setEnunciado] = useState<string>(
    editPregunta?.enunciado || ''
  );
  const [puntaje, setPuntaje] = useState<number>(
    editPregunta?.puntaje || 1
  );
  const [fuente, setFuente] = useState<string>(
    editPregunta?.fuente || 'Elaboración Docente'
  );
  const [respuestaCorrecta, setRespuestaCorrecta] = useState<string>(
    editPregunta?.respuestaCorrecta || 'A'
  );

  const [alternativas, setAlternativas] = useState<Alternativa[]>(
    editPregunta?.alternativas.length
      ? editPregunta.alternativas
      : [
          { letra: 'A', texto: '', es_correcta: true },
          { letra: 'B', texto: '', es_correcta: false },
          { letra: 'C', texto: '', es_correcta: false },
          { letra: 'D', texto: '', es_correcta: false },
        ]
  );

  const [errorMsg, setErrorMsg] = useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      setAsignaturaId(editPregunta?.asignaturaId || asignaturas[0]?.id || 'asig-1');
      setEjeTematicoId(editPregunta?.ejeTematicoId || ejes[0]?.id || 'eje-mat-1');
      setHabilidadId(editPregunta?.habilidadId || habilidades[0]?.id || 'hab-mat-2');
      setTipo(editPregunta?.tipo || 'seleccion_multiple');
      setNivel(editPregunta?.nivel || initialNivel || '4° básico');
      setDificultad(editPregunta?.dificultad || 'media');
      setEnunciado(editPregunta?.enunciado || '');
      setPuntaje(editPregunta?.puntaje || 1);
      setFuente(editPregunta?.fuente || 'Elaboración Docente');
      setRespuestaCorrecta(editPregunta?.respuestaCorrecta || 'A');
      setAlternativas(
        editPregunta?.alternativas && editPregunta.alternativas.length > 0
          ? editPregunta.alternativas
          : [
              { letra: 'A', texto: '', es_correcta: true },
              { letra: 'B', texto: '', es_correcta: false },
              { letra: 'C', texto: '', es_correcta: false },
              { letra: 'D', texto: '', es_correcta: false },
            ]
      );
      setErrorMsg('');
    }
  }, [isOpen, editPregunta, initialNivel, asignaturas, ejes, habilidades]);

  if (!isOpen) return null;

  const filteredEjes = ejes.filter(e => e.asignaturaId === asignaturaId || !e.asignaturaId);
  const filteredHabilidades = habilidades.filter(h => h.asignaturaId === asignaturaId || !h.asignaturaId);

  const handleAlternativaChange = (index: number, texto: string) => {
    const updated = [...alternativas];
    updated[index].texto = texto;
    setAlternativas(updated);
  };

  const handleSetCorrecta = (letra: string) => {
    setRespuestaCorrecta(letra);
    setAlternativas(prev =>
      prev.map(a => ({
        ...a,
        es_correcta: a.letra === letra,
      }))
    );
  };

  const handleSave = () => {
    setErrorMsg('');
    if (!enunciado.trim()) {
      setErrorMsg('El enunciado de la pregunta es obligatorio.');
      return;
    }

    if (tipo === 'seleccion_multiple') {
      const vacias = alternativas.some(a => !a.texto.trim());
      if (vacias) {
        setErrorMsg('Debes completar el texto de las 4 alternativas.');
        return;
      }
    }

    const nuevaPregunta: Pregunta = {
      id: editPregunta?.id || `preg-${Date.now()}`,
      asignaturaId,
      ejeTematicoId,
      habilidadId,
      tipo,
      nivel,
      dificultad,
      enunciado,
      alternativas: tipo === 'seleccion_multiple' ? alternativas : [],
      respuestaCorrecta: tipo === 'seleccion_multiple' ? respuestaCorrecta : null,
      puntaje,
      fuente,
    };

    onSave(nuevaPregunta);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editPregunta ? 'Editar Pregunta del Banco' : 'Crear Nueva Pregunta'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Categorización por taxonomía curricular Mineduc / DEMRE
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Asignatura + Nivel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Asignatura
              </label>
              <select
                value={asignaturaId}
                onChange={e => setAsignaturaId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {asignaturas.map(a => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Nivel Escolar
              </label>
              <select
                value={nivel}
                onChange={e => setNivel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="2° Medio">2° Medio (SIMCE)</option>
                <option value="8° básico">8° Básico (SIMCE)</option>
                <option value="6° básico">6° Básico (SIMCE)</option>
                <option value="4° básico">4° Básico (SIMCE)</option>
                <option value="4° medio">4° Medio / PAES</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Tipo de Ítem
              </label>
              <select
                value={tipo}
                onChange={e => setTipo(e.target.value as TipoPregunta)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold"
              >
                <option value="seleccion_multiple">Selección Múltiple (A, B, C, D)</option>
                <option value="desarrollo">Desarrollo Escrito / Respuesta Abierta</option>
              </select>
            </div>
          </div>

          {/* Eje + Habilidad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Eje Temático
              </label>
              <select
                value={ejeTematicoId}
                onChange={e => setEjeTematicoId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {filteredEjes.map(e => (
                  <option key={e.id} value={e.id}>{e.nombre} ({e.codigo})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Habilidad Cognitiva
              </label>
              <select
                value={habilidadId}
                onChange={e => setHabilidadId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {filteredHabilidades.map(h => (
                  <option key={h.id} value={h.id}>{h.nombre} ({h.codigo})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dificultad + Fuente + Puntaje */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Dificultad
              </label>
              <select
                value={dificultad}
                onChange={e => setDificultad(e.target.value as DificultadPregunta)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Fuente / Origen
              </label>
              <input
                type="text"
                value={fuente}
                onChange={e => setFuente(e.target.value)}
                placeholder="Ej: Liberada Oficial / Elaboración Docente"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Puntaje Asignado
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={puntaje}
                onChange={e => setPuntaje(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Enunciado */}
          <div>
            <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
              Enunciado de la Pregunta
            </label>
            <textarea
              rows={3}
              value={enunciado}
              onChange={e => setEnunciado(e.target.value)}
              placeholder="Escribe aquí el texto principal de la pregunta o el problema..."
              className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Alternativas if seleccion_multiple */}
          {tipo === 'seleccion_multiple' && (
            <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Alternativas (Selecciona el botón de la respuesta correcta)
                </span>
              </div>

              <div className="space-y-2">
                {alternativas.map((alt, idx) => (
                  <div
                    key={alt.letra}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                      alt.letra === respuestaCorrecta
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSetCorrecta(alt.letra)}
                      className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                        alt.letra === respuestaCorrecta
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-500/20'
                      }`}
                      title="Marcar como respuesta correcta"
                    >
                      {alt.letra}
                    </button>

                    <input
                      type="text"
                      value={alt.texto}
                      onChange={e => handleAlternativaChange(idx, e.target.value)}
                      placeholder={`Texto para alternativa ${alt.letra}...`}
                      className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />

                    {alt.letra === respuestaCorrecta && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 pr-2">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correcta
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all"
          >
            <span>{editPregunta ? 'Guardar Cambios' : 'Crear Pregunta'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
