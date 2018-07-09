import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import * as all from '../modules/all'
import * as c9 from '../modules/c9'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  c9: c9.C9[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
}

function C9(props: Props) {
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">職員の日付に割り当てる勤務</Typography>
      </Toolbar>
      {props.c9.map(c => (
        <ExpansionPanel key={c.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${props.members.find(member => member.index === c.member_index)!.name},${c.start_date_name},${c.stop_date_name},${props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}`}</Typography>
          </ExpansionPanelSummary>
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
