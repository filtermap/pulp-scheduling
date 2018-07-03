import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'
import * as allModule from '../modules/all'

type Props = {
  renzoku_kinshi_kinmus: allModule.RenzokuKinshiKinmu[]
}

export default function RenzokuKinshiKinmus(props: Props) {
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
              <TableCell>{renzoku_kinshi_kinmu.kinmu_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
