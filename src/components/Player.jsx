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
  if (!time) return "0:00";
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
    setIsShuffle,
  } = usePlayer();

  if (!currentSong) {
    return (
      <div className="text-gray-400 text-sm">
        Selecciona una canción 🎧
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-between">

      {/* INFO */}
      <div className="flex items-center gap-4 w-1/4">
        <img
          src={currentSong.coverUrl}
          className="w-14 h-14 object-cover rounded-md"
        />
        <div>
          <p className="text-sm font-semibold">{currentSong.title}</p>
          <p className="text-xs text-gray-400">{currentSong.artist}</p>
        </div>
      </div>

      {/* CONTROLES */}
      <div className="flex flex-col items-center w-2/4">

        <div className="flex items-center gap-6 mb-2">

          <button
            onClick={() => setIsShuffle(prev => !prev)}
            className={`transition ${
              isShuffle ? "text-green-500" : "text-gray-400"
            } hover:text-white`}
          >
            <Shuffle size={18} />
          </button>

          <button onClick={prevSong}>
            <SkipBack />
          </button>

          <button
            onClick={togglePlay}
            className="bg-white text-black p-2 rounded-full"
          >
            {isBuffering ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause />
            ) : (
              <Play />
            )}
          </button>

          <button onClick={nextSong}>
            <SkipForward />
          </button>
        </div>

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
            className="w-full"
          />

          <span className="text-xs text-gray-400 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* VOLUMEN */}
      <div className="flex items-center gap-3 w-1/4 justify-end">
        <Volume2 size={18} />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          defaultValue={0.7}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export default Player;