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
import * as c5 from '../modules/c5'
import * as kinmus from '../modules/kinmus'

type Props = {
  c5: c5.C5[]
  kinmus: kinmus.Kinmu[]
}

function C5(props: Props) {
  return (
    <Paper>
      <Toolbar>
        <Typography variant="subheading">勤務の連続日数の下限</Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>勤務名</TableCell>
            <TableCell>連続日数下限</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.c5.map(c => (
            <TableRow key={c.index}>
              <TableCell>{props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}</TableCell>
              <TableCell>{c.min_number_of_days}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

function mapStateToProps(state: all.State) {
  return {
    c5: state.c5,
    kinmus: state.kinmus,
    members: state.members,
  }
}

export default connect(mapStateToProps)(C5)