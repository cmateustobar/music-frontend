import { useEffect, useState } from "react";
import { fetchSongs } from "../services/api";
import { usePlayer } from "../context/PlayerContext";

function Home() {
  const [songs, setSongs] = useState([]);
  const { playSong } = usePlayer();

  useEffect(() => {
    const load = async () => {
      const data = await fetchSongs();
      setSongs(data);
    };
    load();
  }, []);

  return (
    <div className="space-y-8">

      {/* 🔥 HERO / NOVEDADES */}
      <section>
        <h1 className="text-4xl font-bold mb-6">Novedades</h1>

        <div className="grid grid-cols-2 gap-6">

          {/* CARD GRANDE 1 */}
          <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden hover:scale-[1.02] transition cursor-pointer">
            <img
              src={songs[0]?.coverUrl}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <p className="text-sm text-gray-400">EN TENDENCIA</p>
              <h2 className="text-xl font-semibold">
                {songs[0]?.title}
              </h2>
            </div>
          </div>

          {/* CARD GRANDE 2 */}
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-6 flex flex-col justify-between">
            <h2 className="text-2xl font-bold">
              Álbumes Imprescindibles
            </h2>
            <p className="text-lg">Top del momento</p>
          </div>

        </div>
      </section>

      {/* 🎵 NUEVAS CANCIONES */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Canciones nuevas
        </h2>

        <div className="grid grid-cols-6 gap-4">

          {songs.map((song, index) => (
            <div
              key={song._id}
              onClick={() => playSong(song, songs, index)}
              className="
                bg-[#181818] p-3 rounded-xl
                hover:bg-[#282828]
                transition cursor-pointer
              "
            >
              <img
                src={song.coverUrl}
                className="w-full aspect-square object-cover rounded-md mb-2"
              />

              <p className="text-sm font-semibold truncate">
                {song.title}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {song.artist}
              </p>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
}

export default Home;