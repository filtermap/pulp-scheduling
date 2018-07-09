import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import * as all from '../modules/all'
import * as group_members from '../modules/group_members'
import * as groups from '../modules/groups'
import * as members from '../modules/members'

type Props = {
  group_members: group_members.GroupMember[]
  groups: groups.Group[]
  members: members.Member[]
}

function GroupMembers(props: Props) {
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">グループに所属する職員</Typography>
      </Toolbar>
      {props.group_members.map(group_member => (
        <ExpansionPanel key={group_member.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${props.groups.find(group => group.index === group_member.group_index)!.name},${props.members.find(member => member.index === group_member.member_index)!.name}`}</Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>
      ))}
    </>
  )
}

function mapStateToProps(state: all.State) {
  return {
    group_members: state.group_members,
    groups: state.groups,
    members: state.members,
  }
}

export default connect(mapStateToProps)(GroupMembers)
