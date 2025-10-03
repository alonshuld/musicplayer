import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Header } from "./components/common/Header";
import { Logo } from "./components/common/Logo";
import { Footer } from "./components/common/Footer";

import "./App.css";

const theme = createTheme({
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
  return (
    <ThemeProvider theme={theme}>
      <Header
        left={[<Logo />]}
        center={[<div>searchbar</div>]}
        right={[<div>admin button</div>]}
      />
      <Footer
        left={[<div>queue</div>, <div>playing now</div>]}
        center={[<span>[ || ]</span>, <div>---------------</div>]}
        right={[<div>volume</div>, <div>shuffle</div>, <div>repeat</div>]}
      />
    </ThemeProvider>
  );
}

export default App;
