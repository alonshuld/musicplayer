import { type FC } from "react";
import { Box, TextField } from "@mui/material";

export interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (newSearchTerm: string) => void;
}

export const SearchBar: FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
      <TextField
        label="Search songs"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </Box>
  );
};
