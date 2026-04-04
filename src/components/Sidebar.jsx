import { Home, Search, Library, LogIn, LogOut } from "lucide-react";

function Sidebar({ setShowLogin }) {
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-6 h-full">

      <h1 className="text-2xl font-bold">MusicApp</h1>

      <input
        placeholder="Buscar"
        className="bg-[#1a1a1a] p-2 rounded-lg outline-none"
      />

      <nav className="flex flex-col gap-2">

        <div className="flex items-center gap-3 p-2 hover:bg-[#2a2a2a] rounded-lg cursor-pointer">
          <Home size={18} /> Inicio
        </div>

        <div className="flex items-center gap-3 p-2 hover:bg-[#2a2a2a] rounded-lg cursor-pointer">
          <Search size={18} /> Novedades
        </div>

        <div className="flex items-center gap-3 p-2 hover:bg-[#2a2a2a] rounded-lg cursor-pointer">
          <Library size={18} /> Biblioteca
        </div>

      </nav>

      {/* LOGIN / LOGOUT */}
      <div className="mt-auto">
        {!token ? (
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-2 bg-green-500 text-black px-3 py-2 rounded-lg w-full justify-center"
          >
            <LogIn size={18} /> Login
          </button>
        ) : (
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500 px-3 py-2 rounded-lg w-full justify-center"
          >
            <LogOut size={18} /> Logout
          </button>
        )}
      </div>

    </div>
  );
}

export default Sidebar;