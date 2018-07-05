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
import * as kinmus from '../modules/kinmus'

type Props = {
  kinmus: kinmus.Kinmu[]
}

function Kinmus(props: Props) {
  return (
    <Paper>
      <Toolbar>
        <Typography variant="subheading">勤務</Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>勤務名</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.kinmus.map(kinmu => (
            <TableRow key={kinmu.index}>
              <TableCell>{kinmu.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

function mapStateToProps(state: all.State) {
  return {
    kinmus: state.kinmus
  }
}

export default connect(mapStateToProps)(Kinmus)
