import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import * as all from '../modules/all'
import * as c3 from '../modules/c3'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  c3: c3.C3[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
}

function C3(props: Props) {
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">職員の勤務の割り当て数の下限</Typography>
      </Toolbar>
      {props.c3.map(c => (
        <ExpansionPanel key={c.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${props.members.find(member => member.index === c.member_index)!.name},${props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name},${c.min_number_of_assignments}`}</Typography>
          </ExpansionPanelSummary>
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
