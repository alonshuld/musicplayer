import { type FC } from "react";
import { IconButton } from "@mui/material";
import { PlayArrowRounded } from "@mui/icons-material";
import { type Song } from "../../hooks/usePlayer";

export interface PlayBtnProps {
  play: (song: Song) => void;
  song: Song;
}

export const PlayBtn: FC<PlayBtnProps> = ({ play, song }) => {
  return (
    <IconButton onClick={() => play(song)}>
      <PlayArrowRounded />
    </IconButton>
  );
};
