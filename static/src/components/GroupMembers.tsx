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
import * as allModule from '../modules/all'

type Props = {
  group_members: allModule.GroupMember[]
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
              <TableCell>{group_member.group_name}</TableCell>
              <TableCell>{group_member.member_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

function mapStateToProps(state: allModule.State) {
  return {
    group_members: state.group_members
  }
}

export default connect(mapStateToProps)(GroupMembers)
