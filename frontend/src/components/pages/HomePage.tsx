import { type FC } from "react";

// Material UI
import { Box, CircularProgress } from "@mui/material";

// types
import type { Song } from "../../types/Song";

// common components
import { Header } from "../common/Header";
import { Logo } from "../common/Logo";
import { Footer } from "../common/Footer";
import { QueueBtn } from "../common/QueueBtn";
import { QueueDrawer } from "../common/QueueDrawer";
import { SongCover } from "../common/SongCover";
import { Error } from "../common/Error";
import { PlayBtn } from "../common/PlayBtn";
import { Volume } from "../common/Volume";
import { ProgressBar } from "../common/ProgressBar";
import { PlaybackControl } from "../common/PlaybackControl";
import { AddToQueueBtn } from "../common/AddToQueueBtn";
import { ShuffleBtn } from "../common/ShuffleBtn";
import { RepeatBtn } from "../common/RepeatBtn";
import { SearchBar } from "../common/SearchBar";

export interface HomePageProps {
  showQueue: boolean;
  setShowQueue: (showQueue: boolean) => void;
  current: Song | null;
  queue: Song[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  isShuffled: boolean;
  repeatMode: "all" | "off" | "one";
  play: (song: Song) => void;
  next: () => void;
  previous: () => void;
  togglePlay: () => void;
  addToQueue: (song: Song) => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  shuffle: () => void;
  repeat: () => void;
  removeFromQueue: (songId: number) => void;
  setQueue: (songs: Song[], startPlaying?: boolean) => void;
  filteredSongs: Song[];
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export const HomePage: FC<HomePageProps> = ({
  showQueue,
  setShowQueue,
  current,
  queue,
  isPlaying,
  volume,
  progress,
  duration,
  isShuffled,
  repeatMode,
  play,
  next,
  previous,
  togglePlay,
  addToQueue,
  seek,
  setVolume,
  shuffle,
  repeat,
  removeFromQueue,
  setQueue,
  filteredSongs,
  searchTerm,
  setSearchTerm,
  isLoading,
  error,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header
        left={[<Logo key={"Logo"} />]}
        center={[
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />,
        ]}
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
          queue={queue}
          removeFromQueue={removeFromQueue}
          setQueue={setQueue}
        />

        <Box
          className="content"
          gap={2}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            overflowY: "auto",
            alignContent: filteredSongs ? "flex-start" : "center",
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
            filteredSongs?.map((song: Song) => (
              <SongCover
                key={song.id}
                name={song.name}
                artist={song.artist}
                cover={song.cover}
                buttons={[
                  <PlayBtn key="PlayBtn" play={play} song={song} />,
                  <AddToQueueBtn
                    key="AddToQueueBtn"
                    addToQueue={addToQueue}
                    song={song}
                  />,
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
          <RepeatBtn key={"Repeat"} repeatMode={repeatMode} repeat={repeat} />,
        ]}
      />
    </Box>
  );
};
