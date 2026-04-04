import { Home, Search, Library } from "lucide-react";

function Sidebar() {
  return (
    <div className="flex flex-col gap-6">

      {/* LOGO */}
      <h1 className="text-2xl font-bold mb-4">MusicApp</h1>

      {/* SEARCH */}
      <input
        placeholder="Buscar"
        className="bg-[#1a1a1a] p-2 rounded-lg outline-none"
      />

      {/* NAV */}
      <nav className="flex flex-col gap-2">

        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer">
          <Home size={18} />
          <span>Inicio</span>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-lg bg-[#2a2a2a]">
          <Search size={18} />
          <span>Novedades</span>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer">
          <Library size={18} />
          <span>Biblioteca</span>
        </div>

      </nav>

      {/* PLAYLISTS */}
      <div className="mt-6">
        <p className="text-gray-400 text-sm mb-2">PLAYLISTS</p>
        <div className="flex flex-col gap-2 text-sm">
          <span className="hover:text-white cursor-pointer">🔥 Top Hits</span>
          <span className="hover:text-white cursor-pointer">❤️ Favoritas</span>
        </div>
      </div>

    </div>
  );
}

export default Sidebar;