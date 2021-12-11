import CssBaseline from "@mui/material/CssBaseline";
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import "ts-polyfill/lib/es2015-core";
import "ts-polyfill/lib/es2016-array-include";
import "ts-polyfill/lib/es2017-object";
import "ts-polyfill/lib/es2017-string";
import "typeface-roboto";
import { blue, teal } from "@mui/material/colors";
import Layout from "./components/Layout";
import * as store from "./modules/store";
import * as utils from "./utils";

async function main() {
  const initialState = (await utils.sendJSONRPCRequest("read_all")).result;
  const theme = createTheme({
    palette: {
      primary: blue,
      secondary: teal,
    },
  });
  ReactDOM.render(
    <React.StrictMode>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Provider store={store.createStore(initialState)}>
            <Router>
              <Layout />
            </Router>
          </Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    </React.StrictMode>,
    document.getElementById("root") as HTMLElement
  );
}

main();
