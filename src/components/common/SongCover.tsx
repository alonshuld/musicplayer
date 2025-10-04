import { type FC } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";

interface SongCoverProps {
  coverUrl: string;
  songName: string;
  producer: string;
  height?: number; // optional explicit height
}

export const SongCover: FC<SongCoverProps> = ({
  coverUrl,
  songName,
  producer,
  height,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm")); // for responsive layout

  // Decide if we show text or not (for very small heights, like footer)
  const showText = !height || height >= 64;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: isSmall ? "column" : "row",
        alignItems: "center",
        borderRadius: 2,
        padding: "4px",
        boxSizing: "border-box",
        bgcolor: "background.paper",
        height: height ?? "auto",
        width: height ?? "auto",
        minWidth: 64,
      }}
      elevation={3}
    >
      <CardMedia
        component="img"
        image={coverUrl}
        alt={songName}
        sx={{
          width: isSmall ? "100%" : height ?? 64,
          height: height ?? 64,
          borderRadius: 1,
          objectFit: "cover",
        }}
      />

      {showText && (
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: isSmall ? "center" : "flex-start",
            padding: "4px",
            minWidth: 0,
          }}
        >
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ fontSize: height && height < 120 ? "0.7rem" : undefined }}
          >
            {songName}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{ fontSize: height && height < 120 ? "0.6rem" : undefined }}
          >
            {producer}
          </Typography>
        </CardContent>
      )}
    </Card>
  );
};
