import blue from '@material-ui/core/colors/blue'
import teal from '@material-ui/core/colors/teal'
import CssBaseline from '@material-ui/core/CssBaseline'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { createStore } from 'redux'
import 'typeface-roboto'
import Layout from './components/Layout'
import * as allModule from './modules/all'
import registerServiceWorker from './registerServiceWorker'

const store = createStore(allModule.reducer)

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: teal
  }
})

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <Router>
        <Layout />
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()

fetch('/api', { method: 'post', body: JSON.stringify({ method: 'read_all', jsonrpc: '2.0', id: 1 }) }).then(response => response.json()).then(json => store.dispatch(allModule.replace(json.result)))
