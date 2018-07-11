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
import * as c1 from '../modules/c1'
import * as groups from '../modules/groups'
import * as kinmus from '../modules/kinmus'

type Props = {
  dispatch: Dispatch
  c1: c1.C1[]
  kinmus: kinmus.Kinmu[]
  groups: groups.Group[]
}

function C1(props: Props) {
  function handleChangeC1StartDateName(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c1.updateC1StartDateName(index, event.target.value))
    }
  }
  function handleChangeC1StopDateName(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c1.updateC1StopDateName(index, event.target.value))
    }
  }
  function handleChangeC1KinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c1.updateC1KinmuIndex(index, parseInt(event.target.value, 10)))
    }
  }
  function handleChangeC1GroupIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c1.updateC1GroupIndex(index, parseInt(event.target.value, 10)))
    }
  }
  function handleChangeC1MinNumberOfAssignments(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(c1.updateC1MinNumberOfAssignments(index, parseInt(event.target.value, 10)))
    }
  }
  function handleClickDeleteC1(index: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      props.dispatch(c1.deleteC1(index))
    }
  }
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">期間の勤務にグループから割り当てる職員数の下限</Typography>
      </Toolbar>
      {props.c1.map(c => (
        <ExpansionPanel key={c.index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${c.start_date_name}から${c.stop_date_name}までの${props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}に${props.groups.find(group => group.index === c.group_index)!.name}から${c.min_number_of_assignments}人以上の職員を割り当てる`}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <TextField
              label="開始日"
              defaultValue={c.start_date_name}
              onChange={handleChangeC1StartDateName(c.index)}
              fullWidth={true}
            />
            <TextField
              label="終了日"
              defaultValue={c.stop_date_name}
              onChange={handleChangeC1StopDateName(c.index)}
              fullWidth={true}
            />
            <TextField
              select={true}
              label="勤務"
              value={c.kinmu_index}
              onChange={handleChangeC1KinmuIndex(c.index)}
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
              onChange={handleChangeC1GroupIndex(c.index)}
              fullWidth={true}
            >
              {props.groups.map(group => (
                <MenuItem key={group.index} value={group.index}>{group.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="割り当て職員数下限"
              type="number"
              defaultValue={c.min_number_of_assignments}
              onChange={handleChangeC1MinNumberOfAssignments(c.index)}
              fullWidth={true}
            />
          </ExpansionPanelDetails>
          <ExpansionPanelActions>
            <Button size="small" onClick={handleClickDeleteC1(c.index)}>削除</Button>
          </ExpansionPanelActions>
        </ExpansionPanel>
      ))}
    </>
  )
}

function mapStateToProps(state: all.State) {
  return {
    c1: state.c1,
    groups: state.groups,
    kinmus: state.kinmus,
  }
}

export default connect(mapStateToProps)(C1)
