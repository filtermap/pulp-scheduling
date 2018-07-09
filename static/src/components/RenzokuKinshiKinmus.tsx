import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import * as all from '../modules/all'
import * as kinmus from '../modules/kinmus'
import * as renzoku_kinshi_kinmus from '../modules/renzoku_kinshi_kinmus'

type Props = {
  renzoku_kinshi_kinmus: renzoku_kinshi_kinmus.RenzokuKinshiKinmu[]
  kinmus: kinmus.Kinmu[]
}

function RenzokuKinshiKinmus(props: Props) {
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">連続禁止勤務並び</Typography>
      </Toolbar>
      {props.renzoku_kinshi_kinmus.map(renzoku_kinshi_kinmu => (
        <ExpansionPanel key={renzoku_kinshi_kinmu.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${renzoku_kinshi_kinmu.sequence_id},${renzoku_kinshi_kinmu.sequence_number},${props.kinmus.find(kinmu => kinmu.index === renzoku_kinshi_kinmu.kinmu_index)!.name}`}</Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>
      ))}
    </>
  )
}

function mapStateToProps(state: all.State) {
  return {
    kinmus: state.kinmus,
    renzoku_kinshi_kinmus: state.renzoku_kinshi_kinmus,
  }
}

export default connect(mapStateToProps)(RenzokuKinshiKinmus)
