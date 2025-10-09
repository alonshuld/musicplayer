import { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { useSongs } from "./hooks/useSongs";
import { usePlayer } from "./hooks/usePlayer";
import { useFilteredSongs } from "./hooks/useFilteredSongs";

import { HomePage } from "./components/pages/HomePage";
import { SettingsPage } from "./components/pages/SettingsPage";

import type { Song } from "./types/Song";

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
          "&:focus": { outline: "none" },
          transition: "transform 0.2s ease, background-color 0.2s ease",
          "&:hover": { transform: "scale(1.2)" },
          "&:active": { transform: "scale(0.9)" },
          padding: 0,
        },
      },
      defaultProps: { disableRipple: true },
    },
  },
  palette: {
    mode: "dark",
    background: {
      default: "#0d0d0d",
      paper: "#1a1a1a",
    },
    secondary: {
      main: "#2d2d2d",
      contrastText: "#ffffff",
    },
  },
  typography: {
    h1: { fontSize: "3rem", fontWeight: 600 },
    h5: { fontSize: "1rem", fontWeight: 600 },
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
    removeFromQueue,
    setQueue,
  } = usePlayer();
  const { data: songsData, isLoading, error } = useSongs();
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredSongs = useFilteredSongs(songs, searchTerm);

  // Sync with fetched data
  useEffect(() => {
    if (songsData) {
      setSongs(songsData);
    }
  }, [songsData]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <HomePage
          showQueue={showQueue}
          setShowQueue={setShowQueue}
          current={current}
          queue={queue}
          isPlaying={isPlaying}
          volume={volume}
          progress={progress}
          duration={duration}
          isShuffled={isShuffled}
          repeatMode={repeatMode}
          play={play}
          next={next}
          previous={previous}
          togglePlay={togglePlay}
          addToQueue={addToQueue}
          seek={seek}
          setVolume={setVolume}
          shuffle={shuffle}
          repeat={repeat}
          removeFromQueue={removeFromQueue}
          setQueue={setQueue}
          filteredSongs={filteredSongs}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isLoading={isLoading}
          error={error}
        />
      ),
    },
    {
      path: "settings",
      element: (
        <SettingsPage
          showQueue={showQueue}
          setShowQueue={setShowQueue}
          current={current}
          queue={queue}
          isPlaying={isPlaying}
          volume={volume}
          progress={progress}
          duration={duration}
          isShuffled={isShuffled}
          repeatMode={repeatMode}
          next={next}
          previous={previous}
          togglePlay={togglePlay}
          seek={seek}
          setVolume={setVolume}
          shuffle={shuffle}
          repeat={repeat}
          removeFromQueue={removeFromQueue}
          setQueue={setQueue}
          filteredSongs={filteredSongs}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isLoading={isLoading}
          error={error}
          songs={songs}
          setSongs={setSongs}
        />
      ),
    },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
