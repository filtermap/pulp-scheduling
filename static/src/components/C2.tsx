import Button from '@material-ui/core/Button'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import MenuItem from '../../node_modules/@material-ui/core/MenuItem'
import * as all from '../modules/all'
import * as c2 from '../modules/c2'
import * as groups from '../modules/groups'
import * as kinmus from '../modules/kinmus'

type Props = {
  dispatch: Dispatch
  c2: c2.C2[]
  kinmus: kinmus.Kinmu[]
  groups: groups.Group[]
}

function C2(props: Props) {
  function handleChangeC2StartDateName(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c2.updateC2StartDateName(index, event.target.value))
    }
  }
  function handleChangeC2StopDateName(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c2.updateC2StopDateName(index, event.target.value))
    }
  }
  function handleChangeC2KinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c2.updateC2KinmuIndex(index, parseInt(event.target.value, 10)))
    }
  }
  function handleChangeC2GroupIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c2.updateC2GroupIndex(index, parseInt(event.target.value, 10)))
    }
  }
  function handleChangeC2MaxNumberOfAssignments(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c2.updateC2MaxNumberOfAssignments(index, parseInt(event.target.value, 10)))
    }
  }
  function handleClickDeleteC2(index: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      props.dispatch(c2.deleteC2(index))
    }
  }
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">期間の勤務にグループから割り当てる職員数の上限</Typography>
      </Toolbar>
      {props.c2.map(c => (
        <ExpansionPanel key={c.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${c.start_date_name}から${c.stop_date_name}までの${props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}に${props.groups.find(group => group.index === c.group_index)!.name}から${c.max_number_of_assignments}人以下の職員を割り当てる`}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <TextField
              label="開始日"
              defaultValue={c.start_date_name}
              onChange={handleChangeC2StartDateName(c.index)}
              fullWidth={true}
            />
            <TextField
              label="終了日"
              defaultValue={c.stop_date_name}
              onChange={handleChangeC2StopDateName(c.index)}
              fullWidth={true}
            />
            <TextField
              select={true}
              label="勤務"
              value={c.kinmu_index}
              onChange={handleChangeC2KinmuIndex(c.index)}
              fullWidth={true}
            >
              {props.kinmus.map(kinmu => (
                <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              select={true}
              label="グループ"
              value={c.group_index}
              onChange={handleChangeC2GroupIndex(c.index)}
              fullWidth={true}
            >
              {props.groups.map(group => (
                <MenuItem key={group.index} value={group.index}>{group.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="割り当て職員数上限"
              type="number"
              defaultValue={c.max_number_of_assignments}
              onChange={handleChangeC2MaxNumberOfAssignments(c.index)}
              fullWidth={true}
            />
          </ExpansionPanelDetails>
          <ExpansionPanelActions>
            <Button size="small" onClick={handleClickDeleteC2(c.index)}>削除</Button>
          </ExpansionPanelActions>
        </ExpansionPanel>
      ))}
    </>
  )
}

function mapStateToProps(state: all.State) {
  return {
    c2: state.c2,
    groups: state.groups,
    kinmus: state.kinmus,
  }
}

export default connect(mapStateToProps)(C2)
