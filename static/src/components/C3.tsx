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
import * as c3 from '../modules/c3'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  dispatch: Dispatch
  c3: c3.C3[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
}

function C3(props: Props) {
  function handleChangeC3MemberIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c3.updateC3MemberIndex(index, parseInt(event.target.value, 10)))
    }
  }
  function handleChangeC3KinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c3.updateC3KinmuIndex(index, parseInt(event.target.value, 10)))
    }
  }
  function handleChangeC3MinNumberOfAssignments(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c3.updateC3MinNumberOfAssignments(index, parseInt(event.target.value, 10)))
    }
  }
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">職員の勤務の割り当て数の下限</Typography>
      </Toolbar>
      {props.c3.map(c => (
        <ExpansionPanel key={c.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${props.members.find(member => member.index === c.member_index)!.name}に${props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}を${c.min_number_of_assignments}回以上割り当てる`}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <TextField
              select={true}
              label="職員"
              value={c.member_index}
              onChange={handleChangeC3MemberIndex(c.index)}
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
              onChange={handleChangeC3KinmuIndex(c.index)}
              fullWidth={true}
            >
              {props.kinmus.map(kinmu => (
                <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="割り当て数下限"
              type="number"
              defaultValue={c.min_number_of_assignments}
              onChange={handleChangeC3MinNumberOfAssignments(c.index)}
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
    c3: state.c3,
    kinmus: state.kinmus,
    members: state.members,
  }
}

export default connect(mapStateToProps)(C3)
