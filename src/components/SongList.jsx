import { usePlayer } from "../context/PlayerContext";

function SongList({ songs }) {
  const { playSong, currentSong } = usePlayer();

  if (!songs || songs.length === 0) {
    return <p className="text-gray-400">No hay canciones</p>;
  }

  return (
    <div className="w-full">

      {/* 🔥 GRID PRO (tamaño fijo inteligente) */}
      <div className="
        grid 
        gap-4
        justify-center
        [grid-template-columns:repeat(auto-fill,minmax(140px,1fr))]
      ">

        {songs.map((song, index) => {
          const isActive = currentSong?._id === song._id;

          return (
            <div
              key={song._id}
              onClick={() => playSong(song, songs, index)}
              className={`
                w-[140px]
                p-3 rounded-lg cursor-pointer transition group
                ${isActive ? "bg-[#282828]" : "bg-[#181818] hover:bg-[#242424]"}
              `}
            >
              {/* COVER */}
              <div className="aspect-square mb-2 rounded-md overflow-hidden relative">
                
                <img
                  src={song.coverUrl}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />

                {/* BOTÓN PLAY */}
                <div className="
                  absolute bottom-2 right-2
                  bg-green-500 w-8 h-8 rounded-full
                  flex items-center justify-center
                  text-black text-xs
                  opacity-0 translate-y-3
                  group-hover:opacity-100 group-hover:translate-y-0
                  transition shadow-lg
                ">
                  ▶
                </div>
              </div>

              {/* INFO */}
              <p className="text-white text-[12px] font-semibold truncate">
                {song.title}
              </p>
              <p className="text-gray-400 text-[11px] truncate">
                {song.artist}
              </p>
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default SongList;