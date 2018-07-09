import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import * as all from '../modules/all'
import * as groups from '../modules/groups'

type Props = {
  groups: groups.Group[]
}

function Groups(props: Props) {
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">グループ</Typography>
      </Toolbar>
      {props.groups.map(group => (
        <ExpansionPanel key={group.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{group.name}</Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>
      ))}
    </>
  )
}

function mapStateToProps(state: all.State) {
  return {
    groups: state.groups
  }
}

export default connect(mapStateToProps)(Groups)
