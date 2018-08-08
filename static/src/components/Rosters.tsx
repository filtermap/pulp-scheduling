import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import { WithStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { StateWithHistory } from 'redux-undo'
import * as all from '../modules/all'
import * as assignments from '../modules/assignments'
import * as utils from '../utils'
import Roster from './Roster'

type Props = {
  dispatch: Dispatch
  all: all.All
} & WithStyles<typeof styles>

type State = {
  creationDialogIsOpen: boolean
  inProgress: boolean
  errorMessage: string
  newRosterAssignments: assignments.Assignment[]
}

const dateNamePattern = /^(\d{4})-(\d{1,2})-(\d{1,2})$/

function dateNameToDate(dateName: string): Date {
  const [, year, month, day] = dateName.match(dateNamePattern)!
  return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10))
}

function sortDateNames(dateNames: string[]): string[] {
  return [...dateNames].sort((a, b) => dateNameToDate(a).getTime() - dateNameToDate(b).getTime())
}

class Rosters extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    errorMessage: '',
    inProgress: false,
    newRosterAssignments: [],
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleClickSolve = async () => {
    this.setState({ inProgress: true })
    const response = await utils.sendJSONRPCRequest('solve', [this.props.all])
    if (response.hasOwnProperty('error')) {
      this.setState({
        errorMessage: response.error.message,
        inProgress: false,
      })
      return
    }
    this.setState({
      inProgress: false,
      newRosterAssignments: response.result,
    })
  }
  public handleClickCreateRoster = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(all.createRoster(this.state.newRosterAssignments))
  }
  public render() {
    const newRosterDateNames = sortDateNames(Array.from(new Set(this.state.newRosterAssignments.map(({ date_name }) => date_name))))
    const newRosterMemberIds = Array.from(new Set(this.state.newRosterAssignments.map(({ member_id }) => member_id)))
    const newRosterMembers = this.props.all.members.filter(({ id }) => newRosterMemberIds.includes(id))
    return (
      <>
        <div className={this.props.classes.gridFrame}>
          <Grid container={true} spacing={8}>
            <Grid item={true} xs={12}>
              <Toolbar>
                <Typography variant="subheading" className={this.props.classes.toolbarTitle}>勤務表</Typography>
                <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
              </Toolbar>
            </Grid>
            {this.props.all.rosters.map(roster => (
              <Grid key={roster.id} item={true} xs={12}>
                <Roster roster={roster} />
              </Grid>
            ))}
          </Grid>
        </div>
        {this.state.inProgress ?
          <Dialog open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>勤務表の追加</DialogTitle>
            <DialogContent>
              <DialogContentText>作成中...</DialogContentText>
              <LinearProgress variant="query" />
            </DialogContent>
          </Dialog> :
          this.state.errorMessage !== '' ?
            <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
              <DialogTitle>勤務表の追加</DialogTitle>
              <DialogContent>
                <DialogContentText>勤務表を作成できませんでした</DialogContentText>
                <Typography>エラーメッセージ：{this.state.errorMessage}</Typography>
              </DialogContent>
              <DialogActions>
                <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
              </DialogActions>
            </Dialog> :
            this.state.newRosterAssignments.length === 0 ?
              <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
                <DialogTitle>勤務表の追加</DialogTitle>
                <DialogContent>
                  <Button size="small" onClick={this.handleClickSolve}>自動作成</Button>
                </DialogContent>
                <DialogActions>
                  <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
                </DialogActions>
              </Dialog> :
              <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
                <DialogTitle>勤務表の追加</DialogTitle>
                <DialogContent className={this.props.classes.dialogTableContent}>
                  <div className={this.props.classes.dialogTableWrapper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell padding="dense" className={this.props.classes.leftTopHeaderCell}>\</TableCell>
                          {newRosterDateNames.map(date_name => (
                            <TableCell key={date_name} padding="dense" className={this.props.classes.topHeaderCell}>{date_name}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {newRosterMembers.map(member => {
                          const newRosterMemberAssignments = this.state.newRosterAssignments.filter(assignment => assignment.member_id === member.id)
                          return (
                            <TableRow key={member.id}>
                              <TableCell padding="dense" className={this.props.classes.leftHeaderCell}>{member.name}</TableCell>
                              {newRosterDateNames.map(date_name => (
                                <TableCell padding="dense" key={date_name}>{this.props.all.kinmus.find(kinmu => kinmu.id === newRosterMemberAssignments.find(assignment => assignment.date_name === date_name)!.kinmu_id)!.name}</TableCell>
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

const styles = createStyles({
  dialogTableContent: {
    display: 'flex',
  },
  dialogTableWrapper: {
    overflow: 'auto',
  },
  gridFrame: {
    padding: 8,
  },
  leftHeaderCell: {
    background: 'white',
    left: 0,
    position: 'sticky',
  },
  leftTopHeaderCell: {
    background: 'white',
    left: 0,
    position: 'sticky',
    top: 0,
    zIndex: 2,
  },
  toolbarTitle: {
    flex: 1,
  },
  topHeaderCell: {
    background: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
})

export default withStyles(styles)(connect(mapStateToProps)(Rosters))
