import { type FC, type ReactNode } from "react";
import { Drawer, Box } from "@mui/material";

export interface QueueDrawerProps {
  showQueue: boolean;
  setShowQueue: (showQueue: boolean) => void;
  items?: ReactNode[];
}

const QueueDrawerWidth = 300;

export const QueueDrawer: FC<QueueDrawerProps> = ({
  items,
  showQueue,
  setShowQueue,
}) => {
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
            position: "fix",
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
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", m: 2, gap: 2 }}>
        {items}
      </Box>
    </Drawer>
  );
};
