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
import * as constraints9 from '../modules/constraints9'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'
import * as utils from '../utils'

type Props = {
  dispatch: Dispatch
  constraints9: constraints9.Constraint9[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
}

type State = {
  creationDialogIsOpen: boolean
  newConstraint9IsEnabled: boolean
  newConstraint9MemberId: number
  newConstraint9StartDateName: string
  newConstraint9StopDateName: string
  newConstraint9KinmuId: number
  deletionDialogIsOpen: boolean
  selectedConstraint9Id: number
}

class Constraints9 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const todayString = utils.dateToString(new Date())
    this.state = {
      creationDialogIsOpen: false,
      deletionDialogIsOpen: false,
      newConstraint9IsEnabled: true,
      newConstraint9KinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
      newConstraint9MemberId: this.props.members.length > 0 ? this.props.members[0].id : 0,
      newConstraint9StartDateName: todayString,
      newConstraint9StopDateName: todayString,
      selectedConstraint9Id: this.props.constraints9.length > 0 ? this.props.constraints9[0].id : 0,
    }
  }
  public handleChangeConstraint9IsEnabled(id: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      this.props.dispatch(constraints9.updateConstraint9IsEnabled(id, checked))
    }
  }
  public handleChangeConstraint9MemberId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints9.updateConstraint9MemberId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeConstraint9StartDateName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints9.updateConstraint9StartDateName(id, event.target.value))
    }
  }
  public handleChangeConstraint9StopDateName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints9.updateConstraint9StopDateName(id, event.target.value))
    }
  }
  public handleChangeConstraint9KinmuId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints9.updateConstraint9KinmuId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewConstraint9IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newConstraint9IsEnabled: checked })
  }
  public handleChangeNewConstraint9MemberId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint9MemberId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewConstraint9StartDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint9StartDateName: event.target.value })
  }
  public handleChangeNewConstraint9StopDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint9StopDateName: event.target.value })
  }
  public handleChangeNewConstraint9KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint9KinmuId: parseInt(event.target.value, 10) })
  }
  public handleClickCreateConstraint9 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(constraints9.createConstraint9(this.state.newConstraint9IsEnabled, this.state.newConstraint9MemberId, this.state.newConstraint9StartDateName, this.state.newConstraint9StopDateName, this.state.newConstraint9KinmuId))
  }
  public handleClickOpenDeletionDialog(selectedConstraint9Id: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedConstraint9Id,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteConstraint9 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(constraints9.deleteConstraint9(this.state.selectedConstraint9Id))
  }
  public render() {
    const selectedConstraint9 = this.props.constraints9.find(c => c.id === this.state.selectedConstraint9Id)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>職員の期間に割り当てる勤務</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.constraints9.map(c => (
          <ExpansionPanel key={c.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${this.props.members.find(member => member.id === c.member_id)!.name}の${c.start_date_name}から${c.stop_date_name}までに${this.props.kinmus.find(kinmu => kinmu.id === c.kinmu_id)!.name}を割り当てる`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={c.is_enabled}
                    onChange={this.handleChangeConstraint9IsEnabled(c.id)}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="職員"
                value={c.member_id}
                onChange={this.handleChangeConstraint9MemberId(c.id)}
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
                onChange={this.handleChangeConstraint9StartDateName(c.id)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={c.stop_date_name}
                onChange={this.handleChangeConstraint9StopDateName(c.id)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_id}
                onChange={this.handleChangeConstraint9KinmuId(c.id)}
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
            <DialogTitle>職員の期間に割り当てる勤務を追加できません</DialogTitle>
            <DialogContent>
              {this.props.members.length === 0 ? <DialogContentText>職員がいません</DialogContentText> : null}
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の機関に割り当てる勤務の追加</DialogTitle>
            <DialogContent style={{ display: 'flex' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.newConstraint9IsEnabled}
                    onChange={this.handleChangeNewConstraint9IsEnabled}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="職員"
                value={this.state.newConstraint9MemberId}
                onChange={this.handleChangeNewConstraint9MemberId}
                fullWidth={true}
              >
                {this.props.members.map(member => (
                  <MenuItem key={member.id} value={member.id}>{member.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="開始日"
                type="date"
                defaultValue={this.state.newConstraint9StartDateName}
                onChange={this.handleChangeNewConstraint9StartDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={this.state.newConstraint9StopDateName}
                onChange={this.handleChangeNewConstraint9StopDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={this.state.newConstraint9KinmuId}
                onChange={this.handleChangeNewConstraint9KinmuId}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateConstraint9}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selectedConstraint9 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の期間に割り当てる勤務の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この職員の期間に割り当てる勤務を削除します</DialogContentText>
              <Typography>{`${this.props.members.find(member => member.id === selectedConstraint9.member_id)!.name}の${selectedConstraint9.start_date_name}から${selectedConstraint9.stop_date_name}までに${this.props.kinmus.find(kinmu => kinmu.id === selectedConstraint9.kinmu_id)!.name}を割り当てる`}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteConstraint9}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    constraints9: state.present.constraints9,
    kinmus: state.present.kinmus,
    members: state.present.members,
  }
}

export default connect(mapStateToProps)(Constraints9)
