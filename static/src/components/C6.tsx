import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import * as all from '../modules/all'
import * as c6 from '../modules/c6'
import * as kinmus from '../modules/kinmus'

type Props = {
  c6: c6.C6[]
  kinmus: kinmus.Kinmu[]
}

function C6(props: Props) {
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">勤務の連続日数の上限</Typography>
      </Toolbar>
      {props.c6.map(c => (
        <ExpansionPanel key={c.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name},${c.max_number_of_days}`}</Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>
      ))}
    </>
  )
}

function mapStateToProps(state: all.State) {
  return {
    c6: state.c6,
    kinmus: state.kinmus
  }
}

export default connect(mapStateToProps)(C6)
