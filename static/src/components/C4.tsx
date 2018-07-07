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
import * as c4 from '../modules/c4'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  c4: c4.C4[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
}

function C4(props: Props) {
  return (
    <Paper>
      <Toolbar>
        <Typography variant="subheading">職員の勤務の割り当て数の上限</Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>職員名</TableCell>
            <TableCell>勤務名</TableCell>
            <TableCell>割り当て数上限</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.c4.map(c => (
            <TableRow key={c.index}>
              <TableCell>{props.members.find(member => member.index === c.member_index)!.name}</TableCell>
              <TableCell>{props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}</TableCell>
              <TableCell>{c.max_number_of_assignments}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

function mapStateToProps(state: all.State) {
  return {
    c4: state.c4,
    kinmus: state.kinmus,
    members: state.members,
  }
}

export default connect(mapStateToProps)(C4)
