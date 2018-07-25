import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import LinearProgress from '@material-ui/core/LinearProgress'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as iconv from 'iconv-lite'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { StateWithHistory } from 'redux-undo'
import * as all from '../modules/all'
import * as assignments from '../modules/assignments'
import * as utils from '../utils'

const styles = createStyles({
  dialogTableWrapper: {
    overflow: 'auto',
  },
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
  all: all.All
} & WithStyles<typeof styles>

type State = {
  open: boolean
  inProgress: boolean
  assignments: assignments.Assignment[]
}

const dateNamePattern = /^(\d{4})-(\d{1,2})-(\d{1,2})$/

function dateNameToDate(dateName: string): Date {
  const [, year, month, day] = dateName.match(dateNamePattern)!
  return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10))
}

function sortDateNames(dateNames: string[]): string[] {
  return [...dateNames].sort((a, b) => dateNameToDate(a).getTime() - dateNameToDate(b).getTime())
}

class Assignments extends React.Component<Props, State> {
  public state: State = {
    assignments: [],
    inProgress: false,
    open: false,
  }
  public handleClickDeleteRoster(roster_id: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      this.props.dispatch(assignments.deleteRoster(roster_id))
    }
  }
  public handleClickExportToCSV(roster_id: number) {
    return async (_: React.MouseEvent<HTMLButtonElement>) => {
      const csv = iconv.encode((await utils.sendJSONRPCRequest('download_csv', [roster_id])).result, 'Shift_JIS')
      const a = document.createElement('a')
      a.download = `勤務表${roster_id}.csv`
      a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
      a.click()
    }
  }
  public handleClickOpenCreationDialog = async () => {
    this.setState({ open: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ open: false })
  }
  public handleClickSolve = async () => {
    this.setState({ inProgress: true })
    const newAssignments = (await utils.sendJSONRPCRequest('solve', [this.props.all])).result
    if (newAssignments.length === 0) {
      throw Error()
    }
    this.setState({
      assignments: newAssignments,
      inProgress: false,
    })
  }
  public handleClickCreateRoster = () => {
    this.setState({ open: false })
    this.props.dispatch(assignments.createRoster(this.state.assignments))
  }
  public render() {
    const roster_ids = Array.from(new Set(this.props.all.assignments.map(assignment => assignment.roster_id)))
    const date_names = sortDateNames(Array.from(new Set(this.props.all.assignments.map(assignment => assignment.date_name))))
    const new_date_names = sortDateNames(Array.from(new Set(this.state.assignments.map(assignment => assignment.date_name))))
    const members_by_new_assignments = this.props.all.members.filter(member => this.state.assignments.some(assignment => assignment.member_index === member.index))
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>勤務表</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {roster_ids.map(roster_id => {
          const assignments_by_roster_id = this.props.all.assignments.filter(assignment => assignment.roster_id === roster_id)
          const members_by_assignments = this.props.all.members.filter(member => assignments_by_roster_id.some(assignment => assignment.member_index === member.index))
          return (
            <ExpansionPanel key={roster_id}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{`勤務表${roster_id}`}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div className={this.props.classes.tableWrapper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="dense" className={this.props.classes.topHeaderCell}>\</TableCell>
                        {date_names.map(date_name => (
                          <TableCell key={date_name} padding="dense" className={this.props.classes.topHeaderCell}>{date_name}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {members_by_assignments.map(member => {
                        const assignments_by_roster_id_and_member_index = assignments_by_roster_id.filter(assignment => assignment.member_index === member.index)
                        return (
                          <TableRow key={member.index}>
                            <TableCell padding="dense" className={this.props.classes.leftHeaderCell}>{member.name}</TableCell>
                            {date_names.map(date_name => (
                              <TableCell padding="dense" key={date_name}>{this.props.all.kinmus.find(kinmu => kinmu.index === assignments_by_roster_id_and_member_index.find(assignment => assignment.date_name === date_name)!.kinmu_index)!.name}</TableCell>
                            ))}
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </ExpansionPanelDetails>
              <ExpansionPanelActions>
                <Button size="small" onClick={this.handleClickDeleteRoster(roster_id)}>削除</Button>
                <Button size="small" onClick={this.handleClickExportToCSV(roster_id)}>CSV出力</Button>
              </ExpansionPanelActions>
            </ExpansionPanel>
          )
        })}
        {this.state.inProgress ?
          <Dialog open={this.state.open} fullWidth={true} maxWidth="md">
            <DialogTitle>勤務表の追加</DialogTitle>
            <DialogContent>
              <DialogContentText>作成中...</DialogContentText>
              <LinearProgress variant="query" />
            </DialogContent>
          </Dialog> :
          this.state.assignments.length === 0 ?
            <Dialog onClose={this.handleCloseCreationDialog} open={this.state.open} fullWidth={true} maxWidth="md">
              <DialogTitle>勤務表の追加</DialogTitle>
              <DialogContent>
                <Button size="small" onClick={this.handleClickSolve}>自動作成</Button>
              </DialogContent>
              <DialogActions>
                <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
              </DialogActions>
            </Dialog> :
            <Dialog onClose={this.handleCloseCreationDialog} open={this.state.open} fullWidth={true} maxWidth="md">
              <DialogTitle>勤務表の追加</DialogTitle>
              <DialogContent style={{ display: 'flex' }}>
                <div className={this.props.classes.dialogTableWrapper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="dense" className={this.props.classes.topHeaderCell}>\</TableCell>
                        {new_date_names.map(date_name => (
                          <TableCell key={date_name} padding="dense" className={this.props.classes.topHeaderCell}>{date_name}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {members_by_new_assignments.map(member => {
                        const assignments_by_member_index = this.state.assignments.filter(assignment => assignment.member_index === member.index)
                        return (
                          <TableRow key={member.index}>
                            <TableCell padding="dense" className={this.props.classes.leftHeaderCell}>{member.name}</TableCell>
                            {new_date_names.map(date_name => (
                              <TableCell padding="dense" key={date_name}>{this.props.all.kinmus.find(kinmu => kinmu.index === assignments_by_member_index.find(assignment => assignment.date_name === date_name)!.kinmu_index)!.name}</TableCell>
                            ))}
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
              <DialogActions>
                <Button color="primary" onClick={this.handleClickCreateRoster}>追加</Button>
                <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
              </DialogActions>
            </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    all: state.present
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Assignments))
