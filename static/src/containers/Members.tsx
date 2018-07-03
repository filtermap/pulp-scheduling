import { connect } from 'react-redux'
import Members from '../components/Members'
import * as allModule from '../modules/all'

function mapStateToProps(state: allModule.State) {
  return {
    members: state.members
  }
}

export default connect(mapStateToProps)(Members)
