import { type FC } from "react";
import { Alert, AlertTitle } from "@mui/material";

export interface ErrorProps {
  message: string;
}

export const Error: FC<ErrorProps> = ({ message }) => {
  return (
    <Alert severity="error">
      <AlertTitle>Error</AlertTitle>
      {message}
    </Alert>
  );
};
