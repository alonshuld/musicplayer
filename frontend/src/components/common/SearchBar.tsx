import { type FC } from "react";
import { Box, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";

export interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (newSearchTerm: string) => void;
}

export const SearchBar: FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <Box sx={{ mb: 2, display: "flex", m: 0 }}>
      <TextField
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        slotProps={{
          input: {
            startAdornment: <Search />,
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 4,
          },
        }}
      />
    </Box>
  );
};
