import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
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
import { StateWithHistory } from 'redux-undo'
import * as all from '../modules/all'
import * as assignments from '../modules/assignments'
import * as c0_kinmus from '../modules/c0_kinmus'
import * as c1 from '../modules/c1'
import * as c10 from '../modules/c10'
import * as c2 from '../modules/c2'
import * as c3 from '../modules/c3'
import * as c4 from '../modules/c4'
import * as c5 from '../modules/c5'
import * as c6 from '../modules/c6'
import * as c7 from '../modules/c7'
import * as c8 from '../modules/c8'
import * as c9 from '../modules/c9'
import * as groups from '../modules/groups'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  dispatch: Dispatch
  kinmus: kinmus.Kinmu[]
  assignments: assignments.Assignment[]
  c0_kinmus: c0_kinmus.C0Kinmu[]
  c1: c1.C1[]
  c2: c2.C2[]
  c3: c3.C3[]
  c4: c4.C4[]
  c5: c5.C5[]
  c6: c6.C6[]
  c7: c7.C7[]
  c8: c8.C8[]
  c9: c9.C9[]
  c10: c10.C10[]
  members: members.Member[]
  groups: groups.Group[]
}

type State = {
  creationDialogIsOpen: boolean
  newKinmuName: string
  deletionDialogIsOpen: boolean
  selectedKinmuIndex: number
}

class Kinmus extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    deletionDialogIsOpen: false,
    newKinmuName: '',
    selectedKinmuIndex: this.props.kinmus.length > 0 ? this.props.kinmus[0].index : 0,
  }
  public handleChangeKinmuName(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(kinmus.updateKinmuName(index, event.target.value))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewKinmuName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newKinmuName: event.target.value })
  }
  public handleClickCreateKinmu = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(kinmus.createKinmu(this.state.newKinmuName))
  }
  public handleClickOpenDeletionDialog(selectedKinmuIndex: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedKinmuIndex,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteKinmu = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(all.deleteKinmu(this.state.selectedKinmuIndex))
  }
  public render() {
    const selectedKinmu = this.props.kinmus.find(kinmu => kinmu.index === this.state.selectedKinmuIndex)
    const selectedKinmuRosterIds = Array.from(new Set(this.props.assignments.filter(({ kinmu_index }) => kinmu_index === this.state.selectedKinmuIndex).map(({ roster_id }) => roster_id)))
    const selectedKinmuSequenceIds = Array.from(new Set(this.props.c0_kinmus.filter(({ kinmu_index }) => kinmu_index === this.state.selectedKinmuIndex).map(({ sequence_id }) => sequence_id)))
    const selectedKinmuC1 = this.props.c1.filter(c => c.kinmu_index === this.state.selectedKinmuIndex)
    const selectedKinmuC2 = this.props.c2.filter(c => c.kinmu_index === this.state.selectedKinmuIndex)
    const selectedKinmuC3 = this.props.c3.filter(c => c.kinmu_index === this.state.selectedKinmuIndex)
    const selectedKinmuC4 = this.props.c4.filter(c => c.kinmu_index === this.state.selectedKinmuIndex)
    const selectedKinmuC5 = this.props.c5.filter(c => c.kinmu_index === this.state.selectedKinmuIndex)
    const selectedKinmuC6 = this.props.c6.filter(c => c.kinmu_index === this.state.selectedKinmuIndex)
    const selectedKinmuC7 = this.props.c7.filter(c => c.kinmu_index === this.state.selectedKinmuIndex)
    const selectedKinmuC8 = this.props.c8.filter(c => c.kinmu_index === this.state.selectedKinmuIndex)
    const selectedKinmuC9 = this.props.c9.filter(c => c.kinmu_index === this.state.selectedKinmuIndex)
    const selectedKinmuC10 = this.props.c10.filter(c => c.kinmu_index === this.state.selectedKinmuIndex)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>勤務</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.kinmus.map(kinmu => (
          <ExpansionPanel key={kinmu.index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{kinmu.name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField
                label="勤務名"
                defaultValue={kinmu.name}
                onChange={this.handleChangeKinmuName(kinmu.index)}
                margin="normal"
              />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleClickOpenDeletionDialog(kinmu.index)}>削除</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
        <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
          <DialogTitle>勤務の追加</DialogTitle>
          <DialogContent style={{ display: 'flex' }}>
            <TextField
              label="勤務名"
              defaultValue={this.state.newKinmuName}
              onChange={this.handleChangeNewKinmuName}
              fullWidth={true}
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickCreateKinmu}>追加</Button>
            <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
          </DialogActions>
        </Dialog>
        {selectedKinmu &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>勤務の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この勤務を削除します</DialogContentText>
              <Typography>{selectedKinmu.name}</Typography>
              {selectedKinmuRosterIds.length > 0 && <DialogContentText>以下の勤務表も削除されます</DialogContentText>}
              {selectedKinmuRosterIds.map(roster_id => <Typography key={roster_id}>{`勤務表${roster_id}`}</Typography>)}
              {(selectedKinmuSequenceIds.length > 0 ||
                selectedKinmuC1.length > 0 ||
                selectedKinmuC2.length > 0 ||
                selectedKinmuC3.length > 0 ||
                selectedKinmuC4.length > 0 ||
                selectedKinmuC5.length > 0 ||
                selectedKinmuC6.length > 0 ||
                selectedKinmuC7.length > 0 ||
                selectedKinmuC8.length > 0 ||
                selectedKinmuC9.length > 0 ||
                selectedKinmuC10.length > 0) &&
                <DialogContentText>以下の条件も削除されます</DialogContentText>}
              {selectedKinmuSequenceIds.map(sequenceId => <Typography key={sequenceId}>{this.props.c0_kinmus.filter(({ sequence_id }) => sequence_id === sequenceId).sort((a, b) => a.sequence_number - b.sequence_number).map(({ kinmu_index }) => this.props.kinmus.find(kinmu => kinmu.index === kinmu_index)!.name).join(', ')}</Typography>)}
              {selectedKinmuC1.map(c => <Typography key={c.index}>{`${c.start_date_name}から${c.stop_date_name}までの${selectedKinmu.name}に${this.props.groups.find(group => group.index === c.group_index)!.name}から${c.min_number_of_assignments}人以上の職員を割り当てる`}</Typography>)}
              {selectedKinmuC2.map(c => <Typography key={c.index}>{`${c.start_date_name}から${c.stop_date_name}までの${selectedKinmu.name}に${this.props.groups.find(group => group.index === c.group_index)!.name}から${c.max_number_of_assignments}人以下の職員を割り当てる`}</Typography>)}
              {selectedKinmuC3.map(c => <Typography key={c.index}>{`${this.props.members.find(member => member.index === c.member_index)!.name}に${selectedKinmu.name}を${c.min_number_of_assignments}回以上割り当てる`}</Typography>)}
              {selectedKinmuC4.map(c => <Typography key={c.index}>{`${this.props.members.find(member => member.index === c.member_index)!.name}に${selectedKinmu.name}を${c.max_number_of_assignments}回以下割り当てる`}</Typography>)}
              {selectedKinmuC5.map(c => <Typography key={c.index}>{`${selectedKinmu.name}の連続日数を${c.min_number_of_days}日以上にする`}</Typography>)}
              {selectedKinmuC6.map(c => <Typography key={c.index}>{`${selectedKinmu.name}の連続日数を${c.max_number_of_days}日以下にする`}</Typography>)}
              {selectedKinmuC7.map(c => <Typography key={c.index}>{`${selectedKinmu.name}の間隔日数を${c.min_number_of_days}日以上にする`}</Typography>)}
              {selectedKinmuC8.map(c => <Typography key={c.index}>{`${selectedKinmu.name}の間隔日数を${c.max_number_of_days}日以下にする`}</Typography>)}
              {selectedKinmuC9.map(c => <Typography key={c.index}>{`${this.props.members.find(member => member.index === c.member_index)!.name}の${c.start_date_name}から${c.stop_date_name}までに${selectedKinmu.name}を割り当てる`}</Typography>)}
              {selectedKinmuC10.map(c => <Typography key={c.index}>{`${this.props.members.find(member => member.index === c.member_index)!.name}の${c.start_date_name}から${c.stop_date_name}までに${selectedKinmu.name}を割り当てない`}</Typography>)}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteKinmu}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>
        }
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    assignments: state.present.assignments,
    c0_kinmus: state.present.c0_kinmus,
    c1: state.present.c1,
    c10: state.present.c10,
    c2: state.present.c2,
    c3: state.present.c3,
    c4: state.present.c4,
    c5: state.present.c5,
    c6: state.present.c6,
    c7: state.present.c7,
    c8: state.present.c8,
    c9: state.present.c9,
    groups: state.present.groups,
    kinmus: state.present.kinmus,
    members: state.present.members,
  }
}

export default connect(mapStateToProps)(Kinmus)
