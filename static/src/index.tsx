import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Hello from './containers/Hello';
import './index.css';
import * as enthusiasm from './modules/enthusiasm';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(enthusiasm.reducer);

ReactDOM.render(
  <Provider store={store}>
    <Hello />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
