import { type FC } from "react";
import { IconButton } from "@mui/material";
import { PlayArrowRounded, PauseRounded } from "@mui/icons-material";

export interface PauseBtnProps {
  isPlaying: boolean;
  togglePlay: () => void;
}

export const PauseBtn: FC<PauseBtnProps> = ({ isPlaying, togglePlay }) => {
  return (
    <IconButton onClick={togglePlay} sx={{ p: 0 }}>
      {isPlaying ? <PauseRounded /> : <PlayArrowRounded />}
    </IconButton>
  );
};
