import { usePlayer } from "./context/PlayerContext";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Player from "./components/Player";

function App() {
  const { currentSong } = usePlayer();

  const dynamicStyle = currentSong
    ? {
        background: `linear-gradient(to bottom, #2a2a2a, #121212)`,
      }
    : { background: "#121212" };

  return (
    <div className="h-screen flex flex-col text-white" style={dynamicStyle}>

      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <aside className="w-64 bg-black/70 backdrop-blur-xl p-5 border-r border-[#2a2a2a]">
          <Sidebar />
        </aside>

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto p-6">
          <Home />
        </main>

      </div>

      {/* PLAYER */}
      <div className="h-24 bg-black/80 backdrop-blur-xl border-t border-[#2a2a2a] px-6 flex items-center">
        <Player />
      </div>

    </div>
  );
}

export default App;