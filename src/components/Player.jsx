import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import {
  Heart,
  ListMusic,
  Pause,
  Play,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  X,
} from "lucide-react";

function formatTime(time) {
  if (!time || Number.isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function Player() {
  const {
    currentSong,
    queue,
    queueIndex,
    favorites,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    nextSong,
    prevSong,
    seek,
    setVolume,
    isShuffle,
    setIsShuffle,
    closePlayer,
    toggleFavorite,
    isFavorite,
  } = usePlayer();
  const [isProgressHovered, setIsProgressHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!currentSong) {
      setIsExpanded(false);
    }
  }, [currentSong]);

  const safeDuration = duration || 0;
  const safeCurrentTime = Math.min(currentTime, safeDuration || currentTime || 0);
  const progressPercent = safeDuration
    ? Math.min((safeCurrentTime / safeDuration) * 100, 100)
    : 0;

  const upNextSongs = useMemo(() => {
    if (!queue?.length) return [];

    return queue
      .slice(queueIndex + 1)
      .filter((song) => song?._id !== currentSong?._id)
      .slice(0, 5);
  }, [currentSong?._id, queue, queueIndex]);

  const favoriteSuggestions = useMemo(
    () => favorites.filter((song) => song._id !== currentSong?._id).slice(0, 4),
    [currentSong?._id, favorites]
  );

  if (!currentSong) {
    return null;
  }

  const favorite = isFavorite(currentSong);

  return (
    <>
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/72 px-4 py-6 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="surface-glass-strong panel-edge relative w-full max-w-[1380px] overflow-hidden rounded-[34px] p-6 sm:p-8"
            >
              <button
                onClick={() => setIsExpanded(false)}
                className="btn-icon state-hover-lift absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full text-slate-100"
                title="Cerrar vista ampliada"
              >
                <X size={18} />
              </button>

              <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_380px]">
                <div className="min-w-0">
                  <div className="flex flex-col gap-6 md:flex-row md:items-end">
                    <div className="glow-cyan-soft overflow-hidden rounded-[30px] border border-white/12">
                      <img
                        src={currentSong.coverUrl}
                        alt={currentSong.title}
                        className="h-[220px] w-[220px] object-cover sm:h-[280px] sm:w-[280px]"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="type-kicker text-slate-300/40">Now Playing</p>
                      <h2 className="mt-3 font-display text-[2.8rem] leading-[0.92] tracking-[-0.06em] text-white sm:text-[4rem]">
                        {currentSong.title}
                      </h2>
                      <p className="mt-3 text-lg text-slate-200/64">{currentSong.artist}</p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        <div className="rounded-full border border-white/8 bg-white/[0.05] px-3 py-2 text-sm text-slate-200/70">
                          {isPlaying ? "Reproduciendo" : "En pausa"}
                        </div>
                        <div className="rounded-full border border-white/8 bg-white/[0.05] px-3 py-2 text-sm text-slate-200/70">
                          {formatTime(safeCurrentTime)} / {formatTime(safeDuration)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="surface-glass rounded-[24px] p-5">
                    <p className="type-kicker text-slate-300/36">Up next</p>
                    <div className="mt-4 space-y-2.5">
                      {upNextSongs.length ? (
                        upNextSongs.map((song, index) => (
                          <div
                            key={song._id}
                            className="flex items-center gap-3 rounded-[18px] border border-white/7 bg-white/[0.04] p-2.5"
                          >
                            <img
                              src={song.coverUrl}
                              alt={song.title}
                              className="h-12 w-12 rounded-[12px] object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-white">
                                {song.title}
                              </p>
                              <p className="mt-1 truncate text-xs text-slate-300/52">
                                {song.artist}
                              </p>
                            </div>
                            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400/44">
                              0{index + 1}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-[18px] border border-white/7 bg-white/[0.03] px-4 py-4 text-sm text-slate-300/56">
                          No hay otra pista en cola despues de esta.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="surface-glass rounded-[24px] p-5">
                    <p className="type-kicker text-slate-300/36">Favoritas</p>
                    <div className="mt-4 space-y-2.5">
                      {favoriteSuggestions.length ? (
                        favoriteSuggestions.map((song) => (
                          <div
                            key={song._id}
                            className="flex items-center gap-3 rounded-[18px] border border-white/7 bg-white/[0.04] p-2.5"
                          >
                            <img
                              src={song.coverUrl}
                              alt={song.title}
                              className="h-12 w-12 rounded-[12px] object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-white">
                                {song.title}
                              </p>
                              <p className="mt-1 truncate text-xs text-slate-300/52">
                                {song.artist}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-[18px] border border-white/7 bg-white/[0.03] px-4 py-4 text-sm text-slate-300/56">
                          Tus favoritas apareceran aqui para darte continuidad.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="surface-glass-strong panel-edge relative overflow-hidden rounded-[28px] p-5 sm:rounded-[36px] sm:p-7"
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center opacity-20 blur-2xl"
            style={{ backgroundImage: `url(${currentSong.coverUrl})` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,14,24,0.88),rgba(8,17,29,0.62)_38%,rgba(7,14,24,0.9)),radial-gradient(circle_at_top_left,rgba(103,232,249,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(232,121,249,0.14),transparent_30%)]" />
          <div className="absolute inset-[1px] rounded-[27px] border border-white/7 sm:rounded-[35px]" />
        </div>

        <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(true)}
            className="btn-icon state-hover-lift flex h-10 w-10 items-center justify-center rounded-full text-slate-100"
            title="Abrir now playing"
          >
            <ListMusic size={16} />
          </button>
          <button
            onClick={closePlayer}
            className="btn-icon state-hover-lift flex h-10 w-10 items-center justify-center rounded-full text-slate-100"
            title="Cerrar reproductor"
          >
            <X size={16} />
          </button>
        </div>

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.9fr)] xl:items-center xl:gap-10">
          <button
            onClick={() => setIsExpanded(true)}
            className="flex min-w-0 items-center gap-4 text-left sm:gap-6"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSong._id || currentSong.audioUrl}
                initial={{ opacity: 0, y: 14, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(12px)" }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex min-w-0 items-center gap-4 sm:gap-6"
              >
                <motion.div
                  layout
                  className="glow-cyan-soft relative shrink-0 overflow-hidden rounded-[24px] border border-white/14 bg-white/[0.06] shadow-[0_24px_60px_rgba(2,6,23,0.32)] backdrop-blur-xl sm:rounded-[28px]"
                >
                  <motion.img
                    src={currentSong.coverUrl}
                    alt={currentSong.title}
                    initial={{ scale: 1.08, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.45 }}
                    className={`h-24 w-24 object-cover transition-transform duration-700 sm:h-32 sm:w-32 ${
                      isPlaying ? "animate-spin-slow" : ""
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />
                </motion.div>

                <div className="min-w-0">
                  <h2 className="type-song max-w-3xl truncate text-white">
                    {currentSong.title}
                  </h2>
                  <p className="mt-2 truncate text-sm text-slate-200/65 sm:text-lg">
                    {currentSong.artist}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </button>

          <div className="space-y-5">
            <div className="surface-glass panel-edge rounded-[24px] px-4 py-4 sm:px-5 sm:py-5">
              <div
                className="relative"
                onMouseEnter={() => setIsProgressHovered(true)}
                onMouseLeave={() => setIsProgressHovered(false)}
              >
                <div className="pointer-events-none absolute inset-y-1/2 left-0 right-0 h-3 -translate-y-1/2 rounded-full bg-white/8" />
                <motion.div
                  className="pointer-events-none absolute inset-y-1/2 left-0 h-3 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 shadow-[0_0_26px_rgba(52,211,153,0.38)]"
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                />
                <motion.div
                  className="pointer-events-none absolute inset-y-1/2 left-0 -translate-y-1/2 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.45)]"
                  animate={{
                    left: `calc(${progressPercent}% - 10px)`,
                    opacity: isProgressHovered || safeCurrentTime > 0 ? 1 : 0,
                    scale: isProgressHovered ? 1 : 0.9,
                  }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  style={{ width: 20, height: 20 }}
                />
                <motion.div
                  className="pointer-events-none absolute inset-y-1/2 left-0 -translate-y-1/2 rounded-full bg-cyan-300/22 blur-md"
                  animate={{
                    left: `calc(${progressPercent}% - 16px)`,
                    opacity: isProgressHovered ? 1 : 0.55,
                  }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  style={{ width: 32, height: 32 }}
                />
                <input
                  type="range"
                  min={0}
                  max={safeDuration}
                  value={safeCurrentTime}
                  disabled={!safeDuration}
                  onChange={(e) => seek(Number(e.target.value))}
                  className="music-progress-range relative z-10 h-8 w-full"
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs tracking-[-0.02em] text-slate-300/60">
                <span>{formatTime(safeCurrentTime)}</span>
                <span>{formatTime(safeDuration)}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <motion.button
                onClick={() => setIsShuffle((prev) => !prev)}
                whileHover={{ scale: 1.06, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition sm:h-12 sm:w-12 ${
                  isShuffle
                    ? "glow-active-soft border-cyan-300/30 bg-cyan-300/14 text-cyan-100 backdrop-blur-xl"
                    : "border-white/12 bg-white/[0.08] text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl hover:bg-white/[0.12]"
                }`}
                title="Aleatorio"
              >
                <Shuffle size={18} />
              </motion.button>

              <motion.button
                onClick={prevSong}
                whileHover={{ scale: 1.06, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.08] text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition hover:bg-white/[0.12] sm:h-12 sm:w-12"
                title="Anterior"
              >
                <SkipBack size={20} />
              </motion.button>

              <motion.button
                onClick={togglePlay}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                animate={{
                  boxShadow: isPlaying
                    ? [
                        "0 20px 44px rgba(125,211,252,0.22)",
                        "0 24px 52px rgba(125,211,252,0.34)",
                        "0 20px 44px rgba(125,211,252,0.22)",
                      ]
                    : "0 20px 44px rgba(125,211,252,0.18)",
                }}
                transition={{ duration: 2.1, repeat: isPlaying ? Infinity : 0 }}
                className="glow-cyan-soft flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(186,230,253,0.84),rgba(196,181,253,0.72))] text-slate-950 sm:h-20 sm:w-20"
                title="Play / Pause"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isPlaying ? "pause" : "play"}
                    initial={{ opacity: 0, rotate: -16, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 16, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="flex"
                  >
                    {isPlaying ? (
                      <Pause size={26} />
                    ) : (
                      <Play size={26} className="ml-1" />
                    )}
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              <motion.button
                onClick={nextSong}
                whileHover={{ scale: 1.06, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.08] text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition hover:bg-white/[0.12] sm:h-12 sm:w-12"
                title="Siguiente"
              >
                <SkipForward size={20} />
              </motion.button>

              <motion.button
                onClick={() => toggleFavorite(currentSong)}
                whileHover={{ scale: 1.06, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.08] text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition hover:bg-white/[0.12] sm:h-12 sm:w-12"
                title="Favorito"
              >
                <Heart
                  size={18}
                  className={favorite ? "fill-emerald-400 text-emerald-400" : "text-slate-300"}
                />
              </motion.button>
            </div>

            <div className="surface-glass panel-edge flex items-center gap-3 rounded-[22px] px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-300">
                <Volume2 size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-1/2 left-0 right-0 h-2 -translate-y-1/2 rounded-full bg-white/10" />
                  <motion.div
                    className="pointer-events-none absolute inset-y-1/2 left-0 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-white to-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.25)]"
                    animate={{ width: `${volume * 100}%` }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="music-range relative z-10 h-5 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Player;
