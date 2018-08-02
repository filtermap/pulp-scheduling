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
import * as constraints8 from '../modules/constraints8'
import * as kinmus from '../modules/kinmus'

type Props = {
  dispatch: Dispatch
  constraints8: constraints8.Constraint8[]
  kinmus: kinmus.Kinmu[]
}

type State = {
  creationDialogIsOpen: boolean
  newConstraint8IsEnabled: boolean
  newConstraint8KinmuId: number
  newConstraint8MaxNumberOfDays: number
  deletionDialogIsOpen: boolean
  selectedConstraint8Id: number
}

class Constraints8 extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    deletionDialogIsOpen: false,
    newConstraint8IsEnabled: true,
    newConstraint8KinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
    newConstraint8MaxNumberOfDays: 0,
    selectedConstraint8Id: this.props.constraints8.length > 0 ? this.props.constraints8[0].id : 0,
  }
  public handleChangeConstraint8IsEnabled(id: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      this.props.dispatch(constraints8.updateConstraint8IsEnabled(id, checked))
    }
  }
  public handleChangeConstraint8KinmuId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints8.updateConstraint8KinmuId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewConstraint8IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newConstraint8IsEnabled: checked })
  }
  public handleChangeNewConstraint8KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint8KinmuId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewConstraint8MaxNumberOfDays = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint8MaxNumberOfDays: parseInt(event.target.value, 10) })
  }
  public handleClickCreateConstraint8 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(constraints8.createConstraint8(this.state.newConstraint8IsEnabled, this.state.newConstraint8KinmuId, this.state.newConstraint8MaxNumberOfDays))
  }
  public handleChangeConstraint8MaxNumberOfDays(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints8.updateConstraint8MaxNumberOfDays(id, parseInt(event.target.value, 10)))
    }
  }
  public handleClickOpenDeletionDialog(selectedConstraint8Id: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedConstraint8Id,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteConstraint8 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(constraints8.deleteConstraint8(this.state.selectedConstraint8Id))
  }
  public render() {
    const selectedConstraint8 = this.props.constraints8.find(c => c.id === this.state.selectedConstraint8Id)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>勤務の間隔日数の上限</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.constraints8.map(c => (
          <ExpansionPanel key={c.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${this.props.kinmus.find(kinmu => kinmu.id === c.kinmu_id)!.name}の間隔日数を${c.max_number_of_days}日以下にする`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={c.is_enabled}
                    onChange={this.handleChangeConstraint8IsEnabled(c.id)}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_id}
                onChange={this.handleChangeConstraint8KinmuId(c.id)}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="間隔日数上限"
                type="number"
                defaultValue={c.max_number_of_days}
                onChange={this.handleChangeConstraint8MaxNumberOfDays(c.id)}
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
            <DialogTitle>勤務の間隔日数の上限を追加できません</DialogTitle>
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
                    checked={this.state.newConstraint8IsEnabled}
                    onChange={this.handleChangeNewConstraint8IsEnabled}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="勤務"
                value={this.state.newConstraint8KinmuId}
                onChange={this.handleChangeNewConstraint8KinmuId}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="間隔日数下限"
                type="number"
                defaultValue={this.state.newConstraint8MaxNumberOfDays}
                onChange={this.handleChangeNewConstraint8MaxNumberOfDays}
                fullWidth={true}
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateConstraint8}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selectedConstraint8 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>勤務の間隔日数の上限の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この勤務の間隔日数の上限を削除します</DialogContentText>
              <Typography>{`${this.props.kinmus.find(kinmu => kinmu.id === selectedConstraint8.kinmu_id)!.name}の間隔日数を${selectedConstraint8.max_number_of_days}日以下にする`}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteConstraint8}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
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

export default connect(mapStateToProps)(Constraints8)
