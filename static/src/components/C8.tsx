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
import * as c8 from '../modules/c8'
import * as kinmus from '../modules/kinmus'

type Props = {
  dispatch: Dispatch
  c8: c8.C8[]
  kinmus: kinmus.Kinmu[]
}

type State = {
  creationDialogIsOpen: boolean
  newC8KinmuIndex: number
  newC8MaxNumberOfDays: number
  deletionDialogIsOpen: boolean
  selectedC8Index: number
}

class C8 extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    deletionDialogIsOpen: false,
    newC8KinmuIndex: this.props.kinmus.length > 0 ? this.props.kinmus[0].index : 0,
    newC8MaxNumberOfDays: 0,
    selectedC8Index: this.props.c8.length > 0 ? this.props.c8[0].index : 0,
  }
  public handleChangeC8KinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c8.updateC8KinmuIndex(index, parseInt(event.target.value, 10)))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewC8KinmuIndex = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC8KinmuIndex: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC8MaxNumberOfDays = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC8MaxNumberOfDays: parseInt(event.target.value, 10) })
  }
  public handleClickCreateC8 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(c8.createC8(this.state.newC8KinmuIndex, this.state.newC8MaxNumberOfDays))
  }
  public handleChangeC8MaxNumberOfDays(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c8.updateC8MaxNumberOfDays(index, parseInt(event.target.value, 10)))
    }
  }
  public handleClickOpenDeletionDialog(selectedC8Index: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedC8Index,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteC8 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(c8.deleteC8(this.state.selectedC8Index))
  }
  public render() {
    const selectedC8 = this.props.c8.find(c => c.index === this.state.selectedC8Index)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>勤務の間隔日数の上限</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.c8.map(c => (
          <ExpansionPanel key={c.index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${this.props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}の間隔日数を${c.max_number_of_days}日以下にする`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_index}
                onChange={this.handleChangeC8KinmuIndex(c.index)}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="間隔日数上限"
                type="number"
                defaultValue={c.max_number_of_days}
                onChange={this.handleChangeC8MaxNumberOfDays(c.index)}
                fullWidth={true}
              />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleClickOpenDeletionDialog(c.index)}>削除</Button>
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
              <TextField
                select={true}
                label="勤務"
                value={this.state.newC8KinmuIndex}
                onChange={this.handleChangeNewC8KinmuIndex}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="間隔日数下限"
                type="number"
                defaultValue={this.state.newC8MaxNumberOfDays}
                onChange={this.handleChangeNewC8MaxNumberOfDays}
                fullWidth={true}
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateC8}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selectedC8 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>勤務の間隔日数の上限の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この勤務の間隔日数の上限を削除します</DialogContentText>
              <Typography>{`${this.props.kinmus.find(kinmu => kinmu.index === selectedC8.kinmu_index)!.name}の間隔日数を${selectedC8.max_number_of_days}日以下にする`}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteC8}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    c8: state.present.c8,
    kinmus: state.present.kinmus,
  }
}

export default connect(mapStateToProps)(C8)
