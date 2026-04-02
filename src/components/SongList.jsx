import { usePlayer } from "../context/PlayerContext";
import { Play, Trash2 } from "lucide-react";
import { deleteSong } from "../services/api";

function SongList({ songs, onDelete }) {
  const { playSong } = usePlayer();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Eliminar esta canción?");
    if (!confirmDelete) return;

    try {
      await deleteSong(id);
      onDelete && onDelete();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la canción");
    }
  };

  return (
    <div
      className="
        grid
        grid-cols-[repeat(auto-fill,minmax(160px,1fr))]
        gap-5
      "
    >
      {songs.map((song, index) => (
        <div
          key={song._id}
          className="
            bg-[#181818]
            p-3
            rounded-xl
            hover:bg-[#282828]
            transition
            group
            cursor-pointer
          "
        >
          {/* IMAGEN */}
          <div className="relative overflow-hidden">

            <img
              src={song.coverUrl}
              alt={song.title}
              className="
                w-full
                aspect-square
                object-cover
                rounded-lg
              "
            />

            {/* ▶️ PLAY */}
            <button
              onClick={() => playSong(song, songs, index)}
              className="
                absolute
                bottom-2
                right-2
                bg-green-500
                p-3
                rounded-full
                shadow-xl
                opacity-0
                translate-y-3
                group-hover:opacity-100
                group-hover:translate-y-0
                transition-all
                duration-300
              "
            >
              <Play size={18} fill="black" />
            </button>

            {/* 🗑️ DELETE PRO (VISIBLE SIEMPRE) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(song._id);
              }}
              className="
                absolute
                top-2
                right-2
                z-10
                bg-black/80
                backdrop-blur-sm
                p-2
                rounded-full
                text-white
                shadow-md
                opacity-80
                hover:opacity-100
                hover:bg-red-500
                transition
              "
            >
              <Trash2 size={16} />
            </button>

          </div>

          {/* INFO */}
          <div className="mt-3 space-y-1">
            <p className="text-white text-sm font-semibold truncate">
              {song.title}
            </p>

            <p className="text-gray-400 text-xs truncate">
              {song.artist}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SongList;