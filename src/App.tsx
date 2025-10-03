import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { Header } from "./components/common/Header";
import { Logo } from "./components/common/Logo";
import { Footer } from "./components/common/Footer";
import { QueueBtn } from "./components/common/QueueBtn";

import "./App.css";

const theme = createTheme({
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:focus": {
            outline: "none",
          },
          transition: "transform 0.2s ease, background-color 0.2s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
          "&:active": {
            transform: "scale(0.9)",
          },
        },
      },
      defaultProps: {
        disableRipple: true, // turn off ripple globally for IconButton
      },
    },
  },
  palette: {
    mode: "dark",
    secondary: {
      main: "#2d2d2d", // this is the one used when you do color="secondary"
      contrastText: "#ffffff", // make sure text is readable
    },
  },
  typography: {
    h1: {
      fontSize: "3rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1rem",
      fontWeight: 600,
    },
  },
});

function App() {
  const [showQueue, setShowQueue] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Header
        left={[<Logo />]}
        center={[<div>searchbar</div>]}
        right={[<div>admin button</div>]}
      />
      <Footer
        left={[
          <QueueBtn showQueue={showQueue} setShowQueue={setShowQueue} />,
          <div>playing now</div>,
        ]}
        center={[<span>[ || ]</span>, <div>---------------</div>]}
        right={[<div>volume</div>, <div>shuffle</div>, <div>repeat</div>]}
      />
    </ThemeProvider>
  );
}

export default App;
