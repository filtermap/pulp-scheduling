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
import * as c10 from '../modules/c10'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'
import * as utils from '../utils'

type State = {
  open: boolean
  member_index: number
  start_date_name: string
  stop_date_name: string
  kinmu_index: number
}

type Props = {
  dispatch: Dispatch
  c10: c10.C10[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
}

class C10 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const todayString = utils.dateToString(new Date())
    this.state = {
      kinmu_index: this.props.kinmus.length > 0 ? this.props.kinmus[0].index : 0,
      member_index: this.props.members.length > 0 ? this.props.members[0].index : 0,
      open: false,
      start_date_name: todayString,
      stop_date_name: todayString,
    }
  }
  public handleChangeC10MemberIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c10.updateC10MemberIndex(index, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeC10StartDateName(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c10.updateC10StartDateName(index, event.target.value))
    }
  }
  public handleChangeC10StopDateName(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c10.updateC10StopDateName(index, event.target.value))
    }
  }
  public handleChangeC10KinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c10.updateC10KinmuIndex(index, parseInt(event.target.value, 10)))
    }
  }
  public handleClickDeleteC10(index: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      this.props.dispatch(c10.deleteC10(index))
    }
  }
  public handleClickOpenDialog = () => {
    this.setState({ open: true })
  }
  public handleCloseDialog = () => {
    this.setState({ open: false })
  }
  public handleChangeNewC10MemberIndex = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ member_index: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC10StartDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ start_date_name: event.target.value })
  }
  public handleChangeNewC10StopDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ stop_date_name: event.target.value })
  }
  public handleChangeNewC10KinmuIndex = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ kinmu_index: parseInt(event.target.value, 10) })
  }
  public handleClickCreateC10 = () => {
    this.setState({ open: false })
    this.props.dispatch(c10.createC10(this.state.member_index, this.state.start_date_name, this.state.stop_date_name, this.state.kinmu_index))
  }
  public render() {
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>職員の期間に割り当てない勤務</Typography>
          <Button size="small" onClick={this.handleClickOpenDialog}>追加</Button>
        </Toolbar>
        {this.props.c10.map(c => (
          <ExpansionPanel key={c.index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${this.props.members.find(member => member.index === c.member_index)!.name}の${c.start_date_name}から${c.stop_date_name}までに${this.props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}を割り当てない`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField
                select={true}
                label="職員"
                value={c.member_index}
                onChange={this.handleChangeC10MemberIndex(c.index)}
                fullWidth={true}
              >
                {this.props.members.map(member => (
                  <MenuItem key={member.index} value={member.index}>{member.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="開始日"
                type="date"
                defaultValue={c.start_date_name}
                onChange={this.handleChangeC10StartDateName(c.index)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={c.stop_date_name}
                onChange={this.handleChangeC10StopDateName(c.index)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_index}
                onChange={this.handleChangeC10KinmuIndex(c.index)}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleClickDeleteC10(c.index)}>削除</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
        {this.props.members.length === 0 && this.props.kinmus.length === 0 ?
          <Dialog onClose={this.handleCloseDialog} open={this.state.open} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の期間に割り当てない勤務を追加できません</DialogTitle>
            <DialogContent>
              {this.props.members.length === 0 ? <DialogContentText>職員がいません</DialogContentText> : null}
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          <Dialog onClose={this.handleCloseDialog} open={this.state.open} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の期間に割り当てない勤務の追加</DialogTitle>
            <DialogContent style={{ display: 'flex' }}>
              <TextField
                select={true}
                label="職員"
                value={this.state.member_index}
                onChange={this.handleChangeNewC10MemberIndex}
                fullWidth={true}
              >
                {this.props.members.map(member => (
                  <MenuItem key={member.index} value={member.index}>{member.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="開始日"
                type="date"
                defaultValue={this.state.start_date_name}
                onChange={this.handleChangeNewC10StartDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={this.state.stop_date_name}
                onChange={this.handleChangeNewC10StopDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={this.state.kinmu_index}
                onChange={this.handleChangeNewC10KinmuIndex}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateC10}>追加</Button>
              <Button color="primary" onClick={this.handleCloseDialog}>閉じる</Button>
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
