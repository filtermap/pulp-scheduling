import { connect } from 'react-redux'
import Groups from '../components/Groups'
import * as allModule from '../modules/all'

function mapStateToProps(state: allModule.State) {
  return {
    groups: state.groups
  }
}

export default connect(mapStateToProps)(Groups)
