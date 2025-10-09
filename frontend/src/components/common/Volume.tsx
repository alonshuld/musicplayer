import { type FC } from "react";
import { Slider, Box } from "@mui/material";
import { VolumeUpRounded, VolumeOffRounded } from "@mui/icons-material";

export interface VolumeProps {
  volume: number;
  setVolume: (vol: number) => void;
}

export const Volume: FC<VolumeProps> = ({ volume, setVolume }) => {
  return (
    <Box sx={{ display: "flex", width: 150, gap: 1, alignItems: "center" }}>
      {volume ? <VolumeUpRounded /> : <VolumeOffRounded />}
      <Slider
        value={volume}
        onChange={(_, newValue) => setVolume(newValue)}
        min={0}
        max={1}
        step={0.01}
        defaultValue={0.2}
      />
    </Box>
  );
};
