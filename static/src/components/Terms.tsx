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
import { StateWithHistory } from 'redux-undo'
import * as all from '../modules/all'
import * as terms from '../modules/terms'

type Props = {
  dispatch: Dispatch
  terms: terms.Term[]
}

function Terms(props: Props) {
  function handleChangeTermStartDateName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(terms.updateTermStartDateName(id, event.target.value))
    }
  }
  function handleChangeTermStopDateName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(terms.updateTermStopDateName(id, event.target.value))
    }
  }
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">期間</Typography>
      </Toolbar>
      {props.terms.map(term => (
        <ExpansionPanel key={term.id}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${term.start_date_name},${term.stop_date_name}`}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <TextField
              label="開始日"
              type="date"
              defaultValue={term.start_date_name}
              onChange={handleChangeTermStartDateName(term.id)}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="終了日"
              type="date"
              defaultValue={term.stop_date_name}
              onChange={handleChangeTermStopDateName(term.id)}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </>
  )
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    terms: state.present.terms
  }
}

export default connect(mapStateToProps)(Terms)
