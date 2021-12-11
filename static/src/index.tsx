import blue from "@material-ui/core/colors/blue";
import teal from "@material-ui/core/colors/teal";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import "ts-polyfill/lib/es2015-core";
import "ts-polyfill/lib/es2016-array-include";
import "ts-polyfill/lib/es2017-object";
import "ts-polyfill/lib/es2017-string";
import "typeface-roboto";
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store.createStore(initialState)}>
          <Router>
            <Layout />
          </Router>
        </Provider>
      </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root") as HTMLElement
  );
}

main();
