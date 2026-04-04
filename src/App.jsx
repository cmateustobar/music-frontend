import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Player from "./components/Player";

function App() {
  return (
    <div className="h-screen flex flex-col dynamic-bg text-white">

      <div className="flex flex-1 overflow-hidden">

        <aside className="w-64 bg-black/80 backdrop-blur-lg p-5 border-r border-[#2a2a2a]">
          <Sidebar />
        </aside>

        <main className="flex-1 overflow-y-auto p-6">
          <Home />
        </main>

      </div>

      <div className="h-24 bg-[#181818]/90 backdrop-blur-lg border-t border-[#2a2a2a] px-6 flex items-center">
        <Player />
      </div>

    </div>
  );
}

export default App;