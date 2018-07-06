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
import * as utils from './utils'

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

async function readAll() {
  store.dispatch(allModule.replaceAll((await utils.sendJSONRPCRequest('read_all')).result))
}

readAll()
