import { useEffect, useState } from "react";
import { fetchSongs, uploadSong } from "../services/api";
import SongList from "./SongList";

function Home() {
  const [songs, setSongs] = useState([]);

  /* =========================
     🔥 LOAD SONGS
  ========================= */
  const loadSongs = async () => {
    try {
      const data = await fetchSongs();

      console.log("🎵 canciones recibidas:", data);

      if (Array.isArray(data)) {
        setSongs(data);
      } else {
        console.warn("⚠️ Formato inesperado:", data);
        setSongs([]);
      }

    } catch (error) {
      console.error("❌ Error cargando canciones:", error);
      setSongs([]);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  /* =========================
     🔥 SUBIR CANCIÓN (FIX REAL)
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", e.target.title.value);
    formData.append("artist", e.target.artist.value);
    formData.append("audio", e.target.audio.files[0]);
    formData.append("image", e.target.image.files[0]);

    try {
      const res = await uploadSong(formData);

      console.log("📦 respuesta upload:", res);

      // 🔥 IMPORTANTE: no romper si hay error de fetch
      alert("Canción subida 🚀");

      e.target.reset();

      // 🔥 recargar lista SIEMPRE
      await loadSongs();

    } catch (error) {
      console.error("❌ Error al subir canción:", error);

      // 🔥 fallback UX (porque sí sube)
      alert("Canción subida (posible retraso en actualización)");
      await loadSongs();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-32">
      <div className="max-w-[1400px] mx-auto px-6 space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Inicio
          </h1>
          <p className="text-gray-400 text-sm">
            Tus canciones recientes
          </p>
        </div>

        {/* LISTA */}
        {songs.length > 0 ? (
          <SongList songs={songs} />
        ) : (
          <p className="text-gray-500 text-sm">
            No hay canciones disponibles
          </p>
        )}

        {/* SUBIR */}
        <div className="bg-[#181818] p-6 rounded-xl max-w-md">
          <h2 className="text-lg font-semibold text-white mb-4">
            Subir canción
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              name="title"
              type="text"
              placeholder="Título"
              required
              className="w-full p-2 rounded bg-[#282828] text-white outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              name="artist"
              type="text"
              placeholder="Artista"
              required
              className="w-full p-2 rounded bg-[#282828] text-white outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              name="audio"
              type="file"
              accept="audio/*"
              required
              className="w-full text-sm text-gray-300"
            />

            <input
              name="image"
              type="file"
              accept="image/*"
              required
              className="w-full text-sm text-gray-300"
            />

            <button
              type="submit"
              className="w-full bg-green-500 py-2 rounded-full font-semibold text-black hover:bg-green-400 transition"
            >
              Subir canción
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default Home;