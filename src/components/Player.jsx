import { usePlayer } from "../context/PlayerContext";

function Player() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    nextSong,
    prevSong,
    currentTime,
    duration,
    seek,
    setVolume,
    isBuffering,
    isShuffle,
    toggleShuffle,
    toggleFavorite,
  } = usePlayer();

  if (!currentSong) return null;

  const formatTime = (time) => {
    if (!time) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="w-full h-full bg-[#181818] grid grid-cols-3 items-center px-6 border-t border-[#282828]">

      {/* INFO */}
      <div className="flex items-center gap-3">
        <img src={currentSong.coverUrl} className="w-14 h-14 rounded" />
        <div>
          <p className="text-sm">{currentSong.title}</p>
          <p className="text-xs text-gray-400">{currentSong.artist}</p>
        </div>

        <button onClick={() => toggleFavorite(currentSong)}>❤️</button>
      </div>

      {/* CONTROLES */}
      <div className="flex flex-col items-center gap-2">

        <div className="flex items-center gap-6">
          <button onClick={toggleShuffle} className={isShuffle ? "text-green-500" : ""}>
            🔀
          </button>

          <button onClick={prevSong}>⏮</button>

          <button onClick={togglePlay} className="bg-white text-black w-10 h-10 rounded-full">
            {isPlaying ? "⏸" : "▶"}
          </button>

          <button onClick={nextSong}>⏭</button>
        </div>

        <div className="flex items-center gap-2 w-full max-w-xl">
          <span>{formatTime(currentTime)}</span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full"
          />

          <span>{formatTime(duration)}</span>
        </div>

        {isBuffering && <p>Cargando...</p>}
      </div>

      {/* VOLUMEN */}
      <div className="flex justify-end">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export default Player;