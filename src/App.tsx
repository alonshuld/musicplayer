import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Header } from "./components/common/Header";
import { Logo } from "./components/common/Logo";

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
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Header items={[<Logo />]} />
    </ThemeProvider>
  );
}

export default App;
