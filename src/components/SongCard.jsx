import { memo } from "react";
import { motion } from "framer-motion";
import { Play, Trash2 } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

const SongCard = memo(({ song, onPlay, onDelete, deleting }) => {
  const canDelete = typeof onDelete === "function";
  const { currentSong, isPlaying } = usePlayer();
  const isActive = currentSong?._id === song._id;

  return (
    <motion.article
      onClick={onPlay}
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      animate={{
        opacity: deleting ? 0 : 1,
        y: deleting ? 10 : 0,
        scale: deleting ? 0.96 : 1,
      }}
      whileHover={{ y: -7, scale: 1.014 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-[22px] border state-active-press ${
        isActive
          ? "glow-active-soft border-cyan-300/20 bg-cyan-300/[0.07]"
          : "border-white/6 bg-white/[0.03]"
      }`}
    >
      <div className="relative overflow-hidden rounded-[20px]">
        <motion.img
          src={song.coverUrl}
          alt={song.title}
          loading="lazy"
          whileHover={{ scale: 1.07 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="aspect-square w-full object-cover"
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,18,0.03),rgba(4,10,18,0.16)_38%,rgba(4,10,18,0.84)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-2.5">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[0.9rem] font-semibold tracking-[-0.03em] text-white">
                {song.title}
              </p>
              <p className="mt-1 truncate text-[10px] uppercase tracking-[0.14em] text-slate-200/50">
                {song.artist}
              </p>
            </div>

            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onPlay();
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="glow-cyan-soft flex h-10 w-10 shrink-0 translate-y-2 items-center justify-center rounded-full border border-white/18 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(186,230,253,0.84))] text-slate-950 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            >
              <Play size={16} fill="currentColor" className="ml-0.5" />
            </motion.button>
          </div>
        </div>

        <div
          className={`pointer-events-none absolute left-2.5 top-2.5 rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] backdrop-blur-xl ${
            isActive
              ? "border-cyan-300/20 bg-cyan-300/12 text-cyan-100"
              : "border-white/10 bg-slate-950/30 text-cyan-100/68"
          }`}
        >
          {isActive ? (isPlaying ? "Playing" : "Paused") : "Play"}
        </div>

        {canDelete && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="absolute right-2.5 top-2.5 flex h-7.5 w-7.5 items-center justify-center rounded-full border border-white/10 bg-slate-950/38 text-white/78 opacity-0 backdrop-blur-xl transition-all duration-200 hover:border-red-300/28 hover:bg-red-500/68 group-hover:opacity-100"
          >
            <Trash2 size={13} />
          </motion.button>
        )}
      </div>
    </motion.article>
  );
});

export default SongCard;
