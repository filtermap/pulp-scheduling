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
import * as c10 from '../modules/c10'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  c10: c10.C10[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
}

function C10(props: Props) {
  return (
    <Paper>
      <Toolbar>
        <Typography variant="subheading">職員の日付に割り当てない勤務</Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>職員名</TableCell>
            <TableCell>開始日</TableCell>
            <TableCell>終了日</TableCell>
            <TableCell>割り当てない勤務名</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.c10.map(c => (
            <TableRow key={c.index}>
              <TableCell>{props.members.find(member => member.index === c.member_index)!.name}</TableCell>
              <TableCell>{c.start_date_name}</TableCell>
              <TableCell>{c.stop_date_name}</TableCell>
              <TableCell>{props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

function mapStateToProps(state: all.State) {
  return {
    c10: state.c10,
    kinmus: state.kinmus,
    members: state.members,
  }
}

export default connect(mapStateToProps)(C10)
