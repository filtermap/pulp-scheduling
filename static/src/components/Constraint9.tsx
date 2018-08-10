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
import * as constraints9 from '../modules/constraints9'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  dispatch: Dispatch
  constraint9: constraints9.Constraint9
  constraints9: constraints9.Constraint9[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
} & WithStyles<typeof styles>

type State = {
  expanded: boolean
  deletionDialogIsOpen: boolean
}

class Constraint9 extends React.Component<Props, State> {
  public state: State = {
    deletionDialogIsOpen: false,
    expanded: false,
  }
  public handleClickExpand = () => {
    this.setState({ expanded: !this.state.expanded })
  }
  public handleChangeConstraint9IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.props.dispatch(constraints9.updateConstraint9IsEnabled(this.props.constraint9.id, checked))
  }
  public handleChangeConstraint9MemberId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints9.updateConstraint9MemberId(this.props.constraint9.id, parseInt(event.target.value, 10)))
  }
  public handleChangeConstraint9StartDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints9.updateConstraint9StartDateName(this.props.constraint9.id, event.target.value))
  }
  public handleChangeConstraint9StopDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints9.updateConstraint9StopDateName(this.props.constraint9.id, event.target.value))
  }
  public handleChangeConstraint9KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints9.updateConstraint9KinmuId(this.props.constraint9.id, parseInt(event.target.value, 10)))
  }
  public handleClickOpenDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: true })
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteConstraint9 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(constraints9.deleteConstraint9(this.props.constraint9.id))
  }
  public render() {
    const constraint9Member = this.props.members.find(({ id }) => id === this.props.constraint9.member_id)!
    const constraint9Kinmu = this.props.kinmus.find(({ id }) => id === this.props.constraint9.kinmu_id)!
    const relativesAreEnabled = constraint9Member.is_enabled && constraint9Kinmu.is_enabled
    const title = `${constraint9Member.name}の${this.props.constraint9.start_date_name}から${this.props.constraint9.stop_date_name}までに${constraint9Kinmu.name}を割り当てる`
    return (
      <>
        <Card>
          <CardHeader
            avatar={
              <Switch
                checked={this.props.constraint9.is_enabled && relativesAreEnabled}
                disabled={!relativesAreEnabled}
                onChange={this.handleChangeConstraint9IsEnabled}
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
            title={title}
            titleTypographyProps={{
              variant: 'headline',
            }}
          />
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit={true}>
            <CardContent>
              <Grid container={true} spacing={8}>
                <Grid item={true} xs={12}>
                  <TextField
                    select={true}
                    label="職員"
                    value={this.props.constraint9.member_id}
                    onChange={this.handleChangeConstraint9MemberId}
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
                    defaultValue={this.props.constraint9.start_date_name}
                    onChange={this.handleChangeConstraint9StartDateName}
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
                    defaultValue={this.props.constraint9.stop_date_name}
                    onChange={this.handleChangeConstraint9StopDateName}
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
                    value={this.props.constraint9.kinmu_id}
                    onChange={this.handleChangeConstraint9KinmuId}
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
          <DialogTitle>職員の期間に割り当てる勤務の削除</DialogTitle>
          <DialogContent>
            <DialogContentText>この職員の期間に割り当てる勤務を削除します</DialogContentText>
            <Typography>{title}</Typography>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickDeleteConstraint9}>削除</Button>
            <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    constraints9: state.present.constraints9,
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

export default withStyles(styles)(connect(mapStateToProps)(Constraint9))
