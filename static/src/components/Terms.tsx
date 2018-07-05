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
import * as terms from '../modules/terms'

type Props = {
  terms: terms.Term[]
}

function Terms(props: Props) {
  return (
    <Paper>
      <Toolbar>
        <Typography variant="subheading">期間</Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>開始日</TableCell>
            <TableCell>終了日</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.terms.map(term => (
            <TableRow key={term.index}>
              <TableCell>{term.start_date_name}</TableCell>
              <TableCell>{term.stop_date_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

function mapStateToProps(state: all.State) {
  return {
    terms: state.terms
  }
}

export default connect(mapStateToProps)(Terms)
