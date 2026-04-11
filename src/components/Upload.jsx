import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Files,
  ImagePlus,
  LibraryBig,
  Link,
  Music4,
  Send,
  UploadCloud,
} from "lucide-react";
import { importSongFromUrl, uploadSong, uploadSongsBulk } from "../services/api";

const baseField = "ds-input w-full px-4 py-3 text-sm sm:px-5 sm:py-3.5";

const modeOptions = [
  { id: "single", label: "Una pista", icon: Music4 },
  { id: "bulk", label: "Carga masiva", icon: LibraryBig },
  { id: "url", label: "Desde hosting", icon: Link },
];

function Upload({ onUpload, onSuccess, compact = false }) {
  const [mode, setMode] = useState("single");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [audio, setAudio] = useState(null);
  const [audios, setAudios] = useState([]);
  const [image, setImage] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const imagePreview = useMemo(() => {
    if (!image) return "";
    return URL.createObjectURL(image);
  }, [image]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const resetForm = () => {
    setTitle("");
    setArtist("");
    setAlbum("");
    setAudio(null);
    setAudios([]);
    setImage(null);
    setAudioUrl("");
    setCoverUrl("");
  };

  const handleSingleUpload = async () => {
    if (!title.trim() || !artist.trim()) {
      setErrorMessage("Completa titulo y artista antes de publicar.");
      return false;
    }

    if (!audio || !image) {
      setErrorMessage("Selecciona un archivo de audio y una portada.");
      return false;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("artist", artist.trim());
    formData.append("audio", audio);
    formData.append("image", image);

    await uploadSong(formData);
    setSuccessMessage("Cancion publicada correctamente.");
    return true;
  };

  const handleBulkUpload = async () => {
    if (!artist.trim()) {
      setErrorMessage("Define el artista para aplicar al lote.");
      return false;
    }

    if (!audios.length || !image) {
      setErrorMessage("Selecciona varias pistas y una portada compartida.");
      return false;
    }

    const formData = new FormData();
    formData.append("artist", artist.trim());
    formData.append("album", album.trim());
    formData.append("image", image);
    audios.forEach((file) => formData.append("audios", file));

    const response = await uploadSongsBulk(formData);
    setSuccessMessage(`${response?.count || audios.length} canciones publicadas en lote.`);
    return true;
  };

  const handleUrlImport = async () => {
    if (!title.trim() || !artist.trim()) {
      setErrorMessage("Completa titulo y artista antes de importar.");
      return false;
    }

    if (!audioUrl.trim() || !coverUrl.trim()) {
      setErrorMessage("Pega la URL publica del audio y de la portada.");
      return false;
    }

    await importSongFromUrl({
      title: title.trim(),
      artist: artist.trim(),
      album: album.trim(),
      audioUrl: audioUrl.trim(),
      coverUrl: coverUrl.trim(),
    });

    setSuccessMessage("Cancion importada desde el hosting.");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    try {
      setIsSubmitting(true);
      const uploaded =
        mode === "bulk"
          ? await handleBulkUpload()
          : mode === "url"
            ? await handleUrlImport()
            : await handleSingleUpload();

      if (uploaded) {
        onUpload?.();
        resetForm();
        onSuccess?.();
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        mode === "bulk"
          ? "No pudimos completar la carga masiva. Revisa tu sesion y vuelve a intentar."
          : mode === "url"
            ? "No pudimos importar la cancion. Revisa las URLs y tu sesion."
          : "No pudimos publicar la cancion. Revisa tu sesion y vuelve a intentar."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05))] shadow-[0_28px_90px_rgba(2,6,23,0.28)] backdrop-blur-[28px] ${
        compact
          ? "rounded-[28px] p-5 sm:p-6"
          : "rounded-[26px] p-4 sm:rounded-[30px] sm:p-6"
      }`}
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ opacity: [0.45, 0.68, 0.45], scale: [1, 1.02, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))]"
        />
      </div>

      <div className="relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className={`${compact ? "font-display text-[1.9rem]" : "text-2xl"} font-semibold tracking-[-0.05em] text-white`}
            >
              Estudio de carga
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mt-3 max-w-lg text-sm leading-6 text-slate-300/62"
            >
              Publica una pista o importa varias canciones en una sola sesion.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-2 rounded-[22px] border border-white/8 bg-slate-950/24 p-1 sm:grid-cols-3 sm:rounded-full">
            {modeOptions.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  clearMessages();
                  setMode(id);
                }}
                className={`flex items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition ${
                  mode === id
                    ? "bg-cyan-300/14 text-white shadow-[0_0_24px_rgba(103,232,249,0.14)]"
                    : "text-slate-300/58 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 sm:mt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {mode !== "bulk" && (
              <motion.input
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.14 }}
                type="text"
                placeholder="Titulo"
                value={title}
                onChange={(e) => {
                  clearMessages();
                  setTitle(e.target.value);
                }}
                className={baseField}
              />
            )}

            <motion.input
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18 }}
              type="text"
              placeholder={mode === "bulk" ? "Artista del lote" : "Artista"}
              value={artist}
              onChange={(e) => {
                clearMessages();
                setArtist(e.target.value);
              }}
              className={baseField}
            />

            {mode !== "single" && (
              <motion.input
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.22 }}
                type="text"
                placeholder="Album o coleccion opcional"
                value={album}
                onChange={(e) => {
                  clearMessages();
                  setAlbum(e.target.value);
                }}
                className={baseField}
              />
            )}
          </div>

          {mode === "url" ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <motion.label
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.26 }}
                className="block rounded-[22px] border border-white/10 bg-white/[0.045] p-4 text-sm text-slate-300/65 backdrop-blur-xl sm:rounded-[24px]"
              >
                <span className="mb-3 flex items-center gap-2 font-medium text-white">
                  <Link size={16} /> URL publica del audio
                </span>
                <input
                  type="url"
                  placeholder="https://tu-dominio.com/music-repository/audio/cancion.mp3"
                  value={audioUrl}
                  onChange={(e) => {
                    clearMessages();
                    setAudioUrl(e.target.value);
                  }}
                  className={baseField}
                />
                <p className="mt-3 text-xs leading-5 text-slate-300/48">
                  Debe abrir o descargar el audio directamente en el navegador.
                </p>
              </motion.label>

              <motion.label
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.32 }}
                className="block rounded-[22px] border border-white/10 bg-white/[0.045] p-4 text-sm text-slate-300/65 backdrop-blur-xl sm:rounded-[24px]"
              >
                <span className="mb-3 flex items-center gap-2 font-medium text-white">
                  <ImagePlus size={16} /> URL publica de la portada
                </span>
                <input
                  type="url"
                  placeholder="https://tu-dominio.com/music-repository/covers/portada.jpg"
                  value={coverUrl}
                  onChange={(e) => {
                    clearMessages();
                    setCoverUrl(e.target.value);
                  }}
                  className={baseField}
                />
                <p className="mt-3 text-xs leading-5 text-slate-300/48">
                  Usa una imagen publica y cuadrada para que la card se vea bien.
                </p>
              </motion.label>
            </div>
          ) : (
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.label
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.26 }}
              whileHover={{ y: -2 }}
              className="state-hover-lift block rounded-[22px] border border-dashed border-white/12 bg-white/[0.045] p-4 text-sm text-slate-300/65 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:rounded-[24px]"
            >
              <span className="mb-3 flex items-center gap-2 font-medium text-white">
                {mode === "bulk" ? <Files size={16} /> : <Music4 size={16} />}
                {mode === "bulk" ? "Pistas del lote" : "Audio"}
              </span>
              <div className="rounded-[16px] border border-white/7 bg-slate-950/28 px-3 py-3">
                <input
                  type="file"
                  accept="audio/*"
                  multiple={mode === "bulk"}
                  onChange={(e) => {
                    clearMessages();
                    const files = Array.from(e.target.files || []);
                    if (mode === "bulk") {
                      setAudios(files);
                    } else {
                      setAudio(files[0] ?? null);
                    }
                  }}
                  className="w-full text-xs text-slate-200 file:mr-3 file:rounded-full file:border-0 file:bg-cyan-300/15 file:px-4 file:py-2 file:text-xs file:font-medium file:text-cyan-100 sm:text-sm"
                />
                <div className="mt-3 space-y-1 text-xs text-slate-300/54">
                  {mode === "bulk" ? (
                    audios.length ? (
                      <>
                        <p>{audios.length} archivos listos para importar.</p>
                        <div className="max-h-20 space-y-1 overflow-y-auto pr-1">
                          {audios.slice(0, 8).map((file) => (
                            <p key={`${file.name}-${file.size}`} className="truncate">
                              {file.name}
                            </p>
                          ))}
                          {audios.length > 8 && <p>+{audios.length - 8} mas</p>}
                        </div>
                      </>
                    ) : (
                      <p>Selecciona varios MP3, WAV o archivos compatibles.</p>
                    )
                  ) : (
                    <p className="truncate">
                      {audio ? `Archivo: ${audio.name}` : "Selecciona un archivo MP3, WAV o similar."}
                    </p>
                  )}
                </div>
              </div>
            </motion.label>

            <motion.label
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.32 }}
              whileHover={{ y: -2 }}
              className="state-hover-lift block rounded-[22px] border border-dashed border-white/12 bg-white/[0.045] p-4 text-sm text-slate-300/65 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:rounded-[24px]"
            >
              <span className="mb-3 flex items-center gap-2 font-medium text-white">
                <ImagePlus size={16} /> {mode === "bulk" ? "Portada compartida" : "Portada"}
              </span>
              <div className="rounded-[16px] border border-white/7 bg-slate-950/28 p-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    clearMessages();
                    setImage(e.target.files?.[0] ?? null);
                  }}
                  className="w-full text-xs text-slate-200 file:mr-3 file:rounded-full file:border-0 file:bg-fuchsia-300/15 file:px-4 file:py-2 file:text-xs file:font-medium file:text-fuchsia-100 sm:text-sm"
                />
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[16px] border border-white/8 bg-white/[0.04]">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview de portada"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UploadCloud size={18} className="text-slate-300/42" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white">
                      {image ? image.name : "Aun no has seleccionado portada"}
                    </p>
                    <p className="mt-1 text-xs text-slate-300/52">
                      {mode === "bulk"
                        ? "Se aplicara a todas las canciones del lote."
                        : "Usa una imagen cuadrada para mejor resultado visual."}
                    </p>
                  </div>
                </div>
              </div>
            </motion.label>
          </div>
          )}

          {(errorMessage || successMessage) && (
            <div
              className={`rounded-[18px] border px-4 py-3 text-sm ${
                errorMessage
                  ? "border-red-300/16 bg-red-500/10 text-red-100"
                  : "border-emerald-300/16 bg-emerald-500/10 text-emerald-100"
              }`}
            >
              {errorMessage || successMessage}
            </div>
          )}

          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.38 }}
            whileHover={{ y: -2, scale: isSubmitting ? 1 : 1.01 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
            disabled={isSubmitting}
            className="btn-primary state-hover-lift state-active-press glow-violet-soft flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-medium transition disabled:cursor-not-allowed disabled:opacity-70 sm:py-3.5"
          >
            <Send size={16} />{" "}
            {isSubmitting
              ? mode === "bulk"
                ? "Importando lote..."
                : mode === "url"
                  ? "Registrando..."
                : "Publicando..."
              : mode === "bulk"
                ? "Importar lote"
                : mode === "url"
                  ? "Guardar URL en biblioteca"
                : "Publicar"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

export default Upload;
