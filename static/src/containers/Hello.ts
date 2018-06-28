import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as actions from '../actions/';
import Hello from '../components/Hello';
import { IStoreState } from '../types/index';

export function mapStateToProps({ enthusiasmLevel, languageName }: IStoreState) {
  return {
    enthusiasmLevel,
    name: languageName,
  }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
  return {
    onIncrement() { return dispatch(actions.incrementEnthusiasm()) },
    onDecrement() { return dispatch(actions.decrementEnthusiasm()) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Hello);
