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
import * as group_members from '../modules/group_members'
import * as groups from '../modules/groups'
import * as members from '../modules/members'

type Props = {
  dispatch: Dispatch
  members: members.Member[]
  groups: groups.Group[]
  group_members: group_members.GroupMember[]
}

type State = {
  creationDialogIsOpen: boolean
  newMemberName: string
  newMemberGroupIndices: number[]
  deletionDialogIsOpen: boolean
  selectedMemberIndex: number
}

class Members extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    deletionDialogIsOpen: false,
    newMemberGroupIndices: [],
    newMemberName: '',
    selectedMemberIndex: this.props.members.length > 0 ? this.props.members[0].index : 0,
  }
  public handleChangeMemberName(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(members.updateMemberName(index, event.target.value))
    }
  }
  public handleChangeGroupMember(groupIndex: number, memberIndex: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (checked) {
        this.props.dispatch(group_members.createGroupMember(groupIndex, memberIndex))
        return
      }
      this.props.dispatch(group_members.deleteGroupMember(groupIndex, memberIndex))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewMemberName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newMemberName: event.target.value })
  }
  public handleChangeNewGroupMember(groupIndex: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (checked) {
        this.setState({ newMemberGroupIndices: this.state.newMemberGroupIndices.concat(groupIndex) })
        return
      }
      this.setState({ newMemberGroupIndices: this.state.newMemberGroupIndices.filter(group_index => group_index !== groupIndex) })
    }
  }
  public handleClickCreateMember = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(all.createMember(this.state.newMemberName, this.state.newMemberGroupIndices))
  }
  public handleClickOpenDeletionDialog(selectedMemberIndex: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedMemberIndex,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteMember = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(all.deleteMember(this.state.selectedMemberIndex))
  }
  public render() {
    const selectedMember = this.props.members.find(member => member.index === this.state.selectedMemberIndex)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>職員</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.members.map(member => (
          <ExpansionPanel key={member.index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <div style={{ flexDirection: 'column' }}>
                <Typography>{member.name}</Typography>
                <Typography variant="caption">{this.props.group_members.filter(group_member => group_member.member_index === member.index).map(group_member => this.props.groups.find(group => group.index === group_member.group_index)!.name).join(', ')}</Typography>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField
                label="職員名"
                defaultValue={member.name}
                onChange={this.handleChangeMemberName(member.index)}
                fullWidth={true}
              />
              <FormControl fullWidth={true}>
                <FormLabel>職員が所属するグループ</FormLabel>
                <FormGroup>
                  {this.props.groups.map(group => (
                    <FormControlLabel
                      key={group.index}
                      label={group.name}
                      control={
                        <Checkbox
                          checked={this.props.group_members.some(group_member => group_member.group_index === group.index && group_member.member_index === member.index)}
                          onChange={this.handleChangeGroupMember(group.index, member.index)}
                          color="primary"
                        />
                      }
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleClickOpenDeletionDialog(member.index)}>削除</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
        <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
          <DialogTitle>職員の追加</DialogTitle>
          <DialogContent style={{ display: 'flex' }}>
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
                    key={group.index}
                    label={group.name}
                    control={
                      <Checkbox
                        checked={this.state.newMemberGroupIndices.some(group_index => group_index === group.index)}
                        onChange={this.handleChangeNewGroupMember(group.index)}
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
              <Typography variant="caption">{this.props.group_members.filter(group_member => group_member.member_index === selectedMember.index).map(group_member => this.props.groups.find(group => group.index === group_member.group_index)!.name).join(', ')}</Typography>
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
    group_members: state.present.group_members,
    groups: state.present.groups,
    members: state.present.members,
  }
}

export default connect(mapStateToProps)(Members)
