import { type FC } from "react";
import { IconButton } from "@mui/material";
import { SkipPreviousRounded } from "@mui/icons-material";

export interface PreviousBtnProps {
  previous: () => void;
}

export const PreviousBtn: FC<PreviousBtnProps> = ({ previous }) => {
  return (
    <IconButton onClick={previous}>
      <SkipPreviousRounded />
    </IconButton>
  );
};
