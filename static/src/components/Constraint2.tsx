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
import * as constraints2 from '../modules/constraints2'
import * as groups from '../modules/groups'
import * as kinmus from '../modules/kinmus'

type Props = {
  dispatch: Dispatch
  constraint2: constraints2.Constraint2
  constraints2: constraints2.Constraint2[]
  kinmus: kinmus.Kinmu[]
  groups: groups.Group[]
} & WithStyles<typeof styles>

type State = {
  expanded: boolean
  deletionDialogIsOpen: boolean
}

class Constraint2 extends React.Component<Props, State> {
  public state: State = {
    deletionDialogIsOpen: false,
    expanded: false,
  }
  public handleClickExpand = () => {
    this.setState({ expanded: !this.state.expanded })
  }
  public handleChangeConstraint2IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.props.dispatch(constraints2.updateConstraint2IsEnabled(this.props.constraint2.id, checked))
  }
  public handleChangeConstraint2StartDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints2.updateConstraint2StartDateName(this.props.constraint2.id, event.target.value))
  }
  public handleChangeConstraint2StopDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints2.updateConstraint2StopDateName(this.props.constraint2.id, event.target.value))
  }
  public handleChangeConstraint2KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints2.updateConstraint2KinmuId(this.props.constraint2.id, parseInt(event.target.value, 10)))
  }
  public handleChangeConstraint2GroupId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints2.updateConstraint2GroupId(this.props.constraint2.id, parseInt(event.target.value, 10)))
  }
  public handleChangeConstraint2MaxNumberOfAssignments = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints2.updateConstraint2MaxNumberOfAssignments(this.props.constraint2.id, parseInt(event.target.value, 10)))
  }
  public handleClickOpenDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: true })
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteConstraint2 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(constraints2.deleteConstraint2(this.props.constraint2.id))
  }
  public render() {
    const constraint2Kinmu = this.props.kinmus.find(({ id }) => id === this.props.constraint2.kinmu_id)!
    const constraint2Group = this.props.groups.find(({ id }) => id === this.props.constraint2.group_id)!
    const relativesAreEnabled = constraint2Kinmu.is_enabled && constraint2Group.is_enabled
    const title = `${this.props.constraint2.start_date_name}から${this.props.constraint2.stop_date_name}までの${constraint2Kinmu.name}に${constraint2Group.name}から${this.props.constraint2.max_number_of_assignments}人以下の職員を割り当てる`
    return (
      <>
        <Card>
          <CardHeader
            action={
              <>
                <Switch
                  checked={this.props.constraint2.is_enabled && relativesAreEnabled}
                  disabled={!relativesAreEnabled}
                  onChange={this.handleChangeConstraint2IsEnabled}
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
                    defaultValue={this.props.constraint2.start_date_name}
                    onChange={this.handleChangeConstraint2StartDateName}
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
                    defaultValue={this.props.constraint2.stop_date_name}
                    onChange={this.handleChangeConstraint2StopDateName}
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
                    value={this.props.constraint2.kinmu_id}
                    onChange={this.handleChangeConstraint2KinmuId}
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
                    value={this.props.constraint2.group_id}
                    onChange={this.handleChangeConstraint2GroupId}
                    fullWidth={true}
                  >
                    {this.props.groups.map(group => (
                      <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    label="割り当て職員数上限"
                    type="number"
                    defaultValue={this.props.constraint2.max_number_of_assignments}
                    onChange={this.handleChangeConstraint2MaxNumberOfAssignments}
                    fullWidth={true}
                    inputProps={{
                      min: constraints2.minOfConstraint2MaxNumberOfAssignments,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={this.handleClickOpenDeletionDialog}>削除</Button>
            </CardActions>
          </Collapse>
        </Card>
        <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
          <DialogTitle>期間の勤務にグループから割り当てる職員数の上限の削除</DialogTitle>
          <DialogContent>
            <DialogContentText>この期間の勤務にグループから割り当てる職員数の上限を削除します</DialogContentText>
            <Typography>{title}</Typography>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickDeleteConstraint2}>削除</Button>
            <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    constraints2: state.present.constraints2,
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

export default withStyles(styles)(connect(mapStateToProps)(Constraint2))
