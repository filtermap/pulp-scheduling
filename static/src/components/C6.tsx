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
import * as c6 from '../modules/c6'
import * as kinmus from '../modules/kinmus'

type Props = {
  c6: c6.C6[]
  kinmus: kinmus.Kinmu[]
}

function C6(props: Props) {
  return (
    <Paper>
      <Toolbar>
        <Typography variant="subheading">勤務の連続日数の上限</Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>勤務名</TableCell>
            <TableCell>連続日数上限</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.c6.map(c => (
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
    c6: state.c6,
    kinmus: state.kinmus
  }
}

export default connect(mapStateToProps)(C6)
