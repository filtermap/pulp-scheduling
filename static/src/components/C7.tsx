import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import * as all from '../modules/all'
import * as c7 from '../modules/c7'
import * as kinmus from '../modules/kinmus'

type Props = {
  dispatch: Dispatch
  c7: c7.C7[]
  kinmus: kinmus.Kinmu[]
}

function C7(props: Props) {
  function handleChangeC7KinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c7.updateC7KinmuIndex(index, parseInt(event.target.value, 10)))
    }
  }
  function handleChangeC7MinNumberOfDays(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c7.updateC7MinNumberOfDays(index, parseInt(event.target.value, 10)))
    }
  }
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">勤務の間隔日数の下限</Typography>
      </Toolbar>
      {props.c7.map(c => (
        <ExpansionPanel key={c.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}の間隔日数を${c.min_number_of_days}日以上にする`}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <TextField
              select={true}
              label="勤務"
              value={c.kinmu_index}
              onChange={handleChangeC7KinmuIndex(c.index)}
              fullWidth={true}
            >
              {props.kinmus.map(kinmu => (
                <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="間隔日数下限"
              type="number"
              defaultValue={c.min_number_of_days}
              onChange={handleChangeC7MinNumberOfDays(c.index)}
              fullWidth={true}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </>
  )
}

function mapStateToProps(state: all.State) {
  return {
    c7: state.c7,
    kinmus: state.kinmus
  }
}

export default connect(mapStateToProps)(C7)
