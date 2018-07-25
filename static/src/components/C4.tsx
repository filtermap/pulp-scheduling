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
  newC4MemberIndex: number
  newC4KinmuIndex: number
  newC4MaxNumberOfAssignments: number
  deletionDialogIsOpen: boolean
  selectedC4Index: number
}

class C4 extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    deletionDialogIsOpen: false,
    newC4KinmuIndex: this.props.kinmus.length > 0 ? this.props.kinmus[0].index : 0,
    newC4MaxNumberOfAssignments: 0,
    newC4MemberIndex: this.props.members.length > 0 ? this.props.members[0].index : 0,
    selectedC4Index: this.props.c4.length > 0 ? this.props.c4[0].index : 0,
  }
  public handleChangeC4MemberIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c4.updateC4MemberIndex(index, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeC4KinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c4.updateC4KinmuIndex(index, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeC4MaxNumberOfAssignments(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c4.updateC4MaxNumberOfAssignments(index, parseInt(event.target.value, 10)))
    }
  }
  public handleClickOpenDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewC4MemberIndex = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC4MemberIndex: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC4KinmuIndex = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC4KinmuIndex: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC4MaxNumberOfAssignments = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC4MaxNumberOfAssignments: parseInt(event.target.value, 10) })
  }
  public handleClickCreateC4 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(c4.createC4(this.state.newC4MemberIndex, this.state.newC4KinmuIndex, this.state.newC4MaxNumberOfAssignments))
  }
  public handleClickOpenDeletionDialog(selectedC4Index: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedC4Index,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteC4 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(c4.deleteC4(this.state.selectedC4Index))
  }
  public render() {
    const selectedC4 = this.props.c4.find(c => c.index === this.state.selectedC4Index)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>職員の勤務の割り当て数の上限</Typography>
          <Button size="small" onClick={this.handleClickOpenDialog}>追加</Button>
        </Toolbar>
        {this.props.c4.map(c => (
          <ExpansionPanel key={c.index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${this.props.members.find(member => member.index === c.member_index)!.name}に${this.props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}を${c.max_number_of_assignments}回以下割り当てる`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField
                select={true}
                label="職員"
                value={c.member_index}
                onChange={this.handleChangeC4MemberIndex(c.index)}
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
                onChange={this.handleChangeC4KinmuIndex(c.index)}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="割り当て数上限"
                type="number"
                defaultValue={c.max_number_of_assignments}
                onChange={this.handleChangeC4MaxNumberOfAssignments(c.index)}
                fullWidth={true}
              />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleClickOpenDeletionDialog(c.index)}>削除</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
        {this.props.members.length === 0 || this.props.kinmus.length === 0 ?
          <Dialog onClose={this.handleCloseDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の勤務の割り当て数の上限を追加できません</DialogTitle>
            <DialogContent>
              {this.props.members.length === 0 ? <DialogContentText>職員がいません</DialogContentText> : null}
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          <Dialog onClose={this.handleCloseDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の勤務の割り当て数の上限の追加</DialogTitle>
            <DialogContent style={{ display: 'flex' }}>
              <TextField
                select={true}
                label="職員"
                value={this.state.newC4MemberIndex}
                onChange={this.handleChangeNewC4MemberIndex}
                fullWidth={true}
              >
                {this.props.members.map(member => (
                  <MenuItem key={member.index} value={member.index}>{member.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                select={true}
                label="勤務"
                value={this.state.newC4KinmuIndex}
                onChange={this.handleChangeNewC4KinmuIndex}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
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
              <Button color="primary" onClick={this.handleCloseDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selectedC4 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の勤務の割り当て数の上限の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この職員の勤務の割り当て数の上限を削除します</DialogContentText>
              <Typography>{`${this.props.members.find(member => member.index === selectedC4.member_index)!.name}に${this.props.kinmus.find(kinmu => kinmu.index === selectedC4.kinmu_index)!.name}を${selectedC4.max_number_of_assignments}回以下割り当てる`}</Typography>
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
