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
import * as c8 from '../modules/c8'
import * as kinmus from '../modules/kinmus'

type Props = {
  dispatch: Dispatch
  c8: c8.C8[]
  kinmus: kinmus.Kinmu[]
}

function C8(props: Props) {
  function handleChangeC8KinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c8.updateC8KinmuIndex(index, parseInt(event.target.value, 10)))
    }
  }
  function handleChangeC8MaxNumberOfDays(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c8.updateC8MaxNumberOfDays(index, parseInt(event.target.value, 10)))
    }
  }
  function handleClickDeleteC8(index: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      props.dispatch(c8.deleteC8(index))
    }
  }
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">勤務の間隔日数の上限</Typography>
      </Toolbar>
      {props.c8.map(c => (
        <ExpansionPanel key={c.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}の間隔日数を${c.max_number_of_days}日以下にする`}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <TextField
              select={true}
              label="勤務"
              value={c.kinmu_index}
              onChange={handleChangeC8KinmuIndex(c.index)}
              fullWidth={true}
            >
              {props.kinmus.map(kinmu => (
                <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="間隔日数上限"
              type="number"
              defaultValue={c.max_number_of_days}
              onChange={handleChangeC8MaxNumberOfDays(c.index)}
              fullWidth={true}
            />
          </ExpansionPanelDetails>
          <ExpansionPanelActions>
            <Button size="small" onClick={handleClickDeleteC8(c.index)}>削除</Button>
          </ExpansionPanelActions>
        </ExpansionPanel>
      ))}
    </>
  )
}

function mapStateToProps(state: all.State) {
  return {
    c8: state.c8,
    kinmus: state.kinmus,
  }
}

export default connect(mapStateToProps)(C8)
