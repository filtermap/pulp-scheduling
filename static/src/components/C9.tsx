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
import * as c9 from '../modules/c9'
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
  c9: c9.C9[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
}

class C9 extends React.Component<Props, State> {
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
  public handleChangeC9MemberIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c9.updateC9MemberIndex(index, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeC9StartDateName(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c9.updateC9StartDateName(index, event.target.value))
    }
  }
  public handleChangeC9StopDateName(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c9.updateC9StopDateName(index, event.target.value))
    }
  }
  public handleChangeC9KinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c9.updateC9KinmuIndex(index, parseInt(event.target.value, 10)))
    }
  }
  public handleClickDeleteC9(index: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      this.props.dispatch(c9.deleteC9(index))
    }
  }
  public handleClickOpenDialog = () => {
    this.setState({ open: true })
  }
  public handleCloseDialog = () => {
    this.setState({ open: false })
  }
  public handleChangeNewC9MemberIndex = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ member_index: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC9StartDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ start_date_name: event.target.value })
  }
  public handleChangeNewC9StopDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ stop_date_name: event.target.value })
  }
  public handleChangeNewC9KinmuIndex = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ kinmu_index: parseInt(event.target.value, 10) })
  }
  public handleClickCreateC9 = () => {
    this.setState({ open: false })
    this.props.dispatch(c9.createC9(this.state.member_index, this.state.start_date_name, this.state.stop_date_name, this.state.kinmu_index))
  }
  public render() {
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>職員の期間に割り当てる勤務</Typography>
          <Button size="small" onClick={this.handleClickOpenDialog}>追加</Button>
        </Toolbar>
        {this.props.c9.map(c => (
          <ExpansionPanel key={c.index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${this.props.members.find(member => member.index === c.member_index)!.name}の${c.start_date_name}から${c.stop_date_name}までに${this.props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}を割り当てる`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField
                select={true}
                label="職員"
                value={c.member_index}
                onChange={this.handleChangeC9MemberIndex(c.index)}
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
                onChange={this.handleChangeC9StartDateName(c.index)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={c.stop_date_name}
                onChange={this.handleChangeC9StopDateName(c.index)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_index}
                onChange={this.handleChangeC9KinmuIndex(c.index)}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleClickDeleteC9(c.index)}>削除</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
        {this.props.members.length === 0 && this.props.kinmus.length === 0 ?
          <Dialog onClose={this.handleCloseDialog} open={this.state.open} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の期間に割り当てる勤務を追加できません</DialogTitle>
            <DialogContent>
              {this.props.members.length === 0 ? <DialogContentText>職員がいません</DialogContentText> : null}
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          <Dialog onClose={this.handleCloseDialog} open={this.state.open} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の機関に割り当てる勤務の追加</DialogTitle>
            <DialogContent style={{ display: 'flex' }}>
              <TextField
                select={true}
                label="職員"
                value={this.state.member_index}
                onChange={this.handleChangeNewC9MemberIndex}
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
                onChange={this.handleChangeNewC9StartDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={this.state.stop_date_name}
                onChange={this.handleChangeNewC9StopDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={this.state.kinmu_index}
                onChange={this.handleChangeNewC9KinmuIndex}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateC9}>追加</Button>
              <Button color="primary" onClick={this.handleCloseDialog}>閉じる</Button>
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
