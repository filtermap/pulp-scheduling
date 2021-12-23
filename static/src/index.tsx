import * as React from "react";
import * as ReactDOM from "react-dom";

import "ts-polyfill/lib/es2015-core";
import "ts-polyfill/lib/es2016-array-include";
import "ts-polyfill/lib/es2017-object";
import "ts-polyfill/lib/es2017-string";
import App from "./App";

const main = () => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root") as HTMLElement
  );
};

main();
