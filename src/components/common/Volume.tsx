import { type FC } from "react";
import { Slider, Box } from "@mui/material";
import { VolumeUpRounded, VolumeOffRounded } from "@mui/icons-material";

export interface volumeProps {
  volume: number;
  setVolume: (vol: number) => void;
}

export const Volume: FC<volumeProps> = ({ volume, setVolume }) => {
  return (
    <Box sx={{ display: "flex", width: 150, gap: 1, alignItems: "center" }}>
      {volume ? (
        <VolumeUpRounded color="primary" fontSize="large" />
      ) : (
        <VolumeOffRounded color="primary" fontSize="large" />
      )}
      <Slider
        value={volume}
        onChange={(_, newValue) => setVolume(newValue)}
        valueLabelDisplay="auto"
        size={"small"}
      />
    </Box>
  );
};
