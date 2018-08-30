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
import * as constraints4 from '../modules/constraints4'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  dispatch: Dispatch
  constraint4: constraints4.Constraint4
  constraints4: constraints4.Constraint4[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
} & WithStyles<typeof styles>

type Dirty = {
  constraint4MaxNumberOfAssignments: number
}

type ErrorMessages = {
  constraint4MaxNumberOfAssignments: string[]
}

type State = {
  expanded: boolean
  deletionDialogIsOpen: boolean
  dirty: Dirty
  errorMessages: ErrorMessages
}

class Constraint4 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      deletionDialogIsOpen: false,
      dirty: {
        constraint4MaxNumberOfAssignments: props.constraint4.max_number_of_assignments,
      },
      errorMessages: {
        constraint4MaxNumberOfAssignments: [],
      },
      expanded: false,
    }
  }
  public handleClickExpand = () => {
    this.setState({ expanded: !this.state.expanded })
  }
  public handleChangeConstraint4IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.props.dispatch(constraints4.updateConstraint4IsEnabled(this.props.constraint4.id, checked))
  }
  public handleChangeConstraint4MemberId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints4.updateConstraint4MemberId(this.props.constraint4.id, parseInt(event.target.value, 10)))
  }
  public handleChangeConstraint4KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints4.updateConstraint4KinmuId(this.props.constraint4.id, parseInt(event.target.value, 10)))
  }
  public validate(dirty: Dirty): ErrorMessages {
    const errorMessages: ErrorMessages = {
      constraint4MaxNumberOfAssignments: [],
    }
    if (isNaN(dirty.constraint4MaxNumberOfAssignments)) { errorMessages.constraint4MaxNumberOfAssignments.push('割り当て数上限の形式が正しくありません') }
    return errorMessages
  }
  public handleChangeConstraint4MaxNumberOfAssignments = (event: React.ChangeEvent<HTMLInputElement>) => {
    const constraint4MaxNumberOfAssignments = parseInt(event.target.value, 10)
    const dirty = { ...this.state.dirty, constraint4MaxNumberOfAssignments }
    const errorMessages = this.validate(dirty)
    this.setState({ dirty, errorMessages })
    if (errorMessages.constraint4MaxNumberOfAssignments.length > 0) { return }
    this.props.dispatch(constraints4.updateConstraint4MaxNumberOfAssignments(this.props.constraint4.id, constraint4MaxNumberOfAssignments))
  }
  public handleClickOpenDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: true })
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteConstraint4 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(constraints4.deleteConstraint4(this.props.constraint4.id))
  }
  public render() {
    const constraint4Member = this.props.members.find(({ id }) => id === this.props.constraint4.member_id)!
    const constraint4Kinmu = this.props.kinmus.find(({ id }) => id === this.props.constraint4.kinmu_id)!
    const relativesAreEnabled = constraint4Member.is_enabled && constraint4Kinmu.is_enabled
    const title = (
      <>
        <span className={classnames({ [this.props.classes.lineThrough]: !constraint4Member.is_enabled })}>{constraint4Member.name}</span>に<span className={classnames({ [this.props.classes.lineThrough]: !constraint4Kinmu.is_enabled })}>{constraint4Kinmu.name}</span>を{this.props.constraint4.max_number_of_assignments}回以下割り当てる
      </>
    )
    return (
      <>
        <Card>
          <CardHeader
            avatar={
              <Switch
                checked={this.props.constraint4.is_enabled && relativesAreEnabled}
                disabled={!relativesAreEnabled}
                onChange={this.handleChangeConstraint4IsEnabled}
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
                    value={this.props.constraint4.member_id}
                    onChange={this.handleChangeConstraint4MemberId}
                    fullWidth={true}
                  >
                    {this.props.members.map(member => (
                      <MenuItem key={member.id} value={member.id}>{
                        <span className={classnames({ [this.props.classes.lineThrough]: !member.is_enabled })}>{member.name}</span>
                      }</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    select={true}
                    label="勤務"
                    value={this.props.constraint4.kinmu_id}
                    onChange={this.handleChangeConstraint4KinmuId}
                    fullWidth={true}
                  >
                    {this.props.kinmus.map(kinmu => (
                      <MenuItem key={kinmu.id} value={kinmu.id}>{
                        <span className={classnames({ [this.props.classes.lineThrough]: !kinmu.is_enabled })}>{kinmu.name}</span>
                      }</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    label="割り当て数上限"
                    type="number"
                    defaultValue={this.props.constraint4.max_number_of_assignments}
                    onChange={this.handleChangeConstraint4MaxNumberOfAssignments}
                    fullWidth={true}
                    inputProps={{
                      min: constraints4.minOfConstraint4MaxNumberOfAssignments,
                    }}
                    error={this.state.errorMessages.constraint4MaxNumberOfAssignments.length > 0}
                    FormHelperTextProps={{
                      component: 'div',
                    }}
                    helperText={this.state.errorMessages.constraint4MaxNumberOfAssignments.map(message =>
                      <div key={message}>{message}</div>
                    )}
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
          <DialogTitle>職員の勤務の割り当て数の上限の削除</DialogTitle>
          <DialogContent>
            <DialogContentText>この職員の勤務の割り当て数の上限を削除します</DialogContentText>
            <Typography>{title}</Typography>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickDeleteConstraint4}>削除</Button>
            <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    constraints4: state.present.constraints4,
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
  lineThrough: {
    '&::-webkit-datetime-edit-fields-wrapper': {
      textDecoration: 'line-through',
    },
    textDecoration: 'line-through',
  },
})

export default withStyles(styles)(connect(mapStateToProps)(Constraint4))
