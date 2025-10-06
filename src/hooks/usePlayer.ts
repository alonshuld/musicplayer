import { useState, useCallback } from "react";

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
}

export const usePlayer = () => {
  const [state, setState] = useState<PlayerState>({
    current: null,
    queue: [],
    history: [],
    isPlaying: false,
  });

  const play = useCallback((song: Song) => {
    setState((prev) => ({
      ...prev,
      current: song,
      isPlaying: true,
    }));
  }, []);

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
      };
    });
  }, []);

  const previous = useCallback(() => {
    setState((prev) => {
      if (prev.history.length === 0) return prev;
      const [lastSong, ...rest] = prev.history;
      return {
        ...prev,
        history: rest,
        queue: prev.current ? [prev.current, ...prev.queue] : prev.queue,
        current: lastSong,
      };
    });
  }, []);

  const togglePlay = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const addToQueue = useCallback((song: Song) => {
    setState((prev) => ({
      ...prev,
      queue: [...prev.queue, song],
    }));
  }, []);

  return { ...state, play, next, previous, togglePlay, addToQueue };
};
