import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Disc3,
  Headphones,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { fetchSongs } from "../services/api";
import SongCard from "./SongCard";
import SongList from "./SongList";

const sectionVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function Shelf({ title, caption, songs, onPlay }) {
  if (!songs.length) return null;

  return (
    <motion.section variants={fadeUp} className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="type-kicker text-slate-300/36">{caption}</p>
          <h3 className="mt-2 font-display text-[1.6rem] leading-none tracking-[-0.05em] text-white">
            {title}
          </h3>
        </div>
        <button className="inline-flex items-center gap-2 text-sm text-slate-300/58 transition hover:text-white">
          Ver todo <ArrowRight size={15} />
        </button>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 xl:-mx-12 xl:px-12">
        <div className="flex gap-4">
          {songs.map((song) => (
            <div key={song._id} className="w-[180px] flex-none sm:w-[196px]">
              <SongCard song={song} onPlay={() => onPlay(song)} deleting={false} />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function Home({ searchTerm = "", songsVersion = 0, onOpenUpload }) {
  const [songs, setSongs] = useState([]);
  const { playSong } = usePlayer();

  const loadSongs = async () => {
    const data = await fetchSongs();
    setSongs(data);
  };

  useEffect(() => {
    loadSongs();
  }, [songsVersion]);

  const filteredSongs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return songs;

    return songs.filter((song) =>
      [song.title, song.artist, song.album]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [songs, searchTerm]);

  const featuredSongs = filteredSongs.slice(0, 6);
  const recentSongs = filteredSongs.slice(2, 10);
  const spotlightSongs = filteredSongs.slice(0, 12);
  const focusSongs = filteredSongs.slice(4, 10);

  const topArtists = useMemo(() => {
    const seen = new Map();

    filteredSongs.forEach((song) => {
      if (!seen.has(song.artist)) {
        seen.set(song.artist, song);
      }
    });

    return Array.from(seen.values()).slice(0, 6);
  }, [filteredSongs]);

  const stats = useMemo(
    () => [
      { label: "Pistas", value: filteredSongs.length, icon: Disc3 },
      {
        label: "Artistas",
        value: new Set(filteredSongs.map((song) => song.artist)).size,
        icon: Sparkles,
      },
      { label: "Escucha", value: "Live", icon: Headphones },
    ],
    [filteredSongs]
  );

  const playFromFiltered = (song) => {
    const index = filteredSongs.findIndex((item) => item._id === song._id);
    playSong(song, filteredSongs, index < 0 ? 0 : index);
  };

  return (
    <motion.div
      id="app-scroll-content"
      initial="hidden"
      animate="show"
      variants={sectionVariants}
      className="flex h-full flex-col overflow-y-auto overscroll-contain scroll-smooth"
    >
      <section
        id="home"
        className="relative overflow-hidden px-4 pb-10 pt-7 scroll-mt-28 sm:px-6 sm:pb-12 lg:px-10 xl:px-12"
      >
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            animate={{ opacity: [0.42, 0.6, 0.42], scale: [1, 1.03, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_10%_16%,rgba(45,212,191,0.12),transparent_24%),radial-gradient(circle_at_84%_18%,rgba(129,140,248,0.16),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_60%)]"
          />
        </div>

        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.3fr)_360px] xl:items-end">
          <motion.div variants={fadeUp} className="space-y-5">
            <p className="type-kicker text-slate-300/38">Inicio</p>
            <h1 className="type-hero max-w-4xl text-white">
              Tu musica, mejor presentada.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300/62 sm:text-lg">
              Un home limpio, con foco editorial en portadas, artistas y reproduccion.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="surface-glass rounded-[24px] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-slate-950/28 text-cyan-100">
                  <Icon size={17} />
                </div>
                <p className="mt-5 text-[1.7rem] font-semibold tracking-[-0.05em] text-white">
                  {value}
                </p>
                <p className="mt-1 text-sm text-slate-300/58">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="space-y-10 px-4 pb-12 sm:px-6 lg:px-10 xl:px-12">
        <Shelf
          title="Seleccion destacada"
          caption="Curado para ti"
          songs={featuredSongs}
          onPlay={playFromFiltered}
        />

        {!!topArtists.length && (
          <motion.section variants={fadeUp} className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="type-kicker text-slate-300/36">Artistas</p>
                <h3 className="mt-2 font-display text-[1.6rem] leading-none tracking-[-0.05em] text-white">
                  En rotacion
                </h3>
              </div>
              <button className="inline-flex items-center gap-2 text-sm text-slate-300/58 transition hover:text-white">
                Ver todo <ArrowRight size={15} />
              </button>
            </div>

            <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 xl:-mx-12 xl:px-12">
              <div className="flex gap-4 sm:gap-5">
                {topArtists.map((song) => (
                  <button
                    key={song.artist}
                    onClick={() => playFromFiltered(song)}
                    className="group state-hover-lift w-[148px] flex-none rounded-[26px] border border-white/8 bg-white/[0.04] p-3.5 text-left hover:border-white/14 hover:bg-white/[0.08] sm:w-[164px] sm:p-4"
                  >
                    <div className="overflow-hidden rounded-full border border-white/8 bg-slate-950/24 shadow-[0_16px_42px_rgba(2,6,23,0.28)]">
                      <img
                        src={song.coverUrl}
                        alt={song.artist}
                        className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-4 truncate text-[0.95rem] font-semibold tracking-[-0.03em] text-white">
                      {song.artist}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-300/42">
                      Artista
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        <Shelf
          title="Recientes en tu radar"
          caption="Escucha inmediata"
          songs={recentSongs}
          onPlay={playFromFiltered}
        />

        <section id="library" className="space-y-10 scroll-mt-28">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="type-kicker text-slate-300/36">Coleccion</p>
              <h2 className="mt-2 font-display text-[1.8rem] leading-none tracking-[-0.05em] text-white">
                Biblioteca visual
              </h2>
            </div>
            <p className="text-sm text-slate-300/52">{filteredSongs.length} resultados</p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <motion.div
              variants={fadeUp}
              className="surface-glass panel-edge min-w-0 rounded-[30px] p-5 sm:p-6"
            >
              <SongList songs={spotlightSongs} onDelete={loadSongs} />
            </motion.div>

            <motion.aside variants={fadeUp} className="space-y-4">
              <div className="surface-glass panel-edge rounded-[26px] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-slate-950/30 text-cyan-100">
                    <UploadCloud size={19} />
                  </div>
                  <div>
                    <p className="type-kicker text-cyan-100/52">Crear</p>
                    <h3 className="mt-1 font-display text-[1.35rem] leading-none tracking-[-0.05em] text-white">
                      Publica nueva musica
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300/54">
                  Mantiene la creacion disponible, pero fuera del flujo principal de escucha.
                </p>
                <button
                  onClick={onOpenUpload}
                  className="btn-primary state-hover-lift mt-5 flex w-full items-center justify-center gap-2 rounded-[20px] px-4 py-3 font-medium"
                >
                  <UploadCloud size={16} /> Abrir estudio
                </button>
              </div>

              <div className="surface-glass rounded-[26px] p-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="type-kicker text-slate-300/36">Foco</p>
                    <h3 className="mt-2 font-display text-[1.2rem] leading-none tracking-[-0.05em] text-white">
                      Para seguir escuchando
                    </h3>
                  </div>
                  <button className="text-xs text-slate-300/52 transition hover:text-white">
                    Ver mas
                  </button>
                </div>

                <div className="mt-4 space-y-2.5">
                  {focusSongs.map((song, index) => (
                    <button
                      key={song._id}
                      onClick={() => playFromFiltered(song)}
                      className="state-hover-lift flex w-full items-center gap-3 rounded-[18px] border border-white/6 bg-white/[0.03] p-2.5 text-left hover:border-white/12 hover:bg-white/[0.07]"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          className="h-14 w-14 rounded-[14px] object-cover"
                        />
                        <div className="absolute inset-0 rounded-[14px] bg-gradient-to-t from-slate-950/28 to-transparent" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium tracking-[-0.03em] text-white">
                          {song.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-300/52">
                          {song.artist}
                        </p>
                      </div>
                      <div className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-slate-400/44">
                        0{index + 1}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-white/6 bg-white/[0.03] p-4">
                <p className="type-kicker text-slate-300/34">Sesion</p>
                <h3 className="mt-2 font-display text-[1.1rem] leading-none tracking-[-0.05em] text-white">
                  Para seguir escuchando
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-300/50">
                  Curaduria ligera, acceso rapido y foco total en reproducir.
                </p>
              </div>
            </motion.aside>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

export default Home;
