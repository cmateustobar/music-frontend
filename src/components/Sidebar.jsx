import { motion } from "framer-motion";
import {
  Compass,
  Disc3,
  Home,
  Library,
  LogIn,
  LogOut,
  Sparkles,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Inicio", id: "home" },
  { icon: Compass, label: "Explorar", id: "library" },
  { icon: Library, label: "Crear", id: "upload" },
];

const reveal = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function Sidebar({
  setShowLogin,
  compact = false,
  activeSection = "home",
  onNavigate,
  onOpenUpload,
}) {
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  if (compact) {
    return (
      <motion.div
        initial="hidden"
        animate="show"
        variants={reveal}
        className="surface-glass panel-edge rounded-[28px] p-4"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-gradient-to-br from-cyan-300 via-teal-300 to-violet-300 text-slate-950 shadow-[0_14px_30px_rgba(34,211,238,0.24)]">
              <Disc3 size={20} />
            </div>
            <div>
              <p className="type-kicker text-slate-300/36">PulseBeat</p>
              <h1 className="mt-1 font-display text-lg tracking-[-0.05em] text-white">
                Sound in motion
              </h1>
            </div>
          </div>

          {!token ? (
            <button
              onClick={() => setShowLogin(true)}
              className="btn-primary state-hover-lift rounded-full px-4 py-2 text-sm font-medium"
            >
              Entrar
            </button>
          ) : (
            <button
              onClick={logout}
              className="btn-secondary state-hover-lift rounded-full px-4 py-2 text-sm font-medium"
            >
              Salir
            </button>
          )}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {navItems.map(({ icon: Icon, label, id }) => (
            <button
              key={label}
              onClick={() => (id === "upload" ? onOpenUpload?.() : onNavigate?.(id))}
              className={`state-hover-lift rounded-[18px] border px-3 py-3 text-left transition ${
                activeSection === id
                  ? "glow-active-soft border-cyan-300/18 bg-cyan-300/10 text-white"
                  : "border-white/8 bg-white/[0.04] text-slate-300/70 hover:border-white/14 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-950/30">
                <Icon size={16} />
              </div>
              <p className="mt-3 text-xs font-medium">{label}</p>
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.aside
      initial="hidden"
      animate="show"
      variants={reveal}
      className="surface-glass panel-edge flex h-full flex-col rounded-[38px] p-4"
    >
      <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-gradient-to-br from-cyan-300 via-teal-300 to-violet-300 text-slate-950 shadow-[0_14px_30px_rgba(34,211,238,0.24)]">
            <Disc3 size={22} />
          </div>
          <div>
            <p className="type-kicker text-slate-300/36">PulseBeat</p>
            <h1 className="mt-1 font-display text-[1.4rem] leading-none tracking-[-0.05em] text-white">
              Sound gallery
            </h1>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-300/58">
          Un acceso limpio a tu biblioteca, exploración y creación.
        </p>
      </div>

      <nav className="mt-6 flex flex-col gap-2.5">
        {navItems.map(({ icon: Icon, label, id }) => (
          <button
            key={label}
            onClick={() => (id === "upload" ? onOpenUpload?.() : onNavigate?.(id))}
            className={`group state-hover-lift flex items-center gap-3 rounded-[22px] border px-4 py-3.5 text-left transition ${
              activeSection === id
                ? "glow-active-soft border-cyan-300/18 bg-cyan-300/10 text-white"
                : "border-white/8 bg-white/[0.04] text-slate-300/70 hover:border-white/14 hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-slate-950/30 transition group-hover:bg-cyan-300/12">
              <Icon size={17} />
            </div>
            <span className="text-sm font-medium tracking-[-0.02em]">{label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-6 rounded-[26px] border border-white/8 bg-[linear-gradient(160deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-5">
        <div className="flex items-center gap-2 text-cyan-100">
          <Sparkles size={16} />
          <p className="type-kicker text-cyan-100/60">Curaduría</p>
        </div>
        <p className="mt-3 font-display text-[1.25rem] leading-tight tracking-[-0.04em] text-white">
          Menos interfaz.
          <br />
          Más música.
        </p>
      </div>

      <div className="mt-auto pt-6">
        {!token ? (
          <button
            onClick={() => setShowLogin(true)}
            className="btn-primary state-hover-lift flex w-full items-center justify-center gap-2 rounded-[22px] px-4 py-3.5 font-medium"
          >
            <LogIn size={18} /> Entrar
          </button>
        ) : (
          <button
            onClick={logout}
            className="btn-secondary state-hover-lift flex w-full items-center justify-center gap-2 rounded-[22px] px-4 py-3.5 font-medium"
          >
            <LogOut size={18} /> Cerrar sesión
          </button>
        )}
      </div>
    </motion.aside>
  );
}

export default Sidebar;
