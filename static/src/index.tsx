import blue from "@material-ui/core/colors/blue";
import teal from "@material-ui/core/colors/teal";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { createTheme } from "@material-ui/core/styles";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { createStore } from "redux";
import undoable, { StateWithHistory } from "redux-undo";
import "ts-polyfill/lib/es2015-core";
import "ts-polyfill/lib/es2016-array-include";
import "ts-polyfill/lib/es2017-object";
import "ts-polyfill/lib/es2017-string";
import "typeface-roboto";
import Layout from "./components/Layout";
import * as all from "./modules/all";
import * as utils from "./utils";

async function main() {
  const initialState = (await utils.sendJSONRPCRequest("read_all")).result;
  const store = createStore(
    undoable(all.reducer),
    initialState as StateWithHistory<all.All>
  );
  const theme = createTheme({
    palette: {
      primary: blue,
      secondary: teal,
    },
  });
  ReactDOM.render(
    <React.StrictMode>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <Router>
            <Layout />
          </Router>
        </Provider>
      </MuiThemeProvider>
    </React.StrictMode>,
    document.getElementById("root") as HTMLElement
  );
}

main();
