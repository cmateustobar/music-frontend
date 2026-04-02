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
  // 🎧 INIT AUDIO (singleton)
  // =========================
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    const savedVolume = localStorage.getItem("volume");
    if (savedVolume) audio.volume = Number(savedVolume);

    // 🎯 EVENTOS CENTRALIZADOS
    const updateTime = () => {
      setCurrentTime(audio.currentTime || 0);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => nextSong();
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.pause();
      audio.src = "";

      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  // =========================
  // 🔗 URL FIX (Cloudinary + local)
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
  // ▶️ PLAY (ANTI-RACE CONDITION)
  // =========================
  const playSong = async (song, list = [], index = 0) => {
    if (!song || !audioRef.current) return;

    const audio = audioRef.current;

    try {
      audio.pause();
      setIsBuffering(true);

      const url = getFullUrl(song.audioUrl || song.audio);
      if (!url) return;

      audio.src = url;
      audio.currentTime = 0;

      setCurrentSong(song);
      setQueue(list);
      setQueueIndex(index);

      addToHistory(song);

      await audio.play();

      setIsPlaying(true);
      setIsBuffering(false);

    } catch (err) {
      console.warn("Error en reproducción:", err);
      setIsPlaying(false);
      setIsBuffering(false);
    }
  };

  // =========================
  // ⏯️ TOGGLE (SIN BUG)
  // =========================
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (err) {
      console.warn("Error toggle:", err);
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
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = time;
    setCurrentTime(time);
  };

  // =========================
  // 🔊 VOLUMEN (persistente)
  // =========================
  const setVolume = (value) => {
    const audio = audioRef.current;
    if (!audio) return;

    const v = Math.max(0, Math.min(1, value));
    audio.volume = v;
    localStorage.setItem("volume", v);
  };

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

export const usePlayer = () => useContext(PlayerContext);