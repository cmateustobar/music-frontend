import { memo } from "react";
import { Play, Trash2 } from "lucide-react";

const SongCard = memo(({ song, onPlay, onDelete, deleting }) => {
  return (
    <div
      onClick={onPlay}
      className={`
        bg-[#181818] p-3 rounded-xl
        hover:bg-[#282828] transition
        group cursor-pointer
        transform transition-all duration-300 hover:scale-105
        ${deleting ? "opacity-0 scale-90" : "opacity-100"}
      `}
    >
      <div className="relative">
        <img
          src={song.coverUrl}
          alt={song.title}
          loading="lazy"
          className="w-full aspect-square object-cover rounded-lg"
        />

        {/* PLAY */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
          className="
            absolute bottom-2 right-2
            bg-green-500 p-3 rounded-full shadow-xl
            opacity-0 translate-y-3
            group-hover:opacity-100 group-hover:translate-y-0
            transition-all duration-300
          "
        >
          <Play size={18} fill="black" />
        </button>

        {/* DELETE */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="
            absolute top-2 right-2 z-10
            bg-black/80 p-2 rounded-full text-white
            opacity-80 hover:opacity-100 hover:bg-red-500
            transition
          "
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="mt-3">
        <p className="text-white text-sm font-semibold truncate">
          {song.title}
        </p>
        <p className="text-gray-400 text-xs truncate">
          {song.artist}
        </p>
      </div>
    </div>
  );
});

export default SongCard;