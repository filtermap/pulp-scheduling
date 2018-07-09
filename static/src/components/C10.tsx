import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import * as all from '../modules/all'
import * as c10 from '../modules/c10'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  c10: c10.C10[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
}

function C10(props: Props) {
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">職員の日付に割り当てない勤務</Typography>
      </Toolbar>
      {props.c10.map(c => (
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
    c10: state.c10,
    kinmus: state.kinmus,
    members: state.members,
  }
}

export default connect(mapStateToProps)(C10)
