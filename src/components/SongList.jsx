import { usePlayer } from "../context/PlayerContext";
import { deleteSong } from "../services/api";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";
import SongCard from "./SongCard";

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

    } catch {
      toast.error("Error al eliminar");
    }
  };

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-5">
        {songs.map((song, index) => (
          <SongCard
            key={song._id}
            song={song}
            deleting={deletingId === song._id}
            onPlay={() => playSong(song, songs, index)}
            onDelete={() => setModalSong(song)}
          />
        ))}
      </div>

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