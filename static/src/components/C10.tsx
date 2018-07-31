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
import * as c10 from '../modules/c10'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'
import * as utils from '../utils'

type Props = {
  dispatch: Dispatch
  c10: c10.C10[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
}

type State = {
  creationDialogIsOpen: boolean
  newC10IsEnabled: boolean
  newC10MemberId: number
  newC10StartDateName: string
  newC10StopDateName: string
  newC10KinmuId: number
  deletionDialogIsOpen: boolean
  selectedC10Id: number
}

class C10 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const todayString = utils.dateToString(new Date())
    this.state = {
      creationDialogIsOpen: false,
      deletionDialogIsOpen: false,
      newC10IsEnabled: true,
      newC10KinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
      newC10MemberId: this.props.members.length > 0 ? this.props.members[0].id : 0,
      newC10StartDateName: todayString,
      newC10StopDateName: todayString,
      selectedC10Id: this.props.c10.length > 0 ? this.props.c10[0].id : 0,
    }
  }
  public handleChangeC10IsEnabled(id: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      this.props.dispatch(c10.updateC10IsEnabled(id, checked))
    }
  }
  public handleChangeC10MemberId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c10.updateC10MemberId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeC10StartDateName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c10.updateC10StartDateName(id, event.target.value))
    }
  }
  public handleChangeC10StopDateName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c10.updateC10StopDateName(id, event.target.value))
    }
  }
  public handleChangeC10KinmuId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c10.updateC10KinmuId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewC10IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newC10IsEnabled: checked })
  }
  public handleChangeNewC10MemberId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC10MemberId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC10StartDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC10StartDateName: event.target.value })
  }
  public handleChangeNewC10StopDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC10StopDateName: event.target.value })
  }
  public handleChangeNewC10KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC10KinmuId: parseInt(event.target.value, 10) })
  }
  public handleClickCreateC10 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(c10.createC10(this.state.newC10IsEnabled, this.state.newC10MemberId, this.state.newC10StartDateName, this.state.newC10StopDateName, this.state.newC10KinmuId))
  }
  public handleClickOpenDeletionDialog(selectedC10Id: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedC10Id,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteC10 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(c10.deleteC10(this.state.selectedC10Id))
  }
  public render() {
    const selectedC10 = this.props.c10.find(c => c.id === this.state.selectedC10Id)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>職員の期間に割り当てない勤務</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.c10.map(c => (
          <ExpansionPanel key={c.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${this.props.members.find(member => member.id === c.member_id)!.name}の${c.start_date_name}から${c.stop_date_name}までに${this.props.kinmus.find(kinmu => kinmu.id === c.kinmu_id)!.name}を割り当てない`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={c.is_enabled}
                    onChange={this.handleChangeC10IsEnabled(c.id)}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="職員"
                value={c.member_id}
                onChange={this.handleChangeC10MemberId(c.id)}
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
                onChange={this.handleChangeC10StartDateName(c.id)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={c.stop_date_name}
                onChange={this.handleChangeC10StopDateName(c.id)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_id}
                onChange={this.handleChangeC10KinmuId(c.id)}
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
                    checked={this.state.newC10IsEnabled}
                    onChange={this.handleChangeNewC10IsEnabled}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="職員"
                value={this.state.newC10MemberId}
                onChange={this.handleChangeNewC10MemberId}
                fullWidth={true}
              >
                {this.props.members.map(member => (
                  <MenuItem key={member.id} value={member.id}>{member.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="開始日"
                type="date"
                defaultValue={this.state.newC10StartDateName}
                onChange={this.handleChangeNewC10StartDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={this.state.newC10StopDateName}
                onChange={this.handleChangeNewC10StopDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={this.state.newC10KinmuId}
                onChange={this.handleChangeNewC10KinmuId}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateC10}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selectedC10 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の期間に割り当てない勤務の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この職員の期間に割り当てない勤務を削除します</DialogContentText>
              <Typography>{`${this.props.members.find(member => member.id === selectedC10.member_id)!.name}の${selectedC10.start_date_name}から${selectedC10.stop_date_name}までに${this.props.kinmus.find(kinmu => kinmu.id === selectedC10.kinmu_id)!.name}を割り当てない`}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteC10}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    c10: state.present.c10,
    kinmus: state.present.kinmus,
    members: state.present.members,
  }
}

export default connect(mapStateToProps)(C10)
