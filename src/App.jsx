import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Player from "./components/Player";
import Login from "./pages/Login";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const token = localStorage.getItem("token");

  return (
    <>
      {showLogin && <Login onClose={() => setShowLogin(false)} />}

      <div className="h-screen flex flex-col bg-[#121212] text-white">

        <div className="flex flex-1 overflow-hidden">

          <aside className="w-64 bg-black/70 p-5 border-r border-[#2a2a2a]">
            <Sidebar setShowLogin={setShowLogin} />
          </aside>

          <main className="flex-1 p-6 overflow-y-auto">
            <Home />
          </main>

        </div>

        <div className="h-24 bg-black p-4">
          <Player />
        </div>

      </div>
    </>
  );
}

export default App;