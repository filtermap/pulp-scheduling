import Button from '@material-ui/core/Button'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
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
  return (
    <>
      <Toolbar>
        <Typography variant="subheading">連続禁止勤務並び</Typography>
      </Toolbar>
      {sequence_ids.map(sequence_id => (
        <ExpansionPanel key={sequence_id}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{props.renzoku_kinshi_kinmus.filter(renzoku_kinshi_kinmu => renzoku_kinshi_kinmu.sequence_id === sequence_id).sort((a, b) => a.sequence_number - b.sequence_number).map(renzoku_kinshi_kinmu => props.kinmus.find(kinmu => kinmu.index === renzoku_kinshi_kinmu.kinmu_index)!.name).join(', ')}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelActions>
            <Button size="small" onClick={handleClickDeleteSequence(sequence_id)}>削除</Button>
          </ExpansionPanelActions>
        </ExpansionPanel>
      ))}
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
