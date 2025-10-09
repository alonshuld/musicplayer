import { type FC } from "react";

// Material UI
import { Box, CircularProgress } from "@mui/material";

// types
import type { Song } from "../../types/Song";

// common components
import { Header } from "../common/Header";
import { Logo } from "../common/Logo";
import { SongCover } from "../common/SongCover";
import { Error } from "../common/Error";
import { SearchBar } from "../common/SearchBar";
import { Footer } from "../common/Footer";
import { DeleteSongBtn } from "../common/DeleteSongBtn";
import { HomeBtn } from "../common/HomeBtn";
import { QueueBtn } from "../common/QueueBtn";
import { PlaybackControl } from "../common/PlaybackControl";
import { ProgressBar } from "../common/ProgressBar";
import { Volume } from "../common/Volume";
import { ShuffleBtn } from "../common/ShuffleBtn";
import { RepeatBtn } from "../common/RepeatBtn";
import { QueueDrawer } from "../common/QueueDrawer";

export interface SettingsPageProps {
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
  next: () => void;
  previous: () => void;
  togglePlay: () => void;
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
  songs: Song[];
  setSongs: (songs: Song[]) => void;
}

export const SettingsPage: FC<SettingsPageProps> = ({
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
  next,
  previous,
  togglePlay,
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
  songs,
  setSongs,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header
        left={[<Logo key={"Logo"} />]}
        center={[
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />,
        ]}
        right={[<HomeBtn key={"homeAdminTemp"} />]}
      />

      <Box
        className="main"
        my={11}
        mx={1.5}
        sx={{
          display: "flex",
          flexGrow: 1,
          gap: 0,
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
                  <DeleteSongBtn
                    song={song}
                    songs={songs}
                    setSongs={setSongs}
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
