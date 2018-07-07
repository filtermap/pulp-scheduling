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
import * as renzoku_kinshi_kinmus from '../modules/renzoku_kinshi_kinmus'

type Props = {
  renzoku_kinshi_kinmus: renzoku_kinshi_kinmus.RenzokuKinshiKinmu[]
  kinmus: kinmus.Kinmu[]
}

function RenzokuKinshiKinmus(props: Props) {
  return (
    <Paper>
      <Toolbar>
        <Typography variant="subheading">連続禁止勤務並び</Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>並びID</TableCell>
            <TableCell>並び順</TableCell>
            <TableCell>勤務名</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.renzoku_kinshi_kinmus.map(renzoku_kinshi_kinmu => (
            <TableRow key={renzoku_kinshi_kinmu.index}>
              <TableCell>{renzoku_kinshi_kinmu.sequence_id}</TableCell>
              <TableCell>{renzoku_kinshi_kinmu.sequence_number}</TableCell>
              <TableCell>{props.kinmus.find(kinmu => kinmu.index === renzoku_kinshi_kinmu.kinmu_index)!.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

function mapStateToProps(state: all.State) {
  return {
    kinmus: state.kinmus,
    renzoku_kinshi_kinmus: state.renzoku_kinshi_kinmus,
  }
}

export default connect(mapStateToProps)(RenzokuKinshiKinmus)
