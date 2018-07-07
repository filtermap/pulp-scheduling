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
import * as c1 from '../modules/c1'
import * as groups from '../modules/groups'
import * as kinmus from '../modules/kinmus'

type Props = {
  c1: c1.C1[]
  kinmus: kinmus.Kinmu[]
  groups: groups.Group[]
}

function C1(props: Props) {
  return (
    <Paper>
      <Toolbar>
        <Typography variant="subheading">期間の勤務にグループから割り当てる職員数の下限</Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>開始日</TableCell>
            <TableCell>終了日</TableCell>
            <TableCell>勤務名</TableCell>
            <TableCell>グループ名</TableCell>
            <TableCell>割り当て職員数下限</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.c1.map(c => (
            <TableRow key={c.index}>
              <TableCell>{c.start_date_name}</TableCell>
              <TableCell>{c.stop_date_name}</TableCell>
              <TableCell>{props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}</TableCell>
              <TableCell>{props.groups.find(group => group.index === c.group_index)!.name}</TableCell>
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
    c1: state.c1,
    groups: state.groups,
    kinmus: state.kinmus,
  }
}

export default connect(mapStateToProps)(C1)
