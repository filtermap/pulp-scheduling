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
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import classnames from 'classnames'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { StateWithHistory } from 'redux-undo'
import * as all from '../modules/all'
import * as assignments from '../modules/assignments'
import * as constraint0_kinmus from '../modules/constraint0_kinmus'
import * as constraints1 from '../modules/constraints1'
import * as constraints10 from '../modules/constraints10'
import * as constraints2 from '../modules/constraints2'
import * as constraints3 from '../modules/constraints3'
import * as constraints4 from '../modules/constraints4'
import * as constraints5 from '../modules/constraints5'
import * as constraints6 from '../modules/constraints6'
import * as constraints7 from '../modules/constraints7'
import * as constraints8 from '../modules/constraints8'
import * as constraints9 from '../modules/constraints9'
import * as groups from '../modules/groups'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  dispatch: Dispatch
  kinmu: kinmus.Kinmu
  kinmus: kinmus.Kinmu[]
  assignments: assignments.Assignment[]
  constraint0_kinmus: constraint0_kinmus.Constraint0Kinmu[]
  constraints1: constraints1.Constraint1[]
  constraints2: constraints2.Constraint2[]
  constraints3: constraints3.Constraint3[]
  constraints4: constraints4.Constraint4[]
  constraints5: constraints5.Constraint5[]
  constraints6: constraints6.Constraint6[]
  constraints7: constraints7.Constraint7[]
  constraints8: constraints8.Constraint8[]
  constraints9: constraints9.Constraint9[]
  constraints10: constraints10.Constraint10[]
  members: members.Member[]
  groups: groups.Group[]
} & WithStyles<typeof styles>

type Dirty = {
  kinmuName: string
}

type ErrorMessages = {
  kinmuName: string[]
}

type State = {
  deletionDialogIsOpen: boolean
  expanded: boolean
  dirty: Dirty
  errorMessages: ErrorMessages
}

class Kinmu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      deletionDialogIsOpen: false,
      dirty: {
        kinmuName: props.kinmu.name,
      },
      errorMessages: {
        kinmuName: [],
      },
      expanded: false,
    }
  }
  public handleClickExpand = () => {
    this.setState({ expanded: !this.state.expanded })
  }
  public handleChangeKinmuIsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.props.dispatch(kinmus.updateKinmuIsEnabled(this.props.kinmu.id, checked))
  }
  public validate(dirty: Dirty): ErrorMessages {
    const errorMessages: ErrorMessages = {
      kinmuName: [],
    }
    if (dirty.kinmuName === '') { errorMessages.kinmuName.push('勤務名を入力してください') }
    return errorMessages
  }
  public handleChangeKinmuName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const kinmuName = event.target.value
    const dirty = { ...this.state.dirty, kinmuName }
    const errorMessages = this.validate(dirty)
    this.setState({ dirty, errorMessages })
    if (errorMessages.kinmuName.length > 0) { return }
    this.props.dispatch(kinmus.updateKinmuName(this.props.kinmu.id, kinmuName))
  }
  public handleClickOpenDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: true })
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteKinmu = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(all.deleteKinmu(this.props.kinmu.id))
  }
  public render() {
    const kinmuRosterIds = Array.from(new Set(this.props.assignments.filter(({ kinmu_id }) => kinmu_id === this.props.kinmu.id).map(({ roster_id }) => roster_id)))
    const kinmuConstraint0Ids = Array.from(new Set(this.props.constraint0_kinmus.filter(({ kinmu_id }) => kinmu_id === this.props.kinmu.id).map(({ constraint0_id }) => constraint0_id)))
    const kinmuConstraints1 = this.props.constraints1.filter(c => c.kinmu_id === this.props.kinmu.id)
    const kinmuConstraints2 = this.props.constraints2.filter(c => c.kinmu_id === this.props.kinmu.id)
    const kinmuConstraints3 = this.props.constraints3.filter(c => c.kinmu_id === this.props.kinmu.id)
    const kinmuConstraints4 = this.props.constraints4.filter(c => c.kinmu_id === this.props.kinmu.id)
    const kinmuConstraints5 = this.props.constraints5.filter(c => c.kinmu_id === this.props.kinmu.id)
    const kinmuConstraints6 = this.props.constraints6.filter(c => c.kinmu_id === this.props.kinmu.id)
    const kinmuConstraints7 = this.props.constraints7.filter(c => c.kinmu_id === this.props.kinmu.id)
    const kinmuConstraints8 = this.props.constraints8.filter(c => c.kinmu_id === this.props.kinmu.id)
    const kinmuConstraints9 = this.props.constraints9.filter(c => c.kinmu_id === this.props.kinmu.id)
    const kinmuConstraints10 = this.props.constraints10.filter(c => c.kinmu_id === this.props.kinmu.id)
    return (
      <>
        <Card>
          <CardHeader
            avatar={
              <Switch
                checked={this.props.kinmu.is_enabled}
                onChange={this.handleChangeKinmuIsEnabled}
                color="primary"
              />
            }
            action={
              <IconButton
                className={classnames(this.props.classes.expand, {
                  [this.props.classes.expandOpen]: this.state.expanded,
                })}
                onClick={this.handleClickExpand}
                aria-expanded={this.state.expanded}
              >
                <ExpandMoreIcon />
              </IconButton>
            }
            title={this.props.kinmu.name}
            titleTypographyProps={{
              variant: 'headline',
            }}
          />
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit={true}>
            <CardContent>
              <Grid container={true} spacing={8}>
                <Grid item={true} xs={12}>
                  <TextField
                    label="勤務名"
                    defaultValue={this.props.kinmu.name}
                    onChange={this.handleChangeKinmuName}
                    margin="normal"
                    error={this.state.errorMessages.kinmuName.length > 0}
                    FormHelperTextProps={{
                      component: 'div',
                    }}
                    helperText={this.state.errorMessages.kinmuName.map(message =>
                      <div key={message}>{message}</div>
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions disableActionSpacing={true}>
              <Button size="small" onClick={this.handleClickOpenDeletionDialog}>削除</Button>
            </CardActions>
          </Collapse>
        </Card>
        <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
          <DialogTitle>勤務の削除</DialogTitle>
          <DialogContent>
            <Grid container={true} spacing={8}>
              <Grid item={true} xs={12}>
                <DialogContentText>この勤務を削除します</DialogContentText>
                <Typography>{this.props.kinmu.name}</Typography>
              </Grid>
              <Grid item={true} xs={12}>
                {kinmuRosterIds.length > 0 && <DialogContentText>以下の勤務表も削除されます</DialogContentText>}
                {kinmuRosterIds.map(roster_id => <Typography key={roster_id}>{`勤務表${roster_id}`}</Typography>)}
              </Grid>
              <Grid item={true} xs={12}>
                {(kinmuConstraint0Ids.length > 0 ||
                  kinmuConstraints1.length > 0 ||
                  kinmuConstraints2.length > 0 ||
                  kinmuConstraints3.length > 0 ||
                  kinmuConstraints4.length > 0 ||
                  kinmuConstraints5.length > 0 ||
                  kinmuConstraints6.length > 0 ||
                  kinmuConstraints7.length > 0 ||
                  kinmuConstraints8.length > 0 ||
                  kinmuConstraints9.length > 0 ||
                  kinmuConstraints10.length > 0) &&
                  <DialogContentText>以下の条件も削除されます</DialogContentText>}
                {kinmuConstraint0Ids.map(c0_id => <Typography key={c0_id}>{this.props.constraint0_kinmus.filter(c0_kinmu => c0_kinmu.constraint0_id === c0_id).sort((a, b) => a.sequence_number - b.sequence_number).map(({ kinmu_id }) => this.props.kinmus.find(kinmu => kinmu.id === kinmu_id)!.name).join(', ')}</Typography>)}
                {kinmuConstraints1.map(c => <Typography key={c.id}>{`${c.start_date_name}から${c.stop_date_name}までの${this.props.kinmu.name}に${this.props.groups.find(group => group.id === c.group_id)!.name}から${c.min_number_of_assignments}人以上の職員を割り当てる`}</Typography>)}
                {kinmuConstraints2.map(c => <Typography key={c.id}>{`${c.start_date_name}から${c.stop_date_name}までの${this.props.kinmu.name}に${this.props.groups.find(group => group.id === c.group_id)!.name}から${c.max_number_of_assignments}人以下の職員を割り当てる`}</Typography>)}
                {kinmuConstraints3.map(c => <Typography key={c.id}>{`${this.props.members.find(member => member.id === c.member_id)!.name}に${this.props.kinmu.name}を${c.min_number_of_assignments}回以上割り当てる`}</Typography>)}
                {kinmuConstraints4.map(c => <Typography key={c.id}>{`${this.props.members.find(member => member.id === c.member_id)!.name}に${this.props.kinmu.name}を${c.max_number_of_assignments}回以下割り当てる`}</Typography>)}
                {kinmuConstraints5.map(c => <Typography key={c.id}>{`${this.props.kinmu.name}の連続日数を${c.min_number_of_days}日以上にする`}</Typography>)}
                {kinmuConstraints6.map(c => <Typography key={c.id}>{`${this.props.kinmu.name}の連続日数を${c.max_number_of_days}日以下にする`}</Typography>)}
                {kinmuConstraints7.map(c => <Typography key={c.id}>{`${this.props.kinmu.name}の間隔日数を${c.min_number_of_days}日以上にする`}</Typography>)}
                {kinmuConstraints8.map(c => <Typography key={c.id}>{`${this.props.kinmu.name}の間隔日数を${c.max_number_of_days}日以下にする`}</Typography>)}
                {kinmuConstraints9.map(c => <Typography key={c.id}>{`${this.props.members.find(member => member.id === c.member_id)!.name}の${c.start_date_name}から${c.stop_date_name}までに${this.props.kinmu.name}を割り当てる`}</Typography>)}
                {kinmuConstraints10.map(c => <Typography key={c.id}>{`${this.props.members.find(member => member.id === c.member_id)!.name}の${c.start_date_name}から${c.stop_date_name}までに${this.props.kinmu.name}を割り当てない`}</Typography>)}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickDeleteKinmu}>削除</Button>
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
    constraint0_kinmus: state.present.constraint0_kinmus,
    constraints1: state.present.constraints1,
    constraints10: state.present.constraints10,
    constraints2: state.present.constraints2,
    constraints3: state.present.constraints3,
    constraints4: state.present.constraints4,
    constraints5: state.present.constraints5,
    constraints6: state.present.constraints6,
    constraints7: state.present.constraints7,
    constraints8: state.present.constraints8,
    constraints9: state.present.constraints9,
    groups: state.present.groups,
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
})

export default withStyles(styles)(connect(mapStateToProps)(Kinmu))
