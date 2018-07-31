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
import * as c6 from '../modules/c6'
import * as kinmus from '../modules/kinmus'

type Props = {
  dispatch: Dispatch
  c6: c6.C6[]
  kinmus: kinmus.Kinmu[]
}

type State = {
  creationDialogIsOpen: boolean
  newC6IsEnabled: boolean
  newC6KinmuId: number
  newC6MaxNumberOfDays: number
  deletionDialogIsOpen: boolean
  selectedC6Id: number
}

class C6 extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    deletionDialogIsOpen: false,
    newC6IsEnabled: true,
    newC6KinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
    newC6MaxNumberOfDays: 0,
    selectedC6Id: this.props.c6.length > 0 ? this.props.c6[0].id : 0,
  }
  public handleChangeC6IsEnabled(id: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      this.props.dispatch(c6.updateC6IsEnabled(id, checked))
    }
  }
  public handleChangeC6KinmuId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c6.updateC6KinmuId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeC6MaxNumberOfDays(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c6.updateC6MaxNumberOfDays(id, parseInt(event.target.value, 10)))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewC6IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newC6IsEnabled: checked })
  }
  public handleChangeNewC6KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC6KinmuId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC6MaxNumberOfDays = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC6MaxNumberOfDays: parseInt(event.target.value, 10) })
  }
  public handleClickCreateC6 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(c6.createC6(this.state.newC6IsEnabled, this.state.newC6KinmuId, this.state.newC6MaxNumberOfDays))
  }
  public handleClickOpenDeletionDialog(selectedC6Id: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedC6Id,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteC6 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(c6.deleteC6(this.state.selectedC6Id))
  }
  public render() {
    const selectedC6 = this.props.c6.find(c => c.id === this.state.selectedC6Id)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>勤務の連続日数の上限</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.c6.map(c => (
          <ExpansionPanel key={c.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${this.props.kinmus.find(kinmu => kinmu.id === c.kinmu_id)!.name}の連続日数を${c.max_number_of_days}日以下にする`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={c.is_enabled}
                    onChange={this.handleChangeC6IsEnabled(c.id)}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_id}
                onChange={this.handleChangeC6KinmuId(c.id)}
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
                onChange={this.handleChangeC6MaxNumberOfDays(c.id)}
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
                    checked={this.state.newC6IsEnabled}
                    onChange={this.handleChangeNewC6IsEnabled}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="勤務"
                value={this.state.newC6KinmuId}
                onChange={this.handleChangeNewC6KinmuId}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="連続日数上限"
                type="number"
                defaultValue={this.state.newC6MaxNumberOfDays}
                onChange={this.handleChangeNewC6MaxNumberOfDays}
                fullWidth={true}
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateC6}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selectedC6 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>勤務の連続日数の上限の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この勤務の連続日数の上限を削除します</DialogContentText>
              <Typography>{`${this.props.kinmus.find(kinmu => kinmu.id === selectedC6.kinmu_id)!.name}の連続日数を${selectedC6.max_number_of_days}日以下にする`}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteC6}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    c6: state.present.c6,
    kinmus: state.present.kinmus
  }
}

export default connect(mapStateToProps)(C6)
