import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { Box } from "@mui/material";
import { Header } from "./components/common/Header";
import { Logo } from "./components/common/Logo";
import { Footer } from "./components/common/Footer";
import { QueueBtn } from "./components/common/QueueBtn";
import { QueueDrawer } from "./components/common/QueueDrawer";
import { SongCover } from "./components/common/SongCover";
import { useSongs, type Song } from "./SongsFetcher";

import "./App.css";

const theme = createTheme({
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:focus": {
            outline: "none",
          },
          transition: "transform 0.2s ease, background-color 0.2s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
          "&:active": {
            transform: "scale(0.9)",
          },
        },
      },
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  palette: {
    mode: "dark",
    background: {
      default: "#0d0d0d", // darker main background
      paper: "#1a1a1a", // slightly lighter for cards/panels
    },
    secondary: {
      main: "#2d2d2d",
      contrastText: "#ffffff",
    },
  },
  typography: {
    h1: {
      fontSize: "3rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1rem",
      fontWeight: 600,
    },
  },
});

function App() {
  const [showQueue, setShowQueue] = useState(false);
  const { data: songs, isLoading, error } = useSongs();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Header
          left={[<Logo />]}
          center={[<div>searchbar</div>]}
          right={[<div>admin button</div>]}
        />

        <Box
          className="main"
          my={11}
          mx={1.5}
          sx={{
            display: "flex",
            flexGrow: 1,
            gap: showQueue ? 1.5 : 0,
            overflow: "hidden",
          }}
        >
          <QueueDrawer
            showQueue={showQueue}
            setShowQueue={setShowQueue}
            items={[]}
          />

          <Box
            className="content"
            gap={2}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              overflowY: "auto",
              alignContent: "flex-start",
              width: "100%",
              scrollbarWidth: "none", // Firefox
              "&::-webkit-scrollbar": { display: "none" }, // Chrome/Safari
            }}
          >
            {songs?.map((song: Song) => (
              <SongCover
                key={song.id}
                songName={song.name}
                artist={song.artist}
                cover={song.cover}
              />
            ))}
          </Box>
        </Box>

        <Footer
          left={[
            <QueueBtn showQueue={showQueue} setShowQueue={setShowQueue} />,
          ]}
          center={[<span>[ || ]</span>, <div>---------------</div>]}
          right={[<div>volume</div>, <div>shuffle</div>, <div>repeat</div>]}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
