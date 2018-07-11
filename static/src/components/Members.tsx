import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
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

function Members(props: Props) {
  function handleMemberNameChange(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(members.updateMemberName(index, event.target.value))
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
  function handleClickDeleteMember(index: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      props.dispatch(all.deleteMember(index))
    }
  }
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">職員</Typography>
      </Toolbar>
      {props.members.map(member => (
        <ExpansionPanel key={member.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <div style={{ flexDirection: 'column' }}>
              <Typography>{member.name}</Typography>
              <Typography variant="caption">{props.group_members.filter(group_member => group_member.member_index === member.index).map(group_member => props.groups.find(group => group.index === group_member.group_index)!.name).join(', ')}</Typography>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <TextField
              label="職員名"
              defaultValue={member.name}
              onChange={handleMemberNameChange(member.index)}
              fullWidth={true}
            />
            <FormControl fullWidth={true}>
              <FormLabel>職員が所属するグループ</FormLabel>
              <FormGroup>
                {props.groups.map(group => (
                  <FormControlLabel
                    key={group.index}
                    label={group.name}
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
          <ExpansionPanelActions>
            <Button size="small" onClick={handleClickDeleteMember(member.index)}>削除</Button>
          </ExpansionPanelActions>
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

export default connect(mapStateToProps)(Members)
