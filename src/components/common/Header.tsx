import { type FC, type ReactNode } from "react";
import { AppBar, Toolbar } from "@mui/material";

export interface HeaderProps {
  items: ReactNode[];
}

export const Header: FC<HeaderProps> = ({ items }) => {
  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      color="secondary"
      sx={{
        borderRadius: 4,
        margin: 1.5,
        height: 64,
        width: `calc(100% - 24px)`, // 2*margin (2 * 12px = 12px * 2 sides = 24px)
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {items.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </Toolbar>
    </AppBar>
  );
};
