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
import MenuItem from '@material-ui/core/MenuItem'
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
import * as constraints1 from '../modules/constraints1'
import * as groups from '../modules/groups'
import * as kinmus from '../modules/kinmus'

type Props = {
  dispatch: Dispatch
  constraint1: constraints1.Constraint1
  constraints1: constraints1.Constraint1[]
  kinmus: kinmus.Kinmu[]
  groups: groups.Group[]
} & WithStyles<typeof styles>

type State = {
  expanded: boolean
  deletionDialogIsOpen: boolean
}

class Constraint1 extends React.Component<Props, State> {
  public state: State = {
    deletionDialogIsOpen: false,
    expanded: false,
  }
  public handleClickExpand = () => {
    this.setState({ expanded: !this.state.expanded })
  }
  public handleChangeConstraint1IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.props.dispatch(constraints1.updateConstraint1IsEnabled(this.props.constraint1.id, checked))
  }
  public handleChangeConstraint1StartDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints1.updateConstraint1StartDateName(this.props.constraint1.id, event.target.value))
  }
  public handleChangeConstraint1StopDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints1.updateConstraint1StopDateName(this.props.constraint1.id, event.target.value))
  }
  public handleChangeConstraint1KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints1.updateConstraint1KinmuId(this.props.constraint1.id, parseInt(event.target.value, 10)))
  }
  public handleChangeConstraint1GroupId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints1.updateConstraint1GroupId(this.props.constraint1.id, parseInt(event.target.value, 10)))
  }
  public handleChangeConstraint1MinNumberOfAssignments = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints1.updateConstraint1MinNumberOfAssignments(this.props.constraint1.id, parseInt(event.target.value, 10)))
  }
  public handleClickOpenDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: true })
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteConstraint1 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(constraints1.deleteConstraint1(this.props.constraint1.id))
  }
  public render() {
    const constraint1Kinmu = this.props.kinmus.find(({ id }) => id === this.props.constraint1.kinmu_id)!
    const constraint1Group = this.props.groups.find(({ id }) => id === this.props.constraint1.group_id)!
    const relativesAreEnabled = constraint1Kinmu.is_enabled && constraint1Group.is_enabled
    const title = `${this.props.constraint1.start_date_name}から${this.props.constraint1.stop_date_name}までの${constraint1Kinmu.name}に${constraint1Group.name}から${this.props.constraint1.min_number_of_assignments}人以上の職員を割り当てる`
    return (
      <>
        <Card>
          <CardHeader
            action={
              <>
                <Switch
                  checked={this.props.constraint1.is_enabled && relativesAreEnabled}
                  disabled={!relativesAreEnabled}
                  onChange={this.handleChangeConstraint1IsEnabled}
                  color="primary"
                />
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
            title={title}
          />
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit={true}>
            <CardContent>
              <Grid container={true} spacing={8}>
                <Grid item={true} xs={12}>
                  <TextField
                    label="開始日"
                    type="date"
                    defaultValue={this.props.constraint1.start_date_name}
                    onChange={this.handleChangeConstraint1StartDateName}
                    fullWidth={true}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    label="終了日"
                    type="date"
                    defaultValue={this.props.constraint1.stop_date_name}
                    onChange={this.handleChangeConstraint1StopDateName}
                    fullWidth={true}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    select={true}
                    label="勤務"
                    value={this.props.constraint1.kinmu_id}
                    onChange={this.handleChangeConstraint1KinmuId}
                    fullWidth={true}
                  >
                    {this.props.kinmus.map(kinmu => (
                      <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    select={true}
                    label="グループ"
                    value={this.props.constraint1.group_id}
                    onChange={this.handleChangeConstraint1GroupId}
                    fullWidth={true}
                  >
                    {this.props.groups.map(group => (
                      <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    label="割り当て職員数下限"
                    type="number"
                    defaultValue={this.props.constraint1.min_number_of_assignments}
                    onChange={this.handleChangeConstraint1MinNumberOfAssignments}
                    fullWidth={true}
                    inputProps={{
                      min: constraints1.minOfConstraint1MinNumberOfAssignments,
                    }}
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
          <DialogTitle>期間の勤務にグループから割り当てる職員数の下限の削除</DialogTitle>
          <DialogContent>
            <DialogContentText>この期間の勤務にグループから割り当てる職員数の下限を削除します</DialogContentText>
            <Typography>{title}</Typography>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickDeleteConstraint1}>削除</Button>
            <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    constraints1: state.present.constraints1,
    groups: state.present.groups,
    kinmus: state.present.kinmus,
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

export default withStyles(styles)(connect(mapStateToProps)(Constraint1))
