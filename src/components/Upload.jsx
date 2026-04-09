import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ImagePlus, Music4, Send, UploadCloud } from "lucide-react";
import { uploadSong } from "../services/api";

const baseField = "ds-input w-full px-4 py-3 text-sm sm:px-5 sm:py-3.5";

function Upload({ onUpload, onSuccess, compact = false }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audio, setAudio] = useState(null);
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const imagePreview = useMemo(() => {
    if (!image) return "";
    return URL.createObjectURL(image);
  }, [image]);

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const resetForm = () => {
    setTitle("");
    setArtist("");
    setAudio(null);
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!title.trim() || !artist.trim()) {
      setErrorMessage("Completa titulo y artista antes de publicar.");
      return;
    }

    if (!audio || !image) {
      setErrorMessage("Selecciona un archivo de audio y una portada.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("artist", artist.trim());
    formData.append("audio", audio);
    formData.append("image", image);

    try {
      setIsSubmitting(true);
      await uploadSong(formData);
      onUpload?.();
      resetForm();
      setSuccessMessage("Cancion publicada correctamente.");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      setErrorMessage("No pudimos publicar la cancion. Revisa tu sesion y vuelve a intentar.");
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
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className={`${compact ? "font-display text-[1.9rem]" : "text-2xl"} font-semibold tracking-[-0.05em] text-white`}
        >
          Subir cancion
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mt-3 max-w-lg text-sm leading-6 text-slate-300/62"
        >
          Publica una nueva pista con metadata clara, portada visible y feedback inmediato.
        </motion.p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 sm:mt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Titulo", title, setTitle],
              ["Artista", artist, setArtist],
            ].map(([placeholder, value, setter], idx) => (
              <motion.input
                key={placeholder}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.14 + idx * 0.06 }}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => {
                  clearMessages();
                  setter(e.target.value);
                }}
                className={baseField}
              />
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.label
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.26 }}
              whileHover={{ y: -2 }}
              className="state-hover-lift block rounded-[22px] border border-dashed border-white/12 bg-white/[0.045] p-4 text-sm text-slate-300/65 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:rounded-[24px]"
            >
              <span className="mb-3 flex items-center gap-2 font-medium text-white">
                <Music4 size={16} /> Audio
              </span>
              <div className="rounded-[16px] border border-white/7 bg-slate-950/28 px-3 py-3">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    clearMessages();
                    setAudio(e.target.files?.[0] ?? null);
                  }}
                  className="w-full text-xs text-slate-200 file:mr-3 file:rounded-full file:border-0 file:bg-cyan-300/15 file:px-4 file:py-2 file:text-xs file:font-medium file:text-cyan-100 sm:text-sm"
                />
                <p className="mt-3 truncate text-xs text-slate-300/54">
                  {audio ? `Archivo: ${audio.name}` : "Selecciona un archivo MP3, WAV o similar."}
                </p>
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
                <ImagePlus size={16} /> Portada
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
                      Usa una imagen cuadrada para mejor resultado visual.
                    </p>
                  </div>
                </div>
              </div>
            </motion.label>
          </div>

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
            <Send size={16} /> {isSubmitting ? "Publicando..." : "Publicar"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

export default Upload;
