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
import * as c3 from '../modules/c3'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  dispatch: Dispatch
  c3: c3.C3[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
}

type State = {
  creationDialogIsOpen: boolean
  newC3MemberIndex: number
  newC3KinmuIndex: number
  newC3MinNumberOfAssignments: number
  deletionDialogIsOpen: boolean
  selectedC3Index: number
}

class C3 extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    deletionDialogIsOpen: false,
    newC3KinmuIndex: this.props.kinmus.length > 0 ? this.props.kinmus[0].index : 0,
    newC3MemberIndex: this.props.members.length > 0 ? this.props.members[0].index : 0,
    newC3MinNumberOfAssignments: 0,
    selectedC3Index: this.props.c3.length > 0 ? this.props.c3[0].index : 0,
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
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewC3MemberIndex = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC3MemberIndex: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC3KinmuIndex = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC3KinmuIndex: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC3MinNumberOfAssignments = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC3MinNumberOfAssignments: parseInt(event.target.value, 10) })
  }
  public handleClickCreateC3 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(c3.createC3(this.state.newC3MemberIndex, this.state.newC3KinmuIndex, this.state.newC3MinNumberOfAssignments))
  }
  public handleClickOpenDeletionDialog(selectedC3Index: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedC3Index,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteC3 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(c3.deleteC3(this.state.selectedC3Index))
  }
  public render() {
    const selectedC3 = this.props.c3.find(c => c.index === this.state.selectedC3Index)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>職員の勤務の割り当て数の下限</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
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
              <Button size="small" onClick={this.handleClickOpenDeletionDialog(c.index)}>削除</Button>
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
              <TextField
                select={true}
                label="職員"
                value={this.state.newC3MemberIndex}
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
                value={this.state.newC3KinmuIndex}
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
                defaultValue={this.state.newC3MinNumberOfAssignments}
                onChange={this.handleChangeNewC3MinNumberOfAssignments}
                fullWidth={true}
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateC3}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selectedC3 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の勤務の割り当て数の下限の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この職員の勤務の割り当て数の下限を削除します</DialogContentText>
              <Typography>{`${this.props.members.find(member => member.index === selectedC3.member_index)!.name}に${this.props.kinmus.find(kinmu => kinmu.index === selectedC3.kinmu_index)!.name}を${selectedC3.min_number_of_assignments}回以上割り当てる`}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteC3}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    c3: state.present.c3,
    kinmus: state.present.kinmus,
    members: state.present.members,
  }
}

export default connect(mapStateToProps)(C3)
