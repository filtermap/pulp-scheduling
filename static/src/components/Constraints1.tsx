import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { StateWithHistory } from 'redux-undo'
import * as all from '../modules/all'
import * as constraints1 from '../modules/constraints1'
import * as groups from '../modules/groups'
import * as kinmus from '../modules/kinmus'
import * as utils from '../utils'
import Constraint1 from './Constraint1'

type Props = {
  dispatch: Dispatch
  constraints1: constraints1.Constraint1[]
  kinmus: kinmus.Kinmu[]
  groups: groups.Group[]
}

type State = {
  creationDialogIsOpen: boolean
  newConstraint1IsEnabled: boolean
  newConstraint1StartDateName: string
  newConstraint1StopDateName: string
  newConstraint1KinmuId: number
  newConstraint1GroupId: number
  newConstraint1MinNumberOfAssignments: number
}

class Constraints1 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const todayString = utils.dateToString(new Date())
    this.state = {
      creationDialogIsOpen: false,
      newConstraint1GroupId: this.props.groups.length > 0 ? this.props.groups[0].id : 0,
      newConstraint1IsEnabled: true,
      newConstraint1KinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
      newConstraint1MinNumberOfAssignments: 0,
      newConstraint1StartDateName: todayString,
      newConstraint1StopDateName: todayString,
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewConstraint1IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newConstraint1IsEnabled: checked })
  }
  public handleChangeNewConstraint1StartDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint1StartDateName: event.target.value })
  }
  public handleChangeNewConstraint1StopDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint1StopDateName: event.target.value })
  }
  public handleChangeNewConstraint1KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint1KinmuId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewConstraint1GroupId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint1GroupId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewConstraint1MinNumberOfAssignments = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint1MinNumberOfAssignments: parseInt(event.target.value, 10) })
  }
  public handleClickCreateConstraint1 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(constraints1.createConstraint1(this.state.newConstraint1IsEnabled, this.state.newConstraint1StartDateName, this.state.newConstraint1StopDateName, this.state.newConstraint1KinmuId, this.state.newConstraint1GroupId, this.state.newConstraint1MinNumberOfAssignments))
  }
  public render() {
    return (
      <>
        <div style={{ padding: 8 }}>
          <Grid container={true} spacing={8}>
            <Grid item={true} xs={12}>
              <Toolbar>
                <Typography variant="subheading" style={{ flex: 1 }}> 期間の勤務にグループから割り当てる職員数の下限</Typography>
                <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
              </Toolbar>
            </Grid>
            {this.props.constraints1.map(c => (
              <Grid key={c.id} item={true} xs={12}>
                <Constraint1 constraint1={c} />
              </Grid>
            ))}
          </Grid>
        </div>
        {this.props.kinmus.length === 0 || this.props.groups.length === 0 ?
          <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>期間の勤務にグループから割り当てる職員数の下限を追加できません</DialogTitle>
            <DialogContent>
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
              {this.props.groups.length === 0 ? <DialogContentText>グループがありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>期間の勤務にグループから割り当てる職員数の下限の追加</DialogTitle>
            <DialogContent>
              <Grid container={true} spacing={8}>
                <Grid item={true} xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={this.state.newConstraint1IsEnabled}
                        onChange={this.handleChangeNewConstraint1IsEnabled}
                        color="primary"
                      />
                    }
                    label="有効"
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    label="開始日"
                    type="date"
                    defaultValue={this.state.newConstraint1StartDateName}
                    onChange={this.handleChangeNewConstraint1StartDateName}
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
                    defaultValue={this.state.newConstraint1StopDateName}
                    onChange={this.handleChangeNewConstraint1StopDateName}
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
                    value={this.state.newConstraint1KinmuId}
                    onChange={this.handleChangeNewConstraint1KinmuId}
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
                    value={this.state.newConstraint1GroupId}
                    onChange={this.handleChangeNewConstraint1GroupId}
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
                    defaultValue={this.state.newConstraint1MinNumberOfAssignments}
                    onChange={this.handleChangeNewConstraint1MinNumberOfAssignments}
                    fullWidth={true}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateConstraint1}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
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

export default connect(mapStateToProps)(Constraints1)
