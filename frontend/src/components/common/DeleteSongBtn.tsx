import { type FC } from "react";
import { IconButton } from "@mui/material";
import { ClearRounded } from "@mui/icons-material";

import type { Song } from "../../types/Song";

export interface DeleteSongBtnProps {
  song: Song;
  songs: Song[];
  setSongs: (songs: Song[]) => void;
}

export const DeleteSongBtn: FC<DeleteSongBtnProps> = ({
  song,
  songs,
  setSongs,
}) => {
  return (
    <IconButton
      onClick={() => {
        setSongs(songs.filter((s) => s.id !== song.id));
      }}
    >
      <ClearRounded />
    </IconButton>
  );
};
