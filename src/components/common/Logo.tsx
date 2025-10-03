import { type FC } from "react";
import { Box, Typography } from "@mui/material";
import { Album } from "@mui/icons-material";

export const Logo: FC = () => {
  return (
    <Box className="logo" display="flex" alignItems="center" padding="0">
      <Album sx={{ fontSize: "3rem", margin: 0 }} color="primary" />
      <Typography variant="h1" color="primary">
        din
      </Typography>
    </Box>
  );
};
