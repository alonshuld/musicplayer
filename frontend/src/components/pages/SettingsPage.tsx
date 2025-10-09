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

export interface SettingsPageProps {
  filteredSongs: Song[];
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  isLoading: boolean;
  error: Error | null;
  songs: Song[];
  setSongs: (songs: Song[]) => void;
}

export const SettingsPage: FC<SettingsPageProps> = ({
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

      <Footer left={[]} center={[]} right={[]} />
    </Box>
  );
};
