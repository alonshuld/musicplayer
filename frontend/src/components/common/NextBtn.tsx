import { type FC } from "react";
import { IconButton } from "@mui/material";
import { SkipNextRounded } from "@mui/icons-material";

export interface NextBtnProps {
  next: () => void;
}

export const NextBtn: FC<NextBtnProps> = ({ next }) => {
  return (
    <IconButton onClick={next}>
      <SkipNextRounded />
    </IconButton>
  );
};
