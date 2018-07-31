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
import * as c9 from '../modules/c9'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'
import * as utils from '../utils'

type Props = {
  dispatch: Dispatch
  c9: c9.C9[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
}

type State = {
  creationDialogIsOpen: boolean
  newC9IsEnabled: boolean
  newC9MemberId: number
  newC9StartDateName: string
  newC9StopDateName: string
  newC9KinmuId: number
  deletionDialogIsOpen: boolean
  selectedC9Id: number
}

class C9 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const todayString = utils.dateToString(new Date())
    this.state = {
      creationDialogIsOpen: false,
      deletionDialogIsOpen: false,
      newC9IsEnabled: true,
      newC9KinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
      newC9MemberId: this.props.members.length > 0 ? this.props.members[0].id : 0,
      newC9StartDateName: todayString,
      newC9StopDateName: todayString,
      selectedC9Id: this.props.c9.length > 0 ? this.props.c9[0].id : 0,
    }
  }
  public handleChangeC9IsEnabled(id: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      this.props.dispatch(c9.updateC9IsEnabled(id, checked))
    }
  }
  public handleChangeC9MemberId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c9.updateC9MemberId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeC9StartDateName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c9.updateC9StartDateName(id, event.target.value))
    }
  }
  public handleChangeC9StopDateName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c9.updateC9StopDateName(id, event.target.value))
    }
  }
  public handleChangeC9KinmuId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c9.updateC9KinmuId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewC9IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newC9IsEnabled: checked })
  }
  public handleChangeNewC9MemberId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC9MemberId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC9StartDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC9StartDateName: event.target.value })
  }
  public handleChangeNewC9StopDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC9StopDateName: event.target.value })
  }
  public handleChangeNewC9KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC9KinmuId: parseInt(event.target.value, 10) })
  }
  public handleClickCreateC9 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(c9.createC9(this.state.newC9IsEnabled, this.state.newC9MemberId, this.state.newC9StartDateName, this.state.newC9StopDateName, this.state.newC9KinmuId))
  }
  public handleClickOpenDeletionDialog(selectedC9Id: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedC9Id,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteC9 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(c9.deleteC9(this.state.selectedC9Id))
  }
  public render() {
    const selectedC9 = this.props.c9.find(c => c.id === this.state.selectedC9Id)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>職員の期間に割り当てる勤務</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.c9.map(c => (
          <ExpansionPanel key={c.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${this.props.members.find(member => member.id === c.member_id)!.name}の${c.start_date_name}から${c.stop_date_name}までに${this.props.kinmus.find(kinmu => kinmu.id === c.kinmu_id)!.name}を割り当てる`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={c.is_enabled}
                    onChange={this.handleChangeC9IsEnabled(c.id)}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="職員"
                value={c.member_id}
                onChange={this.handleChangeC9MemberId(c.id)}
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
                onChange={this.handleChangeC9StartDateName(c.id)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={c.stop_date_name}
                onChange={this.handleChangeC9StopDateName(c.id)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_id}
                onChange={this.handleChangeC9KinmuId(c.id)}
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
                    checked={this.state.newC9IsEnabled}
                    onChange={this.handleChangeNewC9IsEnabled}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                select={true}
                label="職員"
                value={this.state.newC9MemberId}
                onChange={this.handleChangeNewC9MemberId}
                fullWidth={true}
              >
                {this.props.members.map(member => (
                  <MenuItem key={member.id} value={member.id}>{member.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="開始日"
                type="date"
                defaultValue={this.state.newC9StartDateName}
                onChange={this.handleChangeNewC9StartDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={this.state.newC9StopDateName}
                onChange={this.handleChangeNewC9StopDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={this.state.newC9KinmuId}
                onChange={this.handleChangeNewC9KinmuId}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateC9}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selectedC9 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の期間に割り当てる勤務の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この職員の期間に割り当てる勤務を削除します</DialogContentText>
              <Typography>{`${this.props.members.find(member => member.id === selectedC9.member_id)!.name}の${selectedC9.start_date_name}から${selectedC9.stop_date_name}までに${this.props.kinmus.find(kinmu => kinmu.id === selectedC9.kinmu_id)!.name}を割り当てる`}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteC9}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    c9: state.present.c9,
    kinmus: state.present.kinmus,
    members: state.present.members,
  }
}

export default connect(mapStateToProps)(C9)
