import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
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
import * as c0 from '../modules/c0'
import * as c0_kinmus from '../modules/c0_kinmus'
import * as kinmus from '../modules/kinmus'

type Props = {
  dispatch: Dispatch
  c0: c0.C0[]
  c0_kinmus: c0_kinmus.C0Kinmu[]
  kinmus: kinmus.Kinmu[]
}

type State = {
  creationDialogIsOpen: boolean
  newC0C0KinmuIndices: number[]
  deletionDialogIsOpen: boolean
  selectedC0SequenceId: number
}

class C0 extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    deletionDialogIsOpen: false,
    newC0C0KinmuIndices: this.props.kinmus.length > 0 ? [this.props.kinmus[0].index, this.props.kinmus[0].index] : [],
    selectedC0SequenceId: this.props.c0.length > 0 ? this.props.c0[0].sequence_id : 0,
  }
  public handleClickCreateC0Kinmu(sequence_id: number, sequence_number: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      const kinmu_index = this.props.kinmus[0].index
      this.props.dispatch(c0_kinmus.createC0Kinmu(sequence_id, sequence_number, kinmu_index))
    }
  }
  public handleChangeC0KinmuKinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c0_kinmus.updateC0KinmuKinmuIndex(index, parseInt(event.target.value, 10)))
    }
  }
  public handleClickDeleteC0Kinmu(index: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      this.props.dispatch(c0_kinmus.deleteC0Kinmu(index))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleClickCreateNewC0C0Kinmu(index: number) {
    return () => {
      const newC0C0KinmuIndices = [...this.state.newC0C0KinmuIndices]
      newC0C0KinmuIndices.splice(index, 0, this.props.kinmus[0].index)
      this.setState({ newC0C0KinmuIndices })
    }
  }
  public handleChangeNewC0C0KinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        newC0C0KinmuIndices: this.state.newC0C0KinmuIndices.map((kinmu_index, kinmuIndicesIndex) => {
          if (kinmuIndicesIndex !== index) {
            return kinmu_index
          }
          return parseInt(event.target.value, 10)
        }),
      })
    }
  }
  public handleClickDeleteNewC0C0Kinmu(index: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      this.setState({ newC0C0KinmuIndices: this.state.newC0C0KinmuIndices.filter((__, kinmuIndicesIndex) => kinmuIndicesIndex !== index) })
    }
  }
  public handleClickCreateC0 = (_: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(all.createC0(this.state.newC0C0KinmuIndices))
  }
  public handleClickOpenDeletionDialog(selectedC0SequenceId: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedC0SequenceId,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteC0 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(all.deleteC0(this.state.selectedC0SequenceId))
  }
  public render() {
    const selectedSequence = this.props.c0_kinmus.filter(({ sequence_id }) => sequence_id === this.state.selectedC0SequenceId).sort((a, b) => a.sequence_number - b.sequence_number)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>連続禁止勤務並び</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.c0.map(c => {
          const c0_kinmus_by_sequence_id = this.props.c0_kinmus.filter(c0_kinmu => c0_kinmu.sequence_id === c.sequence_id).sort((a, b) => a.sequence_number - b.sequence_number)
          return (
            <ExpansionPanel key={c.index}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{c0_kinmus_by_sequence_id.map(c0_kinmu => this.props.kinmus.find(kinmu => kinmu.index === c0_kinmu.kinmu_index)!.name).join(', ')}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Button size="small" onClick={this.handleClickCreateC0Kinmu(c.sequence_id, 0)}>追加</Button>
                {c0_kinmus_by_sequence_id.map((c0_kinmu, index) => (
                  <React.Fragment key={c0_kinmu.index}>
                    <TextField
                      select={true}
                      label={`勤務${index + 1}`}
                      value={c0_kinmu.kinmu_index}
                      onChange={this.handleChangeC0KinmuKinmuIndex(c0_kinmu.index)}
                      fullWidth={true}
                    >
                      {this.props.kinmus.map(kinmu => (
                        <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
                      ))}
                    </TextField>
                    <Button size="small" onClick={this.handleClickDeleteC0Kinmu(c0_kinmu.index)}>削除</Button>
                    <Button size="small" onClick={this.handleClickCreateC0Kinmu(c.sequence_id, c0_kinmu.sequence_number + 1)}>追加</Button>
                  </React.Fragment>
                ))}
              </ExpansionPanelDetails>
              <ExpansionPanelActions>
                <Button size="small" onClick={this.handleClickOpenDeletionDialog(c.sequence_id)}>削除</Button>
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
              <Button size="small" onClick={this.handleClickCreateNewC0C0Kinmu(0)}>追加</Button>
              {this.state.newC0C0KinmuIndices.map((kinmu_index, index) => (
                <React.Fragment key={`${index}-${kinmu_index}`}>
                  <TextField
                    select={true}
                    label={`勤務${index + 1}`}
                    value={kinmu_index}
                    onChange={this.handleChangeNewC0C0KinmuIndex(index)}
                    fullWidth={true}
                  >
                    {this.props.kinmus.map(kinmu => (
                      <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
                    ))}
                  </TextField>
                  <Button size="small" onClick={this.handleClickDeleteNewC0C0Kinmu(index)}>削除</Button>
                  <Button size="small" onClick={this.handleClickCreateNewC0C0Kinmu(index + 1)}>追加</Button>
                </React.Fragment>
              ))}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateC0}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selectedSequence.length > 0 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>連続禁止勤務並びの削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この連続禁止勤務並びを削除します</DialogContentText>
              <Typography>{selectedSequence.map(renzoku_kinshi_kinmu => this.props.kinmus.find(kinmu => kinmu.index === renzoku_kinshi_kinmu.kinmu_index)!.name).join(', ')}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteC0}>削除</Button>
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
    c0: state.present.c0,
    c0_kinmus: state.present.c0_kinmus,
    kinmus: state.present.kinmus,
  }
}

export default connect(mapStateToProps)(C0)
