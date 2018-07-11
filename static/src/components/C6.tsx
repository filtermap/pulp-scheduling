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
import * as c6 from '../modules/c6'
import * as kinmus from '../modules/kinmus'

type Props = {
  dispatch: Dispatch
  c6: c6.C6[]
  kinmus: kinmus.Kinmu[]
}

function C6(props: Props) {
  function handleChangeC6KinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c6.updateC6KinmuIndex(index, parseInt(event.target.value, 10)))
    }
  }
  function handleChangeC6MaxNumberOfDays(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c6.updateC6MaxNumberOfDays(index, parseInt(event.target.value, 10)))
    }
  }
  function handleClickDeleteC6(index: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      props.dispatch(c6.deleteC6(index))
    }
  }
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">勤務の連続日数の上限</Typography>
      </Toolbar>
      {props.c6.map(c => (
        <ExpansionPanel key={c.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}の連続日数を${c.max_number_of_days}日以下にする`}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <TextField
              select={true}
              label="勤務"
              value={c.kinmu_index}
              onChange={handleChangeC6KinmuIndex(c.index)}
              fullWidth={true}
            >
              {props.kinmus.map(kinmu => (
                <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="連続日数上限"
              type="number"
              defaultValue={c.max_number_of_days}
              onChange={handleChangeC6MaxNumberOfDays(c.index)}
              fullWidth={true}
            />
          </ExpansionPanelDetails>
          <ExpansionPanelActions>
            <Button size="small" onClick={handleClickDeleteC6(c.index)}>削除</Button>
          </ExpansionPanelActions>
        </ExpansionPanel>
      ))}
    </>
  )
}

function mapStateToProps(state: all.State) {
  return {
    c6: state.c6,
    kinmus: state.kinmus
  }
}

export default connect(mapStateToProps)(C6)
