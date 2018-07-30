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
import MenuItem from '../../node_modules/@material-ui/core/MenuItem'
import * as all from '../modules/all'
import * as c2 from '../modules/c2'
import * as groups from '../modules/groups'
import * as kinmus from '../modules/kinmus'
import * as utils from '../utils'

type Props = {
  dispatch: Dispatch
  c2: c2.C2[]
  kinmus: kinmus.Kinmu[]
  groups: groups.Group[]
}

type State = {
  creationDialogIsOpen: boolean
  newC2StartDateName: string
  newC2StopDateName: string
  newC2KinmuId: number
  newC2GroupId: number
  newC2MaxNumberOfAssignments: number
  deletionDialogIsOpen: boolean
  selectedC2Id: number
}

class C2 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const todayString = utils.dateToString(new Date())
    this.state = {
      creationDialogIsOpen: false,
      deletionDialogIsOpen: false,
      newC2GroupId: this.props.groups.length > 0 ? this.props.groups[0].id : 0,
      newC2KinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
      newC2MaxNumberOfAssignments: 0,
      newC2StartDateName: todayString,
      newC2StopDateName: todayString,
      selectedC2Id: this.props.c2.length > 0 ? this.props.c2[0].id : 0,
    }
  }
  public handleChangeC2StartDateName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c2.updateC2StartDateName(id, event.target.value))
    }
  }
  public handleChangeC2StopDateName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c2.updateC2StopDateName(id, event.target.value))
    }
  }
  public handleChangeC2KinmuId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c2.updateC2KinmuId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeC2GroupId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c2.updateC2GroupId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeC2MaxNumberOfAssignments(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c2.updateC2MaxNumberOfAssignments(id, parseInt(event.target.value, 10)))
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewC2StartDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC2StartDateName: event.target.value })
  }
  public handleChangeNewC2StopDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC2StopDateName: event.target.value })
  }
  public handleChangeNewC2KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC2KinmuId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC2GroupId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC2GroupId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC2MinNumberOfAssignments = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC2MaxNumberOfAssignments: parseInt(event.target.value, 10) })
  }
  public handleClickCreateC2 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(c2.createC2(this.state.newC2StartDateName, this.state.newC2StopDateName, this.state.newC2KinmuId, this.state.newC2GroupId, this.state.newC2MaxNumberOfAssignments))
  }
  public handleClickOpenDeletionDialog(selectedC2Id: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedC2Id,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteC2 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(c2.deleteC2(this.state.selectedC2Id))
  }
  public render() {
    const selectedC2 = this.props.c2.find(c => c.id === this.state.selectedC2Id)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>期間の勤務にグループから割り当てる職員数の上限</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.c2.map(c => (
          <ExpansionPanel key={c.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${c.start_date_name}から${c.stop_date_name}までの${this.props.kinmus.find(kinmu => kinmu.id === c.kinmu_id)!.name}に${this.props.groups.find(group => group.id === c.group_id)!.name}から${c.max_number_of_assignments}人以下の職員を割り当てる`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField
                label="開始日"
                type="date"
                defaultValue={c.start_date_name}
                onChange={this.handleChangeC2StartDateName(c.id)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={c.stop_date_name}
                onChange={this.handleChangeC2StopDateName(c.id)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_id}
                onChange={this.handleChangeC2KinmuId(c.id)}
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
                onChange={this.handleChangeC2GroupId(c.id)}
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
                onChange={this.handleChangeC2MaxNumberOfAssignments(c.id)}
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
              <TextField
                label="開始日"
                type="date"
                defaultValue={this.state.newC2StartDateName}
                onChange={this.handleChangeNewC2StartDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={this.state.newC2StopDateName}
                onChange={this.handleChangeNewC2StopDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={this.state.newC2KinmuId}
                onChange={this.handleChangeNewC2KinmuId}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                select={true}
                label="グループ"
                value={this.state.newC2GroupId}
                onChange={this.handleChangeNewC2GroupId}
                fullWidth={true}
              >
                {this.props.groups.map(group => (
                  <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="割り当て職員数上限"
                type="number"
                defaultValue={this.state.newC2MaxNumberOfAssignments}
                onChange={this.handleChangeNewC2MinNumberOfAssignments}
                fullWidth={true}
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateC2}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selectedC2 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>期間の勤務にグループから割り当てる職員数の上限の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この期間の勤務にグループから割り当てる職員数の上限を削除します</DialogContentText>
              <Typography>{`${selectedC2.start_date_name}から${selectedC2.stop_date_name}までの${this.props.kinmus.find(kinmu => kinmu.id === selectedC2.kinmu_id)!.name}に${this.props.groups.find(group => group.id === selectedC2.group_id)!.name}から${selectedC2.max_number_of_assignments}人以下の職員を割り当てる`}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteC2}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    c2: state.present.c2,
    groups: state.present.groups,
    kinmus: state.present.kinmus,
  }
}

export default connect(mapStateToProps)(C2)
