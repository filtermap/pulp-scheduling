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
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import Layout from "./components/Layout";
import i18n from "./i18n";
import * as store from "./modules/store";

// eslint-disable-next-line react/display-name
const App = React.memo((): JSX.Element => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? "dark" : "light",
      primary: blue,
      secondary: teal,
    },
  });
  return (
    <I18nextProvider i18n={i18n}>
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
    </I18nextProvider>
  );
});

export default App;
