import { type FC } from "react";
import { Box } from "@mui/material";
import { NextBtn } from "./NextBtn";
import { PreviousBtn } from "./PreviousBtn";
import { PauseBtn } from "./PauseBtn";

export interface PlaybackActions {
  isPlaying: boolean;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
}

export const PlaybackControl: FC<PlaybackActions> = ({
  isPlaying,
  togglePlay,
  next,
  previous,
}) => (
  <Box
    className={"PlaybackControl"}
    sx={{ display: "flex", flexDirection: "row", gap: 2 }}
  >
    <PreviousBtn previous={previous} />
    <PauseBtn isPlaying={isPlaying} togglePlay={togglePlay} />
    <NextBtn next={next} />
  </Box>
);
