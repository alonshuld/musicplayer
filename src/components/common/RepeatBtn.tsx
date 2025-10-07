import { type FC } from "react";
import { IconButton } from "@mui/material";
import { RepeatRounded, RepeatOneRounded } from "@mui/icons-material";

export interface RepeatBtnProps {
  repeatMode: "all" | "off" | "one";
  repeat: () => void;
}

export const RepeatBtn: FC<RepeatBtnProps> = ({ repeatMode, repeat }) => {
  return (
    <IconButton onClick={repeat} disableRipple>
      {repeatMode == "one" ? (
        <RepeatOneRounded sx={{ color: "primary.dark" }} />
      ) : (
        <RepeatRounded
          sx={{ color: repeatMode != "off" ? "primary.dark" : "primary" }}
        />
      )}
    </IconButton>
  );
};
