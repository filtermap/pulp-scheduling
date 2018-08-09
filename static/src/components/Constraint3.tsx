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
import * as constraints3 from '../modules/constraints3'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  dispatch: Dispatch
  constraint3: constraints3.Constraint3
  constraints3: constraints3.Constraint3[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
} & WithStyles<typeof styles>

type State = {
  expanded: boolean
  deletionDialogIsOpen: boolean
}

class Constraint3 extends React.Component<Props, State> {
  public state: State = {
    deletionDialogIsOpen: false,
    expanded: false,
  }
  public handleClickExpand = () => {
    this.setState({ expanded: !this.state.expanded })
  }
  public handleChangeConstraint3IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.props.dispatch(constraints3.updateConstraint3IsEnabled(this.props.constraint3.id, checked))
  }
  public handleChangeConstraint3MemberId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints3.updateConstraint3MemberId(this.props.constraint3.id, parseInt(event.target.value, 10)))
  }
  public handleChangeConstraint3KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints3.updateConstraint3KinmuId(this.props.constraint3.id, parseInt(event.target.value, 10)))
  }
  public handleChangeConstraint3MinNumberOfAssignments = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints3.updateConstraint3MinNumberOfAssignments(this.props.constraint3.id, parseInt(event.target.value, 10)))
  }
  public handleClickOpenDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: true })
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteConstraint3 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(constraints3.deleteConstraint3(this.props.constraint3.id))
  }
  public render() {
    const constraint3Member = this.props.members.find(({ id }) => id === this.props.constraint3.member_id)!
    const constraint3Kinmu = this.props.kinmus.find(({ id }) => id === this.props.constraint3.kinmu_id)!
    const relativesAreEnabled = constraint3Member.is_enabled && constraint3Kinmu.is_enabled
    const title = `${constraint3Member.name}に${constraint3Kinmu.name}を${this.props.constraint3.min_number_of_assignments}回以上割り当てる`
    return (
      <>
        <Card>
          <CardHeader
            action={
              <>
                <Switch
                  checked={this.props.constraint3.is_enabled && relativesAreEnabled}
                  disabled={!relativesAreEnabled}
                  onChange={this.handleChangeConstraint3IsEnabled}
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
                    select={true}
                    label="職員"
                    value={this.props.constraint3.member_id}
                    onChange={this.handleChangeConstraint3MemberId}
                    fullWidth={true}
                  >
                    {this.props.members.map(member => (
                      <MenuItem key={member.id} value={member.id}>{member.name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    select={true}
                    label="勤務"
                    value={this.props.constraint3.kinmu_id}
                    onChange={this.handleChangeConstraint3KinmuId}
                    fullWidth={true}
                  >
                    {this.props.kinmus.map(kinmu => (
                      <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    label="割り当て数下限"
                    type="number"
                    defaultValue={this.props.constraint3.min_number_of_assignments}
                    onChange={this.handleChangeConstraint3MinNumberOfAssignments}
                    fullWidth={true}
                    inputProps={{
                      min: constraints3.minOfConstraint3MinNumberOfAssignments,
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
          <DialogTitle>職員の勤務の割り当て数の下限の削除</DialogTitle>
          <DialogContent>
            <DialogContentText>この職員の勤務の割り当て数の下限を削除します</DialogContentText>
            <Typography>{title}</Typography>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickDeleteConstraint3}>削除</Button>
            <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    constraints3: state.present.constraints3,
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

export default withStyles(styles)(connect(mapStateToProps)(Constraint3))
