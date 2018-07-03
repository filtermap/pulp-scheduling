import { connect } from 'react-redux'
import Kinmus from '../components/Kinmus'
import * as allModule from '../modules/all'

function mapStateToProps(state: allModule.State) {
  return {
    kinmus: state.kinmus
  }
}

export default connect(mapStateToProps)(Kinmus)
