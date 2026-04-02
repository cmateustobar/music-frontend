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
  // 🎧 INIT AUDIO (IMPORTANTE)
  // =========================
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = "auto";

    const savedVolume = localStorage.getItem("volume");
    if (savedVolume) {
      audioRef.current.volume = Number(savedVolume);
    }

    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  // =========================
  // 🔗 URL FIX
  // =========================
  const getFullUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${BASE_URL}${url}`;
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
  // ❤️ FAVORITOS
  // =========================
  const toggleFavorite = (song) => {
    let updated;

    if (favorites.find((s) => s._id === song._id)) {
      updated = favorites.filter((s) => s._id !== song._id);
    } else {
      updated = [...favorites, song];
    }

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // =========================
  // 🔀 SHUFFLE
  // =========================
  const toggleShuffle = () => setIsShuffle((prev) => !prev);

  // =========================
  // ▶️ PLAY
  // =========================
  const playSong = (song, list = [], index = 0) => {
    if (!song || !audioRef.current) return;

    const audio = audioRef.current;

    try {
      audio.pause();

      const url = getFullUrl(song.audioUrl || song.audio);
      if (!url) return;

      audio.src = url;
      audio.currentTime = 0;

      setIsBuffering(true);

      audio.onloadeddata = () => {
        audio.play()
          .then(() => {
            setIsPlaying(true);
            setIsBuffering(false);
          })
          .catch((err) => {
            console.warn("Autoplay bloqueado:", err);
            setIsPlaying(false);
            setIsBuffering(false);
          });
      };

      setQueue(list);
      setQueueIndex(index);
      setCurrentSong(song);

      addToHistory(song);

    } catch (err) {
      console.error("Error en playSong:", err);
    }
  };

  // =========================
  // ⏯️ PLAY / PAUSE
  // =========================
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // =========================
  // ⏭️ NEXT
  // =========================
  const nextSong = () => {
    if (queue.length === 0) return;

    let nextIndex;

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (queueIndex + 1) % queue.length;
    }

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

  // =========================
  // 🎧 EVENTOS AUDIO
  // =========================
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime || 0);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => nextSong();
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
    };
  }, [queueIndex, queue, isShuffle]);

  // =========================
  // 🎯 PROVIDER
  // =========================
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
        toggleShuffle,

        favorites,
        toggleFavorite,
        history,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

// Hook limpio (OBLIGATORIO usar este)
export const usePlayer = () => useContext(PlayerContext);