import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import * as all from '../modules/all'
import * as kinmus from '../modules/kinmus'

type Props = {
  dispatch: Dispatch
  kinmus: kinmus.Kinmu[]
}

function Kinmus(props: Props) {
  function handleChange(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(kinmus.updateKinmuName(index, event.target.value))
    }
  }
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
          <ExpansionPanelDetails>
            <TextField
              label="勤務名"
              defaultValue={kinmu.name}
              onChange={handleChange(kinmu.index)}
              margin="normal"
            />
          </ExpansionPanelDetails>
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
