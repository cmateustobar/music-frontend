import { usePlayer } from "./context/PlayerContext";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Player from "./components/Player";

function App() {
  const { currentSong } = usePlayer();

  const dynamicStyle = currentSong
    ? {
        background: `linear-gradient(to bottom, #333, #121212)`,
      }
    : { background: "#121212" };

  return (
    <div className="h-screen flex flex-col text-white" style={dynamicStyle}>

      <div className="flex flex-1 overflow-hidden">

        <aside className="w-64 bg-black/80 backdrop-blur-lg p-5">
          <Sidebar />
        </aside>

        <main className="flex-1 overflow-y-auto p-6">
          <Home />
        </main>

      </div>

      <div className="h-24 bg-black/80 backdrop-blur-lg px-6 flex items-center">
        <Player />
      </div>

    </div>
  );
}

export default App;