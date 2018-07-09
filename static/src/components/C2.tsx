import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import * as all from '../modules/all'
import * as c2 from '../modules/c2'
import * as groups from '../modules/groups'
import * as kinmus from '../modules/kinmus'

type Props = {
  c2: c2.C2[]
  kinmus: kinmus.Kinmu[]
  groups: groups.Group[]
}

function C2(props: Props) {
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">期間の勤務にグループから割り当てる職員数の上限</Typography>
      </Toolbar>
      {props.c2.map(c => (
        <ExpansionPanel key={c.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${c.start_date_name},${c.stop_date_name},${props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name},${props.groups.find(group => group.index === c.group_index)!.name},${c.max_number_of_assignments}`}</Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>
      ))}
    </>
  )
}

function mapStateToProps(state: all.State) {
  return {
    c2: state.c2,
    groups: state.groups,
    kinmus: state.kinmus,
  }
}

export default connect(mapStateToProps)(C2)
