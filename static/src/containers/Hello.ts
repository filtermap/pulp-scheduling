import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import Hello from '../components/Hello'
import * as enthusiasm from '../modules/enthusiasm'

export function mapStateToProps({ enthusiasmLevel, languageName }: enthusiasm.IState) {
  return {
    enthusiasmLevel,
    name: languageName,
  }
}

export function mapDispatchToProps(dispatch: Dispatch<enthusiasm.Action>) {
  return {
    onIncrement() { return dispatch(enthusiasm.increment()) },
    onDecrement() { return dispatch(enthusiasm.decrement()) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Hello)
