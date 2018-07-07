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
import * as c8 from '../modules/c8'
import * as kinmus from '../modules/kinmus'

type Props = {
  c8: c8.C8[]
  kinmus: kinmus.Kinmu[]
}

function C8(props: Props) {
  return (
    <Paper>
      <Toolbar>
        <Typography variant="subheading">勤務の間隔日数の上限</Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>勤務名</TableCell>
            <TableCell>間隔日数上限</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.c8.map(c => (
            <TableRow key={c.index}>
              <TableCell>{props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}</TableCell>
              <TableCell>{c.max_number_of_days}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

function mapStateToProps(state: all.State) {
  return {
    c8: state.c8,
    kinmus: state.kinmus,
  }
}

export default connect(mapStateToProps)(C8)
