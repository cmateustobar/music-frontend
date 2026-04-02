import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Player from "./components/Player";

function App() {
  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">

      <div className="flex flex-1 overflow-hidden">

        <div className="w-60 border-r border-[#282828] flex-shrink-0">
          <Sidebar />
        </div>

        <div className="flex-1 overflow-y-auto">
          <Home />
        </div>

      </div>

      <div className="h-24 border-t border-[#282828] flex-shrink-0">
        <Player />
      </div>

    </div>
  );
}

export default App;