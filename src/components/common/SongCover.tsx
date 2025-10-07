import { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { type Song } from "../../types/Song";

export interface SongCoverProps
  extends Pick<Song, "cover" | "name" | "artist"> {
  buttons?: React.ReactNode[];
}

export const SongCover: React.FC<SongCoverProps> = ({
  cover,
  name,
  artist,
  buttons = [],
}) => {
  const [hovered, setHovered] = useState(false);
  const [layout, setLayout] = useState<"full" | "compact">("full");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current?.parentElement) return;
    const parent = ref.current.parentElement;
    const observer = new ResizeObserver((entries) => {
      const height = entries[0].contentRect.height;
      setLayout(height < 100 ? "compact" : "full");
    });
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        flexDirection: layout === "compact" ? "row" : "column",
        alignItems: layout === "compact" ? "center" : "flex-start",
        gap: layout === "compact" ? 1 : 0.5,
        position: "relative",
        width: layout === "compact" ? 200 : 160,
        padding: 0.5,
        height: layout === "compact" ? "auto" : 210,
        borderRadius: 2,
        backgroundColor: (theme) => theme.palette.secondary.main,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cover image */}
      <Box sx={{ position: "relative", flexShrink: 0 }}>
        <img
          src={cover}
          alt={name}
          style={{
            width: layout === "compact" ? 48 : "100%",
            height: layout === "compact" ? 48 : 160,
            objectFit: "cover",
            borderRadius: 8,
            display: "block",
          }}
        />
        {hovered && buttons.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              backgroundColor: "rgba(0,0,0,0.4)",
              borderRadius: 2,
              transition: "opacity 0.2s ease",
            }}
          >
            {buttons}
          </Box>
        )}
      </Box>

      {/* Song info */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: layout === "compact" ? 150 : 165,
        }}
      >
        <Typography variant="subtitle1" color="text.primary" noWrap>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {artist}
        </Typography>
      </Box>
    </Box>
  );
};
