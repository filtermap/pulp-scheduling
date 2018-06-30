import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import All from './containers/All'
import './index.css'
import * as allModule from './modules/all'
import registerServiceWorker from './registerServiceWorker'

const store = createStore(allModule.reducer)

ReactDOM.render(
  <Provider store={store}>
    <All />
  </Provider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()

fetch('/api', { method: 'post', body: JSON.stringify({ method: 'read_all', jsonrpc: '2.0', id: 1 }) }).then(response => response.json()).then(json => store.dispatch(allModule.replace(json.result)))
