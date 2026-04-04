import { usePlayer } from "../context/PlayerContext";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Volume2,
} from "lucide-react";

function formatTime(time) {
  if (!time || isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function Player() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isBuffering,
    togglePlay,
    nextSong,
    prevSong,
    seek,
    setVolume,
    isShuffle,
    toggleShuffle,
  } = usePlayer();

  if (!currentSong) {
    return (
      <div className="w-full flex items-center justify-center text-gray-400 text-sm">
        Selecciona una canción 🎧
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-between gap-4">

      {/* 🎵 INFO */}
      <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
        <img
          src={currentSong.coverUrl}
          alt={currentSong.title}
          className={`
            w-14 h-14 object-cover rounded-md shadow-lg
            transition-transform duration-700
            ${isPlaying ? "animate-spin-slow" : ""}
          `}
        />

        <div className="truncate">
          <p className="text-sm font-semibold text-white truncate">
            {currentSong.title}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {currentSong.artist}
          </p>
        </div>
      </div>

      {/* 🎧 CONTROLES */}
      <div className="flex flex-col items-center w-2/4 max-w-xl">

        <div className="flex items-center gap-6 mb-2">

          <button
            onClick={toggleShuffle}
            className={`transition ${
              isShuffle ? "text-green-500 scale-110" : "text-gray-400"
            } hover:text-white`}
          >
            <Shuffle size={18} />
          </button>

          <button onClick={prevSong} className="hover:scale-110 transition">
            <SkipBack size={22} />
          </button>

          <button
            onClick={togglePlay}
            className="bg-white text-black p-2 rounded-full hover:scale-110 transition"
          >
            {isBuffering ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} />
            )}
          </button>

          <button onClick={nextSong} className="hover:scale-110 transition">
            <SkipForward size={22} />
          </button>
        </div>

        {/* PROGRESS */}
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs text-gray-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full accent-green-500"
          />

          <span className="text-xs text-gray-400 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* 🔊 VOLUMEN */}
      <div className="flex items-center gap-3 w-1/4 justify-end">
        <Volume2 size={18} />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          defaultValue={0.7}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-24 accent-green-500"
        />
      </div>
    </div>
  );
}

export default Player;