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
import * as constraint0_kinmus from '../modules/constraint0_kinmus'
import * as constraints0 from '../modules/constraints0'
import * as kinmus from '../modules/kinmus'

type Props = {
  dispatch: Dispatch
  constraints0: constraints0.Constraint0[]
  constraint0_kinmus: constraint0_kinmus.Constraint0Kinmu[]
  kinmus: kinmus.Kinmu[]
}

type State = {
  creationDialogIsOpen: boolean
  newConstraint0IsEnabled: boolean
  newConstraint0Constraint0KinmuKinmuIds: number[]
  deletionDialogIsOpen: boolean
  selectedConstraint0Id: number
}

class Constraints0 extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    deletionDialogIsOpen: false,
    newConstraint0Constraint0KinmuKinmuIds: this.props.kinmus.length > 0 ? [this.props.kinmus[0].id, this.props.kinmus[0].id] : [],
    newConstraint0IsEnabled: true,
    selectedConstraint0Id: this.props.constraints0.length > 0 ? this.props.constraints0[0].id : 0,
  }
  public handleChangeConstraint0IsEnabled(id: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      this.props.dispatch(constraints0.updateConstraint0IsEnabled(id, checked))
    }
  }
  public handleClickCreateConstraint0Kinmu(constraint0_id: number, sequence_number: number) {
    return () => {
      const kinmu_id = this.props.kinmus[0].id
      this.props.dispatch(constraint0_kinmus.createConstraint0Kinmu(constraint0_id, sequence_number, kinmu_id))
    }
  }
  public handleChangeConstraint0KinmuKinmuId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraint0_kinmus.updateConstraint0KinmuKinmuId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleClickDeleteConstraint0Kinmu(id: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      this.props.dispatch(all.deleteConstraint0Kinmu(id))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewConstraint0IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newConstraint0IsEnabled: checked })
  }
  public handleClickCreateNewConstraint0Constraint0Kinmu(id: number) {
    return () => {
      const newConstraint0Constraint0KinmuKinmuIds = [...this.state.newConstraint0Constraint0KinmuKinmuIds]
      newConstraint0Constraint0KinmuKinmuIds.splice(id, 0, this.props.kinmus[0].id)
      this.setState({ newConstraint0Constraint0KinmuKinmuIds })
    }
  }
  public handleChangeNewConstraint0Constraint0KinmuKinmuId(newConstraint0Constraint0KinmuKinmuIdsIndex: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        newConstraint0Constraint0KinmuKinmuIds: this.state.newConstraint0Constraint0KinmuKinmuIds.map((kinmuId, index) => {
          if (index !== newConstraint0Constraint0KinmuKinmuIdsIndex) {
            return kinmuId
          }
          return parseInt(event.target.value, 10)
        }),
      })
    }
  }
  public handleClickDeleteNewConstraint0Constraint0Kinmu(newConstraint0Constraint0KinmuKinmuIdsId: number) {
    return () => {
      this.setState({ newConstraint0Constraint0KinmuKinmuIds: this.state.newConstraint0Constraint0KinmuKinmuIds.filter((_, id) => id !== newConstraint0Constraint0KinmuKinmuIdsId) })
    }
  }
  public handleClickCreateConstraint0 = (_: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(all.createConstraint0(this.state.newConstraint0IsEnabled, this.state.newConstraint0Constraint0KinmuKinmuIds))
  }
  public handleClickOpenDeletionDialog(selectedConstraint0Id: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedConstraint0Id,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteConstraint0 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(all.deleteConstraint0(this.state.selectedConstraint0Id))
  }
  public render() {
    const selected_constraint0_kinmus = this.props.constraint0_kinmus.filter(({ constraint0_id }) => constraint0_id === this.state.selectedConstraint0Id).sort((a, b) => a.sequence_number - b.sequence_number)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>連続禁止勤務並び</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.constraints0.map(c => {
          const constraint0_kinmus_by_sequence_id = this.props.constraint0_kinmus.filter(constraint0_kinmu => constraint0_kinmu.constraint0_id === c.id).sort((a, b) => a.sequence_number - b.sequence_number)
          return (
            <ExpansionPanel key={c.id}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{constraint0_kinmus_by_sequence_id.map(constraint0_kinmu => this.props.kinmus.find(kinmu => kinmu.id === constraint0_kinmu.kinmu_id)!.name).join(', ')}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={c.is_enabled}
                      onChange={this.handleChangeConstraint0IsEnabled(c.id)}
                      color="primary"
                    />
                  }
                  label="有効"
                />
                <Button size="small" onClick={this.handleClickCreateConstraint0Kinmu(c.id, 0)}>追加</Button>
                {constraint0_kinmus_by_sequence_id.map((constraint0_kinmu, id) => (
                  <React.Fragment key={constraint0_kinmu.id}>
                    <TextField
                      select={true}
                      label={`勤務${id + 1}`}
                      value={constraint0_kinmu.kinmu_id}
                      onChange={this.handleChangeConstraint0KinmuKinmuId(constraint0_kinmu.id)}
                      fullWidth={true}
                    >
                      {this.props.kinmus.map(kinmu => (
                        <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                      ))}
                    </TextField>
                    {constraint0_kinmus_by_sequence_id.length > 2 &&
                      <Button size="small" onClick={this.handleClickDeleteConstraint0Kinmu(constraint0_kinmu.id)}>削除</Button>}
                    <Button size="small" onClick={this.handleClickCreateConstraint0Kinmu(c.id, constraint0_kinmu.sequence_number + 1)}>追加</Button>
                  </React.Fragment>
                ))}
              </ExpansionPanelDetails>
              <ExpansionPanelActions>
                <Button size="small" onClick={this.handleClickOpenDeletionDialog(c.id)}>削除</Button>
              </ExpansionPanelActions>
            </ExpansionPanel>
          )
        })}
        {this.props.kinmus.length === 0 ?
          <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>連続禁止勤務並びを追加できません</DialogTitle>
            <DialogContent>
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>連続禁止勤務並びの追加</DialogTitle>
            <DialogContent style={{ display: 'flex' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.newConstraint0IsEnabled}
                    onChange={this.handleChangeNewConstraint0IsEnabled}
                    color="primary"
                  />
                }
                label="有効"
              />
              <Button size="small" onClick={this.handleClickCreateNewConstraint0Constraint0Kinmu(0)}>追加</Button>
              {this.state.newConstraint0Constraint0KinmuKinmuIds.map((kinmuId, id) => (
                <React.Fragment key={`${id}-${kinmuId}`}>
                  <TextField
                    select={true}
                    label={`勤務${id + 1}`}
                    value={kinmuId}
                    onChange={this.handleChangeNewConstraint0Constraint0KinmuKinmuId(id)}
                    fullWidth={true}
                  >
                    {this.props.kinmus.map(kinmu => (
                      <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                    ))}
                  </TextField>
                  <Button size="small" onClick={this.handleClickDeleteNewConstraint0Constraint0Kinmu(id)}>削除</Button>
                  <Button size="small" onClick={this.handleClickCreateNewConstraint0Constraint0Kinmu(id + 1)}>追加</Button>
                </React.Fragment>
              ))}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateConstraint0}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selected_constraint0_kinmus.length > 0 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>連続禁止勤務並びの削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この連続禁止勤務並びを削除します</DialogContentText>
              <Typography>{selected_constraint0_kinmus.map(constraint0_kinmu => this.props.kinmus.find(kinmu => kinmu.id === constraint0_kinmu.kinmu_id)!.name).join(', ')}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteConstraint0}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>
        }
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    constraint0_kinmus: state.present.constraint0_kinmus,
    constraints0: state.present.constraints0,
    kinmus: state.present.kinmus,
  }
}

export default connect(mapStateToProps)(Constraints0)
