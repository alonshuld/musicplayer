import React from "react";
import { Slider, Box } from "@mui/material";

interface ProgressBarProps {
  progress: number; // in seconds
  duration: number; // in seconds
  seek: (time: number) => void;
}

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  duration,
  seek,
}) => {
  return (
    <Box width={500} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      {formatTime(progress)}

      <Slider
        min={0}
        max={duration || 0}
        value={progress}
        onChange={(_, newValue) => seek(newValue)}
      />

      {formatTime(duration)}
    </Box>
  );
};
