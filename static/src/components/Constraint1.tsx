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
import * as terms from '../modules/terms'
import * as utils from '../utils'

type Props = {
  dispatch: Dispatch
  constraint1: constraints1.Constraint1
  constraints1: constraints1.Constraint1[]
  terms: terms.Term[]
  kinmus: kinmus.Kinmu[]
  groups: groups.Group[]
} & WithStyles<typeof styles>

type State = {
  expanded: boolean
  deletionDialogIsOpen: boolean
}

type ErrorMessages = {
  constraint1StartDateName: string[]
  constraint1StopDateName: string[]
  constraint1MinNumberOfAssignments: string[]
}

class Constraint1 extends React.Component<Props, State> {
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
  public handleChangeConstraint1IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.props.dispatch(constraints1.updateConstraint1IsEnabled(this.props.constraint1.id, checked))
  }
  public validate(constraint1StartDateName: string, constraint1StopDateName: string, constraint1MinNumberOfAssignments: number): ErrorMessages {
    const errorMessages: ErrorMessages = {
      constraint1MinNumberOfAssignments: [],
      constraint1StartDateName: [],
      constraint1StopDateName: [],
    }
    if (!utils.stringToDate(constraint1StartDateName)) { errorMessages.constraint1StartDateName.push('開始日の形式が正しくありません') }
    if (!utils.stringToDate(constraint1StopDateName)) { errorMessages.constraint1StopDateName.push('終了日の形式が正しくありません') }
    if (isNaN(constraint1MinNumberOfAssignments)) { errorMessages.constraint1MinNumberOfAssignments.push('割り当て職員数下限の形式が正しくありません') }
    return errorMessages
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
    const constraint1StartDate = utils.stringToDate(this.props.constraint1.start_date_name)
    const constraint1StartDateIsEnabled = constraint1StartDate ? this.props.terms.every(({ start_date_name }) => {
      const startDate = utils.stringToDate(start_date_name)
      if (!startDate) { return false }
      return startDate <= constraint1StartDate
    }) : false
    const constraint1StopDate = utils.stringToDate(this.props.constraint1.stop_date_name)
    const constraint1StopDateIsEnabled = constraint1StopDate ? this.props.terms.every(({ stop_date_name }) => {
      const stopDate = utils.stringToDate(stop_date_name)
      if (!stopDate) { return false }
      return stopDate >= constraint1StopDate
    }) : false
    const constraint1Kinmu = this.props.kinmus.find(({ id }) => id === this.props.constraint1.kinmu_id)!
    const constraint1Group = this.props.groups.find(({ id }) => id === this.props.constraint1.group_id)!
    const relativesAreEnabled = constraint1StartDateIsEnabled && constraint1StopDateIsEnabled && constraint1Kinmu.is_enabled && constraint1Group.is_enabled
    const title = (
      <>
        <span className={classnames({ [this.props.classes.lineThrough]: !constraint1StartDateIsEnabled })}>{this.props.constraint1.start_date_name}</span>から<span className={classnames({ [this.props.classes.lineThrough]: !constraint1StopDateIsEnabled })}>{this.props.constraint1.stop_date_name}</span>までの<span className={classnames({ [this.props.classes.lineThrough]: !constraint1Kinmu.is_enabled })}>{constraint1Kinmu.is_enabled}</span>に<span className={classnames({ [this.props.classes.lineThrough]: !constraint1Group.is_enabled })}>{constraint1Group.name}</span>から{this.props.constraint1.min_number_of_assignments}人以上の職員を割り当てる
      </>
    )
    const errorMessages = this.validate(this.props.constraint1.start_date_name, this.props.constraint1.stop_date_name, this.props.constraint1.min_number_of_assignments)
    return (
      <>
        <Card>
          <CardHeader
            avatar={
              <Switch
                checked={this.props.constraint1.is_enabled && relativesAreEnabled}
                disabled={!relativesAreEnabled}
                onChange={this.handleChangeConstraint1IsEnabled}
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
                    label="開始日"
                    type="date"
                    defaultValue={this.props.constraint1.start_date_name}
                    onChange={this.handleChangeConstraint1StartDateName}
                    fullWidth={true}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      className: classnames({ [this.props.classes.lineThrough]: !constraint1StartDateIsEnabled }),
                    }}
                    error={errorMessages.constraint1StartDateName.length > 0}
                    FormHelperTextProps={{
                      component: 'div',
                    }}
                    helperText={errorMessages.constraint1StartDateName.map(message =>
                      <div key={message}>{message}</div>
                    )}
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
                    inputProps={{
                      className: classnames({ [this.props.classes.lineThrough]: !constraint1StopDateIsEnabled })
                    }}
                    error={errorMessages.constraint1StopDateName.length > 0}
                    FormHelperTextProps={{
                      component: 'div',
                    }}
                    helperText={errorMessages.constraint1StopDateName.map(message =>
                      <div key={message}>{message}</div>
                    )}
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
                      <MenuItem key={kinmu.id} value={kinmu.id}>{
                        <span className={classnames({ [this.props.classes.lineThrough]: !kinmu.is_enabled })}>{kinmu.name}</span>
                      }</MenuItem>
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
                      <MenuItem key={group.id} value={group.id}>{
                        <span className={classnames({ [this.props.classes.lineThrough]: !group.is_enabled })}>{group.name}</span>
                      }</MenuItem>
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
                    error={errorMessages.constraint1MinNumberOfAssignments.length > 0}
                    FormHelperTextProps={{
                      component: 'div',
                    }}
                    helperText={errorMessages.constraint1MinNumberOfAssignments.map(message =>
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
    terms: state.present.terms,
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

export default withStyles(styles)(connect(mapStateToProps)(Constraint1))
