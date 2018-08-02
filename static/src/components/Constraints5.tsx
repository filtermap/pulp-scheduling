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
import * as constraints5 from '../modules/constraints5'
import * as kinmus from '../modules/kinmus'

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
  deletionDialogIsOpen: boolean
  selectedConstraint5Id: number
}

class Constraints5 extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    deletionDialogIsOpen: false,
    newConstraint5IsEnabled: true,
    newConstraint5KinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
    newConstraint5MinNumberOfDays: 0,
    selectedConstraint5Id: this.props.constraints5.length > 0 ? this.props.constraints5[0].id : 0,
  }
  public handleChangeConstraint5IsEnabled(id: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      this.props.dispatch(constraints5.updateConstraint5IsEnabled(id, checked))
    }
  }
  public handleChangeConstraint5KinmuId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints5.updateConstraint5KinmuId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeConstraint5MinNumberOfDays(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints5.updateConstraint5MinNumberOfDays(id, parseInt(event.target.value, 10)))
    }
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
  public handleClickOpenDeletionDialog(selectedConstraint5Id: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedConstraint5Id,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteConstraint5 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(constraints5.deleteConstraint5(this.state.selectedConstraint5Id))
  }
  public render() {
    const selectedConstraint5 = this.props.constraints5.find(c => c.id === this.state.selectedConstraint5Id)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>勤務の連続日数の下限</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.constraints5.map(c => (
          <ExpansionPanel key={c.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${this.props.kinmus.find(kinmu => kinmu.id === c.kinmu_id)!.name}の連続日数を${c.min_number_of_days}日以上にする`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={c.is_enabled}
                    onChange={this.handleChangeConstraint5IsEnabled(c.id)}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_id}
                onChange={this.handleChangeConstraint5KinmuId(c.id)}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="連続日数下限"
                type="number"
                defaultValue={c.min_number_of_days}
                onChange={this.handleChangeConstraint5MinNumberOfDays(c.id)}
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
            <DialogContent style={{ display: 'flex' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.newConstraint5IsEnabled}
                    onChange={this.handleChangeNewConstraint5IsEnabled}
                    color="primary"
                  />
                }
                label="有効"
              />
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
              <TextField
                label="連続日数下限"
                type="number"
                defaultValue={this.state.newConstraint5MinNumberOfDays}
                onChange={this.handleChangeNewConstraint5MinNumberOfDays}
                fullWidth={true}
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateConstraint5}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selectedConstraint5 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>勤務の連続日数の下限の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この勤務の連続日数の下限を削除します</DialogContentText>
              <Typography>{`${this.props.kinmus.find(kinmu => kinmu.id === selectedConstraint5.kinmu_id)!.name}の連続日数を${selectedConstraint5.min_number_of_days}日以上にする`}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteConstraint5}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
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
