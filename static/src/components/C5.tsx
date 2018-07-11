import Button from '@material-ui/core/Button'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
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
import * as c5 from '../modules/c5'
import * as kinmus from '../modules/kinmus'

type Props = {
  dispatch: Dispatch
  c5: c5.C5[]
  kinmus: kinmus.Kinmu[]
}

function C5(props: Props) {
  function handleChangeC5KinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c5.updateC5KinmuIndex(index, parseInt(event.target.value, 10)))
    }
  }
  function handleChangeC5MinNumberOfDays(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c5.updateC5MinNumberOfDays(index, parseInt(event.target.value, 10)))
    }
  }
  function handleClickDeleteC5(index: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      props.dispatch(c5.deleteC5(index))
    }
  }
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">勤務の連続日数の下限</Typography>
      </Toolbar>
      {props.c5.map(c => (
        <ExpansionPanel key={c.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}の連続日数を${c.min_number_of_days}日以上にする`}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <TextField
              select={true}
              label="勤務"
              value={c.kinmu_index}
              onChange={handleChangeC5KinmuIndex(c.index)}
              fullWidth={true}
            >
              {props.kinmus.map(kinmu => (
                <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="連続日数下限"
              type="number"
              defaultValue={c.min_number_of_days}
              onChange={handleChangeC5MinNumberOfDays(c.index)}
              fullWidth={true}
            />
          </ExpansionPanelDetails>
          <ExpansionPanelActions>
            <Button size="small" onClick={handleClickDeleteC5(c.index)}>削除</Button>
          </ExpansionPanelActions>
        </ExpansionPanel>
      ))}
    </>
  )
}

function mapStateToProps(state: all.State) {
  return {
    c5: state.c5,
    kinmus: state.kinmus,
    members: state.members,
  }
}

export default connect(mapStateToProps)(C5)
