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

type Props = {
  dispatch: Dispatch
  c1: c1.C1[]
  kinmus: kinmus.Kinmu[]
  groups: groups.Group[]
}

type State = {
  open: boolean
  start_date_name: string
  stop_date_name: string
  kinmu_index: number
  group_index: number
  min_number_of_assignments: number
}

class C1 extends React.Component<Props, State> {
  public state: State = {
    group_index: 0,
    kinmu_index: 0,
    min_number_of_assignments: 0,
    open: false,
    start_date_name: '',
    stop_date_name: '',
  }
  public handleChangeC1StartDateName(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c1.updateC1StartDateName(index, event.target.value))
    }
  }
  public handleChangeC1StopDateName(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c1.updateC1StopDateName(index, event.target.value))
    }
  }
  public handleChangeC1KinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c1.updateC1KinmuIndex(index, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeC1GroupIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c1.updateC1GroupIndex(index, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeC1MinNumberOfAssignments(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c1.updateC1MinNumberOfAssignments(index, parseInt(event.target.value, 10)))
    }
  }
  public handleClickDeleteC1(index: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      this.props.dispatch(c1.deleteC1(index))
    }
  }
  public handleClickOpenDialog = () => {
    const kinmu_index = this.props.kinmus.length > 0 &&
      this.props.kinmus.every(kinmu => kinmu.index !== this.state.kinmu_index) ?
      this.props.kinmus[0].index :
      this.state.kinmu_index
    const group_index = this.props.groups.length > 0 &&
      this.props.groups.every(group => group.index !== this.state.group_index) ?
      this.props.groups[0].index :
      this.state.group_index
    this.setState({
      group_index,
      kinmu_index,
      open: true,
    })
  }
  public handleCloseDialog = () => {
    this.setState({ open: false })
  }
  public handleChangeNewC1StartDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ start_date_name: event.target.value })
  }
  public handleChangeNewC1StopDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ stop_date_name: event.target.value })
  }
  public handleChangeNewC1KinmuIndex = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ kinmu_index: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC1GroupIndex = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ group_index: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC1MinNumberOfAssignments = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ min_number_of_assignments: parseInt(event.target.value, 10) })
  }
  public handleClickCreateC1 = () => {
    this.setState({ open: false })
    this.props.dispatch(c1.createC1(this.state.start_date_name, this.state.stop_date_name, this.state.kinmu_index, this.state.group_index, this.state.min_number_of_assignments))
  }
  public render() {
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}> 期間の勤務にグループから割り当てる職員数の下限</Typography>
          <Button size="small" onClick={this.handleClickOpenDialog}>追加</Button>
        </Toolbar>
        {this.props.c1.map(c => (
          <ExpansionPanel key={c.index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${c.start_date_name}から${c.stop_date_name}までの${this.props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}に${this.props.groups.find(group => group.index === c.group_index)!.name}から${c.min_number_of_assignments}人以上の職員を割り当てる`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField
                label="開始日"
                type="date"
                defaultValue={c.start_date_name}
                onChange={this.handleChangeC1StartDateName(c.index)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={c.stop_date_name}
                onChange={this.handleChangeC1StopDateName(c.index)}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_index}
                onChange={this.handleChangeC1KinmuIndex(c.index)}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                select={true}
                label="グループ"
                value={c.group_index}
                onChange={this.handleChangeC1GroupIndex(c.index)}
                fullWidth={true}
              >
                {this.props.groups.map(group => (
                  <MenuItem key={group.index} value={group.index}>{group.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="割り当て職員数下限"
                type="number"
                defaultValue={c.min_number_of_assignments}
                onChange={this.handleChangeC1MinNumberOfAssignments(c.index)}
                fullWidth={true}
              />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleClickDeleteC1(c.index)}>削除</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
        {this.props.kinmus.length === 0 || this.props.groups.length === 0 ?
          <Dialog onClose={this.handleCloseDialog} open={this.state.open} fullWidth={true} maxWidth="md">
            <DialogTitle>期間の勤務にグループから割り当てる職員数の下限を追加できません</DialogTitle>
            <DialogContent>
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
              {this.props.groups.length === 0 ? <DialogContentText>グループがありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          <Dialog onClose={this.handleCloseDialog} open={this.state.open} fullWidth={true} maxWidth="md">
            <DialogTitle>期間の勤務にグループから割り当てる職員数の下限の追加</DialogTitle>
            <DialogContent style={{ display: 'flex' }}>
              <TextField
                label="開始日"
                type="date"
                defaultValue={this.state.start_date_name}
                onChange={this.handleChangeNewC1StartDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="終了日"
                type="date"
                defaultValue={this.state.stop_date_name}
                onChange={this.handleChangeNewC1StopDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select={true}
                label="勤務"
                value={this.state.kinmu_index}
                onChange={this.handleChangeNewC1KinmuIndex}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                select={true}
                label="グループ"
                value={this.state.group_index}
                onChange={this.handleChangeNewC1GroupIndex}
                fullWidth={true}
              >
                {this.props.groups.map(group => (
                  <MenuItem key={group.index} value={group.index}>{group.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="割り当て職員数下限"
                type="number"
                defaultValue={this.state.min_number_of_assignments}
                onChange={this.handleChangeNewC1MinNumberOfAssignments}
                fullWidth={true}
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateC1}>追加</Button>
              <Button color="primary" onClick={this.handleCloseDialog}>閉じる</Button>
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
