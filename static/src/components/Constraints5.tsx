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
import * as constraints5 from '../modules/constraints5'
import * as kinmus from '../modules/kinmus'
import Constraint5 from './Constraint5'

type Props = {
  dispatch: Dispatch
  constraints5: constraints5.Constraint5[]
  kinmus: kinmus.Kinmu[]
}

type State = {
  creationDialogIsOpen: boolean
  newConstraint5IsEnabled: boolean
  newConstraint5KinmuId: number
  newConstraint5MinNumberOfDays: number
}

class Constraints5 extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    newConstraint5IsEnabled: true,
    newConstraint5KinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
    newConstraint5MinNumberOfDays: 0,
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewConstraint5IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newConstraint5IsEnabled: checked })
  }
  public handleChangeNewConstraint5KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint5KinmuId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewConstraint5MinNumberOfDays = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint5MinNumberOfDays: parseInt(event.target.value, 10) })
  }
  public handleClickCreateConstraint5 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(constraints5.createConstraint5(this.state.newConstraint5IsEnabled, this.state.newConstraint5KinmuId, this.state.newConstraint5MinNumberOfDays))
  }
  public render() {
    return (
      <>
        <div style={{ padding: 8 }}>
          <Grid container={true} spacing={8}>
            <Grid item={true} xs={12}>
              <Toolbar>
                <Typography variant="subheading" style={{ flex: 1 }}>勤務の連続日数の下限</Typography>
                <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
              </Toolbar>
            </Grid>
            {this.props.constraints5.map(c => (
              <Grid key={c.id} item={true} xs={12}>
                <Constraint5 constraint5={c} />
              </Grid>
            ))}
          </Grid>
        </div>
        {this.props.kinmus.length === 0 ?
          <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>勤務の連続日数の下限を追加できません</DialogTitle>
            <DialogContent>
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>勤務の連続日数の下限の追加</DialogTitle>
            <DialogContent >
              <Grid container={true} spacing={8}>
                <Grid item={true} xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={this.state.newConstraint5IsEnabled}
                        onChange={this.handleChangeNewConstraint5IsEnabled}
                        color="primary"
                      />
                    }
                    label="有効"
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    select={true}
                    label="勤務"
                    value={this.state.newConstraint5KinmuId}
                    onChange={this.handleChangeNewConstraint5KinmuId}
                    fullWidth={true}
                  >
                    {this.props.kinmus.map(kinmu => (
                      <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    label="連続日数下限"
                    type="number"
                    defaultValue={this.state.newConstraint5MinNumberOfDays}
                    onChange={this.handleChangeNewConstraint5MinNumberOfDays}
                    fullWidth={true}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateConstraint5}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    constraints5: state.present.constraints5,
    kinmus: state.present.kinmus,
    members: state.present.members,
  }
}

export default connect(mapStateToProps)(Constraints5)
