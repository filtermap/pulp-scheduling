import Checkbox from '@material-ui/core/Checkbox'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
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

function Groups(props: Props) {
  function handleGroupNameChange(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(groups.updateGroupName(index, event.target.value))
    }
  }
  function handleGroupMemberChange(groupIndex: number, memberIndex: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (checked) {
        props.dispatch(group_members.createGroupMember(groupIndex, memberIndex))
        return
      }
      props.dispatch(group_members.deleteGroupMember(groupIndex, memberIndex))
    }
  }
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">グループ</Typography>
      </Toolbar>
      {props.groups.map(group => (
        <ExpansionPanel key={group.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <div style={{ flexDirection: 'column' }}>
              <Typography>{group.name}</Typography>
              <Typography variant="caption">{props.group_members.filter(group_member => group_member.group_index === group.index).map(group_member => props.members.find(member => member.index === group_member.member_index)!.name).join(', ')}</Typography>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <TextField
              label="グループ名"
              defaultValue={group.name}
              onChange={handleGroupNameChange(group.index)}
              fullWidth={true}
            />
            <FormControl fullWidth={true}>
              <FormLabel>グループに所属する職員</FormLabel>
              <FormGroup>
                {props.members.map(member => (
                  <FormControlLabel
                    key={member.index}
                    label={member.name}
                    control={
                      <Checkbox
                        checked={props.group_members.some(group_member => group_member.group_index === group.index && group_member.member_index === member.index)}
                        onChange={handleGroupMemberChange(group.index, member.index)}
                        color="primary"
                      />
                    }
                  />
                ))}
              </FormGroup>
            </FormControl>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </>
  )
}

function mapStateToProps(state: all.State) {
  return {
    group_members: state.group_members,
    groups: state.groups,
    members: state.members,
  }
}

export default connect(mapStateToProps)(Groups)
