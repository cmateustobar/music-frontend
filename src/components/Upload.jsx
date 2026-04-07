import { useState } from "react";
import { motion } from "framer-motion";
import { ImagePlus, Music4, Send } from "lucide-react";
import { uploadSong } from "../services/api";

const baseField = "ds-input w-full px-4 py-3 text-sm sm:px-5 sm:py-3.5";

const fileInputClass =
  "w-full text-xs text-slate-200 sm:text-sm file:mr-3 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-xs file:font-medium sm:file:mr-4 sm:file:text-sm";

function Upload({ onUpload, onSuccess, compact = false }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audio, setAudio] = useState(null);
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!audio || !image) {
      alert("Faltan archivos");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("audio", audio);
    formData.append("image", image);

    try {
      await uploadSong(formData);
      onUpload?.();
      setTitle("");
      setArtist("");
      setAudio(null);
      setImage(null);
      onSuccess?.();
      alert("Cancion subida");
    } catch (error) {
      console.error(error);
      alert("Error al subir");
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

        {compact && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="mt-3 max-w-lg text-sm leading-6 text-slate-300/62"
          >
            Publica una nueva pista en un espacio dedicado y limpio, separado del flujo de escucha.
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 sm:mt-6">
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
              onChange={(e) => setter(e.target.value)}
              className={baseField}
            />
          ))}

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
            <input
              type="file"
              onChange={(e) => setAudio(e.target.files?.[0] ?? null)}
              className={`${fileInputClass} file:bg-cyan-300/15 file:text-cyan-100`}
            />
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
            <input
              type="file"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className={`${fileInputClass} file:bg-fuchsia-300/15 file:text-fuchsia-100`}
            />
          </motion.label>

          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.38 }}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="btn-primary state-hover-lift state-active-press glow-violet-soft flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-medium transition sm:py-3.5"
          >
            <Send size={16} /> Publicar
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

export default Upload;
