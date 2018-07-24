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

type Props = {
  dispatch: Dispatch
  kinmus: kinmus.Kinmu[]
}

type State = {
  creationDialogIsOpen: boolean
  newKinmuName: string
  deletionDialogIsOpen: boolean
  selectedKinmuIndex: number
}

class Kinmus extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    deletionDialogIsOpen: false,
    newKinmuName: '',
    selectedKinmuIndex: this.props.kinmus.length > 0 ? this.props.kinmus[0].index : 0,
  }
  public handleChangeKinmuName(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(kinmus.updateKinmuName(index, event.target.value))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewKinmuName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newKinmuName: event.target.value })
  }
  public handleClickCreateKinmu = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(kinmus.createKinmu(this.state.newKinmuName))
  }
  public handleClickOpenDeletionDialog(selectedKinmuIndex: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedKinmuIndex,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteKinmu = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(all.deleteKinmu(this.state.selectedKinmuIndex))
  }

  public render() {
    const selectedKinmu = this.props.kinmus.find(kinmu => kinmu.index === this.state.selectedKinmuIndex)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>勤務</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.kinmus.map(kinmu => (
          <ExpansionPanel key={kinmu.index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{kinmu.name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField
                label="勤務名"
                defaultValue={kinmu.name}
                onChange={this.handleChangeKinmuName(kinmu.index)}
                margin="normal"
              />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleClickOpenDeletionDialog(kinmu.index)}>削除</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
        <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
          <DialogTitle>勤務の追加</DialogTitle>
          <DialogContent style={{ display: 'flex' }}>
            <TextField
              label="勤務名"
              defaultValue={this.state.newKinmuName}
              onChange={this.handleChangeNewKinmuName}
              fullWidth={true}
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickCreateKinmu}>追加</Button>
            <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
          </DialogActions>
        </Dialog>
        {selectedKinmu &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>勤務の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この勤務を削除します</DialogContentText>
              <Typography>{selectedKinmu.name}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteKinmu}>削除</Button>
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
    kinmus: state.present.kinmus
  }
}

export default connect(mapStateToProps)(Kinmus)
