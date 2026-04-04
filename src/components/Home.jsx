import { useEffect, useState } from "react";
import { fetchSongs } from "../services/api";
import { usePlayer } from "../context/PlayerContext";

function Home() {
  const [songs, setSongs] = useState([]);
  const { playSong } = usePlayer();

  const loadSongs = async () => {
    const data = await fetchSongs();
    setSongs(data);
  };

  useEffect(() => {
    loadSongs();
  }, []);

  // 🔥 DELETE
  const deleteSong = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/songs/${id}`, {
      method: "DELETE",
    });
    loadSongs();
  };

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold">Canciones</h1>

      {/* 🎵 LISTA */}
      <div className="grid grid-cols-6 gap-4">

        {songs.map((song, index) => (
          <div
            key={song._id}
            className="bg-[#181818] p-3 rounded-xl hover:bg-[#282828] transition"
          >
            <img
              src={song.coverUrl}
              className="w-full aspect-square object-cover rounded-md mb-2 cursor-pointer"
              onClick={() => playSong(song, songs, index)}
            />

            <p className="text-sm font-semibold truncate">
              {song.title}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {song.artist}
            </p>

            {/* DELETE */}
            <button
              onClick={() => deleteSong(song._id)}
              className="text-red-400 text-xs mt-2 hover:text-red-600"
            >
              Eliminar
            </button>
          </div>
        ))}

      </div>

      {/* 🔥 SUBIR CANCIÓN */}
      <UploadSong onUpload={loadSongs} />

    </div>
  );
}

export default Home;

// =========================
// COMPONENTE UPLOAD
// =========================
function UploadSong({ onUpload }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audio, setAudio] = useState(null);
  const [image, setImage] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("audio", audio);
    formData.append("image", image);

    await fetch(`${import.meta.env.VITE_API_URL}/api/songs/upload`, {
      method: "POST",
      body: formData,
    });

    onUpload();
  };

  return (
    <div className="bg-[#181818] p-6 rounded-xl space-y-3">

      <h2 className="text-xl font-semibold">Subir canción</h2>

      <input
        placeholder="Título"
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 bg-black rounded"
      />

      <input
        placeholder="Artista"
        onChange={(e) => setArtist(e.target.value)}
        className="w-full p-2 bg-black rounded"
      />

      <input type="file" onChange={(e) => setAudio(e.target.files[0])} />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />

      <button
        onClick={handleUpload}
        className="bg-green-500 text-black px-4 py-2 rounded"
      >
        Subir
      </button>

    </div>
  );
}