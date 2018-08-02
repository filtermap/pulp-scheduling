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
import * as constraints10 from '../modules/constraints10'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'
import * as utils from '../utils'

type Props = {
  dispatch: Dispatch
  constraints10: constraints10.Constraint10[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
}

type State = {
  creationDialogIsOpen: boolean
  newConstraint10IsEnabled: boolean
  newConstraint10MemberId: number
  newConstraint10StartDateName: string
  newConstraint10StopDateName: string
  newConstraint10KinmuId: number
  deletionDialogIsOpen: boolean
  selectedConstraint10Id: number
}

class Constraints10 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const todayString = utils.dateToString(new Date())
    this.state = {
      creationDialogIsOpen: false,
      deletionDialogIsOpen: false,
      newConstraint10IsEnabled: true,
      newConstraint10KinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
      newConstraint10MemberId: this.props.members.length > 0 ? this.props.members[0].id : 0,
      newConstraint10StartDateName: todayString,
      newConstraint10StopDateName: todayString,
      selectedConstraint10Id: this.props.constraints10.length > 0 ? this.props.constraints10[0].id : 0,
    }
  }
  public handleChangeConstraint10IsEnabled(id: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      this.props.dispatch(constraints10.updateConstraint10IsEnabled(id, checked))
    }
  }
  public handleChangeConstraint10MemberId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints10.updateConstraint10MemberId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeConstraint10StartDateName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints10.updateConstraint10StartDateName(id, event.target.value))
    }
  }
  public handleChangeConstraint10StopDateName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints10.updateConstraint10StopDateName(id, event.target.value))
    }
  }
  public handleChangeConstraint10KinmuId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints10.updateConstraint10KinmuId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewConstraint10IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newConstraint10IsEnabled: checked })
  }
  public handleChangeNewConstraint10MemberId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint10MemberId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewConstraint10StartDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint10StartDateName: event.target.value })
  }
  public handleChangeNewConstraint10StopDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint10StopDateName: event.target.value })
  }
  public handleChangeNewConstraint10KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint10KinmuId: parseInt(event.target.value, 10) })
  }
  public handleClickCreateConstraint10 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(constraints10.createConstraint10(this.state.newConstraint10IsEnabled, this.state.newConstraint10MemberId, this.state.newConstraint10StartDateName, this.state.newConstraint10StopDateName, this.state.newConstraint10KinmuId))
  }
  public handleClickOpenDeletionDialog(selectedConstraint10Id: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedConstraint10Id,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteConstraint10 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(constraints10.deleteConstraint10(this.state.selectedConstraint10Id))
  }
  public render() {
    const selectedConstraint10 = this.props.constraints10.find(c => c.id === this.state.selectedConstraint10Id)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>職員の期間に割り当てない勤務</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.constraints10.map(c => (
          <ExpansionPanel key={c.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${this.props.members.find(member => member.id === c.member_id)!.name}の${c.start_date_name}から${c.stop_date_name}までに${this.props.kinmus.find(kinmu => kinmu.id === c.kinmu_id)!.name}を割り当てない`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={c.is_enabled}
                    onChange={this.handleChangeConstraint10IsEnabled(c.id)}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="職員"
                value={c.member_id}
                onChange={this.handleChangeConstraint10MemberId(c.id)}
                fullWidth={true}
              >
                {this.props.members.map(member => (
                  <MenuItem key={member.id} value={member.id}>{member.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="開始日"
                type="date"
                defaultValue={c.start_date_name}
                onChange={this.handleChangeConstraint10StartDateName(c.id)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={c.stop_date_name}
                onChange={this.handleChangeConstraint10StopDateName(c.id)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_id}
                onChange={this.handleChangeConstraint10KinmuId(c.id)}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleClickOpenDeletionDialog(c.id)}>削除</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
        {this.props.members.length === 0 && this.props.kinmus.length === 0 ?
          <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の期間に割り当てない勤務を追加できません</DialogTitle>
            <DialogContent>
              {this.props.members.length === 0 ? <DialogContentText>職員がいません</DialogContentText> : null}
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の期間に割り当てない勤務の追加</DialogTitle>
            <DialogContent style={{ display: 'flex' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.newConstraint10IsEnabled}
                    onChange={this.handleChangeNewConstraint10IsEnabled}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="職員"
                value={this.state.newConstraint10MemberId}
                onChange={this.handleChangeNewConstraint10MemberId}
                fullWidth={true}
              >
                {this.props.members.map(member => (
                  <MenuItem key={member.id} value={member.id}>{member.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="開始日"
                type="date"
                defaultValue={this.state.newConstraint10StartDateName}
                onChange={this.handleChangeNewConstraint10StartDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={this.state.newConstraint10StopDateName}
                onChange={this.handleChangeNewConstraint10StopDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={this.state.newConstraint10KinmuId}
                onChange={this.handleChangeNewConstraint10KinmuId}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateConstraint10}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selectedConstraint10 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の期間に割り当てない勤務の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この職員の期間に割り当てない勤務を削除します</DialogContentText>
              <Typography>{`${this.props.members.find(member => member.id === selectedConstraint10.member_id)!.name}の${selectedConstraint10.start_date_name}から${selectedConstraint10.stop_date_name}までに${this.props.kinmus.find(kinmu => kinmu.id === selectedConstraint10.kinmu_id)!.name}を割り当てない`}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteConstraint10}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    constraints10: state.present.constraints10,
    kinmus: state.present.kinmus,
    members: state.present.members,
  }
}

export default connect(mapStateToProps)(Constraints10)
