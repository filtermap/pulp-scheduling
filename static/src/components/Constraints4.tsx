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
import * as constraints4 from '../modules/constraints4'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  dispatch: Dispatch
  constraints4: constraints4.Constraint4[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
}

type State = {
  creationDialogIsOpen: boolean
  newConstraint4IsEnabled: boolean
  newConstraint4MemberId: number
  newConstraint4KinmuId: number
  newConstraint4MaxNumberOfAssignments: number
  deletionDialogIsOpen: boolean
  selectedConstraint4Id: number
}

class Constraints4 extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    deletionDialogIsOpen: false,
    newConstraint4IsEnabled: true,
    newConstraint4KinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
    newConstraint4MaxNumberOfAssignments: 0,
    newConstraint4MemberId: this.props.members.length > 0 ? this.props.members[0].id : 0,
    selectedConstraint4Id: this.props.constraints4.length > 0 ? this.props.constraints4[0].id : 0,
  }
  public handleChangeConstraint4IsEnabled(id: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      this.props.dispatch(constraints4.updateConstraint4IsEnabled(id, checked))
    }
  }
  public handleChangeConstraint4MemberId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints4.updateConstraint4MemberId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeConstraint4KinmuId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints4.updateConstraint4KinmuId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeConstraint4MaxNumberOfAssignments(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints4.updateConstraint4MaxNumberOfAssignments(id, parseInt(event.target.value, 10)))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewConstraint4IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newConstraint4IsEnabled: checked })
  }
  public handleChangeNewConstraint4MemberId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint4MemberId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewConstraint4KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint4KinmuId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewConstraint4MaxNumberOfAssignments = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint4MaxNumberOfAssignments: parseInt(event.target.value, 10) })
  }
  public handleClickCreateConstraint4 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(constraints4.createConstraint4(this.state.newConstraint4IsEnabled, this.state.newConstraint4MemberId, this.state.newConstraint4KinmuId, this.state.newConstraint4MaxNumberOfAssignments))
  }
  public handleClickOpenDeletionDialog(selectedConstraint4Id: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedConstraint4Id,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteConstraint4 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(constraints4.deleteConstraint4(this.state.selectedConstraint4Id))
  }
  public render() {
    const selectedConstraint4 = this.props.constraints4.find(c => c.id === this.state.selectedConstraint4Id)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>職員の勤務の割り当て数の上限</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.constraints4.map(c => (
          <ExpansionPanel key={c.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${this.props.members.find(member => member.id === c.member_id)!.name}に${this.props.kinmus.find(kinmu => kinmu.id === c.kinmu_id)!.name}を${c.max_number_of_assignments}回以下割り当てる`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={c.is_enabled}
                    onChange={this.handleChangeConstraint4IsEnabled(c.id)}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="職員"
                value={c.member_id}
                onChange={this.handleChangeConstraint4MemberId(c.id)}
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
                onChange={this.handleChangeConstraint4KinmuId(c.id)}
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
                onChange={this.handleChangeConstraint4MaxNumberOfAssignments(c.id)}
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
                    checked={this.state.newConstraint4IsEnabled}
                    onChange={this.handleChangeNewConstraint4IsEnabled}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="職員"
                value={this.state.newConstraint4MemberId}
                onChange={this.handleChangeNewConstraint4MemberId}
                fullWidth={true}
              >
                {this.props.members.map(member => (
                  <MenuItem key={member.id} value={member.id}>{member.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                select={true}
                label="勤務"
                value={this.state.newConstraint4KinmuId}
                onChange={this.handleChangeNewConstraint4KinmuId}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="割り当て数上限"
                type="number"
                defaultValue={this.state.newConstraint4MaxNumberOfAssignments}
                onChange={this.handleChangeNewConstraint4MaxNumberOfAssignments}
                fullWidth={true}
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateConstraint4}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selectedConstraint4 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の勤務の割り当て数の上限の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この職員の勤務の割り当て数の上限を削除します</DialogContentText>
              <Typography>{`${this.props.members.find(member => member.id === selectedConstraint4.member_id)!.name}に${this.props.kinmus.find(kinmu => kinmu.id === selectedConstraint4.kinmu_id)!.name}を${selectedConstraint4.max_number_of_assignments}回以下割り当てる`}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteConstraint4}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    constraints4: state.present.constraints4,
    kinmus: state.present.kinmus,
    members: state.present.members,
  }
}

export default connect(mapStateToProps)(Constraints4)
