import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
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
    <Paper>
      <Toolbar>
        <Typography variant="subheading">グループに所属する職員</Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>グループ名</TableCell>
            <TableCell>職員名</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.group_members.map(group_member => (
            <TableRow key={group_member.index}>
              <TableCell>{props.groups.find(group => group.index === group_member.group_index)!.name}</TableCell>
              <TableCell>{props.members.find(member => member.index === group_member.member_index)!.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
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
