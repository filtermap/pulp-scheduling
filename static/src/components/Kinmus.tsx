import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import FormControlLabel from '@material-ui/core/FormControlLabel'
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
import * as constraint0_kinmus from '../modules/constraint0_kinmus'
import * as constraints1 from '../modules/constraints1'
import * as constraints10 from '../modules/constraints10'
import * as constraints2 from '../modules/constraints2'
import * as constraints3 from '../modules/constraints3'
import * as constraints4 from '../modules/constraints4'
import * as constraints5 from '../modules/constraints5'
import * as constraints6 from '../modules/constraints6'
import * as constraints7 from '../modules/constraints7'
import * as constraints8 from '../modules/constraints8'
import * as constraints9 from '../modules/constraints9'
import * as groups from '../modules/groups'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'

type Props = {
  dispatch: Dispatch
  kinmus: kinmus.Kinmu[]
  assignments: assignments.Assignment[]
  constraint0_kinmus: constraint0_kinmus.Constraint0Kinmu[]
  constraints1: constraints1.Constraint1[]
  constraints2: constraints2.Constraint2[]
  constraints3: constraints3.Constraint3[]
  constraints4: constraints4.Constraint4[]
  constraints5: constraints5.Constraint5[]
  constraints6: constraints6.Constraint6[]
  constraints7: constraints7.Constraint7[]
  constraints8: constraints8.Constraint8[]
  constraints9: constraints9.Constraint9[]
  constraints10: constraints10.Constraint10[]
  members: members.Member[]
  groups: groups.Group[]
}

type State = {
  creationDialogIsOpen: boolean
  newKinmuIsEnabled: boolean
  newKinmuName: string
  deletionDialogIsOpen: boolean
  selectedKinmuId: number
}

class Kinmus extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    deletionDialogIsOpen: false,
    newKinmuIsEnabled: true,
    newKinmuName: '',
    selectedKinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
  }
  public handleChangeKinmuIsEnabled(id: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      this.props.dispatch(kinmus.updateKinmuIsEnabled(id, checked))
    }
  }
  public handleChangeKinmuName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(kinmus.updateKinmuName(id, event.target.value))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewKinmuIsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newKinmuIsEnabled: checked })
  }
  public handleChangeNewKinmuName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newKinmuName: event.target.value })
  }
  public handleClickCreateKinmu = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(kinmus.createKinmu(this.state.newKinmuIsEnabled, this.state.newKinmuName))
  }
  public handleClickOpenDeletionDialog(selectedKinmuId: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedKinmuId,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteKinmu = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(all.deleteKinmu(this.state.selectedKinmuId))
  }
  public render() {
    const selectedKinmu = this.props.kinmus.find(kinmu => kinmu.id === this.state.selectedKinmuId)
    const selectedKinmuRosterIds = Array.from(new Set(this.props.assignments.filter(({ kinmu_id }) => kinmu_id === this.state.selectedKinmuId).map(({ roster_id }) => roster_id)))
    const selectedKinmuConstraint0Ids = Array.from(new Set(this.props.constraint0_kinmus.filter(({ kinmu_id }) => kinmu_id === this.state.selectedKinmuId).map(({ constraint0_id }) => constraint0_id)))
    const selectedKinmuConstraints1 = this.props.constraints1.filter(c => c.kinmu_id === this.state.selectedKinmuId)
    const selectedKinmuConstraints2 = this.props.constraints2.filter(c => c.kinmu_id === this.state.selectedKinmuId)
    const selectedKinmuConstraints3 = this.props.constraints3.filter(c => c.kinmu_id === this.state.selectedKinmuId)
    const selectedKinmuConstraints4 = this.props.constraints4.filter(c => c.kinmu_id === this.state.selectedKinmuId)
    const selectedKinmuConstraints5 = this.props.constraints5.filter(c => c.kinmu_id === this.state.selectedKinmuId)
    const selectedKinmuConstraints6 = this.props.constraints6.filter(c => c.kinmu_id === this.state.selectedKinmuId)
    const selectedKinmuConstraints7 = this.props.constraints7.filter(c => c.kinmu_id === this.state.selectedKinmuId)
    const selectedKinmuConstraints8 = this.props.constraints8.filter(c => c.kinmu_id === this.state.selectedKinmuId)
    const selectedKinmuConstraints9 = this.props.constraints9.filter(c => c.kinmu_id === this.state.selectedKinmuId)
    const selectedKinmuConstraints10 = this.props.constraints10.filter(c => c.kinmu_id === this.state.selectedKinmuId)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>勤務</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.kinmus.map(kinmu => (
          <ExpansionPanel key={kinmu.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{kinmu.name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={kinmu.is_enabled}
                    onChange={this.handleChangeKinmuIsEnabled(kinmu.id)}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                label="勤務名"
                defaultValue={kinmu.name}
                onChange={this.handleChangeKinmuName(kinmu.id)}
                margin="normal"
              />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleClickOpenDeletionDialog(kinmu.id)}>削除</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
        <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
          <DialogTitle>勤務の追加</DialogTitle>
          <DialogContent style={{ display: 'flex' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.newKinmuIsEnabled}
                  onChange={this.handleChangeNewKinmuIsEnabled}
                  color="primary"
                />
              }
              label="有効"
            />
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
              {(selectedKinmuConstraint0Ids.length > 0 ||
                selectedKinmuConstraints1.length > 0 ||
                selectedKinmuConstraints2.length > 0 ||
                selectedKinmuConstraints3.length > 0 ||
                selectedKinmuConstraints4.length > 0 ||
                selectedKinmuConstraints5.length > 0 ||
                selectedKinmuConstraints6.length > 0 ||
                selectedKinmuConstraints7.length > 0 ||
                selectedKinmuConstraints8.length > 0 ||
                selectedKinmuConstraints9.length > 0 ||
                selectedKinmuConstraints10.length > 0) &&
                <DialogContentText>以下の条件も削除されます</DialogContentText>}
              {selectedKinmuConstraint0Ids.map(constraint0_id => <Typography key={constraint0_id}>{this.props.constraint0_kinmus.filter(constraint0_kinmu => constraint0_kinmu.constraint0_id === constraint0_id).sort((a, b) => a.sequence_number - b.sequence_number).map(({ kinmu_id }) => this.props.kinmus.find(kinmu => kinmu.id === kinmu_id)!.name).join(', ')}</Typography>)}
              {selectedKinmuConstraints1.map(c => <Typography key={c.id}>{`${c.start_date_name}から${c.stop_date_name}までの${selectedKinmu.name}に${this.props.groups.find(group => group.id === c.group_id)!.name}から${c.min_number_of_assignments}人以上の職員を割り当てる`}</Typography>)}
              {selectedKinmuConstraints2.map(c => <Typography key={c.id}>{`${c.start_date_name}から${c.stop_date_name}までの${selectedKinmu.name}に${this.props.groups.find(group => group.id === c.group_id)!.name}から${c.max_number_of_assignments}人以下の職員を割り当てる`}</Typography>)}
              {selectedKinmuConstraints3.map(c => <Typography key={c.id}>{`${this.props.members.find(member => member.id === c.member_id)!.name}に${selectedKinmu.name}を${c.min_number_of_assignments}回以上割り当てる`}</Typography>)}
              {selectedKinmuConstraints4.map(c => <Typography key={c.id}>{`${this.props.members.find(member => member.id === c.member_id)!.name}に${selectedKinmu.name}を${c.max_number_of_assignments}回以下割り当てる`}</Typography>)}
              {selectedKinmuConstraints5.map(c => <Typography key={c.id}>{`${selectedKinmu.name}の連続日数を${c.min_number_of_days}日以上にする`}</Typography>)}
              {selectedKinmuConstraints6.map(c => <Typography key={c.id}>{`${selectedKinmu.name}の連続日数を${c.max_number_of_days}日以下にする`}</Typography>)}
              {selectedKinmuConstraints7.map(c => <Typography key={c.id}>{`${selectedKinmu.name}の間隔日数を${c.min_number_of_days}日以上にする`}</Typography>)}
              {selectedKinmuConstraints8.map(c => <Typography key={c.id}>{`${selectedKinmu.name}の間隔日数を${c.max_number_of_days}日以下にする`}</Typography>)}
              {selectedKinmuConstraints9.map(c => <Typography key={c.id}>{`${this.props.members.find(member => member.id === c.member_id)!.name}の${c.start_date_name}から${c.stop_date_name}までに${selectedKinmu.name}を割り当てる`}</Typography>)}
              {selectedKinmuConstraints10.map(c => <Typography key={c.id}>{`${this.props.members.find(member => member.id === c.member_id)!.name}の${c.start_date_name}から${c.stop_date_name}までに${selectedKinmu.name}を割り当てない`}</Typography>)}
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
    constraint0_kinmus: state.present.constraint0_kinmus,
    constraints1: state.present.constraints1,
    constraints10: state.present.constraints10,
    constraints2: state.present.constraints2,
    constraints3: state.present.constraints3,
    constraints4: state.present.constraints4,
    constraints5: state.present.constraints5,
    constraints6: state.present.constraints6,
    constraints7: state.present.constraints7,
    constraints8: state.present.constraints8,
    constraints9: state.present.constraints9,
    groups: state.present.groups,
    kinmus: state.present.kinmus,
    members: state.present.members,
  }
}

export default connect(mapStateToProps)(Kinmus)
