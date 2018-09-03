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
import * as constraints8 from '../modules/constraints8'
import * as kinmus from '../modules/kinmus'

type Props = {
  dispatch: Dispatch
  constraint8: constraints8.Constraint8
  constraints8: constraints8.Constraint8[]
  kinmus: kinmus.Kinmu[]
} & WithStyles<typeof styles>

type State = {
  expanded: boolean
  deletionDialogIsOpen: boolean
}

type ErrorMessages = {
  constraint8MaxNumberOfDays: string[],
}

class Constraint8 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      deletionDialogIsOpen: false,
      expanded: false,
    }
  }
  public handleClickExpand = () => {
    this.setState({ expanded: !this.state.expanded })
  }
  public handleChangeConstraint8IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.props.dispatch(constraints8.updateConstraint8IsEnabled(this.props.constraint8.id, checked))
  }
  public handleChangeConstraint8KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints8.updateConstraint8KinmuId(this.props.constraint8.id, parseInt(event.target.value, 10)))
  }
  public validate(constraint8MaxNumberOfDays: number): ErrorMessages {
    const errorMessages: ErrorMessages = {
      constraint8MaxNumberOfDays: [],
    }
    if (isNaN(constraint8MaxNumberOfDays)) { errorMessages.constraint8MaxNumberOfDays.push('間隔日数上限の形式が正しくありません') }
    return errorMessages
  }
  public handleChangeConstraint8MaxNumberOfDays = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(constraints8.updateConstraint8MaxNumberOfDays(this.props.constraint8.id, parseInt(event.target.value, 10)))
  }
  public handleClickOpenDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: true })
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteConstraint8 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(constraints8.deleteConstraint8(this.props.constraint8.id))
  }
  public render() {
    const constraint8Kinmu = this.props.kinmus.find(({ id }) => id === this.props.constraint8.kinmu_id)!
    const relativesAreEnabled = constraint8Kinmu.is_enabled
    const title = (
      <>
        <span className={classnames({ [this.props.classes.lineThrough]: !constraint8Kinmu.is_enabled })}>{constraint8Kinmu.name}</span>の間隔日数を{this.props.constraint8.max_number_of_days}日以下にする
      </>
    )
    const errorMessages = this.validate(this.props.constraint8.max_number_of_days)
    return (
      <>
        <Card>
          <CardHeader
            avatar={
              <Switch
                checked={this.props.constraint8.is_enabled && relativesAreEnabled}
                disabled={!relativesAreEnabled}
                onChange={this.handleChangeConstraint8IsEnabled}
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
                    label="勤務"
                    value={this.props.constraint8.kinmu_id}
                    onChange={this.handleChangeConstraint8KinmuId}
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
                    label="間隔日数上限"
                    type="number"
                    defaultValue={this.props.constraint8.max_number_of_days}
                    onChange={this.handleChangeConstraint8MaxNumberOfDays}
                    fullWidth={true}
                    inputProps={{
                      min: constraints8.minOfConstraint8MaxNumberOfDays,
                    }}
                    error={errorMessages.constraint8MaxNumberOfDays.length > 0}
                    FormHelperTextProps={{
                      component: 'div',
                    }}
                    helperText={errorMessages.constraint8MaxNumberOfDays.map(message =>
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
          <DialogTitle>勤務の間隔日数の上限の削除</DialogTitle>
          <DialogContent>
            <DialogContentText>この勤務の間隔日数の上限を削除します</DialogContentText>
            <Typography>{title}</Typography>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickDeleteConstraint8}>削除</Button>
            <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    constraints8: state.present.constraints8,
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
  lineThrough: {
    '&::-webkit-datetime-edit-fields-wrapper': {
      textDecoration: 'line-through',
    },
    textDecoration: 'line-through',
  },
})

export default withStyles(styles)(connect(mapStateToProps)(Constraint8))
