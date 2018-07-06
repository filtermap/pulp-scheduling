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
import * as c3 from '../modules/c3'

type Props = {
  c3: c3.C3[]
}

function C3(props: Props) {
  return (
    <Paper>
      <Toolbar>
        <Typography variant="subheading">職員の勤務の割り当て数の下限</Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>職員名</TableCell>
            <TableCell>勤務名</TableCell>
            <TableCell>割り当て数下限</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.c3.map(c => (
            <TableRow key={c.index}>
              <TableCell>{c.member_name}</TableCell>
              <TableCell>{c.kinmu_name}</TableCell>
              <TableCell>{c.min_number_of_assignments}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

function mapStateToProps(state: all.State) {
  return {
    c3: state.c3
  }
}

export default connect(mapStateToProps)(C3)
