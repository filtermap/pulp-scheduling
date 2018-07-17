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
import * as kinmus from '../modules/kinmus'
import * as renzoku_kinshi_kinmus from '../modules/renzoku_kinshi_kinmus'

type Props = {
  dispatch: Dispatch
  renzoku_kinshi_kinmus: renzoku_kinshi_kinmus.RenzokuKinshiKinmu[]
  kinmus: kinmus.Kinmu[]
}

function RenzokuKinshiKinmus(props: Props) {
  const sequence_ids = Array.from(new Set(props.renzoku_kinshi_kinmus.map(renzoku_kinshi_kinmu => renzoku_kinshi_kinmu.sequence_id)))
  function handleClickDeleteSequence(sequence_id: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      props.dispatch(renzoku_kinshi_kinmus.deleteSequence(sequence_id))
    }
  }
  function handleClickCreateRenzokuKinshiKinmu(sequence_id: number, sequence_number: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      const kinmu_index = props.kinmus[0].index
      props.dispatch(renzoku_kinshi_kinmus.createRenzokuKinshiKinmu(sequence_id, sequence_number, kinmu_index))
    }
  }
  function handleChangeRenzokuKinshiKinmuKinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatch(renzoku_kinshi_kinmus.updateRenzokuKinshiKinmuKinmuIndex(index, parseInt(event.target.value, 10)))
    }
  }
  function handleClickDeleteRenzokuKinshiKinmu(index: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      props.dispatch(renzoku_kinshi_kinmus.deleteRenzokuKinshiKinmu(index))
    }
  }
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">連続禁止勤務並び</Typography>
      </Toolbar>
      {sequence_ids.map(sequence_id => {
        const renzoku_kinshi_kinmus_by_sequence_id = props.renzoku_kinshi_kinmus.filter(renzoku_kinshi_kinmu => renzoku_kinshi_kinmu.sequence_id === sequence_id).sort((a, b) => a.sequence_number - b.sequence_number)
        return (
          <ExpansionPanel key={sequence_id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{renzoku_kinshi_kinmus_by_sequence_id.map(renzoku_kinshi_kinmu => props.kinmus.find(kinmu => kinmu.index === renzoku_kinshi_kinmu.kinmu_index)!.name).join(', ')}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Button size="small" onClick={handleClickCreateRenzokuKinshiKinmu(sequence_id, 0)}>追加</Button>
              {renzoku_kinshi_kinmus_by_sequence_id.map((renzoku_kinshi_kinmu, index) => (
                <React.Fragment key={renzoku_kinshi_kinmu.index}>
                  <TextField
                    select={true}
                    label={`勤務${index + 1}`}
                    value={renzoku_kinshi_kinmu.kinmu_index}
                    onChange={handleChangeRenzokuKinshiKinmuKinmuIndex(renzoku_kinshi_kinmu.index)}
                    fullWidth={true}
                  >
                    {props.kinmus.map(kinmu => (
                      <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
                    ))}
                  </TextField>
                  <Button size="small" onClick={handleClickDeleteRenzokuKinshiKinmu(renzoku_kinshi_kinmu.index)}>削除</Button>
                  <Button size="small" onClick={handleClickCreateRenzokuKinshiKinmu(sequence_id, renzoku_kinshi_kinmu.sequence_number + 1)}>追加</Button>
                </React.Fragment>
              ))}
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" onClick={handleClickDeleteSequence(sequence_id)}>削除</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        )
      })}
    </>
  )
}

function mapStateToProps(state: all.State) {
  return {
    kinmus: state.kinmus,
    renzoku_kinshi_kinmus: state.renzoku_kinshi_kinmus,
  }
}

export default connect(mapStateToProps)(RenzokuKinshiKinmus)
