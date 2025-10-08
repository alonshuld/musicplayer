import { type FC } from "react";
import { Box } from "@mui/material";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { SongCover } from "./SongCover";
import { RemoveFromQueueBtn } from "./RemoveFromQueueBtn";

import type { Song } from "../../types/Song";

export interface QueueSongCoverProps {
  song: Song;
  removeFromQueue: (songId: number) => void;
}

export const QueueSongCover: FC<QueueSongCoverProps> = ({
  song,
  removeFromQueue,
}) => {
  const { attributes, setNodeRef, listeners, transform, transition } =
    useSortable({ id: song.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      sx={{
        pt: 2,
        px: 2,
        height: 64,
      }}
    >
      <SongCover
        name={song.name}
        artist={song.artist}
        cover={song.cover}
        buttons={[
          <RemoveFromQueueBtn
            key="RemoveFromQueueBtn"
            songId={song.id}
            removeFromQueue={removeFromQueue}
          />,
        ]}
      />
    </Box>
  );
};
