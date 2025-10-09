import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { SettingsRounded } from "@mui/icons-material";

export const SettingsBtn: FC = () => {
  const navigate = useNavigate();

  return (
    <IconButton onClick={() => navigate("/settings")}>
      <SettingsRounded />
    </IconButton>
  );
};
