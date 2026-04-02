import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { Play } from "lucide-react";

function SongList({ songs }) {
  const { playSong } = useContext(PlayerContext);

  return (
    <div
      className="
        grid
        grid-cols-[repeat(auto-fill,minmax(180px,1fr))]
        gap-6
      "
    >
      {songs.map((song) => (
        <div
          key={song._id}
          className="
            bg-[#181818]
            p-4
            rounded-xl
            hover:bg-[#282828]
            transition
            group
            cursor-pointer
          "
        >
          {/* IMAGEN */}
          <div className="relative">

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

            {/* BOTÓN PLAY */}
            <button
              onClick={() => playSong(song)}
              className="
                absolute
                bottom-2
                right-2
                bg-green-500
                p-3
                rounded-full
                shadow-lg
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