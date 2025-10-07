import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { Box, CircularProgress } from "@mui/material";

import { Header } from "./components/common/Header";
import { Logo } from "./components/common/Logo";
import { Footer } from "./components/common/Footer";
import { QueueBtn } from "./components/common/QueueBtn";
import { QueueDrawer } from "./components/common/QueueDrawer";
import { SongCover } from "./components/common/SongCover";
import { Error } from "./components/common/Error";
import { PlayBtn } from "./components/common/PlayBtn";
import { Volume } from "./components/common/Volume";
import { ProgressBar } from "./components/common/ProgressBar";
import { PlaybackControl } from "./components/common/PlaybackControl";
import { AddToQueueBtn } from "./components/common/AddToQueueBtn";
import { ShuffleBtn } from "./components/common/ShuffleBtn";
import { RepeatBtn } from "./components/common/RepeatBtn";

import { useSongs } from "./hooks/useSongs";
import { type Song, usePlayer } from "./hooks/usePlayer";

import "./App.css";

const theme = createTheme({
  components: {
    MuiSvgIcon: {
      defaultProps: {
        color: "primary",
        fontSize: "large",
      },
    },
    MuiSlider: {
      styleOverrides: {
        thumb: {
          "&:hover, &.Mui-focusVisible, &.Mui-active": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:focus": {
            outline: "none",
          },
          transition: "transform 0.2s ease, background-color 0.2s ease",
          "&:hover": {
            transform: "scale(1.2)",
          },
          "&:active": {
            transform: "scale(0.9)",
          },
          padding: 0,
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
  const {
    play,
    next,
    previous,
    togglePlay,
    addToQueue,
    seek,
    setVolume,
    current,
    queue,
    isPlaying,
    volume,
    progress,
    duration,
    isShuffled,
    shuffle,
    repeatMode,
    repeat,
  } = usePlayer();
  const { data: songs, isLoading, error } = useSongs();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Header
          left={[<Logo key={"Logo"} />]}
          center={[<div key={"TempSearchBar"}>searchbar</div>]}
          right={[<div key={"TempAdmin"}>admin button</div>]}
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
            items={queue.map((song: Song) => (
              <SongCover
                key={song.id}
                name={song.name}
                artist={song.artist}
                cover={song.cover}
              />
            ))}
          />

          <Box
            className="content"
            gap={2}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              overflowY: "auto",
              alignContent: songs ? "flex-start" : "center",
              width: "100%",
              scrollbarWidth: "none", // Firefox
              "&::-webkit-scrollbar": { display: "none" }, // Chrome/Safari
            }}
          >
            {isLoading ? (
              <CircularProgress />
            ) : error ? (
              <Error message={error.message} />
            ) : (
              songs?.map((song: Song) => (
                <SongCover
                  key={song.id}
                  name={song.name}
                  artist={song.artist}
                  cover={song.cover}
                  buttons={[
                    <PlayBtn key={"PlayBtn"} play={play} song={song} />,
                    <AddToQueueBtn addToQueue={addToQueue} song={song} />,
                  ]}
                />
              ))
            )}
          </Box>
        </Box>

        <Footer
          left={[
            <QueueBtn
              key={"QueueBtn"}
              showQueue={showQueue}
              setShowQueue={setShowQueue}
            />,
            current ? (
              <SongCover
                key={current.id}
                name={current.name}
                artist={current.artist}
                cover={current.cover}
              />
            ) : null,
          ]}
          center={[
            <PlaybackControl
              key={"PlaybackControl"}
              previous={previous}
              isPlaying={isPlaying}
              togglePlay={togglePlay}
              next={next}
            />,
            <ProgressBar
              key={"ProgressBar"}
              progress={progress}
              duration={duration}
              seek={seek}
            />,
          ]}
          right={[
            <Volume key={"Volume"} volume={volume} setVolume={setVolume} />,
            <ShuffleBtn
              key={"Shuffle"}
              isShuffled={isShuffled}
              shuffle={shuffle}
            />,
            <RepeatBtn
              key={"Repeat"}
              repeatMode={repeatMode}
              repeat={repeat}
            />,
          ]}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
