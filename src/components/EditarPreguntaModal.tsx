import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  Upload,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  Loader2,
  Plus,
  Minus,
} from 'lucide-react';
import { Pregunta, Alternativa, DificultadPregunta } from '../types';
import { EnunciadoRenderer } from './common/EnunciadoRenderer';
import { uploadPreguntaImage, resolveImageUrl } from '../lib/storage';
import { supabase } from '../lib/supabaseClient';

interface EditarPreguntaModalProps {
  isOpen: boolean;
  onClose: () => void;
  pregunta: Pregunta | null;
  onSaveSuccess: (preguntaActualizada: Pregunta) => void;
  subfolder?: string;
}

export const EditarPreguntaModal: React.FC<EditarPreguntaModalProps> = ({
  isOpen,
  onClose,
  pregunta,
  onSaveSuccess,
  subfolder = 'general',
}) => {
  const [enunciado, setEnunciado] = useState('');
  const [imagenUrl, setImagenUrl] = useState<string | undefined>('');
  const [alternativas, setAlternativas] = useState<Alternativa[]>([]);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState<string>('A');
  const [dificultad, setDificultad] = useState<DificultadPregunta>('media');
  const [puntaje, setPuntaje] = useState<number>(1);
  const [vistaPrevia, setVistaPrevia] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImg, setIsUploadingImg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen || !pregunta) return;
    setEnunciado(pregunta.enunciado || '');
    setImagenUrl(pregunta.imagenUrl || '');
    
    // Normalizar alternativas
    const alts = (pregunta.alternativas && pregunta.alternativas.length > 0)
      ? pregunta.alternativas.map((a) => ({ ...a }))
      : [
          { letra: 'A', texto: '', es_correcta: pregunta.respuestaCorrecta === 'A' },
          { letra: 'B', texto: '', es_correcta: pregunta.respuestaCorrecta === 'B' },
          { letra: 'C', texto: '', es_correcta: pregunta.respuestaCorrecta === 'C' },
          { letra: 'D', texto: '', es_correcta: pregunta.respuestaCorrecta === 'D' },
        ];
    setAlternativas(alts);
    setRespuestaCorrecta(pregunta.respuestaCorrecta || 'A');
    setDificultad(pregunta.dificultad || 'media');
    setPuntaje(pregunta.puntaje || 1);
    setVistaPrevia(false);
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [isOpen, pregunta]);

  if (!isOpen || !pregunta) return null;

  // Manejar cambio de texto en una alternativa
  const handleAlternativaTextChange = (letra: string, texto: string) => {
    setAlternativas((prev) =>
      prev.map((a) => (a.letra === letra ? { ...a, texto } : a))
    );
  };

  // Marcar clave correcta
  const handleSetCorrecta = (letra: string) => {
    setRespuestaCorrecta(letra);
    setAlternativas((prev) =>
      prev.map((a) => ({
        ...a,
        es_correcta: a.letra === letra,
      }))
    );
  };

  // Agregar alternativa E
  const handleAddAlternativa = () => {
    if (alternativas.length >= 5) return;
    const letras = ['A', 'B', 'C', 'D', 'E'];
    const nextLetra = letras[alternativas.length];
    setAlternativas((prev) => [
      ...prev,
      { letra: nextLetra, texto: '', es_correcta: false },
    ]);
  };

  // Quitar última alternativa (mínimo 2)
  const handleRemoveAlternativa = () => {
    if (alternativas.length <= 2) return;
    const lastAlt = alternativas[alternativas.length - 1];
    if (lastAlt.letra === respuestaCorrecta) {
      setRespuestaCorrecta(alternativas[0].letra);
    }
    setAlternativas((prev) => prev.slice(0, -1));
  };

  // Subir imagen a Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP).');
      return;
    }

    setIsUploadingImg(true);
    setErrorMsg(null);

    const folder = subfolder || 'evaluaciones';
    const res = await uploadPreguntaImage(file, folder);

    setIsUploadingImg(false);
    if (res.success && res.url) {
      setImagenUrl(res.url);
      setSuccessMsg('Imagen subida correctamente.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } else {
      setErrorMsg(res.error || 'Error al subir la imagen a Supabase Storage.');
    }
  };

  // Quitar imagen
  const handleRemoveImage = () => {
    setImagenUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Guardar cambios en Supabase
  const handleSave = async () => {
    if (!enunciado.trim()) {
      setErrorMsg('El enunciado no puede estar vacío.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    // Preparar objeto de alternativas actualizado
    const altsPayload = alternativas.map((a) => ({
      letra: a.letra,
      texto: a.texto.trim(),
      es_correcta: a.letra === respuestaCorrecta,
    }));

    try {
      const { error: updateError } = await supabase
        .from('preguntas')
        .update({
          enunciado: enunciado.trim(),
          imagen_url: imagenUrl?.trim() || null,
          alternativas: altsPayload,
          respuesta_correcta: respuestaCorrecta,
          dificultad: dificultad,
          puntaje: Number(puntaje) || 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', pregunta.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      const preguntaActualizada: Pregunta = {
        ...pregunta,
        enunciado: enunciado.trim(),
        imagenUrl: imagenUrl?.trim() || undefined,
        alternativas: altsPayload,
        respuestaCorrecta: respuestaCorrecta,
        dificultad: dificultad,
        puntaje: Number(puntaje) || 1,
      };

      setSuccessMsg('Pregunta actualizada exitosamente en Supabase.');
      setTimeout(() => {
        onSaveSuccess(preguntaActualizada);
        onClose();
      }, 700);
    } catch (err: any) {
      console.error('Error guardando pregunta:', err);
      setErrorMsg(err.message || 'Error al guardar los cambios en la base de datos.');
    } finally {
      setIsSaving(false);
    }
  };

  // Insertar snippets de Markdown en el cursor del textarea
  const insertSnippet = (prefix: string, suffix: string = '') => {
    setEnunciado((prev) => `${prev} ${prefix}${suffix}`);
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-editar-pregunta-title"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className="px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Edit3 size={18} />
            </div>
            <div>
              <h3
                id="modal-editar-pregunta-title"
                className="text-base font-bold text-white leading-tight"
              >
                Editar Pregunta
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                ID: {pregunta.id} · {pregunta.nivel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setVistaPrevia(!vistaPrevia)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                vistaPrevia
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Alternar vista previa en vivo"
            >
              <Eye size={14} />
              <span>{vistaPrevia ? 'Modo Edición' : 'Vista Previa'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── MENSAJES DE ALERTA / ÉXITO ──────────────────────────────────── */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ── CUERPO SCROLLABLE ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {vistaPrevia ? (
            /* ── MODO VISTA PREVIA ── */
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Previsualización en Vivo
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Dificultad: <strong className="text-white capitalize">{dificultad}</strong> · Clave:{' '}
                  <strong className="text-emerald-400">{respuestaCorrecta}</strong>
                </span>
              </div>

              {/* Enunciado */}
              <div className="text-sm text-slate-100 leading-relaxed">
                <EnunciadoRenderer content={enunciado} />
              </div>

              {/* Imagen */}
              {imagenUrl && (
                <div className="flex justify-center py-2">
                  <div className="bg-white rounded-xl shadow-md border border-slate-300 p-3 max-w-md mx-auto">
                    <img
                      src={resolveImageUrl(imagenUrl)}
                      alt="Figura pedagógica"
                      className="max-h-56 w-auto object-contain rounded"
                    />
                  </div>
                </div>
              )}

              {/* Alternativas */}
              <div className="space-y-2 pt-2">
                {alternativas.map((alt) => {
                  const isCorrect = alt.letra === respuestaCorrecta;
                  return (
                    <div
                      key={alt.letra}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                        isCorrect
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                          : 'bg-slate-900/50 border-slate-700/60 text-slate-300'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 mt-0.5 ${
                          isCorrect
                            ? 'bg-emerald-500 text-white shadow shadow-emerald-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-600'
                        }`}
                      >
                        {alt.letra}
                      </span>
                      <div className="text-sm flex-1 leading-snug pt-0.5">
                        <EnunciadoRenderer content={alt.texto || `(Opción ${alt.letra})`} />
                      </div>
                      {isCorrect && (
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ── MODO EDICIÓN ── */
            <>
              {/* 1. Enunciado */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Enunciado de la Pregunta (Markdown / Fórmulas)
                  </label>
                  {/* Snippets rápidos */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => insertSnippet('**', '**')}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold border border-slate-700"
                      title="Negrita"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('*', '*')}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] italic border border-slate-700"
                      title="Cursiva"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('$', '$')}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono border border-slate-700"
                      title="Fórmula matemática inline"
                    >
                      $x$
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('\n| Columna 1 | Columna 2 |\n|---|---|\n| Dato 1 | Dato 2 |\n')}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700"
                      title="Insertar Tabla Markdown"
                    >
                      Tabla
                    </button>
                  </div>
                </div>
                <textarea
                  value={enunciado}
                  onChange={(e) => setEnunciado(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-sans leading-relaxed transition-all placeholder:text-slate-500"
                  placeholder="Escribe el enunciado de la pregunta aquí... Usa **negrita**, $fórmulas$ y tablas | col1 | col2 |"
                />
              </div>

              {/* 2. Gestor de Imagen Pedagógica */}
              <div className="space-y-3 p-4 bg-slate-800/50 border border-slate-700/60 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-indigo-400" />
                    Figura Pedagógica / Diagrama Adjunto
                  </span>
                  {imagenUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Trash2 size={12} />
                      Quitar Imagen
                    </button>
                  )}
                </div>

                {imagenUrl ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/60 border border-slate-700 p-3 rounded-xl">
                    <div className="bg-white rounded-lg p-2 max-w-[180px] max-h-32 flex items-center justify-center overflow-hidden">
                      <img
                        src={resolveImageUrl(imagenUrl)}
                        alt="Previsualización"
                        className="max-h-28 w-auto object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <p className="text-xs text-slate-400 truncate font-mono">
                        URL: {imagenUrl}
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingImg}
                          className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
                        >
                          {isUploadingImg ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Upload size={13} />
                          )}
                          <span>Reemplazar Archivo</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImg}
                      className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-dashed border-slate-600 hover:border-indigo-500 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      {isUploadingImg ? (
                        <Loader2 size={14} className="animate-spin text-indigo-400" />
                      ) : (
                        <Upload size={14} className="text-indigo-400" />
                      )}
                      <span>Subir Imagen (PNG / JPG)</span>
                    </button>
                    <span className="text-xs text-slate-500">
                      O pega una URL directa:
                    </span>
                    <input
                      type="text"
                      placeholder="https://... o /preguntas/..."
                      value={imagenUrl || ''}
                      onChange={(e) => setImagenUrl(e.target.value)}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {/* Input de archivo oculto */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
              </div>

              {/* 3. Alternativas de Selección */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Alternativas (Marca el botón circular verde para la Clave Correcta)
                  </label>
                  <div className="flex items-center gap-1.5">
                    {alternativas.length < 5 && (
                      <button
                        type="button"
                        onClick={handleAddAlternativa}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1"
                        title="Agregar alternativa E"
                      >
                        <Plus size={12} />
                        Opción E
                      </button>
                    )}
                    {alternativas.length > 2 && (
                      <button
                        type="button"
                        onClick={handleRemoveAlternativa}
                        className="px-2 py-1 bg-slate-800 hover:bg-red-900/30 border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-300 rounded-lg text-xs font-semibold flex items-center gap-1"
                        title="Quitar última alternativa"
                      >
                        <Minus size={12} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2.5">
                  {alternativas.map((alt) => {
                    const isCorrect = alt.letra === respuestaCorrecta;
                    return (
                      <div
                        key={alt.letra}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                          isCorrect
                            ? 'bg-emerald-950/20 border-emerald-500/50'
                            : 'bg-slate-800/40 border-slate-700'
                        }`}
                      >
                        {/* Botón de Clave Correcta */}
                        <button
                          type="button"
                          onClick={() => handleSetCorrecta(alt.letra)}
                          className={`w-8 h-8 rounded-lg text-xs font-black flex items-center justify-center shrink-0 transition-all ${
                            isCorrect
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400'
                              : 'bg-slate-800 text-slate-400 border border-slate-600 hover:bg-slate-700 hover:text-white'
                          }`}
                          title={`Marcar ${alt.letra} como respuesta correcta`}
                        >
                          {alt.letra}
                        </button>

                        {/* Input de Texto de la Alternativa */}
                        <input
                          type="text"
                          value={alt.texto}
                          onChange={(e) =>
                            handleAlternativaTextChange(alt.letra, e.target.value)
                          }
                          placeholder={`Texto de la alternativa ${alt.letra}... (ej: 180, x + 2, etc.)`}
                          className="flex-1 bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500"
                        />

                        {isCorrect && (
                          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md shrink-0 border border-emerald-500/20">
                            ✓ Correcta
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Metadatos (Dificultad y Puntaje) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-800/30 border border-slate-700/60 rounded-xl">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Nivel de Dificultad
                  </label>
                  <select
                    value={dificultad}
                    onChange={(e) => setDificultad(e.target.value as DificultadPregunta)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Puntaje asignado
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={puntaje}
                    onChange={(e) => setPuntaje(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── FOOTER CON ACCIONES ─────────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isUploadingImg}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Guardando en Supabase...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarPreguntaModal;
