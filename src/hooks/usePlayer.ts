import { useState, useCallback, useRef, useEffect } from "react";
import { type Song } from "../types/Song";

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

  // Initialize audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.5;
    }

    const audio = audioRef.current;

    const handleEnded = () => {
      setState((prev) => {
        const audio = audioRef.current;

        // Repeat one
        if (prev.repeatMode === "one" && prev.current) {
          if (audio) {
            audio.currentTime = 0;
            audio.play().catch((err) => console.error("Playback failed:", err));
          }
          return { ...prev, isPlaying: true, progress: 0 };
        }

        // Repeat all
        if (prev.queue.length === 0 && prev.repeatMode === "all" && prev.allSongs.length > 0) {
          const [firstSong, ...rest] = prev.allSongs;
          if (audio) {
            audio.src = firstSong.sound;
            audio.load();
            audio.play().catch((err) => console.error("Playback failed:", err));
          }
          return {
            ...prev,
            current: firstSong,
            queue: rest,
            history: [],
            isPlaying: true,
            progress: 0,
          };
        }

        // Stop if nothing left
        if (prev.queue.length === 0) {
          if (audio) {
            audio.pause();
            audio.currentTime = 0;
          }
          return { ...prev, isPlaying: false };
        }

        // Normal next
        const [nextSong, ...rest] = prev.queue;
        if (audio) {
          audio.src = nextSong.sound;
          audio.load();
          audio.play().catch((err) => console.error("Playback failed:", err));
        }

        return {
          ...prev,
          history: prev.current ? [prev.current, ...prev.history] : prev.history,
          current: nextSong,
          queue: rest,
          isPlaying: true,
          progress: 0,
        };
      });
    };

    const handleTimeUpdate = () => {
      setState((prev) => ({ ...prev, progress: audio.currentTime }));
    };

    const handleLoadedMetadata = () => {
      setState((prev) => ({ ...prev, duration: audio.duration || 0 }));
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

  // Sync new song source
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
  }, [state.current, state.isPlaying]);

  // Sync play/pause
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
  }, [state.isPlaying, state.current]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  // Keep allSongs synced with queue
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      allSongs: prev.allSongs.length === 0 ? prev.queue : prev.allSongs,
    }));
  }, [state.queue]);

  const play = useCallback((song: Song) => {
    const audio = audioRef.current;

    setState((prev) => {
      const isSameSong = prev.current?.id === song.id;
      if (isSameSong && audio) {
        audio.currentTime = 0;
        if (audio.paused) audio.play().catch(console.error);
      }

      return {
        ...prev,
        current: song,
        isPlaying: true,
        progress: 0,
        history: isSameSong || !prev.current ? prev.history : [prev.current, ...prev.history],
      };
    });
  }, []);

  const togglePlay = useCallback(() => {
    setState((prev) => {
      if (!prev.current) {
        if (prev.queue.length === 0) return prev;
        const [nextSong, ...rest] = prev.queue;
        return { ...prev, current: nextSong, queue: rest, isPlaying: true, progress: 0 };
      }
      return { ...prev, isPlaying: !prev.isPlaying };
    });
  }, []);

  const next = useCallback(() => {
    setState((prev) => {
      const audio = audioRef.current;

      // Repeat one
      if (prev.repeatMode === "one" && prev.current) {
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(console.error);
        }
        return { ...prev, isPlaying: true, progress: 0 };
      }

      // Repeat all
      if (prev.queue.length === 0 && prev.repeatMode === "all" && prev.allSongs.length > 0) {
        const [firstSong, ...rest] = prev.allSongs;
        if (audio) {
          audio.src = firstSong.sound;
          audio.load();
          audio.play().catch(console.error);
        }
        return { ...prev, current: firstSong, queue: rest, history: [], isPlaying: true, progress: 0 };
      }

      // No next song
      if (prev.queue.length === 0) {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        return { ...prev, isPlaying: false, current: null, progress: 0 };
      }

      // Normal case
      const [nextSong, ...rest] = prev.queue;
      if (audio) {
        audio.src = nextSong.sound;
        audio.load();
        audio.play().catch(console.error);
      }
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
      const audio = audioRef.current;
      if (prev.history.length === 0) {
        if (audio) audio.currentTime = 0;
        return { ...prev, progress: 0 };
      }
      const [lastSong, ...rest] = prev.history;
      if (audio) {
        audio.src = lastSong.sound;
        audio.load();
        audio.play().catch(console.error);
      }
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
    setState((prev) => {
      const alreadyInQueue = prev.queue.some((s) => s.id === song.id);
      if (alreadyInQueue) return prev;
      return { ...prev, queue: [...prev.queue, song], allSongs: [...prev.allSongs, song] };
    });
  }, []);

  const setQueue = useCallback((newQueue: Song[]) => {
    setState((prev) => ({ ...prev, queue: newQueue, allSongs: newQueue }));
  }, []);

  const removeFromQueue = useCallback((songId: number) => {
    setState((prev) => {
      const isCurrent = prev.current?.id === songId;
      const newQueue = prev.queue.filter((song) => song.id !== songId);
      return {
        ...prev,
        queue: newQueue,
        ...(isCurrent ? { current: null, isPlaying: false, progress: 0 } : {}),
      };
    });
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
    setState((prev) => ({ ...prev, progress: time }));
  }, []);

  const setVolume = useCallback((vol: number) => {
    setState((prev) => ({ ...prev, volume: vol }));
  }, []);

  const shuffle = useCallback(() => {
    setState((prev) => {
      if (prev.isShuffled) {
        const remainingIds = new Set(prev.queue.map((s) => s.id));
        const unShuffled = originalQueueRef.current.filter((s) => remainingIds.has(s.id));
        return { ...prev, queue: unShuffled, isShuffled: false };
      } else {
        originalQueueRef.current = [...prev.queue];
        const shuffled = [...prev.queue].sort(() => Math.random() - 0.5);
        return { ...prev, queue: shuffled, isShuffled: true };
      }
    });
  }, []);

  const repeat = useCallback(() => {
    setState((prev) => {
      const modes: Array<"off" | "all" | "one"> = ["off", "all", "one"];
      const nextMode = modes[(modes.indexOf(prev.repeatMode) + 1) % modes.length];
      return { ...prev, repeatMode: nextMode };
    });
  }, []);

  return {
    ...state,
    play,
    next,
    previous,
    togglePlay,
    addToQueue,
    removeFromQueue,
    seek,
    setVolume,
    shuffle,
    repeat,
    setQueue,
  };
};
