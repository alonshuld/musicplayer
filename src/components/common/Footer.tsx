import { type FC, type ReactNode } from "react";
import { AppBar, Toolbar, Box } from "@mui/material";

export interface HeaderProps {
  left?: ReactNode[];
  center?: ReactNode[];
  right?: ReactNode[];
}

export const Footer: FC<HeaderProps> = ({ left, center, right }) => {
  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      color="secondary"
      sx={{
        top: "auto",
        bottom: 0,
        borderRadius: 4,
        height: 64,
        margin: 1.5,
        width: `calc(100% - 24px)`, // 2*margin (2 * 12px = 12px * 2 sides = 24px)
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 3 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>{left}</Box>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {center}
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {right}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
