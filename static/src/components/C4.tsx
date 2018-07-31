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
import * as c4 from '../modules/c4'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  dispatch: Dispatch
  c4: c4.C4[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
}

type State = {
  creationDialogIsOpen: boolean
  newC4IsEnabled: boolean
  newC4MemberId: number
  newC4KinmuId: number
  newC4MaxNumberOfAssignments: number
  deletionDialogIsOpen: boolean
  selectedC4Id: number
}

class C4 extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    deletionDialogIsOpen: false,
    newC4IsEnabled: true,
    newC4KinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
    newC4MaxNumberOfAssignments: 0,
    newC4MemberId: this.props.members.length > 0 ? this.props.members[0].id : 0,
    selectedC4Id: this.props.c4.length > 0 ? this.props.c4[0].id : 0,
  }
  public handleChangeC4IsEnabled(id: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      this.props.dispatch(c4.updateC4IsEnabled(id, checked))
    }
  }
  public handleChangeC4MemberId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c4.updateC4MemberId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeC4KinmuId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c4.updateC4KinmuId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeC4MaxNumberOfAssignments(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c4.updateC4MaxNumberOfAssignments(id, parseInt(event.target.value, 10)))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewC4IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newC4IsEnabled: checked })
  }
  public handleChangeNewC4MemberId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC4MemberId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC4KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC4KinmuId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC4MaxNumberOfAssignments = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC4MaxNumberOfAssignments: parseInt(event.target.value, 10) })
  }
  public handleClickCreateC4 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(c4.createC4(this.state.newC4IsEnabled, this.state.newC4MemberId, this.state.newC4KinmuId, this.state.newC4MaxNumberOfAssignments))
  }
  public handleClickOpenDeletionDialog(selectedC4Id: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedC4Id,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteC4 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(c4.deleteC4(this.state.selectedC4Id))
  }
  public render() {
    const selectedC4 = this.props.c4.find(c => c.id === this.state.selectedC4Id)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>職員の勤務の割り当て数の上限</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.c4.map(c => (
          <ExpansionPanel key={c.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${this.props.members.find(member => member.id === c.member_id)!.name}に${this.props.kinmus.find(kinmu => kinmu.id === c.kinmu_id)!.name}を${c.max_number_of_assignments}回以下割り当てる`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={c.is_enabled}
                    onChange={this.handleChangeC4IsEnabled(c.id)}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="職員"
                value={c.member_id}
                onChange={this.handleChangeC4MemberId(c.id)}
                fullWidth={true}
              >
                {this.props.members.map(member => (
                  <MenuItem key={member.id} value={member.id}>{member.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_id}
                onChange={this.handleChangeC4KinmuId(c.id)}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="割り当て数上限"
                type="number"
                defaultValue={c.max_number_of_assignments}
                onChange={this.handleChangeC4MaxNumberOfAssignments(c.id)}
                fullWidth={true}
              />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleClickOpenDeletionDialog(c.id)}>削除</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
        {this.props.members.length === 0 || this.props.kinmus.length === 0 ?
          <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の勤務の割り当て数の上限を追加できません</DialogTitle>
            <DialogContent>
              {this.props.members.length === 0 ? <DialogContentText>職員がいません</DialogContentText> : null}
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の勤務の割り当て数の上限の追加</DialogTitle>
            <DialogContent style={{ display: 'flex' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.newC4IsEnabled}
                    onChange={this.handleChangeNewC4IsEnabled}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="職員"
                value={this.state.newC4MemberId}
                onChange={this.handleChangeNewC4MemberId}
                fullWidth={true}
              >
                {this.props.members.map(member => (
                  <MenuItem key={member.id} value={member.id}>{member.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                select={true}
                label="勤務"
                value={this.state.newC4KinmuId}
                onChange={this.handleChangeNewC4KinmuId}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="割り当て数上限"
                type="number"
                defaultValue={this.state.newC4MaxNumberOfAssignments}
                onChange={this.handleChangeNewC4MaxNumberOfAssignments}
                fullWidth={true}
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateC4}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selectedC4 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の勤務の割り当て数の上限の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この職員の勤務の割り当て数の上限を削除します</DialogContentText>
              <Typography>{`${this.props.members.find(member => member.id === selectedC4.member_id)!.name}に${this.props.kinmus.find(kinmu => kinmu.id === selectedC4.kinmu_id)!.name}を${selectedC4.max_number_of_assignments}回以下割り当てる`}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteC4}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    c4: state.present.c4,
    kinmus: state.present.kinmus,
    members: state.present.members,
  }
}

export default connect(mapStateToProps)(C4)
