import { type FC } from "react";
import { IconButton } from "@mui/material";
import { ShuffleRounded } from "@mui/icons-material";

export interface ShuffleBtnProps {
  isShuffled: boolean;
  shuffle: () => void;
}

export const ShuffleBtn: FC<ShuffleBtnProps> = ({ isShuffled, shuffle }) => {
  return (
    <IconButton onClick={shuffle} disableRipple>
      <ShuffleRounded sx={{ color: isShuffled ? "primary.dark" : "primary" }} />
    </IconButton>
  );
};
