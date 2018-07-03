import { connect } from 'react-redux'
import GroupMembers from '../components/GroupMembers'
import * as allModule from '../modules/all'

function mapStateToProps(state: allModule.State) {
  return {
    group_members: state.group_members
  }
}

export default connect(mapStateToProps)(GroupMembers)
