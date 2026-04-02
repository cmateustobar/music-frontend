const Sidebar = () => {
  return (
    <div className="bg-black text-white p-4 flex flex-col gap-6 border-r border-[#282828] h-full">

      {/* LOGO */}
      <h1 className="text-xl font-bold">🎧 MusicApp</h1>

      {/* MENÚ PRINCIPAL */}
      <nav className="flex flex-col gap-2 text-sm">
        <button className="text-left hover:bg-[#222] p-2 rounded">
          🏠 Inicio
        </button>

        <button className="text-left hover:bg-[#222] p-2 rounded">
          🔍 Buscar
        </button>

        <button className="text-left hover:bg-[#222] p-2 rounded">
          ❤️ Favoritos
        </button>
      </nav>

      {/* SEPARADOR */}
      <div className="border-t border-[#282828]" />

      {/* PLAYLISTS */}
      <div className="flex flex-col gap-2 text-sm">
        <h2 className="text-xs opacity-60 uppercase tracking-wide">
          Playlists
        </h2>

        <div className="flex flex-col gap-1">
          <div className="hover:bg-[#222] p-2 rounded cursor-pointer">
            🎵 Mi Playlist 1
          </div>

          <div className="hover:bg-[#222] p-2 rounded cursor-pointer">
            ❤️ Favoritas
          </div>

          <div className="hover:bg-[#222] p-2 rounded cursor-pointer">
            🔥 Top Hits
          </div>
        </div>
      </div>

      {/* ESPACIADOR */}
      <div className="flex-1" />

      {/* FOOTER */}
      <div className="text-xs opacity-40">
        © MusicApp
      </div>

    </div>
  );
};

export default Sidebar;