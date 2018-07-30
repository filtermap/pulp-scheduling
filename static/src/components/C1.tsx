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
import * as c1 from '../modules/c1'
import * as groups from '../modules/groups'
import * as kinmus from '../modules/kinmus'
import * as utils from '../utils'

type Props = {
  dispatch: Dispatch
  c1: c1.C1[]
  kinmus: kinmus.Kinmu[]
  groups: groups.Group[]
}

type State = {
  creationDialogIsOpen: boolean
  newC1StartDateName: string
  newC1StopDateName: string
  newC1KinmuId: number
  newC1GroupId: number
  newC1MinNumberOfAssignments: number
  deletionDialogIsOpen: boolean
  selectedC1Id: number
}

class C1 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const todayString = utils.dateToString(new Date())
    this.state = {
      creationDialogIsOpen: false,
      deletionDialogIsOpen: false,
      newC1GroupId: this.props.groups.length > 0 ? this.props.groups[0].id : 0,
      newC1KinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
      newC1MinNumberOfAssignments: 0,
      newC1StartDateName: todayString,
      newC1StopDateName: todayString,
      selectedC1Id: this.props.c1.length > 0 ? this.props.c1[0].id : 0
    }
  }
  public handleChangeC1StartDateName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c1.updateC1StartDateName(id, event.target.value))
    }
  }
  public handleChangeC1StopDateName(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c1.updateC1StopDateName(id, event.target.value))
    }
  }
  public handleChangeC1KinmuId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c1.updateC1KinmuId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeC1GroupId(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c1.updateC1GroupId(id, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeC1MinNumberOfAssignments(id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c1.updateC1MinNumberOfAssignments(id, parseInt(event.target.value, 10)))
    }
  }

  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewC1StartDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC1StartDateName: event.target.value })
  }
  public handleChangeNewC1StopDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC1StopDateName: event.target.value })
  }
  public handleChangeNewC1KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC1KinmuId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC1GroupId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC1GroupId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC1MinNumberOfAssignments = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newC1MinNumberOfAssignments: parseInt(event.target.value, 10) })
  }
  public handleClickCreateC1 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(c1.createC1(this.state.newC1StartDateName, this.state.newC1StopDateName, this.state.newC1KinmuId, this.state.newC1GroupId, this.state.newC1MinNumberOfAssignments))
  }
  public handleClickOpenDeletionDialog(selectedC1Id: number) {
    return () => {
      this.setState({
        deletionDialogIsOpen: true,
        selectedC1Id,
      })
    }
  }
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false })
  }
  public handleClickDeleteC1 = () => {
    this.setState({ deletionDialogIsOpen: false })
    this.props.dispatch(c1.deleteC1(this.state.selectedC1Id))
  }
  public render() {
    const selectedC1 = this.props.c1.find(c => c.id === this.state.selectedC1Id)
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}> 期間の勤務にグループから割り当てる職員数の下限</Typography>
          <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
        </Toolbar>
        {this.props.c1.map(c => (
          <ExpansionPanel key={c.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${c.start_date_name}から${c.stop_date_name}までの${this.props.kinmus.find(kinmu => kinmu.id === c.kinmu_id)!.name}に${this.props.groups.find(group => group.id === c.group_id)!.name}から${c.min_number_of_assignments}人以上の職員を割り当てる`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField
                label="開始日"
                type="date"
                defaultValue={c.start_date_name}
                onChange={this.handleChangeC1StartDateName(c.id)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={c.stop_date_name}
                onChange={this.handleChangeC1StopDateName(c.id)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_id}
                onChange={this.handleChangeC1KinmuId(c.id)}
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
                onChange={this.handleChangeC1GroupId(c.id)}
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
                onChange={this.handleChangeC1MinNumberOfAssignments(c.id)}
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
              <TextField
                label="開始日"
                type="date"
                defaultValue={this.state.newC1StartDateName}
                onChange={this.handleChangeNewC1StartDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={this.state.newC1StopDateName}
                onChange={this.handleChangeNewC1StopDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={this.state.newC1KinmuId}
                onChange={this.handleChangeNewC1KinmuId}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                select={true}
                label="グループ"
                value={this.state.newC1GroupId}
                onChange={this.handleChangeNewC1GroupId}
                fullWidth={true}
              >
                {this.props.groups.map(group => (
                  <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="割り当て職員数下限"
                type="number"
                defaultValue={this.state.newC1MinNumberOfAssignments}
                onChange={this.handleChangeNewC1MinNumberOfAssignments}
                fullWidth={true}
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateC1}>追加</Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
        {selectedC1 &&
          <Dialog onClose={this.handleCloseDeletionDialog} open={this.state.deletionDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>期間の勤務にグループから割り当てる職員数の下限の削除</DialogTitle>
            <DialogContent>
              <DialogContentText>この期間の勤務にグループから割り当てる職員数の下限を削除します</DialogContentText>
              <Typography>{`${selectedC1.start_date_name}から${selectedC1.stop_date_name}までの${this.props.kinmus.find(kinmu => kinmu.id === selectedC1.kinmu_id)!.name}に${this.props.groups.find(group => group.id === selectedC1.group_id)!.name}から${selectedC1.min_number_of_assignments}人以上の職員を割り当てる`}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickDeleteC1}>削除</Button>
              <Button color="primary" onClick={this.handleCloseDeletionDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    c1: state.present.c1,
    groups: state.present.groups,
    kinmus: state.present.kinmus,
  }
}

export default connect(mapStateToProps)(C1)
