import { createContext, useContext, useEffect, useRef, useState } from "react";

export const PlayerContext = createContext();

const BASE_URL = import.meta.env.VITE_API_URL || "";

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);

  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);

  const [isShuffle, setIsShuffle] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState([]);

  // =========================
  // 🎧 INIT AUDIO
  // =========================
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    const savedVolume = localStorage.getItem("volume");
    if (savedVolume) audio.volume = Number(savedVolume);

    const updateTime = () => {
      setCurrentTime(audio.currentTime || 0);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);
    audio.addEventListener("ended", () => nextSong());
    audio.addEventListener("playing", () => {
      setIsPlaying(true);
      setIsBuffering(false);
    });
    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("waiting", () => setIsBuffering(true));

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // =========================
  // 🔗 URL
  // =========================
  const getFullUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${BASE_URL}${url}`;
  };

  // =========================
  // ▶️ PLAY (FIX REAL)
  // =========================
  const playSong = (song, list = [], index = 0) => {
    if (!song || !audioRef.current) return;

    const audio = audioRef.current;

    console.log("🎧 Click canción:", song);

    const rawUrl = song.audioUrl || song.audio || song.url;

    if (!rawUrl) {
      console.error("❌ No hay URL de audio:", song);
      return;
    }

    const url = getFullUrl(rawUrl);

    console.log("🔗 URL final:", url);

    // 🔥 RESET TOTAL
    audio.pause();
    audio.src = url;
    audio.currentTime = 0;

    setCurrentSong(song);
    setQueue(list);
    setQueueIndex(index);

    addToHistory(song);

    // 🔥 CLAVE PARA QUE FUNCIONE EN VERCEL
    audio.load();

    audio
      .play()
      .then(() => {
        console.log("✅ Reproduciendo OK");
      })
      .catch((err) => {
        console.error("❌ Error play():", err);
      });
  };

  // =========================
  // 🕓 HISTORY
  // =========================
  const addToHistory = (song) => {
    setHistory((prev) => {
      const updated = [song, ...prev.filter((s) => s._id !== song._id)];
      return updated.slice(0, 20);
    });
  };

  // =========================
  // ⏯️ TOGGLE
  // =========================
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  // =========================
  // ⏭️ NEXT
  // =========================
  const nextSong = () => {
    if (queue.length === 0) return;

    const nextIndex = isShuffle
      ? Math.floor(Math.random() * queue.length)
      : (queueIndex + 1) % queue.length;

    playSong(queue[nextIndex], queue, nextIndex);
  };

  // =========================
  // ⏮️ PREV
  // =========================
  const prevSong = () => {
    if (queue.length === 0) return;

    const prevIndex =
      queueIndex === 0 ? queue.length - 1 : queueIndex - 1;

    playSong(queue[prevIndex], queue, prevIndex);
  };

  // =========================
  // ⏱️ SEEK
  // =========================
  const seek = (time) => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // =========================
  // 🔊 VOLUMEN
  // =========================
  const setVolume = (value) => {
    if (!audioRef.current) return;

    const v = Math.max(0, Math.min(1, value));
    audioRef.current.volume = v;
    localStorage.setItem("volume", v);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        queue,
        queueIndex,
        isPlaying,
        currentTime,
        duration,
        isBuffering,

        playSong,
        togglePlay,
        nextSong,
        prevSong,
        seek,
        setVolume,

        isShuffle,
        setIsShuffle,

        favorites,
        history,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);