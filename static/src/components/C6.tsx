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
import * as c6 from '../modules/c6'
import * as kinmus from '../modules/kinmus'

type State = {
  open: boolean
  kinmu_index: number
  max_number_of_days: number
}

type Props = {
  dispatch: Dispatch
  c6: c6.C6[]
  kinmus: kinmus.Kinmu[]
}

class C6 extends React.Component<Props, State> {
  public state: State = {
    kinmu_index: this.props.kinmus.length > 0 ? this.props.kinmus[0].index : 0,
    max_number_of_days: 0,
    open: false,
  }
  public handleChangeC6KinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c6.updateC6KinmuIndex(index, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeC6MaxNumberOfDays(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c6.updateC6MaxNumberOfDays(index, parseInt(event.target.value, 10)))
    }
  }
  public handleClickDeleteC6(index: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      this.props.dispatch(c6.deleteC6(index))
    }
  }
  public handleClickOpenDialog = () => {
    this.setState({ open: true })
  }
  public handleCloseDialog = () => {
    this.setState({ open: false })
  }
  public handleChangeNewC6KinmuIndex = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ kinmu_index: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC6MaxNumberOfDays = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ max_number_of_days: parseInt(event.target.value, 10) })
  }
  public handleClickCreateC6 = () => {
    this.setState({ open: false })
    this.props.dispatch(c6.createC6(this.state.kinmu_index, this.state.max_number_of_days))
  }
  public render() {
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>勤務の連続日数の上限</Typography>
          <Button size="small" onClick={this.handleClickOpenDialog}>追加</Button>
        </Toolbar>
        {this.props.c6.map(c => (
          <ExpansionPanel key={c.index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${this.props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}の連続日数を${c.max_number_of_days}日以下にする`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_index}
                onChange={this.handleChangeC6KinmuIndex(c.index)}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="連続日数上限"
                type="number"
                defaultValue={c.max_number_of_days}
                onChange={this.handleChangeC6MaxNumberOfDays(c.index)}
                fullWidth={true}
              />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleClickDeleteC6(c.index)}>削除</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
        {this.props.kinmus.length === 0 ?
          <Dialog onClose={this.handleCloseDialog} open={this.state.open} fullWidth={true} maxWidth="md">
            <DialogTitle>勤務の連続日数の上限を追加できません</DialogTitle>
            <DialogContent>
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          <Dialog onClose={this.handleCloseDialog} open={this.state.open} fullWidth={true} maxWidth="md">
            <DialogTitle>勤務の連続日数の上限の追加</DialogTitle>
            <DialogContent style={{ display: 'flex' }}>
              <TextField
                select={true}
                label="勤務"
                value={this.state.kinmu_index}
                onChange={this.handleChangeNewC6KinmuIndex}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="連続日数上限"
                type="number"
                defaultValue={this.state.max_number_of_days}
                onChange={this.handleChangeNewC6MaxNumberOfDays}
                fullWidth={true}
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateC6}>追加</Button>
              <Button color="primary" onClick={this.handleCloseDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    c6: state.present.c6,
    kinmus: state.present.kinmus
  }
}

export default connect(mapStateToProps)(C6)
