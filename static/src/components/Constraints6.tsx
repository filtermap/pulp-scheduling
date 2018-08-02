import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { StateWithHistory } from 'redux-undo'
import * as all from '../modules/all'
import * as constraints6 from '../modules/constraints6'
import * as kinmus from '../modules/kinmus'

type Props = {
  dispatch: Dispatch
  constraints6: constraints6.Constraint6[]
  kinmus: kinmus.Kinmu[]
}

type State = {
  creationDialogIsOpen: boolean
  newConstraint6IsEnabled: boolean
  newConstraint6KinmuId: number
  newConstraint6MaxNumberOfDays: number
  deletionDialogIsOpen: boolean
  selectedConstraint6Id: number
}

class Constraints6 extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    deletionDialogIsOpen: false,
    newConstraint6IsEnabled: true,
    newConstraint6KinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
    newConstraint6MaxNumberOfDays: 0,
    selectedConstraint6Id: this.props.constraints6.length > 0 ? this.props.constraints6[0].id : 0,
  }
  public handleChangeConstraint6IsEnabled(id: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      this.props.dispatch(constraints6.updateConstraint6IsEnabled(id, checked))
    }
  }
  public handleChangeConstraint6KinmuId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints6.updateConstraint6KinmuId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeConstraint6MaxNumberOfDays(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints6.updateConstraint6MaxNumberOfDays(id, parseInt(event.target.value, 10)))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewConstraint6IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newConstraint6IsEnabled: checked })
  }
  public handleChangeNewConstraint6KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint6KinmuId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewConstraint6MaxNumberOfDays = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint6MaxNumberOfDays: parseInt(event.target.value, 10) })
  }
  public handleClickCreateConstraint6 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(constraints6.createConstraint6(this.state.newConstraint6IsEnabled, this.state.newConstraint6KinmuId, this.state.newConstraint6MaxNumberOfDays))
  }
  public handleClickOpenDeletionDialog(selectedConstraint6Id: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedConstraint6Id,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteConstraint6 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(constraints6.deleteConstraint6(this.state.selectedConstraint6Id))
  }
  public render() {
    const selectedConstraint6 = this.props.constraints6.find(c => c.id === this.state.selectedConstraint6Id)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>勤務の連続日数の上限</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.constraints6.map(c => (
          <ExpansionPanel key={c.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${this.props.kinmus.find(kinmu => kinmu.id === c.kinmu_id)!.name}の連続日数を${c.max_number_of_days}日以下にする`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={c.is_enabled}
                    onChange={this.handleChangeConstraint6IsEnabled(c.id)}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_id}
                onChange={this.handleChangeConstraint6KinmuId(c.id)}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="連続日数上限"
                type="number"
                defaultValue={c.max_number_of_days}
                onChange={this.handleChangeConstraint6MaxNumberOfDays(c.id)}
                fullWidth={true}
              />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleClickOpenDeletionDialog(c.id)}>削除</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
        {this.props.kinmus.length === 0 ?
          <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>勤務の連続日数の上限を追加できません</DialogTitle>
            <DialogContent>
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>勤務の連続日数の上限の追加</DialogTitle>
            <DialogContent style={{ display: 'flex' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.newConstraint6IsEnabled}
                    onChange={this.handleChangeNewConstraint6IsEnabled}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="勤務"
                value={this.state.newConstraint6KinmuId}
                onChange={this.handleChangeNewConstraint6KinmuId}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="連続日数上限"
                type="number"
                defaultValue={this.state.newConstraint6MaxNumberOfDays}
                onChange={this.handleChangeNewConstraint6MaxNumberOfDays}
                fullWidth={true}
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateConstraint6}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selectedConstraint6 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>勤務の連続日数の上限の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この勤務の連続日数の上限を削除します</DialogContentText>
              <Typography>{`${this.props.kinmus.find(kinmu => kinmu.id === selectedConstraint6.kinmu_id)!.name}の連続日数を${selectedConstraint6.max_number_of_days}日以下にする`}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteConstraint6}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    constraints6: state.present.constraints6,
    kinmus: state.present.kinmus
  }
}

export default connect(mapStateToProps)(Constraints6)
