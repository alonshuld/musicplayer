import { type FC } from "react";
import { IconButton } from "@mui/material";
import { QueueMusic } from "@mui/icons-material";

export interface QueueBtnProps {
  showQueue: boolean;
  setShowQueue: (showQueue: boolean) => void;
}

export const QueueBtn: FC<QueueBtnProps> = ({ showQueue, setShowQueue }) => {
  return (
    <IconButton onClick={() => setShowQueue(!showQueue)}>
      <QueueMusic />
    </IconButton>
  );
};
