import { type FC } from "react";
import { IconButton } from "@mui/material";
import { DeleteRounded } from "@mui/icons-material";

export interface RemoveFromQueueBtnProps {
  songId: number;
  removeFromQueue: (songId: number) => void;
}

export const RemoveFromQueueBtn: FC<RemoveFromQueueBtnProps> = ({
  songId,
  removeFromQueue,
}) => {
  return (
    <IconButton
      onClick={() => removeFromQueue(songId)}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <DeleteRounded />
    </IconButton>
  );
};
