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
import * as c9 from '../modules/c9'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  dispatch: Dispatch
  c9: c9.C9[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
}

function C9(props: Props) {
  function handleChangeC9MemberIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c9.updateC9MemberIndex(index, parseInt(event.target.value, 10)))
    }
  }
  function handleChangeC9StartDateName(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c9.updateC9StartDateName(index, event.target.value))
    }
  }
  function handleChangeC9StopDateName(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c9.updateC9StopDateName(index, event.target.value))
    }
  }
  function handleChangeC9KinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c9.updateC9KinmuIndex(index, parseInt(event.target.value, 10)))
    }
  }
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">職員の期間に割り当てる勤務</Typography>
      </Toolbar>
      {props.c9.map(c => (
        <ExpansionPanel key={c.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${props.members.find(member => member.index === c.member_index)!.name}の${c.start_date_name}から${c.stop_date_name}までに${props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}を割り当てる`}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <TextField
              select={true}
              label="職員"
              value={c.member_index}
              onChange={handleChangeC9MemberIndex(c.index)}
              fullWidth={true}
            >
              {props.members.map(member => (
                <MenuItem key={member.index} value={member.index}>{member.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="開始日"
              defaultValue={c.start_date_name}
              onChange={handleChangeC9StartDateName(c.index)}
              fullWidth={true}
            />
            <TextField
              label="終了日"
              defaultValue={c.stop_date_name}
              onChange={handleChangeC9StopDateName(c.index)}
              fullWidth={true}
            />
            <TextField
              select={true}
              label="勤務"
              value={c.kinmu_index}
              onChange={handleChangeC9KinmuIndex(c.index)}
              fullWidth={true}
            >
              {props.kinmus.map(kinmu => (
                <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
              ))}
            </TextField>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </>
  )
}

function mapStateToProps(state: all.State) {
  return {
    c9: state.c9,
    kinmus: state.kinmus,
    members: state.members,
  }
}

export default connect(mapStateToProps)(C9)
