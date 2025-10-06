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
  volume: number;       // 0 to 1
  progress: number;     // seconds
  duration: number;     // seconds
}

export const usePlayer = () => {
  const [state, setState] = useState<PlayerState>({
    current: null,
    queue: [],
    history: [],
    isPlaying: false,
    volume: 1,
    progress: 0,
    duration: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<number | null>(null);

  // Play or change song
  useEffect(() => {
    if (!state.current) return;

    // Stop previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    // Create new audio
    audioRef.current = new Audio(state.current.sound);
    audioRef.current.volume = state.volume;

    // When metadata loads, update duration
    audioRef.current.onloadedmetadata = () => {
      setState((prev) => ({ ...prev, duration: audioRef.current!.duration }));
    };

    // Start playback if isPlaying
    if (state.isPlaying) {
      audioRef.current.play().catch((err) => console.error(err));
    }

    // Update progress every 500ms
    progressInterval.current = window.setInterval(() => {
      if (audioRef.current) {
        setState((prev) => ({ ...prev, progress: audioRef.current!.currentTime }));
      }
    }, 500);

    // Cleanup
    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [state.current]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (state.isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch((err) => console.error(err));

    setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, [state.isPlaying]);

  // Play a song immediately
  const play = useCallback((song: Song) => {
    setState((prev) => ({
      ...prev,
      current: song,
      isPlaying: true,
      progress: 0,
    }));
  }, []);

  // Next song
  const next = useCallback(() => {
    setState((prev) => {
      if (prev.queue.length === 0) return { ...prev, isPlaying: false };
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

  // Previous song
  const previous = useCallback(() => {
    setState((prev) => {
      if (prev.history.length === 0) return prev;
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

  // Add to queue
  const addToQueue = useCallback((song: Song) => {
    setState((prev) => ({
      ...prev,
      queue: [...prev.queue, song],
    }));
  }, []);

  // Seek to a specific time (in seconds)
  const seek = useCallback((time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
    setState((prev) => ({ ...prev, progress: time }));
  }, []);

  // Change volume (0 to 1)
  const setVolume = useCallback((vol: number) => {
    if (audioRef.current) audioRef.current.volume = vol;
    setState((prev) => ({ ...prev, volume: vol }));
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
  };
};
