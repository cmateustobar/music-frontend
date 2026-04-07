import { useState } from "react";
import toast from "react-hot-toast";
import { usePlayer } from "../context/PlayerContext";
import { deleteSong } from "../services/api";
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
      toast.success("Canción eliminada");
      setModalSong(null);

      setTimeout(() => {
        onDelete && onDelete();
      }, 260);
    } catch {
      toast.error("No se pudo eliminar la canción");
    }
  };

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 sm:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] sm:gap-5 xl:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
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
        title="¿Eliminar esta canción de tu colección?"
      />
    </>
  );
}

export default SongList;
