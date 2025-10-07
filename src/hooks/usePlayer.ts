import { useState, useCallback, useRef, useEffect } from "react";

export interface Song {
  id: number;
  name: string;
  artist: string;
  cover: string;
  sound: string;
}

export interface PlayerState {
  current: Song | null;
  queue: Song[];
  history: Song[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  isShuffled: boolean;
  repeatMode: "off" | "all" | "one";
  allSongs: Song[];
}

export const usePlayer = () => {
  const [state, setState] = useState<PlayerState>({
    current: null,
    queue: [],
    history: [],
    isPlaying: false,
    volume: 0.5,
    progress: 0,
    duration: 0,
    isShuffled: false,
    repeatMode: "off",
    allSongs: [],
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSongRef = useRef<string | null>(null);
  const originalQueueRef = useRef<Song[]>([]);

  // Initialize audio element once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.5;
    }

    const audio = audioRef.current;

    const handleEnded = () => {
      setState((prev) => {
        // Handle repeat one
        if (prev.repeatMode === "one" && prev.current) {
          if (audio) {
            audio.currentTime = 0;
          }
          return prev;
        }

        // Handle repeat all
        if (prev.queue.length === 0 && prev.repeatMode === "all" && prev.allSongs.length > 0) {
          // Restart the entire playlist
          const [nextSong, ...rest] = prev.allSongs;
          return {
            ...prev,
            history: prev.current ? [prev.current, ...prev.history] : prev.history,
            current: nextSong,
            queue: rest,
            progress: 0,
          };
        }

        // Normal playback or no repeat
        if (prev.queue.length === 0) {
          return { ...prev, isPlaying: false };
        }

        const [nextSong, ...rest] = prev.queue;
        return {
          ...prev,
          history: prev.current ? [prev.current, ...prev.history] : prev.history,
          current: nextSong,
          queue: rest,
          progress: 0,
        };
      });
    };

    const handleTimeUpdate = () => {
      setState((prev) => ({
        ...prev,
        progress: audio.currentTime,
      }));
    };

    const handleLoadedMetadata = () => {
      setState((prev) => ({
        ...prev,
        duration: audio.duration || 0,
      }));
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Sync audio source when current song changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.current) return;

    const newSrc = state.current.sound;
    if (currentSongRef.current !== newSrc) {
      currentSongRef.current = newSrc;
      audio.src = newSrc;
      audio.load();

      if (state.isPlaying) {
        audio.play().catch((err) => {
          console.error("Playback failed:", err);
          setState((prev) => ({ ...prev, isPlaying: false }));
        });
      }
    }
  }, [state, state.isPlaying]);

  // Sync play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.current) return;

    if (state.isPlaying && audio.paused) {
      audio.play().catch((err) => {
        console.error("Playback failed:", err);
        setState((prev) => ({ ...prev, isPlaying: false }));
      });
    } else if (!state.isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [state, state.isPlaying]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  const play = useCallback((song: Song) => {
    const audio = audioRef.current;

    setState((prev) => {
      const isSameSong = prev.current?.id === song.id;

      // If playing the same song, restart it immediately
      if (isSameSong && audio) {
        audio.currentTime = 0;
        if (audio.paused) {
          audio.play().catch((err) => {
            console.error("Playback failed:", err);
          });
        }
      }

      return {
        ...prev,
        current: song,
        isPlaying: true,
        progress: 0,
        history: isSameSong || !prev.current
          ? prev.history
          : [prev.current, ...prev.history],
      };
    });
  }, []);

  const togglePlay = useCallback(() => {
    setState((prev) => {
      if (!prev.current) {
        // If no current song but queue exists, start playing the first song
        if (prev.queue.length === 0) return prev;
        const [nextSong, ...rest] = prev.queue;
        return {
          ...prev,
          current: nextSong,
          queue: rest,
          isPlaying: true,
          progress: 0,
        };
      }
      return { ...prev, isPlaying: !prev.isPlaying };
    });
  }, []);

  const next = useCallback(() => {
    setState((prev) => {
      if (prev.queue.length === 0) {
        return { ...prev, isPlaying: false, current: null, progress: 0 };
      }
      const [nextSong, ...rest] = prev.queue;
      return {
        ...prev,
        history: prev.current ? [prev.current, ...prev.history] : prev.history,
        current: nextSong,
        queue: rest,
        isPlaying: true,
        progress: 0,
      };
    });
  }, []);

  const previous = useCallback(() => {
    setState((prev) => {
      if (prev.history.length === 0) {
        // Restart current song
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
        }
        return { ...prev, progress: 0 };
      }
      const [lastSong, ...rest] = prev.history;
      return {
        ...prev,
        history: rest,
        queue: prev.current ? [prev.current, ...prev.queue] : prev.queue,
        current: lastSong,
        isPlaying: true,
        progress: 0,
      };
    });
  }, []);

  const addToQueue = useCallback((song: Song) => {
    setState((prev) => ({
      ...prev,
      queue: [...prev.queue, song],
      allSongs: prev.allSongs.some(s => s.id === song.id)
        ? prev.allSongs
        : [...prev.allSongs, song],
    }));
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setState((prev) => ({ ...prev, progress: time }));
  }, []);

  const setVolume = useCallback((vol: number) => {
    setState((prev) => ({ ...prev, volume: vol }));
  }, []);

  const shuffle = useCallback(() => {
    setState((prev) => {
      if (prev.isShuffled) {
        // unShuffle: restore original order, but only for remaining songs
        const remainingSongIds = new Set(prev.queue.map((s) => s.id));
        const unShuffled = originalQueueRef.current.filter((s) =>
          remainingSongIds.has(s.id)
        );
        return {
          ...prev,
          queue: unShuffled,
          isShuffled: false,
        };
      } else {
        // Shuffle: save original order and randomize
        originalQueueRef.current = [...prev.queue];
        const shuffled = [...prev.queue].sort(() => Math.random() - 0.5);
        return {
          ...prev,
          queue: shuffled,
          isShuffled: true,
        };
      }
    });
  }, []);

  const repeat = useCallback(() => {
    setState((prev) => {
      const modes: Array<"off" | "all" | "one"> = ["off", "all", "one"];
      const currentIndex = modes.indexOf(prev.repeatMode);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      return {
        ...prev,
        repeatMode: nextMode,
      };
    });
  }, []);

  return {
    ...state,
    play,
    next,
    previous,
    togglePlay,
    addToQueue,
    seek,
    setVolume,
    shuffle,
    repeat,
  };
};