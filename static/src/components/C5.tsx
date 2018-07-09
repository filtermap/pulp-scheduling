import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import * as all from '../modules/all'
import * as c5 from '../modules/c5'
import * as kinmus from '../modules/kinmus'

type Props = {
  c5: c5.C5[]
  kinmus: kinmus.Kinmu[]
}

function C5(props: Props) {
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">勤務の連続日数の下限</Typography>
      </Toolbar>
      {props.c5.map(c => (
        <ExpansionPanel key={c.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name},${c.min_number_of_days}`}</Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>
      ))}
    </>
  )
}

function mapStateToProps(state: all.State) {
  return {
    c5: state.c5,
    kinmus: state.kinmus,
    members: state.members,
  }
}

export default connect(mapStateToProps)(C5)
