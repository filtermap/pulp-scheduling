import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import * as all from '../modules/all'
import * as terms from '../modules/terms'

type Props = {
  terms: terms.Term[]
}

function Terms(props: Props) {
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">期間</Typography>
      </Toolbar>
      {props.terms.map(term => (
        <ExpansionPanel key={term.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${term.start_date_name},${term.stop_date_name}`}</Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>
      ))}
    </>
  )
}

function mapStateToProps(state: all.State) {
  return {
    terms: state.terms
  }
}

export default connect(mapStateToProps)(Terms)
