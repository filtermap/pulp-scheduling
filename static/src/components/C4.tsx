import ExpansionPanel from '@material-ui/core/ExpansionPanel'
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
import * as c4 from '../modules/c4'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  dispatch: Dispatch
  c4: c4.C4[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
}

function C4(props: Props) {
  function handleChangeC4MemberIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c4.updateC4MemberIndex(index, parseInt(event.target.value, 10)))
    }
  }
  function handleChangeC4KinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c4.updateC4KinmuIndex(index, parseInt(event.target.value, 10)))
    }
  }
  function handleChangeC4MaxNumberOfAssignments(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c4.updateC4MaxNumberOfAssignments(index, parseInt(event.target.value, 10)))
    }
  }
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">職員の勤務の割り当て数の上限</Typography>
      </Toolbar>
      {props.c4.map(c => (
        <ExpansionPanel key={c.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${props.members.find(member => member.index === c.member_index)!.name}に${props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}を${c.max_number_of_assignments}回以下割り当てる`}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <TextField
              select={true}
              label="職員"
              value={c.member_index}
              onChange={handleChangeC4MemberIndex(c.index)}
              fullWidth={true}
            >
              {props.members.map(member => (
                <MenuItem key={member.index} value={member.index}>{member.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              select={true}
              label="勤務"
              value={c.kinmu_index}
              onChange={handleChangeC4KinmuIndex(c.index)}
              fullWidth={true}
            >
              {props.kinmus.map(kinmu => (
                <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="割り当て数上限"
              type="number"
              defaultValue={c.max_number_of_assignments}
              onChange={handleChangeC4MaxNumberOfAssignments(c.index)}
              fullWidth={true}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </>
  )
}

function mapStateToProps(state: all.State) {
  return {
    c4: state.c4,
    kinmus: state.kinmus,
    members: state.members,
  }
}

export default connect(mapStateToProps)(C4)
