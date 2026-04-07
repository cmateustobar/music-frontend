import { memo } from "react";
import { motion } from "framer-motion";
import { Play, Trash2, Waves } from "lucide-react";

const SongCard = memo(({ song, onPlay, onDelete, deleting }) => {
  const canDelete = typeof onDelete === "function";

  return (
    <motion.article
      onClick={onPlay}
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      animate={{
        opacity: deleting ? 0 : 1,
        y: deleting ? 10 : 0,
        scale: deleting ? 0.96 : 1,
      }}
      whileHover={{ y: -8, scale: 1.016 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="ds-card panel-edge group relative overflow-hidden rounded-[26px] state-active-press"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/24" />
        <div className="absolute left-0 top-0 h-full w-px bg-white/12" />
        <div className="absolute inset-[1px] rounded-[25px] border border-white/6" />
      </div>

      <div className="relative p-2.5">
        <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-slate-950/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <motion.img
            src={song.coverUrl}
            alt={song.title}
            loading="lazy"
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.09 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="aspect-square w-full object-cover"
          />

          <motion.div
            initial={false}
            animate={{
              opacity: 1,
              background:
                "linear-gradient(180deg, rgba(6,11,20,0.08), rgba(6,11,20,0.2) 34%, rgba(6,11,20,0.88) 100%)",
            }}
            className="absolute inset-0"
          />
          <motion.div
            initial={false}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 opacity-0 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_34%),linear-gradient(180deg,rgba(45,212,191,0.08),transparent_40%)]"
          />

          {canDelete && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-slate-950/42 text-white/80 opacity-0 shadow-[0_10px_24px_rgba(2,6,23,0.32)] backdrop-blur-xl transition-all duration-200 hover:border-red-300/30 hover:bg-red-500/70 group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </motion.button>
          )}

          <motion.div
            initial={false}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="absolute inset-x-0 bottom-0 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 rounded-[18px] border border-white/8 bg-white/[0.08] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
                <div className="mb-2 flex items-center gap-2">
                  <motion.div
                    animate={{ y: [0, -1.5, 0], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2.8, repeat: Infinity }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-950/28 px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-cyan-100/76"
                  >
                    <Waves size={11} />
                    Play
                  </motion.div>
                </div>
                <p className="type-card-title truncate text-white">{song.title}</p>
                <p className="type-meta mt-1 truncate text-slate-300/62">
                  {song.artist}
                </p>
              </div>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay();
                }}
                initial={false}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="glow-cyan-soft mt-auto flex h-12 w-12 translate-y-3 items-center justify-center rounded-full border border-white/24 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(186,230,253,0.84))] text-slate-950 opacity-0 shadow-[0_18px_32px_rgba(15,118,110,0.32)] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
              >
                <Play size={18} fill="currentColor" className="ml-0.5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
});

export default SongCard;
