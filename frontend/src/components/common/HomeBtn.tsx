import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { HomeRounded } from "@mui/icons-material";

export const HomeBtn: FC = () => {
  const navigate = useNavigate();

  return (
    <IconButton onClick={() => navigate("/")}>
      <HomeRounded />
    </IconButton>
  );
};
