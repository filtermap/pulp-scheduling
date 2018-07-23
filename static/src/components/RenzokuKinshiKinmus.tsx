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
import * as kinmus from '../modules/kinmus'
import * as renzoku_kinshi_kinmus from '../modules/renzoku_kinshi_kinmus'

type State = {
  open: boolean
  kinmu_indices: number[]
}

type Props = {
  dispatch: Dispatch
  renzoku_kinshi_kinmus: renzoku_kinshi_kinmus.RenzokuKinshiKinmu[]
  kinmus: kinmus.Kinmu[]
}

class RenzokuKinshiKinmus extends React.Component<Props, State> {
  public state: State = {
    kinmu_indices: [],
    open: false,
  }
  public handleClickCreateRenzokuKinshiKinmu(sequence_id: number, sequence_number: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      const kinmu_index = this.props.kinmus[0].index
      this.props.dispatch(renzoku_kinshi_kinmus.createRenzokuKinshiKinmu(sequence_id, sequence_number, kinmu_index))
    }
  }
  public handleChangeRenzokuKinshiKinmuKinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(renzoku_kinshi_kinmus.updateRenzokuKinshiKinmuKinmuIndex(index, parseInt(event.target.value, 10)))
    }
  }
  public handleClickDeleteRenzokuKinshiKinmu(index: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      this.props.dispatch(renzoku_kinshi_kinmus.deleteRenzokuKinshiKinmu(index))
    }
  }
  public handleClickDeleteSequence(sequence_id: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      this.props.dispatch(renzoku_kinshi_kinmus.deleteSequence(sequence_id))
    }
  }
  public handleClickOpenDialog = () => {
    const kinmu_indices = this.props.kinmus.length > 0 ?
      [this.props.kinmus[0].index, this.props.kinmus[0].index] :
      this.state.kinmu_indices
    this.setState({
      kinmu_indices,
      open: true,
    })
  }
  public handleCloseDialog = () => {
    this.setState({ open: false })
  }
  public handleClickCreateNewSequenceRenzokuKinshiKinmu(index: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      const kinmu_indices = [...this.state.kinmu_indices]
      kinmu_indices.splice(index, 0, this.props.kinmus[0].index)
      this.setState({ kinmu_indices })
    }
  }
  public handleChangeNewSequenceRenzokuKinshiKinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        kinmu_indices: this.state.kinmu_indices.map((kinmu_index, kinmu_indices_index) => {
          if (kinmu_indices_index !== index) {
            return kinmu_index
          }
          return parseInt(event.target.value, 10)
        }),
      })
    }
  }
  public handleClickDeleteNewSequenceRenzokuKinshiKinmu(index: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      this.setState({ kinmu_indices: this.state.kinmu_indices.filter((__, kinmu_indices_index) => kinmu_indices_index !== index) })
    }
  }
  public handleClickCreateSequence = (_: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ open: false })
    this.props.dispatch(renzoku_kinshi_kinmus.createSequence(this.state.kinmu_indices))
  }
  public render() {
    const sequence_ids = Array.from(new Set(this.props.renzoku_kinshi_kinmus.map(renzoku_kinshi_kinmu => renzoku_kinshi_kinmu.sequence_id)))
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>連続禁止勤務並び</Typography>
          <Button size="small" onClick={this.handleClickOpenDialog}>追加</Button>
        </Toolbar>
        {sequence_ids.map(sequence_id => {
          const renzoku_kinshi_kinmus_by_sequence_id = this.props.renzoku_kinshi_kinmus.filter(renzoku_kinshi_kinmu => renzoku_kinshi_kinmu.sequence_id === sequence_id).sort((a, b) => a.sequence_number - b.sequence_number)
          return (
            <ExpansionPanel key={sequence_id}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{renzoku_kinshi_kinmus_by_sequence_id.map(renzoku_kinshi_kinmu => this.props.kinmus.find(kinmu => kinmu.index === renzoku_kinshi_kinmu.kinmu_index)!.name).join(', ')}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Button size="small" onClick={this.handleClickCreateRenzokuKinshiKinmu(sequence_id, 0)}>追加</Button>
                {renzoku_kinshi_kinmus_by_sequence_id.map((renzoku_kinshi_kinmu, index) => (
                  <React.Fragment key={renzoku_kinshi_kinmu.index}>
                    <TextField
                      select={true}
                      label={`勤務${index + 1}`}
                      value={renzoku_kinshi_kinmu.kinmu_index}
                      onChange={this.handleChangeRenzokuKinshiKinmuKinmuIndex(renzoku_kinshi_kinmu.index)}
                      fullWidth={true}
                    >
                      {this.props.kinmus.map(kinmu => (
                        <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
                      ))}
                    </TextField>
                    <Button size="small" onClick={this.handleClickDeleteRenzokuKinshiKinmu(renzoku_kinshi_kinmu.index)}>削除</Button>
                    <Button size="small" onClick={this.handleClickCreateRenzokuKinshiKinmu(sequence_id, renzoku_kinshi_kinmu.sequence_number + 1)}>追加</Button>
                  </React.Fragment>
                ))}
              </ExpansionPanelDetails>
              <ExpansionPanelActions>
                <Button size="small" onClick={this.handleClickDeleteSequence(sequence_id)}>削除</Button>
              </ExpansionPanelActions>
            </ExpansionPanel>
          )
        })}
        {this.props.kinmus.length === 0 ?
          <Dialog onClose={this.handleCloseDialog} open={this.state.open} fullWidth={true} maxWidth="md">
            <DialogTitle>連続禁止勤務並びを追加できません</DialogTitle>
            <DialogContent>
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          <Dialog onClose={this.handleCloseDialog} open={this.state.open} fullWidth={true} maxWidth="md">
            <DialogTitle>連続禁止勤務並びの追加</DialogTitle>
            <DialogContent style={{ display: 'flex' }}>
              <Button size="small" onClick={this.handleClickCreateNewSequenceRenzokuKinshiKinmu(0)}>追加</Button>
              {this.state.kinmu_indices.map((kinmu_index, index) => (
                <React.Fragment key={`${index}-${kinmu_index}`}>
                  <TextField
                    select={true}
                    label={`勤務${index + 1}`}
                    value={kinmu_index}
                    onChange={this.handleChangeNewSequenceRenzokuKinshiKinmuIndex(index)}
                    fullWidth={true}
                  >
                    {this.props.kinmus.map(kinmu => (
                      <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
                    ))}
                  </TextField>
                  <Button size="small" onClick={this.handleClickDeleteNewSequenceRenzokuKinshiKinmu(index)}>削除</Button>
                  <Button size="small" onClick={this.handleClickCreateNewSequenceRenzokuKinshiKinmu(index + 1)}>追加</Button>
                </React.Fragment>
              ))}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateSequence}>追加</Button>
              <Button color="primary" onClick={this.handleCloseDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    kinmus: state.present.kinmus,
    renzoku_kinshi_kinmus: state.present.renzoku_kinshi_kinmus,
  }
}

export default connect(mapStateToProps)(RenzokuKinshiKinmus)
