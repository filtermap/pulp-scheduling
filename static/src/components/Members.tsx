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
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { StateWithHistory } from 'redux-undo'
import * as all from '../modules/all'
import * as assignments from '../modules/assignments'
import * as c10 from '../modules/c10'
import * as c3 from '../modules/c3'
import * as c4 from '../modules/c4'
import * as c9 from '../modules/c9'
import * as group_members from '../modules/group_members'
import * as groups from '../modules/groups'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  dispatch: Dispatch
  members: members.Member[]
  groups: groups.Group[]
  group_members: group_members.GroupMember[]
  assignments: assignments.Assignment[]
  c3: c3.C3[]
  c4: c4.C4[]
  c9: c9.C9[]
  c10: c10.C10[]
  kinmus: kinmus.Kinmu[]
}

type State = {
  creationDialogIsOpen: boolean
  newMemberIsEnabled: boolean
  newMemberName: string
  newMemberGroupIndices: number[]
  deletionDialogIsOpen: boolean
  selectedMemberId: number
}

class Members extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    deletionDialogIsOpen: false,
    newMemberGroupIndices: [],
    newMemberIsEnabled: true,
    newMemberName: '',
    selectedMemberId: this.props.members.length > 0 ? this.props.members[0].id : 0,
  }
  public handleChangeMemberIsEnabled(id: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      this.props.dispatch(members.updateMemberIsEnabled(id, checked))
    }
  }
  public handleChangeMemberName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(members.updateMemberName(id, event.target.value))
    }
  }
  public handleChangeGroupMember(groupId: number, memberId: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (checked) {
        this.props.dispatch(group_members.createGroupMember(groupId, memberId))
        return
      }
      this.props.dispatch(group_members.deleteGroupMember(groupId, memberId))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewMemberIsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newMemberIsEnabled: checked })
  }
  public handleChangeNewMemberName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newMemberName: event.target.value })
  }
  public handleChangeNewGroupMember(groupId: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (checked) {
        this.setState({ newMemberGroupIndices: this.state.newMemberGroupIndices.concat(groupId) })
        return
      }
      this.setState({ newMemberGroupIndices: this.state.newMemberGroupIndices.filter(group_id => group_id !== groupId) })
    }
  }
  public handleClickCreateMember = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(all.createMember(this.state.newMemberIsEnabled, this.state.newMemberName, this.state.newMemberGroupIndices))
  }
  public handleClickOpenDeletionDialog(selectedMemberId: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedMemberId,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteMember = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(all.deleteMember(this.state.selectedMemberId))
  }
  public render() {
    const selectedMember = this.props.members.find(member => member.id === this.state.selectedMemberId)
    const selectedMemberRosterIds = Array.from(new Set(this.props.assignments.filter(assignment => assignment.member_id === this.state.selectedMemberId).map(({ roster_id }) => roster_id)))
    const selectedMemberC3 = this.props.c3.filter(c => c.member_id === this.state.selectedMemberId)
    const selectedMemberC4 = this.props.c4.filter(c => c.member_id === this.state.selectedMemberId)
    const selectedMemberC9 = this.props.c9.filter(c => c.member_id === this.state.selectedMemberId)
    const selectedMemberC10 = this.props.c10.filter(c => c.member_id === this.state.selectedMemberId)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>職員</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.members.map(member => (
          <ExpansionPanel key={member.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <div style={{ flexDirection: 'column' }}>
                <Typography>{member.name}</Typography>
                <Typography variant="caption">{this.props.group_members.filter(group_member => group_member.member_id === member.id).map(group_member => this.props.groups.find(group => group.id === group_member.group_id)!.name).join(', ')}</Typography>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={member.is_enabled}
                    onChange={this.handleChangeMemberIsEnabled(member.id)}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                label="職員名"
                defaultValue={member.name}
                onChange={this.handleChangeMemberName(member.id)}
                fullWidth={true}
              />
              <FormControl fullWidth={true}>
                <FormLabel>職員が所属するグループ</FormLabel>
                <FormGroup>
                  {this.props.groups.map(group => (
                    <FormControlLabel
                      key={group.id}
                      label={group.name}
                      control={
                        <Checkbox
                          checked={this.props.group_members.some(group_member => group_member.group_id === group.id && group_member.member_id === member.id)}
                          onChange={this.handleChangeGroupMember(group.id, member.id)}
                          color="primary"
                        />
                      }
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleClickOpenDeletionDialog(member.id)}>削除</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
        <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
          <DialogTitle>職員の追加</DialogTitle>
          <DialogContent style={{ display: 'flex' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.newMemberIsEnabled}
                  onChange={this.handleChangeNewMemberIsEnabled}
                  color="primary"
                />
              }
              label="有効"
            />
            <TextField
              label="職員名"
              defaultValue={this.state.newMemberName}
              onChange={this.handleChangeNewMemberName}
              fullWidth={true}
            />
            <FormControl fullWidth={true}>
              <FormLabel>職員が所属するグループ</FormLabel>
              <FormGroup>
                {this.props.groups.map(group => (
                  <FormControlLabel
                    key={group.id}
                    label={group.name}
                    control={
                      <Checkbox
                        checked={this.state.newMemberGroupIndices.some(group_id => group_id === group.id)}
                        onChange={this.handleChangeNewGroupMember(group.id)}
                        color="primary"
                      />
                    }
                  />
                ))}
              </FormGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickCreateMember}>追加</Button>
            <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
          </DialogActions>
        </Dialog>
        {selectedMember &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この職員を削除します</DialogContentText>
              <Typography>{selectedMember.name}</Typography>
              <Typography variant="caption">{this.props.group_members.filter(group_member => group_member.member_id === selectedMember.id).map(group_member => this.props.groups.find(group => group.id === group_member.group_id)!.name).join(', ')}</Typography>
              {selectedMemberRosterIds.length > 0 && <DialogContentText>以下の勤務表の割り当ても削除されます</DialogContentText>}
              {selectedMemberRosterIds.map(roster_id => <Typography key={roster_id}>{`勤務表${roster_id}`}</Typography>)}
              {(selectedMemberC3.length > 0 || selectedMemberC4.length > 0 || selectedMemberC9.length > 0 || selectedMemberC10.length > 0) &&
                <DialogContentText>以下の条件も削除されます</DialogContentText>}
              {selectedMemberC3.map(c => <Typography key={c.id}>{`${selectedMember.name}に${this.props.kinmus.find(kinmu => kinmu.id === c.kinmu_id)!.name}を${c.min_number_of_assignments}回以上割り当てる`}</Typography>)}
              {selectedMemberC4.map(c => <Typography key={c.id}>{`${selectedMember.name}に${this.props.kinmus.find(kinmu => kinmu.id === c.kinmu_id)!.name}を${c.max_number_of_assignments}回以下割り当てる`}</Typography>)}
              {selectedMemberC9.map(c => <Typography key={c.id}>{`${selectedMember.name}の${c.start_date_name}から${c.stop_date_name}までに${this.props.kinmus.find(kinmu => kinmu.id === c.kinmu_id)!.name}を割り当てる`}</Typography>)}
              {selectedMemberC10.map(c => <Typography key={c.id}>{`${selectedMember.name}の${c.start_date_name}から${c.stop_date_name}までに${this.props.kinmus.find(kinmu => kinmu.id === c.kinmu_id)!.name}を割り当てない`}</Typography>)}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteMember}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    assignments: state.present.assignments,
    c10: state.present.c10,
    c3: state.present.c3,
    c4: state.present.c4,
    c9: state.present.c9,
    group_members: state.present.group_members,
    groups: state.present.groups,
    kinmus: state.present.kinmus,
    members: state.present.members,
  }
}

export default connect(mapStateToProps)(Members)
