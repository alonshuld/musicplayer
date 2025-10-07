import { type FC } from "react";
import { IconButton } from "@mui/material";
import { PlayArrowRounded, PauseRounded } from "@mui/icons-material";

export interface PauseBtnProps {
  isPlaying: boolean;
  togglePlay: () => void;
}

export const PauseBtn: FC<PauseBtnProps> = ({ isPlaying, togglePlay }) => {
  return (
    <IconButton onClick={togglePlay}>
      {isPlaying ? (
        <PauseRounded color="primary" fontSize="large" />
      ) : (
        <PlayArrowRounded color="primary" fontSize="large" />
      )}
    </IconButton>
  );
};
