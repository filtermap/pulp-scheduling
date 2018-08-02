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
import * as constraints1 from '../modules/constraints1'
import * as constraints2 from '../modules/constraints2'
import * as group_members from '../modules/group_members'
import * as groups from '../modules/groups'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  dispatch: Dispatch
  groups: groups.Group[]
  members: members.Member[]
  group_members: group_members.GroupMember[]
  constraints1: constraints1.Constraint1[]
  constraints2: constraints2.Constraint2[]
  kinmus: kinmus.Kinmu[]
}

type State = {
  creationDialogIsOpen: boolean
  newGroupIsEnabled: boolean
  newGroupName: string
  newGroupMemberIndices: number[]
  deletionDialogIsOpen: boolean
  selectedGroupId: number
}

class Groups extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    deletionDialogIsOpen: false,
    newGroupIsEnabled: true,
    newGroupMemberIndices: [],
    newGroupName: '',
    selectedGroupId: this.props.groups.length > 0 ? this.props.groups[0].id : 0,
  }
  public handleChangeGroupIsEnabled(id: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      this.props.dispatch(groups.updateGroupIsEnabled(id, checked))
    }
  }
  public handleChangeGroupName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(groups.updateGroupName(id, event.target.value))
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
  public handleChangeNewGroupIsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newGroupIsEnabled: checked })
  }
  public handleChangeNewGroupName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newGroupName: event.target.value })
  }
  public handleChangeNewGroupMember(memberId: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (checked) {
        this.setState({ newGroupMemberIndices: this.state.newGroupMemberIndices.concat(memberId) })
        return
      }
      this.setState({ newGroupMemberIndices: this.state.newGroupMemberIndices.filter(member_id => member_id !== memberId) })
    }
  }
  public handleClickCreateGroup = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(all.createGroup(this.state.newGroupIsEnabled, this.state.newGroupName, this.state.newGroupMemberIndices))
  }
  public handleClickOpenDeletionDialog(selectedGroupId: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedGroupId,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteGroup = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(all.deleteGroup(this.state.selectedGroupId))
  }
  public render() {
    const selectedGroup = this.props.groups.find(group => group.id === this.state.selectedGroupId)
    const selectedGroupConstraints1 = this.props.constraints1.filter(c => c.group_id === this.state.selectedGroupId)
    const selectedGroupConstraints2 = this.props.constraints2.filter(c => c.group_id === this.state.selectedGroupId)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>グループ</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.groups.map(group => (
          <ExpansionPanel key={group.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <div style={{ flexDirection: 'column' }}>
                <Typography>{group.name}</Typography>
                <Typography variant="caption">{this.props.group_members.filter(group_member => group_member.group_id === group.id).map(group_member => this.props.members.find(member => member.id === group_member.member_id)!.name).join(', ')}</Typography>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={group.is_enabled}
                    onChange={this.handleChangeGroupIsEnabled(group.id)}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                label="グループ名"
                defaultValue={group.name}
                onChange={this.handleChangeGroupName(group.id)}
                fullWidth={true}
              />
              <FormControl fullWidth={true}>
                <FormLabel>グループに所属する職員</FormLabel>
                <FormGroup>
                  {this.props.members.map(member => (
                    <FormControlLabel
                      key={member.id}
                      label={member.name}
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
              <Button size="small" onClick={this.handleClickOpenDeletionDialog(group.id)}>削除</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
        <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
          <DialogTitle>グループの追加</DialogTitle>
          <DialogContent style={{ display: 'flex' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.newGroupIsEnabled}
                  onChange={this.handleChangeNewGroupIsEnabled}
                  color="primary"
                />
              }
              label="有効"
            />
            <TextField
              label="グループ名"
              defaultValue={this.state.newGroupName}
              onChange={this.handleChangeNewGroupName}
              fullWidth={true}
            />
            <FormControl fullWidth={true}>
              <FormLabel>グループに所属する職員</FormLabel>
              <FormGroup>
                {this.props.members.map(member => (
                  <FormControlLabel
                    key={member.id}
                    label={member.name}
                    control={
                      <Checkbox
                        checked={this.state.newGroupMemberIndices.some(member_id => member_id === member.id)}
                        onChange={this.handleChangeNewGroupMember(member.id)}
                        color="primary"
                      />
                    }
                  />
                ))}
              </FormGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickCreateGroup}>追加</Button>
            <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
          </DialogActions>
        </Dialog>
        {selectedGroup &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>グループの削除</DialogTitle>
            <DialogContent>
              <DialogContentText>このグループを削除します</DialogContentText>
              <Typography>{selectedGroup.name}</Typography>
              <Typography variant="caption">{this.props.group_members.filter(group_member => group_member.group_id === selectedGroup.id).map(group_member => this.props.members.find(member => member.id === group_member.member_id)!.name).join(', ')}</Typography>
              {(selectedGroupConstraints1.length > 0 || selectedGroupConstraints2.length > 0) &&
                <DialogContentText>以下の条件も削除されます</DialogContentText>}
              {selectedGroupConstraints1.map(c => <Typography key={c.id}>{`${c.start_date_name}から${c.stop_date_name}までの${this.props.kinmus.find(({ id }) => id === c.kinmu_id)!.name}に${selectedGroup.name}から${c.min_number_of_assignments}人以上の職員を割り当てる`}</Typography>)}
              {selectedGroupConstraints2.map(c => <Typography key={c.id}>{`${c.start_date_name}から${c.stop_date_name}までの${this.props.kinmus.find(({ id }) => id === c.kinmu_id)!.name}に${selectedGroup.name}から${c.max_number_of_assignments}人以下の職員を割り当てる`}</Typography>)}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteGroup}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    constraints1: state.present.constraints1,
    constraints2: state.present.constraints2,
    group_members: state.present.group_members,
    groups: state.present.groups,
    kinmus: state.present.kinmus,
    members: state.present.members,
  }
}

export default connect(mapStateToProps)(Groups)
