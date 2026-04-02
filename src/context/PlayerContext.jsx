import { createContext, useContext, useEffect, useRef, useState } from "react";

const PlayerContext = createContext();
const BASE_URL = import.meta.env.VITE_API_URL;

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const nextAudioRef = useRef(new Audio());

  const [currentSong, setCurrentSong] = useState(null);

  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);

  // 🔥 NUEVO
  const [isShuffle, setIsShuffle] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState([]);

  const getFullUrl = (url) => {
    if (!url) return "";
    const finalUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
    return `${finalUrl}?t=${Date.now()}`;
  };

  const addToHistory = (song) => {
    setHistory((prev) => {
      const updated = [song, ...prev.filter((s) => s._id !== song._id)];
      return updated.slice(0, 20);
    });
  };

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

  const toggleShuffle = () => setIsShuffle((prev) => !prev);

  const playSong = (song, list = [], index = 0) => {
    const audio = audioRef.current;

    const src = getFullUrl(song.audioUrl || song.audio);

    audio.pause();
    audio.currentTime = 0;
    audio.src = src;
    audio.load();

    setIsBuffering(true);

    audio.onloadeddata = () => {
      audio.play();
      setIsPlaying(true);
      setIsBuffering(false);
    };

    setQueue(list);
    setQueueIndex(index);
    setCurrentSong(song);

    addToHistory(song);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    const nextAudio = nextAudioRef.current;

    if (isPlaying) {
      audio.pause();
      nextAudio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const crossfadeToNext = () => {
    if (queue.length === 0) return;

    let nextIndex;

    if (isShuffle) {
      let random;
      do {
        random = Math.floor(Math.random() * queue.length);
      } while (random === queueIndex && queue.length > 1);

      nextIndex = random;
    } else {
      if (queueIndex >= queue.length - 1) return;
      nextIndex = queueIndex + 1;
    }

    const currentAudio = audioRef.current;
    const nextAudio = nextAudioRef.current;

    const next = queue[nextIndex];
    const nextSrc = getFullUrl(next.audioUrl || next.audio);

    nextAudio.pause();
    nextAudio.currentTime = 0;
    nextAudio.src = nextSrc;
    nextAudio.volume = 0;

    nextAudio.play();

    let fade = 0;

    const interval = setInterval(() => {
      fade += 0.05;

      const currentVol = Math.max(0, Math.min(1, 1 - fade));
      const nextVol = Math.max(0, Math.min(1, fade));

      currentAudio.volume = currentVol;
      nextAudio.volume = nextVol;

      if (fade >= 1) {
        clearInterval(interval);

        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.src = "";

        audioRef.current = nextAudio;
        nextAudioRef.current = new Audio();

        setQueueIndex(nextIndex);
        setCurrentSong(next);
        setIsPlaying(true);

        addToHistory(next);
      }
    }, 100);
  };

  const nextSong = () => crossfadeToNext();

  const prevSong = () => {
    if (queueIndex > 0) {
      playSong(queue[queueIndex - 1], queue, queueIndex - 1);
    }
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const setVolume = (value) => {
    const v = Math.max(0, Math.min(1, value));
    audioRef.current.volume = v;
    nextAudioRef.current.volume = v;
    localStorage.setItem("volume", v);
  };

  useEffect(() => {
    const audio = audioRef.current;

    const savedVolume = localStorage.getItem("volume");
    if (savedVolume) {
      const v = Number(savedVolume);
      audio.volume = v;
      nextAudioRef.current.volume = v;
    }

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => crossfadeToNext();
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

        // 🔥 nuevos
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