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
import * as c7 from '../modules/c7'

type Props = {
  c7: c7.C7[]
}

function C7(props: Props) {
  return (
    <Paper>
      <Toolbar>
        <Typography variant="subheading">勤務の間隔日数の下限</Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>勤務名</TableCell>
            <TableCell>間隔日数下限</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.c7.map(c => (
            <TableRow key={c.index}>
              <TableCell>{c.kinmu_name}</TableCell>
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
    c7: state.c7
  }
}

export default connect(mapStateToProps)(C7)
