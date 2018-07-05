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
import * as members from '../modules/members'

type Props = {
  members: members.Member[]
}

function Members(props: Props) {
  return (
    <Paper>
      <Toolbar>
        <Typography variant="subheading">職員</Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>職員名</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.members.map(member => (
            <TableRow key={member.index}>
              <TableCell>{member.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

function mapStateToProps(state: all.State) {
  return {
    members: state.members
  }
}

export default connect(mapStateToProps)(Members)
