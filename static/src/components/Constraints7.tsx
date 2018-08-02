import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails'
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
import * as constraints7 from '../modules/constraints7'
import * as kinmus from '../modules/kinmus'

type Props = {
  dispatch: Dispatch
  constraints7: constraints7.Constraint7[]
  kinmus: kinmus.Kinmu[]
}

type State = {
  creationDialogIsOpen: boolean
  newConstraint7IsEnabled: boolean
  newConstraint7KinmuId: number
  newConstraint7MinNumberOfDays: number
  deletionDialogIsOpen: boolean
  selectedConstraint7Id: number
}

class Constraints7 extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    deletionDialogIsOpen: false,
    newConstraint7IsEnabled: true,
    newConstraint7KinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
    newConstraint7MinNumberOfDays: 0,
    selectedConstraint7Id: this.props.constraints7.length > 0 ? this.props.constraints7[0].id : 0,
  }
  public handleChangeConstraint7IsEnabled(id: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      this.props.dispatch(constraints7.updateConstraint7IsEnabled(id, checked))
    }
  }
  public handleChangeConstraint7KinmuId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints7.updateConstraint7KinmuId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeConstraint7MinNumberOfDays(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints7.updateConstraint7MinNumberOfDays(id, parseInt(event.target.value, 10)))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewConstraint7IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newConstraint7IsEnabled: checked })
  }
  public handleChangeNewConstraint7KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint7KinmuId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewConstraint7MinNumberOfDays = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint7MinNumberOfDays: parseInt(event.target.value, 10) })
  }
  public handleClickCreateConstraint7 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(constraints7.createConstraint7(this.state.newConstraint7IsEnabled, this.state.newConstraint7KinmuId, this.state.newConstraint7MinNumberOfDays))
  }
  public handleClickOpenDeletionDialog(selectedConstraint7Id: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedConstraint7Id,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteConstraint7 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(constraints7.deleteConstraint7(this.state.selectedConstraint7Id))
  }
  public render() {
    const selectedConstraint7 = this.props.constraints7.find(c => c.id === this.state.selectedConstraint7Id)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>勤務の間隔日数の下限</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.constraints7.map(c => (
          <ExpansionPanel key={c.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${this.props.kinmus.find(kinmu => kinmu.id === c.kinmu_id)!.name}の間隔日数を${c.min_number_of_days}日以上にする`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={c.is_enabled}
                    onChange={this.handleChangeConstraint7IsEnabled(c.id)}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_id}
                onChange={this.handleChangeConstraint7KinmuId(c.id)}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="間隔日数下限"
                type="number"
                defaultValue={c.min_number_of_days}
                onChange={this.handleChangeConstraint7MinNumberOfDays(c.id)}
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
            <DialogTitle>勤務の間隔日数の下限を追加できません</DialogTitle>
            <DialogContent>
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>勤務の間隔日数の下限の追加</DialogTitle>
            <DialogContent style={{ display: 'flex' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.newConstraint7IsEnabled}
                    onChange={this.handleChangeNewConstraint7IsEnabled}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="勤務"
                value={this.state.newConstraint7KinmuId}
                onChange={this.handleChangeNewConstraint7KinmuId}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="間隔日数下限"
                type="number"
                defaultValue={this.state.newConstraint7MinNumberOfDays}
                onChange={this.handleChangeNewConstraint7MinNumberOfDays}
                fullWidth={true}
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateConstraint7}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selectedConstraint7 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>勤務の間隔日数の下限の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この勤務の間隔日数の下限を削除します</DialogContentText>
              <Typography>{`${this.props.kinmus.find(kinmu => kinmu.id === selectedConstraint7.kinmu_id)!.name}の間隔日数を${selectedConstraint7.min_number_of_days}日以上にする`}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteConstraint7}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    constraints7: state.present.constraints7,
    kinmus: state.present.kinmus
  }
}

export default connect(mapStateToProps)(Constraints7)
