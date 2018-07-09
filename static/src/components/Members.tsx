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
import * as members from '../modules/members'

type Props = {
  dispatch: Dispatch
  members: members.Member[]
}

function Members(props: Props) {
  function handleChange(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(members.updateMemberName(index, event.target.value))
    }
  }
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">職員</Typography>
      </Toolbar>
      {props.members.map(member => (
        <ExpansionPanel key={member.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{member.name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <TextField
              label="職員名"
              defaultValue={member.name}
              onChange={handleChange(member.index)}
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
    members: state.members
  }
}

export default connect(mapStateToProps)(Members)
