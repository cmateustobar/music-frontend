import { createContext, useContext, useEffect, useRef, useState } from "react";

export const PlayerContext = createContext();

const BASE_URL = import.meta.env.VITE_API_URL || "";

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());

  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  // =========================
  // INIT AUDIO
  // =========================
  useEffect(() => {
    const audio = audioRef.current;
    audio.preload = "auto";

    const updateTime = () => {
      setCurrentTime(audio.currentTime || 0);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);

    audio.addEventListener("playing", () => {
      setIsPlaying(true);
      setIsBuffering(false);
    });

    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("waiting", () => setIsBuffering(true));

    audio.addEventListener("ended", () => {
      nextSong();
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // =========================
  // URL FIX
  // =========================
  const getFullUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${BASE_URL}${url}`;
  };

  // =========================
  // PLAY SONG (FIX DEFINITIVO)
  // =========================
  const playSong = (song, list = [], index = 0) => {
    if (!song) return;

    const audio = audioRef.current;

    const rawUrl = song.audioUrl || song.audio || song.url;
    if (!rawUrl) {
      console.error("No hay URL de audio en la canción");
      return;
    }

    const url = getFullUrl(rawUrl);

    // 🔥 RESET LIMPIO
    audio.pause();
    audio.src = "";
    audio.load();

    audio.src = url;
    audio.currentTime = 0;

    setQueue(list);
    setQueueIndex(index);
    setCurrentSong(song);

    audio.load();

    audio.play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.error("Error al reproducir:", err);
        setIsPlaying(false);
      });
  };

  // =========================
  // CONTROLES
  // =========================
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio.src) return;

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const nextSong = () => {
    if (!queue.length) return;

    let nextIndex;

    if (isShuffle) {
      do {
        nextIndex = Math.floor(Math.random() * queue.length);
      } while (nextIndex === queueIndex && queue.length > 1);
    } else {
      nextIndex = (queueIndex + 1) % queue.length;
    }

    playSong(queue[nextIndex], queue, nextIndex);
  };

  const prevSong = () => {
    if (!queue.length) return;

    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) prevIndex = queue.length - 1;

    playSong(queue[prevIndex], queue, prevIndex);
  };

  const seek = (time) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const setVolume = (value) => {
    const audio = audioRef.current;
    if (!audio) return;

    const v = Math.max(0, Math.min(1, value));
    audio.volume = v;
    localStorage.setItem("volume", v);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
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
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);