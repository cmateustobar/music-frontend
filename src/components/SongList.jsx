import { usePlayer } from "../context/PlayerContext";
import { Play, Trash2 } from "lucide-react";
import { deleteSong } from "../services/api";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";

function SongList({ songs, onDelete }) {
  const { playSong } = usePlayer();

  const [deletingId, setDeletingId] = useState(null);
  const [modalSong, setModalSong] = useState(null);

  const handleDelete = async () => {
    if (!modalSong) return;

    try {
      setDeletingId(modalSong._id);

      await deleteSong(modalSong._id);

      toast.success("Canción eliminada 🎧");

      setModalSong(null);

      setTimeout(() => {
        onDelete && onDelete();
      }, 300);

    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-5">
        {songs.map((song, index) => (
          <div
            key={song._id}
            onClick={() => playSong(song, songs, index)}
            className={`
              bg-[#181818] p-3 rounded-xl
              hover:bg-[#282828] transition
              group cursor-pointer
              transform transition-all duration-300
              ${deletingId === song._id ? "opacity-0 scale-90" : "opacity-100"}
            `}
          >
            <div className="relative">

              <img
                src={song.coverUrl}
                alt={song.title}
                className="w-full aspect-square object-cover rounded-lg"
              />

              {/* ▶️ PLAY */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSong(song, songs, index);
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

              {/* 🗑️ DELETE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalSong(song);
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
        ))}
      </div>

      {/* MODAL */}
      <ConfirmModal
        isOpen={!!modalSong}
        onClose={() => setModalSong(null)}
        onConfirm={handleDelete}
        title="¿Eliminar esta canción?"
      />
    </>
  );
}

export default SongList;