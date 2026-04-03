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
  // INIT AUDIO
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
  // URL FIX (CRÍTICO)
  // =========================
  const getFullUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${BASE_URL}${url}`;
  };

  // =========================
  // PRELOAD SIGUIENTE
  // =========================
  useEffect(() => {
    if (!queue.length) return;

    const next = queue[queueIndex + 1];
    if (next?.audioUrl) {
      const audio = new Audio();
      audio.src = getFullUrl(next.audioUrl);
      audio.preload = "auto";
    }
  }, [queueIndex]);

  // =========================
  // HISTORY
  // =========================
  const addToHistory = (song) => {
    setHistory((prev) => {
      const updated = [song, ...prev.filter((s) => s._id !== song._id)];
      return updated.slice(0, 20);
    });
  };

  // =========================
  // PLAY
  // =========================
  const playSong = (song, list = [], index = 0) => {
    if (!song || !audioRef.current) return;

    const audio = audioRef.current;

    const rawUrl = song.audioUrl || song.audio || song.url;
    if (!rawUrl) return;

    const url = getFullUrl(rawUrl);

    audio.pause();
    audio.src = url;
    audio.currentTime = 0;

    setCurrentSong(song);
    setQueue(list);
    setQueueIndex(index);

    addToHistory(song);

    audio.load();

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const nextSong = () => {
    if (!queue.length) return;

    const nextIndex = isShuffle
      ? Math.floor(Math.random() * queue.length)
      : (queueIndex + 1) % queue.length;

    playSong(queue[nextIndex], queue, nextIndex);
  };

  const prevSong = () => {
    if (!queue.length) return;

    const prevIndex =
      queueIndex === 0 ? queue.length - 1 : queueIndex - 1;

    playSong(queue[prevIndex], queue, prevIndex);
  };

  const seek = (time) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

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