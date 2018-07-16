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
import * as all from '../modules/all'
import * as c3 from '../modules/c3'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type State = {
  open: boolean
  member_index: number
  kinmu_index: number
  min_number_of_assignments: number
}

type Props = {
  dispatch: Dispatch
  c3: c3.C3[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
}

class C3 extends React.Component<Props, State> {
  public state: State = {
    kinmu_index: 0,
    member_index: 0,
    min_number_of_assignments: 0,
    open: false,
  }
  public handleChangeC3MemberIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c3.updateC3MemberIndex(index, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeC3KinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c3.updateC3KinmuIndex(index, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeC3MinNumberOfAssignments(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c3.updateC3MinNumberOfAssignments(index, parseInt(event.target.value, 10)))
    }
  }
  public handleClickDeleteC3(index: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      this.props.dispatch(c3.deleteC3(index))
    }
  }
  public handleClickOpenDialog = () => {
    const kinmu_index = this.props.kinmus.length > 0 &&
      this.props.kinmus.every(kinmu => kinmu.index !== this.state.kinmu_index) ?
      this.props.kinmus[0].index :
      this.state.kinmu_index
    const member_index = this.props.members.length > 0 &&
      this.props.members.every(member => member.index !== this.state.member_index) ?
      this.props.members[0].index :
      this.state.member_index
    this.setState({
      kinmu_index,
      member_index,
      open: true,
    })
  }
  public handleCloseDialog = () => {
    this.setState({ open: false })
  }
  public handleChangeNewC3MemberIndex = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ member_index: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC3KinmuIndex = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ kinmu_index: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC3MinNumberOfAssignments = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ min_number_of_assignments: parseInt(event.target.value, 10) })
  }
  public handleClickCreateC3 = () => {
    this.setState({ open: false })
    this.props.dispatch(c3.createC3(this.state.member_index, this.state.kinmu_index, this.state.min_number_of_assignments))
  }
  public render() {
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>職員の勤務の割り当て数の下限</Typography>
          <Button size="small" onClick={this.handleClickOpenDialog}>追加</Button>
        </Toolbar>
        {this.props.c3.map(c => (
          <ExpansionPanel key={c.index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${this.props.members.find(member => member.index === c.member_index)!.name}に${this.props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}を${c.min_number_of_assignments}回以上割り当てる`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField
                select={true}
                label="職員"
                value={c.member_index}
                onChange={this.handleChangeC3MemberIndex(c.index)}
                fullWidth={true}
              >
                {this.props.members.map(member => (
                  <MenuItem key={member.index} value={member.index}>{member.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_index}
                onChange={this.handleChangeC3KinmuIndex(c.index)}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="割り当て数下限"
                type="number"
                defaultValue={c.min_number_of_assignments}
                onChange={this.handleChangeC3MinNumberOfAssignments(c.index)}
                fullWidth={true}
              />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleClickDeleteC3(c.index)}>削除</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
        {this.props.members.length === 0 || this.props.kinmus.length === 0 ?
          <Dialog onClose={this.handleCloseDialog} open={this.state.open} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の勤務の割り当て数の下限を追加できません</DialogTitle>
            <DialogContent>
              {this.props.members.length === 0 ? <DialogContentText>職員がいません</DialogContentText> : null}
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          <Dialog onClose={this.handleCloseDialog} open={this.state.open} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の勤務の割り当て数の下限の追加</DialogTitle>
            <DialogContent style={{ display: 'flex' }}>
              <TextField
                select={true}
                label="職員"
                value={this.state.member_index}
                onChange={this.handleChangeNewC3MemberIndex}
                fullWidth={true}
              >
                {this.props.members.map(member => (
                  <MenuItem key={member.index} value={member.index}>{member.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                select={true}
                label="勤務"
                value={this.state.kinmu_index}
                onChange={this.handleChangeNewC3KinmuIndex}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="割り当て数下限"
                type="number"
                defaultValue={this.state.min_number_of_assignments}
                onChange={this.handleChangeNewC3MinNumberOfAssignments}
                fullWidth={true}
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateC3}>追加</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: all.State) {
  return {
    c3: state.c3,
    kinmus: state.kinmus,
    members: state.members,
  }
}

export default connect(mapStateToProps)(C3)
