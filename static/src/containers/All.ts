import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import All from '../components/All'
import * as allModule from '../modules/all'

function mapStateToProps(state: allModule.State) {
  return state
}

function mapDispatchToProps(dispatch: Dispatch<allModule.Action>) {
  return {
    replace(all: allModule.State) { return dispatch(allModule.replace(all)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(All)
