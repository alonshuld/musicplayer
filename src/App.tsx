import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { Header } from "./components/common/Header";
import { Logo } from "./components/common/Logo";
import { Footer } from "./components/common/Footer";
import { QueueBtn } from "./components/common/QueueBtn";
import { QueueDrawer } from "./components/common/QueueDrawer";
import { SongCover, type SongCoverProps } from "./components/common/SongCover";
import Cover1 from "./assets/1.png";

import "./App.css";

const tempSong: SongCoverProps = {
  coverUrl: Cover1,
  songName: "פרופיל 97",
  artist: "פאר טסי",
};

const songsAmount = 25;
const allSongs: React.ReactNode[] = [];
for (let i = 0; i < songsAmount; i++) {
  allSongs.push(
    <SongCover
      key={i}
      {...tempSong}
      buttons={[<Button>play</Button>, <Button>add to queue</Button>]}
    />
  );
}

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
            items={[
              <SongCover
                {...tempSong}
                buttons={[<Button>D</Button>]}
              ></SongCover>,
              <SongCover
                {...tempSong}
                buttons={[<Button>D</Button>]}
              ></SongCover>,
              <SongCover
                {...tempSong}
                buttons={[<Button>D</Button>]}
              ></SongCover>,
            ]}
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
            {allSongs}
          </Box>
        </Box>

        <Footer
          left={[
            <QueueBtn showQueue={showQueue} setShowQueue={setShowQueue} />,
            <SongCover {...tempSong}></SongCover>,
          ]}
          center={[<span>[ || ]</span>, <div>---------------</div>]}
          right={[<div>volume</div>, <div>shuffle</div>, <div>repeat</div>]}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
