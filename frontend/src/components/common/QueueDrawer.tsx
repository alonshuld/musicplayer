import { type FC } from "react";
import { Drawer } from "@mui/material";

import { DndContext, closestCorners, type DragEndEvent } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import type { Song } from "../../types/Song";
import { QueueSongCover } from "./QueueSongCover";

export interface QueueDrawerProps {
  showQueue: boolean;
  setShowQueue: (showQueue: boolean) => void;
  removeFromQueue: (songId: number) => void;
  queue: Song[];
  setQueue: (newQueue: Song[]) => void;
}

const QueueDrawerWidth = 240;

export const QueueDrawer: FC<QueueDrawerProps> = ({
  queue,
  showQueue,
  setShowQueue,
  removeFromQueue,
  setQueue,
}) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = queue.findIndex((song) => song.id === active.id);
    const newIndex = queue.findIndex((song) => song.id === over.id);

    const newQueue = arrayMove(queue, oldIndex, newIndex);
    setQueue(newQueue);
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={showQueue}
      onClose={() => setShowQueue(false)}
      slotProps={{
        paper: {
          sx: {
            width: QueueDrawerWidth,
            position: "relative",
            borderRadius: "16px",
            zIndex: 0,
          },
        },
      }}
      sx={{
        width: showQueue ? QueueDrawerWidth : 0,
        flexShrink: 0,
        transition: "width 0.2s ease",
        "& .MuiDrawer-paper": {
          width: QueueDrawerWidth,
          position: "relative",
          border: "none",
          scrollbarWidth: "none", // Firefox
          "&::-webkit-scrollbar": { display: "none" }, // Chrome/Safari
        },
      }}
    >
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={queue.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {queue.map((song) => (
            <QueueSongCover
              key={song.id}
              song={song}
              removeFromQueue={removeFromQueue}
            />
          ))}
        </SortableContext>
      </DndContext>
    </Drawer>
  );
};
