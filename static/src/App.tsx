import "typeface-roboto";
import CssBaseline from "@mui/material/CssBaseline";
import { blue, teal } from "@mui/material/colors";
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import Layout from "./components/Layout";
import * as store from "./modules/store";

function App(): JSX.Element {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? "dark" : "light",
      primary: blue,
      secondary: teal,
    },
  });
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <Provider store={store.store}>
          <Router>
            <Layout />
          </Router>
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
