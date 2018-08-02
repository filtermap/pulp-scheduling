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
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { StateWithHistory } from 'redux-undo'
import * as all from '../modules/all'
import * as constraints1 from '../modules/constraints1'
import * as groups from '../modules/groups'
import * as kinmus from '../modules/kinmus'
import * as utils from '../utils'

type Props = {
  dispatch: Dispatch
  constraints1: constraints1.Constraint1[]
  kinmus: kinmus.Kinmu[]
  groups: groups.Group[]
}

type State = {
  creationDialogIsOpen: boolean
  newConstraint1IsEnabled: boolean
  newConstraint1StartDateName: string
  newConstraint1StopDateName: string
  newConstraint1KinmuId: number
  newConstraint1GroupId: number
  newConstraint1MinNumberOfAssignments: number
  deletionDialogIsOpen: boolean
  selectedConstraint1Id: number
}

class Constraints1 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const todayString = utils.dateToString(new Date())
    this.state = {
      creationDialogIsOpen: false,
      deletionDialogIsOpen: false,
      newConstraint1GroupId: this.props.groups.length > 0 ? this.props.groups[0].id : 0,
      newConstraint1IsEnabled: true,
      newConstraint1KinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
      newConstraint1MinNumberOfAssignments: 0,
      newConstraint1StartDateName: todayString,
      newConstraint1StopDateName: todayString,
      selectedConstraint1Id: this.props.constraints1.length > 0 ? this.props.constraints1[0].id : 0
    }
  }
  public handleChangeConstraint1IsEnabled(id: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      this.props.dispatch(constraints1.updateConstraint1IsEnabled(id, checked))
    }
  }
  public handleChangeConstraint1StartDateName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints1.updateConstraint1StartDateName(id, event.target.value))
    }
  }
  public handleChangeConstraint1StopDateName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints1.updateConstraint1StopDateName(id, event.target.value))
    }
  }
  public handleChangeConstraint1KinmuId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints1.updateConstraint1KinmuId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeConstraint1GroupId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints1.updateConstraint1GroupId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeConstraint1MinNumberOfAssignments(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(constraints1.updateConstraint1MinNumberOfAssignments(id, parseInt(event.target.value, 10)))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewConstraint1IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newConstraint1IsEnabled: checked })
  }
  public handleChangeNewConstraint1StartDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint1StartDateName: event.target.value })
  }
  public handleChangeNewConstraint1StopDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint1StopDateName: event.target.value })
  }
  public handleChangeNewConstraint1KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint1KinmuId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewConstraint1GroupId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint1GroupId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewConstraint1MinNumberOfAssignments = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint1MinNumberOfAssignments: parseInt(event.target.value, 10) })
  }
  public handleClickCreateConstraint1 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(constraints1.createConstraint1(this.state.newConstraint1IsEnabled, this.state.newConstraint1StartDateName, this.state.newConstraint1StopDateName, this.state.newConstraint1KinmuId, this.state.newConstraint1GroupId, this.state.newConstraint1MinNumberOfAssignments))
  }
  public handleClickOpenDeletionDialog(selectedConstraint1Id: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedConstraint1Id,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteConstraint1 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(constraints1.deleteConstraint1(this.state.selectedConstraint1Id))
  }
  public render() {
    const selectedConstraint1 = this.props.constraints1.find(c => c.id === this.state.selectedConstraint1Id)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}> 期間の勤務にグループから割り当てる職員数の下限</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.constraints1.map(c => (
          <ExpansionPanel key={c.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${c.start_date_name}から${c.stop_date_name}までの${this.props.kinmus.find(kinmu => kinmu.id === c.kinmu_id)!.name}に${this.props.groups.find(group => group.id === c.group_id)!.name}から${c.min_number_of_assignments}人以上の職員を割り当てる`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={c.is_enabled}
                    onChange={this.handleChangeConstraint1IsEnabled(c.id)}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                label="開始日"
                type="date"
                defaultValue={c.start_date_name}
                onChange={this.handleChangeConstraint1StartDateName(c.id)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={c.stop_date_name}
                onChange={this.handleChangeConstraint1StopDateName(c.id)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_id}
                onChange={this.handleChangeConstraint1KinmuId(c.id)}
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
                onChange={this.handleChangeConstraint1GroupId(c.id)}
                fullWidth={true}
              >
                {this.props.groups.map(group => (
                  <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="割り当て職員数下限"
                type="number"
                defaultValue={c.min_number_of_assignments}
                onChange={this.handleChangeConstraint1MinNumberOfAssignments(c.id)}
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
            <DialogTitle>期間の勤務にグループから割り当てる職員数の下限を追加できません</DialogTitle>
            <DialogContent>
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
              {this.props.groups.length === 0 ? <DialogContentText>グループがありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>期間の勤務にグループから割り当てる職員数の下限の追加</DialogTitle>
            <DialogContent style={{ display: 'flex' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.newConstraint1IsEnabled}
                    onChange={this.handleChangeNewConstraint1IsEnabled}
                    color="primary"
                  />
                }
                label="有効"
              />
              <TextField
                label="開始日"
                type="date"
                defaultValue={this.state.newConstraint1StartDateName}
                onChange={this.handleChangeNewConstraint1StartDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={this.state.newConstraint1StopDateName}
                onChange={this.handleChangeNewConstraint1StopDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={this.state.newConstraint1KinmuId}
                onChange={this.handleChangeNewConstraint1KinmuId}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                select={true}
                label="グループ"
                value={this.state.newConstraint1GroupId}
                onChange={this.handleChangeNewConstraint1GroupId}
                fullWidth={true}
              >
                {this.props.groups.map(group => (
                  <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="割り当て職員数下限"
                type="number"
                defaultValue={this.state.newConstraint1MinNumberOfAssignments}
                onChange={this.handleChangeNewConstraint1MinNumberOfAssignments}
                fullWidth={true}
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateConstraint1}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selectedConstraint1 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>期間の勤務にグループから割り当てる職員数の下限の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この期間の勤務にグループから割り当てる職員数の下限を削除します</DialogContentText>
              <Typography>{`${selectedConstraint1.start_date_name}から${selectedConstraint1.stop_date_name}までの${this.props.kinmus.find(kinmu => kinmu.id === selectedConstraint1.kinmu_id)!.name}に${this.props.groups.find(group => group.id === selectedConstraint1.group_id)!.name}から${selectedConstraint1.min_number_of_assignments}人以上の職員を割り当てる`}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteConstraint1}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    constraints1: state.present.constraints1,
    groups: state.present.groups,
    kinmus: state.present.kinmus,
  }
}

export default connect(mapStateToProps)(Constraints1)
