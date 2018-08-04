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
import * as constraints10 from '../modules/constraints10'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  dispatch: Dispatch
  constraint10: constraints10.Constraint10
  constraints10: constraints10.Constraint10[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
} & WithStyles<typeof styles>

type State = {
  expanded: boolean
  deletionDialogIsOpen: boolean
}

class Constraint10 extends React.Component<Props, State> {
  public state: State = {
    deletionDialogIsOpen: false,
    expanded: false,
  }
  public handleClickExpand = () => {
    this.setState({ expanded: !this.state.expanded })
  }
  public handleChangeConstraint10IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.props.dispatch(constraints10.updateConstraint10IsEnabled(this.props.constraint10.id, checked))
  }
  public handleChangeConstraint10MemberId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints10.updateConstraint10MemberId(this.props.constraint10.id, parseInt(event.target.value, 10)))
  }
  public handleChangeConstraint10StartDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints10.updateConstraint10StartDateName(this.props.constraint10.id, event.target.value))
  }
  public handleChangeConstraint10StopDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints10.updateConstraint10StopDateName(this.props.constraint10.id, event.target.value))
  }
  public handleChangeConstraint10KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints10.updateConstraint10KinmuId(this.props.constraint10.id, parseInt(event.target.value, 10)))
  }
  public handleClickOpenDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: true })
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteConstraint10 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(constraints10.deleteConstraint10(this.props.constraint10.id))
  }
  public render() {
    return (
      <>
        <Card>
          <CardHeader
            action={
              <>
                <Switch
                  checked={this.props.constraint10.is_enabled}
                  onChange={this.handleChangeConstraint10IsEnabled}
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
            title={`${this.props.members.find(member => member.id === this.props.constraint10.member_id)!.name}の${this.props.constraint10.start_date_name}から${this.props.constraint10.stop_date_name}までに${this.props.kinmus.find(kinmu => kinmu.id === this.props.constraint10.kinmu_id)!.name}を割り当てない`}
          />
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit={true}>
            <CardContent>
              <Grid container={true} spacing={8}>
                <Grid item={true} xs={12}>
                  <TextField
                    select={true}
                    label="職員"
                    value={this.props.constraint10.member_id}
                    onChange={this.handleChangeConstraint10MemberId}
                    fullWidth={true}
                  >
                    {this.props.members.map(member => (
                      <MenuItem key={member.id} value={member.id}>{member.name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    label="開始日"
                    type="date"
                    defaultValue={this.props.constraint10.start_date_name}
                    onChange={this.handleChangeConstraint10StartDateName}
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
                    defaultValue={this.props.constraint10.stop_date_name}
                    onChange={this.handleChangeConstraint10StopDateName}
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
                    value={this.props.constraint10.kinmu_id}
                    onChange={this.handleChangeConstraint10KinmuId}
                    fullWidth={true}
                  >
                    {this.props.kinmus.map(kinmu => (
                      <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={this.handleClickOpenDeletionDialog}>削除</Button>
            </CardActions>
          </Collapse>
        </Card>
        <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
          <DialogTitle>職員の期間に割り当てない勤務の削除</DialogTitle>
          <DialogContent>
            <DialogContentText>この職員の期間に割り当てない勤務を削除します</DialogContentText>
            <Typography>{`${this.props.members.find(member => member.id === this.props.constraint10.member_id)!.name}の${this.props.constraint10.start_date_name}から${this.props.constraint10.stop_date_name}までに${this.props.kinmus.find(kinmu => kinmu.id === this.props.constraint10.kinmu_id)!.name}を割り当てない`}</Typography>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickDeleteConstraint10}>削除</Button>
            <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    constraints10: state.present.constraints10,
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

export default withStyles(styles)(connect(mapStateToProps)(Constraint10))
