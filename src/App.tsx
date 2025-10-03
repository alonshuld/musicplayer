import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Logo } from "./components/common/Logo";

import "./App.css";

const theme = createTheme({
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
      <Logo />
    </ThemeProvider>
  );
}

export default App;
