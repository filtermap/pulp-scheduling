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
import * as constraints3 from '../modules/constraints3'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  dispatch: Dispatch
  constraints3: constraints3.Constraint3[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
}

type State = {
  creationDialogIsOpen: boolean
  newConstraint3IsEnabled: boolean
  newConstraint3MemberId: number
  newConstraint3KinmuId: number
  newConstraint3MinNumberOfAssignments: number
  deletionDialogIsOpen: boolean
  selectedConstraint3Id: number
}

class Constraints3 extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    deletionDialogIsOpen: false,
    newConstraint3IsEnabled: true,
    newConstraint3KinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
    newConstraint3MemberId: this.props.members.length > 0 ? this.props.members[0].id : 0,
    newConstraint3MinNumberOfAssignments: 0,
    selectedConstraint3Id: this.props.constraints3.length > 0 ? this.props.constraints3[0].id : 0,
  }
  public handleChangeConstraint3IsEnabled(id: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      this.props.dispatch(constraints3.updateConstraint3IsEnabled(id, checked))
    }
  }
  public handleChangeConstraint3MemberId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints3.updateConstraint3MemberId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeConstraint3KinmuId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints3.updateConstraint3KinmuId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeConstraint3MinNumberOfAssignments(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints3.updateConstraint3MinNumberOfAssignments(id, parseInt(event.target.value, 10)))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewConstraint3IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newConstraint3IsEnabled: checked })
  }
  public handleChangeNewConstraint3MemberId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint3MemberId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewConstraint3KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint3KinmuId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewConstraint3MinNumberOfAssignments = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint3MinNumberOfAssignments: parseInt(event.target.value, 10) })
  }
  public handleClickCreateConstraint3 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(constraints3.createConstraint3(this.state.newConstraint3IsEnabled, this.state.newConstraint3MemberId, this.state.newConstraint3KinmuId, this.state.newConstraint3MinNumberOfAssignments))
  }
  public handleClickOpenDeletionDialog(selectedConstraint3Id: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedConstraint3Id,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteConstraint3 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(constraints3.deleteConstraint3(this.state.selectedConstraint3Id))
  }
  public render() {
    const selectedConstraint3 = this.props.constraints3.find(c => c.id === this.state.selectedConstraint3Id)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>職員の勤務の割り当て数の下限</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.constraints3.map(c => (
          <ExpansionPanel key={c.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${this.props.members.find(member => member.id === c.member_id)!.name}に${this.props.kinmus.find(kinmu => kinmu.id === c.kinmu_id)!.name}を${c.min_number_of_assignments}回以上割り当てる`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={c.is_enabled}
                    onChange={this.handleChangeConstraint3IsEnabled(c.id)}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="職員"
                value={c.member_id}
                onChange={this.handleChangeConstraint3MemberId(c.id)}
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
                onChange={this.handleChangeConstraint3KinmuId(c.id)}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="割り当て数下限"
                type="number"
                defaultValue={c.min_number_of_assignments}
                onChange={this.handleChangeConstraint3MinNumberOfAssignments(c.id)}
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
            <DialogTitle>職員の勤務の割り当て数の下限を追加できません</DialogTitle>
            <DialogContent>
              {this.props.members.length === 0 ? <DialogContentText>職員がいません</DialogContentText> : null}
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の勤務の割り当て数の下限の追加</DialogTitle>
            <DialogContent style={{ display: 'flex' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.newConstraint3IsEnabled}
                    onChange={this.handleChangeNewConstraint3IsEnabled}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="職員"
                value={this.state.newConstraint3MemberId}
                onChange={this.handleChangeNewConstraint3MemberId}
                fullWidth={true}
              >
                {this.props.members.map(member => (
                  <MenuItem key={member.id} value={member.id}>{member.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                select={true}
                label="勤務"
                value={this.state.newConstraint3KinmuId}
                onChange={this.handleChangeNewConstraint3KinmuId}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="割り当て数下限"
                type="number"
                defaultValue={this.state.newConstraint3MinNumberOfAssignments}
                onChange={this.handleChangeNewConstraint3MinNumberOfAssignments}
                fullWidth={true}
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateConstraint3}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selectedConstraint3 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の勤務の割り当て数の下限の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この職員の勤務の割り当て数の下限を削除します</DialogContentText>
              <Typography>{`${this.props.members.find(member => member.id === selectedConstraint3.member_id)!.name}に${this.props.kinmus.find(kinmu => kinmu.id === selectedConstraint3.kinmu_id)!.name}を${selectedConstraint3.min_number_of_assignments}回以上割り当てる`}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteConstraint3}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    constraints3: state.present.constraints3,
    kinmus: state.present.kinmus,
    members: state.present.members,
  }
}

export default connect(mapStateToProps)(Constraints3)
