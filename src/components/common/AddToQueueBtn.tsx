import { type FC } from "react";
import { IconButton } from "@mui/material";
import { QueueRounded } from "@mui/icons-material";
import { type Song } from "../../hooks/usePlayer";

export interface AddToQueueBtnProps {
  song: Song;
  addToQueue: (song: Song) => void;
}

export const AddToQueueBtn: FC<AddToQueueBtnProps> = ({ song, addToQueue }) => {
  return (
    <IconButton onClick={() => addToQueue(song)}>
      <QueueRounded />
    </IconButton>
  );
};
