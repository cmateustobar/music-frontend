import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export const PlayerContext = createContext();

const BASE_URL = import.meta.env.VITE_API_URL || "";
const DEFAULT_VOLUME = 0.7;
const CROSSFADE_DURATION_MS = 1200;

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
const clampVolume = (value) => clamp(value, 0, 1);

const readStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export const PlayerProvider = ({ children }) => {
  const primaryAudioRef = useRef(null);
  const secondaryAudioRef = useRef(null);
  const activeAudioRef = useRef(null);
  const isMountedRef = useRef(true);
  const rafProgressRef = useRef(null);
  const rafCrossfadeRef = useRef(null);
  const progressSnapshotRef = useRef({ currentTime: 0, duration: 0 });
  const isTransitioningRef = useRef(false);

  const queueRef = useRef([]);
  const queueIndexRef = useRef(0);
  const currentSongRef = useRef(null);
  const isShuffleRef = useRef(false);
  const volumeRef = useRef(DEFAULT_VOLUME);
  const preloadedTrackRef = useRef({
    url: "",
    index: -1,
    ready: false,
  });

  if (!primaryAudioRef.current) {
    primaryAudioRef.current = new Audio();
  }

  if (!secondaryAudioRef.current) {
    secondaryAudioRef.current = new Audio();
  }

  if (!activeAudioRef.current) {
    activeAudioRef.current = primaryAudioRef.current;
  }

  const [currentSong, setCurrentSong] = useState(() =>
    readStorage("currentSong", null)
  );
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
  const [favorites, setFavorites] = useState(() =>
    readStorage("favorites", [])
  );

  const updateStateIfMounted = useCallback((updater) => {
    if (!isMountedRef.current) return;
    updater();
  }, []);

  const getFullUrl = useCallback(
    (url) => (url.startsWith("http") ? url : `${BASE_URL}${url}`),
    []
  );

  const getInactiveAudio = useCallback(() => {
    return activeAudioRef.current === primaryAudioRef.current
      ? secondaryAudioRef.current
      : primaryAudioRef.current;
  }, []);

  const setAudioVolume = useCallback((audio, nextVolume) => {
    audio.volume = clampVolume(nextVolume);
  }, []);

  const clearCrossfade = useCallback(() => {
    if (rafCrossfadeRef.current) {
      cancelAnimationFrame(rafCrossfadeRef.current);
      rafCrossfadeRef.current = null;
    }

    if (!isTransitioningRef.current) return;

    const enteringAudio = getInactiveAudio();
    enteringAudio.pause();
    enteringAudio.currentTime = 0;
    setAudioVolume(enteringAudio, 0);
    setAudioVolume(activeAudioRef.current, volumeRef.current);
    isTransitioningRef.current = false;
  }, [getInactiveAudio, setAudioVolume]);

  const clearPreloadedTrack = useCallback(
    (audio = getInactiveAudio()) => {
      preloadedTrackRef.current = {
        url: "",
        index: -1,
        ready: false,
      };

      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    },
    [getInactiveAudio]
  );

  const syncQueueState = useCallback((list, index) => {
    queueRef.current = list;
    queueIndexRef.current = index;
    setQueue(list);
    setQueueIndex(index);
  }, []);

  const syncSongState = useCallback((song) => {
    currentSongRef.current = song;
    setCurrentSong(song);
  }, []);

  const syncProgressNow = useCallback(
    (audio) => {
      progressSnapshotRef.current = {
        currentTime: audio.currentTime || 0,
        duration: audio.duration || 0,
      };

      updateStateIfMounted(() => {
        setCurrentTime(progressSnapshotRef.current.currentTime);
        setDuration(progressSnapshotRef.current.duration);
      });
    },
    [updateStateIfMounted]
  );

  const syncPlaybackFlags = useCallback(
    (audio) => {
      updateStateIfMounted(() => {
        setIsPlaying(
          !audio.paused &&
            !audio.ended &&
            audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
        );
      });
    },
    [updateStateIfMounted]
  );

  const scheduleProgressSync = useCallback(
    (audio) => {
      if (audio !== activeAudioRef.current) return;

      const nextSnapshot = {
        currentTime: audio.currentTime || 0,
        duration: audio.duration || 0,
      };
      const previousSnapshot = progressSnapshotRef.current;

      if (
        previousSnapshot.currentTime === nextSnapshot.currentTime &&
        previousSnapshot.duration === nextSnapshot.duration
      ) {
        return;
      }

      progressSnapshotRef.current = nextSnapshot;

      if (rafProgressRef.current) return;

      rafProgressRef.current = requestAnimationFrame(() => {
        rafProgressRef.current = null;

        updateStateIfMounted(() => {
          setCurrentTime(progressSnapshotRef.current.currentTime);
          setDuration(progressSnapshotRef.current.duration);
        });
      });
    },
    [updateStateIfMounted]
  );

  const getNextIndex = useCallback(
    (list, index, shuffleEnabled = isShuffleRef.current) => {
      if (!list.length) return -1;

      if (shuffleEnabled) {
        if (list.length === 1) return 0;

        let randomIndex = Math.floor(Math.random() * list.length);
        while (randomIndex === index) {
          randomIndex = Math.floor(Math.random() * list.length);
        }
        return randomIndex;
      }

      return (index + 1) % list.length;
    },
    []
  );

  const prepareAudio = useCallback((audio, url, startAt = 0) => {
    const shouldReload = audio.src !== url;

    if (shouldReload) {
      audio.pause();
      audio.src = url;
      audio.load();
    }

    audio.currentTime = startAt;
  }, []);

  const primeNextSong = useCallback(
    (list, index) => {
      const inactiveAudio = getInactiveAudio();
      const nextIndex = getNextIndex(list, index);

      if (nextIndex < 0) {
        clearPreloadedTrack(inactiveAudio);
        return;
      }

      const nextSong = list[nextIndex];
      if (!nextSong?.audioUrl) {
        clearPreloadedTrack(inactiveAudio);
        return;
      }

      const nextUrl = getFullUrl(nextSong.audioUrl);
      const currentPreload = preloadedTrackRef.current;

      if (
        currentPreload.index === nextIndex &&
        currentPreload.url === nextUrl &&
        inactiveAudio.src === nextUrl
      ) {
        return;
      }

      inactiveAudio.pause();
      inactiveAudio.currentTime = 0;
      inactiveAudio.muted = activeAudioRef.current?.muted ?? false;
      setAudioVolume(inactiveAudio, volumeRef.current);
      preloadedTrackRef.current = {
        url: nextUrl,
        index: nextIndex,
        ready: false,
      };
      inactiveAudio.src = nextUrl;
      inactiveAudio.load();
    },
    [clearPreloadedTrack, getFullUrl, getInactiveAudio, getNextIndex, setAudioVolume]
  );

  const runCrossfade = useCallback(
    (fromAudio, toAudio, onComplete) => {
      clearCrossfade();
      isTransitioningRef.current = true;
      setAudioVolume(fromAudio, volumeRef.current);
      setAudioVolume(toAudio, 0);

      const start = performance.now();

      const step = (now) => {
        const progress = Math.min(
          (now - start) / CROSSFADE_DURATION_MS,
          1
        );

        setAudioVolume(fromAudio, volumeRef.current * (1 - progress));
        setAudioVolume(toAudio, volumeRef.current * progress);

        if (progress < 1) {
          rafCrossfadeRef.current = requestAnimationFrame(step);
          return;
        }

        rafCrossfadeRef.current = null;
        fromAudio.pause();
        fromAudio.currentTime = 0;
        setAudioVolume(fromAudio, 0);
        activeAudioRef.current = toAudio;
        setAudioVolume(toAudio, volumeRef.current);
        isTransitioningRef.current = false;
        onComplete();
      };

      rafCrossfadeRef.current = requestAnimationFrame(step);
    },
    [clearCrossfade, setAudioVolume]
  );

  const playSong = useCallback(
    async (song, list = [], index = 0, options = {}) => {
      if (!song?.audioUrl) return;

      const activeAudio = activeAudioRef.current;
      const inactiveAudio = getInactiveAudio();
      const nextUrl = getFullUrl(song.audioUrl);
      const preloadedTrack = preloadedTrackRef.current;
      const canUsePreloaded =
        preloadedTrack.ready &&
        preloadedTrack.index === index &&
        preloadedTrack.url === nextUrl &&
        inactiveAudio.src === nextUrl;
      const currentSongId = currentSongRef.current?._id;
      const shouldCrossfade =
        options.crossfade ??
        Boolean(
          currentSongId &&
            currentSongId !== song._id &&
            activeAudio.src &&
            !activeAudio.paused
        );

      syncQueueState(list, index);

      if (shouldCrossfade && canUsePreloaded) {
        setAudioVolume(inactiveAudio, 0);

        try {
          inactiveAudio.muted = activeAudio.muted;
          await inactiveAudio.play();
        } catch {
          inactiveAudio.pause();
          setAudioVolume(inactiveAudio, 0);
        }

        if (!inactiveAudio.paused) {
          runCrossfade(activeAudio, inactiveAudio, () => {
            if (!isMountedRef.current) return;

            preloadedTrackRef.current = {
              url: "",
              index: -1,
              ready: false,
            };
            syncSongState(song);
            syncProgressNow(inactiveAudio);
            syncPlaybackFlags(inactiveAudio);
            primeNextSong(list, index);
          });
          return;
        }
      }

      clearCrossfade();
      activeAudioRef.current = activeAudio;
      prepareAudio(activeAudio, nextUrl, 0);
      activeAudio.muted = false;
      setAudioVolume(activeAudio, volumeRef.current);
      preloadedTrackRef.current = {
        url: "",
        index: -1,
        ready: false,
      };
      progressSnapshotRef.current = { currentTime: 0, duration: 0 };

      syncSongState(song);
      setCurrentTime(0);
      setDuration(0);

      try {
        await activeAudio.play();
        primeNextSong(list, index);
      } catch {
        updateStateIfMounted(() => {
          setIsPlaying(false);
        });
      }
    },
    [
      clearCrossfade,
      getFullUrl,
      getInactiveAudio,
      prepareAudio,
      primeNextSong,
      runCrossfade,
      setAudioVolume,
      syncPlaybackFlags,
      syncProgressNow,
      syncQueueState,
      syncSongState,
      updateStateIfMounted,
    ]
  );

  const playNextFromRefs = useCallback(
    (options = {}) => {
      const currentQueue = queueRef.current;

      if (!currentQueue.length) {
        updateStateIfMounted(() => {
          setIsPlaying(false);
        });
        return;
      }

      const safeIndex = clamp(
        queueIndexRef.current,
        0,
        currentQueue.length - 1
      );
      const nextIndex = getNextIndex(currentQueue, safeIndex);
      const nextSong = currentQueue[nextIndex];

      if (!nextSong) {
        updateStateIfMounted(() => {
          setIsPlaying(false);
        });
        return;
      }

      playSong(nextSong, currentQueue, nextIndex, options);
    },
    [getNextIndex, playSong, updateStateIfMounted]
  );

  const prevSong = useCallback(() => {
    const currentQueue = queueRef.current;
    if (!currentQueue.length) return;

    let prevIndex = queueIndexRef.current - 1;
    if (prevIndex < 0) prevIndex = currentQueue.length - 1;

    playSong(currentQueue[prevIndex], currentQueue, prevIndex, {
      crossfade: true,
    });
  }, [playSong]);

  const nextSong = useCallback(() => {
    playNextFromRefs({ crossfade: true });
  }, [playNextFromRefs]);

  const togglePlay = useCallback(async () => {
    const audio = activeAudioRef.current;
    if (!audio?.src) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        updateStateIfMounted(() => {
          setIsPlaying(false);
        });
      }
      return;
    }

    audio.pause();
    updateStateIfMounted(() => {
      setIsPlaying(false);
    });
  }, [updateStateIfMounted]);

  const seek = useCallback((time) => {
    const audio = activeAudioRef.current;
    if (!audio || !Number.isFinite(time)) return;

    const safeTime = clamp(time, 0, audio.duration || 0);
    audio.currentTime = safeTime;
    progressSnapshotRef.current = {
      currentTime: safeTime,
      duration: audio.duration || 0,
    };
    setCurrentTime(safeTime);
  }, []);

  const setVolume = useCallback(
    (nextVolume) => {
      const safeVolume = clampVolume(nextVolume);
      volumeRef.current = safeVolume;
      setVolumeState(safeVolume);
      setAudioVolume(primaryAudioRef.current, safeVolume);
      setAudioVolume(secondaryAudioRef.current, safeVolume);
    },
    [setAudioVolume]
  );

  const toggleFavorite = useCallback((song) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item._id === song._id);
      if (exists) return prev.filter((item) => item._id !== song._id);
      return [...prev, song];
    });
  }, []);

  const favoriteIds = useMemo(
    () => new Set(favorites.map((song) => song._id)),
    [favorites]
  );

  const isFavorite = useCallback(
    (song) => favoriteIds.has(song._id),
    [favoriteIds]
  );

  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    queueIndexRef.current = queueIndex;
  }, [queueIndex]);

  useEffect(() => {
    isShuffleRef.current = isShuffle;
  }, [isShuffle]);

  useEffect(() => {
    if (isTransitioningRef.current) return;
    primeNextSong(queue, queueIndex);
  }, [primeNextSong, queue, queueIndex, isShuffle]);

  useEffect(() => {
    if (currentSong) {
      localStorage.setItem("currentSong", JSON.stringify(currentSong));
    }
  }, [currentSong]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    isMountedRef.current = true;

    const primaryAudio = primaryAudioRef.current;
    const secondaryAudio = secondaryAudioRef.current;
    const audios = [primaryAudio, secondaryAudio];

    audios.forEach((audio, index) => {
      audio.preload = index === 0 ? "metadata" : "auto";
      setAudioVolume(audio, volumeRef.current);
    });

    const handleProgress = (event) => {
      scheduleProgressSync(event.currentTarget);
    };

    const handlePlaying = (event) => {
      const audio = event.currentTarget;
      if (audio !== activeAudioRef.current) return;
      syncProgressNow(audio);
      syncPlaybackFlags(audio);
    };

    const handlePause = (event) => {
      const audio = event.currentTarget;
      if (audio !== activeAudioRef.current) return;
      updateStateIfMounted(() => {
        setIsPlaying(false);
      });
    };

    const handleEmptied = (event) => {
      const audio = event.currentTarget;
      if (audio !== activeAudioRef.current) return;

      progressSnapshotRef.current = { currentTime: 0, duration: 0 };
      updateStateIfMounted(() => {
        setCurrentTime(0);
        setDuration(0);
      });
    };

    const handleEnded = (event) => {
      const audio = event.currentTarget;
      if (audio !== activeAudioRef.current || isTransitioningRef.current) return;

      progressSnapshotRef.current = {
        currentTime: audio.duration || audio.currentTime || 0,
        duration: audio.duration || 0,
      };

      updateStateIfMounted(() => {
        setIsPlaying(false);
        setCurrentTime(progressSnapshotRef.current.currentTime);
        setDuration(progressSnapshotRef.current.duration);
      });

      playNextFromRefs({ crossfade: true });
    };

    const handlePreloadReady = (event) => {
      const audio = event.currentTarget;
      if (audio !== getInactiveAudio()) return;

      preloadedTrackRef.current = {
        ...preloadedTrackRef.current,
        ready: audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA,
      };
    };

    audios.forEach((audio) => {
      audio.addEventListener("timeupdate", handleProgress);
      audio.addEventListener("loadedmetadata", handleProgress);
      audio.addEventListener("durationchange", handleProgress);
      audio.addEventListener("playing", handlePlaying);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("emptied", handleEmptied);
      audio.addEventListener("loadeddata", handlePreloadReady);
      audio.addEventListener("canplay", handlePreloadReady);
      audio.addEventListener("canplaythrough", handlePreloadReady);
    });

    return () => {
      isMountedRef.current = false;

      if (rafCrossfadeRef.current) {
        cancelAnimationFrame(rafCrossfadeRef.current);
        rafCrossfadeRef.current = null;
      }

      if (rafProgressRef.current) {
        cancelAnimationFrame(rafProgressRef.current);
        rafProgressRef.current = null;
      }

      isTransitioningRef.current = false;
      preloadedTrackRef.current = { url: "", index: -1, ready: false };
      queueRef.current = [];
      queueIndexRef.current = 0;
      progressSnapshotRef.current = { currentTime: 0, duration: 0 };
      activeAudioRef.current = primaryAudio;

      audios.forEach((audio) => {
        audio.removeEventListener("timeupdate", handleProgress);
        audio.removeEventListener("loadedmetadata", handleProgress);
        audio.removeEventListener("durationchange", handleProgress);
        audio.removeEventListener("playing", handlePlaying);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("emptied", handleEmptied);
        audio.removeEventListener("loadeddata", handlePreloadReady);
        audio.removeEventListener("canplay", handlePreloadReady);
        audio.removeEventListener("canplaythrough", handlePreloadReady);
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      });
    };
  }, [
    getInactiveAudio,
    playNextFromRefs,
    scheduleProgressSync,
    setAudioVolume,
    syncPlaybackFlags,
    syncProgressNow,
    updateStateIfMounted,
  ]);

  const contextValue = useMemo(
    () => ({
      currentSong,
      isPlaying,
      isShuffle,
      currentTime,
      duration,
      volume,
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
    }),
    [
      currentSong,
      isPlaying,
      isShuffle,
      currentTime,
      duration,
      volume,
      favorites,
      playSong,
      togglePlay,
      nextSong,
      prevSong,
      seek,
      setVolume,
      toggleFavorite,
      isFavorite,
    ]
  );

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
