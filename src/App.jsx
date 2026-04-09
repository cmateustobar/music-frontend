import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Search } from "lucide-react";
import { usePlayer } from "./context/PlayerContext";
import Home from "./components/Home";
import Player from "./components/Player";
import Sidebar from "./components/Sidebar";
import UploadModal from "./components/UploadModal";
import Login from "./pages/Login";

const topTabs = [
  { id: "home", label: "Inicio" },
  { id: "library", label: "Explorar" },
  { id: "upload", label: "Crear" },
];

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [songsVersion, setSongsVersion] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const { currentSong } = usePlayer();
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    const nextCover = currentSong?.coverUrl;
    if (!nextCover) {
      setBackgroundImage("");
      return;
    }

    let cancelled = false;
    const image = new Image();
    image.decoding = "async";
    image.loading = "eager";
    image.src = nextCover;

    const applyImage = () => {
      if (!cancelled) {
        setBackgroundImage(nextCover);
      }
    };

    if (image.complete) {
      applyImage();
    } else {
      image.onload = applyImage;
    }

    return () => {
      cancelled = true;
      image.onload = null;
    };
  }, [currentSong]);

  const backgroundStyle = useMemo(
    () => ({
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
    }),
    [backgroundImage]
  );

  useEffect(() => {
    const sectionIds = ["home", "library", "upload"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        root: document.getElementById("app-scroll-content"),
        threshold: [0.25, 0.5, 0.7],
        rootMargin: "-12% 0px -30% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleNavigate = (sectionId) => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(sectionId);
  };

  const navSection = showUpload ? "upload" : activeSection;
  const handleOpenUpload = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }

    setShowUpload(true);
  };

  return (
    <>
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={() => setSongsVersion((value) => value + 1)}
      />

      <div className="relative min-h-screen overflow-hidden bg-[#050816] text-slate-50">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className={`absolute inset-[-18%] scale-[1.22] bg-cover bg-center transition-opacity duration-700 ${
              backgroundImage ? "opacity-100" : "opacity-0"
            }`}
            style={backgroundStyle}
          />
          <div
            className={`absolute inset-[-10%] scale-110 bg-cover bg-center transition-opacity duration-700 ${
              backgroundImage ? "opacity-45" : "opacity-0"
            }`}
            style={backgroundStyle}
          />
          <div className="absolute inset-[-8%] blur-[140px]" style={backgroundStyle} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.12),transparent_18%),radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.08),transparent_20%),radial-gradient(circle_at_50%_78%,rgba(45,212,191,0.1),transparent_26%)] mix-blend-screen opacity-50" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.26),rgba(2,6,23,0.86)_36%,rgba(2,6,23,0.98)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,18,0.96),rgba(3,7,18,0.58)_28%,rgba(3,7,18,0.34)_50%,rgba(3,7,18,0.76)_72%,rgba(3,7,18,0.94)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_24%,rgba(2,6,23,0.24)_58%,rgba(2,6,23,0.8)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(129,140,248,0.18),transparent_22%),radial-gradient(circle_at_82%_14%,rgba(45,212,191,0.14),transparent_24%),radial-gradient(circle_at_50%_78%,rgba(244,114,182,0.14),transparent_30%)]" />
          <div className="absolute inset-0 backdrop-blur-[110px]" />
          <div className="absolute left-[-6%] top-[4%] h-[28rem] w-[28rem] rounded-full bg-cyan-400/16 blur-3xl" />
          <div className="absolute right-[-8%] top-[16%] h-[30rem] w-[30rem] rounded-full bg-violet-400/14 blur-3xl" />
          <div className="absolute bottom-[-12%] left-[18%] h-[25rem] w-[25rem] rounded-full bg-fuchsia-400/12 blur-3xl" />
        </div>

        <div className="relative mx-auto min-h-screen max-w-[1680px] px-3 pb-36 pt-3 sm:px-5 sm:pb-40 sm:pt-5 xl:px-8">
          <div className="mb-4 xl:hidden">
            <Sidebar
              setShowLogin={setShowLogin}
              compact
              activeSection={navSection}
              onNavigate={handleNavigate}
              onOpenUpload={handleOpenUpload}
            />
          </div>

          <div className="grid min-h-[calc(100vh-11rem)] gap-4 xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-6">
            <aside className="hidden xl:block">
              <Sidebar
                setShowLogin={setShowLogin}
                activeSection={navSection}
                onNavigate={handleNavigate}
                onOpenUpload={handleOpenUpload}
              />
            </aside>

            <main className="min-h-0">
              <div
                className="surface-glass panel-edge relative flex h-full flex-col overflow-hidden rounded-[32px] sm:rounded-[38px]"
              >
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-x-0 top-0 h-px bg-white/18" />
                  <div className="absolute inset-y-0 left-0 w-px bg-white/10" />
                  <div className="absolute right-0 top-[8%] h-[24rem] w-[24rem] rounded-full bg-cyan-300/8 blur-3xl" />
                </div>
                <div className="sticky top-0 z-20 border-b border-white/6 bg-[linear-gradient(180deg,rgba(6,11,20,0.96),rgba(6,11,20,0.8))] px-4 pb-3 pt-3 backdrop-blur-2xl sm:px-6 lg:px-10 xl:px-12">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <p className="type-kicker text-slate-300/30">PulseBeat</p>
                        <div className="mt-1.5 flex items-center gap-3">
                          <h2 className="font-display text-[1.08rem] leading-none tracking-[-0.05em] text-white sm:text-[1.2rem]">
                            {navSection === "home"
                              ? "Inicio"
                              : navSection === "library"
                                ? "Explorar"
                                : "Crear"}
                          </h2>
                          <span className="hidden text-sm text-slate-300/38 sm:inline">
                            Descubre, reproduce y organiza tu catalogo
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 lg:w-[38rem]">
                        <label className="state-hover-lift flex h-[44px] min-w-0 flex-1 items-center gap-3 rounded-full border border-white/7 bg-white/[0.04] px-4 backdrop-blur-xl">
                          <Search size={15} className="text-slate-300/52" />
                          <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar canciones o artistas"
                            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400/42"
                          />
                        </label>

                        <button className="btn-icon state-hover-lift flex h-[44px] w-[44px] items-center justify-center rounded-full text-slate-100">
                          <Bell size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {topTabs.map((tab) => (
                        <motion.button
                          key={tab.id}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            tab.id === "upload"
                              ? handleOpenUpload()
                              : handleNavigate(tab.id)
                          }
                          className={`state-hover-lift rounded-full px-4 py-1.5 text-sm font-medium transition sm:px-4.5 ${
                            navSection === tab.id
                              ? "glow-active-soft border border-cyan-300/18 bg-cyan-300/10 text-white"
                              : "border border-white/7 bg-white/[0.035] text-slate-300/68 hover:border-white/12 hover:bg-white/[0.07] hover:text-white"
                          }`}
                        >
                          {tab.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                <Home
                  searchTerm={searchTerm}
                  songsVersion={songsVersion}
                  onOpenUpload={handleOpenUpload}
                  isAuthenticated={isAuthenticated}
                />
              </div>
            </main>
          </div>

          <div className="fixed bottom-3 left-1/2 z-40 w-[calc(100%-0.75rem)] max-w-[1640px] -translate-x-1/2 sm:bottom-5 sm:w-[calc(100%-2.5rem)] xl:w-[calc(100%-4rem)]">
            <Player />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
