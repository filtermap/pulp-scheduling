import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
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
  groups: groups.Group[]
  members: members.Member[]
  group_members: group_members.GroupMember[]
}

type State = {
  open: boolean
  name: string
  member_indices: number[]
}

class Groups extends React.Component<Props, State> {
  public state: State = {
    member_indices: [],
    name: '',
    open: false,
  }
  public handleGroupNameChange(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(groups.updateGroupName(index, event.target.value))
    }
  }
  public handleGroupMemberChange(groupIndex: number, memberIndex: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (checked) {
        this.props.dispatch(group_members.createGroupMember(groupIndex, memberIndex))
        return
      }
      this.props.dispatch(group_members.deleteGroupMember(groupIndex, memberIndex))
    }
  }
  public handleClickDeleteGroup(index: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      this.props.dispatch(all.deleteGroup(index))
    }
  }
  public handleClickOpenDialog = () => {
    this.setState({ open: true })
  }
  public handleCloseDialog = () => {
    this.setState({ open: false })
  }
  public handleChangeNewGroupName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value })
  }
  public handleNewGroupMemberChange(memberIndex: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (checked) {
        this.setState({ member_indices: this.state.member_indices.concat(memberIndex) })
        return
      }
      this.setState({ member_indices: this.state.member_indices.filter(member_index => member_index !== memberIndex) })
    }
  }
  public handleClickCreateGroup = () => {
    this.setState({ open: false })
    this.props.dispatch(all.createGroup(this.state.name, this.state.member_indices))
  }
  public render() {
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>グループ</Typography>
          <Button size="small" onClick={this.handleClickOpenDialog}>追加</Button>
        </Toolbar>
        {this.props.groups.map(group => (
          <ExpansionPanel key={group.index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <div style={{ flexDirection: 'column' }}>
                <Typography>{group.name}</Typography>
                <Typography variant="caption">{this.props.group_members.filter(group_member => group_member.group_index === group.index).map(group_member => this.props.members.find(member => member.index === group_member.member_index)!.name).join(', ')}</Typography>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField
                label="グループ名"
                defaultValue={group.name}
                onChange={this.handleGroupNameChange(group.index)}
                fullWidth={true}
              />
              <FormControl fullWidth={true}>
                <FormLabel>グループに所属する職員</FormLabel>
                <FormGroup>
                  {this.props.members.map(member => (
                    <FormControlLabel
                      key={member.index}
                      label={member.name}
                      control={
                        <Checkbox
                          checked={this.props.group_members.some(group_member => group_member.group_index === group.index && group_member.member_index === member.index)}
                          onChange={this.handleGroupMemberChange(group.index, member.index)}
                          color="primary"
                        />
                      }
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleClickDeleteGroup(group.index)}>削除</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
        <Dialog onClose={this.handleCloseDialog} open={this.state.open} fullWidth={true} maxWidth="md">
          <DialogTitle>グループの追加</DialogTitle>
          <DialogContent style={{ display: 'flex' }}>
            <TextField
              label="グループ名"
              defaultValue={this.state.name}
              onChange={this.handleChangeNewGroupName}
              fullWidth={true}
            />
            <FormControl fullWidth={true}>
              <FormLabel>グループに所属する職員</FormLabel>
              <FormGroup>
                {this.props.members.map(member => (
                  <FormControlLabel
                    key={member.index}
                    label={member.name}
                    control={
                      <Checkbox
                        checked={this.state.member_indices.some(member_index => member_index === member.index)}
                        onChange={this.handleNewGroupMemberChange(member.index)}
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
            <Button color="primary" onClick={this.handleCloseDialog}>閉じる</Button>
          </DialogActions>
        </Dialog>
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

export default connect(mapStateToProps)(Groups)
