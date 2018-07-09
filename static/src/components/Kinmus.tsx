import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import * as all from '../modules/all'
import * as kinmus from '../modules/kinmus'

type Props = {
  kinmus: kinmus.Kinmu[]
}

function Kinmus(props: Props) {
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">勤務</Typography>
      </Toolbar>
      {props.kinmus.map(kinmu => (
        <ExpansionPanel key={kinmu.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{kinmu.name}</Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>
      ))}
    </>
  )
}

function mapStateToProps(state: all.State) {
  return {
    kinmus: state.kinmus
  }
}

export default connect(mapStateToProps)(Kinmus)
