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
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSongIdRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);

  // Store original queue order for shuffle/unshuffle
  const originalQueueRef = useRef<Song[]>([]);

  // Keep refs in sync
  useEffect(() => {
    isPlayingRef.current = state.isPlaying;
  }, [state.isPlaying]);

  // Handle song end (for ended event)
  const handleSongEnd = useCallback(() => {
    setState((prev) => {
      const audio = audioRef.current;
      if (!audio) return prev;

      // Repeat one: replay current song
      if (prev.repeatMode === "one" && prev.current) {
        audio.currentTime = 0;
        audio.play().catch((err) => console.error("Playback failed:", err));
        return { ...prev, isPlaying: true, progress: 0 };
      }

      let nextSong: Song | undefined;
      const newQueue = [...prev.queue];
      let newHistory = prev.history;

      // Unified next-song logic for queue > 0 or (queue == 0 with repeat-all)
      if (prev.queue.length > 0 || (prev.repeatMode === "all" && prev.current)) {
        if (prev.queue.length > 0) {
          nextSong = newQueue.shift()!;
        } else {
          nextSong = prev.current!;
        }

        if (prev.current) {
          newHistory = [prev.current, ...newHistory];
        }

        if (prev.repeatMode === "all" && prev.current) {
          newQueue.push(prev.current);
        }

        currentSongIdRef.current = nextSong.id;
        audio.src = nextSong.sound;
        audio.load();

        return {
          ...prev,
          current: nextSong,
          queue: newQueue,
          history: newHistory,
          isPlaying: true,
          progress: 0,
        };
      }

      // No more songs - stop, keep current, reset progress
      audio.pause();
      audio.currentTime = 0;
      return { ...prev, isPlaying: false, progress: 0 };
    });
  }, []);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.volume = 0.5;
      audioRef.current = audio;
    }

    const audio = audioRef.current;

    const handleEnded = () => {
      handleSongEnd();
    };

    const handleTimeUpdate = () => {
      setState((prev) => ({ ...prev, progress: audio.currentTime }));
    };

    const handleLoadedMetadata = () => {
      setState((prev) => ({ ...prev, duration: audio.duration || 0 }));
    };

    const handleError = (e: Event) => {
      console.error("Audio playback error:", e);
      setState((prev) => ({ ...prev, isPlaying: false }));
    };

    const handleCanPlay = () => {
      // Auto-play when ready if isPlaying is true
      if (isPlayingRef.current && audio.paused) {
        audio.play().catch((err) => {
          console.error("Playback failed on canplay:", err);
          setState((prev) => ({ ...prev, isPlaying: false }));
        });
      }
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.pause();
      audio.src = "";
    };
  }, [handleSongEnd]);

  // Sync audio source when current song changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.current) return;

    // Only load if the song ID actually changed
    if (currentSongIdRef.current !== state.current.id) {
      currentSongIdRef.current = state.current.id;
      audio.src = state.current.sound;
      audio.load();
    }
  }, [state]);

  // Sync play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.current) return;

    if (state.isPlaying) {
      if (audio.paused) {
        audio.play().catch((err) => {
          console.error("Playback failed:", err);
          setState((prev) => ({ ...prev, isPlaying: false }));
        });
      }
    } else {
      if (!audio.paused) {
        audio.pause();
      }
    }
  }, [state.isPlaying, state]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, state.volume));
    }
  }, [state.volume]);

  /**
   * Play a specific song immediately
   */
  const play = useCallback((song: Song) => {
    const audio = audioRef.current;
    if (!audio) return;

    setState((prev) => {
      const isSameSong = prev.current?.id === song.id;

      // If same song, just restart it
      if (isSameSong) {
        audio.currentTime = 0;
        if (audio.paused) {
          audio.play().catch((err) => console.error("Playback failed:", err));
        }
        return { ...prev, isPlaying: true, progress: 0 };
      }

      // Check if song is in queue, remove it to avoid duplicates
      const newQueue = [...prev.queue];
      const queueIndex = newQueue.findIndex((s) => s.id === song.id);
      if (queueIndex !== -1) {
        newQueue.splice(queueIndex, 1);
      }

      // If shuffled, also remove from original queue
      if (prev.isShuffled && queueIndex !== -1) {
        originalQueueRef.current = originalQueueRef.current.filter((s) => s.id !== song.id);
      }

      // Load and play new song
      currentSongIdRef.current = song.id;
      audio.src = song.sound;
      audio.load();

      const newHistory = prev.current ? [prev.current, ...prev.history] : prev.history;

      return {
        ...prev,
        current: song,
        queue: newQueue,
        history: newHistory,
        isPlaying: true,
        progress: 0,
        duration: 0,
      };
    });
  }, []);

  /**
   * Toggle play/pause
   */
  const togglePlay = useCallback(() => {
    setState((prev) => {
      const audio = audioRef.current;

      // If no current song, start playing from queue
      if (!prev.current) {
        if (prev.queue.length === 0) return prev;

        const [nextSong, ...restQueue] = prev.queue;

        if (audio) {
          currentSongIdRef.current = nextSong.id;
          audio.src = nextSong.sound;
          audio.load();
        }

        return {
          ...prev,
          current: nextSong,
          queue: restQueue,
          isPlaying: true,
          progress: 0,
          duration: 0,
        };
      }

      // Toggle current song
      return { ...prev, isPlaying: !prev.isPlaying };
    });
  }, []);

  /**
   * Skip to next song
   */
  const next = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setState((prev) => {
      // Repeat one: restart current
      if (prev.repeatMode === "one" && prev.current) {
        audio.currentTime = 0;
        if (audio.paused) {
          audio.play().catch((err) => console.error("Playback failed:", err));
        }
        return { ...prev, isPlaying: true, progress: 0 };
      }

      let nextSong: Song | undefined;
      const newQueue = [...prev.queue];
      let newHistory = prev.history;

      // Unified next-song logic for queue > 0 or (queue == 0 with repeat-all)
      if (prev.queue.length > 0 || (prev.repeatMode === "all" && prev.current)) {
        if (prev.queue.length > 0) {
          nextSong = newQueue.shift()!;
        } else {
          nextSong = prev.current!;
        }

        if (prev.current) {
          newHistory = [prev.current, ...newHistory];
        }

        if (prev.repeatMode === "all" && prev.current) {
          newQueue.push(prev.current);
        }

        currentSongIdRef.current = nextSong.id;
        audio.src = nextSong.sound;
        audio.load();

        return {
          ...prev,
          current: nextSong,
          queue: newQueue,
          history: newHistory,
          isPlaying: true,
          progress: 0,
          duration: 0,
        };
      }

      // No next song - stop, keep current, reset progress
      audio.pause();
      audio.currentTime = 0;
      return { ...prev, isPlaying: false, progress: 0 };
    });
  }, []);

  /**
   * Go back to previous song
   */
  const previous = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setState((prev) => {
      // If more than 3 seconds into song, restart it
      if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return { ...prev, progress: 0 };
      }

      // No history: restart current song
      if (prev.history.length === 0) {
        audio.currentTime = 0;
        return { ...prev, progress: 0 };
      }

      // Go to previous song in history
      const [previousSong, ...restHistory] = prev.history;
      const newQueue = prev.current ? [prev.current, ...prev.queue] : prev.queue;

      currentSongIdRef.current = previousSong.id;
      audio.src = previousSong.sound;
      audio.load();

      return {
        ...prev,
        current: previousSong,
        history: restHistory,
        queue: newQueue,
        isPlaying: true,
        progress: 0,
        duration: 0,
      };
    });
  }, []);

  /**
   * Add song to end of queue
   */
  const addToQueue = useCallback((song: Song) => {
    setState((prev) => {
      // Prevent duplicates in queue
      const alreadyInQueue = prev.queue.some((s) => s.id === song.id);
      const isCurrentSong = prev.current?.id === song.id;

      if (alreadyInQueue || isCurrentSong) return prev;

      const newQueue = [...prev.queue, song];

      // If shuffled, add to original queue as well
      if (prev.isShuffled) {
        originalQueueRef.current = [...originalQueueRef.current, song];
      }

      return { ...prev, queue: newQueue };
    });
  }, []);

  /**
   * Set entire queue (replaces current queue)
   */
  const setQueue = useCallback((songs: Song[], startPlaying: boolean = false) => {
    const audio = audioRef.current;

    setState((prev) => {
      // Reset shuffle state when setting new queue
      originalQueueRef.current = [];

      if (songs.length === 0) {
        return {
          ...prev,
          queue: [],
          isShuffled: false,
        };
      }

      if (startPlaying && audio) {
        const [firstSong, ...restQueue] = songs;

        currentSongIdRef.current = firstSong.id;
        audio.src = firstSong.sound;
        audio.load();

        return {
          ...prev,
          current: firstSong,
          queue: restQueue,
          history: [],
          isPlaying: true,
          isShuffled: false,
          progress: 0,
          duration: 0,
        };
      }

      return {
        ...prev,
        queue: songs,
        isShuffled: false,
      };
    });
  }, []);

  /**
   * Remove song from queue
   */
  const removeFromQueue = useCallback((songId: number) => {
    setState((prev) => {
      const newQueue = prev.queue.filter((song) => song.id !== songId);

      // If shuffled, also remove from original queue
      if (prev.isShuffled) {
        originalQueueRef.current = originalQueueRef.current.filter((s) => s.id !== songId);
      }

      return { ...prev, queue: newQueue };
    });
  }, []);

  /**
   * Seek to specific time in current song
   */
  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const clampedTime = Math.max(0, Math.min(time, audio.duration || 0));
    audio.currentTime = clampedTime;
    setState((prev) => ({ ...prev, progress: clampedTime }));
  }, []);

  /**
   * Set volume (0 to 1)
   */
  const setVolume = useCallback((vol: number) => {
    const clampedVol = Math.max(0, Math.min(1, vol));
    setState((prev) => ({ ...prev, volume: clampedVol }));
  }, []);

  /**
   * Toggle shuffle mode
   */
  const shuffle = useCallback(() => {
    setState((prev) => {
      if (prev.isShuffled) {
        // Unshuffle: restore original order
        const currentQueueIds = new Set(prev.queue.map((s) => s.id));
        const restoredQueue = originalQueueRef.current.filter((s) => currentQueueIds.has(s.id));

        originalQueueRef.current = [];
        return { ...prev, queue: restoredQueue, isShuffled: false };
      } else {
        // Shuffle: randomize queue
        if (prev.queue.length === 0) return prev;

        originalQueueRef.current = [...prev.queue];

        // Fisher-Yates shuffle for true randomization
        const shuffledQueue = [...prev.queue];
        for (let i = shuffledQueue.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledQueue[i], shuffledQueue[j]] = [shuffledQueue[j], shuffledQueue[i]];
        }

        return { ...prev, queue: shuffledQueue, isShuffled: true };
      }
    });
  }, []);

  /**
   * Cycle through repeat modes: off -> all -> one -> off
   */
  const repeat = useCallback(() => {
    setState((prev) => {
      const modes: Array<"off" | "all" | "one"> = ["off", "all", "one"];
      const currentIndex = modes.indexOf(prev.repeatMode);
      const nextMode = modes[(currentIndex + 1) % modes.length];

      return { ...prev, repeatMode: nextMode };
    });
  }, []);

  /**
   * Clear entire queue
   */
  const clearQueue = useCallback(() => {
    setState((prev) => ({
      ...prev,
      queue: [],
      isShuffled: false,
    }));
    originalQueueRef.current = [];
  }, []);

  /**
   * Stop playback and clear everything
   */
  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
    }

    setState((prev) => ({
      ...prev,
      current: null,
      isPlaying: false,
      progress: 0,
      duration: 0,
    }));

    currentSongIdRef.current = null;
  }, []);

  return {
    // State
    ...state,

    // Actions
    play,
    togglePlay,
    next,
    previous,
    addToQueue,
    setQueue,
    removeFromQueue,
    clearQueue,
    seek,
    setVolume,
    shuffle,
    repeat,
    stop,
  };
};