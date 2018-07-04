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
import * as allModule from '../modules/all'

type Props = {
  groups: allModule.Group[]
}

function Groups(props: Props) {
  return (
    <Paper>
      <Toolbar>
        <Typography variant="subheading">グループ</Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>グループ名</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.groups.map(group => (
            <TableRow key={group.index}>
              <TableCell>{group.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

function mapStateToProps(state: allModule.State) {
  return {
    groups: state.groups
  }
}

export default connect(mapStateToProps)(Groups)
