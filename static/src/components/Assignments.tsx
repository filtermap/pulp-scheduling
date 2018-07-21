import Button from '@material-ui/core/Button'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import * as all from '../modules/all'
import * as assignments from '../modules/assignments'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'
import * as utils from '../utils'

const styles = createStyles({
  leftHeaderCell: {
    background: 'white',
    left: 0,
    position: 'sticky',
  },
  tableWrapper: {
    maxHeight: 'calc(100vh - 200px)',
    overflow: 'auto',
  },
  topHeaderCell: {
    background: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
})

type Props = {
  dispatch: Dispatch
  assignments: assignments.Assignment[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
} & WithStyles<typeof styles>

const dateNamePattern = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/

function dateNameToDate(dateName: string): Date {
  const [, year, month, day] = dateName.match(dateNamePattern)!
  return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10))
}

function Assignment(props: Props) {
  const roster_ids = Array.from(new Set(props.assignments.map(assignment => assignment.roster_id)))
  const date_names = Array.from(new Set(props.assignments.map(assignment => assignment.date_name))).sort((a, b) => {
    return dateNameToDate(a).getTime() - dateNameToDate(b).getTime()
  })
  async function handleClickSolve(_: React.MouseEvent<HTMLButtonElement>) {
    await utils.sendJSONRPCRequest('solve')
    props.dispatch(all.replaceAll((await utils.sendJSONRPCRequest('read_all')).result))
  }
  return (
    <>
      <Toolbar>
        <Typography variant="subheading" style={{ flex: 1 }}>勤務表</Typography>
        <Button size="small" onClick={handleClickSolve}>作成</Button>
      </Toolbar>
      {roster_ids.map(roster_id => {
        const assignments_by_roster_id = props.assignments.filter(assignment => assignment.roster_id === roster_id)
        return (
          <ExpansionPanel key={roster_id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`勤務表${roster_id}`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div className={props.classes.tableWrapper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="dense" className={props.classes.topHeaderCell}>\</TableCell>
                      {date_names.map(date_name => (
                        <TableCell key={date_name} padding="dense" className={props.classes.topHeaderCell}>{date_name}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.members.map(member => {
                      const assignments_by_roster_id_and_member_index = assignments_by_roster_id.filter(assignment => assignment.member_index === member.index)
                      return (
                        <TableRow key={member.index}>
                          <TableCell padding="dense" className={props.classes.leftHeaderCell}>{member.name}</TableCell>
                          {date_names.map(date_name => (
                            <TableCell padding="dense" key={date_name}>{props.kinmus.find(kinmu => kinmu.index === assignments_by_roster_id_and_member_index.find(assignment => assignment.date_name === date_name)!.kinmu_index)!.name}</TableCell>
                          ))}
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )
      })}
    </>
  )
}

function mapStateToProps(state: all.State) {
  return {
    assignments: state.assignments,
    kinmus: state.kinmus,
    members: state.members,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Assignment))
