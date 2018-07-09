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
import * as groups from '../modules/groups'

type Props = {
  dispatch: Dispatch
  groups: groups.Group[]
}

function Groups(props: Props) {
  function handleChange(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(groups.updateGroupName(index, event.target.value))
    }
  }
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
          <ExpansionPanelDetails>
            <TextField
              label="グループ名"
              defaultValue={group.name}
              onChange={handleChange(group.index)}
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
    groups: state.groups
  }
}

export default connect(mapStateToProps)(Groups)
