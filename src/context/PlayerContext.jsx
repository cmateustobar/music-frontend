import { createContext, useContext, useEffect, useRef, useState } from "react";

export const PlayerContext = createContext();

const BASE_URL = import.meta.env.VITE_API_URL || "";

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());

  const [currentSong, setCurrentSong] = useState(() => {
    const saved = localStorage.getItem("currentSong");
    return saved ? JSON.parse(saved) : null;
  });

  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // =========================
  // GUARDAR ESTADO
  // =========================
  useEffect(() => {
    if (currentSong) {
      localStorage.setItem("currentSong", JSON.stringify(currentSong));
    }
  }, [currentSong]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // =========================
  // AUDIO INIT
  // =========================
  useEffect(() => {
    const audio = audioRef.current;

    const update = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", update);
    audio.addEventListener("ended", nextSong);

    return () => {
      audio.pause();
    };
  }, []);

  const getFullUrl = (url) =>
    url.startsWith("http") ? url : `${BASE_URL}${url}`;

  // =========================
  // PLAY
  // =========================
  const playSong = (song, list = [], index = 0) => {
    const audio = audioRef.current;

    const url = getFullUrl(song.audioUrl);

    audio.src = url;
    audio.play();

    setCurrentSong(song);
    setQueue(list);
    setQueueIndex(index);
    setIsPlaying(true);
  };

  // =========================
  // CONTROLES
  // =========================
  const togglePlay = () => {
    const audio = audioRef.current;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const nextSong = () => {
    if (!queue.length) return;

    let next =
      isShuffle
        ? Math.floor(Math.random() * queue.length)
        : (queueIndex + 1) % queue.length;

    playSong(queue[next], queue, next);
  };

  const prevSong = () => {
    if (!queue.length) return;

    let prev = queueIndex - 1;
    if (prev < 0) prev = queue.length - 1;

    playSong(queue[prev], queue, prev);
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
  };

  const setVolume = (v) => {
    audioRef.current.volume = v;
  };

  // =========================
  // FAVORITOS
  // =========================
  const toggleFavorite = (song) => {
    setFavorites((prev) => {
      const exists = prev.find((s) => s._id === song._id);
      if (exists) return prev.filter((s) => s._id !== song._id);
      return [...prev, song];
    });
  };

  const isFavorite = (song) => {
    return favorites.some((s) => s._id === song._id);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        isShuffle,
        currentTime,
        duration,
        favorites,

        playSong,
        togglePlay,
        nextSong,
        prevSong,
        seek,
        setVolume,
        setIsShuffle,

        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);