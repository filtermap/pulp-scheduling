import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Collapse from '@material-ui/core/Collapse'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import { Theme, WithStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import classnames from 'classnames'
import * as iconv from 'iconv-lite'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { StateWithHistory } from 'redux-undo'
import * as all from '../modules/all'
import * as assignments from '../modules/assignments'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'
import * as rosters from '../modules/rosters'
import * as utils from '../utils'

type Props = {
  dispatch: Dispatch
  roster: rosters.Roster
  assignments: assignments.Assignment[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
} & WithStyles<typeof styles>

type State = {
  expanded: boolean
  deletionDialogIsOpen: boolean
}

function sortDateNames(dateNames: string[]): string[] {
  return [...dateNames].sort((a, b) => utils.stringToDate(a).getTime() - utils.stringToDate(b).getTime())
}

class Roster extends React.Component<Props, State> {
  public state: State = {
    deletionDialogIsOpen: false,
    expanded: false,
  }
  public handleClickExpand = () => {
    this.setState({ expanded: !this.state.expanded })
  }
  public handleClickOpenDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: true })
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteRoster = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(all.deleteRoster(this.props.roster.id))
  }
  public handleClickExportToCSV = async () => {
    const assignments_by_roster_id = this.props.assignments.filter(assignment => assignment.roster_id === this.props.roster.id)
    const csv = iconv.encode((await utils.sendJSONRPCRequest('download_csv', [assignments_by_roster_id, this.props.members, this.props.kinmus])).result, 'Shift_JIS')
    const a = document.createElement('a')
    a.download = `勤務表${this.props.roster.id}.csv`
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.click()
  }
  public render() {
    const roster_assignments = this.props.assignments.filter(assignment => assignment.roster_id === this.props.roster.id)
    const roster_date_names = sortDateNames(Array.from(new Set(this.props.assignments.map(({ date_name }) => date_name))))
    const roster_member_ids = Array.from(new Set(roster_assignments.map(({ member_id }) => member_id)))
    const roster_members = this.props.members.filter(({ id }) => roster_member_ids.includes(id))
    return (
      <>
        <Card>
          <CardHeader
            action={
              <>
                <IconButton
                  className={classnames(this.props.classes.expand, {
                    [this.props.classes.expandOpen]: this.state.expanded,
                  })}
                  onClick={this.handleClickExpand}
                  aria-expanded={this.state.expanded}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </>
            }
            title={`勤務表${this.props.roster.id}`}
          />
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit={true}>
            <CardContent>
              <Grid container={true} spacing={8}>
                <Grid item={true} xs={12}>
                  <div className={this.props.classes.tableWrapper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell padding="dense" className={this.props.classes.leftTopHeaderCell}>\</TableCell>
                          {roster_date_names.map(date_name => (
                            <TableCell key={date_name} padding="dense" className={this.props.classes.topHeaderCell}>{date_name}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {roster_members.map(member => {
                          const roster_member_assignments = roster_assignments.filter(assignment => assignment.member_id === member.id)
                          return (
                            <TableRow key={member.id}>
                              <TableCell padding="dense" className={this.props.classes.leftHeaderCell}>{member.name}</TableCell>
                              {roster_date_names.map(date_name => (
                                <TableCell padding="dense" key={date_name}>{this.props.kinmus.find(kinmu => kinmu.id === roster_member_assignments.find(assignment => assignment.date_name === date_name)!.kinmu_id)!.name}</TableCell>
                              ))}
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions disableActionSpacing={true}>
              <Button size="small" onClick={this.handleClickOpenDeletionDialog}>削除</Button>
              <Button size="small" onClick={this.handleClickExportToCSV}>CSV出力</Button>
            </CardActions>
          </Collapse>
        </Card>
        <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
          <DialogTitle>勤務表の削除</DialogTitle>
          <DialogContent>
            <DialogContentText>この勤務表を削除します</DialogContentText>
            <Typography>{`勤務表${this.props.roster.id}`}</Typography>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickDeleteRoster}>削除</Button>
            <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    assignments: state.present.assignments,
    kinmus: state.present.kinmus,
    members: state.present.members,
  }
}

const styles = (theme: Theme) => createStyles({
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
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

export default withStyles(styles)(connect(mapStateToProps)(Roster))
