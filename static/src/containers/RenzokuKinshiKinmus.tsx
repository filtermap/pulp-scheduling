import { connect } from 'react-redux'
import RenzokuKinshiKinmus from '../components/RenzokuKinshiKinmus'
import * as allModule from '../modules/all'

function mapStateToProps(state: allModule.State) {
  return {
    renzoku_kinshi_kinmus: state.renzoku_kinshi_kinmus
  }
}

export default connect(mapStateToProps)(RenzokuKinshiKinmus)
