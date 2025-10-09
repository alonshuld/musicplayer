import { useMemo } from "react";
import { type Song } from "../types/Song";

export function useFilteredSongs(songs: Song[] | undefined, searchTerm: string) {
  return useMemo(() => {
    if (!songs) return [];
    return songs.filter(
      (song) =>
        song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [songs, searchTerm]);
}