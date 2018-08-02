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
import MenuItem from '../../node_modules/@material-ui/core/MenuItem'
import * as all from '../modules/all'
import * as constraints2 from '../modules/constraints2'
import * as groups from '../modules/groups'
import * as kinmus from '../modules/kinmus'
import * as utils from '../utils'

type Props = {
  dispatch: Dispatch
  constraints2: constraints2.Constraint2[]
  kinmus: kinmus.Kinmu[]
  groups: groups.Group[]
}

type State = {
  creationDialogIsOpen: boolean
  newConstraint2IsEnabled: boolean
  newConstraint2StartDateName: string
  newConstraint2StopDateName: string
  newConstraint2KinmuId: number
  newConstraint2GroupId: number
  newConstraint2MaxNumberOfAssignments: number
  deletionDialogIsOpen: boolean
  selectedConstraint2Id: number
}

class Constraints2 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const todayString = utils.dateToString(new Date())
    this.state = {
      creationDialogIsOpen: false,
      deletionDialogIsOpen: false,
      newConstraint2GroupId: this.props.groups.length > 0 ? this.props.groups[0].id : 0,
      newConstraint2IsEnabled: true,
      newConstraint2KinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
      newConstraint2MaxNumberOfAssignments: 0,
      newConstraint2StartDateName: todayString,
      newConstraint2StopDateName: todayString,
      selectedConstraint2Id: this.props.constraints2.length > 0 ? this.props.constraints2[0].id : 0,
    }
  }
  public handleChangeConstraint2IsEnabled(id: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      this.props.dispatch(constraints2.updateConstraint2IsEnabled(id, checked))
    }
  }
  public handleChangeConstraint2StartDateName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints2.updateConstraint2StartDateName(id, event.target.value))
    }
  }
  public handleChangeConstraint2StopDateName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints2.updateConstraint2StopDateName(id, event.target.value))
    }
  }
  public handleChangeConstraint2KinmuId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints2.updateConstraint2KinmuId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeConstraint2GroupId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints2.updateConstraint2GroupId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeConstraint2MaxNumberOfAssignments(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints2.updateConstraint2MaxNumberOfAssignments(id, parseInt(event.target.value, 10)))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewConstraint2IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newConstraint2IsEnabled: checked })
  }
  public handleChangeNewConstraint2StartDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint2StartDateName: event.target.value })
  }
  public handleChangeNewConstraint2StopDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint2StopDateName: event.target.value })
  }
  public handleChangeNewConstraint2KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint2KinmuId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewConstraint2GroupId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint2GroupId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewConstraint2MinNumberOfAssignments = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint2MaxNumberOfAssignments: parseInt(event.target.value, 10) })
  }
  public handleClickCreateConstraint2 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(constraints2.createConstraint2(this.state.newConstraint2IsEnabled, this.state.newConstraint2StartDateName, this.state.newConstraint2StopDateName, this.state.newConstraint2KinmuId, this.state.newConstraint2GroupId, this.state.newConstraint2MaxNumberOfAssignments))
  }
  public handleClickOpenDeletionDialog(selectedConstraint2Id: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedConstraint2Id,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteConstraint2 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(constraints2.deleteConstraint2(this.state.selectedConstraint2Id))
  }
  public render() {
    const selectedConstraint2 = this.props.constraints2.find(c => c.id === this.state.selectedConstraint2Id)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>期間の勤務にグループから割り当てる職員数の上限</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.constraints2.map(c => (
          <ExpansionPanel key={c.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${c.start_date_name}から${c.stop_date_name}までの${this.props.kinmus.find(kinmu => kinmu.id === c.kinmu_id)!.name}に${this.props.groups.find(group => group.id === c.group_id)!.name}から${c.max_number_of_assignments}人以下の職員を割り当てる`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={c.is_enabled}
                    onChange={this.handleChangeConstraint2IsEnabled(c.id)}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                label="開始日"
                type="date"
                defaultValue={c.start_date_name}
                onChange={this.handleChangeConstraint2StartDateName(c.id)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={c.stop_date_name}
                onChange={this.handleChangeConstraint2StopDateName(c.id)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_id}
                onChange={this.handleChangeConstraint2KinmuId(c.id)}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                select={true}
                label="グループ"
                value={c.group_id}
                onChange={this.handleChangeConstraint2GroupId(c.id)}
                fullWidth={true}
              >
                {this.props.groups.map(group => (
                  <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="割り当て職員数上限"
                type="number"
                defaultValue={c.max_number_of_assignments}
                onChange={this.handleChangeConstraint2MaxNumberOfAssignments(c.id)}
                fullWidth={true}
              />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleClickOpenDeletionDialog(c.id)}>削除</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
        {this.props.kinmus.length === 0 || this.props.groups.length === 0 ?
          <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>期間の勤務にグループから割り当てる職員数の上限を追加できません</DialogTitle>
            <DialogContent>
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
              {this.props.groups.length === 0 ? <DialogContentText>グループがありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>期間の勤務にグループから割り当てる職員数の上限の追加</DialogTitle>
            <DialogContent style={{ display: 'flex' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.newConstraint2IsEnabled}
                    onChange={this.handleChangeNewConstraint2IsEnabled}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                label="開始日"
                type="date"
                defaultValue={this.state.newConstraint2StartDateName}
                onChange={this.handleChangeNewConstraint2StartDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={this.state.newConstraint2StopDateName}
                onChange={this.handleChangeNewConstraint2StopDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={this.state.newConstraint2KinmuId}
                onChange={this.handleChangeNewConstraint2KinmuId}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                select={true}
                label="グループ"
                value={this.state.newConstraint2GroupId}
                onChange={this.handleChangeNewConstraint2GroupId}
                fullWidth={true}
              >
                {this.props.groups.map(group => (
                  <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="割り当て職員数上限"
                type="number"
                defaultValue={this.state.newConstraint2MaxNumberOfAssignments}
                onChange={this.handleChangeNewConstraint2MinNumberOfAssignments}
                fullWidth={true}
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateConstraint2}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selectedConstraint2 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>期間の勤務にグループから割り当てる職員数の上限の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この期間の勤務にグループから割り当てる職員数の上限を削除します</DialogContentText>
              <Typography>{`${selectedConstraint2.start_date_name}から${selectedConstraint2.stop_date_name}までの${this.props.kinmus.find(kinmu => kinmu.id === selectedConstraint2.kinmu_id)!.name}に${this.props.groups.find(group => group.id === selectedConstraint2.group_id)!.name}から${selectedConstraint2.max_number_of_assignments}人以下の職員を割り当てる`}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteConstraint2}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    constraints2: state.present.constraints2,
    groups: state.present.groups,
    kinmus: state.present.kinmus,
  }
}

export default connect(mapStateToProps)(Constraints2)
